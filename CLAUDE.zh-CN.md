# CLAUDE.zh-CN.md

Claude Code 在 hohu-admin-docs 项目中工作时的指导（中文版）。

## 常用命令

```bash
pnpm dev                  # VitePress 开发服务器
pnpm build                # 构建静态站点
pnpm lint                 # oxlint + ESLint 检查
pnpm lint:fix             # 自动修复 lint 问题
pnpm fmt                  # 格式化全部文件（oxfmt，非 Prettier）
```

## 开发约束

- **格式化**: 使用 oxfmt，Prettier 已禁用。单引号、无尾逗号、行宽 120、2 空格缩进
- **Lint**: oxlint + ESLint 9 flat config。提交前确保 `pnpm lint` 和 `pnpm fmt:check` 通过
- **ESM**: `package.json` 中 `"type": "module"`，配置文件使用 ESM 语法

## VitePress 约定

- 配置文件：`docs/.vitepress/config.mts`
- 新增文档页面：创建中英文 `.md` → 添加 frontmatter `title` 和 `description` → 在 `navigation.mjs` 中登记共享路由。**每个页面必须有 `description`**，用于 SEO
- 首页组件在 `docs/.vitepress/theme/index.ts` 全局注册，不使用外部 UI 库（原生 HTML + scoped CSS）
- 首页使用组件内的 `--home-*` 与 VitePress 主题变量；检查浅色和暗色下的可读性。
- 文档面向使用者、部署者和开发者，中英文成对维护，遵循 [DOCUMENTATION.md](./DOCUMENTATION.md)。
- 原有 URL 保持稳定；导航与发布清单由 `navigation.mjs` 维护，逐页搜索元数据由 `seo.mjs` 生成。正式手册不显示通用开发版本横幅。
- 审核两种语言后执行 `pnpm docs:review <guide-path>`，不能批量更新摘要掩盖过期翻译。
- 个人草稿放在构建源目录以外的 `.local/docs/`；必要的架构与安全决策仍公开维护。
- 验证 `pnpm test`、`pnpm lint`、`pnpm fmt:check`、`pnpm build`、`pnpm docs:check-dist` 和 `pnpm docs:check-seo`。
