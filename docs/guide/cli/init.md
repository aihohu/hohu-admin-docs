---
title: hohu init — Initialize a project
description: Install component dependencies with hohu init, prepare the backend environment, migrate the database and initialize built-in data, then verify results or retry.
---

# hohu init

Install dependencies for declared components and run their initialization scripts when present. Standard Backend prepares its environment, migrates the database and synchronizes built-in data.

## Prerequisites

Complete [`hohu create`](./create) and confirm that selected directories exist. Run from the root containing `.hohu/project.json`, or a subdirectory. Prepare runtimes, PostgreSQL and Redis using [development setup](../quick-start), then check the target database and connection settings.

The tutorial explains first-time environment files and connection configuration. Initialization can change database structure and built-in data.

## Usage

```bash
hohu init
```

There are no component filtering options. Components run in marker order; missing directories are skipped.

## Process and results

| Component | Preferred dependency command | Initialization                          |
| --------- | ---------------------------- | --------------------------------------- |
| Backend   | `uv sync`                    | Run `scripts/init.py` if present        |
| Web       | `pnpm install`               | No additional CLI initialization script |
| App       | `pnpm install`               | No additional CLI initialization script |

Installation failures trigger fallbacks: `pip install -r requirements.txt` for Backend and `npm install` for Web/App. Success depends on the project's actual files and tools.

Standard backend initialization:

1. Create a missing `.env` from `.env.example` and generate the application secret.
2. Generate an initial password when `HOHU_ADMIN_PASSWORD` is not provided.
3. Run `alembic upgrade head`, followed by built-in data initialization.

Existing `.env` files are retained. Data synchronization preserves existing administrator passwords and user customizations. Credentials are in the backend `.env`; see [first sign-in](../quick-start). Initialization does not start development services or prepare Docker deployment configuration.

Check each component's installation output and backend migration and initialization results. Run [`hohu dev`](./dev), then sign in to verify availability. Internal initialization scripts do not need to be repeated separately.

## Retry after failure

Fix the error, then rerun `hohu init` in the same project.

| Symptom                            | Action                                                                                              |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| Project not found                  | Enter a directory containing `.hohu/project.json`                                                   |
| Database or Redis connection fails | Check services, database existence and `hohu-admin/.env`, then retry                                |
| Installation fails                 | Read the component's output; check runtimes, network and lockfiles                                  |
| Directory or script is missing     | Check source completeness; directories may be skipped and missing scripts may only produce warnings |
| Windows symlink permission error   | Enable Windows Developer Mode and check write permissions                                           |

The final message does not replace checking every component. Recover migration failures according to the actual error rather than deleting the database to retry.
