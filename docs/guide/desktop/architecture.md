---
title: Desktop architecture
description: Understand HoHu desktop main, preload, and renderer layers, main-process sessions, restricted requests, and trusted IPC extensions.
---

# Desktop architecture

Desktop has main, preload, and renderer layers, with shared types in `src/shared/types.ts`. Business pages do not directly import Node.js or Electron modules.

## Directories and request flow

| Directory             | Responsibility                                                  |
| --------------------- | --------------------------------------------------------------- |
| `src/main/services/`  | Windows, sessions, networking, storage, and native capabilities |
| `src/main/ipc/`       | Validate caller and inputs, then call main-process services     |
| `src/preload/`        | Expose a limited window.api through contextBridge               |
| `src/renderer/src/`   | Vue pages, routes, state, and business requests                 |
| `src/shared/types.ts` | Bridge types shared by main and renderer                        |

Requests flow from Vue → shared request client → `window.api.auth.request` → IPC → main-process session/network service → configured backend.

The main window enables `sandbox` and `contextIsolation`, and disables `nodeIntegration` and `webviewTag`. Preload builds as sandbox-compatible CJS. Window creation and navigation are restricted; keep these boundaries when extending business functionality.

## Authentication and requests

| Bridge method            | Purpose                                                                           |
| ------------------------ | --------------------------------------------------------------------------------- |
| `auth.login(input)`      | Sign in with userName, password, and optional tenantCode; returns success/message |
| `auth.getSessionState()` | Return authenticated state without tokens                                         |
| `auth.request(config)`   | Access the fixed backend through the main-process session                         |
| `auth.logout()`          | Clear the local session and attempt remote sign-out                               |

Access and refresh tokens remain in the main process and use safeStorage. Main-process refresh handling combines concurrent requests. The renderer neither reads credentials nor sets Authorization. `window.api.http` and `window.api.secureStore` are no longer exposed.

Pages use the shared client in `src/renderer/src/service/request/`, with API paths such as `/business/notes`. The underlying auth.request returns an HTTP response; the business client unwraps `{code, msg, data}` into `{data, error}`. Direct bridge calls can reject, so handle failures according to the interface used.

The main process allows paths under its configured origin and rejects absolute URLs, redirects, and escaping paths. Authentication-only endpoints belong to the session service. Forwarded headers, methods, body sizes, and timeouts are restricted. Change services through `MAIN_VITE_BACKEND_ORIGIN`, not arbitrary renderer-supplied addresses.

## Add an IPC capability

For a read-only greet example, add this member to the existing `AppApi` in `src/shared/types.ts`:

```typescript
greet: (name: string) => Promise<string>;
```

Create `src/main/ipc/greet.ts`, reusing trusted-caller checks and validating runtime input:

```typescript
import { trustedHandle } from './security';

export function registerGreetIpc(): void {
  trustedHandle('greet', (_event, name: unknown) => {
    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 80) {
      throw new Error('Invalid name');
    }
    return `Hello, ${name.trim()}`;
  });
}
```

Import it in `src/main/ipc/index.ts` and call `registerGreetIpc()` inside the existing `registerAllIpc()`. Add this member to the existing api object in `src/preload/index.ts`:

```typescript
greet: (name: string) => ipcRenderer.invoke('greet', name);
```

The renderer can now call `await window.api.greet('HoHu')`. `trustedHandle` checks the main window's trusted top-level page. TypeScript does not replace runtime validation. Do not expose arbitrary-channel invoke or register ipcMain.handle without caller validation.

New filesystem, system, or network capabilities also need explicit path, operation, and target restrictions, with main-process tests for invalid inputs. Event subscriptions should return an unsubscribe function and be released when Vue components unmount.
