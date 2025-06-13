# `@GrpcServer` Decorator

## Overview

The `@GrpcServer` decorator is a custom property (or method) decorator that automates the setup and initialization of a gRPC microservice within a NestJS application. It encapsulates configuration, server instantiation, error filtering, and developer feedback (via metadata), streamlining the process of exposing gRPC endpoints from your NestJS modules.

---

## Purpose

- **Automates gRPC Server Bootstrapping:** Handles configuration, startup logic, and reflection out-of-the-box.
- **Metadata Communication:** Uses `SetMetadata` to attach status or error messages for diagnostics and tooling.
- **Highly Configurable:** Allows dynamic configuration via environment variables and explicit parameters.

---

## Decorator Signature

```typescript
@GrpcServer({
  srvName: string,       // Service name (used for env lookups, proto path, gRPC package)
  srvModule: Function,   // NestJS module to bootstrap for the microservice
  options?: object       // (Optional) Additional NestJS microservice options
})
```

---

## Example Usage

Below is a sample class and bootstrap function demonstrating how to use `@GrpcServer`. The service name, module, and other values are placeholders—replace them with your own implementations.

```typescript
import { Logger } from '@nestjs/common';
import { GrpcServer } from '@your-lib/core/decorators';
import { GetMetadata } from '@your-lib/core/common';
import { MyService } from '@your-lib/services';
import { AppModule } from './app.module';

export class GrpcApp {
  constructor() {}

  @GrpcServer({ srvName: MyService.SrvNames.MY_SRV, srvModule: AppModule })
  static appServer(): any { }
}

async function bootstrap() {
  (await GrpcApp.appServer()).listen().then(() => {
    Logger.log(GetMetadata(GrpcApp, "GrpcServer", 'appServer'));
  });
}
bootstrap();
```

> **Note:**  
> - Replace `MyService`, `MY_SRV`, and `AppModule` with your own service/module references.
> - The `GrpcApp` class is a usage example; you can use any class name.

---

## What Happens Under the Hood

1. **Environment Variable Loading:**  
   Loads `.env` variables for dynamic configuration.

2. **Parameter Validation:**  
   - Ensures `params` is a valid object.
   - Checks that `srvName` is a string.
   - Verifies `srvModule` is a function (the NestJS module class).
   - On failure, sets error metadata and stops.

3. **Configuration Setup:**  
   - Determines host, port, and proto base from environment variables (`${srvName}_HOST`, etc.) or defaults.
   - Builds the proto file path automatically.

4. **gRPC Microservice Creation:**  
   - Calls `NestFactory.createMicroservice` with gRPC transport and options.
   - Enables reflection for enhanced tooling (`ReflectionService`).
   - Applies a custom global RPC exception filter.

5. **User-Friendly Status:**  
   - If binding to `0.0.0.0`, discovers all local IPv4 addresses for clearer status.
   - Builds a formatted status message and sets it as metadata.

6. **Decorator Behavior:**  
   - If decorating a method, wraps it to return the microservice instance.
   - If decorating a property, assigns the instance directly to the property.
  
7. **Status Reporting:**  
   - Constructs a status message indicating server start details, with formatting and coloring via `colors`.
   - Sets this status as metadata on the target.

---

## Error Handling

- **Invalid Parameters:**  
  Records a descriptive error in metadata and aborts setup.
- **Server Startup Issues:**  
  Any uncaught exceptions in the decorated method or property initializer will propagate.

---

## Reflection & Exception Handling

- **gRPC Reflection:**  
  Automatically enabled for improved introspection and tooling support.
- **Global Exception Filter:**  
  All RPC exceptions are handled by a custom filter for consistent error responses.

---

## Metadata

The decorator uses `SetMetadata` to attach status or error messages to the decorated property or method. This metadata can be retrieved at runtime (as shown in the usage example) for logging, diagnostics, or integration with external systems.

---