---
title: '0.2 候选：升级与恢复'
description: '全系统字段权限候选的版本、停写、资格、受控安装、CLI交接与一致恢复边界。'
---

# 0.2 候选：升级与恢复

**尚未正式发布。** 本页用于候选评估和隔离演练。[系列首页](index.md)固定配套源码，[字段权限](field-policies.md)解释当前授权行为。正式支持的平台、镜像摘要、CLI与升级来源只能由目标版本不可变清单确认。

## 安装与首次启用

候选安装目标为 `linux/amd64`、PostgreSQL 15、Redis 7；评估空库和正式0.1.6来源。迁移能执行不等于任意跨版、跨数据库主版本或其他CPU架构已经受支持。API与scheduler使用相同Backend，Web配套固定；宿主控制器使用相同Backend源码与锁定依赖，并单独记录执行环境。

1. 清点全部写者、旧确认、未知执行、历史文件与撤权事实。为每个已初始化或启用租户显式配置三个字段策略管理权限，禁用租户也须检查。
2. 一致备份数据库、公开/私有文件、加密密钥、配置及独立撤权记录。隔离用户入口，停止旧API、scheduler及API内AI恢复/过期任务，禁止旧进程或旧凭据重新进入，核验所有数据库会话和prepared事务。Ctrl+C本身不是证明。
3. 使用真实维护inventory运行 `controlled_install policy-prepare`；空库另需bootstrap证明。新数据库连接保持关闭，以保留连接执行固定迁移与种子。迁移失败不继续初始化，不裸跑 `init_db` 或 `stamp head`。普通 `prepare` 只安装结构与种子，不启用通用字段策略。
4. 部署方提供服务端 `FIELD_POLICY_QUALIFICATION_FILE`：schema 2、最大1MiB、最长24小时，绑定精确Backend SHA、当前迁移 `e020f3b00001`、完整目录/动作/适配器及验收证据。角色权限或浏览器JSON不能代替。
5. 准备服务仅监听loopback，使用已核验的Web准备构建和短期管理会话。逐租户保存候选、封存完整清单、ready并单独确认activate。活跃租户全部对象须生效；禁用/prepared租户可按完整未授予状态隔离，不自动授权。
6. 显式finish再次核验完整租户集合与活动摘要。监听结束、数据库静止后才可生成 `qualified-stopped` 和字节绑定安装回执。无有效资格时finish只关闭编辑，不能恢复。
7. 独立恢复进程核验当前资格、构建/数据库OID/部署绑定、准备进程退出、原始回执与数据库静止及等待窗口，再显式 `controlled_install resume`。这只恢复admission，不启动进程或开放流量。验证成功后由部署方启动配套组合并完成验收。

直接启动支持开发API/scheduler合并，以及API与独立scheduler；Docker Compose沿用同一维护协议，不强制新部署平台。旧Web写保护在服务端执行。过程失败、取消、提交未知或文件记录丢失均保持停写，不自动重试业务。stop保留策略准备要求，删除marker或替换旧回执不能绕过；完成后的原记录按周期归档，后续维护必须使用新的停写记录。

具体命令和资格说明见固定源码的[受控安装协议](https://github.com/aihohu/hohu-admin/blob/1b6abcd85ae800047b72d97d15ff07b52a8aafd0/docs/CONTROLLED-INSTALL.md)、[维护协议](https://github.com/aihohu/hohu-admin/blob/1b6abcd85ae800047b72d97d15ff07b52a8aafd0/docs/AUTHORIZATION-MAINTENANCE.md)及[字段管理](https://github.com/aihohu/hohu-admin/blob/1b6abcd85ae800047b72d97d15ff07b52a8aafd0/docs/FIELD-POLICY-MANAGEMENT.md)。

## CLI 0.1.16 的受控交接

Web 镜像默认是 `single` 模式。hosted 部署须使用 `--build-arg VITE_TENANT_MODE=hosted` 自编译对应Web，并固定其独立digest；运行时设置Nginx环境变量不会重编译界面。Backend另行配置hosted模式，界面模式不授予租户权限。

安装并固定已发布的CLI 0.1.16及其依赖，不使用有本地修改的源码替代。`hohu deploy init` 后，人工override API、scheduler及db-migrator为同一Backend digest，并固定Web、PG15和Redis7。CLI默认PG18/Redis8.6是另一组合，不能继承本候选证据；也不要把完整digest填入仍拼接 `:IMAGE_TAG` 的变量。

宿主控制器完成上述迁移、种子、字段准备和恢复后，才可使用 `hohu deploy --source official --no-migrate` 交接。CLI不验证维护回执；`--no-migrate` 不能跳过失败的工作。本路径没有运行CLI默认migrator容器，不把它记录为实际迁移者。维护数据库凭据和初始化密码不得交给普通应用容器。尚未正式发布的本地组合也不能当作官方0.2产物。

API 容器重建后，其地址可能变化，而未重建的 Web Nginx 仍保留旧的 upstream 地址。CLI 成功和 API 健康不能证明代理已恢复：使用相同 Compose 项目、文件及环境配置，对 `hohu-admin-web` 执行 `nginx -s reload` 或重建该容器，再从 Web 入口验证 API、登录和 AI 流式响应。独立反向代理也须按其配置刷新后端地址。CLI 0.1.16 不会自动重载未变化的 Web 容器。

## 一致恢复与禁止回退

激活前的原备份恢复也必须匹配原版本、数据库、文件和密钥。激活后不能直接接回0.1.6 Backend，或恢复旧库后开放读取、下载与AI。先隔离入口，以独立于备份的记录证明撤权及策略连续性，核对故障后的已完成/未知副作用，再由支持当前策略的版本向前恢复。

缺文件、缺密钥、只有数据库备份或撤权事实不完整时，受影响入口继续关闭。增加旧备份的epoch不能补证明；不重签旧确认、不重执unknown，也不为无来源历史或旧链接补认领。数据库中存在通用策略事实时，DDL downgrade拒绝执行，不能以删表或回退空库替代一致恢复。具体约束见[数据库迁移手册](https://github.com/aihohu/hohu-admin/blob/1b6abcd85ae800047b72d97d15ff07b52a8aafd0/docs/DATABASE-MIGRATIONS.md)。
