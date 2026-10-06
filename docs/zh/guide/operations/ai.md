---
title: AI 配置与运维
description: 配置 HoHu AI 模型连接、访问权限、出站策略和执行进程，并排查运行故障。
---

# AI 配置与运维

基础安装使用 [CLI 部署](../deploy)。AI 默认开启，不代表所有用户自动获得助手、模型或工具权限。

## 模型与授权

1. 配套升级后端、Web 和 CLI，完成迁移与幂等初始化；不逐个手工运行种子脚本。
2. 默认租户系统超级管理员通过「AI 管理 → 模型管理」配置 Provider 与模型，并通过当前登录会话管理系统 Agent 和租户模型授权。
3. 为实际 endpoint 配置精确出站 origin、必要 CIDR 与受控代理，再测试连接。失败时排查策略，不关闭校验绕过。
4. 显式授予 AI 入口、Role-Agent 绑定与工具权限，检查启用状态。shared 或超级管理员角色不是通用 AI 权限旁路。
5. 验证授权用户对话、文件、人工确认，以及无权限、撤权、其他租户被拒绝的路径。

`max_tokens` 控制模型输出 token 额度，`temperature` 调整生成采样；使用每模型 `config.generation`，留空不强制传参。具体支持情况取决于 Provider/模型，不配置已移除的全局 AI 参数。

## 首次连接模型

使用默认租户内拥有启用系统超级管理员角色的账号登录后台。配置 Provider、模型、Agent 和租户模型授权都复用这次登录；账号名不决定权限，业务租户管理员不能修改全局配置。

1. 在后端 `.env` 设置 `AI_PROVIDER_EGRESS_ALLOWED_ORIGINS`，值为服务商的精确 origin，例如 `https://api.deepseek.com`，不包含 `/v1`。私有地址还需要精确的 `AI_PROVIDER_EGRESS_ALLOWED_CIDRS`。重启后端使配置生效。
2. 进入「AI 管理 → 模型管理」，点击「新增」，填写服务商编码、名称、API Key 和 Base URL。例如编码 `deepseek`、名称 `DeepSeek`；模型名称及兼容 API 地址以服务商实际配置为准。点击「创建配置」保存；列表只显示密钥是否已配置，编辑时 API Key 留空保留原密钥。
3. 在配置抽屉中点击「添加模型」，填写实际模型名称和能力（文本对话至少选 `text`）。API 地址、生成参数和排序位于默认折叠的「高级设置」中；API 地址留空使用 Provider 地址，生成参数留空使用模型默认值。新增配置时先点击「加入模型列表」，再点击「创建配置」；编辑已有配置时点击「保存模型」独立保存，外层「取消」不会撤销已经保存的模型变更。模型编辑未完成时需先完成或取消，再保存配置。先保存 Provider 修改，再对已保存的模型执行「测试连通性」。
4. 在「租户管理 → AI 授权」中给目标租户分配该模型并按需设为默认。默认租户 ID 为 `0`；全局模型启用不会自动为所有租户授权。
5. 在「AI 管理 → Agent 管理」中启用所需助手，在角色管理中授予 AI 对话菜单、`ai:chat:use` 和助手绑定。普通用户重新登录后，应能选到模型与助手并完成一次真实查询。

升级后若看不到「模型管理」，刷新页面或退出后重新登录，以重新获取用户信息与动态菜单；核查当前角色属于默认系统范围且已启用。

直接调用 API 时，使用同一系统超级管理员的普通 Bearer access token：Provider 和模型接口位于 `/platform/ai/providers`，租户授权接口为 `PUT /platform/tenants/{tenantId}/ai/model-policies/{modelId}`，请求体例如 `{"enabled":true,"isDefault":true}`。`/platform` 是兼容接口路径，不表示需要另一套登录。管理请求还需传入 `X-Platform-Reason`、`X-Platform-Ticket`、`X-Correlation-ID` 审计头，网页自动提供这些信息。

需要命令行配置时，在当前会话的 `HOHU_SYSTEM_ACCESS_TOKEN` 中设置普通系统超级管理员 access token，再使用 `uv run python -m tools.ops.platform_ai --help` 查看命令。旧 `HOHU_PLATFORM_ACCESS_TOKEN` 和独立平台 token 不适用于这些接口。凭据和包含密钥的临时文件只保存在本地私有目录，不提交 Git。

## 运行模式

| 模式                        | 约束                                                         |
| --------------------------- | ------------------------------------------------------------ |
| `AI_HITL_MODE=memory`       | 默认，单 API worker；保持 `AI_REQUIRE_SINGLE_WORKER=true`    |
| `AI_HITL_MODE=redis_pubsub` | 跨 worker 通知依赖 Redis；验证确认、断连、过期与恢复后才扩容 |

进程环境必须实际收到配置，不能只在未透传的 `.env` 加一行。API 与 scheduler 分工由 APP_ROLE 控制；多副本还要处理文件共享、持久化与数据库/Redis 容量。私有目录不能由 Nginx 静态公开。

Provider 请求使用允许列表、DNS/IP 校验、超时、响应大小、并发及重试边界。配置名和归属见[配置参考](../reference/configuration)。上传与解析预算独立限制，见[上传策略](../reference/settings)。

## 排查与紧急停用

没有助手时检查入口、角色绑定和工具授权；没有模型时检查租户策略及模型状态；确认超时检查运行模式、worker 数和 Redis。

将 `AI_MODULE_ENABLED=false` 实际传入进程并重启，AI 业务组件停止初始化，`/ai/**` 和 `/platform/ai/**` 返回 503 / `AI_MODULE_DISABLED`。核查非 AI 功能正常，修复原因后再恢复。该开关是部署熔断，不替代日常角色授权。

模型配置的命令行工具位于[后端仓库](https://github.com/aihohu/hohu-admin)的 `tools/ops/platform_ai.py`。它使用正常系统管理员会话并自动添加操作原因、工单及关联信息。
