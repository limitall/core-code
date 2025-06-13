# 🗄️ `@DB` Decorator — Database Integration

![Database Animation](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHQzZjlxM3Q1Z2N6dmQ1dW1vN3d2dWl3OHIxZGhrM2Q5aW4wMW4yOSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/wpoLqr5FT1sY0/giphy.gif)

*Secure, declarative, and flexible database access for your repositories and services.*

---

## Overview

The `@DB` decorator provides a robust, metadata-driven way to:
- Register repository classes and their allowed queries,
- Safely inject read/write or read-only entity repositories into your classes,
- Bind dynamic table names for cross-service reads,
- Enforce query whitelisting and prevent unauthorized operations.

It is designed for modular TypeScript/NestJS architectures, enabling both static and dynamic database access patterns with clear boundaries and runtime enforcement.

---

## ✨ How You Can Use `@DB`

### 1. **Class Decorator — Registering Allowed Queries**

```typescript
const db_queries = {
  findByEmail: "SELECT * FROM users WHERE email = $1",
  all: "SELECT * FROM users"
};

@DB({ queries: db_queries })
export class UserRepository {
  // All queries executed here must be in db_queries
}
```
**What happens:**  
- All queries must be in the allowed list (`db_queries`).
- Prevents execution of unauthorized or unexpected queries.

---

### 2. **Property Decorator — Write-Allowed Entity Repository**

```typescript
@DB({ tblname: Service.FeatureNames.USER_TABLE, asCommand: true })
db: Repository<ObjectLiteral>;
```
**What happens:**  
- Injects a writable repository for the specified table.
- Only databases with write access are used for this property.

---

### 3. **Property Decorator — Read-Only Entity Repository**

```typescript
@DB({ tblname: Service.FeatureNames.USER_TABLE })
db2: Repository<ObjectLiteral>;
```
**What happens:**  
- Injects a repository for the specified table, **read-only**.
- Any write attempts will fail or be blocked at runtime.

---

### 4. **Method Returning Table Name — Dynamic Read-Only Table Access**

```typescript
async db3() {
  return 'OTHER_SERVICE_SRV_Other_Table';
}
```
**What happens:**  
- Returns the table name of another service for read-only access.
- Useful for cross-service, read-safe data fetches.

---

### 5. **Method Decorator — Whitelisted Query Execution**

```typescript
@DB({ tblname: Service.FeatureNames.USER_TABLE })
async query_all(): Promise<typeof db_queries[keyof typeof db_queries]> {
  return db_queries.all;
}
```
**What happens:**  
- Allows this method to execute a query only if it is present in the allowed list.
- All queries are validated at runtime against the whitelist.

---

## 🧑‍💻 Realistic Example: Repository Pattern in Action

Suppose you have a user repository handling user creation and event writing:

```typescript
const db_queries = {
  create: "INSERT INTO users (email, ...) VALUES ($1, ...)",
  findByEmail: "SELECT * FROM users WHERE email = $1",
  all: "SELECT * FROM users"
};

@DB({ queries: db_queries })
export class UserRepository {
  @DB({ tblname: Service.FeatureNames.USER_TABLE, asCommand: true })
  db: Repository<ObjectLiteral>;

  @DB({ tblname: Service.FeatureNames.USER_TABLE })
  db2: Repository<ObjectLiteral>;

  @DB({ tblname: Service.FeatureNames.USER_TABLE })
  async query_all() {
    return db_queries.all;
  }

  async createUser(user: UserAggregate) {
    try {
      const newUser = this.db.create(user.serialize());
      const result = await this.db.save(newUser);
      if (result === newUser) {
        // ...commit events, append to event store, save snapshot...
      }
    } catch (error) {
      if (error.code === '23505') {
        throw CreateUserException.because(`User with email '${user.email.value}' already exists.`);
      }
      throw CreateUserException.because(error.message);
    }
  }
}
```

- `db` is injected for **writes** (e.g., `save`, `create`).
- `db2` is **read-only** (all writes are blocked).
- `query_all()` is an allowed query (whitelisted).

---

## 📋 Enforcement & Security

- **Query Whitelisting:**  
  Only queries defined at class level (via `{ queries }`) can be executed. Any attempt to run a non-listed query will fail.

- **Write vs Read-Only:**  
  `asCommand: true` allows writes. Omitting it means read-only—any write will throw or be blocked.

- **Dynamic Table Access:**  
  Returning a table name from a method allows flexible, read-only cross-service access.

- **Central Registry:**  
  All decorated classes are collected in a global registry for introspection, migration, and tooling.

---

## 💡 Required Naming Convention

- **Table/Entity names** must be registered in your module and follow this format:  
  `SERVICE_SRV_Table_Name`  
  Example:  
  - `USER_SRV_User`
  - `APPOINTMENT_SRV_Appointment_Slot`

---

## 📝 Best Practices

- Always register queries at the class level for strict whitelisting.
- Decorate properties for explicit read/write or read-only access.
- Use method-level decorators to guarantee only allowed queries are executed.
- Use clear, service-prefixed table/entity names for easy management and security.
- Use the registry for migrations, schema validation, and diagnostics.

---

## 🧠 Advanced Tips

- Extend the decorator to support auditing, logging, or permission checks.
- Use attached metadata for advanced reflection or documentation generation.
- Automate schema migrations or query checks using the registry.

---