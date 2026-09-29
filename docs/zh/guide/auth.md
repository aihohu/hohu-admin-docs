---
title: 接口与按钮权限
description: HoHu 接口与按钮权限的使用步骤、适用范围与限制
---

# 接口与按钮权限

权限码是稳定的业务标识，不随语言改变。角色关联菜单与按钮，前端控制可见入口，后端独立校验请求。

## 接口接入

```python
from fastapi import Depends
from app.core.auth import require_permissions

# 在业务路由装饰器上声明：
# dependencies=[Depends(require_permissions("system:user:list"))]
```

权限码必须与菜单定义一致。当前用户服务使用 `system:user:*`，不能照抄旧教程中的 `sys:user:*`。认证、功能权限、数据范围和 tenant/owner 校验是不同层次，任何一层不能替代其他层。

普通业务超管判断要求启用的 `R_SUPER` 角色；用户名 `admin` 不构成旁路。该角色仍受租户边界限制。系统级管理要求默认租户的系统管理员身份，AI 入口和工具另外要求显式授权。

## 新增按钮

1. 在后端接口校验权限码。
2. 在 `app/modules/system/menu_seed.py` 增加菜单/按钮与稳定翻译键，通过 CLI 同步。
3. 管理员显式给角色授权；重跑部署不会扩大已有角色授权。
4. Web 使用 `v-permission` 或 `hasAuth` 控制入口。
5. 测试无权限账号直接调用 HTTP、禁用角色以及其他租户访问，不能只验证按钮是否隐藏。

管理员操作方式见[用户与角色](./user/access)，记录级限制见[数据范围](./data-permission)。
