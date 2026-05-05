---
title: Deployment Guide
description: Deploy the full-stack application to a Linux server using hohu build and hohu deploy, with Docker Compose orchestrating all services
---

# Deployment Guide

Deploy the full-stack application to a Linux server using `hohu build` and `hohu deploy`, with Docker Compose orchestrating all services.

## Architecture

```
Internet (:80/:443)
       │
       ▼
┌─────────────────┐
│  Nginx (SSL)    │  SSL termination, HTTP→HTTPS redirect
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  hohu-admin-web │  Static file hosting + /api/ reverse proxy
│  (nginx)        │
└────────┬────────┘
         │ /api/
         ▼
┌─────────────────┐
│  hohu-admin-api │  FastAPI + uvicorn
└───┬─────────┬───┘
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│  PG   │ │ Redis │
└───────┘ └───────┘
```

**Included services:**

| Service        | Image                | Description                                                  |
| -------------- | -------------------- | ------------------------------------------------------------ |
| postgres       | `postgres:16-alpine` | PostgreSQL database (can be replaced with external instance) |
| redis          | `redis:7-alpine`     | Redis cache (can be replaced with external instance)         |
| hohu-admin-api | Backend image        | FastAPI application                                          |
| hohu-admin-web | Frontend image       | Vue 3 static files + API reverse proxy                       |
| nginx          | `nginx:alpine`       | SSL reverse proxy (optional)                                 |
| certbot        | `certbot/certbot`    | Let's Encrypt auto-certificates (optional)                   |

## Prerequisites

- Linux server (Ubuntu 22.04+ recommended)
- Docker 20.10+ and Docker Compose V2
- Domain name (if HTTPS is needed)
- hohu-cli installed: `uv tool install hohu` or `pip install hohu`

## Two Deployment Methods

### Method 1: Build from Source (for Custom Development)

Build Docker images from your locally modified source code, then deploy.

```bash
# 1. Create and initialize the project
hohu create my-project
cd my-project
hohu init

# 2. Build images after modifying source code (auto-initializes deployment config)
hohu build

# 3. Edit configuration as needed
nano .hohu/deploy/.env

# 4. Deploy
hohu deploy
```

### Method 2: Official Image Deployment (for Direct Use)

Pull the official pre-built images for deployment — no local source code needed.

```bash
# 1. Create the project
hohu create my-project
cd my-project

# 2. Initialize deployment config
hohu deploy init

# 3. Edit configuration
nano .hohu/deploy/.env

# 4. Deploy
hohu deploy
```

## Building Images

`hohu build` builds Docker images from local source code. On first run, it automatically initializes `.hohu/deploy/` (config files, `.env`, secrets) — no need to run `hohu deploy init` manually.

```bash
hohu build                  # Build all components
hohu build --only=backend   # Build backend only
hohu build --only=frontend  # Build frontend only
hohu build --no-cache       # Build without cache
hohu build --tag=v1.0.0     # Custom image tag
hohu build --reset          # Reset to official images
```

| Parameter    | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| `--only`     | Build only the specified component (`backend` / `frontend`)      |
| `--tag`      | Image tag, defaults to `source`                                  |
| `--no-cache` | Disable Docker build cache                                       |
| `--reset`    | Clear local image config and switch back to official GHCR images |

## Deployment Commands

```bash
hohu deploy          # One-click deploy (pull → migrate → start)
hohu deploy init     # Initialize deployment directory and .env
hohu deploy pull     # Pull latest images and restart
hohu deploy ps       # View service status
hohu deploy logs     # View logs
hohu deploy logs -f  # Follow logs in real time
hohu deploy restart  # Restart services
hohu deploy down     # Stop all services
hohu migrate         # Run database migrations only
hohu migrate --init  # Migrate + initialize data (create admin user and menus)
```

Deployment flags:

