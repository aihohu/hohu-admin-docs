---
title: 使用 HoHu 运行 FastAPI 与 Vue 应用
description: '使用 HoHu CLI 创建并运行项目：准备 Python 与 Node.js，配置 PostgreSQL 和 Redis，初始化 FastAPI 后端与 Vue Web 应用，完成第一次登录。'
---

# 使用 HoHu 运行 FastAPI 与 Vue 应用

本教程带你在本机运行 HoHu 的后端和 Web 应用。完成后，你可以登录系统、查看基础功能，并开始开发自己的业务模块。部署到服务器请阅读[部署指南](./deploy)。

## 1. 准备环境

| 工具       | 要求                           | 检查命令                       |
| ---------- | ------------------------------ | ------------------------------ |
| Git        | 用于获取源码                   | `git --version`                |
| Python     | 3.12 或更高版本，后端运行环境  | `python --version`             |
| uv         | Python 依赖与 CLI 管理工具     | `uv --version`                 |
| Node.js    | 22 LTS，且不低于 22.12         | `node --version`               |
| pnpm       | 10.5 或更高版本                | `pnpm --version`               |
| PostgreSQL | 已运行，准备一个专用开发数据库 | 使用数据库客户端确认连接       |
| Redis      | 已运行，并允许后端连接         | `redis-cli ping` 应返回 `PONG` |

Node.js 也可使用满足当前 Vite 要求的其他受支持版本。工具安装说明：[uv](https://docs.astral.sh/uv/getting-started/installation/)、[Node.js](https://nodejs.org/en/download)、[pnpm](https://pnpm.io/installation)。

CLI 负责项目创建、依赖安装、数据库迁移和基础数据初始化；本机开发使用的 PostgreSQL 和 Redis 需要提前准备。不要把开发项目连接到生产数据库。

## 2. 安装 CLI 并创建项目

```bash
uv tool install hohu
hohu --version
hohu create my-project
cd my-project
```

按创建向导选择 **Backend** 和 **Frontend**。需要移动端时再选择 **App**。项目根目录会包含 `.hohu/project.json` 和所选组件的源码目录：

```text
my-project/
├── .hohu/
├── hohu-admin/
└── hohu-admin-web/
```

后续 `hohu` 项目命令都在 `my-project` 内运行。如果终端找不到 `hohu`，重新打开终端，或执行 `uv tool update-shell` 后按提示刷新 PATH。

## 3. 初始化并配置连接

```bash
hohu init
```

CLI 安装依赖，然后在后端创建 `.env`、生成应用密钥与首次管理员密码，并执行数据库迁移和基础数据初始化。

首次使用时，示例数据库连接通常需要调整。如果命令报告连接失败，打开 `hohu-admin/.env`，修改数据库与 Redis 连接，再运行一次 `hohu init`。已经存在的配置和用户密码会保留。

下面是需要核对的连接项；替换示例中的账号、密码、数据库和地址：

```dotenv
DATABASE_URL=postgresql+asyncpg://hohu:YOUR_DATABASE_PASSWORD@127.0.0.1:5432/hohu_dev
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

无密码 Redis 应写成单独一行 `REDIS_PASSWORD=`。不要在空值后保留行内注释；部分 dotenv 解析会把注释当作密码，造成连接地址解析异常。

数据库必须存在，数据库账号需要具备在该开发库创建和修改表的权限。密码含 `@`、`:` 等 URL 特殊字符时，先进行 URL 编码。保留 CLI 生成的 `SECRET_KEY` 和 `HOHU_ADMIN_PASSWORD`。

成功时会显示初始化完成，数据库中已经有管理员、菜单和基础设置。无需再手动运行 `init_db.py` 或 `sync_menus.py`。

## 4. 启动并首次登录

```bash
hohu dev
```

默认 Web 地址为 `http://localhost:9527`，后端为 `http://127.0.0.1:8000`，接口文档为 `http://127.0.0.1:8000/docs`。端口被占用时，以终端实际输出为准。

使用用户名 `admin`，密码为后端 `.env` 中的 `HOHU_ADMIN_PASSWORD`。这是首次初始化凭据；以后修改过密码，应使用修改后的密码。登录后先在个人设置中更换初始密码。

确认能打开系统设置和用户管理页面，说明 Web 与后端已经连接。AI 功能还需要配置模型提供商，见 [AI 配置](./operations/ai)。

## 5. 日常开发

在运行 `hohu dev` 的终端按 Ctrl+C 停止开发服务。需要单独启动组件时：

```bash
hohu dev -o be
hohu dev -o fe
hohu dev -s app
```

前两条分别仅启动后端、仅启动 Web；第三条跳过 App。开始扩展业务时阅读[第一个业务模块](./development/module)，了解代码结构可看[目录说明](./backend/dir)。

## 遇到问题

| 现象                       | 处理方法                                                           |
| -------------------------- | ------------------------------------------------------------------ |
| 提示不在项目中             | 进入包含 `.hohu/project.json` 的项目根目录                         |
| 数据库或 Redis 连接失败    | 确认服务已启动、数据库已创建，并核对后端 `.env` 的连接参数         |
| 初始化失败后再次执行       | 修复具体错误后重新运行 `hohu init`，无需删除数据库                 |
| Web 能打开但登录请求失败   | 确认后端正常启动，核对 Web `.env.development` 的服务地址与代理配置 |
| Windows 出现 symlink EPERM | 启用 Windows 开发者模式，检查项目目录写入权限后重试依赖安装        |
| 初始密码无效               | 确认当前连接的是刚初始化的数据库；初始化不会覆盖已有账号密码       |
