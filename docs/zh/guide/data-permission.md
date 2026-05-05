---
title: 数据权限
description: HoHu Admin 数据权限控制用户可见数据范围，支持全部、本人、本部门、本部门及下属、自定义五种数据作用域
---

# 数据权限

数据权限控制用户能**看到哪些数据**，与功能权限（菜单/按钮）互补。功能权限决定"能不能操作"，数据权限决定"能看到多少"。

## 权限模型

系统通过 **角色 → 数据范围 → 部门** 实现行级数据过滤：

```
用户 (User) ──M2M──> 角色 (Role)
                         ├── data_scope: 数据范围等级
                         └── depts ──M2M──> 部门 (Dept)  ← 仅"自定义"时使用

用户 (User) ──M2M──> 部门 (Dept)  ← 用户所属部门，用于"本部门"等范围
```

### 数据范围等级

每个角色设置一个 `data_scope` 字段，共 5 个等级：

| 值  | 名称         | 过滤逻辑                   | 使用场景         |
| --- | ------------ | -------------------------- | ---------------- |
| `1` | 全部数据     | 不过滤，看所有数据         | 超级管理员、高管 |
| `2` | 自定义数据   | 按角色关联的部门过滤       | 跨部门管理者     |
| `3` | 本部门数据   | 按用户所属部门过滤         | 普通部门经理     |
| `4` | 本部门及以下 | 按用户所属部门及子部门过滤 | 上级部门经理     |
| `5` | 仅本人       | 只看自己创建的数据         | 普通员工         |

### 两个部门关联的区别

::: warning 容易混淆
角色关联部门和用户关联部门是两个不同的概念。
:::

| 关联        | 表              | 含义                       | 何时使用              |
| ----------- | --------------- | -------------------------- | --------------------- |
| 用户 → 部门 | `sys_user_dept` | 用户**属于**哪个部门       | `data_scope = 3/4` 时 |
| 角色 → 部门 | `sys_role_dept` | 角色**能看**哪些部门的数据 | `data_scope = 2` 时   |

**举例：**

```
张三，部门=技术部，角色=自定义角色（勾选了市场部、财务部）
→ 张三查用户列表 → 只能看到市场部和财务部的用户

李四，部门=技术部，角色=本部门角色
→ 李四查用户列表 → 只能看到技术部的用户

王五，部门=总部，角色=本部门及以下角色
→ 王五查用户列表 → 能看到总部及所有子部门的用户
```

## 后端实现

### 数据库模型

`Role` 模型新增 `data_scope` 字段和 `depts` 关系：

```python
# app/modules/system/models/role.py

class Role(Base):
    __tablename__ = "sys_role"

    # ... 其他字段 ...
    data_scope: Mapped[str] = mapped_column(
        String(2), nullable=False, default="1",
        comment="数据权限范围：1-全部，2-自定义，3-本部门，4-本部门及以下，5-仅本人",
    )
    depts: Mapped[list["Dept"]] = relationship(
        "Dept", secondary=role_depts, lazy="selectin"
    )
```

关联表 `sys_role_dept` 用于存储自定义数据权限的部门：

```python
# app/db/base.py

role_depts = Table(
    "sys_role_dept", Base.metadata,
    Column("role_id", BigInteger, ForeignKey("sys_role.role_id", ondelete="CASCADE"), primary_key=True),
    Column("dept_id", BigInteger, ForeignKey("sys_dept.dept_id", ondelete="CASCADE"), primary_key=True),
)
```

### 过滤工具

`app/utils/data_scope.py` 提供两个核心函数：

```python
from app.utils.data_scope import get_data_scope_filters, get_user_data_scope_filters

# 1. 通用模型过滤（模型有 dept_id 字段）
filters = await get_data_scope_filters(
    db, current_user, model=Order,
    dept_field="dept_id",    # 模型中的部门字段名
    user_field="create_by",  # 模型中的创建人字段名
)

# 2. User 模型专用（多对多部门关系）
filters = await get_user_data_scope_filters(db, current_user)
```

**过滤逻辑：**

1. 超级管理员（`R_SUPER`）→ 不过滤
2. 从用户所有启用角色中取最高权限
3. 根据权限等级生成 SQLAlchemy 过滤条件
4. 如果部门列表为空，回退到"仅本人"

### 在 Service 中集成

```python
# app/modules/system/service/user_service.py

from app.utils.data_scope import get_user_data_scope_filters

async def get_user_list(self, db: AsyncSession, query: UserQuery, current_user: User | None = None):
    filters = build_filters(User, field_mapping, **query.model_dump())

    # 应用数据权限过滤
    if current_user is not None:
        scope_filters = await get_user_data_scope_filters(db, current_user)
        filters.extend(scope_filters)

    page_data = await paginate(db=db, model=User, filters=filters, ...)
    return page_data
```

### 新模块接入数据权限

为业务模块接入数据权限，需要：

1. **模型添加字段**：业务表需有 `dept_id`（部门关联）和 `create_by`（创建人）字段
2. **Service 调用过滤**：在列表查询中调用 `get_data_scope_filters()`

