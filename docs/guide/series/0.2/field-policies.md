---
title: '0.2 candidate: user field policies'
description: 'Understand user field policies, editing behavior, historical file limits, and upgrade and recovery requirements in the unreleased 0.2 candidate.'
---

# 0.2 candidate: user field policies

This page describes the **unreleased 0.2 development candidate**. [Release notes](../../reference/versions.md) remain authoritative for the stable version and released artifacts; the 0.1 manuals retain their original paths; see the [series overview](index.md) for this documentation scope. This page does not authorize a production upgrade or start an end-of-maintenance or deprecation countdown for 0.1. Backend and Web require joint validation. App/Desktop remain unreleased, and CLI versions are managed independently.

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

Activation is irreversible: an activated tenant cannot return to `legacy` or `ready`. See the fixed candidate source’s [backend field contract](https://github.com/aihohu/hohu-admin/blob/20cb459eb71d8b95b114bbb1bdb6c7c41e9558c2/docs/USER-FIELD-PROJECTION.md) for APIs and deployment qualification. After release, use the documentation snapshot bound by the product manifest.

## Editing, querying, and downloading

Hidden fields are omitted from responses. `null` means an actual empty value, not hidden data. Phone and email remain subject to each surface's existing masking limit. Write-only fields do not refill their old values. Enter a replacement when editing; a blank replacement normally leaves the value unchanged, while clearing requires an explicit action.

The new Web sends PATCH requests containing only changed fields. Omission preserves the value; explicit `null` clears a nullable field. Masked placeholders cannot be submitted. Role and department replacement requires complete visibility and replacement authority; a partial display cannot be written back as the entire set. Queries, aggregates, and fixed ordering also require permission. A list request can be rejected when its sort field is not readable.

PUT remains available, but every supplied field must be writable, including unchanged fields. An already-open 0.1.6 page may submit a whole form and be rejected. Refresh to the matching new Web, then review the changes again instead of repeatedly resubmitting. Client version markers do not exempt requests from server authorization.

Import checks the full field requirements before durable preview creation and before writes, including employee-number matching, default fields, and relationship assignment. Export intersects read and export permissions. Downloads recheck current authority, provenance, and file contents. When `FIELD_TRANSFER_REGENERATE_REQUIRED` is returned, generate a new file under current authorization. Obtain error attachments through the authenticated download action; opening a bare URL cannot bypass authentication.

Own-account access has a fixed self-service baseline. Removing an allow rule alone does not remove that baseline. To restrict a person's own phone or email, configure an explicit deny for the corresponding `own-account` purpose. That deny also applies to profile and email lookup endpoints.

## AI and historical records

Catalog, authority, or policy changes before confirmation can invalidate an old confirmation and require a new preview. A completed operation does not become failed because its result is no longer visible, and an unknown outcome must not be replayed automatically. Historical text or files without provable field provenance are hidden or refused after activation; audit facts remain preserved. Model narration does not replace actual tool outcomes and database state.

For writer shutdown and recovery requirements, read [0.2 upgrade and recovery](upgrade.md).
