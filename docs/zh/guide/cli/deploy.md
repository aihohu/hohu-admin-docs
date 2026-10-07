---
title: hohu deploy 与迁移
description: HoHu hohu deploy 与迁移的使用步骤、适用范围与限制
---

# hohu deploy 与迁移

使用部署命令前，安装与应用配套的 CLI；命令选项可通过 `hohu deploy --help` 查看，组件发行记录见[更新说明](../reference/versions)。

| 命令                                | 行为                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| `hohu deploy init`                  | 生成/补齐 `.hohu/deploy` 配置；`--force` 会覆盖需更新的模板，先保存自定义内容 |
| `hohu deploy`                       | 拉取适用镜像、准备基础服务、迁移并同步种子，然后启动                          |
| `hohu deploy --no-migrate`          | 跳过迁移阶段及该阶段的种子同步，仅用于确认无需更新的受控场景                  |
| `hohu migrate`                      | 单独运行部署迁移及种子同步，不接受额外初始化开关                              |
| `hohu deploy pull`                  | 更新镜像后迁移、同步种子并启动，不是纯下载                                    |
| `hohu deploy upgrade`               | 拉取源码、构建、停止再部署；可用 --no-cache，存在停机窗口                     |
| `hohu deploy restart [SERVICES...]` | 重启服务，不代替版本迁移                                                      |
| `hohu deploy down`                  | 停止 Compose 服务，不是删除业务数据的重置命令                                 |

```bash
hohu deploy ps
hohu deploy logs -f hohu-admin-api
hohu deploy restart hohu-admin-api
```

默认部署自动同步基础数据，**不再使用 `hohu deploy --init` 或 `hohu migrate --init`**。重复执行保留密码、自定义内容及已有授权，任一迁移/种子失败阻断正常启动。

## 镜像来源

`hohu deploy`、`hohu deploy pull`、`hohu deploy upgrade` 默认使用 `auto`：先拉取官方源，遇到网络超时、连接故障、限流或临时服务错误时，尝试 ACR 中相同标签的镜像。认证失败、镜像或平台不存在、证书校验失败和本地 Docker 故障会直接报错。

```bash
# 自动回退（默认）
hohu deploy
# 直接使用国内 ACR 镜像
hohu deploy --image-source acr
hohu deploy pull --image-source acr
hohu deploy upgrade --image-source acr
# 仅使用配置中的原地址
hohu deploy --image-source official
```

可在 `.hohu/deploy/.env` 设置 `HOHU_IMAGE_SOURCE=acr`。优先级为命令选项、进程环境变量 `HOHU_IMAGE_SOURCE`、项目 `.env`，最后为默认 `auto`。

自动映射范围：

| 官方仓库 | ACR 仓库 |
| --- | --- |
| `ghcr.io/aihohu/hohu-admin` | `registry.cn-beijing.aliyuncs.com/hohu/hohu-admin` |
| `ghcr.io/aihohu/hohu-admin-web` | `registry.cn-beijing.aliyuncs.com/hohu/hohu-admin-web` |
| Docker Hub 官方 `postgres`、`redis`、`nginx` | `registry.cn-beijing.aliyuncs.com/hohu/` 下的同名仓库 |

换源保留原标签，不会降级到 `latest`。ACR 必须已同步该标签并允许公开拉取，普通部署不需要 ACR 登录。浮动标签对应最近一次同步快照，不能保证与此刻的上游实时一致。使用 `@sha256:...` 固定摘要的引用始终使用原地址，不自动映射，因为两个源的多架构 index 摘要可能不同。

CLI 根据 Compose 展开后的配置拉取实际启用的部署服务镜像。自定义仓库地址不自动替换；`hohu build` 生成的本地 `hohu-admin`、`hohu-admin-web` 镜像只检查是否存在；显式设置 `pull_policy: never` 的自定义镜像也只检查本地。Certbot、监控服务以及 Dockerfile 构建阶段的基础镜像不在换源范围。

每次拉取最长等待 300 秒，官方源和 ACR 均失败时停止部署，不以本地旧镜像代替本次拉取成功。镜像准备在迁移和启动之前完成；`upgrade` 也会先准备镜像再停止原服务。ACR 拉取成功后，CLI 为镜像添加原引用的本地标签，迁移和启动使用 `--pull never`，避免再次访问不可达的源。该机制不修改全局 Docker 镜像加速或登录配置；直接运行 `docker compose` 不包含 CLI 自动换源流程。

CLI 生成的基础设施配置写入 `docker-compose.infra.yml`，用户自定义配置继续放在 `docker-compose.override.yml` 并最后加载。旧版 CLI 生成的 `docker-compose.override.yml` 也会保留；若其中有旧的端口或外部数据库配置，升级时需核对，避免覆盖新的基础设施开关。

使用外部数据库/Redis 时，先核对匹配版本对各个命令的基础服务编排支持，不假定所有维护子命令都会识别同一外部服务配置。

环境配置调整、备份、维护窗口及回滚责任见[升级指南](../operations/upgrade)。源码构建说明见 [hohu build](./build)。
