---
title: Debugging and validation
description: Diagnose HoHu request, permission, migration, and build issues, and validate transactions, tenant isolation, and page behavior.
---

# Debugging and validation

Verify the backend API before debugging the page. Use dedicated development databases, Redis, and test accounts. Test commands do not automatically isolate every external resource; prepare the environment described by the target repository.

## Command reference

Run commands in the specified component directory. Start with relevant tests, then complete the repository's required checks before delivery.

| Directory | Command                                          | Purpose                                                    |
| --------- | ------------------------------------------------ | ---------------------------------------------------------- |
| Backend   | `uv run ruff check .`                            | Python lint checks                                         |
| Backend   | `uv run ruff format --check .`                   | Check formatting without modifying files                   |
| Backend   | `uv run pytest`                                  | Backend tests; verify test resources and fixtures first    |
| Backend   | `uv run alembic current`, `uv run alembic heads` | Compare database and source migration versions             |
| Web       | `pnpm lint`                                      | Lint with some automatic fixes; review the diff afterwards |
| Web       | `pnpm typecheck`                                 | Vue and TypeScript checks                                  |
| Web       | `pnpm test`                                      | Vitest tests                                               |
| Web       | `pnpm build`                                     | Production-mode build                                      |
| Desktop   | `pnpm typecheck`, `pnpm test`, `pnpm build`      | Types, main-process service tests, and build               |

Keep temporary logs, screenshots, and test output in local `.local/` directories outside product commits. Use pytest `--basetemp` for a dedicated temporary directory; pytest clears that directory, so use an empty location reserved for the test run.

## Diagnose requests in order

1. Inspect the path, method, HTTP status, and response in browser Network tools.
2. Check the user, permissions, and target tenant. Reproduce the same request in `/docs`; do not include tokens in logs or issue reports.
3. Check backend logs for route execution, service errors, and missing migrations.
4. Once the API is correct, inspect frontend types, response unwrapping, state updates, and translations.

| Symptom                                               | Check first                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Web loads, but requests fail to connect or return 502 | Backend process, port, `.env.test.local` / `.env.test`, and Vite proxy               |
| 404                                                   | Router registration in `app/main.py`, prefix, and request path                       |
| 401                                                   | Sign-in state, refresh, and target service; do not bypass authentication in the page |
| 403                                                   | Permission code, enabled roles, tenant ownership, and record scope                   |
| 422                                                   | Fields, types, lengths, and extra input; read validation details                     |
| Missing menu                                          | Menu synchronization, role grants, and refreshed login permissions                   |
| Menu exists but page fails                            | Generated routes, file path, and menu component mapping                              |
| API succeeds but page data is empty                   | `request` already unwraps data; do not access data.data again                        |
| Missing table or column                               | Alembic version, model imports, and database connection                              |
| Translation keys appear as text                       | Resource nesting and `App.I18n.Schema`                                               |

## Minimum module validation

| Area                    | Verify                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Normal use              | Creation, refresh, pagination, and empty states                                           |
| Input                   | Empty values, length limits, invalid IDs, and extra tenantId fields                       |
| Permissions             | Direct API calls are rejected for ordinary roles without access                           |
| Tenant and record scope | Lists, counts, details, and writes share the same boundary                                |
| Transactions            | Rolling back after a service call leaves no persisted record; failures never show success |
| Migrations              | Upgrade and downgrade in a dedicated database; retain existing migration regressions      |
| Pages                   | Duplicate submission, rapid paging, retry, mobile, and light/dark themes                  |
| Localization            | Both languages for buttons, menus, validation, errors, and empty states                   |

For AI tools, also verify revoked permissions, expired confirmations, duplicate execution, and historical result access. See [business tool integration](./ai-tools).

## Tutorial test coverage

The documentation repository's `tests/test_notes*.py` exercises example service behavior using in-memory SQLite. Follow the [notes tutorial](./module) to run it. These tests do not replace PostgreSQL migration, HTTP authentication, browser, or production-build validation in the target project.

Deliver source, migrations, menus, translations, and related tests together. See [upgrade, backup, and recovery](../operations/upgrade) for release procedures.
