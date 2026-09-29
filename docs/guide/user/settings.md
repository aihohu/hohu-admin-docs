---
title: System settings
description: 'Configure HoHu branding, accounts, language, uploads and access protection. Learn what each field controls and how settings take effect.'
---

# System settings

System settings control HoHu’s built-in behavior. Change the site name, logo, registration, default language and upload limits without editing source code.

Open **System Manage → System Settings**. Viewing requires settings access; saving also requires edit access. Application-specific key/value settings belong in the separate [Custom parameters](./parameters) page.

[![The Branding tab in System Settings](/images/product/settings-brand-en.png)](/images/product/settings-brand-en.png)

## Save and apply settings

1. Choose a group, such as Branding.
2. Edit its fields and click **Save current settings**.
3. After the success message, check the resulting interface.

Saving submits only the active group. Switching groups preserves unsaved drafts; leaving with unsaved changes prompts you. Client settings such as branding and language refresh after saving. Other open clients may need a page refresh.

Most settings apply to the current tenant. Access protection is system-wide and is managed only by system administrators in the default tenant.

## Branding

| Field                    | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| Site name                | The name used by the application interface                 |
| Site logo                | A logo URL, or an image selected through the upload button |
| Site description         | A short introduction to the site                           |
| Registration information | Registration text that the site needs to display           |
| Footer text              | Text displayed at the bottom of the application            |

For example, change Site name to your team’s application name, save and check the interface. Use an accessible image URL for the logo. Uploads still follow image type and size limits. Brand text is stored as entered and is not automatically translated.

## Accounts

| Field                        | Effect                                                                | Recommendation                                                       |
| ---------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Default avatar               | Used when a user has no individual avatar                             | Use a stable, accessible image URL                                   |
| Registration enabled         | Controls registration availability                                    | Disable for internal systems where administrators create accounts    |
| Require a primary department | Requires department ownership for users                               | Prepare the department structure and existing user assignments first |
| Default password             | Used by account creation/import flows that support a default password | Use a value meeting the password policy and review its use           |

Password fields never show the saved value. Submitting an empty field preserves it; it does not clear it. Changing the default does not change existing users’ passwords.

## Language

The default language applies to users who have not selected their own language. Resolution order is **user preference → tenant default → deployment default**.

Chinese and English are available. Switching translates interface labels and built-in names linked to translations. Your branding, department names, agreement text and custom parameters stay as entered.

## File uploads

[![Upload settings with sizes displayed in MiB](/images/product/settings-files-en.png)](/images/product/settings-files-en.png)

| Field                    | Meaning                             |
| ------------------------ | ----------------------------------- |
| Maximum file size        | The tenant’s general per-file limit |
| Maximum image size       | The image-scenario limit            |
| Maximum import file size | The spreadsheet-import limit        |
| Allowed file extensions  | File types allowed by the tenant    |

Sizes are displayed in **MiB**; 1 MiB is 1,048,576 bytes. All three size fields initially default to 10 MiB.

To limit images to 5 MiB, set Maximum image size to `5` and save. New uploads use the limit; reducing it does not delete existing files.

Deployment and processing limits also apply. An extension must be allowed by both the tenant and the upload scenario: enabling PDF does not make avatars accept PDF files. See [Files and uploads](./files).

## Agreements

Maintain the user agreement and privacy policy text for your site. These are your business content and are not automatically translated. Editing the text does not replace any notice process your organization needs to follow.

## Access protection

| Setting                          | Default | Allowed range |
| -------------------------------- | ------- | ------------- |
| Login requests per minute        | 5       | 1–100         |
| Registration requests per minute | 3       | 1–30          |
| API requests per minute          | 100     | 10–10,000     |

These control rate limits for the respective requests, not the total number of users the site supports. Lower values may affect normal activity. Excess requests receive 429; retry after the interval returned by the server.

## Troubleshooting

**Why can’t I save or edit?** Check that your role has settings edit permission. Custom parameter permissions are separate.

**Why is Access protection missing?** Only system administrators in the default tenant can access it.

**Someone else changed the settings. What now?** Keep a note of your edits, reload the latest values and merge your changes. Revision checks prevent overwriting another administrator’s updates.

**Where do I configure databases, Redis and model secrets?** Deployers maintain infrastructure connections; AI Management handles model configuration. See [Configuration ownership](../reference/configuration) and [AI setup](../operations/ai).
