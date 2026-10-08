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

1. Official API origins for OpenAI, Anthropic and DeepSeek are included in the built-in egress allowlist. For other providers or compatible API endpoints, set `AI_PROVIDER_EGRESS_ALLOWED_ORIGINS` in the backend `.env` to the provider's exact origin, without `/v1`. Private endpoints also require explicit `AI_PROVIDER_EGRESS_ALLOWED_CIDRS`. Restart the backend after changing these settings.
2. Open **AI Management → Model Manage**, click **Add**, and enter the provider code, name, API Key and Base URL. For example, use code `deepseek` and name `DeepSeek`; use your provider's actual model names and compatible API endpoint. Click **Create configuration** to save. The list only shows whether a credential is configured. Leave API Key empty when editing to retain the existing key.
3. Click **Add Model** in the configuration drawer and enter the actual model name and capabilities (include `text` for text chat). The initially collapsed **Advanced settings** section contains the API URL, generation parameters and sort order. An empty API URL uses the Provider address; empty generation parameters use model defaults. For a new configuration, click **Add to model list**, then **Create configuration**. For an existing configuration, **Save model** saves independently; cancelling the outer drawer does not undo saved model changes. Finish or cancel model editing before saving the configuration. The Provider egress status appears in the edit drawer. Save Provider changes before reading the refreshed status. When adding or editing a model, the same **Test Model** button appears to the left of the form's cancel button. It tests the current Provider and model form without saving either configuration. Enter an API Key for a new Provider; a blank API Key when editing reuses the saved credential. A test sends a real request and may incur charges. An allowed egress status only confirms that the saved destination passed the policy check; test the current form separately.
4. Open **Tenants** and click **Authorize** in the target tenant's **AI access** column. In the drawer, enable **Allow use** for the required models, select one authorized and available **Tenant default**, then click **Save changes** to save them together. A new installation using the default tenant must also complete this step in the **Default tenant** row (ID `0`). The default tenant supports AI authorization without being initialized again. Business tenants must complete initialization first. Enabling a global model does not automatically authorize tenants.
5. Enable the required assistant in **AI Management → AI Agent Management**. Grant the role the AI conversation page, `ai:chat:use` and the assistant binding. After signing in again, an ordinary user should be able to select the model and assistant and complete a real query.

If Model Manage is missing after upgrading, refresh or sign out and in to reload user information and dynamic menus. Check that the current role is enabled and belongs to the default system scope.

Direct API calls use the same system administrator's ordinary Bearer access token. Provider and model endpoints are under `/platform/ai/providers`. The unified form test is `POST /platform/ai/providers/test` with optional string `providerId`, `providerCode`, optional `apiKey`, `baseUrl`, `config` and `model` (model creation fields). It returns `data.status=ok` without saving configuration or returning upstream content or credentials. The existing `POST /platform/ai/providers/{providerId}/test` remains compatible for testing saved IDs. Tenant authorization uses `PUT /platform/tenants/{tenantId}/ai/model-policies/{modelId}` with a body such as `{"enabled":true,"isDefault":true}`. The `/platform` compatibility path does not require another login. Management requests also require `X-Platform-Reason`, `X-Platform-Ticket` and `X-Correlation-ID` audit headers; the UI supplies them automatically.

The form test returns `AI_PROVIDER_TEST_KEY_REQUIRED` if no credential is available and `AI_PROVIDER_URL_FORBIDDEN` if an outbound destination is disallowed. A failed test does not save the form, and successful responses contain neither credentials nor upstream content.

For command-line configuration, set the ordinary system administrator access token in the current session's `HOHU_SYSTEM_ACCESS_TOKEN`, then run `uv run python -m tools.ops.platform_ai --help`. The old `HOHU_PLATFORM_ACCESS_TOKEN` and independent platform tokens cannot access these endpoints. Keep credentials and temporary files containing keys in local private directories, outside Git.

## Authorize multiple models

The drawer lists provider, model, allowed use, tenant default and configuration status. Search by name or filter by provider and authorization. Filters only affect display; changes in hidden rows are retained. Closing or reloading asks for confirmation before discarding unsaved changes.

- A tenant can authorize multiple models. Batch saving with any authorization requires one available default. Revoking the default requires choosing a replacement. Removing all authorization requires confirmation and leaves the tenant with no authorized AI chat model.
- Disabled providers, disabled models and missing text capability are explained in the list and block new authorization. Existing grants can be retained or revoked. Choose another available default when the previous one becomes unavailable.
- **Enabled** describes configuration, not successful upstream connectivity. Actual requests also depend on egress policy, credentials and provider availability.
- Model daily quotas are not yet enforced at runtime, so the authorization page temporarily hides quota editing. Saving authorization preserves existing quota values.
- The tenant default applies when a request does not explicitly select a model. An Agent's preferred model still requires authorization for the current tenant.

The UI reads `models` and `revision` from `GET /platform/tenants/{tenantId}/ai/model-policies/catalog`, then sends `{revision, policies}` to `PUT /platform/tenants/{tenantId}/ai/model-policies`. Include every catalog model in `policies`, using string `modelId`, `enabled`, `isDefault` and `dailyQuotaPerUser` (a positive integer or `null`). A request accepts up to 10000 items and saves all changes in one transaction; any failure rolls them all back. Changes to the catalog or authorization return `PLATFORM_TENANT_MODEL_POLICIES_STALE`; reload before editing again. Failed saves retain the draft. The existing single-model endpoint remains supported.

## Process mode

| Mode                        | Constraint                                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `AI_HITL_MODE=memory`       | Default, one API worker; keep `AI_REQUIRE_SINGLE_WORKER=true`                                                   |
| `AI_HITL_MODE=redis_pubsub` | Cross-worker notification depends on Redis; verify confirmation, disconnect, expiry and recovery before scaling |

Values must reach the process environment, not merely an unforwarded `.env` entry. APP_ROLE separates API and scheduler responsibilities. Replicas also require shared persistent files and suitable database/Redis capacity. Nginx must not expose private directories statically.

Provider calls enforce allowlists, DNS/IP checks, timeouts, response size, concurrency and retries. See [Configuration](../reference/configuration) for ownership and names. Upload and parser budgets are separate; see [Upload policies](../reference/settings).

## Diagnosis and emergency disable

For missing assistants, check entry permission, role bindings and tools. For missing models, check tenant policies and model status. For confirmation timeouts, inspect mode, worker count and Redis.

If Model Manage contains an enabled model but the assistant displays **No chat-safe model is currently available**, first check that the current tenant's **AI access** policy allows the model. Then check its `text` capability, enabled model and Provider status, and egress policy. Upgrades may have authorized models that already existed for the default tenant; newly added models still require explicit authorization.

If an Agent has a preferred model, confirm that the model still exists and the current tenant is authorized to use it. Select the default option to use the common selector with the tenant's authorized models. For **AI availability could not be loaded. Please try again later.**, inspect the HTTP status and response error code from `/ai/chat/models` and `/ai/agents`, together with backend logs.

Pass `AI_MODULE_ENABLED=false` to the process and restart. AI business components stop initializing, and `/ai/**` plus `/platform/ai/**` return 503 / `AI_MODULE_DISABLED`. Verify non-AI features, resolve the cause and then restore service. This is a deployment circuit breaker, not ordinary role authorization.

The model configuration CLI is `tools/ops/platform_ai.py` in the [backend repository](https://github.com/aihohu/hohu-admin). It uses the ordinary system administrator session and adds reason, ticket and correlation audit information.
