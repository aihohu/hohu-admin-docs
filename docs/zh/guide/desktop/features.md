---
title: 桌面端已实现特性
description: 了解 HoHu 桌面端的请求与认证、路由、存储、窗口、自动更新和通知能力及平台限制。
---

# 已实现特性

> 完整 roadmap 与设计理由见仓库内的 [`docs/framework-design.md`](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/framework-design.md)。本页是面向使用者的概览。

## 基础能力

### 请求层（HTTP 走主进程）

- 渲染层所有 HTTP 请求经主进程 `net` 模块转发，**绕开 CORS**
- Flat result shape：`{ data, error }`，无需 try/catch
- Token 过期自动 single-flight refresh + retry 一次
- `X-Request-Id` 自动注入用于链路追踪

### 鉴权（JWT + Keychain）

- 登录 / refreshToken / getUserInfo 完整流程
- Token 用 `safeStorage` 加密落盘到 `userData/secure-store.json`
- 永远不进 localStorage
- 详见：[架构 - Token 存储](./architecture#token-存储与钥匙串)

### 动态路由 + RBAC

- 后端拉菜单（dynamic mode）/ 前端写死（static mode）双模切换
- glob 组件映射 + memory history
- `v-permission` 指令、`hasAuth()` 函数、`TableHeaderOperation` 三层按钮级权限
- 图标懒加载（按需拉 iconify json）

### 布局 + 主题 + i18n

- 暗黑模式（同步到 `nativeTheme`，影响原生标题栏 / scrollbar）
- 主色定制
- 中英文（zh-cn / en-us）
- 面包屑 / Sider 折叠

---

## 桌面集成

### 日志 + 本地存储

- **electron-log**：main / preload / renderer 三进程统一日志，写文件到 `~/Library/Logs/{appName}/`（macOS）
- **electron-store**：非敏感配置（窗口状态、快捷键、托盘行为、通知开关等）持久化到 `userData/config.json`
- ESM 切换：项目 `"type": "module"`，主进程输出 ESM

> 详见 [spec-phase2.1](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/spec-phase2.1-logging-store.md)

### 窗口 / 托盘 / 全局快捷键

- **WindowManager**：单例管理主窗口，窗口状态（位置、大小、最大化、全屏）跨重启持久化
- **TrayManager**：托盘图标 + 右键菜单（Show/Hide / Reload / DevTools / Check for Updates / Quit），关闭按钮缩到托盘而不是退出
- **ShortcutManager**：全局快捷键（默认 `Cmd/Ctrl+Shift+H` 呼出主窗口），可配置
- **shortcuts IPC**：渲染层通过 `window.api.shortcuts.{list, update}` 读取 / 更新快捷键

> 详见 [spec-phase2.2](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/spec-phase2.2-window-tray-shortcut.md)

### 自动更新

- **electron-updater v6** 封装为 `UpdaterManager` 单例
- 双 provider：GitHub Releases（默认）/ Generic（任意静态 URL，需提供 `latest.yml`）
- **构建时决定 provider**：`.env` 设 `UPDATER_PROVIDER=github|generic`，由 `scripts/gen-publish-config.mjs` 注入到打包配置
- **24h 限频**：启动后台检查通过 `store.updater.lastCheck` 节流；手动入口（托盘菜单「Check for Updates...」）绕过限频
- **skipVersion**：用户跳过某版本，下次不再提示直到更高版本发布
- 系统通知（下载完成时弹一次，点击聚焦主窗口）
- dev 模式读 `dev-app-update.yml`，命中占位 URL 自动跳过避免日志噪音

> 详见 [spec-phase2.3](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/spec-phase2.3-auto-update.md)

### 系统通知分发器

- **NotificationManager 单例**：所有 `new Notification()` 调用必须经此入口 —— 一处 mute、一处日志、一处改行为
- **渲染层 IPC 推送**：`window.api.notification.show({ source, category, title, body, actionId? })`，让渲染层能弹系统通知（web 做不到）
- **全局 mute**：复用 `store.notifications.enabled`，一处关闭所有来源
- **action 钩子**：payload 的 `actionId` 可选；不传 = 默认聚焦主窗口，传了则调主进程 `notificationManager.registerAction(id, fn)` 注册的回调
- **GC 持引用**：`activeNotifications: Set<Notification>` 持强引用到通知关闭，防止 V8 GC 吞 click handler
- **source 前瞻性预留**：`'system' | 'renderer' | 'backend'`，今天用前两个，等后端通知模块落地后加 `BackendNotificationConsumer`

> 详见 [spec-phase2.4](https://github.com/aihohu/hohu-admin-desktop/blob/main/docs/spec-phase2.4-notification-dispatcher.md)

---

## 平台限制

| 平台    | 自动更新                                                                       | 系统通知                                   |
| ------- | ------------------------------------------------------------------------------ | ------------------------------------------ |
| Windows | ✅ NSIS 开箱即用                                                               | ✅                                         |
| macOS   | ⚠️ 需代码签名（Developer ID Application 证书），未签名则能检测能下载但安装被拒 | ✅                                         |
| Linux   | ✅ AppImage（deb / snap 不支持自动更新）                                       | ⚠️ 需 libnotify，容器 / 无桌面环境会 no-op |

公证（notarization）是 Apple 对**首次分发**的独立要求，与自动更新流程无关。两者都不在框架默认配置中 —— 开发者发布自家应用时需自行配置。

---

## 适用边界

以下功能**故意没做**，等真有需求再加：

- 通知历史 / 通知中心（系统通知中心已有）
- 通知分类静音、dedup、限频、自定义 action buttons（Reply / Snooze）
- 渲染层「设置页」UI
- Beta 通道 / 预发布过滤
- AI 对话模块、AI 桌面场景（悬浮窗 / 划词 / 截图）
- 完整复制 web 后台所有页面 —— 浪费
- 数据可视化大屏、CRUD 表格 —— web 端更好

---

## 工程化

- ✅ ESLint + Prettier（对齐 web 的 oxfmt 配置）
- ✅ TypeScript 严格模式 + 分包 tsconfig（node / web / shared）
- ✅ Conventional Commits + commitlint + simple-git-hooks
- ✅ GitHub Actions CI（typecheck / lint / fmt，PR 触发）
- ✅ Release workflow（三平台构建，tag 触发）
- ✅ 路径别名（`@renderer` / `@shared` / `@main` / `@resources` / `@iconify-json`）
- ✅ `node:test` + tsx 纯函数单测
