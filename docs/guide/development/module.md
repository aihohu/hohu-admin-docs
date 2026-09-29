---
title: Add a business module
description: Build a minimal business notes module with SQLAlchemy models, tenant isolation, FastAPI endpoints, menu permissions and typed Web requests.
---

# Add a business module

Add business notes to an existing HoHu project, supporting creation and paginated reading. Complete the [development setup](../quick-start) first. This is a source extension, not a standalone plugin installation protocol.

## Separate project and file placement

For a first run, follow [development setup](../quick-start): use `hohu create notes-tutorial` with Backend and Frontend, then `hohu init` and `hohu dev`, and complete the first sign-in. Use a dedicated database and separate Redis instance. Do not reuse an existing application's `.env`, keys or database. Running projects concurrently also requires separate ports and matching frontend proxy settings, not just a different browser URL. Backend and Web directories below mean `hohu-admin/` and `hohu-admin-web/` inside this new project.

The documentation repository's `examples/notes/` contains source files, not a runnable application directory. Copy Python files into backend `app/modules/notes/`; place `notes.ts`, `index.vue` and `locales.ts` at the Web paths specified below. Integrate `ai_tools.py` and `projection.py` in the next tutorial. Do not copy the whole examples directory into the backend.

## 1. Define the scope

Users with read permission can see all notes in their tenant. Creation requires a separate permission. Private notes, department scopes, editing, deletion and AI tool integration are outside this example; add their permission rules and regression tests before implementing them.

| Item              | Contract                                              |
| ----------------- | ----------------------------------------------------- |
| Table             | `biz_note`                                            |
| Endpoints         | `GET /business/notes`, `POST /business/notes`         |
| Read permission   | `business:note:list`                                  |
| Create permission | `business:note:add`                                   |
| Web page          | `src/views/notes/index.vue`                           |
| Tenant authority  | Authenticated `TenantContext`, never the request body |

## 2. Define the model and schemas

Create `app/modules/notes/` in the backend with an empty `__init__.py` and the files below. The documentation repository also contains them in `examples/notes/`.

**models.py**

<<< ../../../examples/notes/models.py

The composite index supports pagination by ID within a tenant. The foreign key requires an existing tenant. Future customer or order relationships must also enforce same-tenant ownership.

**schemas.py**

<<< ../../../examples/notes/schemas.py

Creation rejects undeclared fields such as `tenantId`. Output uses a string `noteId` to preserve Snowflake precision. A note title is user content and is not translated when the interface language changes.

## 3. Implement the service and endpoints

**service.py**

<<< ../../../examples/notes/service.py

Records and count use the same tenant scope. The service flushes without committing and orders explicitly by ID. SQL is expanded here to explain the scope; general modules can also reuse the [pagination helper](../page).

**api.py**

<<< ../../../examples/notes/api.py

The API authenticates requests, checks functional permissions, obtains trusted tenant context and commits successful creation. Hiding a button does not replace API authorization. Keep domain failures within the established response contract.

## 4. Register endpoints and create a migration

At the router registration location in `app/main.py`, add:

```python
from app.modules.notes.api import router as notes_router

app.include_router(notes_router)
```

Add `from app.modules.notes.models import Note` to the model imports in `alembic/env.py` so the model enters the existing Base.metadata. From the backend directory, run:

```bash
uv run alembic revision --autogenerate -m "add business notes"
```

Review the migration for only the intended `biz_note` table, foreign key and index. Unexpected table deletions usually require checking missing model imports before proceeding. Apply the reviewed migration to your development database:

```bash
uv run alembic upgrade head
```

Restart the backend. `/docs` should show the Notes group with both endpoints. Do not replace migrations with startup calls to `Base.metadata.create_all()`.

## 5. Connect the complete Web page, translations and menus

Web paths below are relative to `hohu-admin-web/`. Wire translations before type checking; otherwise the new `$t` keys will fail type checking.

### Requests and page

Save the request file as `src/service/api/notes.ts`:

<<< ../../../examples/notes/notes.ts

Create `src/views/notes/index.vue`:

<<< ../../../examples/notes/index.vue

The page includes creation, title validation, saving state, refresh, pagination and button authorization. It preserves input on failure and returns to page one after success. Request versions prevent older responses from replacing newer page results. Server authorization and tenant scoping remain authoritative.

### Translations and types

Save the shared resources as `src/locales/notes.ts`. They include page, menu, assistant and error text used by both tutorials:

<<< ../../../examples/notes/locales.ts

Import `import { notesZh as notesMessages } from '../notes';` in `src/locales/langs/zh-cn.ts`, and `import { notesEn as notesMessages } from '../notes';` in `en-us.ts`. Apply these additions at the specified locations in both files, preserving existing entries rather than replacing the entire language file:

