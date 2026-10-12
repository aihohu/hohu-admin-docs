---
title: HoHu CLI 使用手册与命令速查
description: 安装和升级 HoHu CLI，快速查找项目创建、初始化、开发、Docker 构建、部署、迁移、监控和 Skills 安装命令。
---

# HoHu CLI

HoHu CLI 是创建、开发和部署 HoHu 项目的命令行工具。第一次运行应用，请按[开发环境教程](../quick-start)完成配置；需要部署到服务器，请阅读[部署指南](../deploy)。本部分用于查找命令、参数和执行结果。

## 命令速查 {#command-reference}

点击命令查看参数与示例。方括号表示可选参数，`...` 表示可以传入多个值，使用时不输入这些标记。

终端中使用 `hohu <命令> --help` 查看帮助，例如 `hohu create --help` 或 `hohu deploy logs --help`。

| 命令                                                            | 用途                                  |
| --------------------------------------------------------------- | ------------------------------------- |
| [`hohu create [NAME]`](./create)                                | 创建项目，选择 Backend、Web 和 App    |
| [`hohu init`](./init)                                           | 安装项目依赖，执行后端初始化          |
| [`hohu dev`](./dev)                                             | 在前台启动开发服务                    |
| [`hohu build`](./build)                                         | 从源码构建 Backend/Web 的 Docker 镜像 |
| [`hohu deploy init`](./deploy#init)                             | 生成部署配置与首次凭据                |
| [`hohu deploy`](./deploy#deploy)                                | 准备镜像、迁移数据并启动应用          |
| [`hohu deploy ps`](./deploy#ps)                                 | 查看部署服务状态                      |
| [`hohu deploy logs [SERVICES...]`](./deploy#logs)               | 查看日志，支持 `-f` 持续跟踪          |
| [`hohu deploy restart [SERVICES...]`](./deploy#restart)         | 重启全部或指定服务                    |
| [`hohu deploy down`](./deploy#down)                             | 停止并移除部署容器                    |
| [`hohu deploy pull`](./deploy#pull)                             | 更新镜像，执行迁移并启动服务          |
| [`hohu deploy upgrade`](./deploy#upgrade)                       | 更新项目根仓库源码、构建并重新部署    |
| [`hohu migrate`](./migrate)                                     | 单独运行部署环境迁移与种子同步        |
| [`hohu monitoring init`](./monitoring#init)                     | 准备 Prometheus/Grafana 配置          |
| [`hohu monitoring up`](./monitoring#up)                         | 启动监控服务                          |
| [`hohu monitoring ps`](./monitoring#ps)                         | 查看监控服务状态                      |
| [`hohu monitoring logs [SERVICES...]`](./monitoring#logs)       | 查看监控日志                          |
| [`hohu monitoring restart [SERVICES...]`](./monitoring#restart) | 重启监控服务                          |
| [`hohu monitoring down`](./monitoring#down)                     | 停止并移除监控容器                    |
| [`hohu skills install`](./skills)                               | 为编程助手安装 HoHu Skills            |
| [`hohu lang`](./configuration#language)                         | 选择 CLI 语言                         |
| [`hohu info`](./configuration#info)                             | 查看 CLI 版本和全局配置位置           |
| `hohu --version`                                                | 查看 CLI 版本                         |
| `hohu --help`                                                   | 查看命令列表                          |
| [`hohu --show-completion`](./configuration#completion)          | 输出当前 Shell 的补全脚本             |
| [`hohu --install-completion`](./configuration#completion)       | 为当前 Shell 安装命令补全             |

`hohu system lang` 和 `hohu system info` 分别与 `hohu lang`、`hohu info` 等价。

## 安装与升级 {#installation}

CLI 需要 Python **3.10+**，推荐使用 uv 安装：

```bash
uv tool install hohu
hohu --version
hohu --help
```

安装 uv 请参考 [uv 安装说明](https://docs.astral.sh/uv/getting-started/installation/)。如果提示找不到 `hohu`，执行 `uv tool update-shell`，按提示刷新 PATH 或重新打开终端。

升级 CLI：

```bash
uv tool upgrade hohu
```

升级 CLI 不会自动更新已创建项目的源码、依赖或部署镜像。组件发布记录见[更新说明](../reference/versions)。如果已安装版本缺少本文中的参数，先检查该命令的 `--help`，再升级到支持所需功能的版本。

CLI 的 Python 要求与应用不同。开发 Backend/Web 还需 Git、后端 Python、Node.js、pnpm、PostgreSQL 和 Redis；版本要求见[开发环境](../quick-start)。构建和部署还需 Docker，部署与监控需 Docker Compose。

## 开始使用 {#quick-start}

准备好开发环境后，创建 Backend + Web 项目：

```bash
hohu create my-project --component backend --component web --non-interactive
cd my-project
hohu init
hohu dev
```

`create` 获取源码；`init` 安装依赖并执行初始化；`dev` 持续运行开发服务。数据库连接的首次配置、管理员凭据和登录步骤见[开发环境教程](../quick-start)。

使用编程助手时，先[安装 HoHu Skills](./skills)，再按 [AI 辅助开发](../ai-coding)创建项目或开发业务模块。

## 命令在哪里运行 {#working-directory}

| 操作                                  | 运行位置                                                   |
| ------------------------------------- | ---------------------------------------------------------- |
| `create`                              | 新项目的父目录                                             |
| `init`、`dev`、`build`                | 含 `.hohu/project.json` 的项目根目录，或其子目录           |
| `deploy init`                         | 计划保存部署配置的目录；配置写入当前目录的 `.hohu/deploy/` |
| 其他部署、迁移与监控命令              | 已初始化部署目录的上级目录，或其子目录                     |
| `deploy upgrade`                      | 同时满足项目标记、部署配置和根目录 Git 仓库要求的项目内    |
| `skills install`                      | 编程助手准备使用的工作区；也可选择用户范围安装             |
| `lang`、`info`、`--help`、`--version` | 任意目录                                                   |

开发后端使用 `hohu-admin/.env`，部署使用 `.hohu/deploy/.env`。遇到错误时先核对运行目录和目标配置，见[配置与排错](./configuration)。
