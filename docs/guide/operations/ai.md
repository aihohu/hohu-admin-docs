---
title: AI deployment
description: Configure HoHu AI models, authorization, outbound access and execution processes, and diagnose operational failures.
---

# AI deployment

Use [CLI deployment](../deploy) for installation. AI is enabled by default, but users do not automatically receive assistant, model or tool access.

## Models and authorization

1. Upgrade matching backend, Web and CLI revisions and complete migrations and idempotent initialization; do not run individual seed scripts manually.
2. The default tenant system super-administrator configures Providers and models in AI Management → Model Manage, and manages system Agents and tenant model authorization through the same login session.
3. Configure exact egress origins, required CIDRs and controlled proxy settings for the actual endpoint, then test connectivity. Investigate rejected policies instead of disabling validation.
4. Explicitly grant AI entry access, Role-Agent bindings and tool permissions, checking enabled status. Shared labels and super-administrator roles are not general AI bypasses.
5. Verify authorized conversations, files and confirmations, plus rejection of unauthorized, revoked and cross-tenant requests.

`max_tokens` controls the output token allowance and `temperature` affects sampling. Configure per-model `config.generation`; empty values do not force parameters. Provider/model support varies. Do not use removed global AI parameters.

## Connect your first model

Sign in to the default tenant with an enabled system super-administrator role. Provider, model, Agent and tenant model authorization management all use this login session. Account names grant no authority, and business tenant administrators cannot change global configuration.

1. Set `AI_PROVIDER_EGRESS_ALLOWED_ORIGINS` in the backend `.env` to the provider's exact origin, for example `https://api.deepseek.com`, without `/v1`. Private endpoints also require explicit `AI_PROVIDER_EGRESS_ALLOWED_CIDRS`. Restart the backend.
2. Open **AI Management → Model Manage**, click **Add**, and enter the provider code, name, API Key and Base URL. For example, use code `deepseek` and name `DeepSeek`; use your provider's actual model names and compatible API endpoint. Click **Create configuration** to save. The list only shows whether a credential is configured. Leave API Key empty when editing to retain the existing key.
3. Click **Add Model** in the configuration drawer and enter the actual model name and capabilities (include `text` for text chat). The initially collapsed **Advanced settings** section contains the API URL, generation parameters and sort order. An empty API URL uses the Provider address; empty generation parameters use model defaults. For a new configuration, click **Add to model list**, then **Create configuration**. For an existing configuration, **Save model** saves independently; cancelling the outer drawer does not undo saved model changes. Finish or cancel model editing before saving the configuration. Save Provider changes before running **Test Connectivity** on a saved model.
4. In **Tenant Management → AI access**, assign the model to the target tenant and make it the default if needed. The default tenant ID is `0`; enabling a global model does not automatically authorize every tenant.
5. Enable the required assistant in **AI Management → AI Agent Management**. Grant the role the AI conversation page, `ai:chat:use` and the assistant binding. After signing in again, an ordinary user should be able to select the model and assistant and complete a real query.

If Model Manage is missing after upgrading, refresh or sign out and in to reload user information and dynamic menus. Check that the current role is enabled and belongs to the default system scope.

Direct API calls use the same system administrator's ordinary Bearer access token. Provider and model endpoints are under `/platform/ai/providers`; tenant authorization uses `PUT /platform/tenants/{tenantId}/ai/model-policies/{modelId}` with a body such as `{"enabled":true,"isDefault":true}`. The `/platform` compatibility path does not require another login. Management requests also require `X-Platform-Reason`, `X-Platform-Ticket` and `X-Correlation-ID` audit headers; the UI supplies them automatically.

For command-line configuration, set the ordinary system administrator access token in the current session's `HOHU_SYSTEM_ACCESS_TOKEN`, then run `uv run python -m tools.ops.platform_ai --help`. The old `HOHU_PLATFORM_ACCESS_TOKEN` and independent platform tokens cannot access these endpoints. Keep credentials and temporary files containing keys in local private directories, outside Git.

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

The model configuration CLI is `tools/ops/platform_ai.py` in the [backend repository](https://github.com/aihohu/hohu-admin). It uses the ordinary system administrator session and adds reason, ticket and correlation audit information.
