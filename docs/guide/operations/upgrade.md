---
title: Upgrade, backup and recovery
description: Back up HoHu databases, files and configuration before upgrading, verify migrations and prepare a compatible recovery plan.
---

# Upgrade, backup and recovery

Record backend, Web, CLI, image and database migration versions before upgrading. Review the target release notes; `latest` is not a traceable version record.

## Upgrade order

1. Back up the database, private files and required deployment configuration, and verify recovery. Protect backups like production credentials.
2. Rehearse in isolation, pause production writes and related jobs, and schedule a maintenance window.
3. Use matching CLI, backend and Web revisions. For source builds, run `hohu build` then `hohu deploy`. For official images, `hohu deploy pull` currently migrates and synchronizes seed data before starting services.
4. Check migration exit status and services, then verify sign-in, tenant state, authorization denials, settings, uploads and jobs.
5. Restore traffic after verification and retain the version and validation record.

Standalone `hohu migrate` also runs migration and seed synchronization; it no longer uses `--init`. Do not use `--no-migrate` to skip required schema or data changes.

## Supported database starting points

The current chain supports empty databases and the v0.1.4 release boundary `bf244f9a8b76`. Earlier installations must first follow their older release chain. Development databases that used experimental migrations before compaction are not automatically supported; do not use `stamp head` to disguise an incomplete upgrade.

Use this revision's Alembic output for the exact head. Maintainer constraints are in the backend's `docs/DATABASE-MIGRATIONS.md`; see [Source code](../src).

## Recovery

Reverting code does not restore the database. Destructive downgrades may remove fields or tables and do not replace backup recovery. Keep maintenance mode after failure, restore matching database, persistent files and application versions, then verify before reopening writes.

`hohu deploy upgrade` pulls source, builds, stops and redeploys. It is not a zero-downtime upgrade and does not automatically create backups or resolve local source conflicts.
