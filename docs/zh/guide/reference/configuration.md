---
title: 配置项归属
description: 明确 HoHu 环境变量、系统设置、模型参数和业务自定义参数各自负责的配置范围。
---

# 配置项归属

业务设置与部署环境分别维护，不要求用户为每次品牌或上传偏好调整修改环境文件。

| 内容                                | 唯一配置入口             | 生效方式                               |
| ----------------------------------- | ------------------------ | -------------------------------------- |
| 品牌、账号默认值、语言、协议        | 系统设置                 | 租户数据，保存后由消费者读取           |
| 上传偏好与允许格式                  | 系统设置的文件分组       | 后续请求按有效策略检查                 |
| 登录/注册/API 每分钟额度            | 系统设置的访问保护       | 系统管理员维护，Redis 计数，多实例共享 |
| AI 输出 token / temperature         | 每模型 config.generation | 留空省略参数，受模型支持能力约束       |
| 数据库、Redis、JWT 密钥             | 部署环境                 | 传入进程，变更后重启                   |
| 存储根、租户模式、AI 开关与进程拓扑 | 部署环境                 | 影响启动与安全边界                     |
| 业务自定义参数                      | 独立自定义参数菜单       | 由具体业务代码消费                     |

## 关键环境项

- `DATABASE_URL`、`SECRET_KEY`、`REDIS_HOST/PORT/PASSWORD/DB`：基础依赖及认证。
- `TENANT_MODE`、`TENANT_HOSTED_LOGIN_ENABLED`、`RELEASE_BUILD_SHA`：租户模式与生产 hosted 构建标识。
- `UPLOAD_HARD_MAX_BYTES`：单文件部署硬上限，默认 100 MiB；CLI 派生 `UPLOAD_REQUEST_MAX_BYTES` 供代理使用。
- `UPLOAD_DIR`、`PRIVATE_UPLOAD_DIR`、`LOCAL_FILE_STORAGE_ROOT`：公共与私有存储边界。
- `APP_ROLE`、`AI_MODULE_ENABLED`、`AI_HITL_MODE`、`AI_REQUIRE_SINGLE_WORKER`：进程职责与 AI 运行模式。
- `AI_PROVIDER_EGRESS_ALLOWED_ORIGINS`、`AI_PROVIDER_EGRESS_ALLOWED_CIDRS`、`AI_PROVIDER_EGRESS_PROXY`：Provider 网络边界；同前缀还有超时、响应大小、并发与重试配置。
- `DEFAULT_LOCALE`：用户与租户未指定语言时的部署默认值。

完整定义以匹配后端的 `app/core/config.py`、环境模板和 CLI Compose 模板为准；不是每个后端变量都会自动从部署 `.env` 透传。必要时通过受控 Compose 配置注入并验证进程实际收到的值。

已移除旧 `AI_MAX_TOKENS`、`AI_TEMPERATURE`、`RATE_LIMIT_LOGIN/REGISTER/API`、`UPLOAD_MAX_SIZE` 和 `UPLOAD_ALLOWED_EXTENSIONS`，不要按旧教程添加这些项。敏感值不进入文档、截图或仓库。
