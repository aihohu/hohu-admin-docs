---
title: CLI 概览
description: hohu 命令行工具概览，提供项目创建、依赖安装、开发服务器、源码构建和一键部署等全生命周期管理
---

# CLI 概览

`hohu` 是 hohu-admin 的官方命令行工具，提供项目创建、依赖安装、开发服务器、源码构建、一键部署等全生命周期管理能力。

## 安装

```bash
# uv（推荐）
uv tool install hohu

# pip
pip install hohu
```

## 更新

```bash
# uv
uv tool upgrade hohu

# pip
pip install --upgrade hohu
```

## 命令总览

| 命令                  | 说明                       |
| --------------------- | -------------------------- |
| `hohu create [NAME]`  | 创建项目并克隆仓库模板     |
| `hohu init`           | 安装所有子项目依赖         |
| `hohu dev`            | 启动开发服务器             |
| `hohu build`          | 从本地源码构建 Docker 镜像 |
| `hohu deploy`         | 一键 Docker 部署           |
| `hohu deploy init`    | 初始化部署目录和 .env      |
| `hohu deploy pull`    | 拉取最新镜像并重启         |
| `hohu deploy ps`      | 查看服务状态               |
| `hohu deploy logs`    | 查看服务日志               |
| `hohu deploy restart` | 重启服务                   |
| `hohu deploy down`    | 停止所有服务               |
| `hohu migrate`        | 运行数据库迁移             |
| `hohu lang`           | 切换显示语言               |
| `hohu info`           | 查看当前配置               |
| `hohu --version`      | 显示版本号                 |

## hohu create

创建新项目并交互式选择组件（后端 / 前端 / App）。

```bash
hohu create my-project
hohu create              # 默认名称 hohu-admin
hohu create my-app --repo https://github.com/your-org/your-template.git
```

| 参数            | 说明                        |
| --------------- | --------------------------- |
| `NAME`          | 项目名称，默认 `hohu-admin` |
| `--repo` / `-r` | 自定义模板仓库地址          |

创建完成后执行：

```bash
cd my-project
hohu init
```

## hohu init

自动识别项目配置（`.hohu/project.json`），安装全部依赖。

```bash
hohu init
```

- 后端：执行 `uv sync`（缺少 `uv` 时自动安装）
- 前端 / App：执行 `pnpm install`
- 安装失败时会给出手动安装提示

## hohu dev

在单一终端内启动所有开发服务，日志按颜色区分输出。

```bash
hohu dev          # 启动全部组件
hohu dev -o be    # 仅后端
hohu dev -o fe    # 仅前端
hohu dev -s app   # 跳过 App
hohu dev -t mp    # App 微信小程序模式
```

### 参数

| 参数           | 短写 | 说明                              | 默认值 |
| -------------- | ---- | --------------------------------- | ------ |
| `--app-target` | `-t` | App 运行目标：`h5` / `mp` / `app` | `h5`   |
| `--only`       | `-o` | 仅启动指定组件（可重复使用）      | 全部   |
| `--skip`       | `-s` | 跳过指定组件（可重复使用）        | 无     |

组件别名（不区分大小写）：

| 别名              | 组件 |
| ----------------- | ---- |
| `be` / `backend`  | 后端 |
| `fe` / `frontend` | 前端 |
| `app`             | App  |

### 日志颜色

| 前缀         | 颜色 | 服务    |
| ------------ | ---- | ------- |
| `[Backend]`  | 绿色 | FastAPI |
| `[Frontend]` | 青色 | Vue 3   |
| `[App]`      | 黄色 | Uni-app |

按 `Ctrl+C` 优雅退出，所有子进程将被安全终止。

## hohu lang

切换 CLI 显示语言，支持中文、英文和跟随系统。

```bash
hohu lang
```

交互式选择：简体中文 / English / 跟随系统。

## hohu info

查看当前 CLI 配置信息，包括版本、语言、配置文件路径等。

```bash
hohu info
```
