---
title: Files and uploads
description: Search, upload, copy links and delete files in HoHu, and understand format, size and access limits for each upload entry.
---

# Files and uploads

Open **System management → File management** to find recorded files. Viewing, uploading and deleting require their respective permissions. Business imports, avatars and AI attachments use their own upload entries; the file list is not a universal download entry for every attachment.

## Search and upload {#upload}

1. Search by file name or type and check the name, size, uploader and time.
2. Select **Upload file** and choose or drop files. Check the formats and size allowed by this entry first.
3. Wait for success, close the dialog and verify the list entry. For business forms, wait for upload success before submitting a form that depends on the file.

File management currently uses general public upload, which validates JPEG/PNG image content. A format appearing in a file picker or system settings does not establish support at this upload entry.

## Copy links and delete {#manage}

Use the row's **Copy link** action to obtain its URL. If copying fails, check browser clipboard permission and whether the site uses HTTPS. Public image links are for publicly displayable resources; open private business attachments through the relevant business entry.

Before deletion, check whether the file is still used as an avatar, logo or business asset. Confirm deletion for one row or select several for batch deletion. Deletion removes the record and attempts to remove the stored file, potentially breaking existing references; it does not merely hide a list entry.

## Supported upload entries {#formats}

| Entry                            | Current support and conditions                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| General public upload and images | JPEG/PNG content validation; there is no complete general non-image storage and download channel yet |
| User import                      | XLSX and CSV through [User import](./user-import-export)                                             |
| Web AI data attachments          | CSV, XLSX, Markdown and JSON, subject to parsing and budget checks                                   |
| Web AI images                    | PNG and JPEG, requiring an available vision-capable model                                            |

The backend parser also supports some TXT types, which does not mean the Web AI entry accepts TXT. See [AI attachments](./ai#attachments). Private attachments are authorized by owner and tenant; knowing a file ID or path does not grant access.

## Size limits and failures {#limits}

The effective per-file limit is the smallest of the deployment cap, tenant policy and business-scenario cap. Entire request bodies are also limited, so individually valid files may still exceed a batch limit.

| Message                                      | What to do                                                                    |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| Unsupported format or content                | Use an actual supported format; do not merely rename the extension            |
| File too large                               | Reduce the file or split its content, then retry within the displayed limit   |
| 413                                          | The request may exceed a proxy or server cap; ask the deployer to investigate |
| Permission denied or attachment inaccessible | Check the account, tenant and business entry that owns the attachment         |

Administrators can adjust normal limits and extensions in [System settings](./settings), within deployment and parser boundaries.
