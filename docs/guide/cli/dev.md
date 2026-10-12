---
title: hohu dev — Run development services
description: Start Backend, Web and App with hohu dev, filter components, select App targets, read logs and stop development processes.
---

# hohu dev

Start component development services in one terminal with merged, prefixed logs. The command stays in the foreground and is intended for local development.

## Prerequisites

Complete [`hohu init`](./init). Ensure databases, Redis and settings are available. Run from the project root or a subdirectory.

## Usage and options

```bash
hohu dev [OPTIONS]
```

| Option                | Description                                | Default                 |
| --------------------- | ------------------------------------------ | ----------------------- |
| `--only` / `-o`       | Start selected components only; repeatable | All declared components |
| `--skip` / `-s`       | Exclude components; repeatable             | None                    |
| `--app-target` / `-t` | App target: `h5`, `mp`, `app`              | `h5`                    |

| Component | Accepted names, case-insensitive |
| --------- | -------------------------------- |
| Backend   | `backend`, `be`, `admin`         |
| Web       | `frontend`, `fe`, `web`          |
| App       | `app`                            |

When both filters are used, selection is followed by exclusion; `--skip` wins. Filtering applies only to existing components and does not download source. Unknown names are currently ignored; check the startup list.

## Examples

```bash
# All development services
hohu dev

# Backend + Web only
hohu dev --only backend --only web

# Skip App
hohu dev --skip app

# Only App for WeChat Mini Programs
hohu dev --only app --app-target mp
```

`h5`, `mp` and `app` invoke the App project's `pnpm dev`, `pnpm dev:mp` and `pnpm dev:app` scripts. Mini program and native App development still require platform tools. The CLI does not launch WeChat Developer Tools or perform native packaging automatically.

## Verify startup and stop

Logs use `[Backend]`, `[Frontend]` and `[App]` prefixes. Standard Web defaults to `http://localhost:9527`, Backend to `http://127.0.0.1:8000`, and API documentation to `http://127.0.0.1:8000/docs`. Use the actual addresses printed by components.

Open Web and sign in to verify the connection. The development backend defaults to `APP_ROLE=all`, also running the scheduler in the single process. See the [deployment guide](../deploy) for production configuration.

Press **Ctrl+C** in the startup terminal to terminate child processes started by the CLI.

## Troubleshooting

| Symptom                       | Action                                                             |
| ----------------------------- | ------------------------------------------------------------------ |
| No component starts           | Check the project marker, names and conflicting filters            |
| A component is skipped        | Check source directories and startup commands, then retry          |
| Port conflict or process exit | Read component logs and check ports and settings                   |
| Web opens but sign-in fails   | Check Backend availability and Web service URLs and proxy settings |

Other components may remain running when one fails. Press Ctrl+C before fixing the error and restarting. See [configuration and troubleshooting](./configuration) for more.
