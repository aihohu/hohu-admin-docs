---
title: 桌面端功能
description: 按场景接入 HoHu 桌面端托盘、快捷键、通知、主题、更新和日志，并验证目标平台上的实际行为。
---

# 桌面端功能

桌面能力通过 `window.api` 调用主进程。完整类型位于 `src/shared/types.ts`，设置抽屉位于 `src/renderer/src/layouts/modules/settings/SettingsDrawer.vue`。

## 能力速查

| 能力       | 入口                      | 接入要点                                          |
| ---------- | ------------------------- | ------------------------------------------------- |
| 托盘       | api.tray 与设置抽屉       | 配置关闭窗口是否收起到托盘，验证退出行为          |
| 全局快捷键 | api.shortcuts             | 读取和更新已定义 action 的快捷键；注册冲突会失败  |
| 系统通知   | api.notification          | title、body、category；遵循应用设置与系统通知权限 |
| 原生主题   | api.theme.setNativeSource | system、light、dark，与页面主题配套               |
| 外部链接   | api.shell.openExternal    | 仅允许不含账号密码的 HTTPS URL                    |
| 更新       | api.updater               | 检查、下载、安装及状态订阅                        |
| 日志       | api.logger.error / warn   | 脱敏后记录错误或警告，不作为任意 console 转发     |
| 应用信息   | api.app                   | 供设置中的版本与应用操作使用                      |

## 显示系统通知

下面是渲染层异步事件处理函数内的调用片段：

```typescript
await window.api.notification.show({
  title: 'Export completed',
  body: 'Check the export result in the application.',
  category: 'general'
});
```

实际产品文案从语言资源读取。渲染层 payload 不接受任意 source 或 actionId；通知来源与点击动作由主进程控制。通知被禁用或系统抑制时，业务结果仍应在应用页面可见。

## 主题与快捷键

页面主题与原生主题需要同步，不能只修改 CSS。切换深浅色和跟随系统时，检查窗口、菜单、弹窗与表格。

快捷键只绑定主进程预定义 action。更新接口返回 false 时提示冲突并保留可用配置；不要让用户认为保存成功就一定注册成功。

## 更新与发行

更新功能依赖真实的发行源和匹配版本的元数据。设置中可控制自动下载，用户也可手动检查；后台检查有节流，开发占位配置不会提供真实更新。

先按[桌面端开发](./quick-start)配置更新源，再使用两个版本的实际安装包验证：发现更新、下载进度、取消或错误恢复、安装以及更新后的登录。不同操作系统的签名、通知与安装行为需要分别验证。

订阅更新状态时保留返回的取消函数，在组件卸载时执行，避免设置抽屉反复打开后重复处理事件。

## 会话存储与日志

会话由主进程维护，密文保存于应用 userData 下的 `secure-store.json`，通过 Electron safeStorage 加解密。可用性取决于操作系统环境与密钥服务，尤其需要在目标 Linux 环境验证。渲染层没有通用凭据读取接口。

排错收集版本、操作步骤与脱敏日志即可，不记录密码、token 或完整业务敏感数据。认证与请求边界见[桌面端架构](./architecture)。
