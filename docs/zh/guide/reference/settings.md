---
title: 设置接口与上传策略
description: 查阅 HoHu 分组设置读写、revision 并发检查、敏感值处理和统一上传限制。
---

# 设置接口与上传策略

页面操作见[系统设置](../user/settings)。本页面向客户端与扩展开发者，字段细节以运行实例 OpenAPI 为准。

## 分组接口

内置设置存于租户隔离的 `sys_setting`，自定义参数存于 `sys_config`。系统设置前缀为 `/system/setting`，参数前缀为 `/system/config`，响应遵循 `{code, msg, data}`。

| 接口                          | 契约                                                               |
| ----------------------------- | ------------------------------------------------------------------ |
| `GET /system/setting`         | 返回可访问分组，要求 system:setting:list                           |
| `GET /system/setting/{group}` | group、values、fields、revision、secretKeys、configuredSecrets     |
| `PUT /system/setting/{group}` | 提交 values 与 revision，要求 system:setting:edit                  |
| `GET /system/setting/runtime` | 认证用户的语言、品牌、头像与上传场景能力，不回显密码或全局安全阈值 |
| `GET /system/setting/public`  | 可信公共租户定位下的公开设置，不能任意请求其他租户                 |

字段类型、默认值、公开属性与安全约束由 `app/modules/system/settings_catalog.py` 定义，不接受任意设置键 CRUD。保存先整组校验再原子写入；并发 revision 冲突为 409 / `SETTINGS_CONFLICT`，非法值为 `SETTING_VALUE_INVALID`。

敏感值返回空字符串，`configuredSecrets` 表示是否已有值，提交空密码保持原值。API 提交事务后失效设置缓存，自定义参数使用独立缓存命名空间。安全分组额外验证默认租户系统管理员身份。

## 分组与保存流程

| group      | 内容                       |
| ---------- | -------------------------- |
| brand      | 站点品牌                   |
| account    | 注册、找回密码与账号默认值 |
| locale     | 语言偏好                   |
| files      | 文件与上传策略             |
| agreements | 用户协议与隐私政策         |
| security   | 系统级访问保护             |

1. GET 目标分组，按 fields 渲染编辑项，保留 values 中的原始键名，例如 site_name，不改为 siteName。
2. PUT 提交非空的待修改 values 和本次读取的 revision，不自行生成 revision。
3. 成功后使用响应中的新值与 revision；409 时重新读取并合并差异，再由用户确认保存。

普通分组的 revision 是 64 字符摘要，作为不透明值使用。邮件接口使用独立版本字符串，不能套用普通分组的长度规则。不要在冲突后只替换 revision 自动覆盖他人的更改。

## 统一上传约束

`effective_max_bytes = min(UPLOAD_HARD_MAX_BYTES, tenant_max, scenario_max)`。

- 部署默认硬上限 100 MiB；图片处理硬上限 20 MiB，用户/配置导入及 AI 文本文件处理硬上限 10 MiB。
- 请求体上限为部署硬上限加 1 MiB，约束整个 multipart 请求，超限返回 413。CLI 为两层代理派生一致的 `UPLOAD_REQUEST_MAX_BYTES`。
- 扩展名取租户和场景白名单交集，保留 MIME、解码、XLSX 防炸弹、行数、路径和归属检查。
- `UPLOAD_EXTENSION_UNIVERSE` 是可选扩展名全集，`fields[].options` 下发给客户端；新选项不覆盖存量白名单。
- 当前通用公开上传仅按 JPEG/PNG 内容校验；AI 文本场景支持 csv/xlsx/txt/md/json。全集不是每个场景的支持承诺。
- 降低上传额度不使已有文件下载失效；私有文件读取始终校验当前权限。

登录/注册/API 限流与 AI 工具额度为独立边界。HTTP 超额返回 429 与 Retry-After，Redis 计数故障返回 503，健康检查和 OPTIONS 不计数。

## 共用邮件配置

邮件服务使用独立的系统级 `sys_mail_config`，不从任何租户继承。仅系统管理员可访问，另需对应设置查看/编辑权限。

- `GET /system/setting/mail`：`values`、`revision`、`configuredPassword`、`ready`、`lastTestAt`、`lastTestStatus`。密码永远为空。
- `PUT /system/setting/mail`：提交 `values`、`revision`、`clearPassword`；空密码保留，显式清除与替换不能同时提交。
- `POST /system/setting/mail/test`：提交 `recipient`；返回更新的配置投影，`lastTestStatus` 为 `accepted` / `failed` / `untested`。

邮件 values 包括 enabled、host、port、security、username、password、fromEmail、fromName；security 支持 TLS / STARTTLS。ready 表示配置条件满足，不证明网络可达；测试 accepted 表示 SMTP 接受，仍需检查收件箱确认送达。

账号分组额外提供 `mailReady`、`roleOptions`。`email_code_minutes` 必须为 5–30 的整数；`register_enabled`、`password_reset_enabled` 为布尔值；`registration_role_id` 为角色 ID 字符串，空字符串表示不授予业务角色。

## 账号自助接口

| 接口                        | 请求与行为                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `GET /auth/capabilities`    | 可选 `tenantCode`，返回 registrationEnabled、passwordResetEnabled、emailEnabled、codeMinutes |
| `POST /auth/email-code`     | tenantCode、userName、email、purpose（register/reset）；返回 expiresIn 秒与 retryAfter 秒    |
| `POST /auth/register`       | tenantCode、userName、email、code、password；返回字符串 userId，不接受角色或状态             |
| `POST /auth/password-reset` | 同上；只重置已有、启用且匹配已验证邮箱的账号，撤销旧会话                                     |
| `GET /auth/email`           | 需登录；返回 email、verified、enabled、codeMinutes                                           |
| `POST /auth/email/code`     | 需登录；email、password（当前密码），发送绑定验证码                                          |
| `PUT /auth/email`           | 需登录；email、password、code，验证后绑定邮箱                                                |

沿用统一响应与租户登录定位。错误使用 `ACCOUNT_SERVICE_DISABLED`、`MAIL_NOT_CONFIGURED`、`MAIL_SEND_FAILED`、`EMAIL_CODE_INVALID`、`EMAIL_RATE_LIMITED`（429）、`EMAIL_VERIFICATION_UNAVAILABLE`（503）、`REGISTRATION_ROLE_INVALID`、`REGISTRATION_CONFLICT` 和 `TENANT_REQUIRED`。找回发码响应不透露账号是否存在；邮件在响应后发送，投递失败仅记录不含身份或验证码的事件，用户可在冷却结束后重试。

验证码使用 Redis TTL 与原子一次性校验，绑定租户、用途、身份和安全版本。密码重置成功后原验证码及旧会话不可复用。验证码在数据库写入前消费；数据库写入失败需要重新发码，不恢复旧码。
