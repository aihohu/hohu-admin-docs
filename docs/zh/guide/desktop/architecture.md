---
title: 桌面端架构
description: 了解 HoHu 桌面端的 main、preload、renderer 分层、主进程会话、受限请求和可信 IPC 扩展方式。
---

# 桌面端架构

桌面端分为 main、preload、renderer 三层，共享类型放在 `src/shared/types.ts`。业务页面不直接使用 Node.js 或 Electron 模块。

## 目录与调用链

| 目录                  | 职责                                     |
| --------------------- | ---------------------------------------- |
| `src/main/services/`  | 窗口、会话、网络、存储和系统能力         |
| `src/main/ipc/`       | 校验调用来源和参数，调用主进程服务       |
| `src/preload/`        | 通过 contextBridge 暴露有限的 window.api |
| `src/renderer/src/`   | Vue 页面、路由、状态和业务请求           |
| `src/shared/types.ts` | 主进程与渲染层共同使用的桥接类型         |

请求链路为：Vue 页面 → 统一 request → `window.api.auth.request` → IPC → 主进程会话与网络服务 → 配置的后端。

主窗口启用 `sandbox`、`contextIsolation`，关闭 `nodeIntegration` 与 `webviewTag`。preload 构建为可用于沙箱的 CJS。新窗口和页面导航受限制；不要为了接入业务关闭这些边界。

## 认证与业务请求

| 桥接方法                 | 用途                                                                 |
| ------------------------ | -------------------------------------------------------------------- |
| `auth.login(input)`      | 使用 userName、password 和可选 tenantCode 登录，返回 success/message |
| `auth.getSessionState()` | 返回 authenticated 状态，不返回 token                                |
| `auth.request(config)`   | 经主进程会话访问固定后端                                             |
| `auth.logout()`          | 清理本机会话并尝试远程注销                                           |

access token 和 refresh token 留在主进程，通过 safeStorage 存储；刷新由主进程合并并发处理。渲染层不读取凭据，也不设置 Authorization。当前不再暴露 `window.api.http` 或 `window.api.secureStore`。

业务页面沿用 `src/renderer/src/service/request/` 的统一封装，API 文件使用 `/business/notes` 这样的路径。底层 auth.request 返回 HTTP 响应，统一业务 request 再解包 `{code, msg, data}` 并返回 `{data, error}`；直接调用桥接可能抛异常，按调用方式处理失败。

主进程仅允许配置 origin 下的路径，拒绝绝对 URL、重定向和越界路径；认证专用接口由会话服务调用。可透传的请求头、方法、正文大小和超时也受限制。更换服务使用 `MAIN_VITE_BACKEND_ORIGIN`，不要从渲染层传任意服务地址。

## 新增一个 IPC 能力

以只读的 greet 为例，先在 `src/shared/types.ts` 的已有 `AppApi` 中增加：

```typescript
greet: (name: string) => Promise<string>;
```

创建 `src/main/ipc/greet.ts`，复用可信调用校验并验证运行时输入：

```typescript
import { trustedHandle } from './security';

export function registerGreetIpc(): void {
  trustedHandle('greet', (_event, name: unknown) => {
    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 80) {
      throw new Error('Invalid name');
    }
    return `Hello, ${name.trim()}`;
  });
}
```

在 `src/main/ipc/index.ts` 导入并在已有 `registerAllIpc()` 内调用 `registerGreetIpc()`。在 `src/preload/index.ts` 的已有 api 对象中增加：

```typescript
greet: (name: string) => ipcRenderer.invoke('greet', name);
```

渲染层即可 `await window.api.greet('HoHu')`。`trustedHandle` 检查调用来自主窗口顶层的可信页面；TypeScript 类型不能替代运行时参数校验。不要暴露任意 channel 的 invoke，也不要直接注册无来源校验的 ipcMain.handle。

涉及文件、系统操作或网络的新能力，还需分别限制路径、操作类型与目标，并在主进程测试拒绝无效输入。事件订阅应返回取消函数，在 Vue 组件卸载时释放。
