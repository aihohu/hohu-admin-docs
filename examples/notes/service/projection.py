from sqlalchemy.ext.asyncio import AsyncSession

from app.core.tenant import TenantContext
from app.core.tenant_scope import tenant_select

from ..models import Note


async def can_view_note(
    db: AsyncSession, note_id: str, *, tenant: TenantContext
) -> bool:
    """Revalidate a tenant-wide note reference when old AI results are read."""
    try:
        value = int(note_id)
    except (TypeError, ValueError):
        return False
    if value <= 0:
        return False
    return (
        await db.scalar(tenant_select(Note, tenant=tenant).where(Note.note_id == value))
        is not None
    )
