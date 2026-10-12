---
title: API 参考
description: 查阅 HoHu OpenAPI 入口、生产访问限制、认证、响应格式、分页、字符串 ID 与接口边界。
---

# API 参考

以**目标版本**的 OpenAPI 为接口清单，本站说明通用契约和接入方法。后台页面、API 与 CLI 应使用配套版本。

## 查看接口定义

| 运行方式               | 地址与行为                                                  |
| ---------------------- | ----------------------------------------------------------- |
| 本地后端，默认开发环境 | `http://127.0.0.1:8000/docs`、`/redoc`、`/openapi.json`     |
| 经 Web / Nginx 代理    | 使用实际代理前缀；标准配置将浏览器 `/api/` 转发到后端根路径 |
| 后端以 `ENV=prod` 启动 | 禁用 docs、redoc、openapi.json，404 不代表服务故障          |

生产接入可在受控环境运行同版本构建并导出规范，不要为查看 Swagger 把正式实例切换成开发模式。Swagger 写操作会修改当前实例的数据。

## 请求与响应约定

| 项目               | 约定                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------- |
| 认证               | `Authorization: Bearer <access_token>`；refresh token 用于刷新流程，不能替代 access token |
| 普通 JSON 成功响应 | code 为 200，含 msg 与 data                                                               |
| 分页               | data 含 records、total、current、size；过滤与排序参数以具体接口为准                       |
| ID                 | Snowflake ID 序列化为字符串，客户端不要转为 JavaScript Number                             |
| 字段名             | Schema 通过别名提供 camelCase；设置 values 等字典键保持其定义名称                         |
| 时间               | ISO 8601 UTC；展示时按用户时区转换                                                        |
| 失败               | HTTP 状态与业务 code，并可能附带稳定 errorCode，见[错误处理](../backend/error-code)       |

以下为分页响应的结构示例，不代表真实业务数据：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "records": [{ "id": "123456789012345678", "name": "Example" }],
    "total": 1,
    "current": 1,
    "size": 10
  }
}
```

## 身份与特殊响应

普通业务接口校验当前用户、租户及权限。平台维护接口有独立身份边界；但不能仅凭 `/platform/` 前缀决定使用哪种 token，例如[租户管理](../operations/tenants)使用默认租户系统管理员会话及审计请求头。以目标路由的认证依赖为准。

文件下载、AI SSE、`/health` 和 `/metrics` 不采用普通 JSON 信封。`/health` 返回 `{"status":"ok"}` 只表示进程存活；`/metrics` 是 Prometheus 文本。SSE 收到 HTTP 200 后仍可能出现工具或业务失败，需要读取最终事件。不要让统一 JSON 解析器处理所有响应。

请求失败先记录 HTTP 状态、errorCode、时间和脱敏响应，再排查[常见错误码](../backend/error-code-list)。网络或代理返回的 HTML 也不应当作业务 JSON。未注册到主应用的源码路由不代表可用接口。