```typescript
// Inside the existing const local: App.I18n.Schema = { ... }:
notes: notesMessages.notes,
// Replace the existing shorthand builtin, with:
builtin: {
  ...builtin,
  permission: { ...builtin.permission, ...notesMessages.permission },
  agent: { ...builtin.agent, ...notesMessages.agent }
},
// Inside the existing route object:
...notesMessages.route,
// Inside the root errorCode object, not similarly named objects under page:
...notesMessages.errorCode,
// Inside the existing ai.tool object:
...notesMessages.tool,
// page.ai.chat:
...notesMessages.chat,
```

Extend `App.I18n.Schema` in `src/typings/app.d.ts` in three places:

```typescript
// At the Schema root, alongside settings and builtin:
notes: typeof import('../locales/notes').notesEn.notes;
// Inside Schema.ai.tool, alongside field and user:
note: typeof import('../locales/notes').notesEn.tool.note;
// Inside Schema.errorCode:
NOTE_TITLE_INVALID: string;
NOTE_APPROVAL_REQUIRED: string;
// Schema.page.ai.chat:
confirmNoteCreate: string;
```

`route` already accepts string keys; `builtin.permission` and `builtin.agent` use Record types. They need no additional hardcoded types. Do not edit generated router types: the dev server generates the `notes` route from the page.

### Complete menu seed

Save this file as backend `app/modules/notes/menu_seed.py`:

<<< ../../../examples/notes/menu_seed.py

Import `from app.modules.notes.menu_seed import NOTE_MENUS` in `app/modules/system/menu_seed.py`. After the complete `MENU_DEFINITIONS = [...]` list, add this line once:

```python
MENU_DEFINITIONS.extend(NOTE_MENUS)
```

Synchronization derives `builtin.permission.business_note_list` and `builtin.permission.business_note_add` for the buttons. Both translations are included above.

Run `uv run python -m scripts.sync_menus` in the backend. Run `hohu dev` at the project root, wait for frontend route generation, then run `pnpm typecheck` in the Web directory. Verify the Notes group in backend `/docs` and the generated `/notes` route before assigning access.

### Create a verification role

With the development administrator, open Permission management → Role management. Create a dedicated test role and grant the Business notes page plus View notes and Create notes. Create an ordinary test user, assign that role, and sign in with a separate browser session. Do not verify only as administrator. The administrator needs existing menu-assignment and user-role-assignment permissions.

Synchronization does not automatically grant access. Sign out and back in to refresh old sessions. Begin in the default tenant; hosted tenants additionally need capability and menu provisioning described in [multi-tenancy](../operations/tenants). A missing menu in another tenant is not evidence that data isolation works.

## 6. Verify the workflow

First run `uv run ruff check app/modules/notes` in the new backend and `pnpm typecheck` in Web. Then use the ordinary test user to complete the checks below and record actual results; compilation alone is not acceptance.

Authorize `/docs` with a development account access token and POST `{"title":"First note"}`. Expect `code: 200` with a string `data.noteId`. GET returns `records`, `total`, `current` and `size`.

| Check                                   | Expected result                                             |
| --------------------------------------- | ----------------------------------------------------------- |
| Refresh after creation                  | The new title appears                                       |
| Submit an empty title or tenantId       | Input validation rejects it                                 |
| Ordinary role without create permission | POST is rejected, including direct requests                 |
| Switch to a different tenant            | Neither records nor count includes the first tenant's notes |
| Roll back after service execution       | The new record is not persisted                             |

The documentation repository includes `tests/test_notes_example.py`, an in-memory SQLite check for record/count isolation, pagination, input validation, ID serialization and rollback. It does not replace PostgreSQL migration, HTTP authentication or browser tests. Run it with the backend virtualenv after setting `HOHU_BACKEND_PATH` to the backend checkout; it does not connect to the business database.

Version the migration, module, menus, Web page and translations together. Production releases follow the existing CLI workflow; example tests and demo data do not belong in initialization scripts.

## Files present when finished

| Location                     | Added or updated                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| Backend `app/modules/notes/` | `__init__.py`, `models.py`, `schemas.py`, `service.py`, `api.py`, `menu_seed.py`    |
| Backend registration         | `app/main.py`, `alembic/env.py`, `app/modules/system/menu_seed.py`                  |
| Database                     | The generated and reviewed migration under `alembic/versions/`                      |
| Web                          | `src/service/api/notes.ts`, `src/views/notes/index.vue`, `src/locales/notes.ts`     |
| Web wiring                   | Both `src/locales/langs/*.ts` files, `src/typings/app.d.ts`, generated router files |

If a menu appears but the page fails to load, check file placement, dev-server route generation and `component: layout.base$view.notes`. Untranslated keys usually mean messages were not merged at the correct level. If saving fails, inspect the response and current role permissions rather than inserting a database row to bypass the endpoint.

## Next: connect AI

Continue with [Connect a business module to AI](./ai-tools) to add queries and confirmed creation. HTTP endpoints and menus do not automatically enter the AI tool catalog.
