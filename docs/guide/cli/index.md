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

## Project workflow

```bash
hohu --version
hohu --help
hohu create my-project
cd my-project
hohu init
hohu dev
```

| Command                            | Current responsibility                                                              |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
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
