---
title: User management
description: Create and maintain HoHu users, assign roles and departments, disable accounts and reset passwords.
---

# User management

Open **System management → User management**. Viewing, creating, editing, assigning roles, resetting passwords and deleting require their respective permissions. Data scope also limits which users you can manage.

## Create a user

1. Select Add and enter a username, nickname and initial password.
2. Optionally enter gender, phone and email, and choose an enabled or disabled status.
3. If you can assign roles, select the business roles required. Options include only roles you may assign; search by name or code.
4. If you have the relevant department permissions, select departments and confirm one selected department as primary. Complete this assignment when the system requires a primary department.
5. Save, find the new user in the list and check roles, departments and status before handing over sign-in details.

For bulk creation, see [User import and export](./user-import-export). On sites with registration enabled, users can register themselves and an administrator can assign business roles and departments afterward.

## Edit details and access

Find the user and select Edit. Update details, status or the role and department fields available to you. Roles determine business features and data scope; department membership contributes to scope calculation. See [Roles and permissions](./roles).

Saving details, roles and departments involves multiple changes. If a partial-update warning appears, reopen the user and check what was saved before completing the remaining changes. Do not assume that everything succeeded or everything failed.

An email entered or changed by an administrator is not verified on the user's behalf. The user must verify it under [Recovery email](./account#recovery-email) before using it for password recovery.

## Administrator password reset {#reset-password}

1. Confirm the target username and tenant.
2. Select the row's password reset action, enter a valid new password and confirm.
3. Deliver it to the user through an appropriate channel and ask them to change it after signing in.

Disabled accounts and incorrect passwords are separate issues. Resetting a password does not enable an account. For email self-service, see [Recover a forgotten password](./account#reset-password).

## Disable and delete

To suspend access, edit the user, set the status to disabled and save. To restore access, review business authorization before enabling the account again.

Deletion requires additional permissions and is subject to protection rules. Check the username and business relationships before deleting a row or selecting users for batch deletion. Follow rejection messages rather than renaming accounts or changing roles to bypass protection.

## Common questions

**Cannot find a user or role?** Check search filters, role status and the scope you are allowed to manage.

**Can edit users but cannot assign roles?** These are separate permissions. Contact an administrator who can grant access.

**Business menus still missing after saving?** Check menu authorization, role status and the user's actual role assignments, then refresh or sign in again to verify.
