---
title: AI deployment
description: Configure HoHu AI models, authorization, outbound access and execution processes, and diagnose operational failures.
---

# AI deployment

Use [CLI deployment](../deploy) for installation. AI is enabled by default, but users do not automatically receive assistant, model or tool access.

## Models and authorization

1. Upgrade matching backend, Web and CLI revisions and complete migrations and idempotent initialization; do not run individual seed scripts manually.
2. Use an independent platform maintenance identity for Provider/model catalogs. The default tenant's system administrator manages tenant model policies and system Agents. These identities are not interchangeable.
3. Configure exact egress origins, required CIDRs and controlled proxy settings for the actual endpoint, then test connectivity. Investigate rejected policies instead of disabling validation.
4. Explicitly grant AI entry access, Role-Agent bindings and tool permissions, checking enabled status. Shared labels and super-administrator roles are not general AI bypasses.
5. Verify authorized conversations, files and confirmations, plus rejection of unauthorized, revoked and cross-tenant requests.

`max_tokens` controls the output token allowance and `temperature` affects sampling. Configure per-model `config.generation`; empty values do not force parameters. Provider/model support varies. Do not use removed global AI parameters.

## Connect your first model

Run these commands in the backend directory after CLI installation and database initialization, with the backend running.

1. Bootstrap the independent model operator. The command prompts for a password twice, requiring at least 12 characters with letters and digits:

   ```bash
   uv run python -m tools.ops.platform_principal create --principal-name model-operator --display-name "Model operator" --permission platform:ai:read --permission platform:ai:write
   ```

   This creates the first platform identity, not an ordinary application user. If one exists, use your existing maintenance procedure instead of creating another.

2. Open the backend `/docs` and call `POST /platform/auth/login` with `{"principalName":"model-operator","password":"your platform password"}`. Store `data.token` in the current session's `HOHU_PLATFORM_ACCESS_TOKEN` environment variable; never commit it. Platform tokens expire after 15 minutes by default.
3. Set `AI_PROVIDER_EGRESS_ALLOWED_ORIGINS` in the backend `.env` to the provider's exact origin, for example `https://api.deepseek.com`, without `/v1`. Private endpoints also require explicit `AI_PROVIDER_EGRESS_ALLOWED_CIDRS`. Restart the backend.
4. Create a local UTF-8 `provider.json` containing your key; keep it out of Git:

   ```json
   {
     "providerCode": "deepseek",
     "name": "DeepSeek",
     "apiKey": "replace with your key",
     "baseUrl": "https://api.deepseek.com",
     "isEnabled": true
   }
   ```

   ```bash
   uv run python -m tools.ops.platform_ai --base-url http://127.0.0.1:8000 --reason "Initial model setup" --ticket-id SETUP-001 --correlation-id model-setup-001 providers create --payload-file provider.json
   ```

   Record `providerId`. Create `model.json` containing `{"name":"your actual model name","capabilities":["text"],"isEnabled":true}`, then run:

   ```bash
   uv run python -m tools.ops.platform_ai --base-url http://127.0.0.1:8000 --reason "Initial model setup" --ticket-id SETUP-001 --correlation-id model-setup-002 models create --provider-id PROVIDER_ID --payload-file model.json
   ```

   Replace `PROVIDER_ID` and record the returned `modelId`. Use the model name and compatible API endpoint configured by your provider.

5. Sign in to the application as the default tenant's system administrator. In tenant management, assign the model to the target tenant and make it the default. The API is `PUT /platform/tenants/{tenantId}/ai/model-policies/{modelId}`, with `{"enabled":true,"isDefault":true}`. It requires the ordinary system-administrator token, not the platform token. The default tenant ID is `0`.
6. Enable the required assistant in Agent management. Grant the role the AI conversation page, `ai:chat:use` and the assistant binding. After signing in again, an ordinary user should be able to select the model and assistant and complete a real query.

Direct management API calls require `X-Platform-Reason`, `X-Platform-Ticket` and `X-Correlation-ID` audit headers alongside the Bearer token. The maintenance commands above add them automatically. After configuration, remove the key from local plaintext payload files and clear session tokens.

## Process mode

| Mode                        | Constraint                                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `AI_HITL_MODE=memory`       | Default, one API worker; keep `AI_REQUIRE_SINGLE_WORKER=true`                                                   |
| `AI_HITL_MODE=redis_pubsub` | Cross-worker notification depends on Redis; verify confirmation, disconnect, expiry and recovery before scaling |

Values must reach the process environment, not merely an unforwarded `.env` entry. APP_ROLE separates API and scheduler responsibilities. Replicas also require shared persistent files and suitable database/Redis capacity. Nginx must not expose private directories statically.

Provider calls enforce allowlists, DNS/IP checks, timeouts, response size, concurrency and retries. See [Configuration](../reference/configuration) for ownership and names. Upload and parser budgets are separate; see [Upload policies](../reference/settings).

## Diagnosis and emergency disable

For missing assistants, check entry permission, role bindings and tools. For missing models, check tenant policies and model status. For confirmation timeouts, inspect mode, worker count and Redis.

Pass `AI_MODULE_ENABLED=false` to the process and restart. AI business components stop initializing, and `/ai/**` plus `/platform/ai/**` return 503 / `AI_MODULE_DISABLED`. Verify non-AI features, resolve the cause and then restore service. This is a deployment circuit breaker, not ordinary role authorization.

Maintenance tools are `tools/ops/platform_principal.py` and `tools/ops/platform_ai.py` in the [backend repository](https://github.com/aihohu/hohu-admin). Use `--help` for commands supported by your revision. Maintenance requires reason, ticket, correlation and auditing; do not pass maintenance credentials through ordinary user pages.
