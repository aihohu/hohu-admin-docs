---
title: AI-assisted development
description: 'HoHu ai-assisted development: steps, scope and limitations'
---

# AI-assisted development

AI coding tools can help read, implement and test code, but generated changes must follow current contracts. A design discussed in chat is not automatically an implemented feature.

1. Provide goals, acceptance criteria and relevant modules. Read repository AGENTS/CLAUDE and maintained guides first.
2. Agree on design and authorization scope before features or refactors; preserve API → Service → Model layering.
3. Review trusted tenant scope, permissions and data boundaries, and look for obsolete configuration or APIs.
4. Run actual static checks and regression tests, then review the diff. Do not claim deployment or browser validation that was not performed.
5. Turn implemented behavior into maintained documentation. Keep personal prompts, drafts and debug logs outside the site source directory.

Do not unnecessarily provide production passwords, tokens or user data as tool context. Follow repository authorization rules for commits, pushes and releases; generated code does not authorize publishing.

Start with [Adding a module](./development/module), then update the relevant user guide.
