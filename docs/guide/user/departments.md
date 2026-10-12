---
title: Department management
description: Build HoHu department hierarchies, maintain details and membership, and understand primary departments and deletion restrictions.
---

# Department management

Open **System management → Department management**. Viewing, creating, editing and deleting need their respective permissions. Membership management also requires user permissions.

## Build a department hierarchy

1. Select Add, or select **Add child department** on an existing department's row.
2. Choose a parent and enter the department name, order, leader, contact details and status.
3. Save and check its position and name in the department tree.

Create parent departments before their children. Specifying a leader does not automatically grant management permissions; roles and authorization scope determine access.

## Update department details

Find a department and select Edit to update its name, order, leader, phone, email and status. The current Web edit operation does not submit parent changes, so ordinary editing cannot move a department in the hierarchy.

Hierarchy and membership affect related users' data scopes. Verify changes with affected ordinary accounts.

## Manage members {#members}

1. Select **Manage members** on the department row.
2. Find people in the candidate list and move them to the member list. Move removable members back to the candidate list to remove them.
3. Confirm and reopen the dialog to check the result.

This action requires department list, department edit, user list and user edit permissions. Your data scope also limits candidate users.

People whose primary department is this department cannot be removed here. Change their departments and primary department in [User management](./users) first. Users can belong to multiple departments, with one selected as primary.

## Delete a department

The current Web deletion action requires super administrator status and the corresponding delete permission. The server blocks deletion when child departments, direct members or role data-scope references remain.

Reassign members and update role references first, then review leaf departments individually. Deleting a department does not automatically transfer its members elsewhere.

## Common questions

**Cannot see membership management?** Check the four permissions listed above.

**A colleague is missing from candidates?** Check account status, your data scope and search filters.

**A member is locked and cannot be removed?** Check whether this is their primary department and update their assignment in User management first.
