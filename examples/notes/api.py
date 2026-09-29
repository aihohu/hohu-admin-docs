from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import require_permissions
from app.core.base_response import PageResult, ResponseModel
from app.core.tenant import TenantContext
from app.db.session import get_db
from app.modules.auth.service import get_current_tenant_context

from .schemas import NoteCreate, NoteOut
from .service import note_service

router = APIRouter(prefix="/business/notes", tags=["Notes"])


@router.get(
    "",
    response_model=ResponseModel[PageResult[NoteOut]],
    dependencies=[Depends(require_permissions("business:note:list"))],
)
async def list_notes(
    current: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    tenant: TenantContext = Depends(get_current_tenant_context),
):
    return ResponseModel.success(
        await note_service.page(db, tenant=tenant, current=current, size=size)
    )


@router.post(
    "",
    response_model=ResponseModel[NoteOut],
    dependencies=[Depends(require_permissions("business:note:add"))],
)
async def create_note(
    body: NoteCreate,
    db: AsyncSession = Depends(get_db),
    tenant: TenantContext = Depends(get_current_tenant_context),
):
    note = await note_service.create(db, body, tenant=tenant)
    result = NoteOut.model_validate(note)
    await db.commit()
    return ResponseModel.success(result)
