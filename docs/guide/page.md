---
title: Pagination
description: HoHu Admin unified backend pagination query and frontend table pagination solution, using paginate() and useNaivePaginatedTable for quick integration
---

# Pagination

HoHu Admin provides a unified backend pagination query and frontend table pagination solution. When adding a new module, simply follow the established pattern for quick integration.

## API Response Format

All paginated endpoints uniformly return the `PageResult` structure:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "records": [],
    "total": 100,
    "current": 1,
    "size": 10
  }
}
```

| Field     | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `records` | `list` | Current page data             |
| `total`   | `int`  | Total record count            |
| `current` | `int`  | Current page number (1-based) |
| `size`    | `int`  | Page size                     |

## Backend Pagination

### Core Utilities

Pagination utilities are located in `app/utils/pagination.py`, providing three core functions:

#### `paginate()` — Standard Paginated Query

Suitable for single-table query scenarios:

```python
from app.utils.pagination import paginate

page_data = await paginate(
    db=db,
    model=User,                           # SQLAlchemy model
    query_params=query,                   # Query params containing current and size
    filters=filters,                      # List of filter conditions
    order_by=User.create_time.desc(),     # Ordering
    eager_loads=[selectinload(User.roles)],  # Eager-loaded relationships
)
# Returns PageResult(records=..., total=..., current=..., size=...)
```

#### `paginate_custom()` — Custom SQL Pagination

Suitable for complex JOIN queries:

```python
from app.utils.pagination import paginate_custom

page_data = await paginate_custom(
    db=db,
    query=stmt,               # Pre-built Select query
    count_query=count_stmt,   # Optional, custom count query
    current=1,
    size=10,
)
```

#### `build_filters()` — Build Filter Conditions

Maps query parameters to SQLAlchemy filter expressions:

```python
from app.utils.pagination import build_filters

field_mapping = {
    "user_name": ("user_name", "contains"),   # LIKE fuzzy match
    "status": ("status", "=="),                # Exact match
    "user_gender": ("user_gender", "=="),
    "role_id": (lambda model, val: Model.roles.any(role_id=val),),  # Custom filter
}

filters = build_filters(User, field_mapping, **query.model_dump())
```

Supported operation types:

| Operation       | Description                  | Example                               |
| --------------- | ---------------------------- | ------------------------------------- |
| `"contains"`    | Fuzzy match `LIKE '%val%'`   | `user_name` field search              |
| `"ilike"`       | Case-insensitive fuzzy match | `ILIKE '%val%'`                       |
| `"like"`        | LIKE with custom pattern     | value contains `%` wildcards          |
| `"startswith"`  | Prefix match `LIKE 'val%'`   | Starts with specified prefix          |
| `"endswith"`    | Suffix match `LIKE '%val'`   | Ends with specified suffix            |
| `"=="`          | Exact match                  | `status` field filter                 |
| `"!="`          | Not equal                    | Exclude a specific value              |
| `">"`           | Greater than                 | Numeric comparison                    |
| `"<"`           | Less than                    | Numeric comparison                    |
| `">="`          | Greater than or equal        | Date range start                      |
| `"<="`          | Less than or equal           | Date range end                        |
| `"in_"`         | IN query                     | Batch ID query                        |
| `"not_in"`      | NOT IN query                 | Exclude multiple values               |
| `"between"`     | BETWEEN range query          | value is a `[a, b]` tuple/list        |
| `"is_null"`     | IS NULL check                | When value is `True`, checks null     |
| `"is_not_null"` | IS NOT NULL check            | When value is `True`, checks not null |
| `Callable`      | Custom logic                 | Multi-table join filter               |

Parameters with `None` or empty string values are automatically skipped — no manual null checks needed.

### Complete Integration Example

Using user management as an example, here is the standard flow for adding a paginated endpoint:

**1. Define the Query Schema**

```python
# app/modules/system/schemas/user.py
class UserQuery(BaseModel):
    current: int = Field(1, ge=1)
    size: int = Field(10, ge=1, le=100)
    user_name: str | None = None
    status: str | None = None

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
```

The `to_camel` alias generator allows the frontend to pass parameters as `?current=1&size=10&userName=foo`.

**2. Service Layer Query**

```python
# app/modules/system/service/user_service.py
class UserService:
    async def get_user_list(self, db: AsyncSession, query: UserQuery) -> PageResult:
        filters = build_filters(User, {
            "user_name": ("user_name", "contains"),
            "status": ("status", "=="),
        }, **query.model_dump())

        return await paginate(
            db=db,
            model=User,
            query_params=query,
            filters=filters,
            order_by=User.create_time.desc(),
            eager_loads=[selectinload(User.roles)],
        )
```

**3. API Layer Integration**

```python
# app/modules/system/api/user.py
@router.get("/list", response_model=ResponseModel[PageResult[UserItemOut]])
async def get_user_list(
    query: UserQuery = Depends(),
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    page_data = await user_service.get_user_list(db, query)
    return ResponseModel.success(data=page_data)
```

`Depends()` automatically parses URL query parameters into a `UserQuery` object.

## Frontend Pagination

### Type Definitions

```typescript
// src/typings/api/common.d.ts
interface PaginatingQueryRecord<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
}

type CommonSearchParams = {
  current: number;
  size: number;
};
```

### useNaivePaginatedTable Hook

The frontend uses the `useNaivePaginatedTable` hook to uniformly handle server-side pagination. All paginated views follow the same pattern:

```typescript
import { useNaivePaginatedTable, defaultTransform } from '@/hooks/common/table';

// 1. Define search parameters
const searchParams = reactive({
  current: 1,
  size: 10,
  userName: null,
  status: null
});

// 2. Initialize table hook
const { columns, data, loading, pagination, mobilePagination, getDataByPage } = useNaivePaginatedTable({
  api: () => fetchGetUserList(searchParams),
  transform: defaultTransform,
  onPaginationParamsChange: params => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    { title: 'Username', key: 'userName' },
    { title: 'Status', key: 'status' }
  ]
});
```

### Template Rendering

Use NaiveUI's `NDataTable` component with `remote` mode enabled:

```html
<NDataTable
  :columns="columns"
  :data="data"
  :loading="loading"
  remote
  :pagination="mobilePagination"
  :row-key="row => row.userId"
/>
```

`remote` indicates that pagination is handled server-side. `pagination` receives the reactive pagination config returned by the hook. When the user changes pages, an API request is triggered automatically.

### Data Flow

```
User changes page → pagination.page updates
     → watch triggers onPaginationParamsChange → searchParams.current/size sync
     → api() calls fetchGetUserList(searchParams)
     → GET /system/user/list?current=2&size=10
     → Backend paginate() queries and returns PageResult
     → defaultTransform converts {records, current, size, total} to {data, pageNum, pageSize, total}
     → data and pagination.itemCount update → table re-renders
```

### Search Reset

When searching, use `getDataByPage()` to reset to the first page:

```html
<UserSearch v-model:model="searchParams" @search="getDataByPage" />
```

## Related Files

### Backend

- `app/utils/pagination.py` — `paginate()`, `paginate_custom()`, `build_filters()`
- `app/core/base_response.py` — `PageResult` response model

### Frontend

- `src/hooks/common/table.ts` — `useNaivePaginatedTable`, `defaultTransform`
- `src/typings/api/common.d.ts` — Pagination type definitions
- `packages/hooks/src/use-table.ts` — Framework-agnostic `useTable` base hook
