---
title: 分页查询
description: 使用 HoHu 的 QueryParams、paginate 与 build_filters 构建带租户过滤、稳定排序和输入限制的分页接口。
---

# 分页查询

分页工具位于 `app/utils/pagination.py`。简单单模型查询使用 `paginate`；多表、多列或聚合查询使用 `paginate_custom`。两者都不会自动决定业务权限和租户范围。

## 参数与结果

| 字段    | 约定                                      |
| ------- | ----------------------------------------- |
| current | 从 1 开始，默认 1                         |
| size    | 默认 10；业务 Schema 应声明最小值与最大值 |
| records | 当前页记录，经输出 Schema 序列化          |
| total   | 相同查询范围内的记录总数                  |

基础 `QueryParams` 只定义默认值，未限制输入范围。以下示例在[便签模块](./development/module)基础上增加标题精确筛选，放在业务服务文件中；可信 tenant 由 API 依赖传入。

```python
from pydantic import Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.base_response import PageResult
from app.core.tenant import TenantContext
from app.core.tenant_scope import tenant_filter
from app.modules.notes.models import Note
from app.modules.notes.schemas import NoteOut
from app.utils.pagination import QueryParams, build_filters, paginate


class NoteQuery(QueryParams):
    current: int = Field(default=1, ge=1)
    size: int = Field(default=10, ge=1, le=100)
    title: str | None = Field(default=None, max_length=120)


async def page_notes(
    db: AsyncSession, query: NoteQuery, *, tenant: TenantContext
) -> PageResult[NoteOut]:
    filters = [tenant_filter(Note, tenant=tenant)]
    filters.extend(build_filters(Note, {"title": "title"}, title=query.title))
    result = await paginate(
        db, Note, query, filters=filters, order_by=Note.note_id.desc()
    )
    return PageResult[NoteOut](
        records=[NoteOut.model_validate(row) for row in result.records],
        total=result.total,
        current=result.current,
        size=result.size,
    )
```

API 继续检查 `business:note:list`，通过 `Depends()` 接收 `NoteQuery`，并用 `ResponseModel.success(...)` 包装结果。本例的便签为租户共享数据；部门或本人范围须另外加入 filters。

## 筛选与排序

`build_filters` 使用服务端字段映射，跳过 None、空字符串和未登记参数。字符串映射表示精确匹配；元组可表达 contains、ilike、范围等操作，复杂规则可使用 callable。映射由代码定义，不接受客户端提供的 SQL、任意列名或操作符。

排序必须稳定，例如 `Note.note_id.desc()`。只按非唯一时间字段排序可能导致相邻页重复或遗漏。筛选改变后，Web 页码应回到第一页。

## 复杂查询

`paginate_custom(db, query, count_query=..., current=..., size=...)` 返回多列 Row，调用方需要显式映射为输出 Schema。为 JOIN、去重和聚合提供准确的 count_query，并让计数与数据查询使用相同范围。自动推导计数失败时工具会返回 0，不能把它当成业务上的“没有数据”。

回归检查空页、最后一页、超限参数、筛选后的总数与跨租户隔离。批量导出采用专门导出流程，不通过无限增大 size 绕过分页限制。
