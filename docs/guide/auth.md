---
title: API and button permissions
description: 'HoHu api and button permissions: steps, scope and limitations'
---

# API and button permissions

Permission codes are stable business identifiers, independent of language. Roles grant menus and buttons; the frontend controls visible entries while the backend authorizes each request.

## API integration

```python
from fastapi import Depends
from app.core.auth import require_permissions

# Declare on the business route decorator:
# dependencies=[Depends(require_permissions("system:user:list"))]
```

Codes must match the menu definitions. Current user permissions use `system:user:*`, not the older `sys:user:*` examples. Authentication, feature permission, data scope and tenant/owner checks are separate requirements.

Ordinary business super-administrator checks require an enabled `R_SUPER` role. The username `admin` does not bypass permissions. The role remains tenant-scoped. System-wide administration requires the default tenant's system authority, while AI entry and tools require explicit authorization.

## Add a button

1. Validate its permission code at the backend API.
2. Add its menu/button and stable translation key to `app/modules/system/menu_seed.py`, then synchronize through the CLI.
3. Administrators explicitly grant the role access; repeated deployments do not expand existing grants.
4. Use `v-permission` or `hasAuth` in Web to control the entry.
5. Test direct HTTP calls without permission, disabled roles and other tenants—not just hidden buttons.

For administrator steps see [Users and roles](./user/access); for record-level restrictions see [Data scope](./data-permission).
