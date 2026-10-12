---
title: Scheduled jobs
description: Register async HoHu tasks, configure cron or interval schedules, timeouts and retries, and understand current tenant-context limitations.
---

# Scheduled jobs

Task code registers through `app/modules/job/task_registry.py`. Administrators select a registered task and configure its schedule. Registering a function does not create or enable a job record.

## 1. Register a function

Create `app/tasks/development_tasks.py` in the backend. Start with a task that does not access business data:

```python
import logging

from app.modules.job.task_registry import TaskScope, register_task

logger = logging.getLogger(__name__)


@register_task("development_ping", scope=TaskScope.TENANT)
async def development_ping(args: dict | None = None) -> None:
    """Check development task execution."""
    if args is not None and not isinstance(args, dict):
        raise ValueError("Task arguments must be an object")
    logger.info("Development task completed")
```

Import the module in `app/tasks/__init__.py`, preserving existing imports, then restart the backend and scheduler processes. Keys must be unique; duplicate registration fails. Use an async function. When arguments exist, the runner passes parsed JSON as `args=...`; otherwise it calls the function without arguments.

## 2. Configure execution

| Setting        | Meaning                                                                      |
| -------------- | ---------------------------------------------------------------------------- |
| jobKey         | Registered key, such as development_ping                                     |
| triggerType    | cron or interval                                                             |
| cron           | Five fields: minute, hour, day, month, weekday; six fields add seconds first |
| interval       | intervalValue at least 1; intervalUnit is seconds, minutes, hours, or days   |
| jobArgs        | JSON string; leave empty or use `{}` for this example                        |
| status         | New jobs are disabled by default; enable after verification                  |
| timeoutSeconds | Per-attempt timeout; optional                                                |
| maxRetries     | Additional attempts after failure; defaults to 0                             |
| concurrent     | Whether executions of this job may overlap                                   |
| runOnEnable    | Run immediately when enabled; defaults to false                              |

Run manually and inspect the execution log before checking scheduled execution. Retries can repeat external effects. Payments and messages need business idempotency; a timeout does not undo an external operation.

## Current tenant boundary

::: warning Business-task integration limitation
The generic runner currently passes only jobArgs. It does not inject TenantContext, the current user, or a job ID. `TaskScope.TENANT` makes a task available to tenant schedulers; it does not automatically scope queries inside the function.

Before reading or writing tenant business data, extend the execution entry point to establish and validate trusted context from the server-side job record, then pass it to the service. Editable tenantId values in jobArgs are not authorization. This example checks scheduling only and accesses no business records.
:::

Tasks registered as `TaskScope.PLATFORM` are unavailable to tenant schedulers and require a separate platform execution entry point. Do not relabel platform cleanup jobs as tenant jobs to bypass that boundary.

## Operation and troubleshooting

Development can use `APP_ROLE=all`. Follow deployment procedures to separate api and scheduler roles in production so multiple API workers do not each start scheduling. See [deployment and operations](./operations/index).

| Symptom                      | Check                                                               |
| ---------------------------- | ------------------------------------------------------------------- |
| Task key missing             | Module import, process restart, and matching scope                  |
| Unexpected function argument | Use args as the parameter name and verify the JSON type             |
| Saved but never executes     | Enabled status, scheduler process, trigger expression, and timezone |
| Repeated execution           | Multiple schedulers, concurrency, retries, and business idempotency |
| Result unclear after timeout | Inspect logs and external service state before retrying             |
