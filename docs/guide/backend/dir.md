---
title: Repository structure
description: Locate backend and Web business module files, package exports, route registration, model discovery and application AI integration.
---

# Repository structure

Read the target repository's `AGENTS.md` and neighboring modules before adding a module. This page uses business notes to show where source belongs and how the application loads it. Extend existing modules using their established layout.

## Backend project

```text
hohu-admin/
├── app/
│   ├── core/
│   ├── db/
│   ├── middleware/
│   ├── modules/
│   ├── schemas/
│   ├── tasks/
│   ├── utils/
│   └── main.py
├── alembic/versions/
├── scripts/
├── tools/checks/
├── tests/
└── docs/
```

`core/` provides configuration, security and domain exceptions; `db/` owns database sessions and Base; `modules/` groups features by business domain. Shared schemas belong in `schemas/`, and stateless utilities in `utils/`. Register HTTP routes in `app/main.py` and evolve database structure through Alembic.

## New business module

```text
app/modules/notes/
├── __init__.py
├── api/
│   ├── __init__.py
│   └── note.py
├── models/
│   ├── __init__.py
│   └── note.py
├── schemas/
│   ├── __init__.py
│   └── note.py
├── service/
│   ├── __init__.py
│   ├── note.py
│   └── projection.py
├── ai_tools/
│   ├── __init__.py
│   └── note.py
└── menu_seed.py
```

| Location                | Responsibility                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `api/note.py`           | HTTP validation, permission dependencies, Service calls and successful transaction commits |
| `models/note.py`        | ORM model, Snowflake ID, tenant foreign key and database constraints                       |
| `schemas/note.py`       | Input/output validation, camelCase aliases and string ID serialization                     |
| `service/note.py`       | Queries and business rules through a module singleton; flush is allowed, commit is not     |
| `service/projection.py` | Current access checks for historical AI results                                            |
| `ai_tools/note.py`      | Tool declarations and same-file previews using the Service; Gateway owns transactions      |
| `menu_seed.py`          | Module page and button permissions                                                         |

Every Python package needs `__init__.py`. Export the required API, model, schema and Service objects from their package entry points; see [Add a module](../development/module) for complete code. `ai_tools/__init__.py` can remain empty because the loader explicitly imports `app.modules.notes.ai_tools.note`. Keep previews in the same file as their tool functions.

Keep layer dependencies one-way and call other modules through their Services. Enforce access scope in queries and writes; the directory layout does not establish authorization.

## Registration and checks

| Added capability         | Also update                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| API route                | `app/main.py`                                                                                                                  |
| ORM model                | Model imports in `alembic/env.py` and a reviewed Alembic migration                                                             |
| Tenant-owned table       | `app/core/tenant_inventory.py` and inventory regressions                                                                       |
| Menus and buttons        | `app/modules/system/menu_seed.py`, synchronization and explicit role grants                                                    |
| Hosted tenant capability | `app/modules/system/hosted_menu_seed.py`, target tenant menu synchronization and grants                                        |
| AI tools and assistant   | Tool import inventory, assistant seed, prompts and result authorization; see [Connect business tools](../development/ai-tools) |

Update migration-chain, tenant-inventory and AI-inventory tests with the module, preserving historical regressions and existing assertions. Place backend tests under matching directories such as `tests/modules/<module>/`. New time columns use UTC and timezone-aware types; see [Backend architecture](./introduction) for schema, API and authorization contracts.

## Web module

```text
hohu-admin-web/src/
├── views/notes/index.vue
├── service/api/notes.ts
├── typings/api/notes.d.ts
└── locales/notes.ts
```

Put pages in `views/<module>/`, HTTP wrappers in `service/api/` with exports from `service/api/index.ts` following project conventions, and business types in the `Api.<Module>` namespace under `typings/api/`. Complex pages can add a local `modules/` directory; shared state belongs in `store/modules/` when needed.

Merge example locale resources into active locale files and `App.I18n.Schema`; a new file alone is not loaded. Implement single-language business requirements without changing framework internationalization.

While the dev server runs, Elegant Router generates routes and types from `views/`. Do not edit generated files or assume `pnpm gen-route` is a non-interactive refresh command; the target version may use it for interactive page scaffolding.

Follow [Add a module](../development/module), then [Connect business tools](../development/ai-tools), for the complete workflow.
