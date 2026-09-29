---
title: Backend architecture
description: 'HoHu backend architecture: steps, scope and limitations'
---

# Backend architecture

The backend uses FastAPI, SQLAlchemy 2.0 async, Pydantic v2, PostgreSQL, Redis and Alembic. `app/main.py` registers routes, middleware and lifecycle handlers. A file's presence does not imply its API is registered.

## Layers

- API: validation, authentication/authorization, service calls, transaction commit and responses.
- Service: business logic and database access, raising domain exceptions without committing. Module singletons must not store the current user or tenant.
- Model: SQLAlchemy `Mapped[T]`, Snowflake keys, tenant relationships and database constraints.
- Schema: request/response validation, string IDs in JSON and contractual camelCase field aliases.

Authentication uses JWT Bearer. Ordinary responses follow `{code, msg, data}`, with success code 200 and optional stable `errorCode` for failures. Preserve existing time and naming contracts rather than blindly renaming arbitrary business dictionaries.

Authentication creates a trusted `TenantContext`. Services receive it explicitly, and lists, counts, details, writes, relationships and caches retain the same boundary. Department scope and super-administrator checks do not replace tenant isolation.

Alembic owns schema changes; seeds synchronize initial data. Maintainer constraints and ADRs remain in `docs/ARCHITECTURE-GUIDELINES.md` and `docs/adr/` in the [backend repository](https://github.com/aihohu/hohu-admin).
