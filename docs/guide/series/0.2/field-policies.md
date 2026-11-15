---
title: '0.2 candidate: system field permissions'
description: 'Object coverage, menu and role boundaries, six purposes, candidate activation, files, AI and policy repair.'
---

# 0.2 candidate: system field permissions

**0.2 is not formally released.** This page describes the current development candidate. [Release notes](../../reference/versions.md) and the eventual immutable manifest determine released artifacts and production upgrade support. See the [series overview](index.md) for pinned sources and the [upgrade guide](upgrade.md) for shutdown and recovery. App/Desktop are outside the formal release scope.

## Coverage and authorization boundaries {#how-policies-affect-user-operations}

The generic catalog contains 23 objects, 250 fields and 128 registered actions. It covers the following surfaces. Database columns are not automatically configurable: passwords, secrets, tenant anchors and fixed platform boundaries cannot be opened by role rules.

| Area                          | Objects                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Ordinary and relation objects | Users, dictionary types, dictionary items, data-scope examples, roles, departments and menus                                  |
| Configuration and scheduling  | Configuration, settings and job definitions                                                                                   |
| Transfer and files            | Files, import batches, export tasks and transfer audits                                                                       |
| AI and log delivery           | Agents, conversations, messages, AI operation logs, routing logs and feedback, system operation logs, login logs and job logs |

Menu and function permissions allow an action; data scope limits records; field rules allow a field for a particular purpose. All three must hold. A field grant from one role cannot borrow another role's wider record scope. Explicit deny wins for the same record. `R_SUPER` does not bypass business field rules. Minimal identity, navigation, public account capabilities and platform controls have fixed protocols; they cannot copy or authorize arbitrary business fields.

Field rules belong to a particular tenant and role. Tenant creation, tenant enablement and field activation are separate operations. Platform principal authority does not replace tenant field grants. New tenants in a generic deployment receive empty policy state and do not inherit Default Tenant rules. After bootstrap, an administrator with dedicated permissions configures and explicitly activates the policy. Missing tenant policy state cannot reopen legacy authorization. Never-migrated deployments have a defined compatibility boundary; it does not establish defaults after activation.

## Configure from role management

Open **Field permissions**, immediately to the right of Menu permissions in the existing role row actions. Management requires an enabled `R_SUPER` and explicit `system:role:field-policy-view`. Editing and ready require `system:role:field-policy-edit`; activation and freeze require `system:role:field-policy-activate`. Wildcard button authority cannot replace these codes. Configure them explicitly before upgrading every initialized or enabled tenant, including disabled tenants.

When role fields are unavailable or frozen, an authorized manager can clear business filters and use a repair list containing only role IDs. The same row action opens field permissions. Protected role names are not guessed, and other business writes remain disabled. Refresh after activation to restore the ordinary list.

The drawer groups purposes into Read and query, Create and update, and Import and export. Each object offers only purposes actually supported by the server.

| Purpose | Meaning                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------- |
| Read    | View permitted plain or masked values in registered lists, details and derived displays              |
| Query   | Registered filtering, matching, sorting, joins or aggregation                                        |
| Create  | Fields accepted by ordinary creation                                                                 |
| Update  | Fields accepted by ordinary updates, independently of read access                                    |
| Import  | Separate creation, update and matching checks, including defaults and relations filled by the server |
| Export  | Intersection with read, record scope and the export function permission                              |

These purposes do not automatically cover password reset, relation delegation, publication or job execution. Custom buttons need a registered backend action and field-purpose mapping. A button grants no additional field access; import cannot borrow ordinary create/update grants.

**Unconfigured means not granted after activation.** New roles, objects and purposes do not inherit all fields. Default recommended configuration only fills unconfigured safe read/query choices for the current object and preserves explicit denies and write settings; it never runs automatically. Allow all and Deny all are to its right and apply to the complete current object/tab catalog, independently of search filters. Structural fields and passwords are skipped, and sensitive reads retain mask limits.

