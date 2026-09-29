---
title: Deploy with CLI
description: 'HoHu deploy with cli: steps, scope and limitations'
---

# Deploy with CLI

Deploy HoHu on your server with hohu-cli and Docker Compose. Install Docker, Docker Compose and hohu-cli, and verify access to the image registry. For an existing installation, start with the [upgrade guide](./operations/upgrade).

## First deployment

```bash
hohu create my-project
cd my-project
hohu deploy init
```

Review `.hohu/deploy/.env` for database/Redis, image versions, site configuration and secrets. Protect the generated administrator password rather than replacing credentials with example values. Official images must be published, matching versions. Build local development sources first:

```bash
# When using local development sources
hohu build
# Shared deployment entry
hohu deploy
hohu deploy ps
```

Deployment prepares infrastructure, migrates the database, synchronizes seed data and starts the application. Migration or initialization failures stop the process. The normal flow does not need `--init`. Fresh installations and updates share idempotent initialization that preserves existing passwords, custom settings and role grants.

## Verify the running system

Sign in at the configured site address using the initial password from the protected deployment `.env`, then change it. Verify users, menus, uploads, AI if enabled, and rejection of unauthorized accounts. Inspect logs with:

```bash
hohu deploy logs -f hohu-admin-api
```

API and scheduler run separately. Production APIs must not combine `APP_ROLE=all` with multiple workers. AI memory confirmation mode requires one worker; scaling requires coordinated validation of [AI process mode](./operations/ai), not the old assumption of four workers.

The CLI derives proxy request limits from `UPLOAD_HARD_MAX_BYTES`. Adjust ordinary upload preferences through [System settings](./user/settings). External proxies, TLS, backups and persistent private storage still need deployment configuration and verification.

Read [Recovery guidance](./operations/upgrade) before upgrading. See the [CLI reference](./cli/deploy) for command semantics.
