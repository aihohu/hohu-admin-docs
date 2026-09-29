from pydantic import ValidationError

from app.core.exceptions import AuthorizationException, BusinessRuleException
from app.modules.ai.agents.gateway.result import ResultProjection, ToolResult, UIResult
from app.modules.ai.agents.hitl.constants import DryRunResult
from app.modules.ai.agents.tools.decorator import ai_tool
from app.modules.ai.agents.tools.meta import AiToolMeta
from app.modules.ai.core.context import AiToolContext

from .schemas import NoteCreate, NoteOut
from .service import note_service


def _payload(title: str) -> NoteCreate:
    try:
        return NoteCreate(title=title)
    except ValidationError as exc:
        raise BusinessRuleException(
            "Title must contain 1–120 characters", error_code="NOTE_TITLE_INVALID"
        ) from exc


@ai_tool(
    AiToolMeta(
        name="note.list",
        agent="notes",
        summary="List up to 20 recent business notes in the current tenant.",
        required_perms=("business:note:list",),
        risk="low",
        readonly=True,
        idempotent=True,
        result_view="data_list",
        projection_kind="scope_bound",
    )
)
async def note_list(ctx: AiToolContext) -> ToolResult:
    page = await note_service.page(ctx.db, tenant=ctx.tenant, current=1, size=20)
    records = [note.model_dump(by_alias=True) for note in page.records]
    return ToolResult.success(
        data={
            "records": records,
            "total": page.total,
            "hasMore": page.total > len(records),
        },
        ui=UIResult(
            view_type="data_list",
            view_data={
                "columns": [{"key": "title", "label": "ai.tool.note.field.title"}],
                "rows": records,
            },
        ),
        projection=ResultProjection(
            subject_refs=tuple(
                {"type": "note", "id": row["noteId"]} for row in records
            ),
            scope_bound=True,
        ),
    )


@ai_tool(
    AiToolMeta(
        name="note.create",
        agent="notes",
        summary="Create one business note after explicit user confirmation.",
        required_perms=("business:note:add",),
        risk="high",
        hitl_always=True,
        dry_run_supported=True,
        idempotent=False,
        result_view="plain_json",
        projection_kind="scope_bound",
        args_summary_fields=("title",),
    )
)
async def note_create(ctx: AiToolContext, *, title: str) -> ToolResult:
    body = _payload(title)
    expected = {"tenant_id": str(ctx.tenant.tenant_id), "title": body.title}
    if ctx.approved_business_snapshot != expected:
        raise AuthorizationException(
            "A matching approval is required", error_code="NOTE_APPROVAL_REQUIRED"
        )
    note = await note_service.create(ctx.db, body, tenant=ctx.tenant)
    data = NoteOut.model_validate(note).model_dump(by_alias=True)
    return ToolResult.success(
        data=data,
        ui=UIResult(view_type="plain_json", view_data=data),
        projection=ResultProjection(
            subject_refs=({"type": "note", "id": data["noteId"]},),
            scope_bound=True,
        ),
    )


async def _dry_run_note_create(ctx: AiToolContext, *, title: str) -> DryRunResult:
    body = _payload(title)
    return DryRunResult(
        ok=True,
        count=1,
        reason="Create one business note",
        summary_key="page.ai.chat.confirmNoteCreate",
        summary_params={"title": body.title},
        confirmation_fields=[{"label": "title", "value": body.title}],
        execution_args={"title": body.title},
        business_snapshot={"tenant_id": str(ctx.tenant.tenant_id), "title": body.title},
    )
