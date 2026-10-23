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

## 0.1.6 候选状态

目前 Backend/Web 最新已发布版本为 **0.1.5**。**0.1.6 正在冻结，尚未成为取得组合资格的正式产品版本**。候选修复 AI 用户创建与统计的租户范围、写入原子完成、确认回执丢失恢复，以及未知、取消和预检拒绝动作的安全显示。不能为解除会话阻塞而重放结果未知的操作。

候选固定产物新装、原 0.1.5 镜像升级及恢复流程已用 **CLI 0.1.16、linux/amd64** 演练。最终发布 digest 必须重新验收，其他平台仍未经验证。步骤见[固定产物与恢复](../operations/upgrade#fixed-artifacts)。

产品取得资格后，从同号 Backend Release 获取经过校验的 `release.json`，据此选择 Backend/Web digest、CLI 版本、支持平台和已审阅文档快照。组件公告本身不代表组合通过。0.1.6 发布流程不推进系列或 `latest` 别名，不能假设它们会指向 0.1.6。

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
