---
title: hohu deploy and migrations
description: 'HoHu hohu deploy and migrations: steps, scope and limitations'
---

# hohu deploy and migrations

Install a CLI release compatible with your application. Run `hohu deploy --help` for available options and see [release notes](../reference/versions) for component releases.

| Command                             | Behavior                                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `hohu deploy init`                  | Generate/complete `.hohu/deploy`; --force replaces outdated templates, so preserve custom content first |
| `hohu deploy`                       | Pull applicable images, prepare infrastructure, migrate, synchronize seeds and start                    |
| `hohu deploy --no-migrate`          | Skip migrations and seed synchronization in that stage; only for controlled cases that need no update   |
| `hohu migrate`                      | Run deployment migration and seeds separately, without an additional initialization switch              |
| `hohu deploy pull`                  | Update images, migrate, synchronize and start; not download-only                                        |
| `hohu deploy upgrade`               | Pull source, build, stop and redeploy; accepts --no-cache and involves downtime                         |
| `hohu deploy restart [SERVICES...]` | Restart services; does not replace migration                                                            |
| `hohu deploy down`                  | Stop Compose services; not a business-data reset command                                                |

```bash
hohu deploy ps
hohu deploy logs -f hohu-admin-api
hohu deploy restart hohu-admin-api
```

Normal deployment synchronizes seed data automatically. **Do not use `hohu deploy --init` or `hohu migrate --init`.** Repeated runs preserve passwords, custom content and existing grants. Migration/seed failure prevents normal startup.

For external database/Redis deployments, verify infrastructure orchestration for each command in your revision; do not assume every maintenance subcommand recognizes identical external-service settings.

See [Upgrade guidance](../operations/upgrade) for configuration, backups, maintenance windows and recovery, and [hohu build](./build) for source images.
