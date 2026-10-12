---
title: hohu create — Create a project
description: Select Backend, Web and App with hohu create, choose GitHub or Gitee sources, create projects without prompts and inspect generated files.
---

# hohu create

Fetch selected component repositories and generate the project marker and development entry files. It does not install dependencies or start services. Next, run [`hohu init`](./init).

## Prerequisites

Install HoHu CLI and Git, with access to the repositories. Run from the new project's parent directory. Use a single folder name; the target file or directory must not exist. Configure Git credentials before accessing private repositories.

## Usage and options

```bash
hohu create [PROJECT_NAME] [OPTIONS]
```

| Argument or option   | Description                                                       | Default                             |
| -------------------- | ----------------------------------------------------------------- | ----------------------------------- |
| `PROJECT_NAME`       | A folder name under the current directory; paths are not accepted | `hohu-admin`                        |
| `--component` / `-c` | Repeat for `backend`, `frontend`, `web`, `app`                    | Interactive selection               |
| `--non-interactive`  | Disable component prompts; requires `--component`                 | Off                                 |
| `--source`           | Official source: `auto`, `github`, `gitee`                        | Global `source`, or `auto` if unset |
| `--repo` / `-r`      | One custom repository used for every selected component           | Configured component repositories   |

Names are case-insensitive; `web` aliases `frontend`, and duplicates are removed. `create` does not accept development aliases such as `be` or `fe`.

## Examples {#examples}

```bash
# Select components interactively
hohu create my-project

# Backend + Web for scripts or coding assistants
hohu create my-project --component backend --component web --non-interactive

# Use official Gitee repositories
hohu create my-project --component backend --component web --source gitee

# Create only Backend from a custom repository
hohu create my-project --component backend --repo https://example.com/team/backend.git
```

`--repo` does not map separate repositories to different components. Use [global configuration](./configuration#repositories) for per-component repositories.

## Repository sources

`auto` tries GitHub first and falls back to official Gitee mirrors on network or transfer failures. Authentication, path and disk errors fail directly. Explicit `github`, `gitee` and custom repositories do not fall back.

Official repositories check out `main`, not a release tag. Custom repositories use their remote default branch. Mirrors may lag; actual sources, branches and commits are recorded in `.hohu/project.json`. See [global configuration](./configuration#repositories) for defaults; these settings do not change npm, PyPI or Skills sources.

## Results

A completed Backend + Web project contains:

```text
my-project/
├── .hohu/project.json
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── .gitignore
├── hohu-admin/
└── hohu-admin-web/
```

Root entry files are generated after every component is cloned. Creation does not initialize a Git repository at the parent project root; component commits do not include parent entry files.

Check that selected directories exist, enter the project, prepare configuration using [development setup](../quick-start), then run [`hohu init`](./init). Open the shared root in your coding assistant.

## Troubleshooting

| Symptom                                  | Action                                                                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Target already exists                    | Choose another name or inspect the directory; creation never overwrites it                                                             |
| Clone fails                              | Check network, Git credentials and URLs; use `--source gitee` for an unavailable official GitHub source                                |
| Only some components were created        | Check the marker and directories; there is no automatic resume command. Create under a new name or restore missing components manually |
| Non-interactive mode requires components | Supply at least one `--component`                                                                                                      |
| Option is not recognized                 | Check `hohu create --help` and use a version that supports it                                                                          |

`hohu init` skips missing component directories; its success message does not prove cloning completed.
