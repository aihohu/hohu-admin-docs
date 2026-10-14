---
title: HoHu CLI manual and command reference
description: Install and upgrade HoHu CLI, then find commands for project creation, initialization, development, Docker builds, deployment, migrations, monitoring and Skills.
---

# HoHu CLI

HoHu CLI creates, develops and deploys HoHu projects. To run your first application, follow [development setup](../quick-start). For a server installation, follow the [deployment guide](../deploy). This section explains commands, options and results.

## Command reference {#command-reference}

Select a command for its options and examples. Square brackets mark optional arguments; `...` means multiple values are accepted. Do not type these markers.

Use `hohu <command> --help` in your terminal, for example `hohu create --help` or `hohu deploy logs --help`.

| Command                                                         | Purpose                                                       |
| --------------------------------------------------------------- | ------------------------------------------------------------- |
| [`hohu create [NAME]`](./create)                                | Create a project with Backend, Web and App components         |
| [`hohu init`](./init)                                           | Install project dependencies and initialize the backend       |
| [`hohu dev`](./dev)                                             | Run development services in the foreground                    |
| [`hohu build`](./build)                                         | Build Backend/Web Docker images from source                   |
| [`hohu deploy init`](./deploy#init)                             | Generate deployment configuration and initial credentials     |
| [`hohu deploy`](./deploy#deploy)                                | Prepare images, migrate data and start the application        |
| [`hohu deploy ps`](./deploy#ps)                                 | Show deployment service status                                |
| [`hohu deploy logs [SERVICES...]`](./deploy#logs)               | Read logs; add `-f` to follow output                          |
| [`hohu deploy restart [SERVICES...]`](./deploy#restart)         | Restart all or selected services                              |
| [`hohu deploy down`](./deploy#down)                             | Stop and remove deployment containers                         |
| [`hohu deploy pull`](./deploy#pull)                             | Update images, migrate data and start services                |
| [`hohu deploy upgrade`](./deploy#upgrade)                       | Update source in the root repository, build and redeploy      |
| [`hohu migrate`](./migrate)                                     | Run deployment migrations and seed synchronization separately |
| [`hohu monitoring init`](./monitoring#init)                     | Prepare Prometheus/Grafana configuration                      |
| [`hohu monitoring up`](./monitoring#up)                         | Start monitoring services                                     |
| [`hohu monitoring ps`](./monitoring#ps)                         | Show monitoring service status                                |
| [`hohu monitoring logs [SERVICES...]`](./monitoring#logs)       | Read monitoring logs                                          |
| [`hohu monitoring restart [SERVICES...]`](./monitoring#restart) | Restart monitoring services                                   |
| [`hohu monitoring down`](./monitoring#down)                     | Stop and remove monitoring containers                         |
| [`hohu skills install`](./skills)                               | Install HoHu Skills for coding assistants                     |
| [`hohu lang`](./configuration#language)                         | Select the CLI language                                       |
| [`hohu info`](./configuration#info)                             | Show the CLI version and global configuration location        |
| `hohu --version`                                                | Show the CLI version                                          |
| `hohu --help`                                                   | Show available commands                                       |
| [`hohu --show-completion`](./configuration#completion)          | Print the current shell's completion script                   |
| [`hohu --install-completion`](./configuration#completion)       | Install command completion for the current shell              |

`hohu system lang` and `hohu system info` are aliases of `hohu lang` and `hohu info`.

## Install and upgrade {#installation}

The CLI requires Python **3.10+**. Install it with uv:

```bash
uv tool install hohu
hohu --version
hohu --help
```

See the [uv installation instructions](https://docs.astral.sh/uv/getting-started/installation/). If `hohu` is not found, run `uv tool update-shell` and follow its instructions to refresh PATH or reopen your terminal.

Upgrade the CLI:

```bash
uv tool upgrade hohu
```

Use the unified `--source` / `-s` options to select sources. See [sources by command](./configuration#sources) for accepted values.

Upgrading the CLI does not update an existing project's source, dependencies or deployment images. See [release notes](../reference/versions) for component releases. If an installed version lacks an option documented here, check the command's `--help` and upgrade to a version that provides it.

The CLI and application have different Python requirements. Backend/Web development also needs Git, the backend Python runtime, Node.js, pnpm, PostgreSQL and Redis; see [development setup](../quick-start) for versions. Building and deploying require Docker; deployment and monitoring also require Docker Compose.

## Get started {#quick-start}

After preparing the development environment, create a Backend + Web project:

```bash
hohu create my-project --component backend --component web --non-interactive
cd my-project
hohu init
hohu dev
```

`create` fetches source, `init` installs dependencies and initializes the project, and `dev` keeps development services running. Database configuration, initial credentials and first sign-in are covered in [development setup](../quick-start).

For coding assistants, [install HoHu Skills](./skills), then follow [AI-assisted development](../ai-coding) to create a project or develop business modules.

## Working directory {#working-directory}

| Operation                                           | Run from                                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `create`                                            | The parent directory of the new project                                                                |
| `init`, `dev`, `build`                              | The project root containing `.hohu/project.json`, or a subdirectory                                    |
| `deploy init`                                       | The intended deployment directory; it writes `.hohu/deploy/` under the current directory               |
| Other deployment, migration and monitoring commands | The parent of an initialized deployment directory, or a subdirectory                                   |
| `deploy upgrade`                                    | A project satisfying the project marker, deployment configuration and root Git repository requirements |
| `skills install`                                    | The coding assistant's workspace, or use a user-wide installation                                      |
| `lang`, `info`, `--help`, `--version`               | Any directory                                                                                          |

Development uses `hohu-admin/.env`; deployment uses `.hohu/deploy/.env`. Check the working directory and target configuration when troubleshooting; see [configuration and troubleshooting](./configuration).
