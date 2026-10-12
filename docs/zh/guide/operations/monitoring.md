---
title: 巡检与排错
description: 使用服务状态、日志、存活检查和 Prometheus 指标排查 HoHu 部署故障，并建立上线与日常巡检清单。
---

# 巡检与排错

先确定故障发生在浏览器、代理、应用还是基础依赖，再查看对应日志。以下命令在部署目录或子目录运行。

## 常用命令

| 目的         | 命令                                       |
| ------------ | ------------------------------------------ |
| 查看服务状态 | `hohu deploy ps`                           |
| API 日志     | `hohu deploy logs -f hohu-admin-api`       |
| 调度日志     | `hohu deploy logs -f hohu-admin-scheduler` |
| Web 日志     | `hohu deploy logs -f hohu-admin-web`       |
| 内置代理日志 | `hohu deploy logs -f nginx`，仅启用时      |
| 监控服务状态 | `hohu monitoring ps`                       |

Ctrl+C 只退出日志跟踪。先保留报错与时间，再决定是否重启；重启不会修复错误配置或缺失迁移。

## 健康检查能说明什么

后端 `/health` 返回 `{"status":"ok"}`，仅说明进程能响应，不检测数据库、Redis、任务或模型提供商。默认 Compose 的 API 健康检查调用此接口。

如果按本指南将 API 绑定到宿主机回环端口，可在服务器本机检查：

```bash
curl --fail http://127.0.0.1:8000/health
```

Web 正常返回页面也不能证明 API 已连接。上线至少验证登录、一个受权限保护的读取、文件操作及实际需要的任务或 AI 流程。

## 启用监控

```bash
hohu monitoring init
hohu monitoring up
hohu monitoring ps
```

模板包含 Prometheus、Grafana 与 AI 相关仪表盘。检查 Prometheus 中 hohu-admin-api 目标为 UP，再检查 Grafana 数据源与指标时间范围。命令参数、初始密码和默认端口见 [CLI 监控](../cli/monitoring)。

`/metrics` 输出 Prometheus 文本，不是业务 JSON。仅向监控网络开放，公网代理应阻止 `/metrics` 和经 API 前缀映射的指标路径。默认监控端口发布不限制为回环，需要按实际网络调整访问控制。

## 故障速查

| 现象                  | 先检查                              | 下一步                                      |
| --------------------- | ----------------------------------- | ------------------------------------------- |
| 站点无法访问          | DNS、TLS、公开端口与代理进程        | [网络与 HTTPS](./network)                   |
| 502 / 504             | Web / API 状态、上游地址、启动日志  | 检查依赖和代理超时                          |
| 迁移失败              | 数据库连接、当前 revision、目标版本 | [升级与恢复](./upgrade)                     |
| API 正常，任务失败    | scheduler 日志及外部连接覆盖        | [外部服务配置](../deploy#external-services) |
| 登录后 403            | 用户、角色、租户状态与权限码        | [错误码](../backend/error-code-list)        |
| 上传 413              | 每一层代理与应用有效大小上限        | [上传策略](../reference/settings)           |
| AI 回答最后一次性出现 | 代理缓冲、SSE 超时                  | 关闭流式路径缓冲并验证完整链路              |
| 请求 429 / 503        | Retry-After、Redis 与相关开关       | [错误处理](../backend/error-code)           |
| 私有文件丢失          | API / scheduler 挂载、原文件与记录  | 核查配套文件备份，不公开私有目录            |

## 日常巡检

定期检查磁盘和卷空间、日志增长、备份结果、恢复演练、证书有效期、任务失败与请求错误率。监控覆盖业务需要的关键路径，不只关注容器是否 running。

反馈问题时提供版本、时间、受影响服务、稳定错误码和脱敏日志。不要提交完整 `.env`、token、密码或业务文件。源码与反馈入口见[源码与许可](../src)。
