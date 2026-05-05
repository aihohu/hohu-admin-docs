---
title: Data Permissions
description: HoHu Admin data permissions control the scope of visible data for users, supporting five data scopes — all, self, own department, own department and sub-departments, and custom
---

# Data Permissions

Data permissions control **which data a user can see**, complementing functional permissions (menus/buttons). Functional permissions determine "whether an action can be performed"; data permissions determine "how much data can be seen".

## Permission Model

The system implements row-level data filtering through **Role > Data Scope > Department**:

```
User ──M2M──> Role
                   ├── data_scope: data scope level
                   └── depts ──M2M──> Department  ← only used with "custom" scope

User ──M2M──> Department  ← user's own department, used for "own department" and similar scopes
```

### Data Scope Levels

Each role has a `data_scope` field with 5 possible levels:

| Value | Name                     | Filtering Logic                                         | Use Case                    |
| ----- | ------------------------ | ------------------------------------------------------- | --------------------------- |
| `1`   | All data                 | No filtering — see all data                             | Super admins, executives    |
| `2`   | Custom data              | Filter by departments associated with the role          | Cross-department managers   |
| `3`   | Own department data      | Filter by the user's department                         | Regular department managers |
| `4`   | Own department and below | Filter by the user's department and its sub-departments | Senior department managers  |
| `5`   | Self only                | See only data created by the user                       | Regular employees           |

### Difference Between the Two Department Associations

::: warning Common confusion point
Role-associated departments and user-associated departments are two different concepts.
:::

| Association       | Table           | Meaning                                      | When Used               |
| ----------------- | --------------- | -------------------------------------------- | ----------------------- |
| User > Department | `sys_user_dept` | Which department the user **belongs to**     | When `data_scope = 3/4` |
| Role > Department | `sys_role_dept` | Which departments' data the role **can see** | When `data_scope = 2`   |

**Examples:**

```
Zhang San, department=Engineering, role=Custom role (selected: Marketing, Finance)
→ Zhang San queries user list → can only see users from Marketing and Finance departments

Li Si, department=Engineering, role=Own department role
→ Li Si queries user list → can only see users from the Engineering department

Wang Wu, department=Headquarters, role=Own department and below role
→ Wang Wu queries user list → can see users from Headquarters and all sub-departments
```

## Backend Implementation

### Database Model

The `Role` model adds the `data_scope` field and `depts` relationship:

```python
# app/modules/system/models/role.py

class Role(Base):
    __tablename__ = "sys_role"

    # ... other fields ...
    data_scope: Mapped[str] = mapped_column(
        String(2), nullable=False, default="1",
        comment="Data permission scope: 1-All, 2-Custom, 3-Own department, 4-Own department and below, 5-Self only",
    )
    depts: Mapped[list["Dept"]] = relationship(
        "Dept", secondary=role_depts, lazy="selectin"
    )
```

The association table `sys_role_dept` stores departments for custom data permissions:

```python
# app/db/base.py

role_depts = Table(
    "sys_role_dept", Base.metadata,
    Column("role_id", BigInteger, ForeignKey("sys_role.role_id", ondelete="CASCADE"), primary_key=True),
    Column("dept_id", BigInteger, ForeignKey("sys_dept.dept_id", ondelete="CASCADE"), primary_key=True),
)
```

### Filtering Utilities

`app/utils/data_scope.py` provides two core functions:

```python
from app.utils.data_scope import get_data_scope_filters, get_user_data_scope_filters

# 1. Generic model filtering (model has a dept_id field)
filters = await get_data_scope_filters(
    db, current_user, model=Order,
    dept_field="dept_id",    # department field name in the model
    user_field="create_by",  # creator field name in the model
)

# 2. User model specific (many-to-many department relationship)
filters = await get_user_data_scope_filters(db, current_user)
```

**Filtering logic:**

1. Super admin (`R_SUPER`) > no filtering
2. Takes the highest permission from all enabled roles of the user
3. Generates SQLAlchemy filter conditions based on the permission level
4. Falls back to "self only" if the department list is empty

### Integration in Service Layer

```python
# app/modules/system/service/user_service.py

from app.utils.data_scope import get_user_data_scope_filters

async def get_user_list(self, db: AsyncSession, query: UserQuery, current_user: User | None = None):
    filters = build_filters(User, field_mapping, **query.model_dump())

    # Apply data permission filtering
    if current_user is not None:
        scope_filters = await get_user_data_scope_filters(db, current_user)
        filters.extend(scope_filters)

    page_data = await paginate(db=db, model=User, filters=filters, ...)
    return page_data
```

### Integrating Data Permissions into a New Module

To add data permissions to a business module:

1. **Add fields to the model**: The business table needs `dept_id` (department association) and `create_by` (creator) fields
2. **Call the filter in Service**: Call `get_data_scope_filters()` in the list query