```bash
hohu deploy --init          # Also initialize the database (create admin user and menus)
hohu deploy --no-migrate    # Skip database migrations
```

## Configuration Reference

All configuration is managed through `.hohu/deploy/.env`. It is auto-generated on first deployment, with passwords and secrets pre-filled.

### External PostgreSQL / Redis

By default, PostgreSQL and Redis run in Docker containers. To use existing external instances, edit `.env`:

```dotenv
# Disable built-in PostgreSQL
ENABLE_POSTGRES=false
DATABASE_URL=postgresql+asyncpg://user:password@your-pg-host:5432/dbname

# Disable built-in Redis
ENABLE_REDIS=false
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
```

When disabled, the corresponding container will not start, and the application will connect to the external instance.

### Port Exposure

By default, no ports are exposed. Configure as needed in `.env`:

```dotenv
WEB_PORT=0.0.0.0:9527     # Frontend (bind to all interfaces)
API_PORT=127.0.0.1:8000   # Backend (local access only)
PG_PORT=0.0.0.0:5433      # PostgreSQL
REDIS_PORT=0.0.0.0:6379   # Redis
```

Leave empty or comment out to not expose. Supports both `port` and `IP:port` formats.

### Nginx and SSL

By default `ENABLE_NGINX=false`, and the frontend is accessed directly via `WEB_PORT`. Enabling Nginx provides SSL termination, domain binding, and more.

Edit `.env`:

```dotenv
ENABLE_NGINX=true
DOMAIN=example.com
ENABLE_SSL=true
```

#### Option 1: Cloudflare Origin Certificate (Recommended)

Suitable when your domain is proxied through Cloudflare. Certificates are valid for up to 15 years with no renewal needed.

1. Cloudflare Dashboard > **SSL/TLS** > **Origin Server** > **Create Certificate**
2. Download the certificate files:
   - **Origin Certificate** > save as `.hohu/deploy/ssl/fullchain.pem`
   - **Private Key** > save as `.hohu/deploy/ssl/privkey.pem`
3. Cloudflare Dashboard > **SSL/TLS** > **Overview** > set encryption mode to **Full (Strict)**

#### Option 2: Let's Encrypt (Certbot Auto-Certificate)

Suitable for servers with a public IP directly exposed. Certificates are automatically requested and renewed.

1. Set the domain in `.env`:

   ```dotenv
   DOMAIN=example.com
   ```

2. Request the certificate for the first time (ensure the domain resolves to the server IP):

   ```bash
   cd .hohu/deploy
   docker compose run --rm certbot certonly \
     --webroot -w /var/www/certbot \
     -d example.com \
     --email admin@example.com \
     --agree-tos --no-eff-email
   ```

3. Update `.env` to point to the certbot certificate:

   ```dotenv
   SSL_CERT_PATH=./certbot/live/example.com
   ```

4. Start the deployment + enable auto-renewal:
   ```bash
   hohu deploy
   cd .hohu/deploy && docker compose --profile certbot up -d certbot
   ```

> The Certbot container checks for renewal every 12 hours. Let's Encrypt certificates are valid for 90 days and auto-renew 30 days before expiry.

#### Option 3: Manual Certificate

Suitable when you already have certificate files. Place them in `.hohu/deploy/ssl/`:

```
ssl/
├── fullchain.pem   # Full certificate chain
└── privkey.pem     # Private key
```

Keep `.env` at the default: `SSL_CERT_PATH=./ssl`

### Using a Custom Registry

If you are building on hohu-admin and pushing to your own registry, edit `.env`:

```dotenv
# Using GHCR
API_IMAGE=ghcr.io/your-org/hohu-admin
WEB_IMAGE=ghcr.io/your-org/hohu-admin-web

# Or using Docker Hub
API_IMAGE=your-user/hohu-admin
WEB_IMAGE=your-user/hohu-admin-web

IMAGE_TAG=v1.0.0
```

Then run `hohu deploy pull` to pull and restart.

