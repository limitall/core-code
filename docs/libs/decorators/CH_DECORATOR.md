# 🏛️ `@CH` Decorator — ClickHouse Integration

## Overview

The `@CH` decorator is a user-friendly, class-level decorator that simplifies ClickHouse integration in a modular TypeScript/NestJS codebase. With `@CH`, you can declaratively register ClickHouse modules, repositories, and query handlers—saving time and keeping your architecture clean and scalable.

---

## ✨ Why Use `@CH`?

- **🚀 No Boilerplate:** Register ClickHouse modules, repositories, or handlers with one line.
- **🔒 Isolated & Scalable:** Each ClickHouse integration is isolated by `srvName`—no accidental cross-talk.
- **🔎 Transparent Errors:** All config issues are attached as metadata for easy debugging.
- **🧩 Extensible:** Add new types/helpers as your ClickHouse usage grows.
- **🎬 Developer Delight:** (See animation above!) Visualize your ClickHouse wiring.

---

## 🏷️ Decorator Usage

```typescript
@CH({
  srvName: string,        // Unique ClickHouse module/service name (required)
  type: string,           // Registration type (e.g., 'InitClickHouse', 'RegisterCHRepository', etc.; required)
  resources?: any,        // (Optional) ClickHouse-specific resources (tables, configs)
  options?: any           // (Optional) Advanced options for registration
})
```

### Parameter Details

- **srvName** *(string, required)*:  
  Unique identifier for your ClickHouse integration module/service.

- **type** *(string, required)*:  
  What kind of registration is being performed? Examples: `InitClickHouse`, `RegisterCHRepository`, etc.

- **resources** *(any, optional)*:  
  Any resources needed for initialization (e.g., ClickHouse tables, connection configs).

- **options** *(any, optional)*:  
  Advanced or custom options for the registration helper.

---

## 💡 Example: How to Use

### 1. Initialize a ClickHouse Module

```typescript
@CH({
  srvName: 'AnalyticsCH',
  type: 'InitClickHouse',
  resources: { tables: ['events', 'users'] },
  options: { host: 'localhost', port: 8123 }
})
export class AnalyticsClickHouseModule {}
```

### 2. Register a ClickHouse Repository

```typescript
@CH({
  srvName: 'AnalyticsCH',
  type: 'RegisterCHRepository'
})
export class EventRepository {}
```

### 3. Register a Query Handler for ClickHouse

```typescript
@CH({
  srvName: 'AnalyticsCH',
  type: 'RegisterQueryHandler'
})
export class GetEventStatsQueryHandler {}
```

---

## 📋 Supported Types

| `type` Value                | What it Does                                       |
|-----------------------------|----------------------------------------------------|
| `InitClickHouse`            | Sets up ClickHouse connection, schemas, tables     |
| `RegisterCHRepository`      | Registers a repository for ClickHouse operations   |
| `RegisterQueryHandler`      | Registers a query handler related to ClickHouse    |
| *(add more as needed)*      | *(Extend with your own helpers/types)*             |

---

## ⚙️ How It Works

1. **Validation:**  
   Ensures parameters are well-formed; attaches errors as metadata if not.

2. **ClickHouse Store:**  
   Keeps a separate store for each `srvName` to avoid mix-ups between modules/services.

3. **Type Dispatch:**  
   Calls the right helper for your `type` (e.g., initialization, repository, handler).

4. **Error Metadata:**  
   All errors or status info are attached as metadata—never silent, always discoverable.

---

## 🛡️ Error Handling

- **Invalid Parameters:**  
  If parameters are missing or malformed, an error is attached as metadata and registration is skipped.

- **Unknown Type:**  
  If the `type` isn't recognized, nothing happens (no-op).

- **No Crashes:**  
  The decorator never throws—diagnostics are always available via metadata.

---

## 📝 Best Practices

- Use clear, unique `srvName` values for each ClickHouse module or integration.
- Extend the decorator with new helpers/types as your data infrastructure evolves.
- Inspect metadata at startup or via tooling to catch misconfigurations early.
- Leverage `resources` and `options` for flexible, maintainable setups.

---

## 🧠 Advanced Tips

- **Extensible:**  
  Easily add your own helpers and `type` values for custom ClickHouse patterns.
- **Diagnostic-Friendly:**  
  Metadata makes integration with dashboards or automation simple.

---
