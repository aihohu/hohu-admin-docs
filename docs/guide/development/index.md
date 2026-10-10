---
title: Build business modules with FastAPI and Vue
description: 'Extend HoHu with Python, FastAPI and Vue 3. Develop business models, APIs and pages with shared permissions, tenant isolation and AI tools.'
---

# Build business modules with FastAPI and Vue

This guide is for developers extending the product. For everyday operations, use the [User guide](../user/index).

HoHu provides a FastAPI backend and Vue 3 Web interface. Start with a business module, reuse the platform's users, permissions and tenant scope, then connect business tools to an AI assistant as needed. The CLI and Skills provide two ways to start development.

1. Prepare the [development environment](../quick-start) with the CLI and matching component revisions.
2. Read [Backend architecture](../backend/introduction) and [Repository structure](../backend/dir), then [add a business module](./module).
3. Enforce [feature permissions](../auth), [data scope](../data-permission) and trusted tenant scope for business access.
4. Integrate [pagination](../page), [uploads](../file-upload), [caching](../backend/cache), [scheduled jobs](../scheduled-job) and [internationalization](./i18n) as needed.

Contribution workflows, test isolation, database migration constraints and current architecture boundaries remain in the code repositories. Read the relevant README, CONTRIBUTING/AGENTS and maintained guides first. See [Source and licensing](../src).

Site tutorials do not override repository security constraints. Example queries must preserve tenant, owner and permission boundaries.

## Add AI to your business

Choose a task in the [AI overview](../ai/index). For source development with a coding assistant, [install Skills](../cli/skills), then follow [AI-assisted development](../ai-coding). To manually integrate business queries, confirmation and results, see [Connect business tools](./ai-tools).
