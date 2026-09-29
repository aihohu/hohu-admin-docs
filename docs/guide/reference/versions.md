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

Components version independently. Use the combination documented by the release; matching version numbers are not required. Run `hohu --version` to inspect your installed CLI.

## Before upgrading

1. Record application versions, CLI version and deployment configuration.
2. Review the supported database starting point and configuration changes.
3. Back up the installation and test the upgrade in a separate environment.
4. Follow [Upgrade and recovery](../operations/upgrade).

For installation, see the [quick start](../quick-start) or [server deployment](../deploy).
