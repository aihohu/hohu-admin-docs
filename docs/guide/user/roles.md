---
title: Roles and permissions
description: Configure HoHu role menus, buttons, data scopes and AI assistant access, then verify effective permissions.
---

# Roles and permissions

Open **System management → Role management**. Creation, editing, menu authorization and AI assistant authorization each require their own permission. You can operate only on roles within your authority.

## Create and authorize a role

1. Select Add, enter the role name, code and description, and set its status and data scope.
2. Save and select **Menu authorization** on the role's row.
3. Select the required menus and action buttons, then confirm. Access to a page does not grant every action on it.
4. Assign the role to the target user in [User management](./users).
5. Check menus, buttons and visible records with that user's account.

The role code identifies the role in the system; its name is for display. Before changing an existing role, check which users depend on it. A disabled role no longer contributes permissions as an enabled role.

## Choose a data scope {#data-scope}

| Scope                          | Meaning                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| All                            | All data in the current tenant subject to the applicable scope rules |
| Own department                 | Scope based on the user's department memberships                     |
| Own department and descendants | Includes descendant departments of those memberships                 |
| Custom departments             | Scope based on departments selected for the role                     |
| Self only                      | Data corresponding to the current user                               |

For a custom scope, select the specific departments in the role editor. Data scope does not grant menu or action permissions; business modules must also apply the relevant scope rules.

**Scopes from enabled roles are combined as a union.** If one role grants the user's departments and another grants selected departments, both scopes apply. To narrow access, check all enabled roles rather than changing only one.

## AI assistant access {#ai-access}

Use **AI assistant authorization** on the role's row to assign assistants. Users also need AI entry permissions, the relevant tool permissions, and available model and assistant configuration to complete tasks.

Business menu access does not automatically grant AI assistant access, and assistant authorization does not expand business data scope. See [AI configuration and operations](../operations/ai) for setup and [Application AI assistant](./ai) for usage.

## Common questions

**Why do some roles have no edit or authorization buttons?** In addition to action permissions, the role must be within your grantable scope.

**Why can a user see more records with Self only selected?** Check their other enabled roles and whether the business module applies data scope rules.

**How do I delete a role?** The current Web deletion action requires super administrator status and the corresponding delete permission. The server also checks references and protection rules. Check assigned users first and follow the result shown.
