---
title: Desktop Features
description: Explore HoHu desktop authentication, routing, storage, windows, updates and notifications, including platform limits.
---

# Features

> For the complete roadmap and design rationale, see the in-repo [`docs/framework-design.md`](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/framework-design.md). This page is a user-facing overview.

## Application foundation

### Request Layer (HTTP through main process)

- All HTTP requests from the renderer go through the main process's `net` module, **bypassing CORS**
- Flat result shape: `{ data, error }` — no try/catch needed
- Token expiry triggers single-flight refresh + one retry
- `X-Request-Id` auto-injected for tracing

### Auth (JWT + Keychain)

- Full login / refreshToken / getUserInfo flow
- Token encrypted via `safeStorage` to `userData/secure-store.json`
- Never enters localStorage
- See [Architecture — Token Storage](./architecture#token-storage-keychain)

### Dynamic Routes + RBAC

- Backend-driven menu (dynamic mode) / frontend-defined (static mode), switchable
- Glob-based component mapping + memory history
- `v-permission` directive, `hasAuth()` function, `TableHeaderOperation` — three layers of button-level permission
- Lazy icon loading (iconify json fetched on demand)

### Layout + Theme + i18n

- Dark mode (synced to `nativeTheme`, affects native title bar / scrollbar)
- Primary color customization
- Chinese / English (zh-cn / en-us)
- Breadcrumb / Sider collapse

---

## Desktop integration

### Logging + Local Storage

- **electron-log**: unified logging across main / preload / renderer, writes to `~/Library/Logs/{appName}/` (macOS)
- **electron-store**: non-sensitive config (window state, shortcuts, tray behavior, notification toggle, etc.) persisted to `userData/config.json`
- ESM transition: project is `"type": "module"`, main outputs ESM

> See [spec-phase2.1](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/spec-phase2.1-logging-store.md)

### Window / Tray / Global Shortcuts

- **WindowManager**: singleton managing the main window; window state (position, size, maximized, fullscreen) persists across restarts
- **TrayManager**: tray icon + right-click menu (Show/Hide / Reload / DevTools / Check for Updates / Quit); close button minimizes to tray instead of quitting
- **ShortcutManager**: global shortcuts (default `Cmd/Ctrl+Shift+H` summons the main window), configurable
- **shortcuts IPC**: renderer reads/updates shortcuts via `window.api.shortcuts.{list, update}`

> See [spec-phase2.2](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/spec-phase2.2-window-tray-shortcut.md)

### Auto-Update

- Wraps **electron-updater v6** as an `UpdaterManager` singleton
- Dual provider: GitHub Releases (default) / Generic (any static URL, requires `latest.yml`)
- **Provider chosen at build time**: `.env` sets `UPDATER_PROVIDER=github|generic`; `scripts/gen-publish-config.mjs` injects it into the build config
- **24h throttle**: background check on startup throttled via `store.updater.lastCheck`; manual entry (tray menu "Check for Updates...") bypasses throttle
- **skipVersion**: user can skip a version; won't be prompted again until a higher version ships
- System notification (fired once on download complete; click focuses main window)
- dev mode reads `dev-app-update.yml`; placeholder URL auto-skipped to avoid log noise

> See [spec-phase2.3](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/spec-phase2.3-auto-update.md)

### Notification Dispatcher

- **NotificationManager singleton**: every `new Notification()` call must go through this — one place for muting, logging, and behavior changes
- **Renderer pushes via IPC**: `window.api.notification.show({ source, category, title, body, actionId? })` lets the renderer fire system notifications (which the web cannot do)
- **Global mute**: reuses `store.notifications.enabled`; turning it off mutes all sources
- **Action hook**: payload's `actionId` is optional; unset = default "focus main window", set = calls the callback registered via `notificationManager.registerAction(id, fn)` in the main process
- **GC retention**: `activeNotifications: Set<Notification>` holds strong references until notifications close, preventing V8 GC from swallowing click handlers
- **Forward-looking source**: `'system' | 'renderer' | 'backend'` — first two today, `BackendNotificationConsumer` to be added once the backend notifications module lands

> See [spec-phase2.4](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/spec-phase2.4-notification-dispatcher.md)

---

## Platform Limitations

| Platform | Auto-Update                                                                                                            | System Notifications                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Windows  | ✅ NSIS, works out of the box                                                                                          | ✅                                                                 |
| macOS    | ⚠️ Requires code signing (Developer ID Application cert). Without it, can detect and download but install is rejected. | ✅                                                                 |
| Linux    | ✅ AppImage (deb / snap don't support auto-update)                                                                     | ⚠️ Requires libnotify; no-op in containers / headless environments |

Notarization is Apple's independent requirement for **first-time distribution** (e.g., a downloaded DMG the first time it runs), unrelated to the auto-update flow. Neither signing nor notarization is configured by default — developers set these up when shipping their own apps.

---

## Scope and limitations

The following are deliberately omitted until there's real demand:

- Notification history / notification center (the OS already has one)
- Per-category mute, dedup, rate-limiting, custom action buttons (Reply / Snooze)
- Renderer-side settings page UI
- Beta channels / pre-release filtering
- AI chat module, AI desktop scenarios (overlay / selection / screenshot)
- Duplicating all web admin pages — wasteful
- Data dashboards, CRUD tables — the web does it better

---

## Engineering

- ✅ ESLint + Prettier (aligned with the web's oxfmt config)
- ✅ TypeScript strict mode + split tsconfig (node / web / shared)
- ✅ Conventional Commits + commitlint + simple-git-hooks
- ✅ GitHub Actions CI (typecheck / lint / fmt, on PR)
- ✅ Release workflow (three-platform build, tag-triggered)
- ✅ Path aliases (`@renderer` / `@shared` / `@main` / `@resources` / `@iconify-json`)
- ✅ `node:test` + tsx for pure-function unit tests
