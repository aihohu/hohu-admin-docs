---
title: API and button permissions
description: Add stable permission codes, backend checks, menu grants, and Web button visibility to a HoHu module.
---

# API and button permissions

Permission codes identify actions a user may perform. The backend checks requests; the frontend uses the same codes to render controls. Hidden buttons do not replace API checks. See [data scope](./data-permission) for record access.

## Integration order

| Step                       | Location                          | Action                                                  |
| -------------------------- | --------------------------------- | ------------------------------------------------------- |
| Define codes               | Module API and menu seeds         | Use stable `module:resource:action` identifiers         |
| Protect APIs               | Route decorators                  | Add `Depends(require_permissions(...))`                 |
| Register menus and buttons | `app/modules/system/menu_seed.py` | Add the page, component mapping, and button definitions |
| Synchronize and grant      | Backend and role management       | Synchronize seeds, then explicitly grant role access    |
| Control UI entries         | Vue pages                         | Use `v-permission` or `useAuth().hasAuth`               |
| Verify                     | Ordinary test accounts            | Test controls and direct HTTP requests                  |

## Backend checks

The [notes tutorial](./development/module) uses `business:note:list` and `business:note:add`. This complete query route reuses the tutorial’s model, schemas, and service:

```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import require_permissions
from app.core.base_response import PageResult, ResponseModel
from app.core.tenant import TenantContext
from app.db.session import get_db
from app.modules.auth.service import get_current_tenant_context

from app.modules.notes.schemas import NoteOut
from app.modules.notes.service import note_service

router = APIRouter(prefix="/business/notes", tags=["Notes"])


@router.get(
    "",
    response_model=ResponseModel[PageResult[NoteOut]],
    dependencies=[Depends(require_permissions("business:note:list"))],
)
async def list_notes(
    current: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    tenant: TenantContext = Depends(get_current_tenant_context),
):
    return ResponseModel.success(
        await note_service.page(db, tenant=tenant, current=current, size=size)
    )
```

Use `business:note:add` on creation and authorize each action separately. Existing user endpoints use `system:user:*`, not the legacy `sys:user:*` prefix.

## Menu synchronization and grants

After adding module menus, run in the backend directory:

```bash
uv run python -m scripts.sync_menus
```

Synchronization updates menu definitions without expanding existing role grants. An administrator grants the page and required buttons in role management. Sign out and back in with the test account to refresh permissions. See the notes tutorial for complete seeds and component mappings, and [roles and permissions](./user/roles) for administration.

## Web buttons

Use the existing directive in business pages. This template fragment uses the shared translation resources:

```vue
<NButton v-permission="'business:note:add'">
  {{ $t('common.add') }}
</NButton>
```

For script checks, import `useAuth` from `@/hooks/business/auth` and call `hasAuth('business:note:add')`. Arrays mean any listed permission is sufficient, not all; check permissions separately when combining requirements.

Ordinary business super-admin access requires an enabled `R_SUPER` role; the username `admin` is not a bypass. Tenant boundaries still apply. System-level operations have separate default-tenant administrator requirements, and AI entry points and tools require explicit grants.

## Verify

Test ordinary accounts with access, without access, and with disabled roles. Missing permissions must block direct HTTP calls as well as UI actions. Switching tenants must not expose the previous tenant's records. Authentication, action permissions, tenancy, and record scope are separate boundaries to validate.
