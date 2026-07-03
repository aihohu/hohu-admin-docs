---
title: 桌面端介绍
description: hohu-admin-desktop 是 hohu 生态的 Electron + Vue 3 桌面应用框架，专注做 web 做不到的事 —— 托盘、全局快捷键、系统通知、自动更新、OS 钥匙串
---

# 桌面端介绍

### hohu 生态的桌面端成员

**hohu-admin-desktop** 是 [hohu 生态](https://github.com/aihohu)的 Electron + Vue 3 桌面应用框架，与 [hohu-admin-web](https://github.com/aihohu/hohu-admin-web)（浏览器端）、[hohu-admin-app](https://github.com/aihohu/hohu-admin-app)（移动端）共用同一个 [FastAPI 后端](https://github.com/aihohu/hohu-admin)。

**定位**：开发者脚手架，不是终端用户产品。开发者 clone 它来构建自己的桌面应用，自带完整的 hohu-admin 后端集成。

## 🎯 为什么需要桌面端

桌面端**只在 web 做不到或体验差的地方发力**。它能做的事：

- 🖥️ **系统托盘 + 关闭到托盘** —— 后台常驻，右键菜单快捷操作
- ⌨️ **全局快捷键** —— `Cmd/Ctrl+Shift+H` 一键呼出窗口，无需切到浏览器
- 🔔 **系统通知** —— 真正的系统级通知（web Notification API 受限多），最小化时也能弹
- 🔄 **自动更新** —— electron-updater 静默检查、后台下载、退出时安装
- 🔐 **OS 钥匙串存储** —— Token 存在 Keychain（macOS）/ DPAPI（Windows）/ libsecret（Linux），不进 localStorage
- 🌐 **绕开 CORS** —— HTTP 请求走主进程的 `net` 模块转发，dev 模式也无需后端配 CORS

**不做的事**：完整复制 web 后台所有页面、数据可视化大屏、CRUD 表格 —— web 已经做得更好，桌面端重复就是浪费。

## 🛠️ 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Electron 39 / electron-vite 5 |
| 渲染层 | Vue 3.5 / TypeScript 5.9 / NaiveUI / Pinia 3 / Vite 7 |
| 构建 | electron-builder（NSIS / DMG / AppImage）|
| 主进程库 | electron-store / electron-log / electron-updater |
| 类型契约 | `src/shared/types.ts` —— main / preload / renderer 共享 |

## 📦 三进程架构

```
src/
├── main/         # 主进程（Node.js 运行时）
│   ├── services/ # 单例服务（window/tray/shortcut/updater/notification/...）
│   └── ipc/      # ipcMain.handle 注册（typed）
├── preload/      # 预加载脚本（沙箱桥）
└── renderer/     # 渲染进程（浏览器环境，复用 hohu-admin-web 的代码模式）
└── shared/       # 跨进程类型定义
```

关键约束：
- **所有 HTTP 走主进程**（renderer 不发 axios，调 `window.api.http.request()` → IPC → main `net.request`）
- **所有 Token 走 OS 钥匙串**（不进 localStorage）
- **typed IPC**（`shared/types.ts` 是单一来源，preload 通过 `contextBridge` 暴露白名单）

## 📚 更多

- [快速上手](./quick-start) —— 5 分钟跑起来
- [架构详解](./architecture) —— 三进程、请求层、IPC、安全
- [已实现特性](./features) —— Phase 1 + Phase 2 完整清单
- [源码仓库](https://github.com/aihohu/hohu-admin-desktop)
