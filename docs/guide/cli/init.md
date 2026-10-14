---
title: hohu init — Initialize a project
description: Select package sources with hohu init, install locked dependencies, configure mirror fallback and initialize the database with actionable retry guidance.
---

# hohu init

Install dependencies for declared components and run their initialization scripts when present. Standard Backend prepares its environment, migrates the database and synchronizes built-in data.

## Prerequisites

Complete [`hohu create`](./create) and confirm that selected directories exist. Run from the root containing `.hohu/project.json`, or a subdirectory. Prepare runtimes, PostgreSQL and Redis using [development setup](../quick-start), then check the target database and connection settings.

The tutorial explains first-time environment files and connection configuration. Initialization can change database structure and built-in data.

Selected components require a valid `uv.lock` or `pnpm-lock.yaml`. If missing, generate and review it with the project's package manager first; the CLI does not resolve the latest versions automatically.

## Usage

```bash
hohu init
hohu init -s mirror
hohu init --source official
```

There are no component filtering options. Components run in marker order; missing directories are skipped.

## Package sources {#sources}

`--source` and `-s` are equivalent. The default is `auto`; the option applies only to the current initialization command:

| Value      | Behavior                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `auto`     | Preserve configured sources; retry public official package download timeouts and connection failures once using a mainland China mirror |
| `official` | Use only official public package sources, without fallback                                                                              |
| `mirror`   | Use public mirrors in mainland China directly, without fallback                                                                         |

| Dependencies | Official source               | Mainland China mirror                      |
| ------------ | ----------------------------- | ------------------------------------------ |
| Python       | PyPI                          | `https://pypi.tuna.tsinghua.edu.cn/simple` |
| Web / App    | `https://registry.npmjs.org/` | `https://registry.npmmirror.com/`          |

The mirrors above provide an alternative when official registries are difficult to reach from mainland China. Choose based on your network connectivity; `auto` responds to download failures and does not detect your location. Use `hohu init -s official` to keep downloads on official registries without mirror fallback.

Existing custom Python source settings and non-public default npm registries are preserved: use `auto` to install without overriding them. Explicit `official/mirror` options that conflict with those settings stop with guidance. pnpm retains scoped registries and their authentication. Projects already configured for npmmirror use it directly without a redundant retry. Global source configuration is never changed.

Fallback is considered after the package manager's own retries. Authentication, certificate, dependency resolution, build, hash and lockfile errors do not trigger a switch; a failed mirror attempt stops installation. Interpreter downloads, Git/fixed-URL dependencies and downloads performed by build scripts are not redirected through public package mirrors. Fixed tarball URLs in lockfiles are not rewritten.

`hohu create -s gitee` selects source repositories, while `hohu deploy -s acr` selects container images. These settings do not select package sources and apply independently; see [configuration and troubleshooting](./configuration#sources).

## Process and results

| Component | Preferred dependency command     | Initialization                                                             |
| --------- | -------------------------------- | -------------------------------------------------------------------------- |
| Backend   | `uv sync --locked`               | Run `scripts/init.py` if present using the component's `.venv` interpreter |
| Web       | `pnpm install --frozen-lockfile` | No additional CLI initialization script                                    |
| App       | `pnpm install --frozen-lockfile` | No additional CLI initialization script                                    |

Python mirror installation exports locked versions and hashes with `uv export --locked`, then uses `uv pip sync` with an explicit component `.venv` interpreter. It preserves the original `uv.lock` and editable project installation. This uses uv, not system pip. Web/App always use pnpm, never fall back to npm, and keep `pnpm-lock.yaml` frozen.

Standard backend initialization:

1. Create a missing `.env` from `.env.example` and generate the application secret.
2. Generate an initial password when `HOHU_ADMIN_PASSWORD` is not provided.
3. Run `alembic upgrade head`, followed by built-in data initialization.

Existing `.env` files are retained. Data synchronization preserves existing administrator passwords and user customizations. Credentials are in the backend `.env`; see [first sign-in](../quick-start). Initialization does not start development services or prepare Docker deployment configuration.

Check each component's installation output and backend migration and initialization results. Run [`hohu dev`](./dev), then sign in to verify availability. Internal initialization scripts do not need to be repeated separately.

## Retry after failure

Fix the error, then rerun `hohu init` in the same project.

The terminal shows install commands, package manager output and source switches. Sanitized logs are saved to each component's `.local/reports/install-*.log`; the log path is shown when installation completes or fails.

| Symptom                                      | Action                                                                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Project not found                            | Enter a directory containing `.hohu/project.json`                                                                        |
| Database or Redis connection fails           | Check services, database existence and `hohu-admin/.env`, then retry                                                     |
| Installation fails                           | Read the component's output; check runtimes, network and lockfiles                                                       |
| Public package download times out            | Default behavior retries once through a mirror; use `hohu init -s mirror` explicitly or inspect the log if it also fails |
| Source option conflicts with custom settings | Use `hohu init -s auto` to preserve settings, or adjust the package manager configuration yourself                       |
| Missing or stale lockfile                    | Generate or update it with the project package manager and review the changes; switching sources does not fix this       |
| Directory or script is missing               | Check source completeness; directories may be skipped and missing scripts may only produce warnings                      |
| Windows symlink permission error             | Enable Windows Developer Mode and check write permissions                                                                |

The final message does not replace checking every component. Recover migration failures according to the actual error rather than deleting the database to retry.
