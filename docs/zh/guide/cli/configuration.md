---
title: HoHu CLI 配置与故障排查
description: 查询 HoHu CLI 全局配置、项目标记和部署配置的位置，设置语言与源码来源，并排查命令、网络和初始化错误。
---

# 配置与排错

先确认运行目录、CLI 版本和目标配置，再查看对应命令的错误。开发与部署使用不同文件，修改其中一套不会自动更新另一套。

## 配置位置

| 文件                                       | 用途                                   | 管理方式                             |
| ------------------------------------------ | -------------------------------------- | ------------------------------------ |
| 用户目录下 `.hohu/config.json`             | CLI 语言、官方源码默认来源、组件仓库   | `hohu lang` 或编辑 JSON              |
| 项目 `.hohu/project.json`                  | 项目组件、已克隆仓库来源及生成入口记录 | `hohu create` 生成；检查完整性时读取 |
| `hohu-admin/.env`                          | 开发后端数据库、Redis、密钥与首次凭据  | 按开发环境教程配置                   |
| `.hohu/deploy/.env`                        | Docker 部署连接、版本、服务开关与凭据  | `hohu deploy init` 生成后配置        |
| `.hohu/deploy/docker-compose.override.yml` | 用户自定义 Compose 覆盖                | 自行维护，最后加载                   |

其他组件与业务配置见[配置项归属](../reference/configuration)。环境文件和凭据不应提交到公开仓库。

## 查看版本与配置 {#info}

```bash
hohu --version
hohu info
```

`info` 显示 CLI 版本、语言、保存的源码来源与全局配置路径；不是数据库、网络或服务健康检查。`hohu system info` 与它等价。

## 选择语言 {#language}

```bash
hohu lang
```

交互选择简体中文、English 或跟随系统，并保存到全局配置。`hohu system lang` 与它等价，无额外参数。语言影响 CLI 文案和新项目根目录入口文件，不修改已有应用国际化。

## Shell 补全 {#completion}

在支持的 Shell 中，使用 `hohu --show-completion` 查看补全脚本。需要安装时使用 `hohu --install-completion`，按输出提示重新加载 Shell。

安装会写入当前用户的 Shell 补全配置；检测不到或不支持当前 Shell 时，使用命令 `--help` 查询即可。

## 源码来源与自定义仓库 {#repositories}

在 `hohu info` 显示的配置路径编辑 JSON。保留已有键，按需添加：

```json
{
  "language": "auto",
  "source": "gitee"
}
```

`source` 支持 `auto`、`github`、`gitee`，用于后续项目创建，`hohu create --source` 优先于此配置。它不更新已有仓库，也不是 Docker 镜像或依赖安装的换源设置。

使用不同的自定义组件仓库时，可添加 `backend_repo`、`frontend_repo`、`app_repo`；仅设置需要覆盖的组件。例如：

```json
{
  "language": "auto",
  "source": "auto",
  "backend_repo": "https://example.com/team/backend.git"
}
```

`create --repo` 优先于组件仓库配置；组件自定义仓库优先于官方来源且不自动回退。地址不要嵌入密码或令牌，使用 Git 凭据管理。创建细节见 [`hohu create`](./create)，Docker 镜像换源见 [`hohu deploy`](./deploy)。

## 常见问题

| 现象             | 先检查                             | 下一步                                                     |
| ---------------- | ---------------------------------- | ---------------------------------------------------------- |
| 找不到 `hohu`    | 安装与 PATH                        | `uv tool update-shell` 后按提示刷新终端                    |
| 命令或参数不存在 | `hohu --version` 与子命令 `--help` | 核对支持情况并升级 CLI                                     |
| 找不到项目       | `.hohu/project.json`               | 进入正确项目；缺失标记时先核查创建结果                     |
| 提示未初始化部署 | `.hohu/deploy/` 与运行目录         | 在预期目录初始化并检查部署配置                             |
| 源码网络不通     | Git 仓库来源                       | 官方源可使用 `create --source gitee`；已有项目单独维护远端 |
| 镜像网络不通     | 部署镜像地址与标签                 | 使用部署 `--image-source acr`，核对镜像是否可用            |
| 初始化连接失败   | 开发后端 `.env` 和数据库/Redis     | 修复后重新执行 `hohu init`                                 |
| 全局配置没有生效 | JSON 格式及 `hohu info` 输出       | 保留已有配置，修正无效 JSON；读取失败会回退默认值          |

## 提交问题

CLI 问题提交至 [hohu-cli Issues](https://github.com/aihohu/hohu-cli/issues)，附操作系统、CLI 版本、实际命令、运行目录类型、错误及预期结果。移除日志中的凭据、连接密码和私有业务数据；无需提交完整 `.env`。
