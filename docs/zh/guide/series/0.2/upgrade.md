---
title: '0.2 候选：升级与恢复'
description: '0.2 候选的停写、备份、迁移、显式激活与授权连续性恢复要求。'
---

# 0.2 候选：升级与恢复

**尚未正式发布。** 本页用于候选评估与隔离演练，不是正式升级承诺。[0.2 系列首页](index.md)列出源码来源；先阅读[字段策略](field-policies.md)。

候选验收来源是空库和正式 0.1.6；最终支持的平台、镜像摘要、CLI 版本及升级来源只能由正式产品清单确认，不能从数据库迁移可运行推导其他跨版升级支持。

1. 清点旧确认、未知执行、文件及授权撤销记录，备份数据库、上传与私有文件、加密密钥。
2. 停止并隔离旧 API、scheduler、API 内的 AI 恢复/过期任务和其他写者，确认不能重新进入且没有数据库在途事务。直接启动和 Docker Compose 都可使用既有维护接口，Ctrl+C 本身不是可信停写证明。
3. 固定配套 Backend/Web 产物，API 与 scheduler 使用同一 Backend。宿主迁移控制器须使用对应的 Backend 源码及锁定依赖，单独记录执行环境。迁移失败停止初始化，不 `stamp head`；种子失败保持维护状态，排查后显式恢复。
4. 在 `legacy` / `ready` 核对历史、权限和配套 Web，完成全部入口资格验证后按租户显式激活。

激活前的原备份恢复也要匹配原版本和文件、密钥。激活后不得直接回接 0.1.6 后端，或恢复旧库后开放读、下载、AI。灾备时先隔离入口，使用独立于备份的记录证明撤权与策略连续性，核对故障后副作用，再由支持字段策略的版本向前恢复。只恢复数据库、缺文件或缺撤权证据时，受影响入口保持关闭；增加旧备份中的 epoch 不能补足证明。

## 受控安装与 CLI 交接

CLI 0.1.16 默认种子命令不携带本候选要求的维护清单。请按固定源码的[受控安装协议](https://github.com/aihohu/hohu-admin/blob/fb0edbd7879a7ff14df7f010eea7dc4e7faddba5/docs/CONTROLLED-INSTALL.md)，在宿主使用真实清单执行 `controlled_install prepare`：数据库新连接被阻断后，复用保留连接完成迁移和初始化；成功或失败均保持关闭。新装须取得独立 bootstrap 证明，既有部署不能用它绕过停写。

核验成功回执、来源与固定产物后，再显式执行 `controlled_install resume`。仅在上述步骤完成后，用 `hohu deploy --source official --no-migrate` 启动已准备的组合，同时保持用户入口关闭、调度暂停。CLI 不校验回执；此选项用于交接已完成的工作，不能跳过失败迁移或种子。本路径由宿主执行迁移，不能声称未使用的 CLI migrator 容器执行过迁移。维护凭据不得交给普通应用容器。

候选优先 `linux/amd64`、PostgreSQL 15 和 Redis 7。CLI 模板默认的 PostgreSQL 18、Redis 8.6 属于另一组合，不能复用上述证据，必须显式固定基础设施。正式公开前仍需完成最终镜像的安装、升级、恢复及 AI 一致性验收。

运维命令与迁移约束见固定候选源码的[数据库迁移手册](https://github.com/aihohu/hohu-admin/blob/fb0edbd7879a7ff14df7f010eea7dc4e7faddba5/docs/DATABASE-MIGRATIONS.md)。正式升级前仍需检查[稳定版本说明](../../reference/versions.md)与目标版本不可变清单。
