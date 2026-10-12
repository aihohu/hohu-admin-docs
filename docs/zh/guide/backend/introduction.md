---
title: 后端架构
description: 了解 HoHu 的 API、Service、Model 与 Schema 分工，以及事务、响应、租户和异常处理约定。
---

# 后端架构

HoHu 后端使用 FastAPI、SQLAlchemy 2.0 异步会话和 Pydantic。业务代码放在 `app/modules/<module>/`；完整实现见[业务便签教程](../development/module)。

## 一次请求经过什么

| 层级    | 职责                                                                           | 不放在这一层的内容       |
| ------- | ------------------------------------------------------------------------------ | ------------------------ |
| API     | 校验输入、认证与功能权限，获取可信租户上下文，调用 Service，提交事务并返回响应 | 拼装跨模块业务流程的细节 |
| Service | 执行业务规则、租户和记录范围检查，查询或修改数据，必要时 flush                 | HTTP 响应、数据库 commit |
| Model   | 表、字段、关系、索引与约束                                                     | 页面展示与用户授权决策   |
| Schema  | 输入校验、字段别名、输出字段与序列化                                           | 数据库查询               |

路由依赖从 `app/modules/auth/service.py` 获取当前用户或 `get_current_tenant_context`。功能权限使用 `app/core/auth.py` 的 `require_permissions`。租户过滤与数据范围在 Service 中继续执行，不能由前端传入的租户 ID 替代。

## 事务与异常

Service 可使用 `await db.flush()` 获取生成字段，但不提交。API 在所有业务操作成功后执行 `await db.commit()`，再返回成功；需要缓存失效时放在提交之后。任务与其他非 HTTP 调用方也需要明确自己的事务边界。

业务异常使用 `app/core/exceptions.py` 的领域异常，并提供稳定的错误码。复用统一异常处理，不在业务层直接抛 `HTTPException`，也不捕获所有异常后返回成功。错误响应说明见[错误处理](./error-code)。

## 接口契约速查

| 项目     | 约定                                                                  |
| -------- | --------------------------------------------------------------------- |
| 成功响应 | `{code: 200, msg, data}`，通过 `ResponseModel.success(...)` 返回      |
| 分页数据 | `data.records`、`data.total`、`data.current`、`data.size`             |
| ID       | Snowflake ID 在 JSON 中为字符串；不要在 Web 中转成 Number             |
| 字段名   | Python 使用 snake_case；Schema 使用 camelCase 别名对外输出            |
| 时间     | 按接口约定输出 ISO 8601 UTC 时间，页面负责显示格式                    |
| 输入     | 明确字段和长度；不允许客户端指定服务端管理的 tenant、owner 或审计字段 |

字段转换通过 Schema 配置与序列化实现，不是对任意字典进行自动转换。新增 Schema 时参考便签示例的 `alias_generator`、`from_attributes` 和 ID serializer。

## 新增模块需要注册什么

1. 在 `app/main.py` 注册业务 router。
2. 在 `alembic/env.py` 导入模型，生成并审查迁移。
3. 租户业务表加入 `app/core/tenant_inventory.py` 与对应测试。
4. 在菜单种子登记页面和权限，同步后由管理员授权。

详细路径见[目录结构](./dir)，请求接入见 [Web 页面与请求](../development/web)，提交前检查见[调试与验证](../development/testing)。
