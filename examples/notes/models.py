from sqlalchemy import BigInteger, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.id_generator import next_id
from app.db.base import Base


class Note(Base):
    __tablename__ = "biz_note"
    __table_args__ = (Index("ix_biz_note_tenant_id_note_id", "tenant_id", "note_id"),)

    note_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, default=next_id)
    tenant_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("sys_tenant.tenant_id", ondelete="RESTRICT"),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(120), nullable=False)
