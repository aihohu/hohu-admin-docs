---
title: Health checks and troubleshooting
description: Diagnose HoHu deployments with service state, logs, liveness checks, and Prometheus metrics, and establish operational checks.
---

# Health checks and troubleshooting

Locate the failure first: browser, proxy, application, or infrastructure. Then inspect the relevant logs. Run these commands inside the deployment directory or a child directory.

## Command reference

| Purpose            | Command                                    |
| ------------------ | ------------------------------------------ |
| Service state      | `hohu deploy ps`                           |
| API logs           | `hohu deploy logs -f hohu-admin-api`       |
| Scheduler logs     | `hohu deploy logs -f hohu-admin-scheduler` |
| Web logs           | `hohu deploy logs -f hohu-admin-web`       |
| Bundled proxy logs | `hohu deploy logs -f nginx`, when enabled  |
| Monitoring state   | `hohu monitoring ps`                       |

Ctrl+C exits log following without stopping services. Preserve errors and timestamps before restarting. Restarts do not fix invalid configuration or missing migrations.

## What health checks establish

Backend `/health` returns `{"status":"ok"}`. It confirms process responsiveness, not database, Redis, job, or model-provider health. The default Compose API health check uses this endpoint.

If API is bound to host loopback as described in this guide, check it on the server:

```bash
curl --fail http://127.0.0.1:8000/health
```

A successful Web page also does not prove API connectivity. Verify sign-in, a permission-protected read, file operations, and the jobs or AI workflows required by your deployment.

## Enable monitoring

```bash
hohu monitoring init
hohu monitoring up
hohu monitoring ps
```

Templates include Prometheus, Grafana, and AI dashboards. Check that the hohu-admin-api target is UP in Prometheus, then verify Grafana's data source and time range. See [CLI monitoring](../cli/monitoring) for options, initial credentials, and ports.

`/metrics` returns Prometheus text, not business JSON. Restrict it to monitoring networks. Public proxies should block both `/metrics` and prefixed API paths that expose it. Default monitoring port bindings are not loopback-only; apply network controls for your deployment.

## Troubleshooting reference

| Symptom                         | Check first                                           | Next step                                                  |
| ------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| Site unreachable                | DNS, TLS, published ports, proxy process              | [Networking and HTTPS](./network)                          |
| 502 / 504                       | Web / API state, upstream address, startup logs       | Check dependencies and proxy timeouts                      |
| Migration fails                 | Database connection, current revision, target version | [Upgrade and recovery](./upgrade)                          |
| API works but jobs fail         | Scheduler logs and external connection overrides      | [External services](../deploy#external-services)           |
| 403 after sign-in               | User, role, tenant status, permission code            | [Error codes](../backend/error-code-list)                  |
| Upload 413                      | Limits at every proxy and the application             | [Upload policies](../reference/settings)                   |
| AI response arrives all at once | Proxy buffering and SSE timeouts                      | Disable streaming-path buffering and verify the full chain |
| 429 / 503                       | Retry-After, Redis, relevant switches                 | [Error handling](../backend/error-code)                    |
| Private files missing           | Shared mounts, files, and records                     | Check matching backups; do not expose private directories  |

## Routine checks

Check disk and volume capacity, log growth, backup results, recovery rehearsals, certificate expiry, failed jobs, and request error rates. Monitor important business paths, not just running containers.

Issue reports should include versions, timestamps, affected services, stable error codes, and redacted logs. Do not submit complete `.env` files, tokens, passwords, or business files. See [source and licensing](../src) for repositories and issue reporting.
