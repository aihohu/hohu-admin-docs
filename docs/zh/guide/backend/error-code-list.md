---
title: 错误码速查表
description: HoHu Admin 全部错误码完整列表，方便快速查找
---

# 错误码速查表

全部内置错误码一览。关于响应格式和如何新增错误码，请参阅 [错误码](./error-code)。

## 全部错误码

| errorCode | HTTP | 模块 | 消息 | 场景 |
|-----------|------|------|------|------|
| `UNAUTHORIZED` | 401 | 认证 | 登录已过期 | OAuth2 或原生 HTTPException 401 |
| `INVALID_CREDENTIALS` | 401 | 认证 | 用户名或密码错误 | 登录凭证校验失败 |
| `TOKEN_EXPIRED` | 401 | 认证 | 登录已过期 | JWT 解码失败或用户不存在 |
| `ACCOUNT_DISABLED` | 403 | 认证 | 账号已被禁用 | 用户状态为禁用 |
| `AI_PROVIDER_NOT_FOUND` | 404 | AI | AI 提供商不存在 | 提供商 ID 不存在 |
| `AI_CONVERSATION_NOT_FOUND` | 404 | AI | AI 会话不存在 | 会话 ID 不存在 |
| `AI_MODEL_NOT_CONFIGURED` | 400 | AI | AI 模型未配置 | 提供商未配置可用模型 |
| `AI_PROVIDER_DUPLICATE` | 400 | AI | 提供商标识已存在 | 提供商 code 重复 |
| `AI_TEST_NO_MODEL` | 400 | AI | 未配置可用模型 | 连通性测试时无模型 |
| `AI_TEST_NO_API_KEY` | 400 | AI | 缺少 API Key | 连通性测试时无 API Key |
| `AI_TEST_FAILED` | 400 | AI | 连通性测试失败 | 提供商连接测试失败 |
