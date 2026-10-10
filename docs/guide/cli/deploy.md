---
title: hohu deploy and migrations
description: 'HoHu hohu deploy and migrations: steps, scope and limitations'
---

# hohu deploy and migrations

Install a CLI release compatible with your application. Run `hohu deploy --help` for available options and see [release notes](../reference/versions) for component releases.

| Command                             | Behavior                                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `hohu deploy init`                  | Generate/complete `.hohu/deploy`; --force replaces outdated templates, so preserve custom content first |
| `hohu deploy`                       | Pull applicable images, prepare infrastructure, migrate, synchronize seeds and start                    |
| `hohu deploy --no-migrate`          | Skip migrations and seed synchronization in that stage; only for controlled cases that need no update   |
| `hohu migrate`                      | Run deployment migration and seeds separately, without an additional initialization switch              |
| `hohu deploy pull`                  | Update images, migrate, synchronize and start; not download-only                                        |
| `hohu deploy upgrade`               | Pull source, build, stop and redeploy; accepts --no-cache and involves downtime                         |
| `hohu deploy restart [SERVICES...]` | Restart services; does not replace migration                                                            |
| `hohu deploy down`                  | Stop Compose services; not a business-data reset command                                                |

```bash
hohu deploy ps
hohu deploy logs -f hohu-admin-api
hohu deploy restart hohu-admin-api
```

Normal deployment synchronizes seed data automatically. **Do not use `hohu deploy --init` or `hohu migrate --init`.** Repeated runs preserve passwords, custom content and existing grants. Migration/seed failure prevents normal startup.

## Image sources

`hohu deploy`, `hohu deploy pull`, and `hohu deploy upgrade` default to `auto`: pull from the official registry first, then try the same tag on ACR after network timeouts, connection failures, rate limits or temporary server errors. Authentication failures, missing images or platforms, certificate validation failures and local Docker errors stop deployment.

```bash
# Automatic fallback (default)
hohu deploy
# Use the public ACR mirrors directly
hohu deploy --image-source acr
hohu deploy pull --image-source acr
hohu deploy upgrade --image-source acr
# Use only the configured original references
hohu deploy --image-source official
```

Set `HOHU_IMAGE_SOURCE=acr` in `.hohu/deploy/.env` for a project default. Precedence is the command option, process environment variable `HOHU_IMAGE_SOURCE`, project `.env`, then `auto`.

Supported mappings:

| Official repository                              | ACR repository                                                |
| ------------------------------------------------ | ------------------------------------------------------------- |
| `ghcr.io/aihohu/hohu-admin`                      | `registry.cn-beijing.aliyuncs.com/hohu/hohu-admin`            |
| `ghcr.io/aihohu/hohu-admin-web`                  | `registry.cn-beijing.aliyuncs.com/hohu/hohu-admin-web`        |
| Docker Hub official `postgres`, `redis`, `nginx` | The same names under `registry.cn-beijing.aliyuncs.com/hohu/` |

Switching preserves the requested tag and never substitutes `latest`. That tag must already be synchronized to public ACR; deployment requires no ACR login. Floating tags represent the latest mirror snapshot, which may lag upstream. References pinned with `@sha256:...` always retain their original registry because multi-platform index digests can differ between registries.

The CLI resolves Compose configuration before pulling images for enabled deployment services. Custom repositories are not remapped. Local `hohu-admin` and `hohu-admin-web` images produced by `hohu build` are checked for existence without a registry pull. Custom images with explicit `pull_policy: never` are also checked locally. Certbot, monitoring services and base images pulled during Dockerfile builds are outside this feature's scope.

Each pull has a 300-second timeout. If both sources fail, deployment stops without treating a cached image as a successful update. Image preparation precedes migration and startup; `upgrade` also prepares images before stopping services. After an ACR pull, the CLI adds the original reference as a local tag and uses `--pull never` for migration and startup. Global Docker registry mirrors and credentials are unchanged. Direct `docker compose` commands do not include the CLI fallback flow.

Generated infrastructure settings use `docker-compose.infra.yml`. User configuration stays in `docker-compose.override.yml`, loaded last. An override generated by an older CLI is preserved too; review legacy port and external database settings when upgrading, since they can override new infrastructure switches.

For external database/Redis deployments, verify infrastructure orchestration for each command in your revision; do not assume every maintenance subcommand recognizes identical external-service settings.

See [Upgrade guidance](../operations/upgrade) for configuration, backups, maintenance windows and recovery, and [hohu build](./build) for source images.
