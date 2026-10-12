---
title: hohu monitoring — 监控管理
description: 使用 HoHu CLI 初始化、启动和管理 Prometheus 与 Grafana，检查监控状态、日志、访问配置和停止行为。
---

# hohu monitoring

管理部署模板中的 Prometheus 与 Grafana，使用 Compose 的 `monitoring` profile。它不替代应用部署、数据库备份或业务健康检查。

## 前提条件

Docker 与 Docker Compose 可用，已执行 [`hohu deploy init`](./deploy#init)。在部署配置所在目录或子目录运行。配置监控前确认应用部署状态及服务器端口可用。

## 命令速查

| 命令                                  | 用途                              |
| ------------------------------------- | --------------------------------- |
| [`hohu monitoring init`](#init)       | 同步监控模板，准备 Grafana 凭据   |
| [`hohu monitoring up`](#up)           | 启动 Prometheus 和 Grafana        |
| [`hohu monitoring ps`](#ps)           | 查看启用监控 profile 后的服务状态 |
| [`hohu monitoring logs`](#logs)       | 查看监控日志                      |
| [`hohu monitoring restart`](#restart) | 重启监控服务                      |
| [`hohu monitoring down`](#down)       | 停止并移除监控容器                |

## 初始化与启动 {#init}

```bash
hohu monitoring init
```

同步部署模板，将模板中 `GRAFANA_ADMIN_PASSWORD` 的占位值替换为生成的密码，保留已有非占位值。支持 `--force` 覆盖需要更新的模板，默认关闭；使用前保存自定义修改。

检查 `.hohu/deploy/.env` 中的 Grafana 密码、`GRAFANA_PORT` 和 `PROMETHEUS_PORT`，以及 Compose 中的端口绑定和采集配置。默认 Grafana 端口为 `3000`，Prometheus 为 `9090`。默认端口发布未限制为本机，按服务器访问要求配置防火墙或代理；不要直接把监控管理端口开放给所有人。

### 启动服务 {#up}

```bash
hohu monitoring up
```

以后台方式启动 `prometheus`、`grafana`，无额外参数。监控镜像拉取不使用 `deploy --image-source` 的自动换源。

## 确认运行 {#ps}

```bash
hohu monitoring ps
```

显示启用监控 profile 后的 Compose 状态，可能同时列出应用服务。按实际配置地址访问 Grafana，使用默认用户名 `admin` 和部署 `.env` 中的 `GRAFANA_ADMIN_PASSWORD`。

检查 Grafana 数据源和仪表盘，以及 Prometheus 的采集目标状态。已有 Grafana 数据卷中的账号密码不会仅因修改 `.env` 自动重置。

## 日志与重启 {#logs}

```bash
hohu monitoring logs
hohu monitoring logs -f prometheus
```

接受一个或多个服务名，默认 `prometheus`、`grafana`；`--follow` / `-f` 持续跟踪，默认关闭，Ctrl+C 退出。

### 重启服务 {#restart}

```bash
hohu monitoring restart
hohu monitoring restart grafana
```

默认重启两个监控服务。日志和重启建议仅指定 `prometheus`、`grafana`，避免操作其他服务。配置重建使用 `up`，`restart` 不重建容器。

## 停止监控 {#down}

```bash
hohu monitoring down
```

只停止并移除 `prometheus`、`grafana` 容器，不执行整个业务栈的 Compose `down`，也不删除命名数据卷。无额外参数。

## 排错

| 现象             | 处理方式                                               |
| ---------------- | ------------------------------------------------------ |
| 未找到部署配置   | 先运行 `hohu deploy init`，确认目录                    |
| 服务未启动       | 查看镜像拉取、端口冲突和容器日志                       |
| Grafana 登录失败 | 区分首次凭据与已有数据卷中的密码，勿通过删除卷恢复账号 |
| 仪表盘没有数据   | 核对数据源、采集目标和应用指标是否可达                 |
