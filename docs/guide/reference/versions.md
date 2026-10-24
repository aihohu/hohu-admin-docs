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

## 0.1.6 release and compatibility

The **Backend/Web 0.1.6 components have been delivered, and the final linux/amd64 combination has passed acceptance and independent review**. This patch fixes tenant-scoped AI user creation/counting, atomic write completion, lost acknowledgement recovery, and safe display of unknown, cancelled, and preflight-rejected actions. Unknown outcomes must not be replayed merely to clear a conversation.

The final published digests have passed fresh installation, upgrade from original 0.1.5 images, and recovery to the original artifacts with **CLI 0.1.16 on linux/amd64**. Upgrades require a maintenance window and target database revision `d01010100101`. Recovery must cover the database, public and private files, original keys, and authorization revocations together. See [fixed artifacts and recovery](../operations/upgrade#fixed-artifacts).

The product release is complete when the single [0.1.6 release.json](https://github.com/aihohu/hohu-admin/releases/download/v0.1.6/release.json) is publicly readable and passes validation. Download this non-overwritable manifest to select Backend/Web digests, the CLI version, supported platforms, evidence, and the pinned documentation snapshot. If it cannot be read or validated, stop the upgrade; component announcements alone do not establish product availability.

| Scope              | 0.1.6 compatibility and limitations                                                                                                                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend / Web      | [Backend v0.1.6](https://github.com/aihohu/hohu-admin/releases/tag/v0.1.6) and [Web v0.1.6](https://github.com/aihohu/hohu-admin-web/releases/tag/v0.1.6), using the pinned digests from the original builds in the manifest                                         |
| Supported platform | `linux/amd64`; `linux/arm64` images and manifests were verified, but full runtime acceptance was not performed                                                                                                                                                       |
| Upgrade source     | Only the tested `0.1.5`; other starting versions are outside this upgrade commitment                                                                                                                                                                                 |
| CLI                | Only `0.1.16` was tested; manual digest pinning, without automatic manifest parsing or generic backup/restore commands                                                                                                                                               |
| Mobile / desktop   | `not_released`, with no compatible client release declared for this product                                                                                                                                                                                          |
| AI and recovery    | Actual tools, confirmation endpoints, transaction faults, and cold recovery were tested; external model content quality is not promised. Disable old AI write routes during recovery, and prove the complete authorization-version high-watermark in your deployment |

The 0.1.6 release flow preserves existing series and `latest` aliases; do not assume they select 0.1.6. Product qualification does not deploy your production environment. Verify networking, model configuration, credentials, backups, and recovery conditions in that environment.

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
