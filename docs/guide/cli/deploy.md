# hohu deploy

通过 Docker Compose 将全栈服务部署到 Linux 服务器。

## hohu deploy

一键部署，自动完成完整流程：拉取镜像 → 启动数据库 → 等待就绪 → 迁移 → 启动全部服务。

```bash
hohu deploy
```

### 参数

| 参数 | 说明 |
|------|------|
| `--init` | 迁移后额外运行初始化脚本（创建管理员用户和菜单） |
| `--no-migrate` | 跳过数据库迁移 |

```bash
hohu deploy --init          # 部署并初始化数据
hohu deploy --no-migrate    # 部署但跳过迁移
```

### 部署流程

```
hohu deploy
    │
    ├─ 1. 检查 Docker 环境
    ├─ 2. 同步部署模板
    ├─ 3. 生成 .env 配置（首次）
    ├─ 4. 拉取镜像（本地构建时仅拉取基础设施镜像）
    ├─ 5. 启动 PostgreSQL + Redis（如果启用）
    ├─ 6. 等待数据库就绪
    ├─ 7. 运行数据库迁移
    └─ 8. 启动应用服务
```

## hohu deploy init

初始化部署配置，创建 `.hohu/deploy/` 目录并生成 `.env`。

```bash
hohu deploy init
```

自动生成的 `.env` 包含随机生成的 `SECRET_KEY`、`POSTGRES_PASSWORD`、`REDIS_PASSWORD`。

::: tip
使用 `hohu build` 时会自动初始化，无需单独执行此命令。
:::

## hohu deploy pull

拉取最新镜像并重启服务。

```bash
hohu deploy pull
```

适用于官方镜像更新后拉取新版本。

## hohu deploy ps

查看所有服务的运行状态。

```bash
hohu deploy ps
```

## hohu deploy logs

查看服务日志。

```bash
hohu deploy logs                    # 全部日志
hohu deploy logs -f                 # 实时跟踪
hohu deploy logs hohu-admin-api     # 仅后端
hohu deploy logs -f postgres        # 跟踪数据库
```

| 参数 | 说明 |
|------|------|
| `-f` / `--follow` | 实时跟踪日志输出 |
| `SERVICE...` | 指定服务名称（可选） |

## hohu deploy restart

重启服务。

```bash
hohu deploy restart                 # 重启全部
hohu deploy restart hohu-admin-api  # 仅重启后端
```

## hohu deploy down

停止所有服务并移除容器。

```bash
hohu deploy down
```

数据卷保留，不会删除数据库数据。如需清除所有数据：

```bash
cd .hohu/deploy
docker compose down -v
```

## hohu migrate

独立运行数据库迁移。

```bash
hohu migrate           # 仅迁移
hohu migrate --init    # 迁移 + 初始化（创建管理员用户和菜单）
```

| 参数 | 说明 |
|------|------|
| `--init` | 迁移后运行初始化脚本 |

::: tip
`hohu deploy` 默认会自动运行迁移，通常无需单独使用此命令。仅在需要手动控制迁移时使用。
:::

## 环境变量速查

部署配置通过 `.hohu/deploy/.env` 管理。关键配置项：

| 变量 | 说明 |
|------|------|
| `IMAGE_TAG` | 镜像标签（`latest` 或 `source`） |
| `API_IMAGE` | 后端镜像地址（源码构建时自动设为本地名称） |
| `WEB_IMAGE` | 前端镜像地址（源码构建时自动设为本地名称） |
| `ENABLE_POSTGRES` | 是否使用内置 PostgreSQL（`true` / `false`） |
| `DATABASE_URL` | 外部 PostgreSQL 连接串 |
| `ENABLE_REDIS` | 是否使用内置 Redis（`true` / `false`） |
| `REDIS_HOST` | 外部 Redis 地址 |
| `SECRET_KEY` | JWT 签名密钥 |
| `ENABLE_NGINX` | 是否启用内置 Nginx |
| `WEB_PORT` | 前端端口暴露（如 `0.0.0.0:9527`） |
| `API_PORT` | 后端端口暴露 |

完整配置参考见 [部署指南 →](/guide/deploy)
