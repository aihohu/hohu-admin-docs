---
title: Install HoHu Skills
description: Install business development skills for Claude Code, Cursor, Codex, OpenCode and TRAE using npx or HoHu CLI, and manage scope and updates.
---

# Install HoHu Skills

HoHu Skills guides coding assistants through CLI project creation, initialization and startup, then business module development using your project's conventions: migrations, APIs, permissions, pages, AI tools and validation. Agents share the same skill content; the installer places it where each host can discover it.

## Prerequisites

- Stable Node.js **22.20.0 or later**, including npm/npx, as required by the paired installer version 1.7.0.
- A coding assistant that supports skills; project creation and startup also require HoHu CLI and terminal execution capability in the assistant.
- Python **3.12+** to run the skill's project inspection helper.
- Access to npm and GitHub for online installation.

For a new project, install `hohu-project` in the parent workspace where you will start the assistant, verify host discovery, or explicitly choose user scope. For an existing project, start in the business project directory where you will use your assistant. For a CLI-created project, install and launch from the common Backend/Web parent. When launching inside a component Git repository, check that the host can discover the installation.

## Option 1: npx

```bash
npx skills@latest add aihohu/hohu-skills
```

Follow the installer to select skills, agents, scope and installation method. Terminal and agent environments affect whether prompts appear; specify an agent for a predictable target:

```bash
npx skills@latest add aihohu/hohu-skills --skill hohu-business-module -a codex
```

| Agent              | `-a` value    |
| ------------------ | ------------- |
| Claude Code        | `claude-code` |
| Cursor             | `cursor`      |
| Codex              | `codex`       |
| OpenCode           | `opencode`    |
| TRAE international | `trae`        |
| TRAE China         | `trae-cn`     |

Use `-a claude-code cursor` to select multiple agents. Project scope is the default; add `--global` for personal use across projects. The installer supports symlinks and copies; use `--copy` where links are unsuitable.

`skills@latest` selects the npm installer version, not the HoHu Skills content version. Future installers may change prerequisites; use `skills@1.7.0` to pin the installer. Skill content comes from the specified Git repository.

## Option 2: HoHu CLI

A HoHu CLI version that includes the Skills command supports:

```bash
hohu skills install
hohu skills install --agent codex
hohu skills install --agent claude-code --agent cursor
```

This calls `skills@1.7.0` with the same source and installation records. It displays the current directory and preserves upstream interaction. It does not switch to a parent project or automatically select a skill version for your framework.

| Option            | Behavior                                                          |
| ----------------- | ----------------------------------------------------------------- |
| `--agent` / `-a`  | Repeat to select agent IDs from the table above                   |
| `--global` / `-g` | Install at user scope                                             |
| `--yes` / `-y`    | Confirm npm download and installation; requires an explicit agent |

`--yes` skips confirmation, and repeated installation may overwrite existing skills. Back up customizations first. Upstream prompts retain their own wording; HoHu help and error messages support English and Chinese.

## Verify and use

The installer should list the selected skills and their destinations. `hohu-project` contains the project lifecycle workflow; `hohu-business-module` also includes `references/` and `scripts/`. Inspect installed skills with:

```bash
npx skills@latest list
```

The two skills handle project lifecycle and business development respectively:

| Skill                  | Purpose                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `hohu-project`         | Create, initialize, start and troubleshoot projects using the actual HoHu CLI                  |
| `hohu-business-module` | Develop modules following project conventions, integrate permissions and AI, and validate them |

Start your assistant in the workspace with the installed skills. To create a project, ask:

> Use hohu-project to create equipment with Backend and Web only, initialize it and start it.

The assistant first checks CLI support for non-interactive component selection; older versions require an interactive terminal or a compatible version. Installing skills does not install HoHu CLI or configure databases, models or the project.

For business development in an existing project, ask:

> Use hohu-business-module to add a tenant-shared work-note module with create/list, ordinary-user permissions, English/Chinese pages, AI queries and confirmed creation.

Business modules include application AI and controlled tools by default. Internationalization follows your explicit request, otherwise the target project's business module conventions, without changing HoHu's built-in internationalization.

Codex supports `$hohu-business-module`; Claude Code supports `/hohu-business-module`. In other agents, use the skill selector or name the skill in your request. The assistant should inspect the project and compatibility before designing the module. Installation does not grant business permissions or access to model credentials.

## Update and remove

Review and back up local customizations, then run from the corresponding project:

```bash
npx skills@latest update hohu-business-module --project
npx skills@latest remove hohu-business-module
```

Use `--global` for user scope. Both installation entry points use upstream management; avoid editing lockfiles or overwriting upstream installations with the local copy helper.

## Troubleshooting

| Symptom                                              | Action                                                                                                                                       |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| node/npm/npx missing or Node too old                 | Install a supported Node.js/npm version and reopen the terminal                                                                              |
| `hohu skills` is unavailable                         | Use npx; the wrapper requires a CLI version containing this command                                                                          |
| Windows cannot locate the npx JavaScript entry point | Use a standard Node.js/npm installation or run npx directly                                                                                  |
| Repository inaccessible or no skill found            | Check connectivity, repository access and whether the remote contains the skill; unpushed local files are unavailable to remote installation |
| Assistant does not discover the installed skill      | Check startup directory and scope, then refresh or start a new session; file installation alone does not prove host discovery                |
| Inspector reports `review_required`                  | Review source differences from the compatibility baseline before development                                                                 |

See [skills CLI](https://github.com/vercel-labs/skills) for additional agents and options, and the [HoHu Skills repository](https://github.com/aihohu/hohu-skills/blob/main/docs/installation.md) for offline source installation.
