---
title: hohu build
description: 使用 hohu build 从本地源码构建后端和前端 Docker 镜像，构建完成后通过 hohu deploy 部署
---

# hohu build

从本地源码构建 Docker 镜像。构建完成后，运行 `hohu deploy` 即可使用本地镜像部署。

## 用法

```bash
hohu build                  # 构建所有组件
hohu build --only=backend   # 仅构建后端
hohu build --only=frontend  # 仅构建前端
hohu build --no-cache       # 不使用构建缓存
hohu build --tag=v1.0.0     # 自定义镜像标签
hohu build --reset          # 重置为官方 GHCR 镜像
```

## 参数

| 参数         | 说明                                      | 默认值   |
| ------------ | ----------------------------------------- | -------- |
| `--only`     | 仅构建指定组件（`backend` 或 `frontend`） | 全部     |
| `--tag`      | Docker 镜像标签                           | `source` |
| `--no-cache` | 不使用 Docker 构建缓存                    | `false`  |
| `--reset`    | 清除本地镜像配置，切回官方 GHCR 镜像      | `false`  |

## 工作流程

```
hohu build
    │
    ├─ 自动初始化 .hohu/deploy/（首次运行）
    │   ├─ docker-compose.yml
    │   ├─ .env（自动生成密码和密钥）
    │   └─ nginx/
    │
    ├─ 构建镜像
    │   ├─ hohu-admin:<tag>      （后端）
    │   └─ hohu-admin-web:<tag>  （前端）
    │
    └─ 更新 .hohu/deploy/.env
        ├─ API_IMAGE=hohu-admin
        ├─ WEB_IMAGE=hohu-admin-web
        └─ IMAGE_TAG=<tag>
```

首次运行时自动初始化 `.hohu/deploy/` 目录（配置文件、`.env`、密钥），无需手动执行 `hohu deploy init`。

构建完成后 `.env` 中的镜像配置会自动切换为本地镜像名称（不带 `/`），`hohu deploy` 会识别并跳过远程拉取。

## 切换回官方镜像

```bash
hohu build --reset
```

清除 `.env` 中的 `API_IMAGE` 和 `WEB_IMAGE`，`IMAGE_TAG` 恢复为 `latest`。下次 `hohu deploy` 将拉取官方 GHCR 镜像。

## 常用场景

### 日常开发迭代

```bash
# 修改源码后重新构建
hohu build --only=backend    # 只改了后端
hohu deploy                  # 重新部署

# 完整重建
hohu build --no-cache
hohu deploy
```

### 版本发布

```bash
hohu build --tag=v1.2.0
hohu deploy
```

### 从官方镜像切换到本地开发

```bash
hohu build          # 构建 + 自动初始化
hohu deploy         # 部署本地镜像
```

### 从本地开发切回官方镜像

```bash
hohu build --reset  # 重置配置
hohu deploy down
hohu deploy         # 拉取官方镜像部署
```
