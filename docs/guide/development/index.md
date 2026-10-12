---
title: Developer guide
description: Build HoHu applications with FastAPI and Vue 3, from local setup to business modules, permissions, tenant scope, AI tools, and desktop integration.
---

# Developer guide

Start with one business module and connect its model, API, page, and permissions. This guide is for developers. For daily administration, see the [user guide](../user/index); for server releases, see [deployment and operations](../operations/index).

## Your first module

1. **Run the project**: follow [environment setup](../quick-start), select Backend and Frontend, initialize them, and sign in.
2. **Build a module**: follow the [business notes tutorial](./module) to add creation, pagination, menus, and bilingual pages.
3. **Verify and deliver**: use an ordinary role to check permissions and tenant isolation, then follow [debugging and validation](./testing) for migrations, builds, and functional checks.

The notes tutorial includes complete source examples. Notes are shared within a tenant; private or department-scoped resources require their own data policy.

## Find a task

| Task                                                | Read                                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Understand layers and file locations                | [Backend architecture](../backend/introduction), [repository structure](../backend/dir)    |
| Add a table, API, page, and menu                    | [Add a business module](./module)                                                          |
| Connect a Vue page, requests, and loading state     | [Web pages and requests](./web)                                                            |
| Restrict actions and accessible records             | [API and button permissions](../auth), [data scope](../data-permission)                    |
| Add lists, images, and caching                      | [Pagination](../page), [upload integration](../file-upload), [caching](../backend/cache)   |
| Register a background task                          | [Scheduled jobs](../scheduled-job)                                                         |
| Add translations and languages                      | [Internationalization](./i18n)                                                             |
| Diagnose request, migration, type, and build issues | [Debugging and validation](./testing)                                                      |
| Build a desktop application                         | [Desktop overview](../desktop/introduction), [desktop development](../desktop/quick-start) |

## Develop with AI assistance

[Install HoHu Skills](../cli/skills), then follow [AI-assisted development](../ai-coding) to create a project or implement a module. Generated code still needs migration, permission, and functional validation.

To expose business capabilities to the in-app AI assistant, continue with [business tool integration](./ai-tools). HTTP endpoints do not automatically become AI tools; queries, confirmed execution, and result rendering need explicit integration.

## Development conventions

- The API handles authentication, permissions, and commits. Services own business logic and data scope. Models and schemas define persistence and API data respectively.
- Tenant context comes from server-side authentication. Keep tenant boundaries in queries, relationships, and writes.
- Send IDs to the frontend as strings. Keep business types and permission codes stable, and maintain both language resources.
- Use each repository's manifests, lockfiles, and contribution instructions for versions and checks. See [source and licensing](../src).
