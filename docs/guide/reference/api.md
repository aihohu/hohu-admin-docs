---
title: API reference
description: Find instance OpenAPI documentation and review HoHu response, authentication, string ID, pagination and error conventions.
---

# API reference

The **target running instance's** OpenAPI defines exact routes, parameters, schemas and statuses. The local backend normally exposes `http://127.0.0.1:8000/docs` and `/openapi.json`; use the actual prefix behind a proxy. Deployers decide whether documentation is exposed in production.

Ordinary APIs use JWT Bearer access tokens and `{code, msg, data}` responses with success code 200. Paginated data contains records, total, current and size. Snowflake IDs are JSON strings and schema aliases expose camelCase client fields.

Confirm the target instance before supplying credentials. Swagger writes modify real data in that instance. Do not paste tokens into public sites, issues or shared screenshots. Platform maintenance and ordinary user endpoints have separate identity boundaries.

## Avoid duplicate API inventories

This site explains workflows and cross-endpoint constraints instead of maintaining a second handwritten OpenAPI. For offline reference, export a specification matching the release build from a controlled instance. Review versions and sensitive examples before publishing; never use development business data as public samples.

See [Error handling](../backend/error-code) and [Settings contracts](./settings). Unregistered source routes are not available APIs.
