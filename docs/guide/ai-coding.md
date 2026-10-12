---
title: Build business applications with AI and HoHu Skills
description: Use coding assistants and HoHu Skills to create a project, develop equipment borrowing, refine requirements, connect application AI and verify delivery.
---

# Develop business applications with AI

This guide is for developers using Claude Code, Cursor, Codex, OpenCode, TRAE or another coding assistant to work on HoHu source. Equipment borrowing below is a development example, not a built-in module.

## Prepare {#prerequisites}

1. [Install Skills](./cli/skills): `hohu-project` and `hohu-business-module`. Verify discovery in the current workspace.
2. Install [HoHu CLI](./cli/index#installation), prepare the [development environment](./quick-start), and use dedicated development databases and Redis.
3. For creation, start the assistant in the parent workspace. For an existing project, open the common Backend/Web root. Provide explicit paths to avoid changes to other projects.

| Stage               | Skill                                 | Expected delivery                                                                                |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Create and run      | `hohu-project`                        | Actual component directories, initialization results, service URLs and access checks             |
| Build a module      | `hohu-business-module`                | Migrations, Service/API, permissions, pages, application AI tools and tests                      |
| Refine requirements | `hohu-business-module`                | Changes fitting the current implementation, compatibility handling and regression results        |
| Verify delivery     | Project checks and business scenarios | Working pages, ordinary-user authorization checks, real AI results or explicit verification gaps |

## 1. Create and run {#create-project}

Ask from the parent workspace:

> Use hohu-project to create equipment with Backend and Web only. Check local dependencies and database configuration, initialize it and start it. Report component paths, access URLs and verification results.

The assistant should inspect the actual CLI version and help. Versions with explicit component selection support [non-interactive creation](./cli/create#examples). Do not overwrite existing directories; inspect retained files before recovering a failed clone.

Initialization installs dependencies, applies migrations and synchronizes seeds. Prepare the project's own environment and preserve existing credentials and settings. Distinguish directory creation, initialization, HTTP availability and verified sign-in; the final CLI message alone does not prove every stage succeeded.

## 2. Build equipment borrowing {#build-module}

Ask in the running project:

> Use hohu-business-module to build equipment borrowing. Equipment has a name, identifier and availability state. Support borrowing, returns and loan history. Prevent concurrent duplicate borrowing. Ordinary users may only view and return their own loans. Add Web pages, application AI queries, and borrowing and returns after confirmation. Use Chinese-only business content.

Describe objects, operations, constraints and visibility for verifiable results. Resolve material gaps such as return rules, administrator access and compatibility with existing records before implementation.

The assistant inspects conventions and compatibility, then implements migrations, Service/API, feature permissions, pages and application AI tools. New modules follow the target project's standard layout; existing modules retain theirs. Application AI is included by default. Language scope follows your explicit request, otherwise module conventions, without changing HoHu's built-in internationalization.

Business Services must enforce authorization and concurrency constraints. Hidden buttons and prompts do not replace backend checks. See [Add a module](./development/module), [Feature permissions](./auth), [Data scope](./data-permission) and [Connect business tools](./development/ai-tools).

## 3. Refine a requirement {#iterate}

Continue from the delivered implementation with a focused change:

> Add a borrowing note of up to 200 characters to the existing module. Support it in the page, API and AI tools. Existing records may have an empty note. Preserve permissions and duplicate-borrowing rules, and include migration and regression checks.

Review data compatibility, interfaces, pages and tools, then verify both the new requirement and existing flows. Do not rebuild the project or overwrite existing data for a small refinement.

## 4. Verify delivery {#verification}

| Check                  | Completion evidence                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Source and migrations  | Reviewed changes; static checks, tests and coverage gates pass                                                                         |
| Page flow              | Ordinary users borrow and return; results persist after refresh; lists and pagination are correct                                      |
| Business rules         | No duplicate borrowing; pages and direct APIs enforce permissions                                                                      |
| Data visibility        | Other users' and tenants' data remain outside unauthorized access                                                                      |
| Application AI queries | A real tool record returns the same objects created on the page                                                                        |
| Application AI writes  | Confirmation precedes execution; rejection does not write; approval updates the page; test replay, expiry and revocation as applicable |

Application model configuration is separate from the coding assistant. Without an application model, source changes and deterministic tests can proceed, but real AI usage remains unverified. See [First AI setup](./operations/ai#first-setup). Available tools do not guarantee every natural-language request is handled correctly; inspect actual results.

Delivery should include changed behavior, executed checks, URLs, start/stop instructions and remaining setup. Update manuals with current behavior and keep drafts, plans and one-off reports locally. Follow separate project workflows for commits, pushes and deployment.
