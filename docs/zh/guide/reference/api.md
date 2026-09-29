---
title: API 参考
description: 查找实例 OpenAPI，了解 HoHu 响应结构、认证、字符串 ID、分页和错误处理约定。
---

# API 参考

准确的路由、参数、响应 Schema 和错误状态以**目标运行实例**的 OpenAPI 为准。本地后端默认可访问 `http://127.0.0.1:8000/docs` 与 `/openapi.json`；通过反向代理时使用实际公开前缀。生产环境是否公开文档由部署方决定。

普通 API 使用 JWT Bearer access token，响应 `{code, msg, data}`，成功码 200；分页 data 包含 records、total、current、size。Snowflake ID 在 JSON 中为字符串，客户端字段按 Schema 使用 camelCase。

使用凭据前确认目标实例，Swagger 的实际写操作会修改该实例数据。不要把 Token 粘贴到公开站点、Issue 或共享截图。平台维护接口与普通用户接口有不同身份边界。

## 不重复维护接口清单

本站解释使用流程和跨接口约束，不复制一份手写的完整 OpenAPI。需要离线参考时，从受控实例导出与发布构建匹配的规范；发布前核对版本和敏感示例，不能把开发环境的业务数据作为样例发布。

错误处理见[错误码](../backend/error-code)，设置接口特殊契约见[设置参考](./settings)。源码中未注册的路由不属于可用 API。
