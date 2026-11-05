---
title: '0.2 candidate: upgrade and recovery'
description: 'Writer shutdown, backups, migration, explicit activation and authorization continuity for the unreleased 0.2 candidate.'
---

# 0.2 candidate: upgrade and recovery

**Unreleased.** This guide supports candidate evaluation and isolated rehearsals, not a formal upgrade commitment. The [0.2 overview](index.md) identifies source revisions; first read [field policies](field-policies.md).

Candidate validation targets fresh databases and formal 0.1.6. Only the final product manifest can establish supported platforms, image digests, CLI versions, and upgrade sources. A runnable database migration does not establish other direct cross-version upgrade paths.

1. Inventory old confirmations, unknown executions, files, and authorization revocations. Back up the database, uploads, private files, and encryption key.
2. Stop and isolate old API processes, schedulers, AI recovery/expiry tasks within the API, and other writers. Verify that they cannot re-enter and that no database transactions remain in flight. Direct startup and Docker Compose can both use existing maintenance interfaces; Ctrl+C alone is not trusted stop evidence.
3. Pin the same backend artifact for migration, API, and scheduler, together with the matching Web. Migration failure stops initialization; do not `stamp head`. Seed failure leaves maintenance in place until inspection and explicit recovery.
4. Verify history, permissions, and the matching Web in `legacy` / `ready`. Explicitly activate each tenant only after all surface qualification passes.

Even a preactivation backup restore must match the original application, files, and key. After activation, do not reconnect a 0.1.6 backend or restore an old database and expose reads, downloads, or AI. For disaster recovery, isolate entry points first, establish revocation and policy continuity using records independent of the backup, reconcile post-failure side effects, and recover forward using a version that supports field policies. Keep affected surfaces closed when only the database is restored, files are missing, or revocation evidence is incomplete. Increasing the backup's epoch cannot supply that evidence.

See the fixed candidate source’s [database migration manual](https://github.com/aihohu/hohu-admin/blob/20cb459eb71d8b95b114bbb1bdb6c7c41e9558c2/docs/DATABASE-MIGRATIONS.md) for operational commands and migration constraints. Before a formal upgrade, check the [stable release notes](../../reference/versions.md) and the target version's immutable product manifest.
