---
title: 定时任务
description: 在 HoHu 注册异步定时任务，配置 cron 或 interval、超时与重试，并了解当前任务参数和租户上下文限制。
---

# 定时任务

任务代码通过 `app/modules/job/task_registry.py` 注册；管理界面选择已注册任务并配置执行计划。注册函数不会自动创建或启用任务记录。

## 1. 注册任务函数

在后端创建 `app/tasks/development_tasks.py`。先用不读写业务数据的任务验证接线：

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

在 `app/tasks/__init__.py` 中导入新模块，保留已有导入，然后重启后端及调度进程。任务 key 必须唯一，重复注册会报错。函数使用 async；有参数时 runner 以 `args=...` 传入解析后的 JSON，没有参数时直接调用函数。

## 2. 配置执行计划

| 配置           | 含义                                                                    |
| -------------- | ----------------------------------------------------------------------- |
| jobKey         | 注册 key，如 development_ping                                           |
| triggerType    | cron 或 interval                                                        |
| cron           | 5 段为分、时、日、月、星期；6 段在最前增加秒                            |
| interval       | intervalValue 至少为 1，intervalUnit 为 seconds、minutes、hours 或 days |
| jobArgs        | JSON 字符串；本例可留空或使用 `{}`                                      |
| status         | 新任务默认停用，确认配置后再启用                                        |
| timeoutSeconds | 单次执行超时；可不设置                                                  |
| maxRetries     | 失败后额外重试次数，默认 0                                              |
| concurrent     | 是否允许同一任务并发执行                                                |
| runOnEnable    | 启用时是否立即运行，默认 false                                          |

先手动执行一次并查看执行日志，再验证定时触发。重试可能重复产生外部副作用；扣款、发消息等业务必须自行设计幂等，超时不等于外部操作已经撤销。

## 当前租户边界

::: warning 业务任务接入限制
当前通用 runner 只传 jobArgs，不会自动给任务函数注入 TenantContext、当前用户或 job ID。`TaskScope.TENANT` 表示任务可供租户调度器选择，不意味着函数内查询已自动隔离。

需要读写租户业务数据时，应先扩展执行入口，从服务端任务记录建立并验证可信执行上下文，再传入业务 Service。不能把可编辑 jobArgs 中的 tenantId 当作授权依据。本页示例只验证调度，不访问业务数据。
:::

`TaskScope.PLATFORM` 的注册任务不供租户调度器选择或执行，需要单独的平台执行入口。平台清理任务不能改成租户任务来绕过此边界。

## 运行与排错

开发环境可使用 `APP_ROLE=all`。生产按部署流程分离 api 与 scheduler 角色，避免多个 API 进程都启动调度器；见[部署与运维](./operations/index)。

| 现象                 | 检查                                       |
| -------------------- | ------------------------------------------ |
| 找不到任务 key       | 模块是否导入、进程是否重启、scope 是否匹配 |
| 函数收到意外参数     | 参数名应为 args，核对 JSON 类型            |
| 已保存但不执行       | 是否启用、调度进程状态、触发表达式与时区   |
| 执行重复             | 多个调度进程、并发配置、重试及业务幂等     |
| 操作超时后结果不确定 | 查执行日志及外部服务结果，不盲目重试       |
