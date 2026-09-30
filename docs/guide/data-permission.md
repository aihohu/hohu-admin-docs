---
title: Data scope
description: 'HoHu data scope: steps, scope and limitations'
---

# Data scope

Feature permissions control actions; data scope controls records within the tenant. Concrete scopes from enabled roles form a union, rather than choosing one numeric "highest role".

## Shared entry points

`app/utils/data_scope.py` provides `resolve_data_scope`, generic `get_data_scope_filters`, and `get_user_data_scope_filters` for the User model's many-to-many departments. Pass `tenant=tenant` explicitly. `get_best_scope` remains for historical audits, not new business code.

Generic `get_data_scope_filters` can return no conditions for unrestricted scope; it does not add the model's tenant predicate. This service-level query fragment assumes model, db, current_user and trusted tenant are supplied as parameters:

```python
from app.core.tenant_scope import tenant_filter
from app.utils.data_scope import get_data_scope_filters

filters = [tenant_filter(model, tenant=tenant)]
filters.extend(
    await get_data_scope_filters(db, current_user, model, tenant=tenant)
)
```

Default fields are `dept_id` and `create_by`; override them with `dept_field` and `user_field`. Use the specialized function for User's many-to-many departments.

## Choose the business policy

Decide whether records are tenant-shared, strictly owner-only or governed by role-configured scope. The [notes tutorial](./development/module) uses tenant-shared visibility; configuring a role's department scope does not automatically change that policy. Role-scoped modules must apply the resolver's result to their Service queries.

Use the resource's actual authorization fields. Department-owned models can use the generic filter above; reporter- or owner-scoped models can filter the corresponding user ID through the resolver's `accessible_user_scope`. Define whether scope follows the user's current departments or the department stored on the business record, including transfer behavior.

Reload current authority before confirmed AI execution and historical result access. The target backend provides `load_live_user_authority` in `app/modules/auth/service.py`; use the unified resolver afterwards. Old confirmations or cached user objects cannot preserve revoked access. APIs, AI previews, execution and history projections must share the same data policy.

## Constraints

- All-data and super-administrator access remain within the tenant.
- Lists, counts, details, updates, deletes and exports use the same boundary; do not fetch all records and filter in Python.
- Relationships, department trees and custom scopes also enforce tenant ownership.
- Unknown scope or absent valid grants use a restricted fallback, not unrestricted access for an empty department set.

Cover scope unions, self fallback, disabled roles, cross-tenant access and same-named departments. Migrating legacy algorithms requires scope-difference auditing, not copying numeric priority logic. See [Users and roles](./user/access) for administrator steps.
