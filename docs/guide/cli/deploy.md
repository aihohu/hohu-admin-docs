---
title: hohu deploy
description: Deploy the full-stack service to a Linux server using Docker Compose via hohu deploy, including environment initialization and service orchestration
---

# hohu deploy

Deploy the full-stack service to a Linux server via Docker Compose.

## hohu deploy

One-click deployment that automatically completes the full workflow: pull images -> start database -> wait for ready -> migrate -> start all services.

```bash
hohu deploy
```

### Parameters

| Parameter      | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| `--init`       | Run initialization script after migration (creates admin user and menus) |
| `--no-migrate` | Skip database migration                                                  |

```bash
hohu deploy --init          # Deploy and initialize data
hohu deploy --no-migrate    # Deploy but skip migration
```

### Deployment Flow

```
hohu deploy
    │
    ├─ 1. Check Docker environment
    ├─ 2. Sync deployment templates
    ├─ 3. Generate .env configuration (first run)
    ├─ 4. Pull images (only infrastructure images when building locally)
    ├─ 5. Start PostgreSQL + Redis (if enabled)
    ├─ 6. Wait for database to be ready
    ├─ 7. Run database migrations
    └─ 8. Start application services
```

## hohu deploy init

Initialize the deployment configuration by creating the `.hohu/deploy/` directory and generating `.env`.

```bash
hohu deploy init
```

The auto-generated `.env` includes randomly generated `SECRET_KEY`, `POSTGRES_PASSWORD`, and `REDIS_PASSWORD`.

::: tip
When using `hohu build`, initialization is performed automatically. You do not need to run this command separately.
:::

## hohu deploy pull

Pull the latest images and restart services.

```bash
hohu deploy pull
```

Use this when official images have been updated and you want to pull the new version.

## hohu deploy ps

View the running status of all services.

```bash
hohu deploy ps
```

## hohu deploy logs

View service logs.

```bash
hohu deploy logs                    # All logs
hohu deploy logs -f                 # Live tail
hohu deploy logs hohu-admin-api     # Backend only
hohu deploy logs -f postgres        # Tail database logs
```

| Parameter         | Description                      |
| ----------------- | -------------------------------- |
| `-f` / `--follow` | Follow log output in real time   |
| `SERVICE...`      | Specify service names (optional) |

## hohu deploy restart

Restart services.

```bash
hohu deploy restart                 # Restart all
hohu deploy restart hohu-admin-api  # Restart backend only
```

## hohu deploy down

Stop all services and remove containers.

```bash
hohu deploy down
```

Data volumes are preserved and database data is not deleted. To remove all data:

```bash
cd .hohu/deploy
docker compose down -v
```

## hohu migrate

Run database migrations independently.

```bash
hohu migrate           # Migrate only
hohu migrate --init    # Migrate + initialize (create admin user and menus)
```

| Parameter | Description                               |
| --------- | ----------------------------------------- |
| `--init`  | Run initialization script after migration |

::: tip
`hohu deploy` automatically runs migrations by default, so you typically do not need this command separately. Use it only when you need manual control over migrations.
:::

## Environment Variable Reference

Deployment configuration is managed through `.hohu/deploy/.env`. Key configuration items:

| Variable          | Description                                                                        |
| ----------------- | ---------------------------------------------------------------------------------- |
| `IMAGE_TAG`       | Image tag (`latest` or `source`)                                                   |
| `API_IMAGE`       | Backend image address (automatically set to local name when building from source)  |
| `WEB_IMAGE`       | Frontend image address (automatically set to local name when building from source) |
| `ENABLE_POSTGRES` | Whether to use the built-in PostgreSQL (`true` / `false`)                          |
| `DATABASE_URL`    | External PostgreSQL connection string                                              |
| `ENABLE_REDIS`    | Whether to use the built-in Redis (`true` / `false`)                               |
| `REDIS_HOST`      | External Redis address                                                             |
| `SECRET_KEY`      | JWT signing secret key                                                             |
| `ENABLE_NGINX`    | Whether to enable the built-in Nginx                                               |
| `WEB_PORT`        | Frontend port exposure (e.g., `0.0.0.0:9527`)                                      |
| `API_PORT`        | Backend port exposure                                                              |

For the complete configuration reference, see [Deployment Guide ->](/guide/deploy)
