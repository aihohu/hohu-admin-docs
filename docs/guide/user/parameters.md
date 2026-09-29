---
title: Custom parameters
description: Manage custom business parameters and understand how their keys and values differ from built-in system settings.
---

# Custom parameters

Custom parameters configure business extensions, not built-in login, upload or rate-limit policies. Appropriate parameter-management permissions are required.

1. Open the parameter list and search for an existing key before creating one.
2. Set its key, value and editable properties according to the consuming business module. A parameter affects behavior only when application code reads it.
3. Save and verify the relevant workflow. Check dependencies before editing or deleting a parameter.

Do not use built-in keys or reserved AI, security and upload namespaces to bypass settings validation. Built-in settings live in `sys_setting`; custom parameters live in `sys_config`. Deleting business parameters should not alter built-in settings.

Public parameters may be read by unauthenticated clients. Never mark credentials or sensitive personal information as public. Import and export operate on custom parameters, not built-in settings.

For branding, registration, language or upload quotas, use [System settings](./settings).
