---
title: Caching
description: HoHu Admin Redis-based async caching system — decorator and function-call patterns, key naming rules, and best practices
---

# Caching

HoHu Admin provides a Redis-based async caching utility with two usage patterns: **decorators** and **function calls**. All cache operations gracefully degrade — if Redis is unavailable, business logic continues to work normally.

## Quick Start

### Decorator — Read Cache

Use the `@cacheable` decorator. Returns cached data on hit; executes the method and caches the result on miss:

```python
from app.core.cache import cacheable

class UserService:
    @cacheable(key="user:{id}", ttl=300)
    async def get_user(self, db, id: int):
        result = await db.execute(select(User).where(User.user_id == id))
        return result.scalars().first()
```

### Decorator — Evict on Write

Use the `@cache_evict` decorator to automatically clear cache after method execution:

```python
from app.core.cache import cache_evict

@cache_evict(pattern="config:*")
async def update_config(self, db, config_id, config_in):
    ...
```

::: warning Prefer API-layer usage
Service methods don't commit. If commit fails after cache eviction, data becomes inconsistent. Prefer calling `cache_delete()` in the API layer after a successful commit.
:::

### Function Call — Manual Eviction

Manually clear cache in the API layer after commit — the safest pattern:

```python
from app.core.cache import cache_delete

@router.put("/{config_id}")
async def update(config_id: int, config_in: ConfigUpdate, db: AsyncSession = Depends(get_db)):
    await config_service.update(db, config_id, config_in)
    await db.commit()
    await cache_delete(pattern="config:*")  # clear after successful commit
    return ResponseModel.success(msg="Updated")
```

### Function Call — Manual Read

```python
from app.core.cache import cache_get

data = await cache_get("config:public")
```

## API Reference

### `@cacheable(key, ttl)`

Read-through cache decorator. Returns cached data on hit; executes the method and caches the result on miss.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | `str \| None` | `None` | Cache key template. Supports `{param}` and `{obj.attr}` dynamic placeholders |
| `ttl` | `int` | `300` | Cache expiration time in seconds |

When `key` is `None`, an auto-generated key is used: `{ClassName.method_name}:{args_md5[:8]}`.

::: tip Return type
Cache returns JSON-deserialized data (`dict` / `list` / `str` / `number`). Only use with methods that return JSON-serializable data. `None` results are not cached.
:::

### `@cache_evict(key, pattern)`

Cache eviction decorator. Automatically clears cache after method execution.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | `str \| None` | `None` | Exact cache key to delete |
| `pattern` | `str \| None` | `None` | Glob pattern for batch deletion (e.g. `"config:*"`). Uses SCAN iteration. |

### `cache_delete(key, pattern)`

Manually clear cache. `key` and `pattern` can be used individually or together.

```python
# Exact key
await cache_delete(key="user:42")

# Pattern match
await cache_delete(pattern="config:*")

# Both
await cache_delete(key="user:42", pattern="user:list:*")
```

### `cache_get(key)`

Manually read cache. Returns `None` on miss or error.

```python
data = await cache_get("config:public")
```

## Key Naming

All cache keys are automatically prefixed with `cache:` to avoid collisions with other Redis data.

### Explicit Keys

Supports `{param}` placeholders and `{obj.attr}` attribute access:

```python
@cacheable(key="user:{id}", ttl=300)
async def get_user(self, db, id: int): ...
# → cache:user:42

@cacheable(key="config:{query.group}", ttl=300)
async def get_configs(self, db, query: ConfigQuery): ...
# → cache:config:basic

@cacheable(key="user:{id}:roles", ttl=600)
async def get_user_roles(self, db, id: int): ...
# → cache:user:42:roles
```

### Auto-generated Keys

When `key=None`, keys are generated from the function signature:

```python
@cacheable(ttl=300)
async def get_user(self, db, id: int): ...
# → cache:UserService.get_user:a1b2c3d8
```

Format: `cache:{ClassName.method_name}:{args_md5[:8]}`

::: tip Recommendation
Prefer explicit keys in production for easier debugging and manual management. Auto keys are convenient during development.
:::

## Serialization

The cache automatically handles serialization and deserialization for these types:

| Type | Serialization |
|------|--------------|
| `dict` / `list` / primitives | Direct JSON serialization |
| SQLAlchemy ORM objects | Extract all column values |
| Pydantic models | Call `model_dump()` |
| `datetime` | `"%Y-%m-%d %H:%M:%S"` |
| `date` | ISO format |
| `Decimal` | Convert to `float` |
| `UUID` | Convert to string |
| `bytes` | UTF-8 decode |

## Best Practices

### 1. Write Operations: Commit First, Then Evict

```python
# ✅ Correct — evict after successful commit
@router.post("/add")
async def add(config_in: ConfigCreate, db: AsyncSession = Depends(get_db)):
    await config_service.create(db, config_in)
    await db.commit()
    await cache_delete(pattern="config:*")
    return ResponseModel.success()

# ❌ Wrong — evicting before commit risks inconsistency
@router.post("/add")
async def add(config_in: ConfigCreate, db: AsyncSession = Depends(get_db)):
    await config_service.create(db, config_in)
    await cache_delete(pattern="config:*")  # cache cleared too early
    await db.commit()  # if this fails, cache is already gone
    return ResponseModel.success()
```

### 2. Choose Appropriate TTL

| Scenario | Suggested TTL |
|----------|--------------|
| Public config (rarely changes) | `300` (5 minutes) |
| User info | `300 ~ 600` |
| List queries | `60 ~ 120` |
| Hotspot data | Adjust based on requirements |

### 3. Use Patterns for Batch Eviction

After write operations, use patterns to clear all related cache for a module:

```python
await cache_delete(pattern="config:*")   # clear all config cache
await cache_delete(pattern="user:*")     # clear all user cache
```

### 4. Return JSON-serializable Data

`@cacheable` returns JSON-deserialized data. If a method returns ORM objects or Pydantic models, cache hits will return `dict` instead.

```python
# ✅ Returns dict — consistent type before/after caching
@cacheable(key="config:public", ttl=300)
async def get_public_configs(self, db) -> dict[str, str]:
    ...
    return {c.config_key: c.config_value for c in result.scalars().all()}
```

## Graceful Degradation

All cache operations have exception handling. When Redis is unavailable:

- **Read failure**: Skip cache, execute the method directly
- **Write failure**: Skip cache write, return result normally
- **Delete failure**: Skip cleanup, log a warning

Business logic is never affected.

## Related Files

- `app/core/cache.py` — Cache decorators and utility functions
- `app/core/redis.py` — Redis connection pool and client
- `app/core/config.py` — Redis connection settings (`REDIS_HOST`, `REDIS_URL`)
- `.env` — Redis environment variables
