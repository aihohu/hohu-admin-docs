---
title: Set up members and access
description: Configure HoHu departments, roles and users in order, then verify menus, actions and data scope with an onboarding example.
---

# Set up members and access

This page helps administrators configure initial access. User, role and department management have separate permissions. List access does not grant editing or authorization rights.

## Setup order

| Step | Action                              | Purpose                                                            |
| ---- | ----------------------------------- | ------------------------------------------------------------------ |
| 1    | [Create departments](./departments) | Establish organization structure and membership                    |
| 2    | [Configure roles](./roles)          | Assign menus, buttons and data scope                               |
| 3    | [Create or edit users](./users)     | Set departments and a primary department, and assign enabled roles |
| 4    | Verify with an ordinary account     | Check accessible pages, permitted actions and visible records      |

## Example: onboard a colleague

The following example uses an Operations department. Use department and role names appropriate for your organization.

1. Create or locate Operations in Department management.
2. Create a business role in Role management and select the menus and buttons needed for the job. Choose an appropriate data scope if visibility of people needs to be restricted.
3. Create an account in User management, select its roles and departments, and check its primary department and user/role status.
4. Give the colleague the site address, tenant and initial sign-in details. Ask them to change their password and verify a recovery email.
5. Use that account to check the intended menus, buttons and records. Configure [AI access](./roles#ai-access) if an assistant is needed.

Menu permissions control access to features; button permissions control actions. Data scope restricts records in business endpoints that apply it. Department membership alone grants no business action permissions.

## Authorization boundaries

Administrators can manage users, departments and assignable roles only within their own authority. System super administrators in the default tenant can perform authorized system operations; administrators in other tenants manage their own tenant.

Data scopes from enabled roles are combined as a union; see [Roles and permissions](./roles#data-scope). Verify as the target user rather than relying on results visible to a super administrator.

For missing menus, unexpected data visibility or denied actions after a change, follow [Permission troubleshooting](./faq#permissions).
