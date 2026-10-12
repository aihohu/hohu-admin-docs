---
title: 上传接入
description: 使用 HoHu FileUpload 组件和文件 API 接入图片上传、文件 ID 绑定、编辑回显与运行时上传策略。
---

# 上传接入

Web 通用组件位于 `src/components/custom/file-upload.vue`，请求入口为 `fetchUploadFile`。当前通用图片上传支持 JPEG、PNG；用户导入等业务文件使用各自专用接口，不通过图片组件上传。

## 最小示例

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

单文件模式返回字符串 ID，清空后为 undefined；多文件模式返回字符串数组。组件公开的更新事件使用联合类型，因此示例 model 保留联合类型，提交业务表单前再按单文件规则校验。

## 属性与事件速查

| 属性或事件                     | 用途                                           |
| ------------------------------ | ---------------------------------------------- |
| `v-model:value`                | 上传完成的 fileId 或 fileId 数组               |
| `business-type`、`business-id` | 随上传提交业务关联信息；不能替代服务端归属检查 |
| `accept`                       | 文件选择器类型提示，不构成安全校验             |
| `multiple`、`max`              | 多文件与数量；max 大于 1 也会启用多文件模式    |
| `list-type`                    | text、image 或 image-card                      |
| `file-urls`                    | 编辑回显的 fileId → fileUrl 映射               |
| `disabled`                     | 禁用交互                                       |
| `change`                       | 单个上传完成，返回 fileId、fileUrl、fileName   |
| `v-model:file-list`            | 需要管理完整上传列表时使用 UploadFileInfo[]    |

编辑时同时传入已保存的 ID 和 URL 映射。保存业务数据时提交 ID，由后端验证文件归属与引用权限；不要只保存临时预览地址。

## 上传策略与删除

`fetchUploadFile` 会根据场景读取运行时 uploads 策略并做前置校验；服务端继续验证类型、大小与内容。限制受部署硬上限、租户设置和业务解析规则共同约束，以最终服务端结果为准。策略来源与错误处理见[设置接口与上传策略](./reference/settings)。

从组件列表移除文件只更新页面选择，不会调用后端删除接口。是否解绑、删除实际文件及清理未引用上传，需要业务流程明确处理；删除前检查当前用户权限和其他引用。

## 验证与排错

验证成功上传、大小超限、错误类型、网络失败、编辑回显和移除后保存。上传成功但表单保存失败时，应保留用户可继续操作的状态。文件 ID、URL 与业务 ID 均保持字符串，不转换为 Number。
