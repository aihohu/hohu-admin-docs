---
title: 缓存
description: HoHu Admin 基于 Redis 的异步缓存系统 — 装饰器与函数调用两种使用方式、Key 命名规则、最佳实践
---

# 缓存

HoHu Admin 提供基于 Redis 的异步缓存工具，支持**装饰器**和**函数调用**两种使用方式。所有缓存操作均做了优雅降级——Redis 不可用时不影响业务正常运行。

## 快速上手

### 装饰器 — 读缓存

使用 `@cacheable` 装饰器，缓存命中直接返回，未命中则执行方法并写入缓存：

```python
from app.core.cache import cacheable

class UserService:
    @cacheable(key="user:{id}", ttl=300)
    async def get_user(self, db, id: int):
        result = await db.execute(select(User).where(User.user_id == id))
        return result.scalars().first()
```

### 装饰器 — 写操作清缓存

使用 `@cache_evict` 装饰器，方法执行完后自动清除缓存：

```python
from app.core.cache import cache_evict

@cache_evict(pattern="config:*")
async def update_config(self, db, config_id, config_in):
    ...
```

::: warning 建议在 API 层使用
Service 层不 commit，若 commit 失败则缓存已被清除，导致数据不一致。推荐在 API 层 commit 后手动调用 `cache_delete()`。
:::

### 函数调用 — 手动清缓存

在 API 层 commit 后手动清除，这是最安全的模式：

```python
from app.core.cache import cache_delete

@router.put("/{config_id}")
async def update(config_id: int, config_in: ConfigUpdate, db: AsyncSession = Depends(get_db)):
    await config_service.update(db, config_id, config_in)
    await db.commit()
    await cache_delete(pattern="config:*")  # commit 成功后再清缓存
    return ResponseModel.success(msg="更新成功")
```

### 函数调用 — 手动读缓存

```python
from app.core.cache import cache_get

data = await cache_get("config:public")
```

## API 参考

### `@cacheable(key, ttl)`

读缓存装饰器。缓存命中直接返回，未命中则执行方法并将结果缓存。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `key` | `str \| None` | `None` | 缓存 key 模板，支持 `{param}` 和 `{obj.attr}` 动态参数 |
| `ttl` | `int` | `300` | 缓存过期时间（秒） |

**key 为 None 时**自动根据 `类名.方法名:参数哈希` 生成。

::: tip 返回类型
缓存返回的是 JSON 反序列化结果（`dict` / `list` / `str` / `number`），仅适用于返回 JSON-serializable 数据的方法。方法返回 `None` 时不缓存。
:::

### `@cache_evict(key, pattern)`

清缓存装饰器。方法执行完后自动清除缓存。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `key` | `str \| None` | `None` | 精确匹配的缓存 key |
| `pattern` | `str \| None` | `None` | 模式匹配（如 `"config:*"`），使用 SCAN 迭代删除 |

### `cache_delete(key, pattern)`

手动清除缓存。`key` 和 `pattern` 可单独或同时使用。

```python
# 精确删除
await cache_delete(key="user:42")

# 模式删除
await cache_delete(pattern="config:*")

# 同时使用
await cache_delete(key="user:42", pattern="user:list:*")
```

### `cache_get(key)`

手动读取缓存。未命中或出错返回 `None`。

```python
data = await cache_get("config:public")
```

## Key 命名规则

所有缓存 key 自动添加 `cache:` 前缀，避免与其他 Redis 数据冲突。

### 显式 key

支持 `{param}` 占位符和 `{obj.attr}` 属性访问：

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

### 自动 key

`key=None` 时根据函数签名自动生成：

```python
@cacheable(ttl=300)
async def get_user(self, db, id: int): ...
# → cache:UserService.get_user:a1b2c3d8
```

格式：`cache:{类名.方法名}:{参数MD5前8位}`

::: tip 建议
生产环境推荐使用显式 key，便于调试和手动管理。自动 key 适合开发阶段快速使用。
:::

## 序列化

缓存自动处理以下类型的序列化与反序列化：

| 类型 | 序列化方式 |
|------|-----------|
| `dict` / `list` / 基本类型 | 直接 JSON 序列化 |
| SQLAlchemy ORM 对象 | 提取所有列值 |
| Pydantic 模型 | 调用 `model_dump()` |
| `datetime` | `"%Y-%m-%d %H:%M:%S"` |
| `date` | ISO 格式 |
| `Decimal` | 转为 `float` |
| `UUID` | 转为字符串 |
| `bytes` | UTF-8 解码 |

## 最佳实践

### 1. 写操作：先 commit 再清缓存

```python
# ✅ 正确 — commit 成功后清缓存
@router.post("/add")
async def add(config_in: ConfigCreate, db: AsyncSession = Depends(get_db)):
    await config_service.create(db, config_in)
    await db.commit()
    await cache_delete(pattern="config:*")
    return ResponseModel.success()

# ❌ 错误 — 清缓存后 commit 可能失败
@router.post("/add")
async def add(config_in: ConfigCreate, db: AsyncSession = Depends(get_db)):
    await config_service.create(db, config_in)
    await cache_delete(pattern="config:*")  # 提前清了缓存
    await db.commit()  # 如果失败，缓存已清空，下次读穿透到 DB
    return ResponseModel.success()
```

### 2. 选择合适的 TTL

| 场景 | 建议 TTL |
|------|---------|
| 公开配置（极少变化） | `300`（5 分钟） |
| 用户信息 | `300 ~ 600` |
| 列表查询 | `60 ~ 120` |
| 热点数据 | 根据业务需求调整 |

### 3. 使用 pattern 批量清除

写操作后用 pattern 清除该模块的所有相关缓存：

```python
await cache_delete(pattern="config:*")   # 清除所有配置缓存
await cache_delete(pattern="user:*")     # 清除所有用户缓存
```

### 4. 返回 JSON-serializable 数据

`@cacheable` 返回的是 JSON 反序列化结果。如果方法返回 ORM 对象或 Pydantic 模型，缓存命中时的返回类型会变为 `dict`。

```python
# ✅ 返回 dict — 缓存前后类型一致
@cacheable(key="config:public", ttl=300)
async def get_public_configs(self, db) -> dict[str, str]:
    ...
    return {c.config_key: c.config_value for c in result.scalars().all()}
```

## 优雅降级

所有缓存操作都做了异常捕获，Redis 不可用时：

- **读缓存失败**：跳过缓存，直接执行方法
- **写缓存失败**：跳过缓存写入，正常返回结果
- **清缓存失败**：跳过清理，记录 warning 日志

不会影响业务逻辑的正常执行。

## 相关文件

- `app/core/cache.py` — 缓存装饰器和工具函数
- `app/core/redis.py` — Redis 连接池和客户端
- `app/core/config.py` — Redis 连接配置（`REDIS_HOST`、`REDIS_URL`）
- `.env` — Redis 环境变量配置
