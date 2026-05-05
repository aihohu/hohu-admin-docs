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
- 新增文档页面：创建 `.md` 文件 → 添加 frontmatter `title` 和 `description` → 在 `config.mts` 的 `sidebar` 中添加条目。**每个页面必须有 `description`**，用于 SEO
- 首页组件在 `docs/.vitepress/theme/index.ts` 全局注册，不使用外部 UI 库（原生 HTML + scoped CSS）
- 组件颜色通过 `style.css` 中的 `--landing-*` CSS 自定义属性控制，自动适配明暗主题
- 文档面向开发者，中文撰写
