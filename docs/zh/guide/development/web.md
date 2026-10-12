---
title: Web 页面与请求
description: 在 HoHu Vue 3 Web 应用中添加页面与接口请求，接入路由、菜单、权限、分页状态和中英文文案。
---

# Web 页面与请求

Web 项目使用 Vue 3、TypeScript、Naive UI、UnoCSS 和 Pinia。新页面使用 Composition API 与 `<script setup lang="ts">`。本页说明接入顺序；完整页面与请求源码见[业务便签教程](./module)。

## 文件速查

以下路径均相对 Web 项目的 `src/`。业务类型使用 `Api.<Module>` 命名空间。

| 文件                        | 内容                         |
| --------------------------- | ---------------------------- |
| `typings/api/<module>.d.ts` | 请求与响应类型，ID 为 string |
| `service/api/<module>.ts`   | 统一 request 请求封装        |
| `service/api/index.ts`      | 业务请求导出                 |
| `views/<module>/index.vue`  | 页面与交互状态               |
| `views/<module>/modules/`   | 页面专用子组件               |
| `locales/langs/*.ts`        | 中英文界面和菜单资源         |
| `typings/app.d.ts`          | 翻译键 Schema 类型           |

页面内状态优先留在组件或业务 composable 中；跨页面共享且需要统一管理的状态再放入 Pinia。子组件通过 props 接收数据、emit 通知修改，不直接修改父组件的数据。

## 1. 接入请求

以下是便签接口的请求文件。先按便签教程接入 `Api.Notes` 类型和后端，再使用这些函数。

<<< ../../../../examples/notes/notes.ts

统一请求层已处理服务地址、认证头、刷新令牌、响应解包与错误提示。调用结果是 `{ data, error }`；成功的 `data` 已经是后端响应的内层 data，不要再读取 `data.data`。检查 error 后更新列表或关闭表单，避免失败时清空用户输入。

不要在业务页面另建一套 token 存储或登录刷新逻辑。普通请求参数使用 camelCase，ID 保持字符串；上传使用已有文件 API。

## 2. 接入页面、路由与菜单

1. 创建 `src/views/<module>/index.vue`，运行 `pnpm dev`。
2. `@elegant-router` 自动生成路由和相关类型；查看终端日志确认生成成功，无需手动运行 `pnpm gen-route`。
3. 在后端菜单种子添加页面、组件映射和按钮权限，然后运行 `uv run python -m scripts.sync_menus`。
4. 管理员给测试角色授予页面和操作权限，重新登录检查菜单与按钮。

生成前端路由不会自动添加后端菜单或给角色授权。便签页面的菜单组件映射为 `layout.base$view.notes`。其他页面应使用自动生成的实际路由名，不照抄便签名称。

## 3. 完整处理页面状态

| 状态               | 建议行为                                   |
| ------------------ | ------------------------------------------ |
| 首次加载或切换分页 | 显示 loading，保持分页参数与请求一致       |
| 多个列表请求并发   | 用请求序号或取消请求，防止旧响应覆盖新结果 |
| 无数据             | 显示空状态；不要把错误当作空列表           |
| 表单保存中         | 禁止重复提交，失败时保留输入               |
| 创建成功           | 提示成功并重新加载列表；便签示例回到第一页 |
| 权限变化           | UI 按当前权限显示，后端继续校验每次操作    |

可直接复用[便签页面](./module)中的加载、请求序号与表单示例。分页见[分页查询](../page)，图片上传见[上传接入](../file-upload)。

## 开发模式与服务地址

`pnpm dev` 执行 `vite --mode test`，使用 `.env` 和 `.env.test`；本机覆盖可写入不提交的 `.env.test.local`。修改环境配置后重启 dev server。

```dotenv
VITE_SERVICE_BASE_URL=http://127.0.0.1:8000
VITE_HTTP_PROXY=Y
```

启用开发代理时，浏览器中的 `/proxy-default` 会由 Vite 转发到后端，这是正常请求路径。生产 `pnpm build` 使用 `prod` 模式，检查 `.env.prod` 与部署反向代理。所有 `VITE_*` 变量都会进入客户端构建，不放数据库密码或服务端密钥。

完成后运行类型、测试与构建检查，见[调试与验证](./testing)。
