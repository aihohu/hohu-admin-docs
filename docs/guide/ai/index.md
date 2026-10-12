---
title: HoHu AI usage and development guide
description: Create and develop HoHu applications with AI, or use application assistants for business queries and confirmed actions. Find prerequisites and current capabilities.
---

# AI usage and development

HoHu supports two AI workflows: coding assistants use HoHu Skills to create and develop applications; application assistants query and process business data in a running application. Their models and permissions are configured separately.

## Choose your task {#start}

| Your task                                   | Recommended path                                                                          | Prerequisites                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Create a project or build a business module | [Install Skills](../cli/skills) → [AI-assisted development](../ai-coding)                 | A Skills-capable coding assistant, HoHu CLI and a development environment |
| Query or process business data              | [Application AI assistant](../user/ai)                                                    | An account, an available assistant and model, and business permissions    |
| Configure AI for the first time             | [Configuration and operations](../operations/ai#first-setup) → ordinary-user verification | Default-tenant system super-administrator and model service credentials   |
| Connect your own module                     | [Connect business tools](../development/ai-tools)                                         | An existing Service, feature permissions and data visibility rules        |

## Create and develop with AI {#development}

HoHu Skills provides workflows for Claude Code, Cursor, Codex, OpenCode, TRAE and other coding assistants:

| Skill                  | Responsibility                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `hohu-project`         | Create, initialize, start and troubleshoot projects through the actual CLI                                                 |
| `hohu-business-module` | Develop business modules following project conventions, connect permissions, pages and application AI tools, then validate |

Install in the workspace where you will use your assistant:

```bash
npx skills@latest add aihohu/hohu-skills
```

Choose skills, coding assistants and scope. Verify host discovery, then describe your request:

> Create equipment with Backend and Web only, initialize it and start it. Then build equipment borrowing with borrow, return and list operations. Ordinary users may only view their own loans. Use Chinese-only business content.

Equipment borrowing is a development example, not a built-in application installed with Skills. Skills guide implementation and validation; review actual pages, permissions, tests and AI tool execution records. Follow [AI-assisted development](../ai-coding) for the complete process.

See [Install Skills](../cli/skills) for prerequisites, assistant IDs and updates. Installing Skills does not install HoHu CLI, configure application models or grant business permissions.

## Use an application assistant {#application}

Open **AI Chat**, choose an available model and use automatic routing or select an assistant manually. Begin with a read-only query, then try a confirmed action: **describe the task → review targets and impact → approve → inspect tool results and the business page**.

The following built-in assistants are currently published. Available operations also depend on enabled status, role bindings, feature permissions and data scope in your instance.

| Assistant             | Current capabilities                                                                                                   | Boundaries                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| User management       | User queries, statistics, creation and updates, department and role assignments, import/export and controlled deletion | Writes and exports follow tool confirmation flows                                                     |
| Role permissions      | Role queries, creation and updates of delegated roles, menu and assistant authorization sets                           | Grants remain within delegation limits; deletion uses the regular page                                |
| Department management | Department queries, creation, updates and organizational tree moves                                                    | Department deletion uses the regular page                                                             |
| Shared tools          | Parse uploaded files into structured summaries                                                                         | Requires file parsing permission and an effective tool policy; does not manage other business domains |

System configuration, AI Provider and scheduled-job assistants are not yet published. Custom business capabilities require registered tools; a new HTTP API does not automatically become an AI tool.

Tools remain subject to the current account's permissions, tenant boundary and data scope. Generated text does not prove success: inspect tool results and the business page. See [Application AI assistant](../user/ai) for usage and troubleshooting, and [Configuration and operations](../operations/ai) for administration.
