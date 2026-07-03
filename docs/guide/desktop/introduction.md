---
title: Desktop Introduction
description: hohu-admin-desktop is the Electron + Vue 3 desktop app framework of the hohu ecosystem, focused on what the web cannot do — tray, global shortcuts, system notifications, auto-update, OS keychain
---

# Desktop Introduction

### The desktop member of the hohu ecosystem

**hohu-admin-desktop** is the Electron + Vue 3 desktop application framework of the [hohu ecosystem](https://github.com/aihohu). It shares the same [FastAPI backend](https://github.com/aihohu/hohu-admin) with [hohu-admin-web](https://github.com/aihohu/hohu-admin-web) (browser) and [hohu-admin-app](https://github.com/aihohu/hohu-admin-app) (mobile).

**Positioning:** a developer scaffold, not an end-user product. Developers clone it to build their own desktop apps with full hohu-admin backend integration.

## 🎯 Why a desktop app

The desktop client **focuses on what the web cannot do or does poorly**:

- 🖥️ **System tray + close-to-tray** — background resident, right-click menu for quick actions
- ⌨️ **Global shortcuts** — `Cmd/Ctrl+Shift+H` summons the window from anywhere, no browser switching
- 🔔 **System notifications** — true OS-level notifications (the web Notification API is restricted); visible even when minimized
- 🔄 **Auto-update** — silent checks, background download, install-on-quit via electron-updater
- 🔐 **OS keychain storage** — tokens live in Keychain (macOS) / DPAPI (Windows) / libsecret (Linux), never in localStorage
- 🌐 **Bypasses CORS** — HTTP requests are forwarded via the main process's `net` module; no backend CORS config needed even in dev

**What it does NOT do:** duplicate all web admin pages, build dashboards, or CRUD tables — the web does these better; rebuilding them on desktop is a waste.

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Shell | Electron 39 / electron-vite 5 |
| Renderer | Vue 3.5 / TypeScript 5.9 / NaiveUI / Pinia 3 / Vite 7 |
| Packaging | electron-builder (NSIS / DMG / AppImage) |
| Main-process libs | electron-store / electron-log / electron-updater |
| Type contracts | `src/shared/types.ts` — shared across main / preload / renderer |

## 📦 Three-Process Layout

```
src/
├── main/         # Main process (Node.js runtime)
│   ├── services/ # Singleton services (window/tray/shortcut/updater/notification/...)
│   └── ipc/      # ipcMain.handle registrations (typed)
├── preload/      # Preload script (sandboxed bridge)
└── renderer/     # Renderer process (browser env, reuses hohu-admin-web's patterns)
└── shared/       # Cross-process type definitions
```

Key constraints:

- **All HTTP goes through the main process** (renderer never calls axios directly; uses `window.api.http.request()` → IPC → main `net.request`)
- **All tokens go to the OS keychain** (never localStorage)
- **Typed IPC** (`shared/types.ts` is the single source; preload exposes a whitelist via `contextBridge`)

## 📚 Learn More

- [Quick Start](./quick-start) — running in 5 minutes
- [Architecture](./architecture) — three processes, request layer, IPC, security
- [Features](./features) — Phase 1 + Phase 2 inventory
- [Source Repository](https://github.com/aihohu/hohu-admin-desktop)
