---
title: Account and sign-in
description: Sign in to HoHu, manage your account and resolve password, tenant selection and sign-in issues.
---

# Account and sign-in

## Sign in

1. Open the address provided by your deployment administrator.
2. For hosted deployments, use the supplied tenant code or tenant domain. Default-tenant and business-tenant accounts are separate.
3. Enter your credentials. Registration is controlled by system settings; request an account when registration is unavailable.
4. Check your identity and available menus. Use the profile entry to maintain personal details and the language selector to change display language.

The username `admin` does not grant administrator privileges. Enabled roles determine authority; renaming an administrator does not remove their role permissions.

## Passwords and first installation

The CLI generates the initial administrator password. Deployment administrators retrieve it from the protected `.hohu/deploy/.env`; local development uses the backend `.env`. Ordinary users receive an account, not the entire configuration file. Change the initial password after first use.

Ask an authorized administrator to reset a forgotten password. Signing in again cannot bypass a disabled account, disabled tenant or revoked permission. Never include passwords, tokens or full configuration files in issue reports.

Changing display language does not translate names, branding or business content you entered. See [System settings](./settings).
