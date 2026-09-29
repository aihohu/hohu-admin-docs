---
title: Scheduled jobs
description: 'HoHu scheduled jobs: steps, scope and limitations'
---

# Scheduled jobs

Task registration is separate from scheduling configuration. Developers register executable functions; administrators select a registered task, schedule and arguments in the UI. The scheduler executes enabled tasks and records logs.

## Process architecture

`APP_ROLE=api` runs only the API, `scheduler` runs the separate scheduler, and `all` is for single-process development. Combining all with multiple production API workers can trigger duplicate jobs. CLI deployment separates API and scheduler.

## Developer integration

1. Register a unique key through `app.modules.job.task_registry.register_task` and ensure the task module is imported at startup.
2. Declare `TaskScope.TENANT` or `TaskScope.PLATFORM`; tenant task selections exclude platform tasks.
3. Use trusted execution context, not tenant authority constructed from user arguments or mutable singleton state.
4. Configure `timeout_seconds` for long jobs and define idempotency and concurrency behavior, recording success and failure.
5. Verify enable/disable, timeout, revocation, restart and cross-tenant rejection in isolation before exposing the task.

## Administrator workflow

Choose a registered key, configure cron or interval scheduling, and review arguments, concurrency policy and enabled status. Inspect execution logs. For persistent RUNNING entries, investigate process state, timeouts and recovery before retriggering a job with possible side effects.

Task code ships with the backend. Entering an arbitrary function name does not authorize unregistered code execution. Scheduled jobs are not a promise of durable asynchronous execution after AI confirmation.
