---
title: hohu deploy — 部署与维护
description: 查询 HoHu 部署命令、参数与示例，初始化配置、部署应用、查看日志、更新镜像、从源码升级并管理服务。
---

# hohu deploy

使用 Docker Compose 管理 HoHu 部署。首次服务器安装与配置步骤见[部署指南](../deploy)，升级前的备份与恢复见[升级指南](../operations/upgrade)。

## 前提条件

安装并启动 Docker，确认 `docker compose version` 可用。先在预期部署目录执行 `hohu deploy init`；后续命令在该目录或其子目录运行。核对 `.hohu/deploy/.env` 中的连接、凭据、版本、网络和持久化配置。

## 初始化配置 {#init}

```bash
hohu deploy init
```

在**当前目录**生成 `.hohu/deploy/`、模板、存储目录和首次密码/密钥。不会克隆源码或启动应用；官方镜像部署不要求 `.hohu/project.json`。

| 参数      | 说明                                 | 默认值 |
| --------- | ------------------------------------ | ------ |
| `--force` | 覆盖需要更新的模板；先保存自定义修改 | 关闭   |

重复执行会补齐模板；检测到模板版本变化时，提示确认后覆盖需更新的文件，`--force` 跳过确认。已有有效凭据会保留，不用于清库或重置管理员密码。

## 部署应用 {#deploy}

```bash
hohu deploy
hohu deploy -s acr
```

| 参数              | 说明                                                 | 默认值                              |
| ----------------- | ---------------------------------------------------- | ----------------------------------- |
| `--source` / `-s` | 镜像来源：`auto`、`official`、`acr`                  | 按来源配置优先级解析，最终为 `auto` |
| `--no-migrate`    | 跳过迁移及该阶段的种子同步，仅用于确定无需更新的场景 | 关闭                                |

执行顺序：准备镜像 → 启动启用的基础服务 → 迁移与种子同步 → 启动应用及启用的 Nginx。镜像、迁移或种子同步失败会阻断后续正常启动。

