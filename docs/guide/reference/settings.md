---
title: Settings API and upload policies
description: Reference HoHu grouped settings, revision concurrency checks, sensitive value handling and unified upload limits.
---

# Settings API and upload policies

For UI steps see [System settings](../user/settings). This reference is for client and extension developers; instance OpenAPI defines exact field details.

## Group endpoints

Built-in settings live in tenant-scoped `sys_setting`; custom parameters live in `sys_config`. Prefixes are `/system/setting` and `/system/config`, using `{code, msg, data}` responses.

| Endpoint                      | Contract                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `GET /system/setting`         | Accessible groups; requires system:setting:list                                                                     |
| `GET /system/setting/{group}` | group, values, fields, revision, secretKeys, configuredSecrets                                                      |
| `PUT /system/setting/{group}` | Submit values and revision; requires system:setting:edit                                                            |
| `GET /system/setting/runtime` | Authenticated tenant language, branding, avatar and upload capabilities; no passwords or global security thresholds |
| `GET /system/setting/public`  | Public settings under trusted tenant resolution, not arbitrary tenant lookup                                        |

`app/modules/system/settings_catalog.py` defines types, defaults, public attributes and security limits. Arbitrary setting-key CRUD is not allowed. Groups are validated before atomic writes. Revision conflicts return 409 / `SETTINGS_CONFLICT`; invalid values use `SETTING_VALUE_INVALID`.

Secrets return empty strings, with `configuredSecrets` indicating existing values; an empty submitted password preserves its value. Settings caches are invalidated after API transaction commit; custom parameters use a separate namespace. The security group additionally requires default-tenant system-administrator authority.

## Unified upload boundaries

`effective_max_bytes = min(UPLOAD_HARD_MAX_BYTES, tenant_max, scenario_max)`.

- Default deployment ceiling: 100 MiB. Image processing ceiling: 20 MiB. User/config imports and AI text processing ceiling: 10 MiB.
- Request-body ceiling is the deployment limit plus 1 MiB and covers the entire multipart request. Excess returns 413. The CLI derives matching `UPLOAD_REQUEST_MAX_BYTES` for both proxy layers.
- Extensions intersect tenant and scenario allowlists, retaining MIME, decoding, XLSX expansion, row-count, path and ownership checks.
- `UPLOAD_EXTENSION_UNIVERSE` defines selectable extensions; clients consume `fields[].options`. New options do not overwrite existing tenant allowlists.
- General public uploads currently validate JPEG/PNG content; AI text supports csv/xlsx/txt/md/json. The option universe is not every scenario's capability list.
- Lower upload limits do not invalidate old downloads; private reads always recheck current authority.

HTTP login/registration/API throttling is separate from AI tool quotas. HTTP quota exhaustion returns 429 and Retry-After; Redis counter failure returns 503. Health checks and OPTIONS are excluded.
