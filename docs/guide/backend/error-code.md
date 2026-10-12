---
title: Error handling
description: Handle HoHu API failures using HTTP statuses, stable error codes, and field errors, with safe retry and proxy handling.
---

# Error handling

Check the network and HTTP status before parsing business responses. Ordinary business errors use `{code, msg, data}` and may include a stable `errorCode`. Do not drive logic by comparing localized msg strings.

```json
{
  "code": 409,
  "msg": "Settings changed; reload before saving",
  "data": null,
  "errorCode": "SETTINGS_CONFLICT"
}
```

This illustrates structure, not an exact required server message.

## Status handling

| HTTP status | Client action                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| 400         | Correct the request using errorCode and field constraints; avoid identical resubmissions                  |
| 401         | Follow refresh or sign-in flow; disabled accounts, tenants, or revoked sessions need their cause resolved |
| 403         | Check identity, roles, and operation permissions; do not retry endlessly                                  |
| 404         | Check path, proxy prefix, resource, and release; production documentation endpoints are disabled          |
| 409         | Reload and reconcile conflicts; settings require a fresh revision                                         |
| 413         | Check file, whole-request, and proxy limits; the response may be HTML                                     |
| 422         | Display field validation errors; check types, required values, and ranges                                 |
| 429         | Respect Retry-After instead of immediately retrying                                                       |
| 500         | Preserve redacted context and check service logs; establish a write's outcome before retrying             |
| 503         | Inspect dependencies, runtime switches, and service state before retrying after recovery                  |

Proxy 502 / 504 responses, disconnections, timeouts, or non-JSON content may lack errorCode. AI SSE reports business outcomes through events; HTTP 200 alone is insufficient.

## Validation and retries

Request validation usually returns 422 with `data.fieldErrors`, whose entries contain `field` and `message`. errorCode is optional; clients must handle validation responses without it.

Reads such as GET can use bounded retries where appropriate. Retrying business writes such as creation or payment depends on that endpoint's idempotency contract. HoHu does not make every POST idempotent. See [multi-tenancy](../operations/tenants) for tenant creation and initialization Idempotency-Key rules.

## Development and reporting

Use domain exceptions from `app/core/exceptions.py` for new business errors, assign stable specific codes, and update client translations and regression coverage. Do not scatter HTTPException calls in business code or expose traces, keys, or connection strings.

Reports should include versions, steps, timestamps, HTTP status, errorCode, and redacted logs. Start with [common error codes](./error-code-list); the lookup is not a complete registry.
