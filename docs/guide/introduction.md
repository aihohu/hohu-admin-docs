---
title: Introduction
description: HoHu Admin is an enterprise-grade admin management system optimized for AI-assisted development, combining the FastAPI async framework with Vue3 for modular decoupling and explicit semantic design
---

# Introduction

### A Modern, High-Efficiency Full-Stack Development Framework Based on FastAPI & AI

HoHu Admin is an enterprise-grade admin management system optimized for **AI-assisted development**. It combines the lightweight **FastAPI** async framework from the Python ecosystem with the ultimate **Vue3** UI experience, enabling developers to rapidly build high-performance, maintainable business systems with AI assistance (such as Gemini, Cursor, ChatGPT).

## Core Vision: AI First

In traditional development patterns, scaffolding is often bloated and tightly coupled. HoHu Admin adopts **modular decoupling** and **explicit semantic** design principles, allowing AI to precisely understand code structure and generate more accurate feature code.

## Why Choose HoHu Admin?

### Deep AI Adaptation (AI-Ready)

- **Standardized Schemas**: Strict Pydantic V2 definitions allow AI to quickly infer API protocols, enabling zero-modification frontend integration.
- **Explicit Type Annotations**: Full-chain Python Type Hints coverage improves Cursor or Copilot completion accuracy by over 80%.
- **Prompt-Friendly Architecture**: The project structure follows industry-standard RESTful conventions. You can feed the project directory structure directly to AI, and it will immediately understand business boundaries.

### Extreme Performance and Security

- **Async Engine**: Full-chain `asyncio`-driven, supporting high-concurrency processing for demanding business scenarios.
- **RBAC Permission Loop**: Fine-grained permission management down to the button level, with dynamic route generation that perfectly adapts to the frontend permission model.
- **Snowflake ID Integration**: Built-in high-performance distributed ID generator, eliminating the security risks of auto-increment IDs.

### Modular Layered Design

- **Zero-Coupling Directories**: System modules (users, roles, menus, logs) are highly self-contained. New business modules can be migrated with a single click, avoiding tangled codebases.
- **Automated Migrations**: Integrated Alembic database migration tool — version control your database changes like Git.

## AI-Assisted Workflow

In HoHu Admin, you can quickly deliver features through the following workflow:

1. **Define Models**: Describe business entities to AI, which auto-generates `SQLAlchemy` models.
2. **Generate CRUD**: Using HoHu Admin's preset BaseService template, AI can produce complete CRUD logic in seconds.
3. **Protocol Synchronization**: AI automatically generates frontend request types from Pydantic definitions, bridging the last mile between frontend and backend.

## Tech Stack

- **Backend**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL / MySQL (via SQLAlchemy 2.0)
- **Cache**: Redis (Async)
- **Auth**: JWT / OAuth2
