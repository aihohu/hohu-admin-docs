---
title: 快速上手
description: 使用 hohu CLI 一键创建项目、安装依赖并启动开发服务器，快速搭建 HoHu Admin 开发环境
---

# 快速开始

hohu-admin 提供了官方 CLI 工具 `hohu`，内置项目创建、依赖安装、开发服务器、源码构建、一键部署等全生命周期管理能力。你无需关心各子项目的仓库地址、安装命令和启动方式——CLI 会自动处理一切。

## 1. 安装 CLI

```bash
# uv（推荐）
uv tool install hohu

# pip
pip install hohu
```

## 2. 创建项目

```bash
hohu create my-project
cd my-project
```

交互式选择需要的组件（后端 / 前端 / App）。

## 3. 安装依赖

```bash
hohu init
```

自动识别项目配置，安装全部依赖（`uv sync` / `pnpm install`）。缺少 `uv` 时自动安装。

> **Windows 用户：** 如果遇到 `EPERM: operation not permitted, symlink` 错误，请开启 **Windows 开发者模式**（设置 → 更新和安全 → 开发者选项）。

## 4. 启动开发

```bash
hohu dev
```

一条命令启动全部服务，日志按颜色区分：

| 前缀         | 颜色 | 服务    |
| ------------ | ---- | ------- |
| `[Backend]`  | 绿色 | FastAPI |
| `[Frontend]` | 青色 | Vue 3   |
| `[App]`      | 黄色 | Uni-app |

按 `Ctrl+C` 优雅退出。

::: tip 其他启动方式

```bash
hohu dev -o be        # 仅后端
hohu dev -o fe        # 仅前端
hohu dev -t mp        # App 微信小程序模式
hohu dev -s app       # 跳过 App
```

:::

## 5. 部署上线

将项目部署到 Linux 服务器（需安装 Docker）：

```bash
hohu build          # 构建镜像（自动初始化部署配置）
hohu deploy         # 一键部署
```

部署完成后编辑 `.hohu/deploy/.env` 修改密码等配置。

::: details 不想从源码构建？

使用官方预构建镜像，无需本地源码：

```bash
hohu deploy init    # 初始化部署配置
# 编辑 .hohu/deploy/.env
hohu deploy         # 拉取镜像并部署
```

:::

[详细部署指南 →](/guide/deploy)

## 下一步

- [部署指南](/guide/deploy) — SSL 证书、外部数据库、环境变量配置
- [源码仓库](/guide/src) — 各子项目 GitHub 地址
- [在线演示](/guide/show) — 体验完整功能
