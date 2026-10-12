---
title: HoHu AI first setup and operations
description: Configure models, tenant grants, assistants and business permissions, verify ordinary-user access, and reference file parsing, process modes and management APIs.
---

# AI configuration and operations

After [CLI deployment](../deploy) or development initialization, configure application AI here. Coding assistant model settings are separate from HoHu. AI is enabled by default, but models, assistant bindings and business permissions must each be available.

## First setup {#first-setup}

### 1. Prepare an account and model connection

Sign in to the default tenant with an enabled system super-administrator role. Global models, assistants and tenant model grants use this ordinary login session. Account names grant no authority; business tenant administrators cannot manage global configuration.

Prepare a Provider code, API Key, actual model name and Base URL. Official OpenAI, Anthropic and DeepSeek API origins are included in the egress allowlist. For other endpoints, the deployer sets exact `AI_PROVIDER_EGRESS_ALLOWED_ORIGINS` in the backend `.env`, without `/v1`; private endpoints also require explicit `AI_PROVIDER_EGRESS_ALLOWED_CIDRS`. Restart the backend after changing deployment settings.

**Complete when:** management is accessible and the destination passes egress policy. Policy approval does not prove model connectivity.

### 2. Create and test a model configuration

1. Open **AI Management → Model Management**, click **Add** and enter the Provider code, name, API Key and Base URL. For example, code `deepseek` and name `DeepSeek`; use the service's actual supported model and endpoint.
2. Click **Add Model** in the drawer, enter the model name and include `text` for text chat.
3. Click **Test Model** in the model form. It tests current Provider and model fields without saving. A new Provider requires an API Key; an empty key when editing reuses the stored credential. A real request may incur charges.
4. For a new configuration, click **Add to model list**, then **Create configuration**. When editing an existing configuration, **Save model** saves model changes independently.

**Complete when:** the test passes, and enabled Provider and model configuration is saved. Enabled status or allowed egress does not replace a connection test.

### 3. Authorize the target tenant

1. Open **Tenants** and click **Authorize** in the target tenant's **AI access** column.
2. Enable **Allow use** for required models and choose one authorized, available **Tenant default**.
3. Click **Save changes**. The default tenant (ID `0`) also requires this grant without repeated initialization; business tenants must be initialized first.

**Complete when:** the target tenant has authorized models and an available default. Enabling a global model does not authorize tenants automatically.

### 4. Enable assistants and grant role access

The system super-administrator enables required assistants in **AI Management → AI Agent Management**. An authorized role administrator configures:

| Condition           | Check                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Chat entry          | AI Chat menu and `ai:chat:use`                                                                   |
| Assistant binding   | Bind the assistant through role AI assistant authorization; requires `system:role:ai-agent-auth` |
| Business operations | Tool feature permissions, such as `system:user:list` for user queries                            |
| Data scope          | Objects, departments and tenant scope the user may operate                                       |

