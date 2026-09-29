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

各组件独立管理版本号。按发布说明选择配套组件，不要求它们具有相同的版本号。通过 `hohu --version` 查看本机 CLI 版本。

## 升级前检查

1. 记录当前应用版本、CLI 版本和部署配置。
2. 阅读目标版本说明，确认数据库起点与配置变更。
3. 完成备份，并在测试环境验证升级步骤。
4. 按[升级、备份与恢复](../operations/upgrade)执行。

安装文档见[快速开始](../quick-start)，生产安装见[部署指南](../deploy)。
