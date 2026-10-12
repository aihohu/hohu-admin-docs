---
title: hohu build — 构建 Docker 镜像
description: 从 Backend 和 Web 源码构建 Docker 镜像，指定组件与标签，了解部署配置变化及切回官方镜像的方法。
---

# hohu build

从本地 Backend/Web 源码构建 Docker 镜像，并将部署配置指向成功构建的本地镜像。此命令不构建 App 或桌面安装包。

## 前提条件

安装并启动 Docker，确认目标组件有源码目录和 Dockerfile。在含 `.hohu/project.json` 的项目根目录或子目录运行。未指定组件时，Backend 和 Web 两个源码目录都必须存在。

## 用法与参数

```bash
hohu build [OPTIONS]
```

| 参数         | 说明                                                        | 默认值        |
| ------------ | ----------------------------------------------------------- | ------------- |
| `--only`     | 仅构建 `backend` 或 `frontend`；不可重复，不接受 `web` 别名 | Backend + Web |
| `--tag`      | 两个镜像共用的 Docker 标签                                  | `source`      |
| `--no-cache` | 不使用 Docker 构建缓存                                      | 关闭          |
| `--reset`    | 不构建，清除本地镜像配置并恢复官方来源                      | 关闭          |

## 常用示例

```bash
# 构建 Backend + Web
hohu build

# 只重新构建后端
hohu build --only backend

# 为两个组件使用一致标签
hohu build --tag v1.2.0

# 完整重建
hohu build --no-cache
```

只构建一个组件仍会更新共享的 `IMAGE_TAG`。如果同时修改标签，部署使用的另一镜像也必须具备该标签；发布完整版本时建议同时构建两个组件。

## 执行结果

1. 构建 `hohu-admin:<tag>` 和/或 `hohu-admin-web:<tag>`。
2. 镜像构建后，若部署目录不存在，自动准备 `.hohu/deploy/`、配置和首次密钥。
3. 在 `.hohu/deploy/.env` 写入成功组件的 `API_IMAGE=hohu-admin` 和/或 `WEB_IMAGE=hohu-admin-web`，更新 `IMAGE_TAG`。

已有部署配置不会因为普通构建被整体重新生成。检查构建摘要和生成的 `.env`，核对站点、存储与凭据，再执行 [`hohu deploy`](./deploy#deploy)。本地镜像会检查是否存在，不从远端拉取。

## 切回官方镜像

```bash
hohu build --reset
```

要求已有部署 `.env`。命令删除其中的 `API_IMAGE`、`WEB_IMAGE`，将 `IMAGE_TAG` 设置为 `latest`；不会删除本地镜像或业务数据，也不会立即重启服务。

部署前把 `IMAGE_TAG` 调整为实际发布且配套的版本，按[部署与维护](./deploy)重新部署。生产变更先阅读[升级与恢复](../operations/upgrade)。

## 排错

| 现象               | 处理方式                                           |
| ------------------ | -------------------------------------------------- |
| Docker 不可用      | 确认安装、服务状态及当前用户访问权限               |
| 找不到项目或源码   | 核对项目标记和组件目录；单组件项目使用 `--only`    |
| 缺少 Dockerfile    | 检查源码完整性与构建范围；核对摘要是否包含预期组件 |
| 部署找不到本地镜像 | 确认镜像在同一 Docker 环境中，名称与共享标签一致   |
| 重置失败           | 确认 `.hohu/deploy/.env` 已存在                    |

CLI 不推送镜像到仓库。构建与部署在不同机器上进行时，需要自行传递镜像或使用可访问的镜像仓库。
