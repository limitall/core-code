# `@Adit` Decorator

## Overview

The `@Adit` decorator is a versatile and extensible class decorator designed to centralize and automate the registration of service modules, event classes, repositories, command/query handlers, and related constructs in a modular application architecture. It enables clear, declarative service infrastructure and wiring, especially within DDD (Domain-Driven Design) or CQRS (Command Query Responsibility Segregation) patterns.

---

## Purpose

- **Centralized Registration:** Reduces repetitive boilerplate for common registration tasks (services, events, handlers, etc.).
- **Type-driven Customization:** The `type` parameter allows a single decorator to orchestrate a variety of behaviors, each associated with a specific helper.
- **Metadata for Diagnostics:** Uses `SetMetadata` to attach error/status metadata to each decorated class, supporting diagnostics and reflective tooling.
- **Service Isolation:** Each service is registered and managed under a unique `srvName`, supporting scalable multi-service applications.

---

## Decorator Signature

```typescript
@Adit({
  srvName: string,        // Unique service name (used as a key in the module store; required)
  type: string,           // Registration type (see Supported Types below; required)
  resources?: any,        // (Optional) Resource descriptors for service initialization
  options?: any           // (Optional) Additional options for the corresponding helper
})
```

### Parameters

- **srvName (string, required):**  
  Logical name of the service/module. Serves as a key for internal bookkeeping and isolation. Must be unique per service domain.

- **type (string, required):**  
  Specifies which kind of registration to perform. Maps to a specific helper function for the wiring logic (see Supported Types).

- **resources (any, optional):**  
  Used primarily for service module initialization. Can be any object describing dependencies or resource requirements for the service.

- **options (any, optional):**  
  Additional or advanced options for the selected registration type. Passed directly to the corresponding helper.

---

## Example Usages

Here are several real-world scenarios showing how to use the `@Adit` decorator in different contexts:

### 1. Service Module Initialization

```typescript
@Adit({
  srvName: 'UserService',
  type: 'SrvModuleInit',
  resources: { db: 'userDb', cache: 'userCache' },
  options: { singleton: true }
})
export class UserServiceModule {}
```

### 2. Registering an Event

```typescript
@Adit({
  srvName: 'UserService',
  type: 'RegisterEvent'
})
export class UserCreatedEvent {}
```

### 3. Registering a Repository

```typescript
@Adit({
  srvName: 'UserService',
  type: 'RegisterRepository'
})
export class UserRepository {}
```

### 4. Registering a Command Handler

```typescript
@Adit({
  srvName: 'UserService',
  type: 'RegisterCommandHandler'
})
export class CreateUserCommandHandler {}
```

### 5. Registering a Query Handler

```typescript
@Adit({
  srvName: 'UserService',
  type: 'RegisterQueryHandler'
})
export class GetUserQueryHandler {}
```

### 6. Registering a Snapshot Repository

```typescript
@Adit({
  srvName: 'UserService',
  type: 'RegisterSnapshotRepository'
})
export class UserSnapshotRepository {}
```

### 7. Registering an Event Subscriber

```typescript
@Adit({
  srvName: 'UserService',
  type: 'RegisterEventSubscriber'
})
export class UserEventSubscriber {}
```

### 8. Registering an Event Serializer

```typescript
@Adit({
  srvName: 'UserService',
  type: 'RegisterEventSerializer'
})
export class UserEventSerializer {}
```

---

## Supported Types and Their Behaviors

Each `type` value corresponds to a specific helper function, encapsulating the logic for that registration pattern. Here’s a breakdown:

| `type` value                | Helper Function                  | Description |
|-----------------------------|----------------------------------|-------------|
| `'SrvModuleInit'`           | `SrvModuleInitHelper`            | Initializes a service module with specified resources and options. Typically sets up the module context, dependencies, and lifecycle. |
| `'RegisterEvent'`           | `registerEventHelper`            | Registers an event class with the service, making it discoverable for event sourcing, handlers, or pub/sub mechanisms. |
| `'RegisterRepository'`      | `registerRepositoryHelper`       | Registers a repository class, associating it with the service's data access layer or persistence context. |
| `'RegisterCommandHandler'`  | `registerCommandHandlerHelper`   | Associates a command handler with the service, enabling CQRS command dispatching. |
| `'RegisterQueryHandler'`    | `registerQueryHandlerHelper`     | Associates a query handler for read-side/cqrs queries. |
| `'RegisterSnapshotRepository'` | `registerSnapshotRepositoryHelper` | Registers a snapshot repository, often used for event-sourced aggregates requiring periodic state snapshots. |
| `'RegisterEventSubscriber'` | `registerEventSubscriberHelper`  | Registers a class as an event subscriber, listening for published domain events. |
| `'RegisterEventSerializer'` | `registerEventSerializerHelper`  | Registers a serializer for event classes, supporting custom serialization/deserialization. |

---

## Detailed Flow

1. **Parameter Validation**
   - Checks if `params` is a plain object (not an Array).
   - Ensures `srvName` and `type` are valid strings.
   - If validation fails, calls `SetMetadata` to record an error on the class and aborts further processing.

2. **Module Store Management**
   - Maintains an internal `ModuleStore` object keyed by `srvName`.
   - Each service has an isolated store for its dependencies, handlers, etc.
   - If a store for `srvName` doesn’t exist, it is created.

3. **Type-based Dispatch**
   - Uses a switch statement to delegate to the appropriate helper based on `type`.
   - The helper receives the target class, the service name, the store for bookkeeping, and any additional parameters (`resources`, `options`).
   - For unknown `type` values, the decorator does nothing (no error).

4. **Helper Execution**
   - Each helper function performs specific registration logic (e.g., adding the class to a registry, wiring up dependencies, etc.).
   - For example, `registerCommandHandlerHelper` might add the class to a command handler map in the service’s store.

5. **Metadata Communication**
   - Any error or status is attached using `SetMetadata`, allowing runtime inspection or diagnostics.

---

## Error Handling

- **Invalid Parameters:**  
  If `params` is not a plain object or is missing required fields, an error is attached to the class via `SetMetadata` and registration is aborted.

- **Unknown Type:**  
  If the `type` does not match any case, the decorator is a no-op (it returns silently).

- **No Exception Throwing:**  
  The decorator is designed to fail gracefully, using metadata for errors rather than throwing.

---

## Metadata Usage

The decorator uses `SetMetadata` to attach error or status objects to decorated classes.  
This enables:
- Introspection by tooling or at runtime (for diagnostics or automated documentation)
- Integration with frameworks that inspect class-level metadata

---

## Best Practices

- Use unique, descriptive `srvName` values for each logical service/module in your app.
- Keep the `type` values in sync with supported helpers—adding a new helper? Add a new `type`.
- Use the `resources` and `options` parameters to pass complex configuration to initialization helpers.
- Check for metadata errors during application startup or in custom CLI tooling for early error detection.

---

## Advanced Notes

- **Extensibility:**  
  To add new behaviors, implement a new helper and extend the switch statement in the decorator. This allows the decorator to evolve with your application architecture.

- **Isolation:**  
  By using the internal `ModuleStore` keyed by `srvName`, the decorator supports multiple isolated service domains within a single application instance.

- **CQRS/DDDFriendly:**  
  The pattern and helpers align naturally with Domain-Driven Design and CQRS, making it easy to wire up aggregates, command/query handlers, and event processing in a modular way.

---