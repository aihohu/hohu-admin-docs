---
title: hohu build — Build Docker images
description: Build Docker images from Backend and Web source, select components and tags, inspect deployment configuration changes, and switch back to official images.
---

# hohu build

Build Docker images from local Backend/Web source and point deployment configuration at successfully built local images. It does not build App or desktop installers.

## Prerequisites

Install and start Docker. Ensure selected components have source directories and Dockerfiles. Run from the root containing `.hohu/project.json`, or a subdirectory. Without a component filter, both Backend and Web source directories are required.

## Usage and options

```bash
hohu build [OPTIONS]
```

| Option       | Description                                                                   | Default       |
| ------------ | ----------------------------------------------------------------------------- | ------------- |
| `--only`     | Build `backend` or `frontend` only; not repeatable, and `web` is not accepted | Backend + Web |
| `--tag`      | Shared Docker tag for both images                                             | `source`      |
| `--no-cache` | Disable Docker build cache                                                    | Off           |
| `--reset`    | Skip building, clear local image settings and restore official sources        | Off           |

## Examples

```bash
# Build Backend + Web
hohu build

# Rebuild Backend only
hohu build --only backend

# Use one tag for both components
hohu build --tag v1.2.0

# Rebuild without cache
hohu build --no-cache
```

Building one component still updates the shared `IMAGE_TAG`. If you also change the tag, the other deployment image must provide that tag. Build both components for a complete release.

## Results

1. Build `hohu-admin:<tag>` and/or `hohu-admin-web:<tag>`.
2. After building images, prepare `.hohu/deploy/`, configuration and initial secrets if the deployment directory is missing.
3. Write `API_IMAGE=hohu-admin` and/or `WEB_IMAGE=hohu-admin-web` for successful components to `.hohu/deploy/.env`, and update `IMAGE_TAG`.

An ordinary build does not regenerate all existing deployment configuration. Check the summary and `.env`, including site, storage and credentials, then run [`hohu deploy`](./deploy#deploy). Local images are checked for availability rather than pulled remotely.

## Switch to official images

```bash
hohu build --reset
```

This requires an existing deployment `.env`. It removes `API_IMAGE` and `WEB_IMAGE` and sets `IMAGE_TAG=latest`. It does not delete local images or business data, or restart services immediately.

Before deploying, set `IMAGE_TAG` to an available, matching release and follow [deployment and maintenance](./deploy). Read [upgrade and recovery](../operations/upgrade) before production changes.

## Troubleshooting

| Symptom                              | Action                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| Docker unavailable                   | Check installation, daemon status and user access                                           |
| Project or source not found          | Check the marker and component directories; use `--only` for a single-component project     |
| Dockerfile missing                   | Check source completeness and build scope; confirm the summary includes expected components |
| Deployment cannot find a local image | Check that it exists in the same Docker environment with the configured name and shared tag |
| Reset fails                          | Ensure `.hohu/deploy/.env` exists                                                           |

The CLI does not push images to a registry. If build and deployment run on different machines, transfer the images or use an accessible registry yourself.