```python
# 示例：为订单模块接入数据权限
from app.utils.data_scope import get_data_scope_filters

class OrderService:
    async def get_order_list(self, db: AsyncSession, query: OrderQuery, current_user: User):
        filters = build_filters(Order, field_mapping, **query.model_dump())

        # 应用数据权限
        scope_filters = await get_data_scope_filters(
            db, current_user, model=Order,
            dept_field="dept_id",
            user_field="create_by",
        )
        filters.extend(scope_filters)

        return await paginate(db=db, model=Order, filters=filters, ...)
```

### 多角色权限合并

用户拥有多个角色时，取**最高权限**：

```
优先级：全部(5) > 本部门及以下(4) > 本部门(3) > 自定义(2) > 仅本人(1)
```

例如用户同时拥有"仅本人"和"本部门"两个角色 → 最终权限为"本部门"。

## 前端实现

### 角色编辑

在角色编辑抽屉中，数据权限以下拉框形式展示，选择"自定义数据"时显示部门树：

```vue
<!-- src/views/system/role/modules/role-operate-drawer.vue -->

<NFormItem label="数据权限" path="dataScope">
  <NSelect v-model:value="model.dataScope" :options="dataScopeOptions" />
</NFormItem>

<!-- 选择"自定义数据"时显示部门树 -->
<NFormItem v-if="model.dataScope === '2'" label="选择部门">
  <NTree
    v-model:checked-keys="model.deptIds"
    :data="deptTreeData"
    checkable
    cascade
    selectable
  />
</NFormItem>
```

### 数据权限选项

```typescript
const dataScopeOptions = [
  { label: '全部数据', value: '1' },
  { label: '自定义数据', value: '2' },
  { label: '本部门数据', value: '3' },
  { label: '本部门及以下', value: '4' },
  { label: '仅本人', value: '5' }
];
```

### 类型定义

```typescript
// src/typings/api/system-manage.d.ts

declare namespace Api {
  namespace SystemManage {
    interface Role {
      // ... 其他字段
      dataScope: string;
      deptIds?: string[];
    }

    interface CreateRoleParams {
      // ... 其他字段
      dataScope: string;
      deptIds?: string[];
    }
  }
}
```

## API 参考

### 角色相关

角色创建和更新接口支持 `dataScope` 和 `deptIds` 参数：

| 方法   | 路径                     | 说明                                        |
| ------ | ------------------------ | ------------------------------------------- |
| `POST` | `/system/role/add`       | 创建角色（含 `dataScope`、`deptIds`）       |
| `PUT`  | `/system/role/{role_id}` | 更新角色数据权限                            |
| `GET`  | `/system/role/list`      | 查询角色列表（返回 `dataScope`、`deptIds`） |

**创建角色示例：**

```json
{
  "roleName": "部门经理",
  "roleCode": "R_DEPT_MGR",
  "status": "1",
  "dataScope": "2",
  "deptIds": ["1234567890", "9876543210"]
}
```

### 部门树

用于前端渲染部门选择树：

| 方法  | 路径                       | 说明                       |
| ----- | -------------------------- | -------------------------- |
| `GET` | `/system/dept/tree-option` | 获取部门树（仅启用的部门） |

## 数据库变更

数据权限引入以下数据库变更：

| 变更                  | 说明                                             |
| --------------------- | ------------------------------------------------ |
| `sys_role.data_scope` | 新增字段，`VARCHAR(2)`，默认值 `"1"`（全部数据） |
| `sys_role_dept`       | 新增关联表，角色与部门多对多（自定义数据权限）   |

迁移文件：`alembic/versions/6957ad20070b_add_data_scope.py`

## 后续规划

当前数据权限为 5 级部门维度过滤，适用于基础后台管理。后续将升级为**数据策略（Data Policy）** 模型，支持：

- 按资源类型配置独立策略（用户模块 vs 订单模块 vs 客户模块）
- 多维度过滤（部门、区域、项目、业务线）
- 角色层级继承
- 记录级共享
- 字段级权限

详见设计文档：`hohu-admin/docs/specs/2026-04-29-data-policy-design.md`

## 相关文件

### 后端

- `app/utils/data_scope.py` — 数据权限过滤核心逻辑
- `app/modules/system/models/role.py` — Role 模型（`data_scope` + `depts` 关系）
- `app/modules/system/schemas/role.py` — 角色请求/响应 Schema
- `app/modules/system/service/role_service.py` — 角色创建/更新时处理 `deptIds`
- `app/modules/system/service/user_service.py` — 用户列表应用数据权限过滤
- `app/modules/system/api/user.py` — 用户 API（传递 `current_user`）
- `app/constants/constants.py` — `DATA_SCOPE_*` 常量
- `app/db/base.py` — `role_depts` 关联表

### 前端

- `src/views/system/role/modules/role-operate-drawer.vue` — 角色编辑（数据权限选择器 + 部门树）
- `src/typings/api/system-manage.d.ts` — Role 类型定义（`dataScope`、`deptIds`）
