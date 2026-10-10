---
title: 使用 FastAPI 与 Vue 开发业务模块
description: '使用 Python、FastAPI 和 Vue 3 扩展 HoHu，开发业务模型、接口与页面，复用权限、租户隔离和 AI 工具能力。'
---

# 使用 FastAPI 与 Vue 开发业务模块

本指南面向二次开发者；日常操作请看[使用指南](../user/index)。

HoHu 提供 FastAPI 后端和 Vue 3 Web 界面。你可以从一个业务模块开始，复用平台的用户、权限与租户范围，再按需为 AI 助手接入业务工具。CLI 和 Skills 提供两种开发入口。

1. 使用 CLI 准备[开发环境](../quick-start)，确认配套组件版本。
2. 阅读[后端架构](../backend/introduction)与[目录结构](../backend/dir)，再[增加业务模块](./module)。
3. 所有业务访问接入[功能权限](../auth)、[数据范围](../data-permission)与可信租户范围。
4. 按需接入[分页](../page)、[上传](../file-upload)、[缓存](../backend/cache)、[定时任务](../scheduled-job)及[国际化](./i18n)。

贡献流程、测试隔离、数据库迁移及当前架构约束保留在各代码仓库，开发前阅读对应 README、CONTRIBUTING/AGENTS 和正式维护文档。源码入口见[源码与许可](../src)。

本站教程是产品开发说明，不替代代码仓库的安全约束；示例中的查询必须保持 tenant、owner 和权限边界。

## 为业务接入 AI

从 [AI 概览](../ai/index)选择任务。使用编程助手开发源码时，先[安装 Skills](../cli/skills)，再按 [AI 辅助开发](../ai-coding)创建项目或开发模块。手动为业务接入查询、确认与结果展示，见[业务工具接入](./ai-tools)。
