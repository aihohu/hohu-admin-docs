---
title: Deploy with CLI
description: Deploy a HoHu application with CLI and Docker Compose, configuring images, ports, persistent files, and external services before verification.
---

# Deploy with CLI

This page covers a first installation. See [CLI deployment reference](./cli/deploy) for options and [upgrade, backup, and recovery](./operations/upgrade) for existing instances.

For a reproducible product combination, use the [fixed artifact workflow](./operations/upgrade#fixed-artifacts): verify the product manifest, pin all four application services by digest, preflight the final configuration, and keep scheduling paused through acceptance. Tag-based defaults below do not establish that qualification.

## 1. Prepare the server

Install Git, uv, HoHu CLI, Docker, and Docker Compose. Start Docker and verify access to the selected image registry. Image deployment does not require application source dependencies.

```bash
uv tool install hohu
hohu --version
docker version
docker compose version
```

Prepare a dedicated directory, persistent storage, domain, and backup destination. The default template fixes some container, network, and volume names. Multiple instances on one Docker host need customized names; changing only directories or ports does not isolate them.

## 2. Initialize deployment configuration

For published images, initialize an empty directory without `hohu create`:

```bash
mkdir my-hohu
cd my-hohu
hohu deploy init
```

Configuration lives in `.hohu/deploy/`. The command creates templates, uploads / private_uploads directories, application secrets, and initial passwords without starting the application. Preserve generated credentials rather than replacing them with documentation placeholders.

## 3. Select images and access

Edit `.hohu/deploy/.env`:

| Setting                         | Verify                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------- |
| API_IMAGE, WEB_IMAGE            | Official or privately maintained image repositories                           |
| IMAGE_TAG                       | An existing, compatible tag; record exact versions                            |
| ENABLE_POSTGRES, ENABLE_REDIS   | Default true uses bundled services                                            |
| SECRET_KEY, HOHU_ADMIN_PASSWORD | Preserve generated values and restrict access                                 |
| WEB_PORT, API_PORT              | Ports are unpublished by default; configure the access topology               |
| ENABLE_NGINX                    | Default false; enable for the bundled proxy                                   |
| SERVER_URL                      | May remain empty for same-origin use; production values must be HTTPS origins |

With Nginx already on the same host, bind application ports to loopback:

```dotenv
ENABLE_NGINX=false
WEB_PORT=127.0.0.1:8080
API_PORT=127.0.0.1:8000
```

Remote browsers cannot access the server's loopback ports directly. Use the host proxy in [domains and HTTPS](./operations/network). Do not expose databases, Redis, and every application port to troubleshoot an unreachable page.

For bundled Nginx, set `ENABLE_NGINX=true`, check HTTP_PORT / HTTPS_PORT for conflicts, and prepare certificates as described on the HTTPS page.

## 4. Deploy and verify

```bash
hohu deploy
hohu deploy ps
hohu deploy logs -f hohu-admin-api
```

CLI prepares images, starts enabled dependencies, migrates and seeds the database, then starts the application. Failures block subsequent steps. Initialization is included; do not add `--init`.

For first sign-in, use admin and HOHU_ADMIN_PASSWORD from the deployment `.env`, then change the password. Upgrades and redeployments preserve existing account passwords.

Check Web, API, and scheduler state, then verify ordinary-user permissions, image uploads, private files, jobs, and enabled AI features. A health response or successful CLI message does not replace [operational validation](./operations/monitoring).

## Deploy customized source

Use `hohu create my-project` with Backend / Frontend to customize an application. Follow the developer guide and validate changes. Run `hohu deploy init` at the project root, review configuration, then:

```bash
hohu build
hohu deploy
```

See [`hohu build`](./cli/build) for image selection and source tags. Published-image deployments do not require a build. See [CLI reference](./cli/deploy#upgrade) for the root Git repository requirement of deploy upgrade.

## External PostgreSQL / Redis {#external-services}

Set the corresponding ENABLE switch to false and supply DATABASE_URL or REDIS_HOST / PORT / PASSWORD / DB. Inside a container, 127.0.0.1 refers to that container; use reachable service addresses.

::: warning Current external-service configuration limitations
CLI-generated `docker-compose.infra.yml` overrides the API database connection, Redis host and password, and migrator database connection. It currently omits API Redis port / database values and all scheduler connections. Configure it explicitly in `.hohu/deploy/docker-compose.override.yml`, or it will retain the template's postgres / redis addresses.
:::

The following applies when **both services are external**. Keep only the relevant entries when externalizing one service. Values come from `.env`:

```yaml
services:
  hohu-admin-api:
    environment:
      REDIS_PORT: ${REDIS_PORT:-6379}
      REDIS_DB: ${REDIS_DB:-0}
  hohu-admin-scheduler:
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_HOST: ${REDIS_HOST}
      REDIS_PORT: ${REDIS_PORT:-6379}
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      REDIS_DB: ${REDIS_DB:-0}
```

Here REDIS_PORT is the external Redis service port. With bundled Redis enabled, the CLI uses the same variable for host port publication; do not mix these meanings.

User overrides load last; do not manually maintain generated infra files. Redeploy and check API, scheduler, and migration results separately. Standalone `hohu migrate` still has bundled-dependency limitations; see [migration reference](./cli/migrate#limitations).

## Storage and configuration changes

Default PostgreSQL / Redis use named volumes. Public images and private business files mount uploads / private_uploads under the deployment directory. API and scheduler must share the same files. Adjust mounts when changing container storage paths.

Redeploy after editing `.env` to recreate containers; restart does not reload container environment variables. See [configuration ownership](./reference/configuration).
