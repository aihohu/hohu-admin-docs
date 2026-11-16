---
title: '0.2 series: unreleased candidate'
description: 'System field permissions, controlled upgrades, recovery boundaries and matching source revisions for HoHu 0.2.'
---

# 0.2 series: unreleased candidate

**0.2 is not formally released.** The candidate covers system field permissions, transfer/files, AI/background delivery, controlled installation and consistent recovery. Combination acceptance is ongoing. Source availability and individual tests do not establish released artifacts or production upgrade commitments. 0.1 remains maintained without an EOL countdown.

| Task                                                                             | Guide                                         |
| -------------------------------------------------------------------------------- | --------------------------------------------- |
| Menu/field boundaries, six purposes, role configuration, activation and delivery | [System field permissions](field-policies.md) |
| Versions, shutdown, migration, CLI handoff and recovery                          | [Upgrade and recovery](upgrade.md)            |
| Stable manuals and historical material                                           | [0.1 manuals and archive](../0.1/index.md)    |
| Compare series status                                                            | [Documentation series](../index.md)           |

This directory maintains 0.2 changes and current operating boundaries. Other user, development and CLI pages remain labeled 0.1; their availability does not establish 0.2 validation.

## Matching candidate sources

- [Pinned Backend source](https://github.com/aihohu/hohu-admin/tree/4f3829d7f754f2920ec5c2b233bdbf6b562206af): `4f3829d7f754f2920ec5c2b233bdbf6b562206af`, component target 0.2.0.
- [Pinned Web source](https://github.com/aihohu/hohu-admin-web/tree/59c6b77d59481b9ad7dae1d95e2468a506ee990d): `59c6b77d59481b9ad7dae1d95e2468a506ee990d`, component target 0.2.0.
- Published CLI 0.1.16 provides manual controlled handoff. App/Desktop are outside the formal release scope.
- The candidate targets linux/amd64 and PG15/Redis7. A formal immutable manifest must pin final images, platforms, upgrade sources and documentation. No formal 0.2 release.json is available, and this page makes no main-integration or production-deployment claim.

See [release notes](../../reference/versions.md) for formal status and immutable artifacts.
