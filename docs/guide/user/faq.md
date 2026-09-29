---
title: Troubleshooting
description: Troubleshoot common HoHu sign-in, menu permission, system settings, file upload and AI issues.
---

# Troubleshooting

| Symptom                             | Check first                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| Sign-in fails                       | Site and tenant, account status and password; wait after rate limiting                           |
| Missing menu or button              | Enabled roles and menu/action grants; refresh session information                                |
| A colleague sees records you cannot | Department membership and data scope; do not share accounts                                      |
| Settings cannot be saved            | Edit access, validation and concurrent changes; access protection also requires system authority |
| A parameter has no effect           | Whether code consumes it, or a built-in setting was mistakenly entered as a custom parameter     |
| Upload rejected or 413              | Scenario format, content, file size and total request size                                       |
| Missing AI assistant, model or tool | Explicit permissions, model policies, role bindings and enabled status                           |
| AI or request limiting returns 503  | Deployment switches or dependent services; ask the deployer                                      |

Report product versions, reproduction steps, time, error codes and redacted screenshots. Do not include passwords, tokens, full configuration files or other people's data. After an upgrade, ask the deployer to check [Versions and compatibility](../reference/versions).
