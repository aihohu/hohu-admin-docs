---
title: 常见错误码
description: 按登录、注册邮件、设置、文件、AI 与租户场景快速定位 HoHu 常见错误。
---

# 常见错误码

先看[错误处理](./error-code)理解响应和重试。下列为当前实现中的常见错误，不是完整清单；实际 HTTP 状态以目标版本接口为准。

## 登录与权限

| errorCode             | 排查与处理                                            |
| --------------------- | ----------------------------------------------------- |
| `INVALID_CREDENTIALS` | 检查账号、密码及租户定位                              |
| `TOKEN_EXPIRED`       | 按认证流程刷新或重新登录                              |
| `ACCOUNT_DISABLED`    | 管理员检查账号启用状态                                |
| `TENANT_DISABLED`     | 检查租户状态和 hosted 运行开关                        |
| `MISSING_PERMISSION`  | 检查角色权限和启用状态                                |
| `SYSTEM_ADMIN_ONLY`   | 确认默认租户系统管理员身份，名称为 admin 并不代表授权 |
| `TENANT_REQUIRED`     | 提供允许的租户定位信息                                |

## 注册、邮件与找回密码

| errorCode                        | 排查与处理                                     |
| -------------------------------- | ---------------------------------------------- |
| `ACCOUNT_SERVICE_DISABLED`       | 检查租户账号功能开关                           |
| `MAIL_NOT_CONFIGURED`            | 系统管理员配置并测试邮件服务                   |
| `MAIL_SEND_FAILED`               | 检查邮件测试状态及 SMTP 连接，不公开凭据       |
| `EMAIL_CODE_INVALID`             | 检查验证码、用途、身份和有效期，必要时重新发码 |
| `EMAIL_RATE_LIMITED`             | 遵守冷却时间再发码                             |
| `EMAIL_VERIFICATION_UNAVAILABLE` | 检查 Redis 等验证码依赖                        |
| `REGISTRATION_ROLE_INVALID`      | 管理员重新选择有效的注册默认角色               |
| `REGISTRATION_CONFLICT`          | 检查账号冲突，不原样循环注册                   |

## 设置、文件与访问保护

| errorCode                | 排查与处理                               |
| ------------------------ | ---------------------------------------- |
| `SETTINGS_CONFLICT`      | 409；重新读取并合并更改，使用新 revision |
| `SETTING_VALUE_INVALID`  | 检查字段类型、范围和可选值               |
| `FILE_TYPE_NOT_ALLOWED`  | 检查场景白名单和文件真实格式             |
| `FILE_TOO_LARGE`         | 检查场景、租户及部署上限                 |
| `RATE_LIMIT_EXCEEDED`    | 429；遵守 Retry-After                    |
| `RATE_LIMIT_UNAVAILABLE` | 503；检查 Redis 计数服务                 |

## AI 与租户初始化

| errorCode                              | 排查与处理                             |
| -------------------------------------- | -------------------------------------- |
| `AI_CHAT_PERMISSION_DENIED`            | 检查 AI 入口明确授权                   |
| `AI_MODULE_DISABLED`                   | 503；检查 AI 部署总开关                |
| `PLATFORM_TENANT_NOT_BOOTSTRAPPED`     | 先完成初始化，再激活租户               |
| `PLATFORM_TENANT_IDEMPOTENCY_CONFLICT` | 核对原幂等键与请求，先确认上一操作结果 |
| `PLATFORM_TENANT_CODE_EXISTS`          | 检查租户代码是否已被使用               |
| `PLATFORM_TENANT_ACTIVATION_DISABLED`  | 检查 hosted 启用条件及部署配置         |

账号操作见[账号与登录](../user/account)，配置见[设置参考](../reference/settings)，服务问题见[巡检与排错](../operations/monitoring)。反馈时只提供脱敏上下文，不附带 token、验证码或密码。
