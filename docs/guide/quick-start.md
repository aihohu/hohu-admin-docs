---
title: Quick start
description: 'Create a HoHu project with the CLI, configure PostgreSQL and Redis, initialize the application and sign in for the first time.'
---

# Quick start

This tutorial runs the HoHu backend and Web application locally. By the end, you can sign in, explore the built-in features and start a business module. For a server installation, follow the [deployment guide](./deploy).

## 1. Prepare your environment

| Tool       | Requirement                                         | Check                                |
| ---------- | --------------------------------------------------- | ------------------------------------ |
| Git        | Fetch project sources                               | `git --version`                      |
| Python     | 3.12 or later for the backend                       | `python --version`                   |
| uv         | Python dependency and CLI management                | `uv --version`                       |
| Node.js    | Node 22 LTS, at least 22.12                         | `node --version`                     |
| pnpm       | 10.5 or later                                       | `pnpm --version`                     |
| PostgreSQL | A running server and dedicated development database | Verify access with a database client |
| Redis      | A running server accessible to the backend          | `redis-cli ping` returns `PONG`      |

Other supported Node.js versions meeting the current Vite requirements can also be used. Installation instructions: [uv](https://docs.astral.sh/uv/getting-started/installation/), [Node.js](https://nodejs.org/en/download), [pnpm](https://pnpm.io/installation).

The CLI creates the project, installs dependencies, migrates the database and initializes built-in data. Prepare PostgreSQL and Redis before local development. Use a dedicated development database.

## 2. Install the CLI and create a project

```bash
uv tool install hohu
hohu --version
hohu create my-project
cd my-project
```

Select **Backend** and **Frontend** in the creation wizard. Add **App** if you need the mobile client. The project root contains `.hohu/project.json` and the selected component directories:

```text
my-project/
├── .hohu/
├── hohu-admin/
└── hohu-admin-web/
```

Run subsequent project commands inside `my-project`. If `hohu` is not found, reopen the terminal or run `uv tool update-shell` and follow the PATH instructions.

## 3. Initialize and configure connections

```bash
hohu init
```

The CLI installs dependencies, creates the backend `.env`, generates an application secret and initial administrator password, then runs migrations and seed initialization.

On a first installation, the example connection usually needs adjustment. If initialization reports a connection failure, edit `hohu-admin/.env`, configure your database and Redis, then run `hohu init` again. Existing configuration and user passwords are preserved.

Replace the example credentials, database and addresses below with your development connection:

```dotenv
DATABASE_URL=postgresql+asyncpg://hohu:YOUR_DATABASE_PASSWORD@127.0.0.1:5432/hohu_dev
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

For Redis without a password, use a standalone `REDIS_PASSWORD=` line. Do not leave an inline comment after the empty value: dotenv parsing can treat it as the password and produce an invalid connection URL.

Create the database first and grant its account permission to create and alter tables in that database. URL-encode special characters such as `@` and `:` in database passwords. Keep the generated `SECRET_KEY` and `HOHU_ADMIN_PASSWORD`.

Successful initialization creates the administrator, menus and built-in settings. There is no separate step to run `init_db.py` or `sync_menus.py` manually.

## 4. Start and sign in

```bash
hohu dev
```

The default Web address is `http://localhost:9527`, the API is `http://127.0.0.1:8000`, and OpenAPI is at `http://127.0.0.1:8000/docs`. Check terminal output if a port is already occupied.

Sign in as `admin` with the `HOHU_ADMIN_PASSWORD` in the backend `.env`. This is the initial credential; if the password has since changed, use the updated password. Change the initial password in your profile after signing in.

Opening System settings and User management verifies that the Web client can reach the backend. AI features additionally require a configured model provider; see [AI setup](./operations/ai).

## 5. Develop day to day

Press Ctrl+C in the `hohu dev` terminal to stop development services. To select components:

```bash
hohu dev -o be
hohu dev -o fe
hohu dev -s app
```

The first two commands run only the backend or Web client. The third skips App. Continue with [your first business module](./development/module) or explore the [repository structure](./backend/dir).

## Troubleshooting

| Symptom                                | What to check                                                                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Not inside a project                   | Run inside the directory containing `.hohu/project.json`                                             |
| PostgreSQL or Redis connection failure | Start the service, create the database and verify backend `.env` connection values                   |
| Initialization failed                  | Fix the reported error and rerun `hohu init`; no database deletion is required                       |
| Web loads but sign-in requests fail    | Check the API process and Web `.env.development` service/proxy settings                              |
| Windows symlink EPERM                  | Enable Windows Developer Mode and check directory write permissions before reinstalling dependencies |
| Initial password fails                 | Verify that the backend uses the intended database; initialization does not reset existing passwords |
