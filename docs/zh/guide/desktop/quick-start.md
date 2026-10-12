---
title: 桌面端开发
description: 启动 HoHu Electron 客户端，配置 MAIN_VITE_BACKEND_ORIGIN，运行类型与服务测试，并准备桌面安装包。
---

# 桌面端开发

先准备可访问的 HoHu 后端和有效账号。桌面仓库要求 Node.js >= 20.19、pnpm >= 10.5；可与 Web 开发统一使用 Node.js 22.12 或更高的兼容版本，并以当前依赖 engines 为准。

## 1. 获取并安装

```bash
git clone https://github.com/aihohu/hohu-admin-desktop.git
cd hohu-admin-desktop
pnpm install
```

后续命令均在该目录执行。后端准备方式见[开发环境](../quick-start)。

## 2. 指定后端

在桌面项目 `.env.development` 中配置主进程服务地址：

```dotenv
MAIN_VITE_BACKEND_ORIGIN=http://127.0.0.1:8000
```

此值是 origin，只包含协议、主机和可选端口，不带 `/api` 路径、查询参数或账号密码。开发模式允许 localhost / 127.0.0.1 的 HTTP；生产必须使用 HTTPS。

修改后重启客户端。当前认证与请求由主进程管理，旧的 `RENDERER_VITE_SERVICE_BASE_URL` 不用于选择认证后端。发布时在 `.env.production` 配置自己的 HTTPS origin，不沿用框架默认地址。

## 3. 运行与检查

```bash
pnpm dev
```

使用该后端已有账号登录，验证用户信息、菜单和退出登录。桌面应用不会自行初始化后端管理员密码。

| 命令                | 用途                             |
| ------------------- | -------------------------------- |
| `pnpm dev`          | 启动 electron-vite 开发模式      |
| `pnpm typecheck`    | 检查主进程与 Vue 类型            |
| `pnpm test`         | 运行主进程服务测试               |
| `pnpm lint`         | ESLint 检查                      |
| `pnpm fmt`          | 检查格式                         |
| `pnpm build`        | 类型检查并构建到 out             |
| `pnpm start`        | 预览已构建应用；先运行 build     |
| `pnpm build:unpack` | 生成用于本机验证的未安装打包应用 |

## 4. 准备安装包

| 目标平台 | 命令                                         |
| -------- | -------------------------------------------- |
| Windows  | `pnpm build:win`                             |
| macOS    | `pnpm build:mac`                             |
| Linux    | `pnpm build:linux`，当前配置 AppImage 与 deb |

平台脚本先运行 `gen-publish`，再使用生成的 `build/electron-builder.yml` 打包。更新源配置读取项目根 `.env` 或进程环境：

| 发布方式     | 配置                                             |
| ------------ | ------------------------------------------------ |
| GitHub       | `UPDATER_PROVIDER=github`、`GH_OWNER`、`GH_REPO` |
| 自建文件服务 | `UPDATER_PROVIDER=generic`、`UPDATER_URL`        |

这些配置指向你维护的发行源；产物位置以构建输出为准。本地先用 build:unpack 验证，正式发布再配置应用标识、图标、签名与更新源。当前 macOS 配置未启用 notarization，不能把开发打包结果直接视为已完成发行认证。

安装包、更新元数据和更新源需要配套发布，并在目标操作系统验证安装、登录、退出与升级。功能接入见[桌面端功能](./features)。

## 排错

| 现象                         | 检查                                                                  |
| ---------------------------- | --------------------------------------------------------------------- |
| 后端地址被拒绝               | 是否使用 MAIN_VITE_BACKEND_ORIGIN，是否含路径，生产是否 HTTPS         |
| 页面请求绝对 URL 失败        | 业务请求使用 `/business/...` 等相对后端路径，见[架构](./architecture) |
| 登录不能保持                 | 主进程日志、safeStorage 可用性与 userData 写权限                      |
| build:win 等提示发布配置缺失 | 补齐更新源配置，或先用 build:unpack 本地验证                          |
| 开发模式不检查更新           | 开发更新配置可能为占位地址，使用真实更新源和打包应用验证              |
