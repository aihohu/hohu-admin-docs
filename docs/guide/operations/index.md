---
title: Deployment and operations
description: Deploy HoHu applications with configuration, HTTPS, launch checks, monitoring, upgrades, backups, and tenant management.
---

# Deployment and operations

This guide is for operators of **HoHu application instances**. The default deployment uses HoHu CLI and Docker Compose for Web, API, a separate scheduler, and optional PostgreSQL, Redis, and Nginx services.

## First launch

1. Confirm [compatible releases](../reference/versions), then [deploy with CLI](../deploy) to initialize configuration, select images, and expose the required ports.
2. Configure [domains, proxying, and HTTPS](./network). Check certificates, uploads, and AI streaming.
3. Verify login, permissions, files, and jobs. Establish logs and monitoring through [health checks and troubleshooting](./monitoring).
4. Record versions and configuration, then rehearse [backup and recovery](./upgrade) before serving production business data.

## Operations reference

| Task                                           | Read                                                                 |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| Install with bundled or external dependencies  | [Deploy with CLI](../deploy)                                         |
| Configure host Nginx, Origin CA, or Certbot    | [Domains, proxying, and HTTPS](./network)                            |
| Inspect state, logs, metrics, and failures     | [Health checks and troubleshooting](./monitoring)                    |
| Update images or source, back up, and recover  | [Upgrade, backup, and recovery](./upgrade)                           |
| Create, initialize, or disable tenants         | [Multi-tenancy](./tenants)                                           |
| Configure models, egress, and AI process modes | [AI configuration and operations](./ai)                              |
| Look up deployment and monitoring options      | [CLI deployment](../cli/deploy), [CLI monitoring](../cli/monitoring) |
| Choose the correct configuration location      | [Configuration ownership](../reference/configuration)                |

## Launch checklist

- Database and file storage persist, and recovery keys are secured.
- Backend and Web versions match, migrations succeed, and ordinary accounts have the intended permissions.
- The domain reaches the intended instance with valid HTTPS; administrative and monitoring ports have appropriate network access.
- API and scheduler roles are separate, and AI worker settings match the process topology.
- Registration and password recovery follow tenant settings, with tested mail delivery; see [system settings](../user/settings).

CLI orchestrates startup and migrations. It does not perform database backups, verify certificate renewal, or validate business behavior. Existing installations should follow upgrade procedures rather than treating initial setup as a reset.
