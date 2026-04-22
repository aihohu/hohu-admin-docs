# AI 编程

HoHu Admin 从设计之初就为 **AI 辅助开发** 做了深度优化。本文介绍如何借助 AI 编程工具（推荐 [Claude Code](https://claude.ai/code)）快速搭建和开发项目。

## 推荐工具

| 工具 | 类型 | 适用场景 |
| ---- | ---- | -------- |
| **Claude Code**（推荐） | CLI / IDE 插件 | 全流程开发：代码生成、重构、调试、Git 操作 |
| Cursor | IDE | 实时代码补全和对话式编辑 |
| GitHub Copilot | IDE 插件 | 行级代码补全 |

**为什么推荐 Claude Code？**

- 直接读取整个项目上下文，理解模块间依赖关系
- 内置 CLAUDE.md 支持，自动遵循项目编码规范
- 支持终端操作：运行测试、Git 提交、代码搜索一体化
- 对 Python (FastAPI) 和 TypeScript (Vue) 都有出色的理解能力

## 快速开始

### 1. 用 hohu CLI 创建项目

```bash
# 安装 CLI
uv tool install hohu

# 创建项目，交互式选择组件
hohu create my-project
cd my-project

# 安装依赖
hohu init

# 启动开发服务
hohu dev
```

项目创建后，每个子项目目录下已预置 `CLAUDE.md` 文件，AI 工具打开时会自动读取，无需额外配置。

### 2. 用 Claude Code 开始开发

```bash
# 安装 Claude Code（需要 Node.js 18+）
npm install -g @anthropic-ai/claude-code

# 进入后端目录，启动 Claude Code
cd hohu-admin
claude

# 或进入前端目录
cd ../hohu-admin-web
claude
```

启动后直接用自然语言描述需求即可，例如：

```
> 给用户模块添加一个"头像"字段，需要更新数据库模型、Schema 和 API
```

Claude Code 会自动读取 `CLAUDE.md` 中的项目规范，按照正确的分层模式生成代码。

## 项目约定（AI 自动识别）

HoHu Admin 的架构设计让 AI 能准确理解代码边界。以下是 AI 工具会自动遵循的关键约定：

### 后端分层模式

```
API 层 (app/modules/<module>/api.py)
  ↓ 调用
Service 层 (app/modules/<module>/service.py)
  ↓ 操作
Model 层 (app/modules/<module>/models/)
```

- **API 层**：处理 HTTP 请求，调用 Service，负责 `await db.commit()`
- **Service 层**：业务逻辑，抛出领域异常，**绝不自行 commit**
- **Model 层**：`SQLAlchemy 2.0 Mapped[T]`，主键使用 Snowflake ID

### 前端模块模式

```
页面 (src/views/<module>/index.vue)
  ↓ 调用
API 服务 (src/service/api/<module>.ts)
  ↓ 使用
类型定义 (src/typings/api/<module>.ts)
```

- 新增页面后需执行 `pnpm gen-route` 重新生成路由

### 命名规范

| 层级 | 规范 | 示例 |
| ---- | ---- | ---- |
| 后端 Python | `snake_case` | `user_name`, `get_user_list` |
| 前端 TypeScript | `camelCase` | `userName`, `getUserList` |
| 数据库列 | `snake_case` | `user_name` |
| API 字段传输 | `camelCase` | `userName`（Pydantic 自动转换） |

### 响应格式

所有 API 统一返回：

```json
{ "code": 200, "msg": "success", "data": {} }
```

Snowflake ID 在 JSON 中序列化为**字符串**，防止 JavaScript BigInt 精度丢失。

## AI 辅助开发实战

### 场景一：新增业务模块

向 AI 描述需求，它会按标准分层自动生成代码：

```
> 创建一个"商品管理"模块，包含商品名称、价格、库存、分类字段，
> 需要完整的 CRUD 接口和分页查询。
```

AI 会自动：

1. 在 `app/modules/` 下创建 `product/` 模块目录
2. 定义 SQLAlchemy Model（含 Snowflake ID）
3. 编写 Pydantic Schema（自动 `to_camel` 别名）
4. 实现 Service 层业务逻辑
5. 注册 API 路由

### 场景二：前后端联调

```
> 后端已经有了商品管理接口，帮我在前端创建对应的管理页面，
> 包含列表、新增、编辑、删除功能
```

AI 会自动：

1. 创建 `src/typings/api/product.ts` 类型定义（匹配后端 Schema）
2. 创建 `src/service/api/product.ts` 请求封装
3. 创建 `src/views/product/index.vue` 页面（使用 NaiveUI 组件）
4. 提示你执行 `pnpm gen-route` 注册路由

### 场景三：数据库变更

```
> 给商品表添加"状态"字段，类型是枚举（上架/下架），默认上架
```

AI 会：

1. 修改 SQLAlchemy Model
2. 更新对应 Schema
3. 生成 Alembic 迁移：`alembic revision --autogenerate -m "add product status"`
4. 提示你运行 `alembic upgrade head`

## CLAUDE.md 配置说明

每个子项目的 `CLAUDE.md` 文件是 AI 工具的"项目说明书"。HoHu Admin 已预置完善的配置：

| 子项目 | CLAUDE.md 位置 | 包含内容 |
| ------ | -------------- | -------- |
| hohu-admin | `hohu-admin/CLAUDE.md` | 后端分层规范、依赖注入、异常处理、测试命令 |
| hohu-admin-web | `hohu-admin-web/CLAUDE.md` | 前端组件规范、路由生成、状态管理、构建命令 |
| hohu-admin-app | `hohu-admin-app/CLAUDE.md` | 移动端组件规范、多端适配、构建命令 |
| hohu-cli | `hohu-cli/CLAUDE.md` | CLI 开发规范、i18n、测试命令 |

::: tip 自定义 CLAUDE.md
你可以编辑各子项目的 `CLAUDE.md`，添加团队特有的约定（如业务术语、代码风格偏好）。AI 工具会在每次会话开始时自动读取。
:::

## 常用 AI 提示词参考

### 后端开发

```
# 新增接口
> 在用户模块添加一个修改密码的接口，需要验证旧密码

# 修复 Bug
> 启动后报错 "relation 'user' does not exist"，帮我排查

# 代码审查
> 审查 app/modules/product/service.py 的代码质量
```

### 前端开发

```
# 新增页面
> 创建一个商品管理页面，使用 NaiveUI 表格组件，支持搜索和分页

# 样式调整
> 把登录页面的表单居中显示，宽度改为 400px

# 类型对接
> 根据后端 ProductSchema 生成前端类型定义和 API 请求函数
```

### 跨项目协作

```
> 后端新增了商品分类接口，帮我同步更新前端的类型定义和 API 调用
```

## 效率提升建议

1. **先读后改**：让 AI 先阅读相关代码再修改，避免脱离上下文
2. **小步迭代**：一次描述一个小需求，逐步构建，而非一次性生成整个模块
3. **利用 CLAUDE.md**：把团队约定写入 CLAUDE.md，让 AI 自动遵循
4. **善用 CLI**：`hohu dev` 一键启动所有服务，随时验证 AI 生成的代码
5. **及时验证**：AI 生成代码后，立即用 `hohu dev` 启动项目验证功能

## 相关资源

- [快速开始](/guide/quick-start) — 用 hohu CLI 一键创建项目
- [权限控制](/guide/auth) — RBAC 权限系统详解
- [分页](/guide/page) — 后端分页工具和前端表格组件
- [源码仓库](/guide/src) — 各子项目 GitHub 地址