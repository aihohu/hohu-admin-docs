---
title: Directory Structure
description: HoHu Admin backend project directory structure overview, featuring a modular layered design with separated responsibilities for API, Service, and Model layers
---

# Directory Structure

The project follows a modular organization where each module has clear responsibilities and independent functionality, resulting in a clean structure that is easy to maintain and manage.

```text
hohu-admin/
├── app/
│   ├── core/              # Core framework configuration (Security, JWT, Redis, Config)
│   ├── db/                # Database connection and base model
│   │
│   ├── modules/           # 🧩 Modular directory
│   │   ├── auth/          # Authentication module (login, token refresh)
│   │   ├── system/        # System management module (User, Role, Menu, Dict)
│   │   │   ├── api/       # System API endpoints
│   │   │   ├── crud/      # System business logic
│   │   │   ├── models/    # System models
│   │   │   └── schemas/   # System schemas
│   │   │
│   │   └── business/      # 🚀 Placeholder module for custom business logic
│   │       ├── api/       # User-defined API endpoints
│   │       └── models/    # User-defined models
│   │       └── schemas/   # User-defined schemas
│   │
│   └── main.py            # Aggregates all module routes
├── scripts/               # Data initialization scripts
├── alembic/               # Database migration scripts
└── .env                   # Environment variable configuration
```
