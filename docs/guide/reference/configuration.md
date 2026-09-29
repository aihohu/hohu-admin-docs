---
title: Configuration ownership
description: Understand which HoHu options belong in environment variables, system settings, model parameters or custom business parameters.
---

# Configuration ownership

Business settings and deployment configuration have separate owners. Users should not edit environment files for every branding or upload preference change.

| Content                                             | Configuration source        | Application                                        |
| --------------------------------------------------- | --------------------------- | -------------------------------------------------- |
| Branding, account defaults, language and agreements | System settings             | Tenant values read by consumers after saving       |
| Upload preferences and formats                      | Upload settings group       | Enforced by subsequent requests                    |
| Login/registration/API per-minute quotas            | Access protection settings  | System administrators; shared Redis counters       |
| AI output tokens / temperature                      | Per-model config.generation | Empty values omit parameters; model support varies |
| Database, Redis and JWT secret                      | Deployment environment      | Passed to the process; restart after changes       |
| Storage roots, tenant mode, AI switch and topology  | Deployment environment      | Startup and security boundaries                    |
| Custom business parameters                          | Separate parameter menu     | Consumed by specific business code                 |

## Key environment variables

- `DATABASE_URL`, `SECRET_KEY`, `REDIS_HOST/PORT/PASSWORD/DB`: dependencies and authentication.
- `TENANT_MODE`, `TENANT_HOSTED_LOGIN_ENABLED`, `RELEASE_BUILD_SHA`: tenant mode and production hosted build identity.
- `UPLOAD_HARD_MAX_BYTES`: deployment file ceiling, default 100 MiB; CLI derives proxy `UPLOAD_REQUEST_MAX_BYTES`.
- `UPLOAD_DIR`, `PRIVATE_UPLOAD_DIR`, `LOCAL_FILE_STORAGE_ROOT`: public/private storage boundaries.
- `APP_ROLE`, `AI_MODULE_ENABLED`, `AI_HITL_MODE`, `AI_REQUIRE_SINGLE_WORKER`: process duties and AI mode.
- `AI_PROVIDER_EGRESS_ALLOWED_ORIGINS`, `AI_PROVIDER_EGRESS_ALLOWED_CIDRS`, `AI_PROVIDER_EGRESS_PROXY`: Provider network boundaries, alongside timeout, response-size, concurrency and retry settings with the same prefix.
- `DEFAULT_LOCALE`: deployment fallback when neither user nor tenant selects a language.

Use matching backend `app/core/config.py`, environment templates and CLI Compose templates for full definitions. Not every backend variable is automatically forwarded from deployment `.env`; inject through controlled Compose configuration where necessary and verify the process environment.

Legacy `AI_MAX_TOKENS`, `AI_TEMPERATURE`, `RATE_LIMIT_LOGIN/REGISTER/API`, `UPLOAD_MAX_SIZE` and `UPLOAD_ALLOWED_EXTENSIONS` were removed. Do not add them from old tutorials. Never put secrets in documentation, screenshots or repositories.
