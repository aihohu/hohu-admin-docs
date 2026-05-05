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
- Adding a new page: create `.md` file → add frontmatter `title` and `description` → add entry to `sidebar` in `config.mts`. **Every page must have a `description`** for SEO
- Homepage components are globally registered in `docs/.vitepress/theme/index.ts`, no external UI library (raw HTML + scoped CSS)
- Component colors use `--landing-*` CSS custom properties defined in `style.css`, auto-adapting to light/dark theme
- Documentation targets developers, written in Chinese
