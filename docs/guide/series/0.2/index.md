---
title: '0.2 series: unreleased candidate'
description: 'Scope, user field policies, upgrade and recovery boundaries, and fixed source revisions for the HoHu 0.2 candidate.'
---

# 0.2 series: unreleased candidate

**0.2 is not formally released.** This directory describes user field policies and upgrade/recovery requirements validated against the source candidate. It does not establish released artifacts or authorize production upgrades. 0.1 remains maintained, with no EOL countdown.

| Task                                                                     | Guide                                      |
| ------------------------------------------------------------------------ | ------------------------------------------ |
| Manage policies, field access, import/export, downloads and AI history   | [User field policies](field-policies.md)   |
| Evaluate upgrade from 0.1.6, stop writers, migrate, activate and recover | [Upgrade and recovery](upgrade.md)         |
| Read stable manuals and historical release material                      | [0.1 manuals and archive](../0.1/index.md) |
| Compare series status                                                    | [Documentation series](../index.md)        |

This directory covers 0.2 changes and operational boundaries; it is not yet a complete general 0.2 handbook. Other user, development and CLI pages remain labeled 0.1. Their availability does not establish 0.2 validation. For fields, authorization, files and recovery, follow the restrictions in this directory.

## Candidate sources and release conditions

- [Fixed Backend source](https://github.com/aihohu/hohu-admin/tree/20cb459eb71d8b95b114bbb1bdb6c7c41e9558c2): `20cb459eb71d8b95b114bbb1bdb6c7c41e9558c2`.
- [Fixed Web source](https://github.com/aihohu/hohu-admin-web/tree/0994bab24d549a7b72cfb9469ddab9540d3d8ca2): `0994bab24d549a7b72cfb9469ddab9540d3d8ca2`.
- Candidate acceptance covers fresh databases and formal 0.1.6. Final platforms, images, CLI combinations and upgrade commitments require the formal product manifest. There is no 0.2 `release.json` download here because no formal manifest exists yet.
- App/Desktop remain unreleased. CLI does not automatically parse product manifests; a source project created from main is not a reproducible stable combination.

See [release notes](../../reference/versions.md) for formal status and immutable manifests. A future product manifest pins its documentation; movable branches cannot prove released capability.
