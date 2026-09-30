---
title: Development guide
description: Run HoHu locally with the CLI, understand backend layers and connect business modules to permissions, tenant scopes and shared services.
---

# Development guide

This guide is for developers extending the product. For everyday operations, use the [User guide](../user/index).

1. Prepare the [development environment](../quick-start) with the CLI and matching component revisions.
2. Read [Backend architecture](../backend/introduction) and [Repository structure](../backend/dir), then [add a business module](./module).
3. Enforce [feature permissions](../auth), [data scope](../data-permission) and trusted tenant scope for business access.
4. Integrate [pagination](../page), [uploads](../file-upload), [caching](../backend/cache), [scheduled jobs](../scheduled-job) and [internationalization](./i18n) as needed.

Contribution workflows, test isolation, database migration constraints and ADRs remain in the code repositories. Read the relevant README, CONTRIBUTING/AGENTS and maintained guides first. See [Source and licensing](../src).

Site tutorials do not override repository security constraints. Example queries must preserve tenant, owner and permission boundaries.

## Add AI to your business

Choose a task in the [AI overview](../ai/index). For source development with a coding assistant, [install Skills](../cli/skills), then follow [AI-assisted development](../ai-coding). To manually integrate business queries, confirmation and results, see [Connect business tools](./ai-tools).
