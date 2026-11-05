# HoHu 官网与文档

[English](./README.md) | 简体中文

**HoHu** 是 AI 原生企业应用平台。本仓库使用 VitePress 构建 HoHu 官网和文档站，提供面向用户、开发者和运维人员的中英文指南。

[官网](https://hohu.org/) · [中文文档](https://hohu.org/zh/guide/user/) · [English documentation](https://hohu.org/guide/user/)

## 本地运行

使用 **Node.js 22** 和 **pnpm 10**，与 CI 环境保持一致。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

构建并预览静态站点：

```bash
pnpm build
pnpm preview
```

## 项目结构

```text
docs/guide/       英文指南
docs/zh/guide/    简体中文指南
docs/.vitepress/ 站点配置、主题与共享导航
docs/public/     静态资源
examples/        教程页面共用的示例源码
scripts/         文档与站点检查工具
tests/           站点与教程示例测试
```

## 质量检查

提交修改前运行：

```bash
pnpm test
pnpm lint
pnpm fmt:check
pnpm build
pnpm docs:check-dist
pnpm docs:check-seo
```

构建会检查页面元数据、本地链接与翻译审核记录。其余站点检查会核对生成页面、链接、资源及 SEO 元数据。

## 参与贡献

### 文档系列

[系列目录](https://hohu.org/zh/guide/series/)区分正常维护的 0.1 手册和未发布的 0.2 候选。既有任务 URL 固定归属 0.1，不改作下一系列的正文。新系列内容放在 `guide/series/<major.minor>/`，同时维护中文页面并明确发布状态。0.2 目录目前覆盖字段策略与升级恢复边界，尚非完整通用手册。

页面在 `navigation.mjs` 登记，双语审核后保留旧入口和章节锚点。不可变产品清单固定发布时文档，后续文字修订不改写该快照。`series.mjs` 单独标识跨系列状态页和候选入口。

部署包含两系列的完整已检查站点。SSH 发布器在切换前核验系列文件，切换后核验 HTTP；失败恢复原站。回退包也必须含系列入口，因此回退较早修订时应先重建保留系列页面的包，不能只部署最新目录。验收保存在其他本地目录的构建时，为产物和 SEO 检查设置 `DOCS_DIST_DIR`。

中英文页面成对维护。新增页面时，将其加入 `docs/.vitepress/navigation.mjs` 中的共享导航。

修改后运行 `pnpm fmt`，核对两种语言的内容，再显式记录已审核的页面，例如：

```bash
pnpm docs:review user/settings reference/settings
```

页面路径相对 `guide/`，首页使用 `index`。该命令只记录审核结果，不会生成翻译。

贡献要求（包括 DCO 签署）见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 许可证

除另有声明外，采用 [Apache License 2.0](./LICENSE)。历史版本许可及第三方声明见 [NOTICE](./NOTICE)。
