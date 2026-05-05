---
title: File Upload
description: HoHu Admin FileUpload reusable component supporting single file, multiple files, and image card upload modes, binding fileId via v-model to associate with business data
---

# File Upload

HoHu Admin provides a `FileUpload` reusable component that supports single file, multiple file, and image card upload modes. Bind `fileId` via `v-model` to associate files with business data.

## Quick Start

Import the component and start using it:

```vue
<script setup lang="ts">
import FileUpload from '@/components/custom/file-upload.vue';

const form = reactive({
  docFileId: '',
  avatarFileId: '',
  imageFileIds: [] as string[]
});
</script>

<template>
  <!-- Single file -->
  <FileUpload v-model:value="form.docFileId" />

  <!-- Single image upload (avatar) -->
  <FileUpload v-model:value="form.avatarFileId" accept="image/*" list-type="image-card" :max="1" />

  <!-- Multiple image upload (product images) -->
  <FileUpload
    v-model:value="form.imageFileIds"
    accept="image/*"
    list-type="image-card"
    :max="5"
    multiple
    business-type="product"
    :business-id="productId"
  />
</template>
```

## Component API

### Props

| Property       | Type                                | Default  | Description                                                            |
| -------------- | ----------------------------------- | -------- | ---------------------------------------------------------------------- |
| `value`        | `string \| string[]`                | —        | `v-model` bound fileId — string for single file, string[] for multiple |
| `businessType` | `string`                            | —        | Business type, e.g. `product`, `avatar`                                |
| `businessId`   | `string`                            | —        | Business record ID                                                     |
| `accept`       | `string`                            | —        | Restrict file types, e.g. `image/*`, `.pdf,.doc`                       |
| `multiple`     | `boolean`                           | `false`  | Whether to allow multiple files                                        |
| `max`          | `number`                            | —        | Maximum number of files                                                |
| `listType`     | `'text' \| 'image' \| 'image-card'` | `'text'` | List display type                                                      |
| `disabled`     | `boolean`                           | `false`  | Whether the component is disabled                                      |

### Events

| Event          | Payload                         | Description                                          |
| -------------- | ------------------------------- | ---------------------------------------------------- |
| `update:value` | `string \| string[]`            | Fired when fileId changes                            |
| `change`       | `{ fileId, fileUrl, fileName }` | Upload success callback, provides complete file info |

## Business Integration Example

Using product management image upload as an example:

```vue
<template>
  <NForm>
    <NFormItem label="Product Images">
      <FileUpload
        v-model:value="form.imageFileIds"
        accept="image/*"
        list-type="image-card"
        :max="5"
        multiple
        business-type="product"
        :business-id="productId"
      />
    </NFormItem>
  </NForm>
</template>
```

The `imageFileIds` bound via `v-model` updates automatically as files are uploaded. When submitting the form, simply pass it to the backend.

The backend queries associated files using `business_type` + `business_id`:

```python
files = await file_service.get_list(db, FileQuery(
    business_type="product",
    business_id=product.product_id,
    size=100,
))
```

## Custom Trigger Area

Use the default slot to customize the upload area style, such as drag-and-drop upload:

```vue
<FileUpload multiple>
  <NUploadDragger>
    <icon-ic:round-cloud-upload class="text-48px text-gray-400" />
    <NText>Click or drag files to this area to upload</NText>
  </NUploadDragger>
</FileUpload>
```

## Configuration

The backend configures upload parameters via `.env`:

| Variable                    | Default                 | Description                                |
| --------------------------- | ----------------------- | ------------------------------------------ |
| `SERVER_URL`                | `http://127.0.0.1:8000` | Server URL, used to build file access URLs |
| `UPLOAD_DIR`                | `uploads`               | Upload directory                           |
| `UPLOAD_MAX_SIZE`           | `10485760` (10MB)       | Maximum file size                          |
| `UPLOAD_ALLOWED_EXTENSIONS` | `.jpg,.jpeg,.png,...`   | Allowed file extensions                    |

## Related Files

- `src/components/custom/file-upload.vue` — Reusable upload component
- `src/views/system/file/` — File management page
- `src/service/api/system.ts` — `fetchUploadFile` and other API functions
- `src/typings/api/system-manage.d.ts` — `FileRecord` type definition
- `app/modules/system/service/file_service.py` — Backend file service
- `app/modules/system/api/file.py` — Backend API routes