```python
# Example: Integrating data permissions for an order module
from app.utils.data_scope import get_data_scope_filters

class OrderService:
    async def get_order_list(self, db: AsyncSession, query: OrderQuery, current_user: User):
        filters = build_filters(Order, field_mapping, **query.model_dump())

        # Apply data permissions
        scope_filters = await get_data_scope_filters(
            db, current_user, model=Order,
            dept_field="dept_id",
            user_field="create_by",
        )
        filters.extend(scope_filters)

        return await paginate(db=db, model=Order, filters=filters, ...)
```

### Multi-Role Permission Merging

When a user has multiple roles, the **highest permission** takes effect:

```
Priority: All (5) > Own department and below (4) > Own department (3) > Custom (2) > Self only (1)
```

For example, if a user has both "self only" and "own department" roles, the effective permission is "own department".

## Frontend Implementation

### Role Editing

In the role editing drawer, data permissions appear as a dropdown. Selecting "Custom data" shows a department tree:

```vue
<!-- src/views/system/role/modules/role-operate-drawer.vue -->

<NFormItem label="Data Permission" path="dataScope">
  <NSelect v-model:value="model.dataScope" :options="dataScopeOptions" />
</NFormItem>

<!-- Show department tree when "Custom data" is selected -->
<NFormItem v-if="model.dataScope === '2'" label="Select Departments">
  <NTree
    v-model:checked-keys="model.deptIds"
    :data="deptTreeData"
    checkable
    cascade
    selectable
  />
</NFormItem>
```

### Data Permission Options

```typescript
const dataScopeOptions = [
  { label: 'All Data', value: '1' },
  { label: 'Custom Data', value: '2' },
  { label: 'Own Department Data', value: '3' },
  { label: 'Own Department and Below', value: '4' },
  { label: 'Self Only', value: '5' }
];
```

### Type Definitions

```typescript
// src/typings/api/system-manage.d.ts

declare namespace Api {
  namespace SystemManage {
    interface Role {
      // ... other fields
      dataScope: string;
      deptIds?: string[];
    }

    interface CreateRoleParams {
      // ... other fields
      dataScope: string;
      deptIds?: string[];
    }
  }
}
```

## API Reference

### Role-Related

Role creation and update endpoints support `dataScope` and `deptIds` parameters:

| Method | Path                     | Description                                      |
| ------ | ------------------------ | ------------------------------------------------ |
| `POST` | `/system/role/add`       | Create role (includes `dataScope`, `deptIds`)    |
| `PUT`  | `/system/role/{role_id}` | Update role data permissions                     |
| `GET`  | `/system/role/list`      | Query role list (returns `dataScope`, `deptIds`) |

**Create role example:**

```json
{
  "roleName": "Department Manager",
  "roleCode": "R_DEPT_MGR",
  "status": "1",
  "dataScope": "2",
  "deptIds": ["1234567890", "9876543210"]
}
```

### Department Tree

Used for rendering the department selection tree on the frontend:

| Method | Path                       | Description                                    |
| ------ | -------------------------- | ---------------------------------------------- |
| `GET`  | `/system/dept/tree-option` | Get department tree (enabled departments only) |

## Database Changes

Data permissions introduce the following database changes:

| Change                | Description                                                                      |
| --------------------- | -------------------------------------------------------------------------------- |
| `sys_role.data_scope` | New field, `VARCHAR(2)`, default value `"1"` (all data)                          |
| `sys_role_dept`       | New association table, role-to-department many-to-many (custom data permissions) |

Migration file: `alembic/versions/6957ad20070b_add_data_scope.py`

## Future Plans

The current data permissions provide 5-level department-based filtering, suitable for basic admin management. Future upgrades will introduce a **Data Policy** model supporting:

- Independent policies per resource type (user module vs. order module vs. customer module)
- Multi-dimensional filtering (department, region, project, business line)
- Role hierarchy inheritance
- Record-level sharing
- Field-level permissions

See the design document: `hohu-admin/docs/specs/2026-04-29-data-policy-design.md`

## Related Files

### Backend

- `app/utils/data_scope.py` — Core data permission filtering logic
- `app/modules/system/models/role.py` — Role model (`data_scope` + `depts` relationship)
- `app/modules/system/schemas/role.py` — Role request/response Schemas
- `app/modules/system/service/role_service.py` — Handles `deptIds` during role creation/update
- `app/modules/system/service/user_service.py` — Applies data permission filtering to user list
- `app/modules/system/api/user.py` — User API (passes `current_user`)
- `app/constants/constants.py` — `DATA_SCOPE_*` constants
- `app/db/base.py` — `role_depts` association table

### Frontend

- `src/views/system/role/modules/role-operate-drawer.vue` — Role editing (data permission selector + department tree)
- `src/typings/api/system-manage.d.ts` — Role type definitions (`dataScope`, `deptIds`)
