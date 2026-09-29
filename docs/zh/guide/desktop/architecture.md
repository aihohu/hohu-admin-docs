---
title: 桌面端架构
description: 三进程模型、请求层、typed IPC、Token 存储和安全模型的完整设计说明
---

# 架构详解

## 🏗️ 三进程模型

```
┌─────────────────────────────────────────────────┐
│  Main Process（main/）                          │
│  - Node.js 运行时                               │
│  - 服务单例：WindowManager / TrayManager /     │
│    ShortcutManager / UpdaterManager /          │
│    NotificationManager                          │
│  - HTTP 转发（net 模块）                        │
│  - 加密存储（safeStorage）                      │
└──────────────┬──────────────────────────────────┘
               │ ipcMain.handle / webContents.send
               │
┌──────────────┴──────────────────────────────────┐
│  Preload（preload/）                             │
│  - contextBridge.exposeInMainWorld('api', ...) │
│  - 白名单方法，typed                            │
│  - sandboxed（contextIsolation: true）         │
└──────────────┬──────────────────────────────────┘
               │ window.api.*
               │
┌──────────────┴──────────────────────────────────┐
│  Renderer（renderer/）                           │
│  - 浏览器环境（Vue 3 + NaiveUI + Pinia）       │
│  - 只能通过 window.api 调主进程能力            │
│  - 无 Node API（contextIsolation）             │
└─────────────────────────────────────────────────┘
```

`src/shared/types.ts` 是三个进程共享的类型契约源。

## 🌐 请求层：所有 HTTP 走主进程

**为什么不在渲染层直接用 axios**？

- 浏览器 CORS 在 dev 模式下会让你抓狂（electron-vite 的 `server.proxy` 还有 [bug](https://github.com/alex8088/electron-vite/issues/631)）
- 主进程的 `net` 模块是 Electron 原生 API，**不受 CORS 限制**
- 集中日志、统一鉴权头、统一错误处理

**调用链**：

```
renderer               preload                  main
fetchXxx()  ──→  window.api.http.request(cfg)  ──→  net.request()
                                                       │
                  { data, error }   ←────────────────  │
                                                       ↓
                                                    后端 API
```

渲染层用 flat result shape：

```ts
const { data, error } = await fetchUserInfo();
if (error) {
  // 错误处理
} else {
  // 用 data
}
```

不需要 try/catch —— 错误是返回值而不是异常。Token 过期自动 single-flight 刷新 + 重试一次。

详见 [`src/main/services/http.ts`](https://github.com/aihohu/hohu-admin-desktop/blob/main/src/main/services/http.ts) 和渲染层 [`service/request/factory.ts`](https://github.com/aihohu/hohu-admin-desktop/blob/main/src/renderer/src/service/request/factory.ts)。

## 🔐 Token 存储与钥匙串 {#token-存储与钥匙串}

**Token 永远不进 localStorage**。

- 用 Electron 的 `safeStorage` 加密：底层是 macOS Keychain / Windows DPAPI / Linux libsecret
- 文件落地：`userData/secure-store.json`（权限 0600）
- 渲染层通过 `window.api.secureStore.get/set/delete/clear` 调用（IPC）

```ts
// 渲染层用法
await window.api.secureStore.set('token', authToken);
const token = await window.api.secureStore.get('token');
```

登出时调 `clear()`，文件清空。Token refresh 由 `service/request/index.ts` 中央化处理：expired-token code 触发单飞 refresh，并发请求共享同一个 refresh Promise，retry 一次。

## 📡 Typed IPC 桥

**单一类型来源**：所有跨进程类型定义在 `src/shared/types.ts`，三个进程都通过 `@shared/types` 别名导入。

**白名单暴露**：preload 用 `contextBridge.exposeInMainWorld('api', api)`，`api` 对象的字段是**所有允许渲染层调用的 IPC**。**绝不直接暴露 `ipcRenderer`**。

**加新通道的固定流程**：

1. 在 `src/shared/types.ts` 定义 interface 并 extend `AppApi`
2. 在 `src/main/ipc/<name>.ts` 用 `ipcMain.handle` 注册
3. 在 `src/main/ipc/index.ts` 的 `registerAllIpc()` 调一次
4. 在 `src/preload/index.ts` 加一个 `as const` 的 bridge 对象放进 `api`

详见 [快速上手 - 第一个 IPC 通道](./quick-start#_5-第一个-ipc-通道-hello-world)。

## 🛡️ 安全模型

| 防护层               | 配置                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| **contextIsolation** | `true`（默认）—— preload 与 renderer 隔离                                                        |
| **nodeIntegration**  | `false`（默认）—— 渲染层无 Node API                                                              |
| **sandbox**          | `false`（当前）—— preload 可用 Node API                                                          |
| **CSP**              | 在 `src/renderer/index.html` 配置 —— 加新域名（CDN / WebSocket）需更新 `connect-src` / `img-src` |
| **外链**             | 走 `shell.openExternal`，可加协议白名单                                                          |
| **DevTools**         | dev 模式 F12 切换；prod 自动禁用                                                                 |

## 📁 路径别名

| 别名            | 解析到                            | 用途                               |
| --------------- | --------------------------------- | ---------------------------------- |
| `@renderer/*`   | `src/renderer/src/*`              | 渲染层                             |
| `@shared/*`     | `src/shared/*`                    | main / preload / renderer 三方共享 |
| `@main/*`       | `src/main/*`                      | 主进程                             |
| `@resources/*`  | `resources/*`                     | 静态资源（图标等）                 |
| `@iconify-json` | `node_modules/@iconify/json/json` | 图标                               |

配置在 `tsconfig.{node,web}.json` 和 `electron.vite.config.ts`。

## 📚 更多

- [已实现特性](./features) —— 看每个 manager 具体做了什么
- [CLAUDE.md 的 Common Pitfalls](https://github.com/aihohu/hohu-admin-desktop/blob/main/CLAUDE.md) —— 必读，避坑指南
- [framework-design.md](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/framework-design.md) —— 完整设计稿
