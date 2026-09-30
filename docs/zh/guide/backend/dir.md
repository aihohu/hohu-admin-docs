---
title: 目录结构
description: HoHu 后端与 Web 业务模块的目录、包导出、路由注册、模型发现及 AI 工具接入位置。
---

# 目录结构

新增模块前先阅读目标仓库的 `AGENTS.md` 和相邻模块。本页以业务便签为例，说明源码放在哪里、如何被应用加载。既有模块采用不同布局时，扩展遵循其现有结构。

## 后端项目

```text
hohu-admin/
├── app/
│   ├── core/
│   ├── db/
│   ├── middleware/
│   ├── modules/
│   ├── schemas/
│   ├── tasks/
│   ├── utils/
│   └── main.py
├── alembic/versions/
├── scripts/
├── tools/checks/
├── tests/
└── docs/
```

`core/` 提供配置、安全与领域异常，`db/` 管理数据库会话和 Base，`modules/` 按业务域组织功能。跨模块公共 Schema 放 `schemas/`，无业务状态的通用工具放 `utils/`。API 入口由 `app/main.py` 注册；数据库结构通过 Alembic 迁移。

## 新业务模块

```text
app/modules/notes/
├── __init__.py
├── api/
│   ├── __init__.py
│   └── note.py
├── models/
│   ├── __init__.py
│   └── note.py
├── schemas/
│   ├── __init__.py
│   └── note.py
├── service/
│   ├── __init__.py
│   ├── note.py
│   └── projection.py
├── ai_tools/
│   ├── __init__.py
│   └── note.py
└── menu_seed.py
```

| 位置                    | 职责                                                            |
| ----------------------- | --------------------------------------------------------------- |
| `api/note.py`           | HTTP 校验、权限依赖、调用 Service、成功后提交事务               |
| `models/note.py`        | ORM 模型、Snowflake ID、租户外键和数据库约束                    |
| `schemas/note.py`       | 请求与响应校验、camelCase 映射、ID 字符串序列化                 |
| `service/note.py`       | 查询和业务规则，提供模块单例，允许 flush、不提交事务            |
| `service/projection.py` | AI 历史结果的当前访问范围校验                                   |
| `ai_tools/note.py`      | 工具声明与同文件预演函数，调用已有 Service，由 Gateway 管理事务 |
| `menu_seed.py`          | 模块页面及按钮权限定义                                          |

每个 Python 包都需要 `__init__.py`。API、Model、Schema 和 Service 的包入口导出实际使用的对象，完整代码见[新增业务模块](../development/module)。`ai_tools/__init__.py` 可为空，工具加载器显式导入 `app.modules.notes.ai_tools.note`；预演函数与工具函数保持在同一文件。

模块内分层依赖保持单向；跨模块业务调用通过对方 Service。权限范围必须落实到查询和写入，目录布局本身不会建立权限边界。

## 注册与检查

| 新增内容        | 还需更新                                                                                |
| --------------- | --------------------------------------------------------------------------------------- |
| API 路由        | `app/main.py`                                                                           |
| ORM 模型        | `alembic/env.py` 的模型导入、审核后的 Alembic migration                                 |
| 租户业务表      | `app/core/tenant_inventory.py` 及资源清单回归                                           |
| 菜单与按钮      | `app/modules/system/menu_seed.py`，同步后显式授权角色                                   |
| Hosted 租户能力 | `app/modules/system/hosted_menu_seed.py`，目标租户菜单同步和授权                        |
| AI 工具与助手   | 工具加载清单、助手种子、提示词、结果访问校验，见[业务工具接入](../development/ai-tools) |

迁移链、资源清单和 AI 工具清单的测试与模块一起更新，保留历史回归和既有断言。后端测试按实现路径放到 `tests/modules/<module>/` 等对应目录。新建时间列使用 UTC 和时区类型；业务 Schema、接口及权限约定见[后端架构](./introduction)。

## Web 模块

```text
hohu-admin-web/src/
├── views/notes/index.vue
├── service/api/notes.ts
├── typings/api/notes.d.ts
└── locales/notes.ts
```

页面放 `views/<module>/`，HTTP 封装放 `service/api/` 并按项目惯例从 `service/api/index.ts` 导出，业务类型放 `typings/api/` 的 `Api.<Module>` 命名空间。较复杂页面可在页面目录中添加 `modules/`；共享状态按需求放到 `store/modules/`。

示例的语言资源需要合并到实际语言文件及 `App.I18n.Schema`；仅新增文件不会自动加载。业务只需单语言时按需求实现，保留框架自带国际化。

运行 dev server 后，Elegant Router 根据 `views/` 自动生成路由及类型。不要手改生成文件，也不要把 `pnpm gen-route` 当作无交互刷新命令；目标版本可能将它用于交互式页面创建。

完整操作从[新增业务模块](../development/module)开始，再接入[应用 AI 工具](../development/ai-tools)。
