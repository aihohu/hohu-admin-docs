---
title: Directory Structure
description: HoHu Admin backend project directory structure overview, featuring a modular layered design with separated responsibilities for API, Service, and Model layers
---

# Directory Structure

The project follows a modular organization where each module has clear responsibilities and independent functionality, resulting in a clean structure that is easy to maintain and manage.

```text
hohu-admin/
├── app/
│   ├── core/              # Core framework (Security, JWT, Redis, Cache, Config)
│   ├── db/                # Database connection and base model
│   │
│   ├── modules/           # Modular directory
│   │   ├── auth/          # Authentication module (login, token refresh)
│   │   ├── system/        # System management (User, Role, Menu, Dict, Config, File)
│   │   │   ├── api/       # API endpoints
│   │   │   ├── models/    # Data models
│   │   │   ├── schemas/   # Pydantic schemas
│   │   │   └── service/   # Business logic
│   │   │
│   │   ├── ai/            # AI module (chat, model management)
│   │   └── job/           # Scheduled jobs module
│   │
│   └── main.py            # Aggregates all module routes
├── scripts/               # Data initialization and menu sync scripts
├── alembic/               # Database migration scripts
└── .env                   # Environment variable configuration
```
