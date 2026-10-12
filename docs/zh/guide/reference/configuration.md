---
title: 配置参考
description: 查阅 HoHu 环境变量、配置归属、生效方式、Compose 覆盖优先级与旧参数迁移。
---

# 配置参考

先判断配置的归属，再修改对应入口。完整环境参数以同版本后端 `app/core/config.py` 和部署模板为准。

## 配置归属与生效

| 内容                          | 配置入口                 | 生效方式                                   |
| ----------------------------- | ------------------------ | ------------------------------------------ |
| 品牌、账号默认值、语言、协议  | 系统设置                 | 保存后由后续读取使用；已有页面可能需要刷新 |
| 上传格式与租户额度            | 系统设置 → 文件          | 后续上传按新策略校验                       |
| 登录、注册、API 每分钟额度    | 系统设置 → 访问保护      | 系统管理员配置，共用 Redis 计数            |
| SMTP、发件人和加密凭据        | 系统设置 → 邮件服务      | 系统级配置，保存后测试发送                 |
| AI 输出 token、temperature    | 模型的 config.generation | 按模型传递，留空不发送，支持程度取决于模型 |
| 数据库、Redis、密钥、进程角色 | 部署环境                 | 重新创建容器；源码进程需重启               |
| 存储目录、租户模式、AI 总开关 | 部署环境                 | 启动时建立运行与安全边界                   |
| 自定义业务参数                | 独立参数菜单             | 由业务代码读取，不自动成为系统设置         |

## 关键环境变量速查

| 参数                                                                                                   | 用途与注意事项                                                             |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `ENV`                                                                                                  | dev / test / prod；生产模式关闭内置 OpenAPI 页面                           |
| `DATABASE_URL`                                                                                         | PostgreSQL 连接，特殊字符按 URL 规则编码                                   |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` / `REDIS_DB`                                            | Redis 连接与隔离数据库编号                                                 |
| `SECRET_KEY`                                                                                           | JWT 签名和加密值的密钥来源；生产要求至少 32 字符，随备份受控保存           |
| `SERVER_URL`                                                                                           | 对外访问源地址；生产设置非空值时要求 HTTPS，不附带业务路径、查询参数或凭据 |
| `APP_ROLE`                                                                                             | api / scheduler / all；CLI 将 API 与 scheduler 分开运行                    |
| `TENANT_MODE`                                                                                          | single（默认）或 hosted，见[多租户](../operations/tenants)                 |
| `TENANT_HOSTED_LOGIN_ENABLED` / `RELEASE_BUILD_SHA`                                                    | hosted 运行开关与生产构建标识，不能只改租户模式                            |
| `UPLOAD_HARD_MAX_BYTES`                                                                                | 部署文件硬上限，默认 104857600（100 MiB）                                  |
| `UPLOAD_DIR` / `PRIVATE_UPLOAD_DIR` / `LOCAL_FILE_STORAGE_ROOT`                                        | 文件目录与本地存储边界，API 与 scheduler 需访问同一份持久文件              |
| `AI_MODULE_ENABLED`                                                                                    | AI 模块总开关，默认 true                                                   |
| `AI_HITL_MODE` / `AI_REQUIRE_SINGLE_WORKER`                                                            | 默认 memory / true；扩容前看 [AI 配置与运维](../operations/ai)             |
| `AI_PROVIDER_EGRESS_ALLOWED_ORIGINS` / `AI_PROVIDER_EGRESS_ALLOWED_CIDRS` / `AI_PROVIDER_EGRESS_PROXY` | Provider 出站网络边界；同前缀还包含超时、响应大小、并发与重试参数          |
| `DEFAULT_LOCALE`                                                                                       | 无用户或租户偏好时的回退语言，默认 zh-CN                                   |

这些是**后端参数**。镜像、端口、启用内置依赖等 CLI 配置见[部署配置参考](../cli/configuration)。不要把客户端公开环境变量用于保存服务端密钥。

## Compose 中的配置优先级

当前 API、scheduler、migrator 通过 `env_file` 读取部署 `.env`，但 Compose 服务的显式 `environment` 会覆盖同名值。只修改 `.env` 不保证最终进程配置改变。

CLI 依次合并基础 Compose、生成的 `docker-compose.infra.yml` 和用户的 `docker-compose.override.yml`。用户 override 最后加载；修改模板中已固定的参数时，在相应服务下显式覆盖。外部依赖还需补充 scheduler 连接以及 API 的自定义 Redis 端口与数据库编号，见[外部依赖](../deploy#external-services)。

保存后重新部署并检查相关服务。`hohu deploy restart` 只重启现有容器，不重新加载容器环境。检查渲染后的 Compose 或容器环境时会出现凭据，不要粘贴到公开日志。

## 邮件与旧参数迁移

SMTP 无需通过环境变量配置。系统级邮件服务与租户级注册、找回密码开关分开维护；凭据使用部署密钥加密。字段与并发规则见[设置接口](./settings)。

| 已移除参数                                                    | 当前入口                            |
| ------------------------------------------------------------- | ----------------------------------- |
| `AI_MAX_TOKENS` / `AI_TEMPERATURE`                            | 模型 config.generation              |
| `RATE_LIMIT_LOGIN` / `RATE_LIMIT_REGISTER` / `RATE_LIMIT_API` | 系统设置 → 访问保护                 |
| `UPLOAD_MAX_SIZE` / `UPLOAD_ALLOWED_EXTENSIONS`               | 系统设置 → 文件，并受部署硬上限约束 |

旧教程中的参数不要直接加入新版本环境文件。密钥变更会影响现有会话与已加密值，按[备份恢复](../operations/upgrade)规划，不能仅替换字符串后丢弃旧密钥。
