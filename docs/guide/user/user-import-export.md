---
title: User import and export
description: Download a HoHu user template, preview bulk data, choose conflict handling, execute imports and export users with supported filters.
---

# User import and export

Use Import, Export and Import history in **System management → User management**. Each operation requires its own permission. Roles and departments involved in imports must also be within your authority.

## Prepare a file {#template}

1. Open the import dialog and download a fresh XLSX template.
2. Read its instructions, department dictionary and role dictionary, then fill the data worksheet.
3. Remove example rows and keep the headers. Download a new template after departments or roles change.

Imports accept **XLSX and CSV**, with up to 2,000 rows per batch. Tenant upload policy and parser limits both apply to file size. Start with the downloaded XLSX template when possible.

| Field                      | Instructions                                                                                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `user_name`                | Required login username; follow template and preview validation                                                              |
| `nickname`                 | User's display nickname                                                                                                      |
| `user_email`, `user_phone` | Valid email and phone values; importing an email does not verify it                                                          |
| `dept_input`               | Required department name or full path; use a full path for duplicate names                                                   |
| `role_input`               | Assignable role codes or names, separated by commas                                                                          |
| `user_gender`              | `0` unknown, `1` male, `2` female; defaults to `0`                                                                           |
| `status`                   | `1` enabled, `2` disabled; defaults to `1`                                                                                   |
| `employee_no`              | Optional employee number; absent from the default template, but this header can be added for employee-number synchronization |

Keep usernames, phone numbers and employee numbers as text so spreadsheet software does not alter them. Quote CSV role cells containing commas according to CSV rules.

New users receive the configured default password. Import files cannot set passwords in bulk or overwrite existing passwords. Have an administrator confirm the default password is usable before importing, then ask new users to change it.

## Preview and execute {#import}

1. Enter an import reason, then select the file.
2. Review new, existing, conflicting and out-of-scope records. Previewing does not create users.
3. Correct departments, roles or fields and upload again as needed. Confirm how existing usernames and employee numbers should be handled.
4. Confirm the import and wait for its result.
5. Check successful, skipped, updated and failed records. Correct failures and preview again before retrying. You can also inspect the batch in Import history.

Execution checks data and authorization again, so a successful preview does not guarantee every row will succeed. Preview again when instructed after file, permission or related-data changes.

## Handle existing users {#conflicts}

**For username matches**, choose a conflict strategy:

| Strategy               | Result                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| Skip existing          | Preserve existing users; selected by default                                                            |
| Overwrite existing     | Update allowed profile and relationship fields, never passwords, user IDs or creation times             |
| Stop at first conflict | If execution checks find conflicts or failed records, abort without writing user changes for that batch |

**For employee-number matches**, choose a synchronization mode:

| Mode                            | Result                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| Create only `CREATE_ONLY`       | Default; an existing employee number fails rather than updating that user                  |
| Update profile `UPDATE_PROFILE` | Update allowed profile and relationship fields while keeping the username                  |
| Full sync `FULL_SYNC`           | Synchronize allowed profile and relationship fields, including the matched user's username |

Employee-number matching takes precedence over username matching. Create only therefore does not reject every existing username: rows not matched by employee number still follow the conflict strategy.

Overwriting may change departments and role relationships, so review the file and authorization scope first. A batch can be cancelled during preview; cancellation is not an undo operation for executed changes.

## Export users {#export}

1. Set filters in the user list.
2. Open Export, enter a reason and review the scope.
3. Confirm to download an XLSX file, then check its contents.

The current Web export sends **username, nickname, email, phone and status** filters. Gender and role filters are not yet included in the export request; do not rely on them to narrow exports. Selected rows do not define the export scope either. The server still applies your data scope.

If the result exceeds the synchronous export limit, narrow the supported filters and retry. Exported files contain user information; store and share them according to your organization's data practices.

## Common questions

**Department or role not found?** Check names, full department paths, enabled status and your grantable scope. Do not reuse another tenant's dictionaries.

**Preview expired or authorization changed?** Preview the current file again before confirming.

**Only some rows were imported?** Use execution results and Import history to identify successful rows and failures before retrying, avoiding unintended overwrites.
