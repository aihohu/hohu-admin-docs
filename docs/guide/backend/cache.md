---
title: Caching
description: Use HoHu Redis cache decorators, tenant namespaces, and post-commit invalidation without cross-tenant sharing or authorization bypasses.
---

# Caching

General business cache helpers live in `app/core/cache.py`. Use them for display data that tolerates brief staleness. Permissions, locks, idempotency, and AI confirmations follow separate protocols rather than ordinary cache degradation rules.

## API reference

| API                                  | Purpose                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `@cacheable(key=..., ttl=300)`       | Read JSON on a hit; otherwise execute the async function and cache its result; None is not cached |
| `await cache_get(key)`               | Manual read; returns None on a miss or read failure                                               |
| `await cache_delete(key=...)`        | Delete one key, or use pattern to delete matching keys                                            |
| `@cache_evict(key=..., pattern=...)` | Delete after the decorated function succeeds; does not commit its transaction                     |

These helpers prepend `cache:` automatically. Do not include that prefix in supplied keys. There is no standalone `cache_set` API.

## Cache a tenant-shared count

This service function builds on the [notes module](../development/module) and caches only its tenant-shared count. The caller checks `business:note:list` before passing trusted context.

```python
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.cache import cacheable
from app.core.tenant import TenantContext
from app.core.tenant_scope import tenant_filter
from app.modules.notes.models import Note


@cacheable(key="tenant:{tenant.tenant_id}:notes:summary", ttl=60)
async def note_summary(db: AsyncSession, *, tenant: TenantContext) -> dict[str, int]:
    total = await db.scalar(
        select(func.count()).select_from(Note).where(tenant_filter(Note, tenant=tenant))
    )
    return {"total": total or 0}
```

A cache hit skips the decorated function. Do not put required per-call authorization exclusively inside it. When results depend on the user, department, or permission version, include those dimensions in keys and invalidate on revoked access.

Hits return JSON-decoded data. Return serializable dictionaries or lists to avoid returning an ORM object on the first call and a dictionary on the next. For schemas, use `model_dump(mode="json", by_alias=True)` to preserve ID and time conventions.

## Invalidate after commit

After creating a note, use this order in the API handler; db and tenant are existing handler parameters:

```python
from app.core.cache import cache_delete
from app.core.tenant_scope import tenant_cache_key

# After the business write, inside the async API handler:
await db.commit()
await cache_delete(key=tenant_cache_key(tenant, "notes", "summary"))
```

Services do not commit. Unlike `cacheable`, `cache_evict` does not substitute function arguments into key/pattern. Prefer explicit deletion for dynamic tenant keys, and avoid unscoped wildcard deletion.

Cache read, write, and deletion failures are logged. Reads can fall back to the database; a failed deletion can leave old values until TTL expiry. This does not provide strong consistency and must not decide balances, stock deduction, or execution idempotency. Protection mechanisms such as request throttling handle Redis failures separately; see [configuration ownership](../reference/configuration).

Test identical keys across tenants, hit/miss result types, failed transactions, post-commit invalidation, and Redis outages.
