---
title: AI 配置与运维
description: 配置 HoHu AI 模型连接、访问权限、出站策略和执行进程，并排查运行故障。
---

# AI 配置与运维

基础安装使用 [CLI 部署](../deploy)。AI 默认开启，不代表所有用户自动获得助手、模型或工具权限。

## 模型与授权

1. 配套升级后端、Web 和 CLI，完成迁移与幂等初始化；不逐个手工运行种子脚本。
2. 由独立平台维护身份配置 Provider 与模型目录；默认租户系统管理员分配租户模型策略、管理系统 Agent。两类身份不可混用。
3. 为实际 endpoint 配置精确出站 origin、必要 CIDR 与受控代理，再测试连接。失败时排查策略，不关闭校验绕过。
4. 显式授予 AI 入口、Role-Agent 绑定与工具权限，检查启用状态。shared 或超级管理员角色不是通用 AI 权限旁路。
5. 验证授权用户对话、文件、人工确认，以及无权限、撤权、其他租户被拒绝的路径。

`max_tokens` 控制模型输出 token 额度，`temperature` 调整生成采样；使用每模型 `config.generation`，留空不强制传参。具体支持情况取决于 Provider/模型，不配置已移除的全局 AI 参数。

## 首次连接模型

以下命令在后端目录执行。CLI 已完成依赖安装与数据库初始化，后台服务应保持运行。

1. 创建独立的模型维护身份；命令会交互式要求输入两遍密码（至少 12 位，包含字母和数字）：

   ```bash
   uv run python -m tools.ops.platform_principal create --principal-name model-operator --display-name "Model operator" --permission platform:ai:read --permission platform:ai:write
   ```

   此命令只用于首个平台身份初始化，不是普通应用账号。已有平台身份时使用既有维护流程，不重复创建。

2. 打开后端 `/docs`，调用 `POST /platform/auth/login`，请求体为 `{"principalName":"model-operator","password":"你的平台密码"}`。保存返回的 `data.token` 到当前会话的 `HOHU_PLATFORM_ACCESS_TOKEN` 环境变量；不要提交到 Git。平台 token 默认 15 分钟有效。
3. 在后端 `.env` 设置 `AI_PROVIDER_EGRESS_ALLOWED_ORIGINS`，值为服务商的精确 origin，例如 `https://api.deepseek.com`，不包含 `/v1`。私有地址还需要精确的 `AI_PROVIDER_EGRESS_ALLOWED_CIDRS`。重启后端使配置生效。
4. 准备本地 UTF-8 `provider.json`（包含真实密钥，不提交仓库）：

   ```json
   {
     "providerCode": "deepseek",
     "name": "DeepSeek",
     "apiKey": "替换为密钥",
     "baseUrl": "https://api.deepseek.com",
     "isEnabled": true
   }
   ```

   ```bash
   uv run python -m tools.ops.platform_ai --base-url http://127.0.0.1:8000 --reason "Initial model setup" --ticket-id SETUP-001 --correlation-id model-setup-001 providers create --payload-file provider.json
   ```

   记下返回的 `providerId`。准备 `model.json`：`{"name":"服务商实际模型名称","capabilities":["text"],"isEnabled":true}`，再执行：

   ```bash
   uv run python -m tools.ops.platform_ai --base-url http://127.0.0.1:8000 --reason "Initial model setup" --ticket-id SETUP-001 --correlation-id model-setup-002 models create --provider-id PROVIDER_ID --payload-file model.json
   ```

   替换 `PROVIDER_ID`，记下返回的 `modelId`。模型名称及兼容 API 地址以服务商实际配置为准。

5. 使用默认租户的普通系统管理员登录后台，在租户管理中给目标租户分配该模型并设为默认。接口为 `PUT /platform/tenants/{tenantId}/ai/model-policies/{modelId}`，请求体 `{"enabled":true,"isDefault":true}`。它需要普通系统管理员 token，不能使用上一步的平台 token。默认租户 ID 为 `0`。
6. 在 Agent 管理中启用所需助手，在角色管理中授予 AI 对话菜单、`ai:chat:use` 和助手绑定。普通用户重新登录后，应能选到模型与助手并完成一次真实查询。

直接调用管理 API 时，除 Bearer token 外还需传入 `X-Platform-Reason`、`X-Platform-Ticket`、`X-Correlation-ID` 审计头；上述维护命令会自动添加。配置完成后移除本地明文 payload 文件中的密钥，并清理会话 token。

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

维护工具位于[后端仓库](https://github.com/aihohu/hohu-admin)的 `tools/ops/platform_principal.py` 和 `tools/ops/platform_ai.py`，可通过 `--help` 查看当前版本支持的命令。运维操作需要 reason、ticket、correlation 及审计，不在普通用户页面传递维护凭据。
