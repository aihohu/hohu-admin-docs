---
title: Upload integration
description: Integrate HoHu FileUpload and file APIs for image uploads, file ID binding, edit previews, and runtime upload policies.
---

# Upload integration

The shared Web component is `src/components/custom/file-upload.vue`, using `fetchUploadFile`. The general image upload currently supports JPEG and PNG. Business files such as user imports use dedicated endpoints rather than this image component.

## Minimal example

```vue
<script setup lang="ts">
import { ref } from 'vue';
import FileUpload from '@/components/custom/file-upload.vue';

const imageId = ref<string | string[] | undefined>();
</script>

<template>
  <FileUpload v-model:value="imageId" accept="image/jpeg,image/png" list-type="image-card" :max="1" />
</template>
```

Single-file mode returns a string ID, or undefined when cleared. Multiple-file mode returns a string array. The public update event uses a union type, so this model keeps that union; validate the single-file case before submitting the business form.

## Props and events

| Prop or event                  | Purpose                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| `v-model:value`                | Completed fileId or fileId array                                                     |
| `business-type`, `business-id` | Business association sent with upload; not a replacement for server ownership checks |
| `accept`                       | File-picker hint, not a security check                                               |
| `multiple`, `max`              | Multiple selection and count; max greater than 1 also enables multiple mode          |
| `list-type`                    | text, image, or image-card                                                           |
| `file-urls`                    | fileId → fileUrl mapping for edit previews                                           |
| `disabled`                     | Disable interaction                                                                  |
| `change`                       | One completed upload: fileId, fileUrl, fileName                                      |
| `v-model:file-list`            | UploadFileInfo[] when the full upload list is needed                                 |

For editing, provide both saved IDs and their URL mapping. Submit IDs with business data and validate ownership and reference permissions on the backend. Do not persist only temporary preview URLs.

## Upload policy and removal

`fetchUploadFile` performs preliminary checks using the scenario's runtime uploads policy. The server still validates type, size, and content. Deployment hard limits, tenant settings, and business parsers all apply; the server has the final say. See [settings API and upload policies](./reference/settings).

Removing an item from the component only changes the page selection; it does not call a backend deletion endpoint. Define unlinking, physical deletion, and cleanup of unreferenced uploads in the business workflow, checking permissions and other references before deletion.

## Validation and troubleshooting

Test successful uploads, oversized and unsupported files, network failure, edit previews, and saving after removal. Preserve a recoverable state if upload succeeds but the form fails to save. Keep file IDs, URLs, and business IDs as strings, never Number values.
