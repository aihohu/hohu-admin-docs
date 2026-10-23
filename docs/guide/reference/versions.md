---
title: Release notes
description: 'Find HoHu component releases and review behavior changes, migrations and configuration updates before upgrading.'
---

# Release notes

Before upgrading, read the target release notes for new features, behavior changes, database migrations and configuration updates.

| Component                 | Releases                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------ |
| Backend and platform core | [hohu-admin Releases](https://github.com/aihohu/hohu-admin/releases)                 |
| Web application           | [hohu-admin-web Releases](https://github.com/aihohu/hohu-admin-web/releases)         |
| CLI                       | [hohu-cli Releases](https://github.com/aihohu/hohu-cli/releases)                     |
| Mobile client             | [hohu-admin-app Releases](https://github.com/aihohu/hohu-admin-app/releases)         |
| Desktop client            | [hohu-admin-desktop Releases](https://github.com/aihohu/hohu-admin-desktop/releases) |

This documentation covers the **0.1 product series**. Backend and Web releases use the same complete product version; matching numbers still require a verified combination. CLI versions are independent; run `hohu --version` to inspect yours. Mobile and desktop clients have no formal release in this product series.

## 0.1.6 candidate status

The latest published Backend/Web version is **0.1.5**. Version **0.1.6 is being frozen and is not yet a qualified product release**. Its candidate fixes tenant-scoped AI user creation/counting, atomic write completion, lost acknowledgement recovery, and safe display of unknown, cancelled, and preflight-rejected actions. Unknown outcomes must not be replayed merely to clear a conversation.

The candidate's fixed-artifact installation, upgrade from original 0.1.5 images, and recovery procedure has been exercised with **CLI 0.1.16 on linux/amd64**. Final published digests must repeat that acceptance; other platforms remain unverified. See [fixed artifacts and recovery](../operations/upgrade#fixed-artifacts).

Once the product is qualified, use its validated `release.json` from the matching Backend Release to select Backend/Web digests, the CLI version, supported platforms, and the reviewed documentation snapshot. Component announcements alone do not establish this qualification. Series and `latest` aliases are not promoted by the 0.1.6 release flow and must not be assumed to select 0.1.6.

## Before upgrading

1. Record application versions, CLI version and deployment configuration.
2. Review the supported database starting point and configuration changes.
3. Back up the installation and test the upgrade in a separate environment.
4. Follow [Upgrade and recovery](../operations/upgrade).

For installation, see the [quick start](../quick-start) or [server deployment](../deploy).

## Keep a runtime version record

| Item          | Record                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------- |
| Images        | Repository, configured tag, actual image ID / digest; latest changes across pulls            |
| Source        | Tag or full commit SHA for each independent component                                        |
| CLI           | Output of hohu --version                                                                     |
| Database      | Current Alembic revision, database major version, and backup time                            |
| Configuration | Protected locations of matching configuration and secrets; publish only redacted information |

Source commits, image tags, and migration revisions identify different things. They are not interchangeable. This site does not claim that every latest component combination is release-tested.
