# CLAUDE.md

Guidelines for Claude Code when working in the hohu-admin-docs project.

## Commands

```bash
pnpm dev                  # VitePress dev server
pnpm build                # Build static site
pnpm lint                 # oxlint + ESLint check
pnpm lint:fix             # Auto-fix lint issues
pnpm fmt                  # Format all files (oxfmt, not Prettier)
```

## Development Constraints

- **Formatting**: Use oxfmt. Prettier is disabled. Single quotes, no trailing commas, print width 120, 2-space indent
- **Lint**: oxlint + ESLint 9 flat config. Ensure `pnpm lint` and `pnpm fmt:check` pass before committing
- **ESM**: `"type": "module"` in `package.json` — config files use ESM syntax

## VitePress Conventions

- Config file: `docs/.vitepress/config.mts`
- Adding a new page: create both language `.md` files → add frontmatter `title` and `description` → register the shared route in `navigation.mjs`. **Every page must have a `description`** for SEO
- Homepage components are globally registered in `docs/.vitepress/theme/index.ts`, no external UI library (raw HTML + scoped CSS)
- Homepage colors use scoped `--home-*` tokens and VitePress theme variables; verify light and dark appearance
- Documentation serves users, deployers and developers in paired Chinese and English pages. Follow [DOCUMENTATION.md](./DOCUMENTATION.md).
- Navigation and published page inventory are shared in `docs/.vitepress/navigation.mjs`. Keep existing URLs stable.
- Run `pnpm test`, `pnpm lint`, `pnpm fmt:check`, `pnpm build`, `pnpm docs:check-dist`, and `pnpm docs:check-seo` after changes.
- Review both languages before recording a pair with `pnpm docs:review <guide-path>`. Never refresh every hash to hide stale translations.
- Keep personal drafts outside the site source in ignored `.local/docs/`. Necessary public decisions remain in the code repository.
