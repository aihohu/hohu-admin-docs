---
title: HoHu CLI 概览与安装
description: 安装和升级 hohu-cli，使用统一命令创建项目、初始化环境、启动开发服务并构建部署。
---

# CLI 概览

hohu-cli 是项目创建、初始化、开发和部署的统一入口。安装来源及配套要求见[版本说明](../reference/versions)。

## 安装与升级

准备 Python 3.10 或更新版本及 uv，在终端执行：

```bash
uv tool install hohu
hohu --version
```

升级已安装的 CLI：

```bash
uv tool upgrade hohu
```

CLI 本身的 Python 要求与后端不同；创建后端项目还需满足[开发环境](../quick-start)中的 Python、Node.js、数据库和 Redis 要求。

## 创建项目

```bash
hohu --version
hohu --help
hohu create my-project
```

创建时逐项选择 Backend、Frontend 和 App。成功后核对项目标记 `.hohu/project.json` 及所选组件目录；创建命令只克隆源码，不安装依赖或启动服务。

### 非交互创建

先运行 `hohu create --help`。包含 `--component` 和 `--non-interactive` 的版本可供 Agent 或脚本使用：

```bash
hohu create my-project --component backend --component web --non-interactive
```

`--component` 可重复，支持 `backend`、`frontend`（别名 `web`）和 `app`。非交互模式必须指定组件。旧版没有这些参数时，使用交互创建或安装包含此功能的 CLI 版本。

项目名应为当前目录下的单个文件夹名。已有同名路径会拒绝创建；克隆失败可能留下部分文件，检查实际目录后恢复缺失步骤，不要直接覆盖重试。`--repo` 会统一替换所有所选组件的源码来源，不能用于分别指定 Backend 和 Web 仓库。

## 初始化并启动

先按[开发环境](../quick-start)准备数据库、Redis 和组件所需环境配置。确认所选组件已完整克隆，再进入项目目录：

```bash
cd my-project
hohu init
hohu dev
```

`hohu init` 安装依赖并运行组件初始化，可能执行数据库迁移和种子同步。核对目标数据库后再运行；完成后检查各组件的实际结果。`hohu dev` 在前台运行，按终端输出访问页面，验证后端可用及登录情况；在启动终端按 Ctrl+C 停止开发服务。

## 安装 Skills

在 Agent 将要打开的工作区运行：

```bash
hohu skills install
hohu skills install --agent claude-code --agent cursor
```

先用 `hohu skills --help` 确认当前版本支持。命令需要 Node.js 22.20.0+ 和 npm/npx，调用固定版本的上游安装器；完整前提、范围和更新方式见 [AI · 安装 Skills](./skills)。不包含此命令的 CLI 可使用该指南的 npx 入口。

新建项目时在父工作区安装并确认 Agent 能发现 Skills。安装后按 [AI 辅助开发](../ai-coding)使用 `hohu-project` 创建项目，或使用 `hohu-business-module` 开发业务功能。

## 命令速查

| 命令                               | 当前职责                             |
| ---------------------------------- | ------------------------------------ |
| `hohu skills install`              | 为编程助手安装 HoHu Skills           |
| `hohu create`                      | 创建项目并选择组件                   |
| `hohu init`                        | 安装依赖，编排后端环境、迁移与初始化 |
| `hohu dev`                         | 启动开发服务                         |
| `hohu build`                       | 从源码构建 Docker 镜像               |
| `hohu deploy init`                 | 准备部署目录与配置                   |
| `hohu deploy`                      | 基础服务、迁移、种子同步与启动       |
| `hohu migrate`                     | 在部署环境运行迁移及种子同步         |
| `hohu deploy ps/logs/restart/down` | 状态、日志、重启、停止               |
| `hohu deploy pull/upgrade`         | 镜像更新或源码构建升级，详见部署参考 |
| `hohu lang` / `hohu info`          | CLI 语言与配置信息                   |

使用 `hohu <command> --help` 查看子命令参数与示例。`hohu init` 和部署初始化不是清库操作，不需要额外运行 init_db、sync_menus 等内部脚本。

源码构建见 [hohu build](./build)，部署命令见 [hohu deploy](./deploy)，完整操作流程见[部署指南](../deploy)。
