---
title: Source and licensing
description: HoHu Admin source code repositories — Apache-2.0 by default, with historical and third-party license notices preserved
---

# Source and licensing

**HoHu Admin** uses Apache License 2.0 by default, except where otherwise noted. Commercial use is permitted under the applicable license terms. Stars are welcome!

The backend and Web projects switch starting with v0.1.5; previously released versions through v0.1.4 retain their MIT license. Other projects adopt Apache-2.0 in their current development versions without a version bump; copies previously distributed under the MIT license retain their grants. Third-party code retains its applicable licenses and notices; consult each repository's `LICENSE`, `NOTICE` and, where present, `THIRD_PARTY_NOTICES.md`.

This documentation site's license files are available here: [Apache-2.0](/licenses/LICENSE.txt) and [project notice](/licenses/NOTICE.txt).

## Repository reference

| Project                                                            | Purpose                                           |
| ------------------------------------------------------------------ | ------------------------------------------------- |
| [hohu-admin](https://github.com/aihohu/hohu-admin)                 | Backend API, platform core, and migrations        |
| [hohu-admin-web](https://github.com/aihohu/hohu-admin-web)         | Web administration UI                             |
| [hohu-admin-app](https://github.com/aihohu/hohu-admin-app)         | Mobile application and mini-program               |
| [hohu-admin-desktop](https://github.com/aihohu/hohu-admin-desktop) | Electron desktop client                           |
| [hohu-cli](https://github.com/aihohu/hohu-cli)                     | Project creation, development, and deployment CLI |
| [hohu-admin-docs](https://github.com/aihohu/hohu-admin-docs)       | Website and documentation                         |

## Issues and contributions

Report issues in the affected component's repository with versions, reproduction steps, expected and actual behavior, and redacted logs. Route command problems to the CLI repository and documentation corrections to the docs repository. Do not upload complete environment files, credentials, or business data.

Read the target repository's README, contribution rules, and license notices before modifying it. See the [developer guide](./development/) for local setup and [releases](./reference/versions) for published changes.
