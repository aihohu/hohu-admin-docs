---
title: 目录结构
description: HoHu Admin 后端项目目录结构说明，采用模块化分层设计，API、Service、Model 职责分离
---

# 目录结构

项目采用模块化组织方式，各模块职责明确、功能独立，结构清晰，便于维护与管理。

```text
hohu-admin/
├── app/
│   ├── core/              # 核心框架配置 (Security, JWT, Redis, Config)
│   ├── db/                # 数据库连接与基础 Base 模型
│   │
│   ├── modules/           # 🧩 模块化目录
│   │   ├── auth/          # 认证模块 (登录、Token刷新)
│   │   ├── system/        # 系统管理模块 (User, Role, Menu, Dict)
│   │   │   ├── api/       # 系统接口
│   │   │   ├── crud/      # 系统逻辑
│   │   │   ├── models/    # 系统模型
│   │   │   └── schemas/   # 系统 Schema
│   │   │
│   │   └── business/      # 🚀 二次开发业务占位模块
│   │       ├── api/       # 用户自己的接口
│   │       └── models/    # 用户自己的模型
│   │       └── schemas/   # 用户自己的Schema
│   │
│   └── main.py            # 聚合所有模块的路由
├── scripts/               # 数据初始化脚本
├── alembic/               # 数据库迁移脚本
└── .env                   # 环境变量配置
```
