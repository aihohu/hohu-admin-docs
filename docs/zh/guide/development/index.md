---
title: 开发指南
description: 使用 CLI 运行 HoHu 源码，了解后端分层，并为业务模块接入权限、租户范围和基础服务。
---

# 开发指南

本指南面向二次开发者；日常操作请看[使用指南](../user/index)。

1. 使用 CLI 准备[开发环境](../quick-start)，确认配套组件版本。
2. 阅读[后端架构](../backend/introduction)与[目录结构](../backend/dir)，再[增加业务模块](./module)。
3. 所有业务访问接入[功能权限](../auth)、[数据范围](../data-permission)与可信租户范围。
4. 按需接入[分页](../page)、[上传](../file-upload)、[缓存](../backend/cache)、[定时任务](../scheduled-job)及[国际化](./i18n)。

贡献流程、测试隔离、数据库迁移及 ADR 保留在各代码仓库，开发前阅读对应 README、CONTRIBUTING/AGENTS 和正式维护文档。源码入口见[源码与许可](../src)。

本站教程是产品开发说明，不替代代码仓库的安全约束；示例中的查询必须保持 tenant、owner 和权限边界。

## 为业务接入 AI

完成业务模块后，按[AI 工具教程](./ai-tools)接入查询、确认与结果展示。使用编码助手完成源码开发则见 [AI 辅助开发](../ai-coding)。
