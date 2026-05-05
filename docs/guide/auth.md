---
title: 权限控制
description: HoHu Admin 采用 RBAC 模型实现从菜单路由到按钮级别的细粒度权限管理，包括角色、菜单、API 接口的权限控制
---

# 权限控制

HoHu Admin 采用经典的 **RBAC（基于角色的访问控制）** 模型，实现从菜单路由到按钮级别的细粒度权限管理。

## 权限模型

系统通过 **用户 → 角色 → 菜单** 三层关系实现权限控制：

```
用户 (User) ──M2M──> 角色 (Role) ──M2M──> 菜单 (Menu)
                                            ├── 目录 (M)
                                            ├── 菜单 (C)
                                            └── 按钮 (F) ← 携带 permission 权限码
```

- **用户**：可分配多个角色
- **角色**：可关联多个菜单/按钮权限
- **菜单**：分为目录（M）、页面（C）、按钮（F）三种类型，按钮类型携带权限码

## 超级管理员

超级管理员绕过所有权限检查，拥有以下特征的账户自动成为超级管理员：

- 用户名为 `admin`，**或**
- 拥有角色编码为 `R_SUPER` 的角色

## 后端权限控制

### 路由级别保护

通过 FastAPI 依赖注入保护 API 端点：

```python
from app.core.auth import require_permissions

# 需要指定权限才能访问
@router.get("/users", dependencies=[Depends(require_permissions("sys:user:list"))])
async def list_users(...):
    ...

# 仅超级管理员可访问
@router.delete("/users/{user_id}", dependencies=[Depends(require_permissions("sys:user:delete", super_admin_only=True))])
async def delete_user(...):
    ...
```

### 获取当前用户

所有需要认证的接口通过 `get_current_user` 依赖获取当前登录用户：

```python
from app.modules.auth.service import get_current_user

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user
```

`get_current_user` 会自动：

1. 从 `Authorization` 请求头提取 JWT Token
2. 解码验证 Token（HS256）
3. 查询用户并预加载角色和菜单（`selectinload`）
4. 检查用户是否被禁用

### 权限码命名规范

按钮级权限码采用 `模块:资源:操作` 的三段式命名：

```
sys:user:list       # 用户列表
sys:user:add        # 新增用户
sys:user:edit       # 编辑用户
sys:user:delete     # 删除用户
system:role:list    # 角色列表
system:menu:add     # 新增菜单
```

## 前端权限控制

### 动态路由

前端支持两种路由模式（通过 `.env` 中 `VITE_AUTH_ROUTE_MODE` 配置）：

| 模式              | 说明                                         |
| ----------------- | -------------------------------------------- |
| `dynamic`（默认） | 路由由后端 API 返回，根据用户角色动态生成    |
| `static`          | 路由由本地文件结构生成，按 `meta.roles` 过滤 |

**动态模式流程**：

1. 用户登录后，前端调用 `GET /auth/getUserRoutes`
2. 后端根据用户的角色关联的菜单，构建菜单树返回
3. 前端将菜单树转换为 Vue Router 路由，通过 `router.addRoute()` 动态注册
4. 超级管理员看到所有菜单，普通用户只看到被授权的菜单

### 按钮级权限

使用 `useAuth()` hook 在模板中控制按钮显示：

```vue
<script setup lang="ts">
import { useAuth } from '@/hooks/business/auth';

const { hasAuth } = useAuth();
</script>

<template>
  <!-- 只有拥有 sys:user:add 权限的用户才能看到新增按钮 -->
  <NButton v-if="hasAuth('sys:user:add')" @click="handleAdd">新增用户</NButton>

  <!-- 只有拥有 sys:user:delete 权限才能看到删除确认 -->
  <NPopconfirm v-if="hasAuth('sys:user:delete')" @positive-click="handleDelete(row.userId)">
    <template #trigger>
      <NButton type="error">删除</NButton>
    </template>
    确定删除该用户吗？
  </NPopconfirm>
</template>
```

`hasAuth()` 也支持传入数组，任一权限匹配即返回 `true`：

```ts
// 拥有编辑或查看权限之一即可
hasAuth(['sys:user:edit', 'sys:user:list']);
```

### 路由守卫

导航守卫在每次路由跳转时执行权限检查：

1. **未登录** → 访问受保护页面 → 重定向到登录页
2. **已登录** → 访问无权限页面 → 重定向到 403 页面
3. **已登录** → 访问登录页 → 重定向到首页
4. **已登录** → 访问不存在的路由 → 检查是否后端有该路由（有则 403，无则 404）

## 认证流程

完整的登录认证流程：

```
1. 前端发送 POST /auth/login { userName, password }
          ↓
2. 后端验证密码（bcrypt），签发 JWT Token
          ↓
3. 前端存储 Token，调用 GET /auth/getUserInfo
          ↓
4. 后端返回 { userId, userName, roles, buttons }
          ↓
5. 前端调用 GET /auth/getUserRoutes 获取动态路由
          ↓
6. 前端注册路由，渲染菜单，页面就绪
```

## 关键配置

| 配置项                        | 位置        | 说明                            |
| ----------------------------- | ----------- | ------------------------------- |
| `SECRET_KEY`                  | 后端 `.env` | JWT 签名密钥                    |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 后端 `.env` | Token 有效期（默认 7 天）       |
| `VITE_AUTH_ROUTE_MODE`        | 前端 `.env` | 路由模式：`dynamic` 或 `static` |
| `VITE_STATIC_SUPER_ROLE`      | 前端 `.env` | 静态模式下的超级管理员角色编码  |

## 相关文件

### 后端

- `app/core/auth.py` — `require_permissions()` 权限依赖
- `app/modules/auth/service.py` — `get_current_user()`、`build_menu_tree()`
- `app/modules/auth/api.py` — 登录、获取用户信息、获取路由等接口
- `app/modules/system/models/` — User、Role、Menu、Dept 模型

### 前端

- `src/store/modules/auth/index.ts` — 认证状态管理
- `src/store/modules/route/index.ts` — 动态路由初始化
- `src/router/guard/route.ts` — 导航守卫
- `src/hooks/business/auth.ts` — `useAuth()` / `hasAuth()` hook
- `src/service/request/index.ts` — 请求拦截器（自动附加 Token）
