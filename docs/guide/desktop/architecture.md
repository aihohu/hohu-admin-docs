---
title: Desktop Architecture
description: Three-process model, request layer, typed IPC, token storage, and the full security model
---

# Architecture

## 🏗️ Three-Process Model

```
┌─────────────────────────────────────────────────┐
│  Main Process (main/)                           │
│  - Node.js runtime                              │
│  - Service singletons: WindowManager /          │
│    TrayManager / ShortcutManager /              │
│    UpdaterManager / NotificationManager         │
│  - HTTP forwarding (net module)                 │
│  - Encrypted storage (safeStorage)              │
└──────────────┬──────────────────────────────────┘
               │ ipcMain.handle / webContents.send
               │
┌──────────────┴──────────────────────────────────┐
│  Preload (preload/)                             │
│  - contextBridge.exposeInMainWorld('api', ...) │
│  - Whitelisted methods, typed                   │
│  - Sandboxed (contextIsolation: true)          │
└──────────────┬──────────────────────────────────┘
               │ window.api.*
               │
┌──────────────┴──────────────────────────────────┐
│  Renderer (renderer/)                           │
│  - Browser environment (Vue 3 + NaiveUI + Pinia)│
│  - Can only reach main via window.api           │
│  - No Node API (contextIsolation)              │
└─────────────────────────────────────────────────┘
```

`src/shared/types.ts` is the single source of type contracts shared by all three processes.

## 🌐 Request Layer: All HTTP Through the Main Process

**Why not just use axios in the renderer?**

- Browser CORS will drive you crazy in dev (and electron-vite's `server.proxy` is [broken](https://github.com/alex8088/electron-vite/issues/631))
- The main process's `net` module is Electron-native and **not subject to CORS**
- Centralized logging, unified auth headers, unified error handling

**Call chain:**

```
renderer               preload                  main
fetchXxx()  ──→  window.api.http.request(cfg)  ──→  net.request()
                                                       │
                  { data, error }   ←────────────────  │
                                                       ↓
                                                    Backend API
```

The renderer uses a flat result shape:

```ts
const { data, error } = await fetchUserInfo();
if (error) {
  // handle error
} else {
  // use data
}
```

No try/catch needed — errors are return values, not exceptions. Token expiry triggers single-flight refresh + one retry.

See [`src/main/services/http.ts`](https://github.com/aihohu/hohu-admin-desktop/blob/main/src/main/services/http.ts) and the renderer's [`service/request/factory.ts`](https://github.com/aihohu/hohu-admin-desktop/blob/main/src/renderer/src/service/request/factory.ts).

## 🔐 Token Storage & Keychain {#token-storage-keychain}

**Tokens never enter localStorage.**

- Encrypted via Electron's `safeStorage`: backed by macOS Keychain / Windows DPAPI / Linux libsecret
- File-backed at `userData/secure-store.json` (mode 0600)
- Renderer accesses via `window.api.secureStore.get/set/delete/clear` (IPC)

```ts
// Renderer usage
await window.api.secureStore.set('token', authToken);
const token = await window.api.secureStore.get('token');
```

Logout calls `clear()` and the file is emptied. Token refresh is centralized in `service/request/index.ts`: expired-token codes trigger single-flight refresh, concurrent requests share one refresh Promise, retry once.

## 📡 Typed IPC Bridge

**Single source of types:** all cross-process types live in `src/shared/types.ts`. All three processes import via the `@shared/types` alias.

**Whitelisted exposure:** preload uses `contextBridge.exposeInMainWorld('api', api)`. The fields on `api` are **the complete set of IPC calls the renderer is allowed to make**. **Never expose `ipcRenderer` directly.**

**Fixed workflow for adding a channel:**

1. Define an interface in `src/shared/types.ts` and extend `AppApi`
2. Register with `ipcMain.handle` in `src/main/ipc/<name>.ts`
3. Call it once in `src/main/ipc/index.ts`'s `registerAllIpc()`
4. Add an `as const` bridge object to `src/preload/index.ts` and include it in `api`

See [Quick Start — Your First IPC Channel](./quick-start#_5-your-first-ipc-channel-hello-world).

## 🛡️ Security Model

| Layer                | Configuration                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **contextIsolation** | `true` (default) — isolates preload from renderer                                                                          |
| **nodeIntegration**  | `false` (default) — renderer has no Node API                                                                               |
| **sandbox**          | `false` (current) — preload can use Node API                                                                               |
| **CSP**              | configured in `src/renderer/index.html` — adding new origins (CDN / WebSocket) requires updating `connect-src` / `img-src` |
| **External links**   | go through `shell.openExternal`; protocol whitelist optional                                                               |
| **DevTools**         | F12 toggle in dev; auto-disabled in prod                                                                                   |

## 📁 Path Aliases

| Alias           | Resolves to                       | Used by             |
| --------------- | --------------------------------- | ------------------- |
| `@renderer/*`   | `src/renderer/src/*`              | renderer            |
| `@shared/*`     | `src/shared/*`                    | all three processes |
| `@main/*`       | `src/main/*`                      | main                |
| `@resources/*`  | `resources/*`                     | main, renderer      |
| `@iconify-json` | `node_modules/@iconify/json/json` | renderer            |

Configured in `tsconfig.{node,web}.json` and `electron.vite.config.ts`.

## 📚 More

- [Features](./features) — what each manager actually does
- [CLAUDE.md — Common Pitfalls](https://github.com/aihohu/hohu-admin-desktop/blob/main/CLAUDE.md) — required reading; pitfall reference
- [framework-design.md](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/framework-design.md) — full design document
