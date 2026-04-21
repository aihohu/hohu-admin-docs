# 文件上传

HoHu Admin 提供了 `FileUpload` 可复用组件，支持单文件、多文件、图片卡片等多种上传模式，通过 `v-model` 绑定 `fileId` 即可与业务数据关联。

## 快速开始

引入组件即可使用：

```vue
<script setup lang="ts">
import FileUpload from '@/components/custom/file-upload.vue';

const form = reactive({
  docFileId: '',
  avatarFileId: '',
  imageFileIds: [] as string[],
});
</script>

<template>
  <!-- 单文件 -->
  <FileUpload v-model:value="form.docFileId" />

  <!-- 单图上传（头像） -->
  <FileUpload
    v-model:value="form.avatarFileId"
    accept="image/*"
    list-type="image-card"
    :max="1"
  />

  <!-- 多图上传（商品图片） -->
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

## 组件 API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `value` | `string \| string[]` | — | `v-model` 绑定 fileId，单文件传 string，多文件传 string[] |
| `businessType` | `string` | — | 业务类型，如 `product`、`avatar` |
| `businessId` | `string` | — | 业务记录 ID |
| `accept` | `string` | — | 限制文件类型，如 `image/*`、`.pdf,.doc` |
| `multiple` | `boolean` | `false` | 是否允许多文件 |
| `max` | `number` | — | 最大文件数量 |
| `listType` | `'text' \| 'image' \| 'image-card'` | `'text'` | 列表展示类型 |
| `disabled` | `boolean` | `false` | 是否禁用 |

### Events

| 事件 | 参数 | 说明 |
| ---- | ---- | ---- |
| `update:value` | `string \| string[]` | fileId 变化时触发 |
| `change` | `{ fileId, fileUrl, fileName }` | 上传成功回调，可获取完整文件信息 |

## 业务接入示例

以商品管理上传图片为例：

```vue
<template>
  <NForm>
    <NFormItem label="商品图片">
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

`v-model` 绑定的 `imageFileIds` 会随上传自动更新，提交表单时直接传给后端即可。

后端通过 `business_type` + `business_id` 查询关联文件：

```python
files = await file_service.get_list(db, FileQuery(
    business_type="product",
    business_id=product.product_id,
    size=100,
))
```

## 自定义触发区域

通过默认插槽自定义上传区域的样式，如拖拽上传：

```vue
<FileUpload multiple>
  <NUploadDragger>
    <icon-ic:round-cloud-upload class="text-48px text-gray-400" />
    <NText>点击或拖拽文件到此区域上传</NText>
  </NUploadDragger>
</FileUpload>
```

## 配置

后端通过 `.env` 配置上传参数：

| 变量 | 默认值 | 说明 |
| ---- | ------ | ---- |
| `SERVER_URL` | `http://127.0.0.1:8000` | 服务地址，用于拼接文件访问 URL |
| `UPLOAD_DIR` | `uploads` | 上传目录 |
| `UPLOAD_MAX_SIZE` | `10485760`（10MB） | 最大文件大小 |
| `UPLOAD_ALLOWED_EXTENSIONS` | `.jpg,.jpeg,.png,...` | 允许的文件扩展名 |

## 相关文件

- `src/components/custom/file-upload.vue` — 可复用上传组件
- `src/views/system/file/` — 文件管理页面
- `src/service/api/system.ts` — `fetchUploadFile` 等 API 函数
- `src/typings/api/system-manage.d.ts` — `FileRecord` 类型定义
- `app/modules/system/service/file_service.py` — 后端文件服务
- `app/modules/system/api/file.py` — 后端 API 路由
