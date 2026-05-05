---
title: 介绍
description: HoHu Admin 是一款专为 AI 协作开发优化的企业级后台管理系统，结合 FastAPI 异步框架与 Vue3，实现模块化解耦与显式语义化设计
---

# 介绍

### 基于 FastAPI & AI 驱动的现代化高效率全栈开发框架

HoHu Admin 是一款专为 **AI 协作开发** 优化的企业级后台管理系统。它结合了 Python 生态中最轻快的 **FastAPI** 异步框架与 **Vue3** 极致的 UI 体验，旨在让开发者在 AI（如 Gemini, Cursor, ChatGPT）的辅助下，以极速构建出高性能、可维护的业务系统。

## 🌟 核心愿景：AI First

在传统的开发模式中，脚手架往往臃肿且逻辑耦合。HoHu Admin 采用了**模块化解耦**与**显式语义化**的设计准则，使得 AI 能够精准理解代码结构，从而生成更准确的功能代码。

## 🔥 为什么选择 HoHu Admin？

### 🤖 深度 AI 适配 (AI-Ready)

- **标准化 Schema**：严格的 Pydantic V2 定义，AI 可以通过 Schema 快速推断 API 协议，实现前端代码零修改对接。
- **显式类型注入**：全链路 Python Type Hints 覆盖，让 Cursor 或 Copilot 的补全准确率提升 80% 以上。
- **提示词友好架构**：项目结构遵循行业标准 RESTful 规范，你可以直接将项目目录结构喂给 AI，它能立刻理解业务边界。

### ⚡ 极致性能与安全

- **异步动力源**：全链路 `asyncio` 驱动，支持高并发处理，轻松应对高性能业务场景。
- **RBAC 权限闭环**：精细到按钮级的权限管理，支持动态路由生成，完美适配 前端 的权限模型。
- **雪花算法集成**：内置高性能分布式 ID 生成器，彻底告别自增 ID 的安全隐患。

### 🛠️ 模块化分层设计

- **零耦合目录**：系统模块（用户、角色、菜单、日志）高度自治，新业务模块可一键平移，避免代码“屎山”。
- **自动化迁移**：集成 Alembic 数据库迁移工具，版本控制像 Git 一样管理数据库变更。

## 🚀 AI 辅助开发流 (AI-Assisted Workflow)

在 HoHu Admin 中，你可以通过以下流程快速交付功能：

1. **定义模型**：向 AI 描述业务实体，自动生成 `SQLAlchemy` 模型。
2. **生成 CRUD**：利用 HoHu Admin 预设的 BaseService 模板，AI 可秒级产出完整的增删改查逻辑。
3. **协议同步**：AI 自动根据 Pydantic 定义生成前端请求类型，打通前后端最后 1 厘米。

## 🛠️ 技术栈

- **Backend**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL / MySQL (via SQLAlchemy 2.0)
- **Cache**: Redis (Async)
- **Auth**: JWT / OAuth2
