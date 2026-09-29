---
title: 常见错误码
description: HoHu 常见错误码的使用步骤、适用范围与限制
---

# 常见错误码

这是一份排查摘录，不是全部错误码清单。准确 HTTP 状态与字段以当前运行接口为准，响应结构见[错误处理](./error-code)。

| errorCode                   | 排查方向                               |
| --------------------------- | -------------------------------------- |
| `INVALID_CREDENTIALS`       | 账号、密码及租户定位                   |
| `TOKEN_EXPIRED`             | Token 有效性与当前身份，按认证流程处理 |
| `ACCOUNT_DISABLED`          | 联系管理员检查账号状态                 |
| `MISSING_PERMISSION`        | 当前角色的功能权限与启用状态           |
| `AI_CHAT_PERMISSION_DENIED` | 显式 AI 入口授权                       |
| `AI_MODULE_DISABLED`        | AI 部署开关，503                       |
| `SETTINGS_CONFLICT`         | 设置并发版本冲突，409，重新读取再合并  |
| `SETTING_VALUE_INVALID`     | 字段类型、范围与选项                   |
| `RATE_LIMIT_EXCEEDED`       | 请求额度，429，遵循 Retry-After        |
| `RATE_LIMIT_UNAVAILABLE`    | Redis 限流依赖，503                    |

反馈时提供错误码、操作步骤、时间与版本，避免提供密钥或完整用户数据。不要仅通过 HTTP 200 判断流式工具操作的最终业务状态。