See [Published assistants](../ai/index#application). Enabling an assistant does not bind it to all roles. A super-administrator role is not a universal AI bypass.

**Complete when:** the test role has entry access, an assistant binding and required business permissions.

### 5. Verify as an ordinary user

Sign in again as the test user and inspect AI Chat model and assistant options. Run an authorized read-only query, then test confirmed actions as needed. Inspect actual tool results and the business page.

Also verify unauthorized requests are denied, rejected confirmations do not write, and revoked access cannot expose historical results. Test tenant isolation in multi-tenant instances. See [Application AI assistant](../user/ai) for operating steps.

**Complete when:** an ordinary user completes a real model query, authorized actions work and unauthorized ones do not. Without a real request, application AI usage remains unverified.

## Model form reference {#model-fields}

| Item                   | Behavior                                                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API Key                | Lists only show configured status; leave empty when editing to preserve the key                                                                           |
| Model API URL          | Under **Advanced settings**; empty uses the Provider address                                                                                              |
| Generation             | Per-model `config.generation`; `max_tokens` controls output and `temperature` sampling; empty values do not force parameters, and support varies by model |
| Image understanding    | Requires actual Provider/model `vision` support and tenant authorization; a capability label alone does not prove it works                                |
| Save model             | Saves independently for existing configurations; cancelling the outer drawer does not undo saved model changes                                            |
| Provider egress status | Reflects the saved address; save changes before inspecting the recalculated status                                                                        |

Finish or cancel model editing before saving the Provider. Do not configure removed global generation settings. After upgrading, refresh or sign in again if entries are missing; check the enabled role belongs to the default system scope.

## Authorize multiple models {#model-access}

The drawer lists provider, model, allowed use, tenant default and configuration status. Search by name or filter by provider and authorization. Filters only affect display; changes in hidden rows are retained. Closing or reloading asks for confirmation before discarding unsaved changes.

- A tenant can authorize multiple models. Batch saving with any authorization requires one available default. Revoking the default requires choosing a replacement. Removing all authorization requires confirmation and leaves the tenant with no authorized AI chat model.
- Disabled providers, disabled models and missing text capability are explained in the list and block new authorization. Existing grants can be retained or revoked. Choose another available default when the previous one becomes unavailable.
- **Enabled** describes configuration, not successful upstream connectivity. Actual requests also depend on egress policy, credentials and provider availability.
- Model daily quotas are not yet enforced at runtime, so the authorization page temporarily hides quota editing. Saving authorization preserves existing quota values.
- The tenant default applies when a request does not explicitly select a model. An Agent's preferred model still requires authorization for the current tenant.

## File parsing policy {#file-parsing}

`file.parse` returns structure, row counts and limited previews, not full-document retrieval or every row in the model context. It requires:

1. Enabled `shared` (Shared tools) assistant, bound to the user's role.
2. `ai:chat:use`, `ai:file:parse` and relevant upload permissions.
3. `file.parse` in the current tenant's effective `ai:enabled_tools` JSON array.
4. Files meeting Web input, server allowlists and upload/parser budgets.

Tool metadata defaults to disabled. Fresh installations and new business tenant initialization write an enabled policy to `sys_setting`; upgrades preserve existing policies. Check the target tenant's effective setting instead of assuming every instance enables it. The general settings page currently does not edit AI tool policy. Missing policies require maintainer review through the target version's migration and controlled configuration process, not reserved keys created as custom parameters.

The current Web data-file input accepts CSV, XLSX, Markdown and JSON. PNG/JPEG images use model image understanding. Additional backend text parsing does not mean Web supports TXT, PDF or Word. See [Files and uploads](../user/files) and [Upload policies](../reference/settings).

## Process mode {#runtime}

| Mode                        | Constraint                                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `AI_HITL_MODE=memory`       | Default, one API worker; keep `AI_REQUIRE_SINGLE_WORKER=true`                                                   |
| `AI_HITL_MODE=redis_pubsub` | Cross-worker notification depends on Redis; verify confirmation, disconnect, expiry and recovery before scaling |

Values must reach the process environment, not merely an unforwarded `.env` entry. APP_ROLE separates API and scheduler responsibilities. Replicas also require shared persistent files and suitable database/Redis capacity. Nginx must not expose private directories statically.

Provider calls enforce allowlists, DNS/IP checks, timeouts, response size, concurrency and retries. See [Configuration](../reference/configuration) for ownership and names. Upload and parser budgets are separate; see [Upload policies](../reference/settings).

## Diagnosis and emergency disable {#troubleshooting}

| Symptom                                  | Check in order                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| No AI entry or assistant                 | AI Chat menu, `ai:chat:use`, assistant enabled status, role bindings and effective tool permissions    |
| Enabled model missing from chat          | Current tenant authorization, `text` capability, model/Provider status, egress policy and connectivity |
| Preferred assistant model unavailable    | Model existence and tenant authorization; use default selection if appropriate                         |
| Uploaded file cannot parse               | `shared` binding, `ai:file:parse`, tenant `ai:enabled_tools`, format and budgets                       |
| Confirmation timeout or recovery failure | Process mode, actual API workers and Redis; inspect results before retrying an uncertain action        |
| AI availability cannot load              | HTTP status, response error codes from `/ai/chat/models` and `/ai/agents`, and backend logs            |
| Historical results denied                | Current permissions, tenant status and object visibility; retain authorization checks                  |

Upgrades may grant the default tenant access to models present at migration time; new models still require explicit grants. Do not disable egress checks or confirmation for diagnosis.

To stop AI in an emergency, pass `AI_MODULE_ENABLED=false` to the process and restart. AI business components stop initializing, and `/ai/**` plus `/platform/ai/**` return 503 / `AI_MODULE_DISABLED`. Verify non-AI features, fix the cause and then restore service. This is a deployment circuit breaker, not ordinary role authorization.

## Management API and CLI reference {#management-api}

Direct API calls use the same system administrator's ordinary Bearer access token. Provider and model endpoints are under `/platform/ai/providers`. The unified form test is `POST /platform/ai/providers/test` with optional string `providerId`, `providerCode`, optional `apiKey`, `baseUrl`, `config` and `model` (model creation fields). It returns `data.status=ok` without saving configuration or returning upstream content or credentials. The existing `POST /platform/ai/providers/{providerId}/test` remains compatible for testing saved IDs. Tenant authorization uses `PUT /platform/tenants/{tenantId}/ai/model-policies/{modelId}` with a body such as `{"enabled":true,"isDefault":true}`. The `/platform` compatibility path does not require another login. Management requests also require `X-Platform-Reason`, `X-Platform-Ticket` and `X-Correlation-ID` audit headers; the UI supplies them automatically.

The form test returns `AI_PROVIDER_TEST_KEY_REQUIRED` if no credential is available and `AI_PROVIDER_URL_FORBIDDEN` if an outbound destination is disallowed. A failed test does not save the form, and successful responses contain neither credentials nor upstream content.

For command-line configuration, set the ordinary system administrator access token in the current session's `HOHU_SYSTEM_ACCESS_TOKEN`, then run `uv run python -m tools.ops.platform_ai --help`. The old `HOHU_PLATFORM_ACCESS_TOKEN` and independent platform tokens cannot access these endpoints. Keep credentials and temporary files containing keys in local private directories, outside Git.

### Batch model authorization

The UI reads `models` and `revision` from `GET /platform/tenants/{tenantId}/ai/model-policies/catalog`, then sends `{revision, policies}` to `PUT /platform/tenants/{tenantId}/ai/model-policies`. Include every catalog model in `policies`, using string `modelId`, `enabled`, `isDefault` and `dailyQuotaPerUser` (a positive integer or `null`). A request accepts up to 10000 items and saves all changes in one transaction; any failure rolls them all back. Changes to the catalog or authorization return `PLATFORM_TENANT_MODEL_POLICIES_STALE`; reload before editing again. Failed saves retain the draft. The existing single-model endpoint remains supported.
