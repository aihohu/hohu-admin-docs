---
title: hohu migrate — Deployment database migrations
description: Run database migrations and built-in data synchronization in a HoHu Docker deployment, including prerequisites, external database limitations and failure recovery.
---

# hohu migrate

Run database migrations and built-in data synchronization separately in Docker deployments. Use [`hohu init`](./init) for development initialization. Normal deployments and image updates already migrate data, so this command is usually unnecessary separately.

## Prerequisites

- Docker and Docker Compose are available, with initialized `.hohu/deploy/` configuration.
- Deployment `.env` targets the correct database and matching application images; the migrator image exists or can be pulled.
- Complete required backups using [upgrade and recovery](../operations/upgrade), and confirm migration starting state and maintenance timing.

Run from the deployment configuration's parent directory or a subdirectory.

## Usage

```bash
hohu migrate
```

There are no additional business options. `--init`, `--no-migrate` and `--image-source` are not accepted.

## Process and results

1. Load deployment configuration and explicitly start Compose `postgres` and `redis` services.
2. Run migrations and seed synchronization in a temporary `db-migrator` container, removing it afterwards.
3. Report completion. This command does not update source, rebuild application images or restart API/Web.

Seed synchronization preserves existing passwords, customizations and permissions. Check logs and database revision, start or update applications according to your deployment plan, and verify sign-in and affected features.

## Current limitations {#limitations}

Standalone `migrate` explicitly starts built-in PostgreSQL/Redis without checking `ENABLE_POSTGRES` or `ENABLE_REDIS`. It also does not invoke deployment image source fallback.

For external databases/Redis or `--image-source` requirements, prefer integrated migrations in [`hohu deploy`](./deploy#deploy) or [`hohu deploy pull`](./deploy#pull). Check target images and configuration first: these commands also start or update applications.

## Troubleshooting

| Symptom                       | Action                                                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Deployment not initialized    | Check working directory and `.hohu/deploy/`                                                                |
| Infrastructure fails to start | Check built-in service ports, storage and external service limitations                                     |
| Migrator image unavailable    | Check image reference and tag; use integrated deployment for source fallback                               |
| Connection or migration fails | Preserve errors and logs, check database, permissions and revisions, then confirm recovery before retrying |

After a migration failure, do not start applications requiring the new schema, delete the database or alter migration records to bypass the error.
