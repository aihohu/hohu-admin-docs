---
title: Multi-tenancy
description: Configure HoHu hosted mode, create tenants, initialize administrators and models, activate or disable tenants, and verify isolation.
---

# Multi-tenancy

Default single mode uses only the default tenant. Hosted mode manages multiple business tenants in one deployment, with tenant-owned accounts, roles, and records. Confirm version and module support before enabling it.

## Deployment prerequisites

| Setting                          | Purpose                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------- |
| TENANT_MODE=hosted               | Enable multiple business tenants                                              |
| TENANT_HOSTED_LOGIN_ENABLED=true | Open the business-tenant login and runtime gate                               |
| RELEASE_BUILD_SHA                | Production hosted mode requires the backend build's full 40-character Git SHA |
| TENANT_HOST_SUFFIX               | Optional tenant-subdomain locator; tenant codes can be used when empty        |

Pass settings into API and related service processes. See [configuration ownership](../reference/configuration) for Compose env_file/environment precedence. Redeploy and inspect startup logs; changing the login page alone is insufficient.

Subdomain mode also needs DNS, certificates, and a proxy preserving Host. Ordinary accounts sign into their own tenant; system administration uses the default tenant.

## Provision a tenant

1. Sign into the default tenant as a system administrator with an enabled R_SUPER role and open tenant management. The admin username alone grants no authority.
2. Create a name and code. Codes use 2–32 normalized lowercase letters, digits, or hyphens; default is reserved. The prepared record cannot yet sign in.
3. Initialize it with an administrator password and an available default model. Configure a usable Provider / model first. Initialization creates the administrator, base roles, menus, settings, and AI bindings.
4. Activate after successful initialization. Sign in through the tenant code or domain, then create an ordinary role to validate business access.

Deliver the administrator password through a controlled channel. See [AI configuration](./ai) for models and quotas. New tenants do not copy editable menus or settings from the default tenant, and later default-tenant changes do not automatically overwrite them.

## API integration and retries

The management UI wraps these operations. For automation, inspect the matching OpenAPI and `src/service/api/tenant.ts`:

| Operation     | Endpoint                                      |
| ------------- | --------------------------------------------- |
| List / create | GET / POST `/platform/tenants`                |
| Initialize    | POST `/platform/tenants/{tenantId}/bootstrap` |
| Activate      | POST `/platform/tenants/{tenantId}/activate`  |
| Disable       | POST `/platform/tenants/{tenantId}/disable`   |

These tenant-management endpoints use a normal default-tenant system-administrator session plus reason, ticket, and correlation headers for auditing. Do not switch credential types solely because the path starts with platform. Other platform maintenance endpoints follow their own identity dependencies.

Creation and initialization each use a stable Idempotency-Key. Retry the same step with the original request and key. If the payload changes, establish the previous outcome before issuing another operation.

## Disable and restore access

Disabling preserves business data. Reactivation does not reset passwords or roles. Old tokens remain invalid and users must sign in again. Closing the global hosted gate blocks business-tenant operation while leaving the default tenant available for maintenance.

## Validation and current limits

Use ordinary accounts from different tenants to verify lists, counts, details, writes, and file access. Confirm that disabling rejects old sessions, reactivation requires sign-in, and new tenant grants remain within the intended scope.

Hosted Marketplace / Lowcode, cross-tenant membership, online tenant switching, BYOK, and PostgreSQL RLS isolation are not currently exposed. Every business module must maintain application-layer scope; see [data scope](../data-permission). Unregistered marketplace routes are not available features merely because historical plugin designs mention them.
