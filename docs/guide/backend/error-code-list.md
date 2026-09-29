---
title: Common error codes
description: 'HoHu common error codes: steps, scope and limitations'
---

# Common error codes

This is a troubleshooting selection, not an exhaustive error registry. The running API defines exact HTTP statuses and fields. See [Error handling](./error-code) for response structure.

| errorCode                   | Investigation                                                       |
| --------------------------- | ------------------------------------------------------------------- |
| `INVALID_CREDENTIALS`       | Account, password and tenant resolution                             |
| `TOKEN_EXPIRED`             | Token validity and current identity; follow the authentication flow |
| `ACCOUNT_DISABLED`          | Ask an administrator to check account status                        |
| `MISSING_PERMISSION`        | Current role permissions and enabled status                         |
| `AI_CHAT_PERMISSION_DENIED` | Explicit AI entry authorization                                     |
| `AI_MODULE_DISABLED`        | AI deployment switch, 503                                           |
| `SETTINGS_CONFLICT`         | Concurrent settings revision, 409; reload and reconcile             |
| `SETTING_VALUE_INVALID`     | Field type, range and options                                       |
| `RATE_LIMIT_EXCEEDED`       | Request quota, 429; respect Retry-After                             |
| `RATE_LIMIT_UNAVAILABLE`    | Redis throttling dependency, 503                                    |

Report the code, steps, time and version without secrets or full user data. HTTP 200 alone does not establish a streamed tool operation's final business outcome.
