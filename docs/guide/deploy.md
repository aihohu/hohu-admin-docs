# 部署指南

通过 `hohu build` 和 `hohu deploy` 将全栈应用部署到 Linux 服务器，基于 Docker Compose 编排所有服务。

## 架构

```
Internet (:80/:443)
       │
       ▼
┌─────────────────┐
│  Nginx (SSL)    │  SSL 终止，HTTP→HTTPS 重定向
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  hohu-admin-web │  静态文件托管 + /api/ 反向代理
│  (nginx)        │
└────────┬────────┘
         │ /api/
         ▼
┌─────────────────┐
│  hohu-admin-api │  FastAPI + uvicorn
└───┬─────────┬───┘
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│  PG   │ │ Redis │
└───────┘ └───────┘
```

**包含服务：**

| 服务 | 镜像 | 说明 |
|------|------|------|
| postgres | `postgres:16-alpine` | PostgreSQL 数据库（可替换为外部实例） |
| redis | `redis:7-alpine` | Redis 缓存（可替换为外部实例） |
| hohu-admin-api | 后端镜像 | FastAPI 应用 |
| hohu-admin-web | 前端镜像 | Vue 3 静态文件 + API 反代 |
| nginx | `nginx:alpine` | SSL 反向代理（可选） |
| certbot | `certbot/certbot` | Let's Encrypt 自动证书（可选） |

## 前置条件

- Linux 服务器（Ubuntu 22.04+ 推荐）
- Docker 20.10+ 和 Docker Compose V2
- 域名（如需 HTTPS）
- 已安装 hohu-cli：`uv tool install hohu` 或 `pip install hohu`

## 两种部署方式

### 方式一：源码构建部署（适合二次开发）

从本地修改后的源码构建 Docker 镜像，然后部署。

```bash
# 1. 创建并初始化项目
hohu create my-project
cd my-project
hohu init

# 2. 修改源码后构建镜像（自动初始化部署配置）
hohu build

# 3. 按需编辑配置
nano .hohu/deploy/.env

# 4. 部署
hohu deploy
```

### 方式二：官方镜像部署（适合直接使用）

直接拉取官方预构建镜像部署，无需本地源码。

```bash
# 1. 创建项目
hohu create my-project
cd my-project

# 2. 初始化部署配置
hohu deploy init

# 3. 编辑配置
nano .hohu/deploy/.env

# 4. 部署
hohu deploy
```

## 构建镜像

`hohu build` 从本地源码构建 Docker 镜像。首次运行自动初始化 `.hohu/deploy/`（配置文件、`.env`、密钥），无需手动执行 `hohu deploy init`。

```bash
hohu build                  # 构建所有组件
hohu build --only=backend   # 仅构建后端
hohu build --only=frontend  # 仅构建前端
hohu build --no-cache       # 不使用构建缓存
hohu build --tag=v1.0.0     # 自定义镜像标签
hohu build --reset          # 重置为官方镜像
```

| 参数 | 说明 |
|------|------|
| `--only` | 仅构建指定组件（`backend` / `frontend`） |
| `--tag` | 镜像标签，默认 `source` |
| `--no-cache` | 不使用 Docker 构建缓存 |
| `--reset` | 清除本地镜像配置，切回官方 GHCR 镜像 |

## 部署命令

```bash
hohu deploy          # 一键部署（拉取 → 迁移 → 启动）
hohu deploy init     # 初始化部署目录和 .env
hohu deploy pull     # 拉取最新镜像并重启
hohu deploy ps       # 查看服务状态
hohu deploy logs     # 查看日志
hohu deploy logs -f  # 实时跟踪日志
hohu deploy restart  # 重启服务
hohu deploy down     # 停止所有服务
hohu migrate         # 仅运行数据库迁移
hohu migrate --init  # 迁移 + 初始化数据（创建管理员用户和菜单）
```

部署参数：

```bash
hohu deploy --init          # 同时初始化数据库（创建管理员用户和菜单）
hohu deploy --no-migrate    # 跳过数据库迁移
```

## 配置说明

所有配置通过 `.hohu/deploy/.env` 管理。首次部署时自动生成，密码和密钥已自动填充。

### 外部 PostgreSQL / Redis

默认使用 Docker 容器运行 PostgreSQL 和 Redis。如需使用已有的外部实例，编辑 `.env`：

```env
# 禁用内置 PostgreSQL
ENABLE_POSTGRES=false
DATABASE_URL=postgresql+asyncpg://user:password@your-pg-host:5432/dbname

# 禁用内置 Redis
ENABLE_REDIS=false
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
```

禁用后，对应容器不会启动，应用将连接到外部实例。

### 端口暴露

默认不暴露端口。按需在 `.env` 中配置：

```env
WEB_PORT=0.0.0.0:9527     # 前端（绑定所有网卡）
API_PORT=127.0.0.1:8000   # 后端（仅本地访问）
PG_PORT=0.0.0.0:5433      # PostgreSQL
REDIS_PORT=0.0.0.0:6379   # Redis
```

留空或注释掉则不暴露。支持 `端口` 和 `IP:端口` 两种格式。

### Nginx 与 SSL

默认 `ENABLE_NGINX=false`，直接通过 `WEB_PORT` 访问前端。启用 Nginx 可获得 SSL 终止、域名绑定等能力。

编辑 `.env`：

```env
ENABLE_NGINX=true
DOMAIN=example.com
ENABLE_SSL=true
```

#### 方式一：Cloudflare Origin 证书（推荐）

适合域名通过 Cloudflare 代理的场景。证书有效期最长 15 年，无需续期。

