---
title: hohu build
description: Use hohu build to build backend and frontend Docker images from local source code, then deploy with hohu deploy
---

# hohu build

Build Docker images from local source code. After building, run `hohu deploy` to deploy using the local images.

## Usage

```bash
hohu build                  # Build all components
hohu build --only=backend   # Build backend only
hohu build --only=frontend  # Build frontend only
hohu build --no-cache       # Build without cache
hohu build --tag=v1.0.0     # Custom image tag
hohu build --reset          # Reset to official GHCR images
```

## Parameters

| Parameter    | Description                                                          | Default  |
| ------------ | -------------------------------------------------------------------- | -------- |
| `--only`     | Only build specified component (`backend` or `frontend`)             | All      |
| `--tag`      | Docker image tag                                                     | `source` |
| `--no-cache` | Do not use Docker build cache                                        | `false`  |
| `--reset`    | Clear local image configuration, switch back to official GHCR images | `false`  |

## Workflow

```
hohu build
    │
    ├─ Auto-initialize .hohu/deploy/ (on first run)
    │   ├─ docker-compose.yml
    │   ├─ .env (auto-generated passwords and keys)
    │   └─ nginx/
    │
    ├─ Build images
    │   ├─ hohu-admin:<tag>      (backend)
    │   └─ hohu-admin-web:<tag>  (frontend)
    │
    └─ Update .hohu/deploy/.env
        ├─ API_IMAGE=hohu-admin
        ├─ WEB_IMAGE=hohu-admin-web
        └─ IMAGE_TAG=<tag>
```

On first run, the `.hohu/deploy/` directory is automatically initialized (configuration files, `.env`, keys), so there is no need to run `hohu deploy init` manually.

After the build completes, the image configuration in `.env` is automatically updated to use local image names (without `/`), and `hohu deploy` will recognize them and skip remote pulling.

## Switch Back to Official Images

```bash
hohu build --reset
```

Clears `API_IMAGE` and `WEB_IMAGE` from `.env` and resets `IMAGE_TAG` to `latest`. The next `hohu deploy` will pull the official GHCR images.

## Common Scenarios

### Daily Development Iteration

```bash
# Rebuild after source code changes
hohu build --only=backend    # Only backend changed
hohu deploy                  # Redeploy

# Full rebuild
hohu build --no-cache
hohu deploy
```

### Version Release

```bash
hohu build --tag=v1.2.0
hohu deploy
```

### Switch from Official Images to Local Development

```bash
hohu build          # Build + auto-initialize
hohu deploy         # Deploy local images
```

### Switch from Local Development Back to Official Images

```bash
hohu build --reset  # Reset configuration
hohu deploy down
hohu deploy         # Pull and deploy official images
```
