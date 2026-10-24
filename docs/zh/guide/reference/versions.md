---
title: 更新说明
description: '查阅 HoHu 各组件的发布记录，了解升级前需要检查的行为变化、数据库迁移和配置调整。'
---

# 更新说明

升级前先查看目标版本的发布说明，确认新增功能、行为变化、数据库迁移及配置调整。

| 组件           | 发布记录                                                                             |
| -------------- | ------------------------------------------------------------------------------------ |
| 后端与平台核心 | [hohu-admin Releases](https://github.com/aihohu/hohu-admin/releases)                 |
| Web 应用       | [hohu-admin-web Releases](https://github.com/aihohu/hohu-admin-web/releases)         |
| CLI            | [hohu-cli Releases](https://github.com/aihohu/hohu-cli/releases)                     |
| 移动端         | [hohu-admin-app Releases](https://github.com/aihohu/hohu-admin-app/releases)         |
| 桌面端         | [hohu-admin-desktop Releases](https://github.com/aihohu/hohu-admin-desktop/releases) |

本站维护 **0.1 产品系列**文档。Backend 与 Web 使用相同的产品完整版本号，但同号仍须通过组合验收。CLI 独立版本，通过 `hohu --version` 查看本机版本。移动端和桌面端在本产品系列中尚无正式发布。

## 0.1.6 发布与配套

Backend/Web **0.1.6 正式组件已交付，最终 linux/amd64 组合验收与独立复核通过**。本补丁修复 AI 用户创建与统计的租户范围、写入原子完成、确认回执丢失恢复，以及未知、取消和预检拒绝动作的安全显示。不能为解除会话阻塞而重放结果未知的操作。

最终发布 digest 已用 **CLI 0.1.16、linux/amd64** 完成新装、从原 0.1.5 镜像升级及原产物恢复验证。升级使用维护窗口，目标数据库 revision 为 `d01010100101`；恢复必须同时处理数据库、公开与私有文件、原密钥和授权撤销事实。步骤见[固定产物与恢复](../operations/upgrade#fixed-artifacts)。

产品发布以唯一的 [0.1.6 release.json](https://github.com/aihohu/hohu-admin/releases/download/v0.1.6/release.json) 可公开读取并通过校验为完成标志。下载不可覆盖的清单，据此选择 Backend/Web digest、CLI 版本、支持平台、证据和固定文档快照；若文件不可读取或校验失败，停止升级，不能仅凭组件公告判断产品可用。

| 范围            | 0.1.6 配套与限制                                                                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend / Web   | [Backend v0.1.6](https://github.com/aihohu/hohu-admin/releases/tag/v0.1.6) 与 [Web v0.1.6](https://github.com/aihohu/hohu-admin-web/releases/tag/v0.1.6)，使用清单内同次构建的固定 digest |
| 支持平台        | `linux/amd64`；`linux/arm64` 已构建并校验镜像清单，未取得完整运行验收资格                                                                                                                 |
| 升级来源        | 仅实际验证的 `0.1.5`；其他来源不在本次升级承诺内                                                                                                                                          |
| CLI             | 仅验证 `0.1.16`；人工固定 digest，不自动解析清单或提供通用备份、恢复命令                                                                                                                  |
| 移动端 / 桌面端 | `not_released`，没有本版本配套发布                                                                                                                                                        |
| AI 与恢复       | 验证实际工具、确认接口、事务故障及冷恢复；不承诺外部模型内容质量。恢复旧版时关闭旧 AI 写路由，授权版本水位须由部署方证明完整                                                              |

0.1.6 发布流程保留系列与 `latest` 别名的原值，不能假设它们会指向 0.1.6。产品资格不表示已为你的环境部署生产业务；网络、模型配置、凭据、备份与恢复条件仍需在目标环境核验。

## 升级前检查

1. 记录当前应用版本、CLI 版本和部署配置。
2. 阅读目标版本说明，确认数据库起点与配置变更。
3. 完成备份，并在测试环境验证升级步骤。
4. 按[升级、备份与恢复](../operations/upgrade)执行。

安装文档见[快速开始](../quick-start)，生产安装见[部署指南](../deploy)。

## 保存运行版本记录

| 内容   | 记录要求                                                        |
| ------ | --------------------------------------------------------------- |
| 镜像   | 仓库、配置 tag、实际运行 image ID / digest；latest 会随拉取变化 |
| 源码   | 每个独立组件的 tag 或完整 commit SHA                            |
| CLI    | hohu --version 的结果                                           |
| 数据库 | 当前 Alembic revision、数据库主版本与备份时间                   |
| 配置   | 对应部署配置与密钥的受控保存位置，公开记录只保留脱敏信息        |

源码提交、镜像标签和数据库迁移 revision 是不同标识，不能相互替代。本站不提供未经发布验证的“所有最新版兼容”承诺。
