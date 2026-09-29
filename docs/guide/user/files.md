---
title: Files and uploads
description: Upload and download files in HoHu with guidance on file types, size limits, access permissions and failures.
---

# Files and uploads

Upload entries enforce size and format rules for their purpose. File management, images, business imports and AI attachments may accept different formats.

## Upload a file

1. Use the upload entry in the relevant business page and check its supported formats and size.
2. Select a file and wait for success before submitting a form that depends on it.
3. On failure, check size, format and content feedback. Renaming an extension does not bypass content validation.

The effective file limit is the minimum of the deployment hard limit, tenant settings and scenario limit. Multi-file requests also have a total request-body limit, so individually valid files may exceed a batch limit.

## Current format boundaries

- Images, business imports and AI text attachments have separate allowlists.
- AI text attachments support csv, xlsx, txt, md and json, subject to parser validation.
- Extensions available in settings do not promise support in every upload entry. General public uploads currently validate JPEG/PNG content; there is not yet a complete general-purpose non-image storage and download channel.
- Private attachments require user and tenant authorization. Knowing a file ID or path does not grant access.

A 413 response can indicate a proxy or request-body hard limit; contact the deployer. Administrators adjust ordinary quotas and formats in [System settings](./settings), within deployment and parser boundaries.
