---
title: 接口与按钮权限
description: 为 HoHu 业务模块添加稳定权限码、后端权限检查、菜单授权和 Web 按钮可见性。
---

# 接口与按钮权限

权限码标识用户能执行的操作。后端检查请求，前端根据同一权限码显示入口；隐藏按钮不能代替接口校验。记录范围另见[数据范围](./data-permission)。

## 接入顺序

| 步骤           | 位置                              | 要做什么                                   |
| -------------- | --------------------------------- | ------------------------------------------ |
| 定义权限码     | 模块接口与菜单种子                | 使用稳定的 `模块:资源:操作` 标识           |
| 校验接口       | API 路由                          | `Depends(require_permissions(...))`        |
| 登记菜单与按钮 | `app/modules/system/menu_seed.py` | 添加页面、组件映射和按钮定义               |
| 同步并授权     | 后端与角色管理                    | 同步种子，由管理员明确授予角色权限         |
| 控制界面入口   | Vue 页面                          | 使用 `v-permission` 或 `useAuth().hasAuth` |
| 验证           | 普通测试账号                      | 检查界面与直接 HTTP 请求                   |

## 后端校验

[便签教程](./development/module)使用 `business:note:list` 与 `business:note:add`。以下是该模块的完整查询路由，复用教程中的模型、Schema 与 Service：

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

创建接口使用 `business:note:add`，每个操作分别授权。现有用户接口使用 `system:user:*`，不要照抄旧版本的 `sys:user:*`。

## 菜单同步与授权

新增模块菜单后，在后端目录运行：

```bash
uv run python -m scripts.sync_menus
```

同步只更新菜单定义，不会替已有角色扩大授权。管理员在角色管理中授予页面及所需按钮权限，测试账号退出再登录刷新权限。完整菜单种子和组件映射见便签教程，管理界面操作见[角色与权限](./user/roles)。

## Web 按钮

业务页面可直接使用已有的指令；以下是模板片段，文案来自便签教程的资源：

```vue
<NButton v-permission="'business:note:add'">
  {{ $t('common.add') }}
</NButton>
```

需要在脚本中判断时，从 `@/hooks/business/auth` 导入 `useAuth`，通过 `hasAuth('business:note:add')` 检查。传入数组时为“任一权限满足”，不是全部满足；需要组合条件时分别检查。

普通业务超管要求启用的 `R_SUPER` 角色，用户名 `admin` 不构成旁路；该角色仍受租户边界限制。系统级操作另有默认租户管理员要求，AI 入口和工具还需要显式授权。

## 验证

分别用有权限、无权限、角色被禁用的普通账号测试。无权限时不仅按钮不可操作，直接 HTTP 请求也应拒绝；切换租户后不能读取原租户记录。权限、认证、租户和数据范围是独立边界，都需要覆盖。
