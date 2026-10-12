---
title: Pagination
description: Build paginated HoHu APIs with QueryParams, paginate, and build_filters, including tenant filters, stable ordering, and input limits.
---

# Pagination

Pagination helpers live in `app/utils/pagination.py`. Use `paginate` for a simple single-model query and `paginate_custom` for joins, multiple columns, or aggregates. Neither helper determines business permissions or tenant scope for you.

## Parameters and results

| Field   | Convention                                                                |
| ------- | ------------------------------------------------------------------------- |
| current | Starts at 1; defaults to 1                                                |
| size    | Defaults to 10; declare minimum and maximum values in the business schema |
| records | Current-page records serialized through an output schema                  |
| total   | Record count within the same query scope                                  |

Base `QueryParams` supplies defaults without range validation. The following service example extends the [notes module](./development/module) with exact title filtering. The API supplies trusted tenant context.

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

The API still checks `business:note:list`, receives `NoteQuery` through `Depends()`, and wraps the result with `ResponseModel.success(...)`. Notes are tenant-shared in this example; add department or owner filters for policies that require them.

## Filtering and ordering

`build_filters` uses a server-defined mapping and skips None, empty strings, and unregistered parameters. String mappings mean exact matching; tuples support contains, ilike, ranges, and other operations. Callables handle custom rules. Define this mapping in code; never accept SQL, arbitrary columns, or operators from clients.

Use stable ordering such as `Note.note_id.desc()`. Ordering only by a non-unique timestamp may repeat or omit records across pages. Reset the Web page number when filters change.

## Complex queries

`paginate_custom(db, query, count_query=..., current=..., size=...)` returns multi-column Row objects that callers must map into output schemas. Supply accurate count_query statements for joins, deduplication, and aggregates, with identical scope in both queries. If automatic count inference fails, the helper returns 0; this is not proof that no business records exist.

Test empty and last pages, out-of-range parameters, filtered counts, and tenant isolation. Use dedicated export workflows for bulk exports instead of increasing size without bounds.
