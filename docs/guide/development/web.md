---
title: Web pages and requests
description: Add Vue 3 pages and typed requests to HoHu, with routes, menus, permissions, pagination state, and translations.
---

# Web pages and requests

The Web project uses Vue 3, TypeScript, Naive UI, UnoCSS, and Pinia. Use the Composition API and `<script setup lang="ts">` for new pages. This page explains integration order; the [business notes tutorial](./module) includes complete page and request source.

## File reference

All paths below are relative to the Web project’s `src/`. Business types use the `Api.<Module>` namespace.

| File                        | Purpose                                   |
| --------------------------- | ----------------------------------------- |
| `typings/api/<module>.d.ts` | Request and response types; string IDs    |
| `service/api/<module>.ts`   | Shared request client wrappers            |
| `service/api/index.ts`      | Request exports                           |
| `views/<module>/index.vue`  | Page and interaction state                |
| `views/<module>/modules/`   | Page-specific components                  |
| `locales/langs/*.ts`        | Chinese and English UI and menu resources |
| `typings/app.d.ts`          | Translation schema types                  |

Keep local state in components or business composables. Use Pinia for state that needs shared ownership across pages. Child components receive data through props and emit changes instead of mutating parent data.

## 1. Connect requests

This is the notes request file. Add the `Api.Notes` types and backend from the tutorial before using these functions.

<<< ../../../examples/notes/notes.ts

The shared client handles the service address, authentication headers, token refresh, response unwrapping, and error messages. Calls return `{ data, error }`. On success, `data` is already the inner backend payload; do not access `data.data` again. Check error before updating lists or closing forms so failed submissions preserve input.

Do not add separate token storage or refresh logic to business pages. Use camelCase parameters and string IDs. Use the existing file API for uploads.

## 2. Connect pages, routes, and menus

1. Create `src/views/<module>/index.vue` and run `pnpm dev`.
2. `@elegant-router` generates routes and their types. Check the development log; there is no need to run `pnpm gen-route` manually.
3. Add the page, component mapping, and button permissions to backend menu seeds, then run `uv run python -m scripts.sync_menus`.
4. Grant the test role page and action access, then sign in again to check menus and buttons.

Route generation does not create backend menus or grant permissions. The notes menu uses `layout.base$view.notes`. Other pages must use their actual generated route names.

## 3. Handle page states

| State                       | Behavior                                                              |
| --------------------------- | --------------------------------------------------------------------- |
| Initial load or page change | Show loading and keep query parameters synchronized                   |
| Concurrent list requests    | Use a request sequence or cancellation to prevent stale results       |
| No records                  | Show an empty state; do not present request failures as an empty list |
| Saving                      | Prevent duplicate submissions and preserve input on failure           |
| Creation succeeds           | Show success and reload; the notes example returns to page one        |
| Permissions change          | Render current access and keep backend checks on every operation      |

Reuse the loading, request sequence, and form patterns in the [notes page](./module). See [pagination](../page) and [upload integration](../file-upload) for related components.

## Development mode and service address

`pnpm dev` runs `vite --mode test`, using `.env` and `.env.test`. Put uncommitted local overrides in `.env.test.local`. Restart the development server after changing environment configuration.

```dotenv
VITE_SERVICE_BASE_URL=http://127.0.0.1:8000
VITE_HTTP_PROXY=Y
```

With the development proxy enabled, browser requests to `/proxy-default` are forwarded by Vite. Production `pnpm build` uses `prod` mode; check `.env.prod` and the deployment reverse proxy. All `VITE_*` values enter the client build, so never put database passwords or server secrets there.

Finish with the type, test, and build checks in [debugging and validation](./testing).
