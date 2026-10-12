---
title: API reference
description: Find HoHu OpenAPI access, production restrictions, authentication, response formats, pagination, string IDs, and endpoint boundaries.
---

# API reference

Use the **target release's** OpenAPI as the endpoint inventory. This site covers shared contracts and integration practices. Keep the admin UI, API, and CLI on a supported version combination.

## Find the specification

| Runtime                                            | Address and behavior                                                                     |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Local backend with default development environment | `http://127.0.0.1:8000/docs`, `/redoc`, `/openapi.json`                                  |
| Web / Nginx proxy                                  | Use the configured prefix; standard routing forwards browser `/api/` to the backend root |
| Backend started with `ENV=prod`                    | docs, redoc, and openapi.json are disabled; their 404 is not a service failure           |

For production integration, run the same build in a controlled environment and export its specification. Do not switch a production instance to development mode to open Swagger. Swagger writes change data in the selected instance.

## Request and response conventions

| Item                  | Contract                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Authentication        | `Authorization: Bearer <access_token>`; refresh tokens belong to the refresh flow and cannot replace access tokens |
| Ordinary JSON success | code is 200, with msg and data                                                                                     |
| Pagination            | data contains records, total, current, size; filters and sorting are endpoint-specific                             |
| IDs                   | Snowflake IDs are strings; do not convert them to JavaScript Number                                                |
| Field names           | Schema aliases expose camelCase; dictionaries such as settings values retain their defined keys                    |
| Time                  | ISO 8601 UTC; convert for display in the user's timezone                                                           |
| Failure               | HTTP status and business code, sometimes a stable errorCode; see [error handling](../backend/error-code)           |

This pagination example illustrates structure and contains no real business data:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "records": [{ "id": "123456789012345678", "name": "Example" }],
    "total": 1,
    "current": 1,
    "size": 10
  }
}
```

## Identity and special responses

Business endpoints validate the current user, tenant, and permissions. Platform maintenance has separate identity boundaries, but the `/platform/` prefix alone does not determine token type. For example, [tenant management](../operations/tenants) uses a default-tenant system-administrator session with audit headers. Follow each route's authentication dependencies.

Downloads, AI SSE, `/health`, and `/metrics` do not use the ordinary JSON envelope. `/health` returns `{"status":"ok"}` for process liveness only; `/metrics` returns Prometheus text. SSE may report tool or business failures after HTTP 200, so consume final events. Do not apply a universal JSON parser to every response.

Record HTTP status, errorCode, timestamp, and a redacted response before consulting [common error codes](../backend/error-code-list). Network or proxy HTML is not business JSON. Source routes not registered with the main application are not available endpoints.
