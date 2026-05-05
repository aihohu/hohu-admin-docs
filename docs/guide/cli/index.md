---
title: CLI Overview
description: Overview of the hohu command-line tool providing full lifecycle management including project creation, dependency installation, dev server, source builds, and one-click deployment
---

# CLI Overview

`hohu` is the official command-line tool for hohu-admin, providing full lifecycle management capabilities including project creation, dependency installation, development servers, source builds, and one-click deployment.

## Installation

```bash
# uv (recommended)
uv tool install hohu

# pip
pip install hohu
```

## Update

```bash
# uv
uv tool upgrade hohu

# pip
pip install --upgrade hohu
```

## Command Reference

| Command               | Description                                     |
| --------------------- | ----------------------------------------------- |
| `hohu create [NAME]`  | Create a project and clone repository templates |
| `hohu init`           | Install dependencies for all sub-projects       |
| `hohu dev`            | Start development servers                       |
| `hohu build`          | Build Docker images from local source code      |
| `hohu deploy`         | One-click Docker deployment                     |
| `hohu deploy init`    | Initialize deployment directory and .env        |
| `hohu deploy pull`    | Pull latest images and restart                  |
| `hohu deploy ps`      | View service status                             |
| `hohu deploy logs`    | View service logs                               |
| `hohu deploy restart` | Restart services                                |
| `hohu deploy down`    | Stop all services                               |
| `hohu migrate`        | Run database migrations                         |
| `hohu lang`           | Switch display language                         |
| `hohu info`           | View current configuration                      |
| `hohu --version`      | Display version number                          |

## hohu create

Create a new project and interactively select components (backend / frontend / app).

```bash
hohu create my-project
hohu create              # Default name: hohu-admin
hohu create my-app --repo https://github.com/your-org/your-template.git
```

| Parameter       | Description                            |
| --------------- | -------------------------------------- |
| `NAME`          | Project name, defaults to `hohu-admin` |
| `--repo` / `-r` | Custom template repository URL         |

After creation, run:

```bash
cd my-project
hohu init
```

## hohu init

Automatically detects the project configuration (`.hohu/project.json`) and installs all dependencies.

```bash
hohu init
```

- Backend: runs `uv sync` (automatically installs `uv` if missing)
- Frontend / App: runs `pnpm install`
- Provides manual installation instructions if automatic installation fails

## hohu dev

Starts all development services in a single terminal with color-coded log output.

```bash
hohu dev          # Start all components
hohu dev -o be    # Backend only
hohu dev -o fe    # Frontend only
hohu dev -s app   # Skip the App
hohu dev -t mp    # App in WeChat Mini Program mode
```

### Parameters

| Parameter      | Short | Description                                       | Default |
| -------------- | ----- | ------------------------------------------------- | ------- |
| `--app-target` | `-t`  | App run target: `h5` / `mp` / `app`               | `h5`    |
| `--only`       | `-o`  | Only start specified components (can be repeated) | All     |
| `--skip`       | `-s`  | Skip specified components (can be repeated)       | None    |

Component aliases (case-insensitive):

| Alias             | Component |
| ----------------- | --------- |
| `be` / `backend`  | Backend   |
| `fe` / `frontend` | Frontend  |
| `app`             | App       |

### Log Colors

| Prefix       | Color  | Service |
| ------------ | ------ | ------- |
| `[Backend]`  | Green  | FastAPI |
| `[Frontend]` | Cyan   | Vue 3   |
| `[App]`      | Yellow | Uni-app |

Press `Ctrl+C` to gracefully exit. All child processes will be safely terminated.

## hohu lang

Switch the CLI display language. Supports Chinese, English, and system default.

```bash
hohu lang
```

Interactive selection: Simplified Chinese / English / System default.

## hohu info

View current CLI configuration details, including version, language, and config file paths.

```bash
hohu info
```
