---
title: 使用 CLI 部署
description: 使用 HoHu CLI 和 Docker Compose 部署应用，配置镜像、访问端口、持久文件与外部数据库，并完成首次验收。
---

# 使用 CLI 部署

本页提供首次部署流程。命令参数见 [CLI 部署参考](./cli/deploy)，已有实例先看[升级、备份与恢复](./operations/upgrade)。

## 1. 准备服务器

安装 Git、uv、HoHu CLI、Docker 和 Docker Compose，确认 Docker 服务已启动，服务器能访问所选镜像仓库。镜像部署不需要安装应用源码依赖。

```bash
uv tool install hohu
hohu --version
docker version
docker compose version
```

准备专用部署目录、持久存储、域名和备份位置。当前默认模板固定了部分容器、网络和卷名称，同一 Docker 主机上的多个实例需要分别定制这些名称；只更换目录或端口不足以隔离。

## 2. 初始化部署配置

使用已发布镜像时，可直接在空目录初始化，无需 `hohu create`：

```bash
mkdir my-hohu
cd my-hohu
hohu deploy init
```

配置位于 `.hohu/deploy/`。命令生成模板、uploads / private_uploads 目录、应用密钥和首次密码，不会启动应用。保留自动生成的凭据，不用文档占位值覆盖。

## 3. 选择镜像和访问方式

编辑 `.hohu/deploy/.env`：

| 配置                            | 需要确认                                  |
| ------------------------------- | ----------------------------------------- |
| API_IMAGE、WEB_IMAGE            | 官方仓库或自己的镜像仓库                  |
| IMAGE_TAG                       | 实际存在且配套的标签；记录精确版本        |
| ENABLE_POSTGRES、ENABLE_REDIS   | 默认 true，使用模板内置服务               |
| SECRET_KEY、HOHU_ADMIN_PASSWORD | 保留生成值并限制读取权限                  |
| WEB_PORT、API_PORT              | 默认不发布端口，按访问拓扑配置            |
| ENABLE_NGINX                    | 默认 false；启用内置代理时改为 true       |
| SERVER_URL                      | 同源可留空；生产填写时必须是 HTTPS origin |

同一主机已有 Nginx 时，先将应用端口绑定到回环地址：

```dotenv
ENABLE_NGINX=false
WEB_PORT=127.0.0.1:8080
API_PORT=127.0.0.1:8000
```

远程浏览器不能直接访问服务器的回环端口；通过[域名与 HTTPS](./operations/network)中的宿主机代理访问。不要因页面打不开就同时公开数据库、Redis 和所有应用端口。

使用内置 Nginx 时，设置 `ENABLE_NGINX=true`，核对 HTTP_PORT / HTTPS_PORT 与已有服务是否冲突，并按 HTTPS 页面准备证书。

## 4. 部署并验收

```bash
hohu deploy
hohu deploy ps
hohu deploy logs -f hohu-admin-api
```

CLI 准备镜像、启动启用的依赖、迁移数据库并同步基础数据，最后启动应用。失败会阻断后续步骤。默认已包含初始化，不添加 `--init`。

使用用户名 admin 和部署 `.env` 中的 HOHU_ADMIN_PASSWORD 首次登录，随后修改密码。已有账号密码不会在升级或重新部署时被覆盖。

检查 Web、API 与 scheduler 状态，再验证普通用户权限、图片上传、私有文件、任务和已启用的 AI。健康检查或 CLI 成功提示不能代替业务验收，详见[巡检与排错](./operations/monitoring)。

## 使用自己的源码

需要定制应用时，用 `hohu create my-project` 创建 Backend / Frontend 项目，按开发指南修改和验证源码。在项目根目录执行 `hohu deploy init`，检查配置后执行：

```bash
hohu build
hohu deploy
```

构建的镜像选择与 source 标签见 [`hohu build`](./cli/build)。普通镜像部署无需先构建；`deploy upgrade` 的根 Git 仓库要求见 [CLI 参考](./cli/deploy#upgrade)。

## 外部 PostgreSQL / Redis {#external-services}

将对应 ENABLE 开关设为 false，并提供 DATABASE_URL 或 REDIS_HOST / PORT / PASSWORD / DB。容器中的 127.0.0.1 指向容器自身，应使用容器可达的服务地址。

::: warning 当前外部依赖配置限制
CLI 生成的 `docker-compose.infra.yml` 会覆盖 API 的数据库连接、Redis 主机和密码，以及迁移器的数据库连接；当前不会覆盖 API 的 Redis 端口和数据库编号，也不会覆盖 scheduler。使用外部服务时，还需在 `.hohu/deploy/docker-compose.override.yml` 补齐下列配置，否则相关服务仍会使用模板中的连接参数。
:::

以下片段适用于数据库和 Redis **都为外部服务**；只外置一种时仅保留相应项。沿用 `.env` 中的连接值：

```yaml
services:
  hohu-admin-api:
    environment:
      REDIS_PORT: ${REDIS_PORT:-6379}
      REDIS_DB: ${REDIS_DB:-0}
  hohu-admin-scheduler:
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_HOST: ${REDIS_HOST}
      REDIS_PORT: ${REDIS_PORT:-6379}
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      REDIS_DB: ${REDIS_DB:-0}
```

这里 REDIS_PORT 表示外部 Redis 服务端口；启用内置 Redis 时，同名 CLI 配置用于宿主机端口映射，不要混用。

用户 override 最后加载，生成的 infra 文件不要手工维护。重新部署后分别检查 API、scheduler 与迁移结果。独立 `hohu migrate` 仍有内置依赖限制，见[迁移参考](./cli/migrate#limitations)。

## 存储与配置生效

默认 PostgreSQL / Redis 使用命名卷，公开图片与私有业务文件分别挂载部署目录下 uploads / private_uploads。API 和 scheduler 必须看到同一份业务文件；自定义容器内存储路径时同步调整挂载。

修改 `.env` 后使用重新部署使容器重建；`restart` 不重新加载容器环境。更多参数归属见[配置项参考](./reference/configuration)。
