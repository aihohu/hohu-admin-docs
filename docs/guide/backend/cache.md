---
title: Caching
description: 'HoHu caching: steps, scope and limitations'
---

# Caching

Ordinary business caching lives in `app/core/cache.py`, with read/write/delete helpers and decorators. Graceful degradation for an ordinary cache does not authorize fail-open behavior for authentication, throttling, locks or idempotency state.

## Tenant namespaces

Use `tenant_cache_key(tenant, namespace, *parts)` from `app/core/tenant_scope.py` for tenant data, including tenant, purpose and resource identifiers. Do not use a shared `user:{id}` key or parameter cache without tenant scope.

Validate current authority before returning cached data; a revoked user must not regain old results through cache hits. After a successful database commit, invalidate the relevant tenant/purpose cache. Services do not commit; avoid invalidating or publishing values before a transaction that may fail.

## Different kinds of state

- Display-data caches may fall back to database reads according to their helper contract.
- HTTP request throttling uses separate Redis atomic counters: quota exhaustion returns 429 and storage failure returns 503.
- AI confirmations, locks and idempotency are execution-correctness state. Follow their recovery protocols rather than ordinary cache-degradation rules.

Test same-named keys across tenants, failed commits, invalidation and Redis failures. See [Configuration ownership](../reference/configuration).
