---
title: Common error codes
description: Diagnose common HoHu errors across authentication, registration, mail, settings, files, AI, and tenants.
---

# Common error codes

Read [error handling](./error-code) for parsing and retries. This selection reflects current implementation, not a complete registry. Exact HTTP statuses follow the target release.

## Authentication and permissions

| errorCode             | Investigation                                                                           |
| --------------------- | --------------------------------------------------------------------------------------- |
| `INVALID_CREDENTIALS` | Check account, password, and tenant resolution                                          |
| `TOKEN_EXPIRED`       | Follow token refresh or sign-in flow                                                    |
| `ACCOUNT_DISABLED`    | Ask an administrator to check account status                                            |
| `TENANT_DISABLED`     | Check tenant state and hosted gate                                                      |
| `MISSING_PERMISSION`  | Check role permissions and enabled state                                                |
| `SYSTEM_ADMIN_ONLY`   | Verify default-tenant system-administrator authority; an admin username is insufficient |
| `TENANT_REQUIRED`     | Supply permitted tenant resolution information                                          |

## Registration, mail, and recovery

| errorCode                        | Investigation                                                             |
| -------------------------------- | ------------------------------------------------------------------------- |
| `ACCOUNT_SERVICE_DISABLED`       | Check tenant account feature switches                                     |
| `MAIL_NOT_CONFIGURED`            | Ask a system administrator to configure and test mail                     |
| `MAIL_SEND_FAILED`               | Check mail test status and SMTP connectivity without exposing credentials |
| `EMAIL_CODE_INVALID`             | Check code, purpose, identity, and expiry; request a new code if needed   |
| `EMAIL_RATE_LIMITED`             | Wait for the cooldown before requesting another code                      |
| `EMAIL_VERIFICATION_UNAVAILABLE` | Check verification dependencies such as Redis                             |
| `REGISTRATION_ROLE_INVALID`      | Ask an administrator to select a valid registration role                  |
| `REGISTRATION_CONFLICT`          | Resolve account conflicts instead of repeatedly registering               |

## Settings, files, and access protection

| errorCode                | Investigation                                            |
| ------------------------ | -------------------------------------------------------- |
| `SETTINGS_CONFLICT`      | 409; reload, reconcile changes, and use the new revision |
| `SETTING_VALUE_INVALID`  | Check field types, ranges, and options                   |
| `FILE_TYPE_NOT_ALLOWED`  | Check the scenario allowlist and actual file format      |
| `FILE_TOO_LARGE`         | Check scenario, tenant, and deployment ceilings          |
| `RATE_LIMIT_EXCEEDED`    | 429; respect Retry-After                                 |
| `RATE_LIMIT_UNAVAILABLE` | 503; check the Redis counter dependency                  |

## AI and tenant initialization

| errorCode                              | Investigation                                                           |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `AI_CHAT_PERMISSION_DENIED`            | Check explicit AI entry authorization                                   |
| `AI_MODULE_DISABLED`                   | 503; check the AI deployment switch                                     |
| `PLATFORM_TENANT_NOT_BOOTSTRAPPED`     | Complete initialization before activating the tenant                    |
| `PLATFORM_TENANT_IDEMPOTENCY_CONFLICT` | Compare the original key and payload and establish the previous outcome |
| `PLATFORM_TENANT_CODE_EXISTS`          | Check whether the tenant code is already in use                         |
| `PLATFORM_TENANT_ACTIVATION_DISABLED`  | Check hosted activation gates and deployment configuration              |

See [account and sign-in](../user/account), [settings contracts](../reference/settings), or [operations troubleshooting](../operations/monitoring). Include only redacted context in reports, without tokens, verification codes, or passwords.
