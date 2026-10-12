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

## Groups and save flow

| group      | Content                                      |
| ---------- | -------------------------------------------- |
| brand      | Site branding                                |
| account    | Registration, recovery, and account defaults |
| locale     | Language preferences                         |
| files      | File and upload policies                     |
| agreements | Terms and privacy policy                     |
| security   | Global access protection                     |

1. GET the group, render controls from fields, and preserve original values keys, such as site_name rather than siteName.
2. PUT a nonempty values object containing changes and the revision returned by that read. Never generate a revision yourself.
3. Use the new values and revision on success. On 409, reload, reconcile differences, and ask the user to confirm saving.

Ordinary group revisions are opaque 64-character digests. Mail uses an independent version string; do not impose the ordinary group length rule. Never replace only the revision after a conflict to silently overwrite another person's changes.

## Unified upload boundaries

`effective_max_bytes = min(UPLOAD_HARD_MAX_BYTES, tenant_max, scenario_max)`.

- Default deployment ceiling: 100 MiB. Image processing ceiling: 20 MiB. User/config imports and AI text processing ceiling: 10 MiB.
- Request-body ceiling is the deployment limit plus 1 MiB and covers the entire multipart request. Excess returns 413. The CLI derives matching `UPLOAD_REQUEST_MAX_BYTES` for both proxy layers.
- Extensions intersect tenant and scenario allowlists, retaining MIME, decoding, XLSX expansion, row-count, path and ownership checks.
- `UPLOAD_EXTENSION_UNIVERSE` defines selectable extensions; clients consume `fields[].options`. New options do not overwrite existing tenant allowlists.
- General public uploads currently validate JPEG/PNG content; AI text supports csv/xlsx/txt/md/json. The option universe is not every scenario's capability list.
- Lower upload limits do not invalidate old downloads; private reads always recheck current authority.

HTTP login/registration/API throttling is separate from AI tool quotas. HTTP quota exhaustion returns 429 and Retry-After; Redis counter failure returns 503. Health checks and OPTIONS are excluded.

## Shared mail configuration

Mail uses the explicitly global `sys_mail_config` table and is never inherited from a tenant. Only system administrators with settings read/edit permission can access it.

- `GET /system/setting/mail` returns values, revision, configuredPassword, ready, lastTestAt and lastTestStatus. Password is always empty.
- `PUT /system/setting/mail` accepts values, revision and clearPassword. Blank passwords preserve credentials; clearing and replacing cannot be combined.
- `POST /system/setting/mail/test` accepts recipient and returns the updated projection with accepted, failed or untested status.

Mail values include enabled, host, port, security, username, password, fromEmail, and fromName; security supports TLS / STARTTLS. ready indicates configuration readiness, not network reachability. A test marked accepted means SMTP accepted it; check the recipient inbox to verify delivery.

The account group also returns mailReady and roleOptions. email_code_minutes must be an integer from 5 to 30. register_enabled and password_reset_enabled are booleans; registration_role_id is a string ID, with an empty string granting no business role.

## Account endpoints

| Endpoint                    | Contract                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| `GET /auth/capabilities`    | Optional tenantCode; registrationEnabled, passwordResetEnabled, emailEnabled, codeMinutes  |
| `POST /auth/email-code`     | tenantCode, userName, email, purpose (register/reset); expiresIn and retryAfter in seconds |
| `POST /auth/register`       | tenantCode, userName, email, code, password; string userId; administrative fields rejected |
| `POST /auth/password-reset` | Same fields; enabled account and verified email required; revokes existing sessions        |
| `GET /auth/email`           | Authenticated email, verified, enabled and codeMinutes                                     |
| `POST /auth/email/code`     | Authenticated email and current password; sends binding code                               |
| `PUT /auth/email`           | Authenticated email, current password and code; binds verified email                       |

All use the standard response envelope and login tenant resolution. Errors include ACCOUNT_SERVICE_DISABLED, MAIL_NOT_CONFIGURED, MAIL_SEND_FAILED, EMAIL_CODE_INVALID, EMAIL_RATE_LIMITED (429), EMAIL_VERIFICATION_UNAVAILABLE (503), REGISTRATION_ROLE_INVALID, REGISTRATION_CONFLICT and TENANT_REQUIRED. Recovery-code responses do not reveal account existence. Delivery happens after the response; failures log a generic event without identity or code. Users may retry after cooldown.

Redis TTL and atomic consumption bind codes to tenant, purpose, identity and security version. Password resets invalidate prior challenges and sessions. Codes are consumed before database writes; a failed write requires a fresh code rather than restoring an old one.