1. Cloudflare Dashboard → **SSL/TLS** → **Origin Server** → **Create Certificate**
2. 下载证书文件：
   - **Origin Certificate** → 保存为 `.hohu/deploy/ssl/fullchain.pem`
   - **Private Key** → 保存为 `.hohu/deploy/ssl/privkey.pem`
3. Cloudflare Dashboard → **SSL/TLS** → **Overview** → 加密模式设为 **Full (Strict)**

#### 方式二：Let's Encrypt（Certbot 自动证书）

适合直接暴露公网 IP 的服务器，证书自动申请和续期。

1. 在 `.env` 中设置域名：
   ```env
   DOMAIN=example.com
   ```

2. 首次申请证书（确保域名已解析到服务器 IP）：
   ```bash
   cd .hohu/deploy
   docker compose run --rm certbot certonly \
     --webroot -w /var/www/certbot \
     -d example.com \
     --email admin@example.com \
     --agree-tos --no-eff-email
   ```

3. 修改 `.env` 指向 certbot 证书：
   ```env
   SSL_CERT_PATH=./certbot/live/example.com
   ```

4. 启动部署 + 启用自动续期：
   ```bash
   hohu deploy
   cd .hohu/deploy && docker compose --profile certbot up -d certbot
   ```

> Certbot 容器每 12 小时自动检查续期。Let's Encrypt 证书有效期 90 天，到期前 30 天自动续期。

#### 方式三：手动证书

适合已有证书文件的场景。将证书文件放入 `.hohu/deploy/ssl/`：

```
ssl/
├── fullchain.pem   # 完整证书链
└── privkey.pem     # 私钥
```

`.env` 保持默认：`SSL_CERT_PATH=./ssl`

### 使用自定义 Registry 镜像

如果基于 hohu-admin 二次开发并推送到自己的 Registry，编辑 `.env`：

```env
# 使用 GHCR
API_IMAGE=ghcr.io/your-org/hohu-admin
WEB_IMAGE=ghcr.io/your-org/hohu-admin-web

# 或使用 Docker Hub
API_IMAGE=your-user/hohu-admin
WEB_IMAGE=your-user/hohu-admin-web

IMAGE_TAG=v1.0.0
```

然后执行 `hohu deploy pull` 拉取并重启。

## 环境变量完整参考

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `IMAGE_TAG` | `latest` | 镜像标签 |
| `API_IMAGE` | `ghcr.io/aihohu/hohu-admin` | 后端镜像地址（源码构建时自动设为本地名称） |
| `WEB_IMAGE` | `ghcr.io/aihohu/hohu-admin-web` | 前端镜像地址（源码构建时自动设为本地名称） |
| `ENABLE_POSTGRES` | `true` | 是否使用内置 PostgreSQL |
| `POSTGRES_USER` | `hohu` | PostgreSQL 用户名 |
| `POSTGRES_PASSWORD` | 自动生成 | PostgreSQL 密码 |
| `POSTGRES_DB` | `hohu_admin` | 数据库名 |
| `DATABASE_URL` | - | 外部 PostgreSQL 连接串（`ENABLE_POSTGRES=false` 时必填） |
| `ENABLE_REDIS` | `true` | 是否使用内置 Redis |
| `REDIS_PASSWORD` | 自动生成 | Redis 密码 |
| `REDIS_HOST` | `127.0.0.1` | Redis 地址（`ENABLE_REDIS=false` 时必填） |
| `SECRET_KEY` | 自动生成 | JWT 签名密钥 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` | Token 有效期（分钟） |
| `WORKER_ID` | `1` | Snowflake Worker ID（多实例时需不同） |
| `UVICORN_WORKERS` | `4` | Uvicorn 进程数 |
| `ENABLE_NGINX` | `false` | 是否启用内置 Nginx |
| `DOMAIN` | `localhost` | 域名 |
| `HTTP_PORT` | `80` | HTTP 端口（启用 Nginx 后生效） |
| `HTTPS_PORT` | `443` | HTTPS 端口（启用 Nginx 后生效） |
| `WEB_PORT` | - | 前端端口暴露 |
| `API_PORT` | - | 后端端口暴露 |
| `PG_PORT` | - | PostgreSQL 端口暴露 |
| `REDIS_PORT` | - | Redis 端口暴露 |
| `SSL_CERT_PATH` | `./ssl` | SSL 证书目录 |
| `ENABLE_SSL` | `false` | 是否启用 HTTPS |

## 数据持久化

Docker volumes 持久化以下数据，即使容器删除也不会丢失：

| Volume | 说明 |
|--------|------|
| `hohu-pgdata` | PostgreSQL 数据 |
| `hohu-redisdata` | Redis 数据 |
| `hohu-certbot-www` | Let's Encrypt 验证文件 |
| `hohu-certbot-conf` | Let's Encrypt 证书 |

**清除所有数据（危险操作）：**

```bash
cd .hohu/deploy
docker compose down -v
```

## 常见问题

### Nginx 启动失败

检查证书文件是否存在且路径正确：

```bash
ls .hohu/deploy/ssl/fullchain.pem
ls .hohu/deploy/ssl/privkey.pem
```

不需要 SSL 时，保持 `ENABLE_NGINX=false`，通过 `WEB_PORT` 直接访问前端。

### 数据库连接失败

确认 PostgreSQL 已就绪：

```bash
hohu deploy logs postgres
```

使用外部 PostgreSQL 时，确认 `ENABLE_POSTGRES=false` 且 `DATABASE_URL` 配置正确。

### 端口被占用

修改 `.env` 中对应的端口配置。

### 查看完整日志

```bash
hohu deploy logs -f                # 全部服务
hohu deploy logs -f hohu-admin-api # 仅后端
```
