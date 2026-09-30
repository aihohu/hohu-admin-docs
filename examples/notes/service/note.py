from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.base_response import PageResult
from app.core.tenant import TenantContext
from app.core.tenant_scope import tenant_filter, tenant_select, tenant_values

from ..models import Note
from ..schemas import NoteCreate, NoteOut


class NoteService:
    async def create(
        self, db: AsyncSession, body: NoteCreate, *, tenant: TenantContext
    ) -> Note:
        note = Note(**tenant_values(body.model_dump(), tenant=tenant))
        db.add(note)
        await db.flush()
        return note

    async def page(
        self, db: AsyncSession, *, tenant: TenantContext, current: int, size: int
    ) -> PageResult[NoteOut]:
        total = await db.scalar(
            select(func.count())
            .select_from(Note)
            .where(tenant_filter(Note, tenant=tenant))
        )
        query = (
            tenant_select(Note, tenant=tenant)
            .order_by(Note.note_id.desc())
            .offset((current - 1) * size)
            .limit(size)
        )
        rows = (await db.scalars(query)).all()
        return PageResult(
            records=[NoteOut.model_validate(row) for row in rows],
            total=total or 0,
            current=current,
            size=size,
        )


note_service = NoteService()
