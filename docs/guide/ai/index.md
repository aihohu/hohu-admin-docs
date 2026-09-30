---
title: HoHu AI overview
description: Use Skills to create HoHu projects and develop modules, or use application AI assistants to query business data and confirm operations.
---

# AI

HoHu supports AI-assisted source development and AI operations inside applications. Choose the entry for your task:

| Your task                                                  | Start here                                                                | Prerequisites                                                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Have a coding assistant create a project or build a module | [Install Skills](../cli/skills) → [AI-assisted development](../ai-coding) | A Skills-capable agent and development environment; project creation also requires HoHu CLI |
| Query or process business data in a deployed application   | [Application AI assistant](../user/ai)                                    | An account, an available model and assistant, and business permissions                      |
| Let an application assistant use your module               | [Connect business tools](../development/ai-tools)                         | The module's Service, feature permissions and data scope                                    |
| Configure models, assistants and runtime settings          | [Configuration and operations](../operations/ai)                          | Relevant administration access, a model connection and deployment configuration             |

## Develop with Skills

HoHu Skills provides project workflows for coding assistants including Claude Code, Cursor, Codex, OpenCode and TRAE. `hohu-project` uses the actual CLI to create, initialize and start projects. `hohu-business-module` implements data models, APIs, permissions, pages and application AI tools following the target project's conventions.

Follow the [installation guide](../cli/skills), then make a request from a workspace where the assistant can discover the skills:

> Create equipment with Backend and Web only, initialize it and start it. Then build an equipment borrowing module with borrow, return and list operations. Use Chinese-only business content.

Business modules include application AI by default. Internationalization follows your explicit request, otherwise the target module conventions; HoHu's built-in internationalization retains its existing behavior. Review the actual pages, permissions, tests and AI tool execution records. Follow [AI-assisted development](../ai-coding) for the complete workflow.

## Use AI inside an application

Application assistants query and process data through registered business tools. A tool call requests a specific capability, such as listing loans or returning equipment. It remains subject to the current account's feature permissions, tenant boundary and data scope.

Begin with a read-only query. Writes requiring approval display a confirmation card; review the target and impact before approving. Model text alone does not prove an operation succeeded: check tool results and application data. See the [Application AI assistant](../user/ai).

Installing Skills does not configure application models or grant business permissions. If an assistant is unavailable after development, follow [Configuration and operations](../operations/ai) to check model connectivity, assistant status and role authorization.
