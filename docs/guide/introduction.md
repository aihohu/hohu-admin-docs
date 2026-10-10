---
title: HoHu open-source AI application platform
description: 'Learn who HoHu is for: build self-hosted business applications with FastAPI, Vue, permissions, multi-tenancy and AI assistants. Understand its capabilities and limits.'
---

# HoHu open-source AI application platform

HoHu is an open-source platform for AI-native business applications. It brings business interfaces, AI, permissions and data together so teams can build and run their own applications.

## Who HoHu is for

HoHu is for developers and teams building business applications with Python and Vue who want control of their code and deployment. Its backend uses FastAPI and its Web interface uses Vue 3. Coding assistants can help create projects and implement modules through [HoHu Skills](./cli/skills).

Building an application requires a development environment and business code. HoHu is not a no-code builder or a ready-to-use CRM, ERP or approval suite. You can [try the existing platform](./show), follow the [local quick start](./quick-start), or learn how to [connect business tools to AI](./development/ai-tools).

## What you can do

- **Build business applications:** reuse users, organizations, permissions, files, jobs and settings while implementing your own models, APIs and pages.
- **Use AI inside applications:** query data or request controlled business actions through conversations, within the account’s permissions and data scope.
- **Run on your infrastructure:** create, develop, build and deploy with the CLI while retaining control of source and data.

HoHu supplies the application foundation. CRM, inventory and operations systems can be built on it; these are not bundled complete business suites. Feature-specific guides describe the available behavior.

## Projects

| Repository           | Responsibility                                                                          |
| -------------------- | --------------------------------------------------------------------------------------- |
| `hohu-admin`         | Backend and platform core: business APIs, authentication, authorization and AI services |
| `hohu-admin-web`     | Web application interface                                                               |
| `hohu-cli`           | Project creation, initialization, development, builds and deployment                    |
| `hohu-admin-app`     | Mobile client                                                                           |
| `hohu-admin-desktop` | Desktop client                                                                          |
| `hohu-admin-docs`    | HoHu website and documentation                                                          |

Admin remains part of the repository names; **HoHu** is the platform and website brand. See [Source and licensing](./src).

## Choose a starting point

| Your goal                        | Start here                                                               |
| -------------------------------- | ------------------------------------------------------------------------ |
| Use an existing installation     | [User guide](./user/index)                                               |
| Run locally and develop features | [Quick start](./quick-start) → [Your first module](./development/module) |
| Deploy on your server            | [Deployment and operations](./operations/index)                          |
| Look up a command or option      | [Reference](./reference/index)                                           |
