---
title: '0.2 candidate: user field policies'
description: 'Understand user field policies, editing behavior, historical file limits, and upgrade and recovery requirements in the unreleased 0.2 candidate.'
---

# 0.2 candidate: user field policies

This page describes the **unreleased 0.2 development candidate**. [Release notes](versions.md) remain authoritative for the stable version and released artifacts; the other guides on this site continue to serve the 0.1 series. This page does not authorize a production upgrade or start an end-of-maintenance or deprecation countdown for 0.1. Backend and Web require joint validation. App/Desktop remain unreleased, and CLI versions are managed independently.

## How policies affect user operations

Field access depends on tenant, function permission, record scope, field, and purpose together. A role granting email access within Finance cannot borrow another role's company-wide record scope. An applicable explicit deny takes precedence. A super administrator's policy management authority does not bypass business field rules. New roles and fields receive no automatic field grants.

Open “User field policy” in role management, select fields, operations, and purposes, preview impact samples without business values, enter a reason, and publish. Publishing a candidate differs from first activation:

| State       | Behavior                                                                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `legacy`    | Uses the compatibility authorization path; field policies are not active                                                                                  |
| `ready`     | The candidate is prepared but not active                                                                                                                  |
| `enforcing` | The active policy governs connected user surfaces; publishing a revision takes effect immediately                                                         |
| `frozen`    | User business reads and writes are closed; minimal identity and authorized policy repair remain available; a published repair needs explicit reactivation |

Policy management requires `R_SUPER` plus the relevant `system:user:field-policy-view`, `system:user:field-policy-edit`, and `system:user:field-policy-activate` permissions. Existing roles need explicit grants after upgrade. The operator must also supply qualification bound to the current build; role permissions alone cannot enable the feature. On version conflicts, reload, review, and submit again. Do not automatically retry publication or activation.

Activation is irreversible: an activated tenant cannot return to `legacy` or `ready`. See the candidate branch's [backend field contract](https://github.com/aihohu/hohu-admin/blob/feat/v020-1-field-policy-core/docs/USER-FIELD-PROJECTION.md) for APIs and deployment qualification. After release, use the documentation snapshot bound by the product manifest.

## Editing, querying, and downloading

Hidden fields are omitted from responses. `null` means an actual empty value, not hidden data. Phone and email remain subject to each surface's existing masking limit. Write-only fields do not refill their old values. Enter a replacement when editing; a blank replacement normally leaves the value unchanged, while clearing requires an explicit action.

The new Web sends PATCH requests containing only changed fields. Omission preserves the value; explicit `null` clears a nullable field. Masked placeholders cannot be submitted. Role and department replacement requires complete visibility and replacement authority; a partial display cannot be written back as the entire set. Queries, aggregates, and fixed ordering also require permission. A list request can be rejected when its sort field is not readable.

PUT remains available, but every supplied field must be writable, including unchanged fields. An already-open 0.1.6 page may submit a whole form and be rejected. Refresh to the matching new Web, then review the changes again instead of repeatedly resubmitting. Client version markers do not exempt requests from server authorization.

Import checks the full field requirements before durable preview creation and before writes, including employee-number matching, default fields, and relationship assignment. Export intersects read and export permissions. Downloads recheck current authority, provenance, and file contents. When `FIELD_TRANSFER_REGENERATE_REQUIRED` is returned, generate a new file under current authorization. Obtain error attachments through the authenticated download action; opening a bare URL cannot bypass authentication.

Own-account access has a fixed self-service baseline. Removing an allow rule alone does not remove that baseline. To restrict a person's own phone or email, configure an explicit deny for the corresponding `own-account` purpose. That deny also applies to profile and email lookup endpoints.

## AI and historical records

Catalog, authority, or policy changes before confirmation can invalidate an old confirmation and require a new preview. A completed operation does not become failed because its result is no longer visible, and an unknown outcome must not be replayed automatically. Historical text or files without provable field provenance are hidden or refused after activation; audit facts remain preserved. Model narration does not replace actual tool outcomes and database state.

## Upgrade and recovery boundaries

Candidate validation targets fresh databases and formal 0.1.6. Only the final product manifest can establish supported platforms, image digests, CLI versions, and upgrade sources. A runnable database migration does not establish other direct cross-version upgrade paths.

1. Inventory old confirmations, unknown executions, files, and authorization revocations. Back up the database, uploads, private files, and encryption key.
2. Stop and isolate old API processes, schedulers, AI recovery/expiry tasks within the API, and other writers. Verify that they cannot re-enter and that no database transactions remain in flight. Direct startup and Docker Compose can both use existing maintenance interfaces; Ctrl+C alone is not trusted stop evidence.
3. Pin the same backend artifact for migration, API, and scheduler, together with the matching Web. Migration failure stops initialization; do not `stamp head`. Seed failure leaves maintenance in place until inspection and explicit recovery.
4. Verify history, permissions, and the matching Web in `legacy` / `ready`. Explicitly activate each tenant only after all surface qualification passes.

Even a preactivation backup restore must match the original application, files, and key. After activation, do not reconnect a 0.1.6 backend or restore an old database and expose reads, downloads, or AI. For disaster recovery, isolate entry points first, establish revocation and policy continuity using records independent of the backup, reconcile post-failure side effects, and recover forward using a version that supports field policies. Keep affected surfaces closed when only the database is restored, files are missing, or revocation evidence is incomplete. Increasing the backup's epoch cannot supply that evidence.

See the candidate branch's [database migration manual](https://github.com/aihohu/hohu-admin/blob/feat/v020-1-field-policy-core/docs/DATABASE-MIGRATIONS.md) for operational commands and migration constraints. Before a formal upgrade, check the [stable release notes](versions.md) and the target version's immutable product manifest.