## Candidates, activation and freeze

Own-account operations have a code-registered minimal self-service baseline. Removing an allow rule does not cancel it. Restricting the account owner's phone or email requires an explicit deny for the corresponding `own-account` purpose, which also applies to profile and email-query surfaces. Self-service grants do not authorize other management fields.

Saving a candidate leaves the active policy unchanged. Preview shows abstract rule differences without business values. Supply a reason, save the revision, then seal the complete tenant role/object manifest. A drawer or search result cannot stand in for the complete manifest.

| State or operation | Behavior                                                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `preparing`        | Generic state exists; business fields fail closed while authorized repair controls remain available                                       |
| ready              | Establish a bounded readiness watermark for the complete candidate, without switching active policy; at most 15 minutes                   |
| activate           | Atomically switch the complete tenant manifest under current qualification, versions and epochs                                           |
| `enforcing`        | Business surfaces use the sealed active manifest; later candidate saves still do not take effect immediately                              |
| `frozen`           | Freeze the object and its source-dependent closure, preserving history and repair; recovery requires verification and explicit activation |

The deployment must also supply a server-owned qualification bound to the exact Backend build, catalog and complete surface evidence. Missing or expired qualification permits candidate repair but blocks ready/activate. Confirm both steps separately. Candidate, authority, catalog or epoch changes invalidate readiness. An enforced policy cannot revert to legacy compatibility. Preserve the request ID for an unknown outcome and check its receipt without resubmitting. Identity handoff clears drafts; old dialogs and late responses cannot act on the new identity.

See the pinned [management contract](https://github.com/aihohu/hohu-admin/blob/e43460a921cab4ab95b59e8bdba8d6bfc0afff79/docs/FIELD-POLICY-MANAGEMENT.md) and [storage contract](https://github.com/aihohu/hohu-admin/blob/e43460a921cab4ab95b59e8bdba8d6bfc0afff79/docs/FIELD-POLICY-STORAGE.md) for APIs and qualification format. New management IDs, versions and epochs are decimal strings. A browser cannot supply tenant, actor or qualification assertions.

## Lists, relations, import and downloads {#editing-querying-and-downloading}

Hidden fields are omitted from DTOs; `null` means a real empty value. Web columns follow the actual projection instead of showing a whole unauthorized column with a placeholder. Per-record differences never fill in hidden values. Hidden export columns are omitted. Write-only fields do not refill the original value. Untouched replacement inputs are omitted; explicitly edited empty values follow the field contract for empty strings or null.

The new Web submits actual changes. Every field carried by an old whole-object form must be writable, even if unchanged. Use the matching Web after rejection; do not retry repeatedly or rely on a version header. Replacing a relation set requires complete visibility and replacement authority. Derived owner, department and role names also require source-field access. Query checks cover the full scope, including filters, ordering and total, rather than only the displayed page.

Templates, import preview, defaults, matching and final writes use the registered contract. Export uses the current read/export intersection. Error files, exports and old download links recheck current authority, lineage and file contents. Regenerate under current permission when `FIELD_TRANSFER_REGENERATE_REQUIRED` is returned. A raw address cannot replace authenticated download.

## AI, audit and background delivery {#ai-and-historical-records}

Model context, tool preview, confirmation, execution, history, cache and final delivery recheck registered purpose and sources. Authority or epoch changes can require a new preview. A successful write does not become failed because its result is hidden; unknown outcomes must not be re-executed. Model prose does not replace tool cards or database facts.

Conversations, files and historical bodies without trustworthy provenance remain hidden or unavailable while audit facts are preserved. They are not claimed as current-user data. Log access does not expose all request parameters, error bodies or model output. Configuration and job parameters follow dynamic-value and task specifications; field allow cannot open arbitrary secrets or code. Background jobs, recovery and expiry scanning share the same shutdown and delivery boundaries.
