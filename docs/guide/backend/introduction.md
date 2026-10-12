---
title: Backend architecture
description: Understand HoHu API, service, model, and schema responsibilities, including transactions, responses, tenancy, and errors.
---

# Backend architecture

HoHu uses FastAPI, SQLAlchemy 2.0 async sessions, and Pydantic. Business code lives in `app/modules/<module>/`. For a complete implementation, see the [business notes tutorial](../development/module).

## Request flow

| Layer   | Responsibility                                                                                                                     | Keep elsewhere                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| API     | Validate input, authenticate, check action permissions, obtain trusted tenant context, call services, commit, and return responses | Detailed cross-module business workflows  |
| Service | Apply business rules and tenant/record scope, query or modify data, and flush when needed                                          | HTTP responses and database commits       |
| Model   | Tables, fields, relationships, indexes, and constraints                                                                            | UI formatting and authorization decisions |
| Schema  | Input validation, aliases, output fields, and serialization                                                                        | Database queries                          |

Route dependencies obtain the current user or `get_current_tenant_context` from `app/modules/auth/service.py`. Action checks use `require_permissions` from `app/core/auth.py`. Services still apply tenant and record filters; a client-supplied tenant ID cannot replace trusted context.

## Transactions and errors

Services may call `await db.flush()` to obtain generated values, but must not commit. The API calls `await db.commit()` after all business operations succeed, then returns success. Invalidate caches after the commit. Jobs and other non-HTTP callers must define their own transaction boundaries too.

Use domain exceptions from `app/core/exceptions.py` with stable error codes. Reuse the shared exception handler. Do not raise `HTTPException` in business logic or catch every error and return success. See [error handling](./error-code).

## API contract reference

| Item        | Convention                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------- |
| Success     | `{code: 200, msg, data}`, returned through `ResponseModel.success(...)`                             |
| Pagination  | `data.records`, `data.total`, `data.current`, `data.size`                                           |
| IDs         | Snowflake IDs are JSON strings; do not convert them to JavaScript Number                            |
| Field names | snake_case in Python; camelCase aliases in API schemas                                              |
| Time        | ISO 8601 UTC according to the endpoint contract; format for display in the UI                       |
| Input       | Define fields and limits; reject client control over server-managed tenant, owner, and audit fields |

Naming and ID conversion come from schema configuration and serializers, not an automatic transformation of arbitrary dictionaries. Follow the notes example for `alias_generator`, `from_attributes`, and ID serializers.

## Module registration checklist

1. Register the business router in `app/main.py`.
2. Import models in `alembic/env.py`, generate a migration, and review it.
3. Register tenant-owned tables in `app/core/tenant_inventory.py` and its tests.
4. Add pages and permissions to menu seeds, synchronize them, and grant access through an administrator.

See [repository structure](./dir) for paths, [Web pages and requests](../development/web) for frontend integration, and [debugging and validation](../development/testing) before delivery.
