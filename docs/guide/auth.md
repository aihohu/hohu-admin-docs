---
title: Permission Control
description: HoHu Admin implements fine-grained permission management from menu routes to button level using the RBAC model, including role, menu, and API endpoint permission control
---

# Permission Control

HoHu Admin uses the classic **RBAC (Role-Based Access Control)** model to implement fine-grained permission management from menu routes down to the button level.

## Permission Model

The system implements permission control through a three-layer **User > Role > Menu** relationship:

```
User ──M2M──> Role ──M2M──> Menu
                               ├── Directory (M)
                               ├── Menu (C)
                               └── Button (F) ← carries permission code
```

- **User**: Can be assigned multiple roles
- **Role**: Can be associated with multiple menu/button permissions
- **Menu**: Divided into three types — Directory (M), Page (C), and Button (F). Button types carry permission codes.

## Super Admin

The super admin bypasses all permission checks. An account automatically becomes a super admin if it:

- Has the username `admin`, **or**
- Has a role with the role code `R_SUPER`

## Backend Permission Control

### Route-Level Protection

Protect API endpoints through FastAPI dependency injection:

```python
from app.core.auth import require_permissions

# Requires specified permission to access
@router.get("/users", dependencies=[Depends(require_permissions("sys:user:list"))])
async def list_users(...):
    ...

# Super admin only
@router.delete("/users/{user_id}", dependencies=[Depends(require_permissions("sys:user:delete", super_admin_only=True))])
async def delete_user(...):
    ...
```

### Getting the Current User

All authenticated endpoints retrieve the current logged-in user through the `get_current_user` dependency:

```python
from app.modules.auth.service import get_current_user

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user
```

`get_current_user` automatically:

1. Extracts the JWT Token from the `Authorization` header
2. Decodes and verifies the Token (HS256)
3. Queries the user with eager-loaded roles and menus (`selectinload`)
4. Checks if the user is disabled

### Permission Code Naming Convention

Button-level permission codes follow a three-segment `module:resource:action` naming pattern:

```
sys:user:list       # User list
sys:user:add        # Add user
sys:user:edit       # Edit user
sys:user:delete     # Delete user
system:role:list    # Role list
system:menu:add     # Add menu
```

## Frontend Permission Control

### Dynamic Routes

The frontend supports two routing modes (configured via `VITE_AUTH_ROUTE_MODE` in `.env`):

| Mode                | Description                                                                          |
| ------------------- | ------------------------------------------------------------------------------------ |
| `dynamic` (default) | Routes are returned by the backend API and dynamically generated based on user roles |
| `static`            | Routes are generated from local file structure and filtered by `meta.roles`          |

**Dynamic mode flow:**

1. After login, the frontend calls `GET /auth/getUserRoutes`
2. The backend builds and returns the menu tree based on the user's role-associated menus
3. The frontend converts the menu tree into Vue Router routes and dynamically registers them via `router.addRoute()`
4. Super admins see all menus; regular users only see authorized menus

### Button-Level Permissions

Use the `useAuth()` hook to control button visibility in templates:

```vue
<script setup lang="ts">
import { useAuth } from '@/hooks/business/auth';

const { hasAuth } = useAuth();
</script>

<template>
  <!-- Only users with the sys:user:add permission can see the Add button -->
  <NButton v-if="hasAuth('sys:user:add')" @click="handleAdd">Add User</NButton>

  <!-- Only users with the sys:user:delete permission can see the delete confirmation -->
  <NPopconfirm v-if="hasAuth('sys:user:delete')" @positive-click="handleDelete(row.userId)">
    <template #trigger>
      <NButton type="error">Delete</NButton>
    </template>
    Are you sure you want to delete this user?
  </NPopconfirm>
</template>
```

`hasAuth()` also accepts an array — returns `true` if any permission matches:

```ts
// Returns true if the user has either the edit or view permission
hasAuth(['sys:user:edit', 'sys:user:list']);
```

### Route Guards

Navigation guards perform permission checks on every route transition:

1. **Not logged in** > accessing a protected page > redirect to login page
2. **Logged in** > accessing an unauthorized page > redirect to 403 page
3. **Logged in** > accessing the login page > redirect to home page
4. **Logged in** > accessing a non-existent route > check if the route exists in the backend (yes > 403, no > 404)

## Authentication Flow

The complete login authentication flow:

```
1. Frontend sends POST /auth/login { userName, password }
          ↓
2. Backend verifies password (bcrypt), issues JWT Token
          ↓
3. Frontend stores Token, calls GET /auth/getUserInfo
          ↓
4. Backend returns { userId, userName, roles, buttons }
          ↓
5. Frontend calls GET /auth/getUserRoutes to get dynamic routes
          ↓
6. Frontend registers routes, renders menus, page is ready
```

## Key Configuration

| Setting                       | Location        | Description                             |
| ----------------------------- | --------------- | --------------------------------------- |
| `SECRET_KEY`                  | Backend `.env`  | JWT signing secret                      |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Backend `.env`  | Token validity period (default: 7 days) |
| `VITE_AUTH_ROUTE_MODE`        | Frontend `.env` | Route mode: `dynamic` or `static`       |
| `VITE_STATIC_SUPER_ROLE`      | Frontend `.env` | Super admin role code in static mode    |

## Related Files

### Backend

- `app/core/auth.py` — `require_permissions()` permission dependency
- `app/modules/auth/service.py` — `get_current_user()`, `build_menu_tree()`
- `app/modules/auth/api.py` — Login, get user info, get routes, and other endpoints
- `app/modules/system/models/` — User, Role, Menu, Dept models

### Frontend

- `src/store/modules/auth/index.ts` — Authentication state management
- `src/store/modules/route/index.ts` — Dynamic route initialization
- `src/router/guard/route.ts` — Navigation guards
- `src/hooks/business/auth.ts` — `useAuth()` / `hasAuth()` hook
- `src/service/request/index.ts` — Request interceptor (auto-attaches Token)
