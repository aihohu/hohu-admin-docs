---
title: Upgrade, backup, and recovery
description: Record HoHu versions, back up databases, files, and keys, rehearse upgrades and recovery, and understand migration and source-update limits.
---

# Upgrade, backup, and recovery

Upgrades can change application versions, database structure, seed data, and runtime configuration. Record the current state and rehearse in isolation. CLI currently has no generic backup, restore, or automatic rollback command.

## Backup inventory

| Item                           | Default source                                              | Recovery purpose                                                           |
| ------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| PostgreSQL                     | hohu-pgdata volume or external database                     | Business data, accounts, grants, and migration revision                    |
| Public and private files       | Deployment uploads and private_uploads directories          | Images, import/export files, and attachments                               |
| Deployment configuration       | `.hohu/deploy/.env` and custom override                     | Connections, keys, versions, and topology                                  |
| Application and image versions | IMAGE_TAG, image ID/digest, source commit                   | Match the restored database                                                |
| Certificates and automation    | Actual certificates and controlled operations configuration | Restore access and maintenance                                             |
| Redis                          | Its volume or external service                              | Logout revocations, consumed refresh tokens, and pending execution context |
| Monitoring                     | Its volumes or external service                             | Monitoring history according to recovery goals                             |

Preserve original keys such as SECRET_KEY. Newly generated keys cannot decrypt stored Provider or mail credentials. Database and file backups need compatible business timestamps. Keep backups in an independent location and verify readability.

