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

## 项目工作流

```bash
hohu --version
hohu --help
hohu create my-project
cd my-project
hohu init
hohu dev
```

| 命令                               | 当前职责                             |
| ---------------------------------- | ------------------------------------ |
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

安装编程助手 Skills 见 [安装 Skills](./skills)。
