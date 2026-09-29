---
title: 新增业务模块
description: 通过业务便签示例接入 SQLAlchemy 模型、租户隔离、FastAPI 接口、权限菜单和前端请求。
---

# 新增业务模块

本教程在已有 HoHu 项目中增加“业务便签”，完成创建和分页查看两个操作。先完成[开发环境](../quick-start)。示例是源码扩展，不是独立插件安装协议。

## 独立项目与文件清单

首次学习请先按[开发环境](../quick-start)用 `hohu create notes-tutorial` 创建只包含 Backend 和 Frontend 的新项目，再执行 `hohu init` 和 `hohu dev`，完成首次登录。使用专用数据库和独立 Redis 实例；不要沿用已有应用的 `.env`、密钥或数据库。与其他项目并行运行时还需调整端口及前端代理，不能只修改浏览器地址。以下命令中的“后端目录”和“Web 目录”分别指这个新项目的 `hohu-admin/` 与 `hohu-admin-web/`。

文档仓库的 `examples/notes/` 是示例来源，不是运行目录。将 Python 文件复制到后端 `app/modules/notes/`；将 `notes.ts`、`index.vue`、`locales.ts` 分别放到后文指定的 Web 路径。`ai_tools.py` 与 `projection.py` 留到下一篇再接入。不要把整份 examples 目录直接放进后端。

## 1. 确定边界

同一租户中，拥有查看权限的用户可以读取该租户的全部便签；只有拥有新增权限的用户可以创建。它不包含个人私有便签、部门范围、编辑、删除或 AI 工具接入。需要这些能力时，应先补充相应权限和回归测试。

| 项目     | 约定                                          |
| -------- | --------------------------------------------- |
| 数据表   | `biz_note`                                    |
| 接口     | `GET /business/notes`、`POST /business/notes` |
| 查看权限 | `business:note:list`                          |
| 创建权限 | `business:note:add`                           |
| 前端页面 | `src/views/notes/index.vue`                   |
| 租户来源 | 认证后的 `TenantContext`，不从请求体接收      |

## 2. 创建模型和输入输出

在后端创建 `app/modules/notes/`，添加空的 `__init__.py`，再创建以下文件。完整示例也保存在文档仓库的 `examples/notes/`。

**models.py**

<<< ../../../../examples/notes/models.py

联合索引服务于租户内按 ID 分页。外键约束租户必须存在；如果以后关联客户、订单等业务对象，还要增加同租户关联约束。

**schemas.py**

<<< ../../../../examples/notes/schemas.py

创建请求拒绝未声明字段，避免客户端传入 `tenantId`。输出使用 `noteId`，值为字符串，以保留 Snowflake ID 精度。便签标题属于用户数据，不随界面语言翻译。

## 3. 实现服务与接口

**service.py**

<<< ../../../../examples/notes/service.py

列表和总数使用相同租户范围。Service 只 flush，不 commit；排序显式使用 ID。本例展开分页 SQL 便于理解作用域，通用模块也可以复用[分页工具](../page)。

**api.py**

<<< ../../../../examples/notes/api.py

API 层认证、检查功能权限、取得可信租户上下文，并在创建成功后提交事务。不要用前端隐藏按钮替代接口权限，也不要把业务异常改成未约定的响应结构。

## 4. 注册路由并生成迁移

在 `app/main.py` 的路由注册位置加入：

```python
from app.modules.notes.api import router as notes_router

app.include_router(notes_router)
```

在 `alembic/env.py` 的模型导入区加入 `from app.modules.notes.models import Note`，确保模型进入已有的 Base.metadata，然后在后端目录执行：

```bash
uv run alembic revision --autogenerate -m "add business notes"
```

审查迁移只包含预期的 `biz_note` 表、外键和索引；如果出现其他表的删除，不要执行，先检查模型导入是否完整。确认后在开发库运行：

```bash
uv run alembic upgrade head
```

重启后端，在 `/docs` 中应出现 Notes 分组和两个接口。不要在启动代码中调用 `Base.metadata.create_all()` 代替迁移。

## 5. 接入完整 Web 页面、翻译和菜单

以下所有 Web 路径相对 `hohu-admin-web/`。先完成翻译接线，再运行类型检查；否则新增 `$t` 键会报类型错误。

### 请求和页面

将请求文件保存为 `src/service/api/notes.ts`：

<<< ../../../../examples/notes/notes.ts

创建 `src/views/notes/index.vue`：

<<< ../../../../examples/notes/index.vue

页面包含创建表单、标题校验、保存状态、刷新、分页和按钮权限。失败时保留输入，成功后回到第一页；列表使用请求序号防止较早的响应覆盖较新的分页结果。服务端仍是权限与租户隔离的最终边界。

### 中英文资源与类型

将下面的共享资源保存为 `src/locales/notes.ts`，其中同时包含页面、菜单、AI 助手和错误文本，下一篇不需要重复添加：

<<< ../../../../examples/notes/locales.ts

在 `src/locales/langs/zh-cn.ts` 顶部添加 `import { notesZh as notesMessages } from '../notes';`；在 `en-us.ts` 顶部添加 `import { notesEn as notesMessages } from '../notes';`。两个文件都按以下位置合并，保留原有属性，不用本段替换整个语言文件：

