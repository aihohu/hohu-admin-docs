---
title: Configuration reference
description: Look up HoHu environment variables, configuration ownership, activation, Compose precedence, and retired settings.
---

# Configuration reference

Identify the configuration owner before editing. The matching backend `app/core/config.py` and deployment templates define the complete environment reference.

## Ownership and activation

| Content                                          | Configuration source                | Activation                                                          |
| ------------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------- |
| Branding, account defaults, language, agreements | System settings                     | Subsequent reads use saved values; open pages may need a refresh    |
| Upload formats and tenant limits                 | System settings → Files             | New uploads follow the updated policy                               |
| Login, registration, API per-minute quotas       | System settings → Access protection | System administrators configure shared Redis counters               |
| SMTP, sender, encrypted credentials              | System settings → Mail              | Global configuration; test sending after saving                     |
| AI output tokens and temperature                 | Model config.generation             | Sent per model; blank values omit parameters and support varies     |
| Database, Redis, secrets, process roles          | Deployment environment              | Recreate containers; restart source-run processes                   |
| Storage, tenant mode, AI switch                  | Deployment environment              | Establishes runtime and security boundaries at startup              |
| Custom business parameters                       | Separate parameter menu             | Read by business code, not automatically treated as system settings |

## Key environment variables

| Variable                                                                                               | Purpose and constraints                                                                                                |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `ENV`                                                                                                  | dev / test / prod; production disables built-in OpenAPI pages                                                          |
| `DATABASE_URL`                                                                                         | PostgreSQL connection; URL-encode reserved characters                                                                  |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` / `REDIS_DB`                                            | Redis connection and database number                                                                                   |
| `SECRET_KEY`                                                                                           | Source key for JWT signing and encrypted values; at least 32 characters in production; preserve with protected backups |
| `SERVER_URL`                                                                                           | Public origin; a nonempty production value requires HTTPS without business paths, queries, or credentials              |
| `APP_ROLE`                                                                                             | api / scheduler / all; CLI runs API and scheduler separately                                                           |
| `TENANT_MODE`                                                                                          | single (default) or hosted; see [multi-tenancy](../operations/tenants)                                                 |
| `TENANT_HOSTED_LOGIN_ENABLED` / `RELEASE_BUILD_SHA`                                                    | Hosted gate and production build identity; changing tenant mode alone is insufficient                                  |
| `UPLOAD_HARD_MAX_BYTES`                                                                                | Deployment file ceiling; default 104857600 (100 MiB)                                                                   |
| `UPLOAD_DIR` / `PRIVATE_UPLOAD_DIR` / `LOCAL_FILE_STORAGE_ROOT`                                        | File directories and storage boundaries; API and scheduler need the same persistent files                              |
| `AI_MODULE_ENABLED`                                                                                    | AI module switch; default true                                                                                         |
| `AI_HITL_MODE` / `AI_REQUIRE_SINGLE_WORKER`                                                            | Defaults memory / true; read [AI operations](../operations/ai) before scaling                                          |
| `AI_PROVIDER_EGRESS_ALLOWED_ORIGINS` / `AI_PROVIDER_EGRESS_ALLOWED_CIDRS` / `AI_PROVIDER_EGRESS_PROXY` | Provider egress boundaries; the same prefix includes timeouts, response size, concurrency, and retries                 |
| `DEFAULT_LOCALE`                                                                                       | Fallback without user or tenant preferences; default zh-CN                                                             |

These are **backend variables**. See [deployment configuration](../cli/configuration) for CLI image, port, and bundled-service options. Never use public client environment variables for server secrets.

## Compose precedence

API, scheduler, and migrator currently load deployment `.env` through `env_file`, but explicit service `environment` entries override matching values. Editing `.env` alone does not guarantee a changed process environment.

CLI merges base Compose, generated `docker-compose.infra.yml`, then user `docker-compose.override.yml`. User overrides load last. Override fixed template values explicitly under each affected service. External services also need scheduler connections and explicit API Redis port / database entries; see [external services](../deploy#external-services).

Redeploy and check every affected service. `hohu deploy restart` restarts existing containers without reloading container environment. Rendered Compose and container environments contain credentials; do not paste them into public logs.

## Mail and retired variables

SMTP requires no environment variables. Global mail configuration is separate from tenant registration and recovery switches; credentials are encrypted with the deployment key. See [settings contracts](./settings) for fields and concurrency.

| Removed variable                                              | Current location                                       |
| ------------------------------------------------------------- | ------------------------------------------------------ |
| `AI_MAX_TOKENS` / `AI_TEMPERATURE`                            | Model config.generation                                |
| `RATE_LIMIT_LOGIN` / `RATE_LIMIT_REGISTER` / `RATE_LIMIT_API` | System settings → Access protection                    |
| `UPLOAD_MAX_SIZE` / `UPLOAD_ALLOWED_EXTENSIONS`               | System settings → Files, within the deployment ceiling |

Do not copy retired variables from old tutorials. Key changes affect sessions and encrypted values. Plan them through [backup and recovery](../operations/upgrade); replacing a string and discarding the old key is insufficient.