CLI 不会在此次迁移前停止旧应用写者、校验产品清单或为验收暂停调度。[固定产物与恢复流程](../operations/upgrade#fixed-artifacts) 说明 CLI 0.1.16 所需的人工前置步骤。该版本实际使用 `hohu deploy`，没有 `hohu admin deploy` 命令组。

默认部署已包含基础数据同步，不使用 `hohu deploy --init`。重复同步保留已有密码、自定义内容和授权。启动后执行 `hohu deploy ps`、查看日志并登录验证；命令完成不等于业务功能已验收。

## 状态与日志 {#ps}

```bash
hohu deploy ps
```

显示部署服务状态，无额外参数。

### 查看日志 {#logs}

```bash
hohu deploy logs
hohu deploy logs -f hohu-admin-api
```

| 参数              | 说明                      | 默认值   |
| ----------------- | ------------------------- | -------- |
| `SERVICES...`     | 一个或多个 Compose 服务名 | 全部服务 |
| `--follow` / `-f` | 持续跟踪日志，Ctrl+C 退出 | 关闭     |

服务名以当前 Compose 配置为准。退出日志跟踪不会停止服务。

## 重启与停止 {#restart}

```bash
hohu deploy restart
hohu deploy restart hohu-admin-api
```

可指定一个或多个服务；省略时重启全部。重启不更新镜像、不执行迁移，新增配置应通过重新部署使容器重建。

### 停止部署 {#down}

```bash
hohu deploy down
```

停止并移除 Compose 容器与相关网络，不传入删除卷选项；不是业务数据重置命令。数据是否保留仍取决于实际存储挂载。该命令不接受服务筛选参数。

## 更新镜像 {#pull}

```bash
hohu deploy pull
hohu deploy pull -s acr
```

支持 `--source` / `-s`，解析方式与 `hohu deploy` 相同。命令准备镜像、启动基础服务、执行迁移和种子同步，然后启动或更新应用容器；它不是纯下载命令，不提供 `--no-migrate`。

如需切换版本，先在部署 `.env` 中设置实际发布且配套的 `IMAGE_TAG`。本地源码构建镜像不会因 `pull` 自动重建。

## 从源码升级 {#upgrade}

```bash
hohu deploy upgrade
hohu deploy upgrade --no-cache
```

| 参数              | 说明                              | 默认值        |
| ----------------- | --------------------------------- | ------------- |
| `--no-cache`      | 禁用源码镜像构建缓存              | 关闭          |
| `--no-migrate`    | 跳过迁移及该阶段种子同步          | 关闭          |
| `--source` / `-s` | 部署镜像来源，解析方式同 `deploy` | 最终为 `auto` |

要求项目标记、Backend/Web 源码、部署配置，以及**项目根目录的可拉取 Git 仓库**。命令在根目录执行一次 `git pull`，不会分别更新独立的组件仓库。`hohu create` 不自动创建根 Git 仓库；仅使用它生成的结构时，先自行更新组件源码，再使用 `hohu build` 与 `hohu deploy`。

执行顺序：根仓库 `git pull` → 构建两个 `source` 镜像 → 更新部署镜像配置 → 准备镜像 → 停止旧服务 → 基础服务、迁移及应用启动。存在停机窗口；命令不自动备份或回滚。

独立迁移及其限制见 [`hohu migrate`](./migrate)。

## 镜像来源

`deploy`、`deploy pull` 和 `deploy upgrade` 均支持 `--source` / `-s`，原 `--image-source` 保留为兼容别名。环境变量和部署 `.env` 的 `HOHU_IMAGE_SOURCE` 不变；该参数不影响源码仓库或 Python/前端依赖来源。

| 来源       | 行为                                                                  |
| ---------- | --------------------------------------------------------------------- |
| `auto`     | 优先原地址，网络超时、连接故障、限流或临时服务错误时尝试对应 ACR 镜像 |
| `official` | 仅使用配置中的原地址                                                  |
| `acr`      | 对支持的官方镜像直接使用 ACR，其他引用保留原地址                      |

认证失败、镜像或平台不存在、证书校验失败及本地 Docker 故障直接报错。配置优先级：命令参数 → 进程环境变量 `HOHU_IMAGE_SOURCE` → 部署 `.env` 中同名项 → `auto`。

| 官方仓库                                     | ACR 仓库                                               |
| -------------------------------------------- | ------------------------------------------------------ |
| `ghcr.io/aihohu/hohu-admin`                  | `registry.cn-beijing.aliyuncs.com/hohu/hohu-admin`     |
| `ghcr.io/aihohu/hohu-admin-web`              | `registry.cn-beijing.aliyuncs.com/hohu/hohu-admin-web` |
| Docker Hub 官方 `postgres`、`redis`、`nginx` | `registry.cn-beijing.aliyuncs.com/hohu/` 下的同名仓库  |

换源保留标签，不降级到 `latest`。目标标签必须已同步且可拉取；浮动标签是最近同步快照。固定 `@sha256:...` 摘要和自定义仓库不自动映射。CLI 本地构建镜像及显式 `pull_policy: never` 的自定义镜像只检查本地是否存在。

每次拉取最长等待 300 秒，两源均失败则停止，不以本地旧镜像代替成功。本机制不覆盖 Certbot、监控镜像或 Dockerfile 构建阶段，也不修改全局 Docker 配置。ACR 成功后补原引用本地标签，迁移与启动使用 `--pull never`；直接运行 Compose 不具备 CLI 的换源流程。

## 配置与排错

CLI 基础设施覆盖配置写入 `docker-compose.infra.yml`；用户的 `docker-compose.override.yml` 最后加载。旧版生成的 override 会保留，升级时核对旧端口和外部服务配置是否覆盖新设置。

| 现象                       | 处理方式                                             |
| -------------------------- | ---------------------------------------------------- |
| 提示未初始化               | 在预期目录执行 `hohu deploy init`，检查配置后部署    |
| 镜像准备失败               | 核对地址、标签、网络及权限；不要跳过实际缺失的镜像   |
| 迁移失败                   | 保留报错，核对数据库与目标版本，按升级指南恢复后重试 |
| 修改 `.env` 后重启仍无变化 | 使用重新部署更新容器配置；`restart` 不重建容器       |
| `upgrade` 报 Git 错误      | 确认根目录仓库可拉取；独立组件仓库应分别维护源码     |

外部 PostgreSQL/Redis 支持：`deploy`、`pull`、`upgrade` 按启用开关编排；独立 `migrate` 的行为不同，详见[迁移限制](./migrate#limitations)。其他配置位置与问题见[配置与排错](./configuration)。

当前外部依赖的自动覆盖未同步到 scheduler，也未传递 API 的 Redis 端口与数据库编号。使用外部服务时，需在用户 override 中补齐这些配置；示例见[外部依赖部署](../deploy#external-services)。
