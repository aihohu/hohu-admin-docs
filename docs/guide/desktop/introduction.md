---
title: Desktop overview
description: Explore the HoHu Electron desktop client, including its Vue interface, main-process authentication, tray, shortcuts, notifications, and updates.
---

# Desktop overview

HoHu Desktop is a separate Electron + Vue 3 client repository that uses backend APIs. It supports applications needing a system tray, global shortcuts, desktop notifications, and installer distribution.

## Technology and responsibilities

| Part                  | Current implementation                                                             |
| --------------------- | ---------------------------------------------------------------------------------- |
| Interface             | Vue 3, TypeScript, Naive UI, Pinia, Vue Router                                     |
| Main process          | Electron manages windows, authentication sessions, networking, and native features |
| Bridge                | contextBridge exposes typed window.api methods through restricted IPC              |
| Development and build | electron-vite                                                                      |
| Packaging and updates | electron-builder and electron-updater                                              |

Use the desktop repository's `package.json` and lockfile for exact versions. Current scripts use electron-vite and electron-builder.

## Available capabilities

- Main-process authentication sessions, with renderer business requests targeting a fixed backend.
- Saved window state, tray behavior, global shortcuts, system notifications, and native theme synchronization.
- A settings drawer for tray, shortcuts, notifications, updates, and application information.
- Installer and update integration; releases still require update-source configuration, signing, and platform validation.

Desktop and Web are separate repositories. Reusing backend APIs and business types still requires desktop page, route, permission, and translation integration. New Web pages do not automatically enter desktop installers.

## Get started

1. Follow [desktop development](./quick-start) to run the client against a local backend.
2. Read [desktop architecture](./architecture) for renderer, preload, and main-process boundaries.
3. Integrate native capabilities through [desktop features](./features), then verify packaged behavior.

To prepare the backend first, see [environment setup](../quick-start). Repository links are in [source and licensing](../src).
