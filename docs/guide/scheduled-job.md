# 定时任务

HoHu Admin 内置通用定时任务模块，基于 APScheduler 实现任务的注册、调度、执行和日志记录。支持 Cron 表达式（5/6 字段）和固定间隔两种调度方式，提供可视化任务管理界面。

## 核心流程

```
注册任务 (@register_task)  →  前端创建调度配置  →  调度器按计划触发
                                                        ↓
                                              job_runner 执行并记录日志
                                                        ↓
                                              任务日志页面查看结果
```

## 概念

| 术语 | 说明 |
| ---- | ---- |
| 任务标识（Job Key） | 任务函数的唯一标识，由后端 `@register_task` 装饰器注册 |
| 调度类型 | `cron`（Cron 表达式）或 `interval`（固定间隔） |
| 并发策略 | `允许`：同一任务可并行执行；`禁止`：上一次未完成时跳过本次触发 |
| 状态 | `启用`（注册到调度器，按计划执行）/ `停用`（不执行） |
| 任务日志 | 每次执行自动记录：开始时间、结束时间、耗时、状态、异常信息 |

## 注册任务

后端使用 `@register_task` 装饰器将函数注册为可调度任务：

```python
# app/modules/job/tasks/log_tasks.py
from app.modules.job.task_registry import register_task

@register_task("clean_logs")
async def clean_logs(args: dict | None = None):
    """清理过期日志"""
    ...
```

- 装饰器参数即**任务标识**，前端创建任务时从下拉列表选择
- 函数签名统一为 `async def xxx(args: dict | None = None)`
- 任务参数通过 `args` 传入，前端以 JSON 格式配置

::: tip
新注册的任务需要**重启后端**才能在前端下拉列表中出现。
:::

## 创建任务

进入 **系统管理 → 定时任务**，点击"新增"按钮：

| 字段 | 说明 | 示例 |
| ---- | ---- | ---- |
| 任务名称 | 自定义显示名称 | `清理过期日志` |
| 任务标识 | 从下拉列表选择已注册的任务函数 | `clean_logs` |
| 调度类型 | Cron 表达式 或 固定间隔 | — |
| 任务参数 | JSON 格式的函数参数 | `{"days": 30}` |
| 状态 | 创建时默认停用，需手动启用 | — |
| 并发策略 | 是否允许同一任务并行执行 | 禁止 |
| 备注 | 备注信息 | — |

### Cron 模式

支持 5 字段和 6 字段两种 Cron 表达式：

**5 字段**（分 时 日 月 周）：

```
* * * * *      # 每分钟
0 * * * *      # 每小时
0 0 * * *      # 每天 00:00
0 0 * * 1      # 每周一 00:00
0 0 1 * *      # 每月 1 日 00:00
0 0 1 1 *      # 每年 1 月 1 日 00:00
0 30 2 * *     # 每天凌晨 2:30
```

**6 字段**（秒 分 时 日 月 周）：

```
*/10 * * * * *  # 每 10 秒
0 */5 * * * *   # 每 5 分钟的第 0 秒
0 0 12 * * *    # 每天 12:00:00
30 0 2 * * *    # 每天凌晨 2:00:30
```

前端提供常用预设按钮，点击即可自动填入。

### 固定间隔模式

选择"固定间隔"调度类型后，设置间隔值和单位：

| 间隔值 | 单位 | 含义 |
| ------ | ---- | ---- |
| 10 | 秒 | 每 10 秒执行一次 |
| 30 | 分钟 | 每 30 分钟执行一次 |
| 1 | 小时 | 每 1 小时执行一次 |
| 1 | 天 | 每 1 天执行一次 |

## 管理任务

### 启用 / 停用

- 点击操作列的 **启用** / **停用** 按钮切换状态
- 启用后任务立即注册到调度器，按计划执行
- 停用后从调度器移除，不再触发

### 立即执行

点击 **立即执行** 可无视任务状态，手动触发一次执行。适用于调试或临时运行。

::: tip
立即执行不受启用/停用状态限制，停用的任务也可以手动触发。
:::

### 删除

- 只有**停用状态**的任务才能删除
- 删除任务时会**级联删除**该任务的所有执行日志

### 批量删除

勾选多个任务后，点击顶部"批量删除"按钮。同样只删除已停用的任务。

## 任务日志

进入 **系统管理 → 任务日志**，可查看所有任务的执行记录：

| 字段 | 说明 |
| ---- | ---- |
| 任务名称 | 执行时的任务名称 |
| 任务标识 | 执行时的任务标识 |
| 执行状态 | 成功 / 失败 / 执行中 |
| 异常信息 | 失败时的错误堆栈 |
| 开始时间 | 执行开始时间 |
| 结束时间 | 执行结束时间 |
| 耗时 | 执行耗时（毫秒） |

### 搜索

支持按以下条件筛选：

- **任务标识** — 模糊匹配
- **执行状态** — 成功 / 失败 / 执行中
- **时间范围** — 日期时间范围选择

### 清理日志

点击 **清理日志** 按钮，自动删除 30 天前的日志记录。

也可通过注册 `clean_logs` 任务设置定时自动清理。

### 批量删除

勾选多条日志后，点击顶部"批量删除"按钮。

## API 参考

### 任务管理

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| GET | `/system/job/list` | 获取任务列表（分页） |
| GET | `/system/job/registered` | 获取已注册的任务标识列表 |
| POST | `/system/job/add` | 创建任务 |
| PUT | `/system/job/update` | 更新任务 |
| PUT | `/system/job/status` | 更新任务状态（启用/停用） |
| DELETE | `/system/job/{jobId}` | 删除任务 |
| POST | `/system/job/batch-delete` | 批量删除任务 |
| POST | `/system/job/run/{jobId}` | 立即执行任务 |

### 任务日志

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| GET | `/system/job-log/list` | 获取日志列表（分页） |
| DELETE | `/system/job-log/clean` | 清理指定天数前的日志 |
| POST | `/system/job-log/batch-delete` | 批量删除日志 |

## 相关文件

### 后端

- `app/modules/job/models/job.py` — SysJob、SysJobLog 数据模型
- `app/modules/job/schemas/job.py` — 请求/响应 Schema
- `app/modules/job/service/job_service.py` — 任务管理服务
- `app/modules/job/service/job_log_service.py` — 日志管理服务
- `app/modules/job/api/job.py` — 任务 API 路由
- `app/modules/job/api/job_log.py` — 日志 API 路由
- `app/modules/job/job_runner.py` — 任务执行引擎
- `app/modules/job/task_registry.py` — 任务注册中心
- `app/modules/job/tasks/log_tasks.py` — 内置任务示例
- `app/core/scheduler.py` — APScheduler 封装

### 前端

- `src/views/system/job/index.vue` — 任务管理页面
- `src/views/system/job/modules/job-operate-drawer.vue` — 新增/编辑抽屉
- `src/views/system/job/modules/job-search.vue` — 搜索表单
- `src/views/system/job-log/index.vue` — 任务日志页面
- `src/views/system/job-log/modules/job-log-search.vue` — 日志搜索表单
- `src/service/api/system.ts` — API 函数
- `src/typings/api/system-manage.d.ts` — 类型定义
