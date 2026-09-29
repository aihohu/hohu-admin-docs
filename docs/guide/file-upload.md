---
title: Upload integration
description: 'HoHu upload integration: steps, scope and limitations'
---

# Upload integration

This page is for developers integrating uploads. User steps are in [Files and uploads](./user/files).

## Client

Web's reusable component is `src/components/custom/file-upload.vue`. Bind file IDs using its actual props and submit dependent forms after upload success. Obtain size and extension capabilities from the current tenant's backend runtime response instead of maintaining separate fixed limits.

Browser accept filters and client validation improve UX, not security. The server rechecks tenant, owner and business association when saving; client-supplied IDs do not grant access.

## Backend

Reuse file services and scenario policies with explicit trusted tenant, user and purpose. Reads also enforce ownership; do not copy old `get_list` examples without tenant parameters.

Effective size is the minimum of deployment, tenant and scenario limits. Extensions are the intersection of tenant and scenario allowlists. MIME, image decoding, XLSX expansion budgets, row counts and path checks remain independent. Do not mount private attachments as public static files.

`UPLOAD_MAX_SIZE` and `UPLOAD_ALLOWED_EXTENSIONS` were removed. Business preferences are system settings; `UPLOAD_HARD_MAX_BYTES` is the deployment ceiling, and the CLI derives proxy request limits. See [Settings and upload policies](./reference/settings).

General public uploads currently validate JPEG/PNG content. Expanding client accept values does not implement arbitrary document uploads. AI private text parsing is separate from general public uploads.
