---
title: 为 Claude Code、Cursor 与 Codex 安装 HoHu Skills
description: '使用 npx 或 CLI 安装 HoHu 项目创建与业务开发 Skills，配置编程助手识别、工作区或用户安装范围，并管理更新。'
---

# 为 Claude Code、Cursor 与 Codex 安装 HoHu Skills

HoHu Skills 帮助编程助手通过 CLI 创建、初始化和启动项目，并按 HoHu 项目约定开发业务模块，覆盖数据库迁移、接口、权限、页面、AI 工具和验证。各 Agent 共用同一份 Skill；安装器负责放入宿主可以发现的位置。

## 准备环境

- 稳定版 Node.js **22.20.0 或更新版本**，包含 npm/npx；这是配套安装器 1.7.0 的要求。
- 已安装支持 Skills 的编程助手；创建和启动项目还需 HoHu CLI 及助手的终端执行能力。
- 执行 Skill 内的项目检查脚本时需要 Python **3.12+**。
- 在线安装需要访问 npm 和 GitHub。

新建项目时，先在准备启动助手的父工作区安装 `hohu-project`，确认宿主可以发现它，或明确选择用户范围安装。已有项目则进入准备使用助手的业务项目目录。对于 CLI 创建的多组件项目，建议在 Backend/Web 的共同项目根目录安装并启动助手；如果在组件 Git 仓库内启动，须确认宿主能够发现安装位置。

## 方式一：npx

```bash
npx skills@latest add aihohu/hohu-skills
```

按安装器提示选择 Skill、Agent、范围和安装方式。终端或 Agent 环境会影响是否出现交互；需要确定目标时显式指定 Agent：

```bash
npx skills@latest add aihohu/hohu-skills --skill hohu-business-module -a codex
```

| Agent       | `-a` 参数     |
| ----------- | ------------- |
| Claude Code | `claude-code` |
| Cursor      | `cursor`      |
| Codex       | `codex`       |
| OpenCode    | `opencode`    |
| TRAE 国际版 | `trae`        |
| TRAE 国内版 | `trae-cn`     |

可以用 `-a claude-code cursor` 选择多个 Agent。项目安装是默认范围，个人跨项目使用时加 `--global`。安装器支持符号链接或复制，环境不支持链接时可显式使用 `--copy`。

`skills@latest` 指 npm 安装器版本，不是 HoHu Skills 内容版本。最新安装器可能调整环境要求；需要固定安装器时使用 `skills@1.7.0`。HoHu Skill 内容从指定 Git 仓库读取。

## 方式二：HoHu CLI

包含 Skills 命令的 HoHu CLI 可以使用：

```bash
hohu skills install
hohu skills install --agent codex
hohu skills install --agent claude-code --agent cursor
```

该命令固定调用 `skills@1.7.0`，使用相同来源与安装记录。它显示当前目录并保留上游交互，不自动切换到父项目，也不自动选择匹配框架的 Skill 版本。

| 参数              | 说明                                    |
| ----------------- | --------------------------------------- |
| `--agent` / `-a`  | 可重复，指定上表中的 Agent 标识         |
| `--global` / `-g` | 安装到用户范围                          |
| `--yes` / `-y`    | 确认 npm 下载和安装；必须同时指定 Agent |

`--yes` 会跳过确认，重复安装可能覆盖已有 Skill。更新前先备份定制内容。上游交互仍使用上游文案，HoHu 命令帮助和错误提示支持中英文。

## 确认安装并使用

安装器应列出所选 Skill 和实际目标路径。`hohu-project` 包含项目生命周期工作流；`hohu-business-module` 还包含 `references/` 和 `scripts/`。可查看安装记录：

```bash
npx skills@latest list
```

两个 Skill 分别负责项目生命周期和业务开发：

| Skill                  | 用途                                           |
| ---------------------- | ---------------------------------------------- |
| `hohu-project`         | 使用实际 HoHu CLI 创建、初始化、启动和排查项目 |
| `hohu-business-module` | 按项目规范开发业务模块、接入权限和 AI 并验收   |

在安装了 Skills 的工作区启动助手，创建项目时可以提出：

> 使用 hohu-project 创建 equipment 项目，只需要 Backend 和 Web，初始化并启动。

助手会先检查 CLI 是否支持非交互组件选择；旧版需交互终端或兼容版本。安装 Skills 不会安装 HoHu CLI，也不代表数据库、模型和项目已配置完成。

在已有项目开发业务模块时，可以提出：

> 使用 hohu-business-module，新增租户共享的工作笔记模块，支持创建和列表、普通用户权限、中英文页面、AI 查询和经确认后创建。

业务模块默认接入应用内 AI 和受控工具。国际化遵从用户明确要求；未说明时沿用目标项目的业务模块惯例，不修改 HoHu 自带国际化。

Codex 可使用 `$hohu-business-module`，Claude Code 可使用 `/hohu-business-module`。其他 Agent 使用自己的 Skills 选择界面或在请求中明确 Skill 名称。助手应先识别项目和框架兼容性，再开始设计；安装本身不会授予业务权限或模型凭据使用权。

## 更新和移除

先检查并备份本地 Skill 定制，再在对应项目中运行：

```bash
npx skills@latest update hohu-business-module --project
npx skills@latest remove hohu-business-module
```

用户范围使用 `--global`。两种安装入口均由上游管理，不要另外编辑锁文件或混用本地复制脚本覆盖上游安装。

## 排错

| 现象                                 | 处理方式                                                                     |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| 找不到 node/npm/npx 或版本过低       | 安装满足要求的 Node.js/npm，重新打开终端                                     |
| `hohu skills` 不存在                 | 使用 npx 入口；需在包含此命令的 CLI 版本中使用包装入口                       |
| Windows 无法找到 npx JavaScript 入口 | 使用标准 Node.js/npm 安装，或直接运行 npx 命令                               |
| 仓库无法访问或未发现 Skill           | 核对网络、仓库访问权及远端是否已包含该 Skill；本地未推送的内容不会被远程安装 |
| 安装后未被助手发现                   | 检查启动目录和安装范围，刷新或新开会话；目录安装不等于宿主已成功加载         |
| 项目检查返回 `review_required`       | 审查当前源码与兼容基线的差异，再开发业务模块                                 |

更多 Agent 标识及安装选项见 [skills CLI](https://github.com/vercel-labs/skills)。离线源码安装见 [HoHu Skills 仓库说明](https://github.com/aihohu/hohu-skills/blob/main/docs/installation.md)。
