---
title: hohu deploy — Deployment and maintenance
description: Find HoHu deployment commands, options and examples to initialize configuration, deploy applications, inspect logs, update images and upgrade from source.
---

# hohu deploy

Manage HoHu deployments with Docker Compose. See the [deployment guide](../deploy) for first-time server setup and the [upgrade guide](../operations/upgrade) for backups and recovery.

## Prerequisites

Install and start Docker and verify `docker compose version`. Run `hohu deploy init` in the intended deployment directory, then run other commands there or below it. Check connections, credentials, versions, networking and persistence in `.hohu/deploy/.env`.

## Initialize configuration {#init}

```bash
hohu deploy init
```

Generate `.hohu/deploy/`, templates, storage directories and initial secrets under the **current directory**. This does not clone source or start the application. Official image deployments do not require `.hohu/project.json`.

| Option    | Description                                             | Default |
| --------- | ------------------------------------------------------- | ------- |
| `--force` | Overwrite outdated templates; save custom changes first | Off     |

Repeated initialization fills missing templates. Template version changes prompt for confirmation before overwriting outdated files; `--force` skips that prompt. Existing valid credentials are preserved. This does not reset the database or administrator password.

## Deploy the application {#deploy}

```bash
hohu deploy
hohu deploy -s acr
```

| Option            | Description                                                                   | Default                                          |
| ----------------- | ----------------------------------------------------------------------------- | ------------------------------------------------ |
| `--source` / `-s` | Image source: `auto`, `official`, `acr`                                       | Resolved by source precedence, ultimately `auto` |
| `--no-migrate`    | Skip migrations and their seed synchronization; only when no update is needed | Off                                              |

Order: prepare images → start enabled infrastructure → migrate and synchronize seeds → start application services and enabled Nginx. Image, migration or seed failures block subsequent normal startup.

