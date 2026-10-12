---
title: Upgrade, backup, and recovery
description: Record HoHu versions, back up databases, files, and keys, rehearse upgrades and recovery, and understand migration and source-update limits.
---

# Upgrade, backup, and recovery

Upgrades can change application versions, database structure, seed data, and runtime configuration. Record the current state and rehearse in isolation. CLI currently has no generic backup, restore, or automatic rollback command.

## Backup inventory

| Item                           | Default source                                              | Recovery purpose                                                                |
| ------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| PostgreSQL                     | hohu-pgdata volume or external database                     | Business data, accounts, grants, and migration revision                         |
| Public and private files       | Deployment uploads and private_uploads directories          | Images, import/export files, and attachments                                    |
| Deployment configuration       | `.hohu/deploy/.env` and custom override                     | Connections, keys, versions, and topology                                       |
| Application and image versions | IMAGE_TAG, image ID/digest, source commit                   | Match the restored database                                                     |
| Certificates and automation    | Actual certificates and controlled operations configuration | Restore access and maintenance                                                  |
| Redis / monitoring             | Their volumes or external services                          | Sessions, short-lived state, and monitoring history according to recovery goals |

Preserve original keys such as SECRET_KEY. Newly generated keys cannot decrypt stored Provider or mail credentials. Database and file backups need compatible business timestamps. Keep backups in an independent location and verify readability.

Use PostgreSQL logical backups or managed-database snapshots. `pg_dump` does not include cluster-wide objects such as roles; plan those separately. Copying a running data directory is not a consistent backup procedure. See [PostgreSQL backup documentation](https://www.postgresql.org/docs/current/backup-dump.html).

## Upgrade procedure

1. Record CLI, image or source versions, and the current Alembic revision. Read [release notes](../reference/versions).
2. Restore a backup in isolation and rehearse target migrations and functional checks.
3. Schedule maintenance, stop incoming writes and related jobs, and take a final consistent backup.
4. Choose the update path below and check migration and seed exit results.
5. Verify login, ordinary-user permissions, tenants, settings, files, jobs, and AI before reopening traffic.

| Deployment                           | Update path                                                                 |
| ------------------------------------ | --------------------------------------------------------------------------- |
| Published images                     | Set target images/tags in configuration, then run `hohu deploy pull`        |
| Separate component repositories      | Update compatible component source, then run `hohu build` and `hohu deploy` |
| Pullable project-root Git repository | Use `hohu deploy upgrade` when its prerequisites are met                    |

`pull` migrates and starts the application; it is not download-only. `upgrade` runs git pull once at the root, then builds, stops, and redeploys. It neither updates each independent component repository nor provides zero-downtime upgrades. See [CLI deployment](../cli/deploy).

Do not use `--no-migrate` to skip required structure or seed updates. See [migration reference](../cli/migrate#limitations) for standalone migrate limitations with external dependencies.

## Supported database starting points

Current migrations support empty databases and the v0.1.4 release boundary `bf244f9a8b76`. Older releases must first follow their original migration chain to that boundary. Development databases using pre-squash experimental migrations are outside automatic upgrade coverage.

Keep errors and the current revision if migration fails. Do not use `stamp head` to pretend an upgrade succeeded. The matching release's Alembic output defines the current head; maintainer guidance is in backend `docs/DATABASE-MIGRATIONS.md`.

## Recovery procedure

1. Keep maintenance active, preserve failure logs, and determine whether new-version writes occurred.
2. Restore matching database, files, original keys, and application versions to an isolated target. Preserve the original backup.
3. Handle old Redis sessions and pending confirmations according to recovery goals; expired execution context is not valid authority.
4. Verify accounts, permissions, counts, file references, and jobs before switching traffic and reopening writes.

Reverting an image does not restore the database. Downgrades can remove tables or columns and cannot replace rehearsed recovery. Record the recovery point and potential data differences rather than combining old files with a newer database.
