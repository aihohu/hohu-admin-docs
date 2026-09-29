---
title: 上传接入
description: HoHu 上传接入的使用步骤、适用范围与限制
---

# 上传接入

本页供开发者接入已有上传能力；用户操作见[文件与上传](./user/files)。

## 客户端

Web 的通用上传组件为 `src/components/custom/file-upload.vue`。按组件实际 props 绑定文件 ID，在上传成功后提交业务表单；可用大小与扩展名来自后端当前租户的 runtime 能力，不维护另一套固定限制。

浏览器 accept 和前端校验只改善体验，不是安全边界。服务端保存时重新验证文件 tenant、owner 及业务关联，不能把客户端提供的 ID 当成访问许可。

## 后端

复用文件服务和场景策略，显式传入可信 tenant、当前用户及业务用途。业务读取也要检查归属；不要复制缺少 tenant 参数的历史 `get_list` 示例。

有效大小取部署、租户、场景上限的最小值；扩展名取租户与场景白名单交集。MIME、图片解码、XLSX 解压预算、行数和路径校验独立保留。私有附件不能挂载到公共静态目录。

`UPLOAD_MAX_SIZE` 和 `UPLOAD_ALLOWED_EXTENSIONS` 已移除。业务偏好在系统设置，部署硬上限使用 `UPLOAD_HARD_MAX_BYTES`，代理请求大小由 CLI 派生。精确边界见[设置与上传策略](./reference/settings)。

当前通用公开上传按 JPEG/PNG 内容校验；不能只扩展前端 accept 就宣称支持任意文档上传。AI 文本文件的私有解析流程与通用公开上传分开。