CLI does not stop old application writers before this migration, validate a product manifest, or pause scheduled jobs for acceptance. The [fixed artifact and recovery workflow](../operations/upgrade#fixed-artifacts) documents those operator prerequisites for CLI 0.1.16. Use `hohu deploy`; there is no `hohu admin deploy` command group in that release.

Deployment includes built-in data synchronization; do not use `hohu deploy --init`. Repeated synchronization preserves existing passwords, customizations and permissions. Check `hohu deploy ps`, read logs and sign in afterwards; completion does not constitute business acceptance.

## Status and logs {#ps}

```bash
hohu deploy ps
```

Show deployment service status. No additional options.

### Read logs {#logs}

```bash
hohu deploy logs
hohu deploy logs -f hohu-admin-api
```

| Argument or option | Description                         | Default      |
| ------------------ | ----------------------------------- | ------------ |
| `SERVICES...`      | One or more Compose service names   | All services |
| `--follow` / `-f`  | Follow output; press Ctrl+C to exit | Off          |

Use service names from the current Compose configuration. Exiting log streaming does not stop services.

## Restart and stop {#restart}

```bash
hohu deploy restart
hohu deploy restart hohu-admin-api
```

Supply one or more services, or omit them to restart all. Restart does not update images or run migrations. Redeploy to recreate containers with changed configuration.

### Stop deployment {#down}

```bash
hohu deploy down
```

Stop and remove Compose containers and associated networks without a volume removal option. This is not a business data reset. Persistence still depends on actual storage mounts. The command does not accept service filters.

## Update images {#pull}

```bash
hohu deploy pull
hohu deploy pull -s acr
```

Accepts `--source` / `-s` with the same resolution as `hohu deploy`. It prepares images, starts infrastructure, migrates and synchronizes seeds, then starts or updates application containers. It is not download-only and does not accept `--no-migrate`.

To change versions, first set deployment `IMAGE_TAG` to an available, matching release. `pull` does not rebuild local source images.

## Upgrade from source {#upgrade}

```bash
hohu deploy upgrade
hohu deploy upgrade --no-cache
```

| Option            | Description                                       | Default           |
| ----------------- | ------------------------------------------------- | ----------------- |
| `--no-cache`      | Disable source image build cache                  | Off               |
| `--no-migrate`    | Skip migrations and their seed synchronization    | Off               |
| `--source` / `-s` | Deployment image source, resolved as for `deploy` | Ultimately `auto` |

Requires a project marker, Backend/Web source, deployment configuration and **a pullable Git repository at the project root**. It runs one `git pull` at that root and does not update independent component repositories separately. `hohu create` does not create a root repository. For its generated layout, update component source yourself, then use `hohu build` and `hohu deploy`.

Order: root `git pull` → build both `source` images → update deployment image configuration → prepare images → stop old services → start infrastructure, migrate and start applications. There is downtime. The command does not back up or roll back automatically.

See [`hohu migrate`](./migrate) for standalone migrations and their limitations.

## Image sources

`deploy`, `deploy pull` and `deploy upgrade` accept `--source` / `-s`; `--image-source` remains a compatibility alias. The `HOHU_IMAGE_SOURCE` environment and deployment `.env` setting is unchanged. This option does not select Git repositories or Python/frontend package sources.

| Source     | Behavior                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `auto`     | Try original references, then matching ACR mirrors on timeouts, connection failures, rate limits or transient service errors |
| `official` | Use only configured original references                                                                                      |
| `acr`      | Use ACR directly for supported official images; retain other references                                                      |

Authentication failures, missing images or platforms, certificate errors and local Docker failures fail directly. Precedence: command option → process `HOHU_IMAGE_SOURCE` → deployment `.env` value → `auto`.

| Official repository                              | ACR repository                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| `ghcr.io/aihohu/hohu-admin`                      | `registry.cn-beijing.aliyuncs.com/hohu/hohu-admin`                   |
| `ghcr.io/aihohu/hohu-admin-web`                  | `registry.cn-beijing.aliyuncs.com/hohu/hohu-admin-web`               |
| Official Docker Hub `postgres`, `redis`, `nginx` | Matching repositories under `registry.cn-beijing.aliyuncs.com/hohu/` |

Mapping preserves tags without falling back to `latest`. The target tag must be synchronized and pullable; floating tags represent the latest synchronized snapshot. Fixed `@sha256:...` digests and custom repositories are not mapped. CLI-built local images and custom images with explicit `pull_policy: never` are only checked locally.

Each pull waits at most 300 seconds. Failure on both sources stops deployment rather than treating an old local image as a successful pull. This excludes Certbot, monitoring images and Dockerfile build stages and does not change global Docker configuration. Successful ACR pulls receive the original local reference; migrations and startup use `--pull never`. Direct Compose commands do not include CLI source fallback.

## Configuration and troubleshooting

CLI infrastructure overrides use `docker-compose.infra.yml`; user `docker-compose.override.yml` loads last. Overrides generated by older versions are preserved. Check that old ports or external service settings do not override new configuration when upgrading.

| Symptom                                 | Action                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Deployment not initialized              | Run `hohu deploy init` in the intended directory and review configuration                        |
| Image preparation fails                 | Check references, tags, network and access; do not skip missing images                           |
| Migration fails                         | Preserve the error, check database and target version, recover using the upgrade guide and retry |
| `.env` changes are absent after restart | Redeploy to update container configuration; `restart` does not recreate containers               |
| `upgrade` reports a Git error           | Check the root repository is pullable; maintain independent component sources separately         |

For external PostgreSQL/Redis, `deploy`, `pull` and `upgrade` respect enable flags. Standalone `migrate` behaves differently; see [migration limitations](./migrate#limitations). See [configuration and troubleshooting](./configuration) for other locations and issues.

Generated external-service overrides currently omit scheduler connections and API Redis port / database values. Add these entries to the user override when using external services; see [external-service deployment](../deploy#external-services).
