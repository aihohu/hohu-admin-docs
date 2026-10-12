---
title: Troubleshooting
description: Diagnose HoHu sign-in, registration, recovery email, access permissions, user imports, uploads, and 429 or 503 errors.
---

# Troubleshooting

Record your tenant, steps and the message shown before investigating. Menus and data scopes can differ between accounts.

## Accounts, registration and email {#account}

| Symptom                                            | First checks                                                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Password sign-in fails                             | Check site, tenant, username and password; ask an administrator to check account and tenant status     |
| Registration or recovery link missing              | Have an administrator check the current tenant's switch and deployment email availability              |
| Only personal account access after registration    | Business permissions are not granted by default; request roles and departments from an administrator   |
| No verification email                              | Check email, tenant and spam; recovery also requires a username matching a verified email              |
| Recovery says a message was sent, but none arrives | The generic message does not confirm a match; check verified recovery email and enabled account status |
| Invalid verification code                          | Use the latest code for the current tenant and purpose; do not use expired or replaced codes           |
| Email shows unverified                             | Verify it under Recovery email; an administrator entering an address does not verify it                |

See [Account and sign-in](./account) for steps. Administrator setup is covered in [Mail service](./settings#mail) and [Account self-service](./settings#account-self-service).

## Menus and data permissions {#permissions}

1. Check that the user and role are enabled and that the role is actually assigned.
2. For missing menus or buttons, check menu authorization and the specific action permission.
3. For missing records, check department membership, role data scope and the current tenant.
4. For unexpectedly broad visibility, check all enabled roles: their data scopes are combined as a union.
5. Refresh or sign in again and verify with the affected ordinary account.

Ask an administrator to make authorization changes; see [Roles and permissions](./roles). Do not share a colleague's account to test access.

## Settings, files and imports {#operations}

| Symptom                                   | What to do                                                                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Cannot save system settings               | Check edit permission and validation; reload and merge changes after a revision conflict                                            |
| Mail service or Access protection missing | These groups require system super administrator status in the default tenant                                                        |
| Custom parameter has no effect            | Check key, enabled status and whether business code reads it; see [Custom parameters](./parameters)                                 |
| Upload fails or returns 413               | Check entry-specific formats, individual size and total request size; see [File limits](./files#limits)                             |
| User import rejected or partially failed  | Review preview and execution results for fields, departments, roles and scope; see [Import instructions](./user-import-export)      |
| No AI assistants, models or tools         | Have an administrator check entry access, assistant bindings, model policy and tool authorization; see [AI setup](../operations/ai) |

## Distinguish 429 from 503 {#service-errors}

| Error                    | Meaning and action                                                                                                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 429, too many requests   | A request or verification-code operation exceeded its quota. Wait as instructed instead of repeatedly submitting; ask an administrator to review policy if normal use remains affected |
| 503, service unavailable | Access protection dependencies may be unavailable, AI may be disabled by a deployment switch, or another dependency may have failed. Record the error code and time for the deployer   |

503 does not mean too many requests. Increasing rate limits will not resolve every 503 error.

## Report a problem {#report}

Include the product version, time and timezone, page, reproduction steps, expected result, actual error code and a redacted screenshot. Do not include passwords, verification codes, tokens, full configuration files or other people's business data.

Contact your organization's administrator first. For a confirmed product issue, use Report an issue in the navigation. For problems after an upgrade, ask the deployer to check [Version compatibility](../reference/versions).
