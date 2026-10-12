---
title: Custom parameters
description: Create, maintain, import and export HoHu business parameters, with field definitions, visibility and activation requirements.
---

# Custom parameters

Open **System management → Custom parameters**. Viewing requires access; creation, editing, deletion, import and export have separate permissions.

Parameters store configuration values agreed by business modules. They affect behavior only when code reads the key; adding a parameter does not create a feature. Manage branding, accounts, language, mail and upload policies in [System settings](./settings).

## Create a parameter

1. Search by name or key to avoid duplicates.
2. Select Add and enter values according to the business module's configuration contract.
3. Save and verify the result in the business page that uses it.

| Field  | Meaning                                                                                                     |
| ------ | ----------------------------------------------------------------------------------------------------------- |
| Name   | A recognizable name for administrators                                                                      |
| Key    | The unique identifier read by business code; keep it consistent with the developer's contract               |
| Value  | The value expected by the business module                                                                   |
| Type   | Text, rich text or file; choosing a type does not generate a business interface                             |
| Group  | Groups parameters by module for organization and search                                                     |
| Status | Enabled or disabled; behavior after disabling depends on the reader and its fallback values                 |
| Public | Public values may be readable without sign-in; do not include credentials or sensitive personal information |
| Remark | Purpose, accepted values and the module using the parameter                                                 |

For example, **if your business module already reads** `orders:notice`, configure its order-page notice according to that contract. This key is only an example; HoHu does not automatically display a notice when it is added.

## Edit, disable and delete

Find a parameter, select Edit, save the new value and verify the business page. Before renaming a key, disabling or deleting it, check how dependent modules handle missing values.

Built-in keys and reserved AI, security and upload namespaces cannot be overwritten as ordinary business parameters. Use the relevant settings page when a reserved-key message appears.

## Import and export

Export an XLSX file from the list. Preserve its column order when importing and review the result shown. Import adds new parameters; existing keys and reserved built-in keys are skipped, not overwritten. Both operations apply only to custom business parameters, not built-in system settings. Redacted exported values are not a complete backup; verify effective values after importing.

## Common questions

**Saved successfully but nothing changed?** Confirm that the module reads the key, and check its spelling, current tenant, enabled status and business cache refresh behavior.

**Can view but cannot edit?** Parameter permissions are separate from system settings permissions. Ask an administrator for the required action permission.
