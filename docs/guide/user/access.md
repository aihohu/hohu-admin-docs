---
title: Users, roles and departments
description: Manage HoHu users, roles and departments, including feature permissions, data scopes and AI access.
---

# Users, roles and departments

This page is for administrators authorized to manage users, roles or departments. These permissions are separate; list access does not imply edit access.

## Setup order

1. Create the required department hierarchy, then assign users to departments.
2. Create or select roles and assign menu and button permissions.
3. Select each role's data scope: all, own department, own department and descendants, custom departments, or self. Custom scope requires specific departments.
4. Assign roles to users and check that both users and roles are enabled.
5. Verify menus, actions and visible records with an ordinary test account, not only a super administrator.

## Combining scopes

The concrete scopes of enabled roles are combined as a union. A role granting the user's department and another granting selected departments contribute both sets; the system does not simply pick one numeric priority. All data still means data within the current tenant.

The default tenant's system super administrator can perform authorized system-wide administration. Other tenant administrators remain within their tenant. Role authority alone does not grant AI assistant access: explicit entry permission, assistant bindings and tool permissions are also required.

For missing records, check departments, role status and data scope. For missing menus, check grants and refreshed session information. Developers should read [API permissions](../auth) and [Data scope](../data-permission).
