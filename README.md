# hohu-admin-docs

HoHu 企业应用平台官网，以及使用、开发、部署与参考文档。中文位于 `docs/zh/guide/`，英文位于 `docs/guide/`，已有页面 URL 保持稳定。

## 本地维护

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm lint
pnpm fmt:check
pnpm build
pnpm docs:check-dist
pnpm docs:check-seo
```

`pnpm build` 先检查公开页面清单、标题/描述、本地链接和双语审核摘要。导航与公开清单统一在 `docs/.vitepress/navigation.mjs`；构建排除规则在 `release.mjs`，逐页搜索元数据在 `seo.mjs`。本站 package.json 版本不代表产品版本。

修改页面后，先运行 `pnpm fmt`，审核中英文内容一致，再显式更新该页面的摘要，例如：

```bash
pnpm docs:review user/settings reference/settings
```

此命令只记录已审核的内容，不生成翻译。CI 不会自动更新摘要；修改任意语言后不审核另一版本会导致检查失败。页面路径相对 `guide/`，首页使用 `index`。

新页面同时创建两种语言并加入导航。不公开的草稿放在站点源目录之外的 `.local/docs/`；Git 忽略规则不等于网站构建排除。`pnpm docs:check-dist` 核对最终 HTML 清单、过程资料排除及许可副本。

`pnpm docs:check-seo` 检查逐页 canonical、双语 hreflang、分享元数据、站点地图、页面标题及本地链接和锚点。

正文归属、协作和发布要求见 [文档维护规则](DOCUMENTATION.md)。后端贡献、安全、迁移和 ADR 在代码仓库维护，本站通过链接引用，不再复制完整正文。

## 教程示例验证

业务便签教程的代码位于 `examples/notes/`，由中英文 Markdown 直接引用，避免复制代码后产生差异。

完整 Web 页面为 `index.vue`，请求为 `notes.ts`，语言资源为 `locales.ts`，后端菜单目录为 `menu_seed.py`。目标路径与全局语言类型/资源合并步骤见“新增业务模块”；AI 注册与确认验收见“让 AI 使用业务模块”。这些文件不自动安装到产品实例。

真实端到端验收必须通过 CLI 创建独立新项目，使用独立数据库、Redis 和端口。按两篇教程完成接线，并记录权限、确认与跨租户检查结果；静态类型检查和下面的内存测试不能替代该验收。

示例依赖后端实现，使用配套后端虚拟环境运行。Windows PowerShell（两个仓库位于同一目录）示例：

```powershell
$env:HOHU_BACKEND_PATH = (Resolve-Path ../hohu-admin).Path
../hohu-admin/.venv/Scripts/python.exe tests/test_notes_example.py
../hohu-admin/.venv/Scripts/python.exe tests/test_notes_ai_example.py
```

POSIX shell：

```bash
HOHU_BACKEND_PATH=../hohu-admin ../hohu-admin/.venv/bin/python tests/test_notes_example.py
HOHU_BACKEND_PATH=../hohu-admin ../hohu-admin/.venv/bin/python tests/test_notes_ai_example.py
```

测试仅使用内存 SQLite，验证服务层租户隔离、分页、输入校验、ID 序列化和回滚；不连接业务数据库，也不替代 PostgreSQL 迁移与 HTTP 权限集成测试。此跨仓库检查在更新教程示例时运行，本站 CI 的 `pnpm test` 不包含它。

## 许可证

本项目自 v1.0.0 起默认采用 [Apache License 2.0](./LICENSE)，另有声明的代码除外。此前版本曾以 MIT 发布，该授权对已分发副本继续有效。第三方代码保留各自许可和版权声明。详见 [NOTICE](./NOTICE)。
