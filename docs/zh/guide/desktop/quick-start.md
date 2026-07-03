---
title: 桌面端快速上手
description: 5 分钟从 clone 到运行，包含开发、打包、添加第一个 IPC 通道的完整流程
---

# 快速上手

## 1. 环境要求

- **Node.js** ≥ 20.19
- **pnpm** ≥ 10.5
- macOS / Windows / Linux 任一桌面系统

## 2. Clone & 安装

```bash
git clone https://github.com/aihohu/hohu-admin-desktop.git
cd hohu-admin-desktop
pnpm install
```

## 3. 启动开发模式

```bash
pnpm dev
```

启动后：
- Electron 主窗口打开（默认 1280×800）
- 渲染层在 `http://localhost:5173`（内部 Vite dev server）
- 主进程改动**需要重启 dev**（HMR 只覆盖渲染层）

> macOS 第一次启动会弹通知权限请求，允许后系统通知才能用。

## 4. 配置后端地址

编辑 `.env.development`：

```bash
RENDERER_VITE_SERVICE_BASE_URL=http://127.0.0.1:8000
```

dev 模式下，渲染层的请求会通过主进程的 `net` 模块转发到这个地址，**完全绕开 CORS** —— 后端不需要为前端单独配置 CORS。

## 5. 第一个 IPC 通道（Hello World）

桌面端的核心模式：**渲染层调主进程能力，必须经 typed IPC**。下面演示加一个 `greet` 通道。

### 5.1 定义类型

编辑 `src/shared/types.ts`，给 `AppApi` 加一个新接口：

```ts
export interface GreetApi {
  greet: (name: string) => Promise<string>
}

export interface AppApi {
  // ... 已有字段
  greet: GreetApi
}
```

### 5.2 注册主进程 handler

新建 `src/main/ipc/greet.ts`：

```ts
import { ipcMain } from 'electron'

export function registerGreetIpc(): void {
  ipcMain.handle('greet', async (_e, name: string) => {
    return `Hello, ${name}!`
  })
}
```

在 `src/main/ipc/index.ts` 的 `registerAllIpc()` 里调一次：

```ts
registerGreetIpc()
```

### 5.3 Preload 暴露

编辑 `src/preload/index.ts`，加一个 bridge 对象并放进 `api`：

```ts
const greet = {
  greet: (name: string): Promise<string> => ipcRenderer.invoke('greet', name)
} as const

const api = {
  // ... 已有字段
  greet
}
```

### 5.4 渲染层调用

任意 `.vue` / `.ts`：

```ts
const msg = await window.api.greet.greet('World')
console.log(msg) // "Hello, World!"
```

完整类型推断链路：`window.api.greet.greet` 的参数和返回值都被 TypeScript 严格检查，调用方传错类型立刻报红。

## 6. 打包

```bash
pnpm build:mac    # 出 .dmg
pnpm build:win    # 出 .exe（NSIS 安装包）
pnpm build:linux  # 出 .AppImage / .deb / .snap
```

产物在 `release/` 目录。

**首次 macOS 打包可能弹钥匙串密码** —— electron-builder 默认会去查签名证书。如果不需要签名，本地测试可以输密码放行；正式发布需要自配 Apple Developer ID。

## 7. 下一步

- [架构详解](./architecture) —— 理解三进程、请求层、Token 存储
- [已实现特性](./features) —— 看 Phase 1 + Phase 2 都内置了什么
- [CLAUDE.md](https://github.com/aihohu/hohu-admin-desktop/blob/main/CLAUDE.md) —— 仓库内的开发指南和踩坑记录
