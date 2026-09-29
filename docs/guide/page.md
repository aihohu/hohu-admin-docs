---
title: Pagination
description: 'HoHu pagination: steps, scope and limitations'
---

# Pagination

Utilities live in `app/utils/pagination.py`. Business query schemas use `current` starting at 1 and `size`, validating positive values and a maximum page size.

| Entry             | Purpose                                             | Record type                             |
| ----------------- | --------------------------------------------------- | --------------------------------------- |
| `paginate`        | Single-model pagination with optional eager loading | ORM entities                            |
| `paginate_custom` | JOIN, multi-column or aggregate queries             | SQLAlchemy Row objects                  |
| `build_filters`   | Build conditions from controlled field mappings     | Conditions, not automatic authorization |

Add trusted tenant predicates, [Data scope](./data-permission) and business filters before pagination. Utilities do not infer tenant context. Lists and counts must use identical authorization conditions.

Supply an explicit `count_query` for custom joins and aggregates. Decide whether it counts entities or groups and handle duplicate joined rows. Failed automatic count inference can fall back to 0; that does not prove the business total is correct.

Use stable ordering with a unique ID tie-breaker for equal timestamps. Map ORM/Row values to response schemas and serialize Snowflake IDs as strings. Load only needed relationships, avoid N+1 queries and evaluate indexes using query plans.

Large exports need a separate bounded workflow, not an oversized page size. Use SQLAlchemy expressions and bound parameters rather than concatenated user SQL.
