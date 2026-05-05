---
title: Scheduled Jobs
description: HoHu Admin scheduled job module based on APScheduler, supporting Cron expressions and fixed interval scheduling, with visual task management and execution logs
---

# Scheduled Jobs

HoHu Admin includes a built-in scheduled job module based on APScheduler for task registration, scheduling, execution, and logging. It supports two scheduling modes — Cron expressions (5/6 fields) and fixed intervals — and provides a visual task management interface.

## Core Flow

```
Register task (@register_task)  →  Frontend creates schedule config  →  Scheduler triggers on schedule
                                                        ↓
                                              job_runner executes and logs
                                                        ↓
                                              View results on the task log page
```

## Concepts

| Term               | Description                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Job Key            | Unique identifier for the task function, registered via the backend `@register_task` decorator |
| Schedule Type      | `cron` (Cron expression) or `interval` (fixed interval)                                        |
| Concurrency Policy | `Allow`: same task can run in parallel; `Forbid`: skip trigger if previous run hasn't finished |
| Status             | `Enabled` (registered to scheduler, runs on schedule) / `Disabled` (does not run)              |
| Task Log           | Each execution is auto-logged: start time, end time, duration, status, error info              |

## Registering Tasks

The backend uses the `@register_task` decorator to register functions as schedulable tasks:

```python
# app/modules/job/tasks/log_tasks.py
from app.modules.job.task_registry import register_task

@register_task("clean_logs")
async def clean_logs(args: dict | None = None):
    """Clean expired logs"""
    ...
```

- The decorator argument is the **Job Key** — selected from a dropdown when creating tasks on the frontend
- The function signature is always `async def xxx(args: dict | None = None)`
- Task parameters are passed in via `args`, configured as JSON on the frontend

::: tip
Newly registered tasks require a **backend restart** before they appear in the frontend dropdown list.
:::

## Creating Tasks

Navigate to **System Management > Scheduled Jobs** and click the "Add" button:

| Field              | Description                                               | Example              |
| ------------------ | --------------------------------------------------------- | -------------------- |
| Task Name          | Custom display name                                       | `Clean Expired Logs` |
| Job Key            | Select a registered task function from the dropdown       | `clean_logs`         |
| Schedule Type      | Cron expression or fixed interval                         | —                    |
| Task Parameters    | JSON-formatted function parameters                        | `{"days": 30}`       |
| Status             | Disabled by default on creation, must be manually enabled | —                    |
| Concurrency Policy | Whether to allow the same task to run in parallel         | Forbid               |
| Remark             | Additional notes                                          | —                    |

### Cron Mode

Supports both 5-field and 6-field Cron expressions:

**5 fields** (minute hour day month weekday):

```
* * * * *      # Every minute
0 * * * *      # Every hour
0 0 * * *      # Every day at 00:00
0 0 * * 1      # Every Monday at 00:00
0 0 1 * *      # On the 1st of every month at 00:00
0 0 1 1 *      # On January 1st at 00:00
0 30 2 * *     # Every day at 2:30 AM
```

**6 fields** (second minute hour day month weekday):

```
*/10 * * * * *  # Every 10 seconds
0 */5 * * * *   # At second 0 of every 5th minute
0 0 12 * * *    # Every day at 12:00:00
30 0 2 * * *    # Every day at 2:00:30
```

The frontend provides common preset buttons — click to auto-fill the expression.

### Fixed Interval Mode

Select "Fixed Interval" as the schedule type, then set the interval value and unit:

| Interval Value | Unit    | Meaning              |
| -------------- | ------- | -------------------- |
| 10             | Seconds | Run every 10 seconds |
| 30             | Minutes | Run every 30 minutes |
| 1              | Hours   | Run every 1 hour     |
| 1              | Days    | Run every 1 day      |

## Managing Tasks

### Enable / Disable

- Click the **Enable** / **Disable** button in the actions column to toggle status
- When enabled, the task is immediately registered to the scheduler and runs on schedule
- When disabled, it is removed from the scheduler and will no longer trigger

### Run Immediately

Click **Run Immediately** to manually trigger a one-time execution regardless of the task's status. Useful for debugging or ad-hoc runs.

::: tip
Running immediately is not restricted by enable/disable status — disabled tasks can also be manually triggered.
:::

### Delete

- Only tasks in **disabled status** can be deleted
- Deleting a task will **cascade delete** all its execution logs

### Batch Delete

Select multiple tasks, then click the "Batch Delete" button at the top. Only disabled tasks will be deleted.

## Task Logs

Navigate to **System Management > Task Logs** to view execution records for all tasks:

| Field      | Description                       |
| ---------- | --------------------------------- |
| Task Name  | Task name at execution time       |
| Job Key    | Job key at execution time         |
| Status     | Success / Failed / Running        |
| Error Info | Error stack trace on failure      |
| Start Time | Execution start time              |
| End Time   | Execution end time                |
| Duration   | Execution duration (milliseconds) |

### Search

Filter by the following criteria:

- **Job Key** — fuzzy match
- **Status** — Success / Failed / Running
- **Time Range** — date-time range picker

### Clean Logs

Click the **Clean Logs** button to automatically delete log records older than 30 days.

You can also set up automatic periodic cleanup by registering the `clean_logs` task.

### Batch Delete

Select multiple log entries, then click the "Batch Delete" button at the top.

## API Reference

### Task Management

| Method | Path                       | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| GET    | `/system/job/list`         | Get task list (paginated)           |
| GET    | `/system/job/registered`   | Get list of registered job keys     |
| POST   | `/system/job/add`          | Create a task                       |
| PUT    | `/system/job/update`       | Update a task                       |
| PUT    | `/system/job/status`       | Update task status (enable/disable) |
| DELETE | `/system/job/{jobId}`      | Delete a task                       |
| POST   | `/system/job/batch-delete` | Batch delete tasks                  |
| POST   | `/system/job/run/{jobId}`  | Run a task immediately              |

### Task Logs

| Method | Path                           | Description                          |
| ------ | ------------------------------ | ------------------------------------ |
| GET    | `/system/job-log/list`         | Get log list (paginated)             |
| DELETE | `/system/job-log/clean`        | Clean logs older than specified days |
| POST   | `/system/job-log/batch-delete` | Batch delete logs                    |

## Related Files

### Backend

- `app/modules/job/models/job.py` — SysJob, SysJobLog data models
- `app/modules/job/schemas/job.py` — Request/response Schemas
- `app/modules/job/service/job_service.py` — Task management service
- `app/modules/job/service/job_log_service.py` — Log management service
- `app/modules/job/api/job.py` — Task API routes
- `app/modules/job/api/job_log.py` — Log API routes
- `app/modules/job/job_runner.py` — Task execution engine
- `app/modules/job/task_registry.py` — Task registry
- `app/modules/job/tasks/log_tasks.py` — Built-in task examples
- `app/core/scheduler.py` — APScheduler wrapper

### Frontend

- `src/views/system/job/index.vue` — Task management page
- `src/views/system/job/modules/job-operate-drawer.vue` — Add/edit drawer
- `src/views/system/job/modules/job-search.vue` — Search form
- `src/views/system/job-log/index.vue` — Task log page
- `src/views/system/job-log/modules/job-log-search.vue` — Log search form
- `src/service/api/system.ts` — API functions
- `src/typings/api/system-manage.d.ts` — Type definitions
