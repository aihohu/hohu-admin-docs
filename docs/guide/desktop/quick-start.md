---
title: Desktop Quick Start
description: From clone to running in 5 minutes, including development, packaging, and adding your first IPC channel
---

# Quick Start

## 1. Requirements

- **Node.js** ≥ 20.19
- **pnpm** ≥ 10.5
- Any desktop OS (macOS / Windows / Linux)

## 2. Clone & Install

```bash
git clone https://github.com/aihohu/hohu-admin-desktop.git
cd hohu-admin-desktop
pnpm install
```

## 3. Start Dev Mode

```bash
pnpm dev
```

After launch:

- The main Electron window opens (default 1280×800)
- Renderer runs at `http://localhost:5173` (internal Vite dev server)
- **Main-process changes require restarting dev** (HMR only covers the renderer)

> On macOS, the first launch prompts for notification permission. Allow it to enable system notifications.

## 4. Configure Backend URL

Edit `.env.development`:

```bash
RENDERER_VITE_SERVICE_BASE_URL=http://127.0.0.1:8000
```

In dev mode, renderer requests are forwarded through the main process's `net` module to this URL — **completely bypassing CORS**. The backend doesn't need to configure CORS for the frontend.

## 5. Your First IPC Channel (Hello World)

The desktop pattern in one sentence: **renderers call main-process capabilities only through typed IPC**. Here's how to add a `greet` channel.

### 5.1 Define the type

Edit `src/shared/types.ts` and extend `AppApi` with a new interface:

```ts
export interface GreetApi {
  greet: (name: string) => Promise<string>;
}

export interface AppApi {
  // ... existing fields
  greet: GreetApi;
}
```

### 5.2 Register the main-process handler

Create `src/main/ipc/greet.ts`:

```ts
import { ipcMain } from 'electron';

export function registerGreetIpc(): void {
  ipcMain.handle('greet', async (_e, name: string) => {
    return `Hello, ${name}!`;
  });
}
```

Call it once in `src/main/ipc/index.ts`'s `registerAllIpc()`:

```ts
registerGreetIpc();
```

### 5.3 Expose via preload

Edit `src/preload/index.ts`, add a bridge object and include it in `api`:

```ts
const greet = {
  greet: (name: string): Promise<string> => ipcRenderer.invoke('greet', name)
} as const;

const api = {
  // ... existing fields
  greet
};
```

### 5.4 Call from renderer

Anywhere in `.vue` / `.ts`:

```ts
const msg = await window.api.greet.greet('World');
console.log(msg); // "Hello, World!"
```

Full type inference chain: parameters and return value of `window.api.greet.greet` are strictly checked by TypeScript — wrong types at the call site go red immediately.

## 6. Build

```bash
pnpm build:mac    # produces .dmg
pnpm build:win    # produces .exe (NSIS installer)
pnpm build:linux  # produces .AppImage / .deb / .snap
```

Artifacts land in `release/`.

**First macOS build may prompt for keychain password** — electron-builder looks up signing certificates by default. For local testing without signing, enter your password to proceed; for distribution you'll need an Apple Developer ID.

## 7. Next Steps

- [Architecture](./architecture) — understand the three processes, request layer, token storage
- [Features](./features) — built-in desktop capabilities
- [CLAUDE.md](https://github.com/aihohu/hohu-admin-desktop/blob/main/CLAUDE.md) — in-repo dev guide and pitfalls
