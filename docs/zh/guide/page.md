---
title: 分页
description: HoHu Admin 统一的后端分页查询与前端表格分页方案，使用 paginate() 和 useNaivePaginatedTable 快速接入
---

# 分页

HoHu Admin 提供了统一的后端分页查询和前端表格分页方案，新增模块时只需遵循固定模式即可快速接入。

## API 响应格式

所有分页接口统一返回 `PageResult` 结构：

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

| 字段      | 类型   | 说明                  |
| --------- | ------ | --------------------- |
| `records` | `list` | 当前页数据            |
| `total`   | `int`  | 总记录数              |
| `current` | `int`  | 当前页码（从 1 开始） |
| `size`    | `int`  | 每页条数              |

## 后端分页

### 核心工具

分页工具位于 `app/utils/pagination.py`，提供三个核心函数：

#### `paginate()` — 标准分页查询

适用于单表查询场景：

```python
from app.utils.pagination import paginate

page_data = await paginate(
    db=db,
    model=User,                           # SQLAlchemy 模型
    query_params=query,                   # 包含 current 和 size 的查询参数
    filters=filters,                      # 过滤条件列表
    order_by=User.create_time.desc(),     # 排序
    eager_loads=[selectinload(User.roles)],  # 预加载关联
)
# 返回 PageResult(records=..., total=..., current=..., size=...)
```

#### `paginate_custom()` — 自定义 SQL 分页

适用于复杂 JOIN 查询：

```python
from app.utils.pagination import paginate_custom

page_data = await paginate_custom(
    db=db,
    query=stmt,               # 预构建的 Select 查询
    count_query=count_stmt,   # 可选，自定义计数查询
    current=1,
    size=10,
)
```

#### `build_filters()` — 构建过滤条件

将查询参数映射为 SQLAlchemy 过滤表达式：

```python
from app.utils.pagination import build_filters

field_mapping = {
    "user_name": ("user_name", "contains"),   # LIKE 模糊匹配
    "status": ("status", "=="),                # 精确匹配
    "user_gender": ("user_gender", "=="),
    "role_id": (lambda model, val: Model.roles.any(role_id=val),),  # 自定义过滤
}

filters = build_filters(User, field_mapping, **query.model_dump())
```

支持的操作类型：

| 操作            | 说明             | 示例                 |
| --------------- | ---------------- | -------------------- |
| `"contains"`    | 模糊匹配（LIKE） | `user_name` 字段搜索 |
| `"=="`          | 精确匹配         | `status` 字段筛选    |
| `"in_"`         | IN 查询          | 批量 ID 查询         |
| `">="` / `"<="` | 范围比较         | 日期区间筛选         |
| `Callable`      | 自定义逻辑       | 多表关联过滤         |

`None` 和空字符串的参数会被自动跳过，无需手动判空。

### 完整接入示例

以用户管理为例，展示新增分页接口的标准流程：

**1. 定义查询 Schema**

```python
# app/modules/system/schemas/user.py
class UserQuery(BaseModel):
    current: int = Field(1, ge=1)
    size: int = Field(10, ge=1, le=100)
    user_name: str | None = None
    status: str | None = None

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
```

`to_camel` 别名生成器让前端可以用 `?current=1&size=10&userName=foo` 的方式传参。

**2. Service 层查询**

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

**3. API 层接入**

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

通过 `Depends()` 自动解析 URL 查询参数为 `UserQuery` 对象。

## 前端分页

### 类型定义

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

前端通过 `useNaivePaginatedTable` hook 统一处理服务端分页，所有分页视图遵循相同模式：

```typescript
import { useNaivePaginatedTable, defaultTransform } from '@/hooks/common/table';

// 1. 定义搜索参数
const searchParams = reactive({
  current: 1,
  size: 10,
  userName: null,
  status: null
});

// 2. 初始化表格 hook
const { columns, data, loading, pagination, mobilePagination, getDataByPage } = useNaivePaginatedTable({
  api: () => fetchGetUserList(searchParams),
  transform: defaultTransform,
  onPaginationParamsChange: params => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    { title: '用户名', key: 'userName' },
    { title: '状态', key: 'status' }
  ]
});
```

### 模板渲染

使用 NaiveUI 的 `NDataTable` 组件，开启 `remote` 模式：

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

`remote` 表示分页由服务端处理，`pagination` 接收 hook 返回的响应式分页配置，用户切换页码时自动触发 API 请求。

### 数据流转

```
用户切换页码 → pagination.page 更新
     → watch 触发 onPaginationParamsChange → searchParams.current/size 同步
     → api() 调用 fetchGetUserList(searchParams)
     → GET /system/user/list?current=2&size=10
     → 后端 paginate() 查询并返回 PageResult
     → defaultTransform 将 {records, current, size, total} 转为 {data, pageNum, pageSize, total}
     → data 和 pagination.itemCount 更新 → 表格重新渲染
```

### 搜索重置

搜索时通过 `getDataByPage()` 重置到第一页：

```html
<UserSearch v-model:model="searchParams" @search="getDataByPage" />
```

## 相关文件

### 后端

- `app/utils/pagination.py` — `paginate()`、`paginate_custom()`、`build_filters()`
- `app/core/base_response.py` — `PageResult` 响应模型

### 前端

- `src/hooks/common/table.ts` — `useNaivePaginatedTable`、`defaultTransform`
- `src/typings/api/common.d.ts` — 分页类型定义
- `packages/hooks/src/use-table.ts` — 框架无关的 `useTable` 基础 hook
