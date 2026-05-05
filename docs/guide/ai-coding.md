---
title: AI Coding
description: Use AI coding tools like Claude Code to rapidly build and develop HoHu Admin projects, covering CLAUDE.md configuration, development workflows, and best practices
---

# AI Coding

HoHu Admin has been deeply optimized for **AI-assisted development** from the ground up. This guide covers how to leverage AI coding tools (recommended: [Claude Code](https://claude.ai/code)) to rapidly build and develop your project.

## Recommended Tools

| Tool                          | Type             | Use Case                                                                        |
| ----------------------------- | ---------------- | ------------------------------------------------------------------------------- |
| **Claude Code** (recommended) | CLI / IDE plugin | Full-cycle development: code generation, refactoring, debugging, Git operations |
| Cursor                        | IDE              | Real-time code completion and conversational editing                            |
| GitHub Copilot                | IDE plugin       | Line-level code completion                                                      |

**Why recommend Claude Code?**

- Reads the entire project context and understands inter-module dependencies
- Built-in CLAUDE.md support — automatically follows project coding conventions
- Supports terminal operations: run tests, Git commits, code search — all in one place
- Excellent understanding of both Python (FastAPI) and TypeScript (Vue)

## Quick Start

### 1. Create a Project with hohu CLI

```bash
# Install the CLI
uv tool install hohu

# Create a project with interactive component selection
hohu create my-project
cd my-project

# Install dependencies
hohu init

# Start development servers
hohu dev
```

After the project is created, each sub-project directory includes a pre-configured `CLAUDE.md` file that AI tools automatically read when opened — no additional configuration needed.

### 2. Start Developing with Claude Code

```bash
# Install Claude Code (requires Node.js 18+)
npm install -g @anthropic-ai/claude-code

# Enter the backend directory and start Claude Code
cd hohu-admin
claude

# Or enter the frontend directory
cd ../hohu-admin-web
claude
```

Once started, simply describe your requirements in natural language, for example:

```
> Add an "avatar" field to the user module. Update the database model, Schema, and API.
```

Claude Code will automatically read the project conventions from `CLAUDE.md` and generate code following the correct layered pattern.

## Project Conventions (Auto-Detected by AI)

HoHu Admin's architecture design allows AI to accurately understand code boundaries. Here are the key conventions that AI tools will automatically follow:

### Backend Layered Pattern

```
API Layer (app/modules/<module>/api.py)
  ↓ calls
Service Layer (app/modules/<module>/service.py)
  ↓ operates on
Model Layer (app/modules/<module>/models/)
```

- **API Layer**: Handles HTTP requests, calls Service, responsible for `await db.commit()`
- **Service Layer**: Business logic, raises domain exceptions, **never commits on its own**
- **Model Layer**: `SQLAlchemy 2.0 Mapped[T]`, primary keys use Snowflake ID

### Frontend Module Pattern

```
Page (src/views/<module>/index.vue)
  ↓ calls
API Service (src/service/api/<module>.ts)
  ↓ uses
Type Definitions (src/typings/api/<module>.ts)
```

- After adding a new page, run `pnpm gen-route` to regenerate routes

### Naming Conventions

| Layer               | Convention   | Example                                 |
| ------------------- | ------------ | --------------------------------------- |
| Backend Python      | `snake_case` | `user_name`, `get_user_list`            |
| Frontend TypeScript | `camelCase`  | `userName`, `getUserList`               |
| Database columns    | `snake_case` | `user_name`                             |
| API field transfer  | `camelCase`  | `userName` (auto-converted by Pydantic) |

### Response Format

All APIs uniformly return:

```json
{ "code": 200, "msg": "success", "data": {} }
```

Snowflake IDs are serialized as **strings** in JSON to prevent JavaScript BigInt precision loss.

## AI-Assisted Development in Practice

### Scenario 1: Adding a New Business Module

Describe the requirements to AI, and it will auto-generate code following the standard layers:

```
> Create a "product management" module with fields for product name, price, stock, and category.
> Include full CRUD APIs and paginated queries.
```

AI will automatically:

1. Create a `product/` module directory under `app/modules/`
2. Define the SQLAlchemy Model (with Snowflake ID)
3. Write Pydantic Schemas (with auto `to_camel` aliases)
4. Implement the Service layer business logic
5. Register API routes

### Scenario 2: Frontend-Backend Integration

```
> The backend already has product management APIs. Help me create the corresponding management page on the frontend,
> including list, add, edit, and delete functionality.
```

AI will automatically:

1. Create `src/typings/api/product.ts` type definitions (matching backend Schemas)
2. Create `src/service/api/product.ts` request wrappers
3. Create `src/views/product/index.vue` page (using NaiveUI components)
4. Prompt you to run `pnpm gen-route` to register the route

### Scenario 3: Database Changes

```
> Add a "status" field to the product table. It should be an enum (on sale / off sale), defaulting to on sale.
```

AI will:

1. Modify the SQLAlchemy Model
2. Update the corresponding Schema
3. Generate an Alembic migration: `alembic revision --autogenerate -m "add product status"`
4. Prompt you to run `alembic upgrade head`

## CLAUDE.md Configuration Reference

Each sub-project's `CLAUDE.md` file serves as the "project manual" for AI tools. HoHu Admin ships with comprehensive pre-configured files:

| Sub-project    | CLAUDE.md location         | Contents                                                                           |
| -------------- | -------------------------- | ---------------------------------------------------------------------------------- |
| hohu-admin     | `hohu-admin/CLAUDE.md`     | Backend layering conventions, dependency injection, error handling, test commands  |
| hohu-admin-web | `hohu-admin-web/CLAUDE.md` | Frontend component conventions, route generation, state management, build commands |
| hohu-admin-app | `hohu-admin-app/CLAUDE.md` | Mobile component conventions, multi-platform adaptation, build commands            |
| hohu-cli       | `hohu-cli/CLAUDE.md`       | CLI development conventions, i18n, test commands                                   |

::: tip Customizing CLAUDE.md
You can edit each sub-project's `CLAUDE.md` to add team-specific conventions (such as business terminology or code style preferences). AI tools will automatically read them at the start of each session.
:::

## Common AI Prompt Reference

### Backend Development

```
# Add a new API endpoint
> Add a change-password endpoint to the user module. It needs to verify the old password.

# Fix a bug
> Getting "relation 'user' does not exist" error on startup. Help me troubleshoot.

# Code review
> Review the code quality of app/modules/product/service.py
```

### Frontend Development

```
# Add a new page
> Create a product management page using NaiveUI table components with search and pagination support.

# Style adjustment
> Center the login page form and change its width to 400px.

# Type integration
> Generate frontend type definitions and API request functions based on the backend ProductSchema.
```

### Cross-Project Collaboration

```
> The backend has new product category APIs. Help me update the frontend type definitions and API calls accordingly.
```

## Productivity Tips

1. **Read before modifying**: Have AI read the relevant code before making changes to avoid operating without context.
2. **Small iterations**: Describe one small requirement at a time and build incrementally, rather than generating an entire module at once.
3. **Leverage CLAUDE.md**: Write team conventions into CLAUDE.md so AI follows them automatically.
4. **Use the CLI**: `hohu dev` starts all services in one command — verify AI-generated code at any time.
5. **Verify promptly**: After AI generates code, immediately start the project with `hohu dev` to verify the functionality.

## Related Resources

- [Quick Start](/guide/quick-start) — Create a project with hohu CLI in one click
- [Permission Control](/guide/auth) — RBAC permission system explained
- [Pagination](/guide/page) — Backend pagination utilities and frontend table components
- [Source Repositories](/guide/src) — GitHub addresses for each sub-project
