---
title: '0.2 candidate: upgrade and recovery'
description: 'Writer shutdown, backups, migration, explicit activation and authorization continuity for the unreleased 0.2 candidate.'
---

# 0.2 candidate: upgrade and recovery

**Unreleased.** This guide supports candidate evaluation and isolated rehearsals, not a formal upgrade commitment. The [0.2 overview](index.md) identifies source revisions; first read [field policies](field-policies.md).

Candidate validation targets fresh databases and formal 0.1.6. Only the final product manifest can establish supported platforms, image digests, CLI versions, and upgrade sources. A runnable database migration does not establish other direct cross-version upgrade paths.

1. Inventory old confirmations, unknown executions, files, and authorization revocations. Back up the database, uploads, private files, and encryption key.
2. Stop and isolate old API processes, schedulers, AI recovery/expiry tasks within the API, and other writers. Verify that they cannot re-enter and that no database transactions remain in flight. Direct startup and Docker Compose can both use existing maintenance interfaces; Ctrl+C alone is not trusted stop evidence.
3. Pin matching Backend and Web artifacts, with API and scheduler using the same Backend. The host migration controller must use the corresponding Backend source and locked dependencies, with its environment recorded separately. Migration failure stops initialization; do not `stamp head`. Seed failure leaves maintenance in place until inspection and explicit recovery.
4. Verify history, permissions, and the matching Web in `legacy` / `ready`. Explicitly activate each tenant only after all surface qualification passes.

Even a preactivation backup restore must match the original application, files, and key. After activation, do not reconnect a 0.1.6 backend or restore an old database and expose reads, downloads, or AI. For disaster recovery, isolate entry points first, establish revocation and policy continuity using records independent of the backup, reconcile post-failure side effects, and recover forward using a version that supports field policies. Keep affected surfaces closed when only the database is restored, files are missing, or revocation evidence is incomplete. Increasing the backup's epoch cannot supply that evidence.

## Controlled installation and CLI handoff

CLI 0.1.16's default seed command does not supply the maintenance inventory required by this candidate. Follow the fixed-source [controlled installation protocol](https://github.com/aihohu/hohu-admin/blob/fb0edbd7879a7ff14df7f010eea7dc4e7faddba5/docs/CONTROLLED-INSTALL.md): the host controller runs `controlled_install prepare` with a real inventory, migrates and seeds through retained connections while new database logins are blocked, and leaves admission closed on success or failure. Fresh installation requires the separate bootstrap proof; an existing deployment cannot use it as a shortcut.

After verifying the success receipt, source and pinned artifacts, explicitly run `controlled_install resume`. Only then use `hohu deploy --source official --no-migrate` to start the prepared combination while user access remains closed and scheduled jobs stay paused. The CLI does not verify the receipt. This option hands off work already completed; it must not bypass a failed migration or seed. The host performs migration in this path, so do not claim that the CLI's unused migrator container executed it. Keep maintenance credentials off the application containers.

The candidate prioritizes `linux/amd64`, PostgreSQL 15 and Redis 7. CLI template defaults for PostgreSQL 18 and Redis 8.6 are a different combination and cannot inherit that evidence; pin the chosen infrastructure explicitly. Final image installation, upgrade, recovery and AI consistency verification remains required before publication.

See the fixed candidate source’s [database migration manual](https://github.com/aihohu/hohu-admin/blob/fb0edbd7879a7ff14df7f010eea7dc4e7faddba5/docs/DATABASE-MIGRATIONS.md) for operational commands and migration constraints. Before a formal upgrade, check the [stable release notes](../../reference/versions.md) and the target version's immutable product manifest.
