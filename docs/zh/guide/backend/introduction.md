---
title: 后端架构
description: HoHu 后端架构的使用步骤、适用范围与限制
---

# 后端架构

后端使用 FastAPI、SQLAlchemy 2.0 async、Pydantic v2、PostgreSQL、Redis 和 Alembic。`app/main.py` 负责路由注册、中间件与生命周期，文件存在不表示接口已注册。

## 分层

- API：请求校验、认证授权、调用 Service、事务提交及响应。
- Service：业务逻辑与数据库操作，抛领域异常，不 commit，不在模块单例保存当前用户或租户。
- Model：SQLAlchemy `Mapped[T]`、Snowflake 主键、租户关联及数据库约束。
- Schema：请求/响应类型与校验，JSON 中 ID 字符串化，字段按契约映射 camelCase。

认证使用 JWT Bearer。普通响应是 `{code, msg, data}`，成功码 200，错误可提供稳定 `errorCode`。时间与字段命名保持既有 Schema 契约；不同用途的业务字典不应被盲目重命名。

认证入口生成可信 `TenantContext`；Service 显式接收，列表、count、详情、写入、关联与缓存都携带同一租户边界。部门数据范围和超级管理员判断不能替代租户隔离。

数据库结构由 Alembic 迁移，种子只同步基础数据。详细维护约束与 ADR 在[后端仓库](https://github.com/aihohu/hohu-admin)的 `docs/ARCHITECTURE-GUIDELINES.md`、`docs/adr/` 中维护。
