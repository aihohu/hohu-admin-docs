---
title: hohu create — 创建项目
description: 使用 hohu create 选择 Backend、Web 和 App，配置 GitHub 或 Gitee 来源，进行非交互创建并检查生成的项目文件。
---

# hohu create

获取所选组件的源码，生成项目标记和开发入口文件。不安装依赖或启动服务，下一步是 [`hohu init`](./init)。

## 前提条件

安装 HoHu CLI 和 Git，确认可以访问源码仓库。在新项目的父目录运行；项目名为单个文件夹名，同名文件或目录必须不存在。私有仓库需要预先配置 Git 访问凭据。

## 用法与参数

```bash
hohu create [PROJECT_NAME] [OPTIONS]
```

| 参数                 | 说明                                        | 默认值                                 |
| -------------------- | ------------------------------------------- | -------------------------------------- |
| `PROJECT_NAME`       | 当前目录下的项目文件夹名，不接受路径        | `hohu-admin`                           |
| `--component` / `-c` | 可重复：`backend`、`frontend`、`web`、`app` | 逐项交互选择                           |
| `--non-interactive`  | 禁止组件选择交互，必须指定 `--component`    | 关闭                                   |
| `--source`           | 官方源码来源：`auto`、`github`、`gitee`     | 全局配置的 `source`，未配置则为 `auto` |
| `--repo` / `-r`      | 自定义仓库，统一用于所有所选组件            | 组件配置的仓库                         |

组件名大小写不敏感，`web` 是 `frontend` 的别名，重复项会去重。`create` 不接受 `be`、`fe` 等开发命令的简称。

## 常用示例 {#examples}

```bash
# 交互选择组件
hohu create my-project

# Backend + Web，适用于脚本或编程助手
hohu create my-project --component backend --component web --non-interactive

# 指定官方 Gitee 来源
hohu create my-project --component backend --component web --source gitee

# 仅创建来自自定义仓库的 Backend
hohu create my-project --component backend --repo https://example.com/team/backend.git
```

`--repo` 不是多个组件的独立来源映射。分别指定组件仓库时，使用[全局配置](./configuration#repositories)。

## 源码来源

`auto` 优先 GitHub，网络或传输失败时切换到官方 Gitee 镜像；认证、路径冲突、磁盘等错误直接报告。显式 `github`、`gitee` 和自定义仓库不会自动换源。

官方仓库检出 `main`，不固定到发布标签；自定义仓库检出远端默认分支。镜像可能存在同步时差，各组件的实际来源、分支和提交保存在 `.hohu/project.json`。默认来源设置见[全局配置](./configuration#repositories)，该设置不影响 npm、PyPI 或 Skills 安装来源。

## 执行结果

Backend + Web 项目完成后的主要文件：

```text
my-project/
├── .hohu/project.json
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── .gitignore
├── hohu-admin/
└── hohu-admin-web/
```

根目录入口文件在全部组件克隆完成后生成。创建不会为父项目初始化 Git 仓库；组件仓库的提交不包含父目录入口文件。

核对所选目录均存在，再进入项目，按[开发环境教程](../quick-start)准备配置并执行 [`hohu init`](./init)。使用编程助手时，在共同项目根目录打开项目。

## 排错

| 现象               | 处理方式                                                                     |
| ------------------ | ---------------------------------------------------------------------------- |
| 同名路径已存在     | 使用新名称，或先确认已有目录内容；命令不会覆盖                               |
| 无法克隆           | 核对网络、Git 凭据与地址；官方源网络不通时可使用 `--source gitee`            |
| 只创建了部分组件   | 检查项目标记与实际目录；没有自动续传命令，可用新名称重建，或人工恢复缺失组件 |
| 非交互模式要求组件 | 指定至少一个 `--component`                                                   |
| 参数不被识别       | 查看 `hohu create --help`，确认安装版本支持                                  |

`hohu init` 会跳过缺失的组件目录，其成功提示不能证明克隆完整。
