# HoHu Website & Documentation

English | [简体中文](./README.zh-CN.md)

The official website and documentation for **HoHu**, an AI-native enterprise application platform. This repository contains the VitePress site, with guides for users, developers and operators in English and Simplified Chinese.

[Website](https://hohu.org/) · [English documentation](https://hohu.org/guide/user/) · [中文文档](https://hohu.org/zh/guide/user/)

## Getting started

Use **Node.js 22** and **pnpm 10**, matching the CI environment.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Build and preview the static site:

```bash
pnpm build
pnpm preview
```

## Project structure

```text
docs/guide/       English guides
docs/zh/guide/    Simplified Chinese guides
docs/.vitepress/ Site configuration, theme and shared navigation
docs/public/     Static assets
examples/        Source code shared by tutorial pages
scripts/         Documentation and site validation tools
tests/           Site and tutorial example tests
```

## Checks

Run these checks before submitting a change:

```bash
pnpm test
pnpm lint
pnpm fmt:check
pnpm build
pnpm docs:check-dist
pnpm docs:check-seo
```

The build checks page metadata, local links and translation review records. The remaining site checks validate the generated pages, links, assets and SEO metadata.

## Contributing

Maintain English and Chinese pages together. Add new pages to the shared navigation in `docs/.vitepress/navigation.mjs`.

After editing, run `pnpm fmt` and review both language versions. Record the reviewed page pairs explicitly, for example:

```bash
pnpm docs:review user/settings reference/settings
```

Paths are relative to `guide/`; use `index` for the homepage. This command records your review and does not generate translations.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution requirements, including DCO sign-off.

## License

[Apache License 2.0](./LICENSE), except where otherwise noted. See [NOTICE](./NOTICE) for prior-version licensing and third-party notices.
