---
title: Quick Start
description: Use the hohu CLI to create a project, install dependencies, and start the development server in one go — quickly set up your HoHu Admin development environment
---

# Quick Start

hohu-admin provides an official CLI tool `hohu` with built-in project creation, dependency installation, development server, source code building, and one-click deployment capabilities for full lifecycle management. You don't need to worry about repository URLs, installation commands, or startup methods for each sub-project — the CLI handles everything automatically.

## 1. Install the CLI

```bash
# uv (recommended)
uv tool install hohu

# pip
pip install hohu
```

## 2. Create a Project

```bash
hohu create my-project
cd my-project
```

Interactively select the components you need (Backend / Frontend / App).

## 3. Install Dependencies

```bash
hohu init
```

Automatically detects project configuration and installs all dependencies (`uv sync` / `pnpm install`). Automatically installs `uv` if missing.

> **Windows users:** If you encounter an `EPERM: operation not permitted, symlink` error, enable **Windows Developer Mode** (Settings > Update & Security > Developer options).

## 4. Start Development

```bash
hohu dev
```

Start all services with a single command. Logs are color-coded by service:

| Prefix       | Color  | Service |
| ------------ | ------ | ------- |
| `[Backend]`  | Green  | FastAPI |
| `[Frontend]` | Cyan   | Vue 3   |
| `[App]`      | Yellow | Uni-app |

Press `Ctrl+C` for a graceful shutdown.

::: tip Other startup options

```bash
hohu dev -o be        # Backend only
hohu dev -o fe        # Frontend only
hohu dev -t mp        # App in WeChat Mini Program mode
hohu dev -s app       # Skip the App
```

:::

## 5. Deploy to Production

Deploy the project to a Linux server (Docker required):

```bash
hohu build          # Build images (auto-initializes deployment config)
hohu deploy         # One-click deploy
```

After deployment, edit `.hohu/deploy/.env` to update passwords and other settings.

::: details Don't want to build from source?

Use the official pre-built images — no local source code needed:

```bash
hohu deploy init    # Initialize deployment config
# Edit .hohu/deploy/.env
hohu deploy         # Pull images and deploy
```

:::

[Detailed Deployment Guide →](/guide/deploy)

## Next Steps

- [Deployment Guide](/guide/deploy) — SSL certificates, external databases, environment variable configuration
- [Source Repositories](/guide/src) — GitHub addresses for each sub-project
- [Online Demo](/guide/show) — Experience the full feature set