```typescript
// 原有 const local: App.I18n.Schema = { ... } 内：
notes: notesMessages.notes,
// 将原来的 builtin, 改为：
builtin: {
  ...builtin,
  permission: { ...builtin.permission, ...notesMessages.permission },
  agent: { ...builtin.agent, ...notesMessages.agent }
},
// 原有 route: { ... } 内追加：
...notesMessages.route,
// 原有 errorCode: { ... } 内追加（根级 errorCode，不是 page 内的同名属性）：
...notesMessages.errorCode,
// 原有 ai: { tool: { ... } } 的 tool 内追加：
...notesMessages.tool,
// page.ai.chat:
...notesMessages.chat,
```

在 `src/typings/app.d.ts` 的 `App.I18n.Schema` 中做四处扩展：

```typescript
// Schema 根级，与 settings、builtin 同级：
notes: typeof import('../locales/notes').notesEn.notes;
// Schema.ai.tool 内，与 field、user 同级：
note: typeof import('../locales/notes').notesEn.tool.note;
// Schema.errorCode 内：
NOTE_TITLE_INVALID: string;
NOTE_APPROVAL_REQUIRED: string;
// Schema.page.ai.chat:
confirmNoteCreate: string;
```

`route` 已允许字符串键；`builtin.permission` 与 `builtin.agent` 已使用 Record 类型，不需要添加硬编码类型。不要修改自动生成的路由类型，dev server 会随页面生成 `notes` 路由。

### 完整菜单种子

将下面文件保存为后端 `app/modules/notes/menu_seed.py`：

<<< ../../../../examples/notes/menu_seed.py

在 `app/modules/system/menu_seed.py` 的导入区加入 `from app.modules.notes.menu_seed import NOTE_MENUS`，在完整 `MENU_DEFINITIONS = [...]` 列表结束后加入一行：

```python
MENU_DEFINITIONS.extend(NOTE_MENUS)
```

这行只添加一次。同步器会为按钮生成 `builtin.permission.business_note_list` 和 `builtin.permission.business_note_add`，上面的资源已提供对应翻译。

在后端目录执行 `uv run python -m scripts.sync_menus`。在项目根目录运行 `hohu dev`，等待前端路由自动生成，再在 Web 目录运行 `pnpm typecheck`。后端 `/docs` 中有 Notes 分组、前端存在 `/notes` 路由后继续授权。

### 创建验收角色

用开发实例管理员进入“权限管理 → 角色管理”，创建专用测试角色，授予“业务便签”页面及“查看便签”“创建便签”按钮。创建一个普通测试用户并分配该角色，使用独立浏览器会话登录，打开业务便签页面；不要只用管理员验证。管理员需要已有角色菜单授权和用户角色授权权限。

菜单同步不等于自动授权，旧登录状态需退出再登录刷新。默认租户是本教程的首个验证范围；hosted 租户需要另外配置能力目录和菜单同步，见[多租户管理](../operations/tenants)。不要把“切换租户后菜单不存在”当成数据隔离验证成功。

## 6. 验证闭环

先在新项目的后端目录运行 `uv run ruff check app/modules/notes`，在 Web 目录运行 `pnpm typecheck`。然后使用普通测试用户完成下表，并保留实际结果；编译通过不等于操作验收通过。

通过 `/docs` 使用开发账号的 access token 授权，向 POST 接口提交 `{"title":"First note"}`。响应应包含 `code: 200` 和字符串 `data.noteId`。GET 接口应返回 `records`、`total`、`current`、`size`。

| 验证                  | 预期                          |
| --------------------- | ----------------------------- |
| 创建后刷新列表        | 能找到刚创建的标题            |
| 提交空标题或 tenantId | 输入校验拒绝                  |
| 普通角色没有新增权限  | POST 被拒绝，即使自行构造请求 |
| 切换到另一个租户      | 列表和总数均不包含原租户便签  |
| Service 后回滚事务    | 新增记录不落库                |

文档仓库提供内存 SQLite 验证 `tests/test_notes_example.py`，覆盖列表和 count 隔离、分页、输入、ID 字符串化与回滚。它不替代 PostgreSQL 迁移、HTTP 认证和浏览器测试。使用后端虚拟环境，设置 `HOHU_BACKEND_PATH` 指向后端仓库后运行此文件；测试不会连接业务数据库。

完成后将迁移、模块、菜单、前端页面和双语资源一起纳入版本管理。生产发布通过既有 CLI 流程执行，不把示例测试或演示数据加入初始化脚本。

## 完成时应有的文件

| 位置                      | 新增或修改                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------- |
| 后端 `app/modules/notes/` | `__init__.py`、`models.py`、`schemas.py`、`service.py`、`api.py`、`menu_seed.py`   |
| 后端注册                  | `app/main.py`、`alembic/env.py`、`app/modules/system/menu_seed.py`                 |
| 数据库                    | `alembic/versions/` 中本次生成并审核的迁移文件                                     |
| Web                       | `src/service/api/notes.ts`、`src/views/notes/index.vue`、`src/locales/notes.ts`    |
| Web 接线                  | 两个 `src/locales/langs/*.ts` 语言文件、`src/typings/app.d.ts`、自动生成的路由文件 |

若菜单存在但页面加载失败，检查文件目标路径、dev server 路由生成日志以及 `component` 是否为 `layout.base$view.notes`。若页面出现语言键而非文字，检查资源是否合并到正确层级。若保存失败，不要直接在数据库插入记录绕过接口，先检查接口响应和当前角色权限。

## 下一步：接入 AI

继续[让 AI 使用业务模块](./ai-tools)，为便签接入查询工具和确认后创建。HTTP 接口和菜单完成后，不会自动出现在 AI 工具集合中。