## Complete Environment Variable Reference

| Variable                      | Default                         | Description                                                                   |
| ----------------------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| `IMAGE_TAG`                   | `latest`                        | Image tag                                                                     |
| `API_IMAGE`                   | `ghcr.io/aihohu/hohu-admin`     | Backend image address (auto-set to local name when building from source)      |
| `WEB_IMAGE`                   | `ghcr.io/aihohu/hohu-admin-web` | Frontend image address (auto-set to local name when building from source)     |
| `ENABLE_POSTGRES`             | `true`                          | Whether to use the built-in PostgreSQL                                        |
| `POSTGRES_USER`               | `hohu`                          | PostgreSQL username                                                           |
| `POSTGRES_PASSWORD`           | Auto-generated                  | PostgreSQL password                                                           |
| `POSTGRES_DB`                 | `hohu_admin`                    | Database name                                                                 |
| `DATABASE_URL`                | -                               | External PostgreSQL connection string (required when `ENABLE_POSTGRES=false`) |
| `ENABLE_REDIS`                | `true`                          | Whether to use the built-in Redis                                             |
| `REDIS_PASSWORD`              | Auto-generated                  | Redis password                                                                |
| `REDIS_HOST`                  | `127.0.0.1`                     | Redis address (required when `ENABLE_REDIS=false`)                            |
| `SECRET_KEY`                  | Auto-generated                  | JWT signing secret                                                            |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080`                         | Token validity period (minutes)                                               |
| `WORKER_ID`                   | `1`                             | Snowflake Worker ID (must be unique across instances)                         |
| `UVICORN_WORKERS`             | `4`                             | Number of Uvicorn processes                                                   |
| `ENABLE_NGINX`                | `false`                         | Whether to enable the built-in Nginx                                          |
| `DOMAIN`                      | `localhost`                     | Domain name                                                                   |
| `HTTP_PORT`                   | `80`                            | HTTP port (effective when Nginx is enabled)                                   |
| `HTTPS_PORT`                  | `443`                           | HTTPS port (effective when Nginx is enabled)                                  |
| `WEB_PORT`                    | -                               | Frontend port exposure                                                        |
| `API_PORT`                    | -                               | Backend port exposure                                                         |
| `PG_PORT`                     | -                               | PostgreSQL port exposure                                                      |
| `REDIS_PORT`                  | -                               | Redis port exposure                                                           |
| `SSL_CERT_PATH`               | `./ssl`                         | SSL certificate directory                                                     |
| `ENABLE_SSL`                  | `false`                         | Whether to enable HTTPS                                                       |

## Data Persistence

Docker volumes persist the following data — it will not be lost even if containers are removed:

| Volume              | Description                      |
| ------------------- | -------------------------------- |
| `hohu-pgdata`       | PostgreSQL data                  |
| `hohu-redisdata`    | Redis data                       |
| `hohu-certbot-www`  | Let's Encrypt verification files |
| `hohu-certbot-conf` | Let's Encrypt certificates       |

**Clear all data (dangerous operation):**

```bash
cd .hohu/deploy
docker compose down -v
```

## Troubleshooting

### Nginx fails to start

Check that the certificate files exist and the paths are correct:

```bash
ls .hohu/deploy/ssl/fullchain.pem
ls .hohu/deploy/ssl/privkey.pem
```

If you don't need SSL, keep `ENABLE_NGINX=false` and access the frontend directly via `WEB_PORT`.

### Database connection failure

Confirm PostgreSQL is ready:

```bash
hohu deploy logs postgres
```

When using an external PostgreSQL, confirm that `ENABLE_POSTGRES=false` and `DATABASE_URL` is configured correctly.

### Port already in use

Change the corresponding port configuration in `.env`.

### View full logs

```bash
hohu deploy logs -f                # All services
hohu deploy logs -f hohu-admin-api # Backend only
```
