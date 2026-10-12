---
title: Desktop features
description: Integrate HoHu desktop tray, shortcuts, notifications, themes, updates, and logging, and validate behavior on target platforms.
---

# Desktop features

Desktop capabilities call the main process through `window.api`. Types live in `src/shared/types.ts`; the settings drawer is `src/renderer/src/layouts/modules/settings/SettingsDrawer.vue`.

## Capability reference

| Capability              | Entry point                  | Integration notes                                                          |
| ----------------------- | ---------------------------- | -------------------------------------------------------------------------- |
| Tray                    | api.tray and settings drawer | Configure close-to-tray and verify actual exit behavior                    |
| Global shortcuts        | api.shortcuts                | Read or update shortcuts for predefined actions; registration may conflict |
| System notifications    | api.notification             | title, body, category; respect app settings and OS permissions             |
| Native theme            | api.theme.setNativeSource    | system, light, dark; coordinate with page themes                           |
| External links          | api.shell.openExternal       | HTTPS URLs without embedded credentials only                               |
| Updates                 | api.updater                  | Check, download, install, and subscribe to status                          |
| Logging                 | api.logger.error / warn      | Redacted errors and warnings, not arbitrary console forwarding             |
| Application information | api.app                      | Version and application operations used in settings                        |

## Show a notification

Use this fragment inside an async renderer event handler:

```typescript
await window.api.notification.show({
  title: 'Export completed',
  body: 'Check the export result in the application.',
  category: 'general'
});
```

Read product text from language resources. Renderer payloads do not accept arbitrary source or actionId values; the main process controls notification origin and click actions. Keep business results visible in the application even when notifications are disabled or suppressed by the OS.

## Themes and shortcuts

Synchronize page and native themes instead of changing CSS alone. Check windows, menus, dialogs, and tables in light, dark, and system modes.

Shortcuts bind only predefined main-process actions. If an update returns false, explain the conflict and retain usable settings. Saving a preference does not guarantee successful registration.

## Updates and releases

Updates require a real distribution source and matching version metadata. Settings control automatic download, and users can check manually. Background checks are throttled; placeholder development configuration does not provide real updates.

Configure the source through [desktop development](./quick-start), then use two actual packaged versions to verify discovery, progress, cancellation or failure recovery, installation, and sign-in after updating. Validate signing, notifications, and installation on each target OS.

Keep the unsubscribe function returned by update subscriptions and call it on component unmount, avoiding duplicate handlers when settings are reopened.

## Session storage and logs

The main process owns sessions. Encrypted values are stored in `secure-store.json` under application userData using Electron safeStorage. Availability depends on OS and key-service configuration, particularly on target Linux environments. The renderer has no general credential-reading bridge.

Collect versions, reproduction steps, and redacted logs for troubleshooting. Do not log passwords, tokens, or complete sensitive business data. See [desktop architecture](./architecture) for authentication and request boundaries.
