---
title: Build business applications with AI and HoHu Skills
description: 'Use Claude Code, Cursor or Codex with HoHu Skills to create projects and develop business modules. Follow the workflow for pages, permissions, AI tools and validation.'
---

# Build business applications with AI and HoHu Skills

This guide is for developers working on HoHu source with Claude Code, Cursor, Codex, OpenCode, TRAE or another coding assistant. First [install Skills](./cli/skills) and prepare the [development environment](./quick-start).

## Create and run a project

Start your agent in the intended parent workspace and confirm it discovers `hohu-project`. Project creation requires HoHu CLI and terminal execution capability. Ask:

> Use hohu-project to create equipment with Backend and Web only. Check local dependencies and database configuration, initialize it and start it. Report the access URL and verification results.

The assistant checks the installed CLI's help. Versions with explicit component options support [non-interactive creation](./cli/index#non-interactive-creation). Existing directories must not be overwritten; inspect retained files after a failed network clone before recovering.

Initialization involves dependencies, database migrations and seed data. Provide a dedicated development database and Redis, and prepare the environment configuration required by the project. Successful delivery includes actual component directories, initialization results, service URLs and page access checks. Creating a directory alone does not make the project ready.

## Build a business module

Use `hohu-business-module` in an existing project. Describe operations and data visibility, for example:

> Add equipment borrowing with borrow, return and list operations. Ordinary users may only view and return their own loans, and the same equipment cannot be borrowed twice concurrently. Use Chinese-only business content.

The assistant checks project conventions and compatibility, then implements migrations, Service/API layers, feature permissions, pages and application AI tools. New modules follow the target project's standard layout; extensions follow the existing module layout.

Business modules include application AI queries and required write tools by default, using the platform confirmation flow. Internationalization follows your explicit request, otherwise the target project's module conventions, without changing HoHu's built-in internationalization. Feature permissions, tenant isolation and data scope use the existing authorization system according to business requirements; no separate generic capability selection is needed.

For implementation details, read [Add a module](./development/module), [Feature permissions](./auth), [Data scope](./data-permission) and [Connect business tools](./development/ai-tools).

## Verify the result

1. Review migrations and code changes, then run the target repository's static checks, tests and coverage gates.
2. Operate and refresh pages as an ordinary user. Check records, pagination and button permissions; unauthorized direct API requests must also be refused.
3. Verify that other users' and tenants' data cannot be accessed outside the declared business scope.
4. Use a real model to query page-created records and inspect actual tool calls. Writes should display a confirmation card and persist only after approval; test cancellation, replay and revocation as required by the business flow.

Application model configuration is separate from the coding assistant's model configuration. Without an available application model, source changes and deterministic tests can proceed, but real AI scenarios remain unverified. See [Configuration and operations](./operations/ai).

Update the relevant manuals with delivered behavior and operating steps. Keep drafts, plans and one-off acceptance records locally; follow the project workflow separately for commits, pushes and deployment.
