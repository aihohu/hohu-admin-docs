---
title: 缓存
description: 使用 HoHu Redis 缓存装饰器、租户命名空间与提交后失效策略，避免跨租户共享和命中缓存绕过授权。
---

# 缓存

普通业务缓存工具位于 `app/core/cache.py`。适合可短暂延迟的展示数据；权限、锁、幂等和 AI 确认状态有各自协议，不使用普通缓存降级规则。

## API 速查

| API                                  | 用途                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| `@cacheable(key=..., ttl=300)`       | 命中时读取 JSON，未命中时执行异步函数并写入结果；不缓存 None |
| `await cache_get(key)`               | 手动读取，未命中或读取失败时返回 None                        |
| `await cache_delete(key=...)`        | 删除一个键，也可用 pattern 删除匹配键                        |
| `@cache_evict(key=..., pattern=...)` | 被装饰函数成功返回后删除缓存；不会替函数提交事务             |

这些入口自动加 `cache:` 前缀，传入的键不要重复加前缀。当前没有独立 `cache_set` API。

## 为租户共享统计缓存

以下服务函数基于[便签模块](../development/module)，只缓存本租户共享的数量。调用方先完成 `business:note:list` 权限检查，再传入可信上下文。

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

缓存命中不会执行被装饰函数，因此不要把必须每次执行的授权检查只写在函数内部。若结果取决于用户、部门或权限版本，缓存键还需要体现这些维度，并处理撤权后的失效。

命中返回 JSON 解码后的数据。返回 dict、list 等可序列化值，避免首次返回 ORM、再次返回 dict 的类型差异。Schema 可先 `model_dump(mode="json", by_alias=True)`，保持 ID 与时间序列化约定。

## 提交后失效

创建便签的 API 在业务写入成功后，按下列顺序处理；db 和 tenant 为接口已有参数：

```python
from app.core.cache import cache_delete
from app.core.tenant_scope import tenant_cache_key

# After the business write, inside the async API handler:
await db.commit()
await cache_delete(key=tenant_cache_key(tenant, "notes", "summary"))
```

Service 不 commit。`cache_evict` 的 key/pattern 不会像 `cacheable` 一样替换函数参数，动态租户键优先使用上面的显式删除方式。避免不带租户范围的通配删除。

缓存读写或删除故障会记录日志；读取可回源，删除失败后旧值可能保留到 TTL。该策略不保证强一致，不能用于余额、库存扣减或执行幂等的最终判断。请求限流等保护机制对 Redis 故障另有处理，见[配置归属](../reference/configuration)。

验证跨租户同名键、首次与命中结果类型、事务失败不发布新值、提交后失效及 Redis 不可用。
