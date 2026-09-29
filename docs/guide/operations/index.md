---
title: Deployment and operations
description: Deploy HoHu with hohu-cli, configure infrastructure, plan upgrades and backups, and enable multi-tenancy and AI.
---

# Deployment and operations

This section is for people installing, configuring and maintaining the system. hohu-cli orchestrates services; users do not run individual initialization scripts.

- New installation: check [Versions](../reference/versions), prepare Docker, then follow [CLI deployment](../deploy).
- Existing installation: read [Upgrade and recovery](./upgrade) and confirm the supported starting point and matching components.
- Multiple business tenants: follow [Multi-tenancy](./tenants); changing the login screen alone is insufficient.
- AI: configure models, egress controls, permissions and process mode using [AI deployment](./ai).

Database connections, Redis, secrets, networking and storage belong to deployment configuration. Branding, registration, language and ordinary upload preferences belong to system settings. See [Configuration ownership](../reference/configuration).
