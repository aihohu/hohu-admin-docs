---
title: HoHu CLI overview and installation
description: Install and upgrade hohu-cli, then create projects, initialize environments, run development services and build deployments.
---

# CLI overview

hohu-cli is the shared entry for project creation, initialization, development and deployment. See [Versions](../reference/versions) for installation sources and matching revisions.

## Install and upgrade

Prepare Python 3.10 or later and uv, then run:

```bash
uv tool install hohu
hohu --version
```

Upgrade an existing installation:

```bash
uv tool upgrade hohu
```

The CLI Python requirement differs from the backend. Backend projects also require the Python, Node.js, database and Redis versions described in [development setup](../quick-start).

## Create a project

```bash
hohu --version
hohu --help
hohu create my-project
```

Select Backend, Frontend and App interactively. After creation, check `.hohu/project.json` and the selected component directories. Creation clones source only; it does not install dependencies or start services.

### Non-interactive creation

Run `hohu create --help` first. Versions exposing `--component` and `--non-interactive` support agents and scripts:

```bash
hohu create my-project --component backend --component web --non-interactive
```

Repeat `--component` to select `backend`, `frontend` (alias `web`) and `app`. Non-interactive mode requires explicit components. If an older version lacks these options, use interactive creation or install a CLI version containing the feature.

Use a single folder name under the current directory. Existing paths are rejected. A failed clone can leave partial files: inspect them and recover the missing step without overwriting the project. `--repo` replaces the source for every selected component; it does not map separate Backend and Web repositories.

## Initialize and start

Prepare databases, Redis and component environment configuration using [development setup](../quick-start). Confirm all selected components were cloned, then enter the project:

```bash
cd my-project
hohu init
hohu dev
```

`hohu init` installs dependencies and runs component initialization, which can execute migrations and seed synchronization. Confirm the target database first, and check each component's actual result afterwards. `hohu dev` runs in the foreground. Use the printed URLs to check pages, backend availability and sign-in; press Ctrl+C in its terminal to stop development services.

## Install Skills

Run from the workspace your agent will open:

```bash
hohu skills install
hohu skills install --agent claude-code --agent cursor
```

Check availability with `hohu skills --help`. The command requires Node.js 22.20.0+ and npm/npx and invokes a pinned upstream installer. See [AI · Install Skills](./skills) for prerequisites, scope and updates. CLI versions without the command can use the guide's npx entry point.

For a new project, install in the parent workspace and confirm agent discovery. Follow [AI-assisted development](../ai-coding) to create projects with `hohu-project` or build business features with `hohu-business-module`.

## Command reference

| Command                            | Current responsibility                                                              |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| `hohu skills install`              | Install HoHu Skills for coding assistants                                           |
| `hohu create`                      | Create a project and select components                                              |
| `hohu init`                        | Install dependencies and prepare backend environment, migrations and initialization |
| `hohu dev`                         | Start development services                                                          |
| `hohu build`                       | Build Docker images from source                                                     |
| `hohu deploy init`                 | Prepare deployment directory and configuration                                      |
| `hohu deploy`                      | Infrastructure, migrations, seed synchronization and startup                        |
| `hohu migrate`                     | Run deployment migrations and seed synchronization                                  |
| `hohu deploy ps/logs/restart/down` | Status, logs, restart and stop                                                      |
| `hohu deploy pull/upgrade`         | Image or source-build upgrades; see deployment reference                            |
| `hohu lang` / `hohu info`          | CLI language and configuration information                                          |

Use `hohu <command> --help` to inspect subcommand arguments and examples. Initialization does not wipe the database; users do not separately run internal init_db or sync_menus scripts.

See [hohu build](./build), [hohu deploy](./deploy) and the [Deployment guide](../deploy).
