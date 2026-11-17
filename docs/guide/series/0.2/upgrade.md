---
title: '0.2 candidate: upgrade and recovery'
description: 'Version, shutdown, qualification, controlled installation, CLI handoff and consistent recovery for system field permissions.'
---

# 0.2 candidate: upgrade and recovery

**Unreleased.** This page supports candidate evaluation and isolated rehearsals. The [overview](index.md) pins matching sources; [field permissions](field-policies.md) describes current authority. Only the eventual immutable manifest establishes supported platforms, image digests, CLI combinations and upgrade sources.

## Installation and first activation

The candidate targets `linux/amd64`, PostgreSQL 15 and Redis 7, evaluating fresh databases and formal 0.1.6 sources. Runnable migrations do not establish arbitrary version jumps, database major-version changes or other CPU architectures. API and scheduler use the same Backend with matching Web. Record the host controller's matching Backend source and locked dependencies separately.

1. Inventory every writer, old confirmation, unknown execution, historical file and revocation fact. Explicitly configure the three field-management permissions for every initialized or enabled tenant, including disabled tenants.
2. Take one consistent backup of the database, public/private files, encryption key, configuration and independent revocation records. Isolate traffic; stop old API, scheduler and API recovery/expiry tasks; prevent old processes or credentials from re-entering; verify database sessions and prepared transactions. Ctrl+C alone proves none of this.
3. Run `controlled_install policy-prepare` with a real maintenance inventory; fresh databases also require bootstrap evidence. Keep new logins closed while retained connections migrate and seed. Stop on migration failure; do not run bare `init_db` or `stamp head`. Ordinary `prepare` only installs schema and seeds, without enabling generic field policy.
4. Supply server-owned `FIELD_POLICY_QUALIFICATION_FILE`: schema 2, at most 1MiB and 24 hours, bound to the exact Backend SHA, migration `e020f3b00001`, catalog/actions/adapters and complete acceptance evidence. Role authority and browser JSON cannot replace it.
5. The loopback preparation service uses a verified preparation Web build and short-lived management sessions. Save candidates, seal each complete tenant manifest, mark ready and separately confirm activate. Every active tenant object must be enforced; disabled/prepared tenants may remain completely isolated and ungranted.
6. Explicit finish rechecks the complete tenant set and active digests. Only after listener shutdown and database quiescence can it produce `qualified-stopped` and a byte-bound install receipt. Without valid qualification, finish only closes editing and cannot permit resume.
7. A separate resume process checks current qualification, build/database OID/deployment binding, preparer exit, original receipts, quiescence and the waiting window before explicit `controlled_install resume`. This restores admission, without starting processes or traffic. The operator then starts the matching combination and completes verification.

Direct startup supports combined development API/scheduler and split API/scheduler processes. Docker Compose shares the maintenance protocol without requiring a new platform. Old Web writes are checked server-side. Failure, cancellation, unknown commit or missing records leaves maintenance in place without automatic replay. Stop metadata retains the preparation requirement; deleting markers or replacing receipts cannot bypass it. Completed cycle records are archived, and a later maintenance cycle requires new stop evidence.

See the pinned [installation protocol](https://github.com/aihohu/hohu-admin/blob/1b6abcd85ae800047b72d97d15ff07b52a8aafd0/docs/CONTROLLED-INSTALL.md), [maintenance protocol](https://github.com/aihohu/hohu-admin/blob/1b6abcd85ae800047b72d97d15ff07b52a8aafd0/docs/AUTHORIZATION-MAINTENANCE.md) and [field management contract](https://github.com/aihohu/hohu-admin/blob/1b6abcd85ae800047b72d97d15ff07b52a8aafd0/docs/FIELD-POLICY-MANAGEMENT.md) for commands and qualification details.

## Controlled handoff with CLI 0.1.16

The Web image defaults to `single`. Build hosted deployments with `--build-arg VITE_TENANT_MODE=hosted` and pin that separate Web digest; setting an Nginx runtime variable does not rebuild the interface. Configure Backend hosted mode separately. The UI mode grants no tenant authority.

Install the published CLI 0.1.16 and fixed dependencies rather than a modified source checkout. After `hohu deploy init`, manually override API, scheduler and db-migrator to the same Backend digest and pin Web, PG15 and Redis7. The CLI's PG18/Redis8.6 defaults are another combination and cannot inherit this evidence. Do not place a complete digest in a variable that still appends `:IMAGE_TAG`.

Use `hohu deploy --source official --no-migrate` only after the host controller completes migration, seeds, policy preparation and resume. CLI does not validate receipts; this flag cannot skip failed work. This path does not run the default CLI migrator container and must not identify it as the actual migrator. Do not give maintenance database credentials or seed passwords to application containers. An unreleased local combination is not an official 0.2 artifact.

Recreating API containers can change their addresses while an unchanged Web Nginx retains the old upstream address. CLI success and API health do not establish proxy recovery: using the same Compose project, files and environment, execute `nginx -s reload` in `hohu-admin-web` or recreate that container, then verify API access, login and AI streaming through the Web entry point. Refresh any separate reverse proxy according to its configuration as well. CLI 0.1.16 does not automatically reload an unchanged Web container.

## Consistent recovery and prohibited rollback

Even a preactivation restore requires matching application, database, files and key. After activation, do not reconnect Backend 0.1.6 or expose reads, downloads and AI after restoring an old database. Isolate entry points, establish revocation and policy continuity using records independent of the backup, reconcile completed/unknown side effects and recover forward with a version supporting the current policy.

Keep affected surfaces closed when files or keys are missing, only the database is backed up, or revocation facts are incomplete. Raising a backup's epoch cannot create evidence. Do not re-sign old confirmations, re-execute unknown outcomes or claim unproven history and old links. DDL downgrade refuses generic policy facts; deleting tables or reverting to an empty database is not consistent recovery. See the [database migration manual](https://github.com/aihohu/hohu-admin/blob/1b6abcd85ae800047b72d97d15ff07b52a8aafd0/docs/DATABASE-MIGRATIONS.md).
