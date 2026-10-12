---
title: hohu monitoring — Monitoring management
description: Initialize, start and manage Prometheus and Grafana with HoHu CLI, inspect status and logs, configure access and stop monitoring containers.
---

# hohu monitoring

Manage Prometheus and Grafana from the deployment templates using the Compose `monitoring` profile. This does not replace application deployment, database backups or business health checks.

## Prerequisites

Docker and Docker Compose are available, and [`hohu deploy init`](./deploy#init) has completed. Run from the deployment configuration's parent directory or a subdirectory. Check application deployment status and available server ports.

## Command reference

| Command                               | Purpose                                                 |
| ------------------------------------- | ------------------------------------------------------- |
| [`hohu monitoring init`](#init)       | Synchronize templates and prepare Grafana credentials   |
| [`hohu monitoring up`](#up)           | Start Prometheus and Grafana                            |
| [`hohu monitoring ps`](#ps)           | Show service status with the monitoring profile enabled |
| [`hohu monitoring logs`](#logs)       | Read monitoring logs                                    |
| [`hohu monitoring restart`](#restart) | Restart monitoring services                             |
| [`hohu monitoring down`](#down)       | Stop and remove monitoring containers                   |

## Initialize and start {#init}

```bash
hohu monitoring init
```

Synchronize deployment templates and replace a template placeholder `GRAFANA_ADMIN_PASSWORD` with a generated password, preserving existing non-placeholder values. `--force` overwrites outdated templates and defaults to off; save custom changes first.

Check the Grafana password, `GRAFANA_PORT` and `PROMETHEUS_PORT` in `.hohu/deploy/.env`, plus Compose port bindings and scrape configuration. Default ports are `3000` for Grafana and `9090` for Prometheus. Default publishing is not restricted to localhost; configure firewall or proxy access for your server and avoid exposing monitoring administration ports to everyone.

### Start services {#up}

```bash
hohu monitoring up
```

Start `prometheus` and `grafana` in the background. No additional options. Monitoring image pulls do not use `deploy --image-source` fallback.

## Verify operation {#ps}

```bash
hohu monitoring ps
```

Show Compose status with the monitoring profile enabled; application services may also appear. Visit Grafana at the configured address, using the default username `admin` and deployment `GRAFANA_ADMIN_PASSWORD`.

Check Grafana data sources and dashboards and Prometheus scrape target status. Changing `.env` does not reset a password already stored in an existing Grafana data volume.

## Logs and restart {#logs}

```bash
hohu monitoring logs
hohu monitoring logs -f prometheus
```

Accepts one or more service names, defaulting to `prometheus` and `grafana`. `--follow` / `-f` follows output and defaults to off; press Ctrl+C to exit.

### Restart services {#restart}

```bash
hohu monitoring restart
hohu monitoring restart grafana
```

Defaults to both monitoring services. For logs and restart, specify only `prometheus` or `grafana` to avoid operating on other services. Use `up` for container recreation; `restart` does not recreate containers.

## Stop monitoring {#down}

```bash
hohu monitoring down
```

Stop and remove only `prometheus` and `grafana` containers, without a whole-stack Compose `down` or named volume removal. No additional options.

## Troubleshooting

| Symptom                          | Action                                                                                                          |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Deployment configuration missing | Run `hohu deploy init` and check the directory                                                                  |
| Services do not start            | Check image pulls, port conflicts and container logs                                                            |
| Grafana sign-in fails            | Distinguish initial credentials from passwords in existing volumes; do not delete volumes to recover an account |
| Dashboard has no data            | Check data sources, scrape targets and application metrics connectivity                                         |
