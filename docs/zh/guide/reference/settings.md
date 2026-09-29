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

## 统一上传约束

`effective_max_bytes = min(UPLOAD_HARD_MAX_BYTES, tenant_max, scenario_max)`。

- 部署默认硬上限 100 MiB；图片处理硬上限 20 MiB，用户/配置导入及 AI 文本文件处理硬上限 10 MiB。
- 请求体上限为部署硬上限加 1 MiB，约束整个 multipart 请求，超限返回 413。CLI 为两层代理派生一致的 `UPLOAD_REQUEST_MAX_BYTES`。
- 扩展名取租户和场景白名单交集，保留 MIME、解码、XLSX 防炸弹、行数、路径和归属检查。
- `UPLOAD_EXTENSION_UNIVERSE` 是可选扩展名全集，`fields[].options` 下发给客户端；新选项不覆盖存量白名单。
- 当前通用公开上传仅按 JPEG/PNG 内容校验；AI 文本场景支持 csv/xlsx/txt/md/json。全集不是每个场景的支持承诺。
- 降低上传额度不使已有文件下载失效；私有文件读取始终校验当前权限。

登录/注册/API 限流与 AI 工具额度为独立边界。HTTP 超额返回 429 与 Retry-After，Redis 计数故障返回 503，健康检查和 OPTIONS 不计数。
