# 快速开始



## 总览

欢迎使用HoHu Admin！HoHu（鸿鹄）是一套**全栈系统快速开发框架**，能够快速提升项目开发体验。他主要由三端系统组成：

- 服务端：基于FastAPI
- 前端：基于Vue3
- APP：基于UniAPP



## 环境准备

确保你的环境满足以下要求：

- **git**: 你需要git来克隆和管理项目版本。

  

1. 后端环境：
   - **Python** 3.10+ （推荐3.12或更高）
   - **uv** ≥0.5.0（推荐最新版本）
   - **PostgreSQL** 9.6+（推荐18.1）
   - **Redis** 7.2+（推荐8.0或更高）
2. 前端环境：
   - **NodeJS**: >=v20（推荐 v22.19.0 或更高）
   - **pnpm**: >= 9.0.0（推荐最新版本）
3. APP环境：
   - **NodeJS**: >=v20（推荐 18.19.0 或更高）
   - **pnpm**: >= 9.0.0（推荐最新版本）



## 运行系统

### 下载源码

项目是前后端分离的，需要分别拉取前后端代码到本地，[全部源码](/guide/src)

1. 下载**后端**源码：

   ```bash
   git clone https://github.com/aihohu/hohu-admin.git
   ```

   

2. 下载**前端**源码：

   ```bash
   git clone https://github.com/aihohu/hohu-admin-web.git
   ```

   

3. 下载**APP**源码：

   ```bash
   git clone https://github.com/aihohu/hohu-admin-app.git
   ```



### 启动后端服务

1. 准备数据库环境

   克隆项目后，开发者需要在本地或服务器上先创建一个空的数据库

   ```sql
   CREATE DATABASE hohu_admin;
   ```

2. 配置环境变量

   复制 `.env.example` 文件，重命名为 `.env`

   修改下面所有有关`<>`中的内容：

   ```bash
   ENV=dev
   SECRET_KEY=<您的超级密钥>  # 可以使用以下命令生成：openssl rand -hex 32
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   
   DATABASE_URL=postgresql+asyncpg://<数据库用户名>:<数据库密码>@localhost:5432/hohu_admin
   
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   REDIS_DB=0
   ```

3. 安装依赖

   安装所有依赖项:

   ```bash
   uv sync
   ```

   激活虚拟环境:

   ```bash
   source .venv/bin/activate
   ```

4. 执行 数据 迁移（生成表结构）

   HoHu Admin 使用 Alembic 管理数据库版本。执行以下命令会自动在数据库中创建所有表（User, Role, Menu 等）：

   ```bash
   # 确保在项目根目录下
   alembic upgrade head
   ```

   初始化基础数据

   ```bash
   python scripts/init_db.py
   ```

5. 启动

   ```bash
   fastapi dev app/main.py
   ```

   启动成功会输出下面的内容：

   ```bash
    ╭────────── FastAPI CLI - Development mode ───────────╮
    │                                                     │
    │  Serving at: http://127.0.0.1:8000                  │
    │                                                     │
    │  API docs: http://127.0.0.1:8000/docs               │
    │                                                     │
    │  Running in development mode, for production use:   │
    │                                                     │
    │  fastapi run                                        │
    │                                                     │
    ╰─────────────────────────────────────────────────────╯
   
   INFO:     Will watch for changes in these directories: ['/home/user/code/hohu-admin']
   INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
   INFO:     Started reloader process [2248755] using WatchFiles
   INFO:     Started server process [2248757]
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   ```

   

### 启动前端服务



### 启动APP服务