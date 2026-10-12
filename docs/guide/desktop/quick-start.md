---
title: Desktop development
description: Run the HoHu Electron client, configure MAIN_VITE_BACKEND_ORIGIN, check types and services, and prepare desktop packages.
---

# Desktop development

Prepare an accessible HoHu backend and a valid account. The desktop repository requires Node.js >= 20.19 and pnpm >= 10.5. You can align with Web development on Node.js 22.12 or a newer compatible version; check current dependency engines.

## 1. Get the source

```bash
git clone https://github.com/aihohu/hohu-admin-desktop.git
cd hohu-admin-desktop
pnpm install
```

Run subsequent commands in this directory. See [environment setup](../quick-start) for the backend.

## 2. Select the backend

Configure the main-process origin in the desktop project's `.env.development`:

```dotenv
MAIN_VITE_BACKEND_ORIGIN=http://127.0.0.1:8000
```

This is an origin: scheme, host, and optional port only, without an `/api` path, query, or credentials. Development allows HTTP on localhost / 127.0.0.1. Production requires HTTPS.

Restart after changes. Main-process code now owns authentication and requests; legacy `RENDERER_VITE_SERVICE_BASE_URL` does not select the authentication backend. Set your HTTPS origin in `.env.production` for releases instead of relying on the framework default.

## 3. Run and check

```bash
pnpm dev
```

Sign in with an existing backend account and check user information, menus, and sign-out. The desktop app does not initialize the backend administrator password.

| Command             | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| `pnpm dev`          | Start electron-vite development mode                   |
| `pnpm typecheck`    | Check main-process and Vue types                       |
| `pnpm test`         | Run main-process service tests                         |
| `pnpm lint`         | ESLint checks                                          |
| `pnpm fmt`          | Check formatting                                       |
| `pnpm build`        | Check types and build into out                         |
| `pnpm start`        | Preview the built application; run build first         |
| `pnpm build:unpack` | Produce an unpacked application for local verification |

## 4. Prepare installers

| Platform | Command                                                       |
| -------- | ------------------------------------------------------------- |
| Windows  | `pnpm build:win`                                              |
| macOS    | `pnpm build:mac`                                              |
| Linux    | `pnpm build:linux`; currently configured for AppImage and deb |

Platform scripts run `gen-publish` before packaging with generated `build/electron-builder.yml`. Update-source settings come from the project-root `.env` or process environment:

| Distribution | Settings                                         |
| ------------ | ------------------------------------------------ |
| GitHub       | `UPDATER_PROVIDER=github`, `GH_OWNER`, `GH_REPO` |
| Hosted files | `UPDATER_PROVIDER=generic`, `UPDATER_URL`        |

Point these settings to a distribution source you maintain. Check build output for artifact locations. Use build:unpack for local verification, then configure application identity, icons, signing, and updates for releases. The current macOS configuration disables notarization; a development package is not a notarized release.

Publish installers, update metadata, and update-source files together. Verify installation, sign-in, sign-out, and upgrades on target operating systems. See [desktop features](./features) for integration.

## Troubleshooting

| Symptom                                         | Check                                                                                         |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Backend origin rejected                         | MAIN_VITE_BACKEND_ORIGIN, absence of paths, and HTTPS in production                           |
| Absolute request URL fails                      | Use backend paths such as `/business/...`; see [architecture](./architecture)                 |
| Session does not persist                        | Main-process logs, safeStorage availability, and userData write access                        |
| Platform build reports missing publish settings | Configure an update source, or use build:unpack for local verification                        |
| No update check in development                  | Development update configuration may be a placeholder; test a real source with a packaged app |