Use PostgreSQL logical backups or managed-database snapshots. `pg_dump` does not include cluster-wide objects such as roles; plan those separately. Copying a running data directory is not a consistent backup procedure. See [PostgreSQL backup documentation](https://www.postgresql.org/docs/current/backup-dump.html).

## Upgrade procedure

1. Record CLI, image or source versions, and the current Alembic revision. Read [release notes](../reference/versions).
2. Restore a backup in isolation and rehearse target migrations and functional checks.
3. Schedule maintenance, stop incoming writes, terminate old writers as described below, and take a final consistent backup.
4. Choose the update path below and check migration and seed exit results.
5. Verify login, ordinary-user permissions, tenants, settings, files, jobs, and AI before reopening traffic.

| Deployment                           | Update path                                                                                              |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Fixed product artifacts              | Follow the digest preparation and preflight below, then run `hohu deploy --source official`              |
| Other published image deployments    | Set compatible images/tags, then run `hohu deploy pull`; this does not prove a fixed product combination |
| Separate component repositories      | Update compatible component source, then run `hohu build` and `hohu deploy`                              |
| Pullable project-root Git repository | Use `hohu deploy upgrade` when its prerequisites are met                                                 |

`pull` migrates and starts the application; it is not download-only. `upgrade` runs git pull once at the root, then builds, stops, and redeploys. It neither updates each independent component repository nor provides zero-downtime upgrades. See [CLI deployment](../cli/deploy).

Do not use `--no-migrate` to skip required structure or seed updates. See [migration reference](../cli/migrate#limitations) for standalone migrate limitations with external dependencies.

## Fixed artifacts with CLI 0.1.16 {#fixed-artifacts}

This manual path uses the actual `hohu deploy` command in CLI 0.1.16. It has been exercised on `linux/amd64` with a fresh installation and the original 0.1.5 images as the upgrade source. A candidate rehearsal does not qualify a later release build: repeat acceptance against the exact published Backend/Web combination. Other platforms require their own evidence.

1. Obtain the verified product `release.json` and its component build records. Record the product version, Backend/Web source commits, registry, index digest, platform manifest digest, CLI version, and infrastructure digests. CLI 0.1.16 does not read or validate `release.json`. Do not infer a product combination from `latest` or a series tag.
2. Run `hohu deploy init` in a dedicated directory. Set a unique `HOHU_DEPLOY_NAME`, access topology, and credentials in `.hohu/deploy/.env`. Keep PostgreSQL and Redis private. In hosted mode, set `RELEASE_BUILD_SHA` to the selected Backend's full source commit. Preserve existing `SECRET_KEY` and storage paths during upgrades.
3. Download each complete, approved reference before deployment, for example `docker pull --platform linux/amd64 <repository>@sha256:<index-digest>`. Check its platform manifest and local image identity. Prepare the pinned infrastructure images too. A digest is registry-specific; changing registry requires checking that registry's approved reference again.
4. Write `.hohu/deploy/docker-compose.override.yml`. Replace every placeholder below with the verified reference. The template appends `:IMAGE_TAG` to `API_IMAGE` and `WEB_IMAGE`, so put complete digest references in the override's `image` fields.

```yaml
x-backend: &backend
  image: <backend-repository>@sha256:<backend-index-digest>
  platform: linux/amd64
  pull_policy: never
  restart: 'no'

services:
  db-migrator:
    <<: *backend
  hohu-admin-api:
    <<: *backend
  hohu-admin-scheduler:
    <<: *backend
    command: ['python', '-c', 'import time; time.sleep(86400)']
  hohu-admin-web:
    image: <web-repository>@sha256:<web-index-digest>
    platform: linux/amd64
    pull_policy: never
    restart: 'no'
  postgres:
    image: <postgres-repository>@sha256:<postgres-index-digest>
    platform: linux/amd64
    pull_policy: never
  redis:
    image: <redis-repository>@sha256:<redis-index-digest>
    platform: linux/amd64
    pull_policy: never
```

The scheduler command deliberately runs a waiting process in the same Backend image during verification. It does not start APScheduler, load jobs, or accept manual job execution. Keep it paused until the controlled resume step below. The wait expires after 24 hours; retain maintenance if verification lasts longer. Pin any additionally enabled proxy or monitoring services as well.

5. Inspect the final Compose configuration using the CLI's file order: `docker-compose.yml`, `docker-compose.infra.yml` if present, then `docker-compose.override.yml`, with the same `.env`, project directory, and `migrate` profile. The following Bash example emits only safe image fields; expanded configuration contains secrets and must not be printed or saved to a public log.

```bash
d="$PWD/.hohu/deploy"
compose=(docker compose -f "$d/docker-compose.yml")
if [ -f "$d/docker-compose.infra.yml" ]; then
  compose+=(-f "$d/docker-compose.infra.yml")
fi
compose+=(-f "$d/docker-compose.override.yml" --env-file "$d/.env" --project-directory "$d")
"${compose[@]}" --profile migrate config --format json |
  python -c 'import json,sys; c=json.load(sys.stdin); print(json.dumps({n:{k:s.get(k) for k in ("image","platform","pull_policy")} for n,s in c["services"].items()},indent=2))'
docker image inspect '<repository>@sha256:<index-digest>' \
  --format '{{.Id}} {{.Os}}/{{.Architecture}} {{json .RepoDigests}}'
```

Compare **all three Backend services and Web** against the approved references, platform, and `never` policy. Check every local image and the infrastructure configuration. Stop before invoking CLI for a missing/unknown manifest, mismatched override, or wrong platform. These are operator checks; CLI's local image inspection does not establish them. A missing local pinned image causes CLI image preparation to fail before migration.

6. After preflight and, for an upgrade, the writer termination and backup steps below, run `hohu deploy --source official` from the project directory. Capture the actual migrator image ID and exit result, then the API, scheduler, and Web image IDs. Verify the same artifacts were used throughout. A successful CLI exit alone is insufficient.

Do not substitute `hohu deploy pull` as a download-only step, or `hohu deploy upgrade` for this path. The former starts migration and services; the latter updates/builds source and changes image configuration. Fixed references are not automatically mapped to another registry.

## Maintenance, old writers, and scheduler resume {#writers-and-jobs}

Before migration, close incoming writes and confirmations. Inventory **all** API instances, schedulers, workers, maintenance processes, and automation that can write to this database or storage. Disable their restart mechanisms and terminate/remove the old processes, including paused instances. Check remaining database client sessions independently. A closed proxy, an expired lease, or a disabled job record does not stop an already running writer; manual job execution can bypass job status.

Fence stale configurations too: revoke the old database role or rotate its password and terminate existing connections before allowing the target deployment to connect. In a shared database, use the approved role-specific procedure. Prove that resuming an old container and starting the old image with its old credentials cannot write. Keep maintenance active if that proof is missing. Then back up the database, public/private files, Redis security state, deployment configuration, original artifacts, and keys at the same quiet point. Record the credential change separately; `pg_dump` does not restore role passwords.

Inventory legacy pending/running actions while writers are stopped. Preserve their original status, error, and timing. Unknown outcomes require evidence-backed reconciliation; do not replay them or convert them to success/failure merely to unblock the UI. Check both current Web and cached 0.1.5 Web against the target API: an unknown result must remain visible without a second execution or a misleading failure prompt.

During verification, keep the waiting scheduler command and restrict traffic to the acceptance operator. Check login, ordinary permissions, CRUD, two-tenant boundaries, settings decryption, file contents, AI reads, confirmation/rejection, and authority revoked before approval. AI user creation requires an explicitly configured, valid default password; a missing value must reject the action without creating a user.

After acceptance, compare the job inventory with the saved one. Remove only the scheduler `command` override so the base template's `python -m app.scheduler_worker` applies. Preflight the same Compose configuration again, then recreate only that service with `docker compose` using the same file/env arguments and `up -d --no-deps --pull never hohu-admin-scheduler`. Verify its image ID and a controlled job execution before reopening writes. Restore the intended restart policy only after this check.

## Supported database starting points

Current migrations support empty databases and the v0.1.4 release boundary `bf244f9a8b76`. Older releases must first follow their original migration chain to that boundary. Development databases using pre-squash experimental migrations are outside automatic upgrade coverage.

Keep errors and the current revision if migration fails. Do not use `stamp head` to pretend an upgrade succeeded. The matching release's Alembic output defines the current head; maintainer guidance is in backend `docs/DATABASE-MIGRATIONS.md`.

## Recovery procedure

1. Keep maintenance active, preserve failure logs, and determine whether new-version writes occurred.
2. Restore matching database, files, original keys, and application versions to an isolated target. Preserve the original backup.
3. Retain the newest complete Redis revocation facts from the stopped target system, including logout and refresh-token consumption **after** the business backup. Verify those credentials still fail after database recovery. An older Redis snapshot or an empty cache can revive credentials and is not a safe authentication recovery.
4. If Redis facts are missing, use the authorization-version procedure below while writers and traffic remain stopped. Keep the original shared encryption key.
5. Verify accounts, permissions, data/file hashes, decryption, exact old image IDs, and controlled job behavior. The original 0.1.5 images restore their known AI completion defect too: keep affected AI writes isolated or keep maintenance active. Setting `AI_MODULE_ENABLED=false` rejects AI requests with `503 / AI_MODULE_DISABLED` on that version; verify this before any limited reopening.

Reverting an image does not restore the database. Downgrades can remove tables or columns and cannot replace rehearsed recovery. Record the recovery point and potential data differences rather than combining old files with a newer database.

### Lost Redis and authorization-version reuse {#authorization-recovery}

Restoring `auth_version = 1` and incrementing it to `2` can reactivate a token previously issued with version `2`. Before recovery, preserve an external, complete high-water mark covering every affected user's `auth_version`, every tenant's `row_version`, and versions used in tokens issued after the backup, including identities later deleted. A maximum over the current database alone does not prove this history.

With all writers stopped, choose one positive integer strictly greater than both the restored versions and that proven high-water mark, within the database integer range. In one controlled transaction, set **every restored user's** `auth_version` and **every restored tenant's** `row_version` to the new value. This is an operator-maintained database procedure, not a CLI rollback feature. Test pre-backup tokens, post-backup tokens, logged-out access tokens, consumed refresh tokens, and a new login before reopening. If the watermark is incomplete, unavailable, or exhausted, keep maintenance active and resolve the missing evidence; do not guess a value or rotate the shared `SECRET_KEY` as a shortcut.
