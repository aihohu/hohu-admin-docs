---
title: Multi-tenancy
description: Understand HoHu tenant modes, tenant provisioning, account ownership, capability grants and data isolation.
---

# Multi-tenancy

`TENANT_MODE=single` uses the default tenant. For multiple business tenants, set `TENANT_MODE=hosted` and `TENANT_HOSTED_LOGIN_ENABLED=true`; production hosted deployments also require the exact full `RELEASE_BUILD_SHA`. Ensure these values reach the backend process, restart and verify; arbitrary new `.env` keys are not necessarily forwarded automatically.

## Provision a tenant

1. Sign in to the default tenant with an enabled system super-administrator role and open tenant management.
2. Create a tenant with a clear tenant code. Account names do not grant this authority.
3. Bootstrap its administrator, roles, menus, settings and required AI bindings, then activate it. An uninitialized tenant cannot be activated.
4. Sign in through its tenant code or configured host suffix and verify isolation with an ordinary account.

API creation and bootstrap each require a stable `Idempotency-Key`. Retry the original failed step rather than creating another request with a new key. Bootstrap uses fixed defaults, not editable grants copied from the default tenant. New tenants enable file parsing by default; existing explicit disables are preserved.

## Disabling and boundaries

Disabling retains data. Reactivation does not reset passwords or roles, and does not revive old tokens. Turning off global hosted login rejects business-tenant runtime access while allowing default-tenant maintenance.

System administration requires reason, ticket and correlation information with auditing. Provider/model catalog maintenance uses a separate identity and does not replace ordinary tenant-management sessions.

Tenant administrators remain within their tenant. Hosted Marketplace/Lowcode, cross-tenant memberships, online tenant switching, BYOK and PostgreSQL RLS isolation are not available. The main application does not register marketplace routes either; historical plugin-installation designs are not current deployment instructions.

Implementation constraints and rationale remain in backend ADR-0003. See [Source code](../src).
