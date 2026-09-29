"""Run using the backend virtualenv with HOHU_BACKEND_PATH pointing at its checkout.

Uses SQLite memory only; does not connect to the configured application database.
"""

import os
from pathlib import Path
import sys
import unittest

BACKEND = Path(os.environ["HOHU_BACKEND_PATH"]).resolve()
sys.path.insert(0, str(BACKEND))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "examples"))
# Imported gateway modules construct a lazy asyncpg engine; it is never used.
os.environ["DATABASE_URL"] = "postgresql+asyncpg://docs:docs@127.0.0.1:1/docs"
os.environ["SECRET_KEY"] = "documentation-example-test-key-not-for-deployment"

from pydantic import ValidationError  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402

from app.core.tenant import TenantContext  # noqa: E402
from app.modules.system.models.tenant import Tenant  # noqa: E402, F401
from notes.models import Note  # noqa: E402
from notes.schemas import NoteCreate, NoteOut  # noqa: E402
from notes.service import note_service  # noqa: E402


class AsyncAdapter:
    """Execute service SQL through a synchronous in-memory test connection."""

    def __init__(self, session):
        self.session = session

    def add(self, value):
        self.session.add(value)

    async def flush(self):
        self.session.flush()

    async def scalar(self, query):
        return self.session.scalar(query)

    async def scalars(self, query):
        return self.session.scalars(query)


class NotesExampleTest(unittest.IsolatedAsyncioTestCase):
    async def test_paging_scopes_count_and_records_and_preserves_transaction(self):
        engine = create_engine("sqlite://")
        # Create only the example table; production FK is covered by migrations.
        with engine.begin() as connection:
            connection.exec_driver_sql(
                "CREATE TABLE biz_note (note_id BIGINT PRIMARY KEY, "
                "tenant_id BIGINT NOT NULL, title VARCHAR(120) NOT NULL)"
            )
        try:
            with Session(engine) as session:
                session.add_all(
                    [
                        Note(note_id=9007199254740993, tenant_id=1, title="First"),
                        Note(note_id=9007199254740994, tenant_id=1, title="Second"),
                        Note(note_id=9007199254740995, tenant_id=2, title="Private"),
                    ]
                )
                session.flush()
                tenant = TenantContext(1, "alpha", 1, 1, "access_token")
                db = AsyncAdapter(session)
                page = await note_service.page(db, tenant=tenant, current=1, size=1)
                self.assertEqual(page.total, 2)
                self.assertEqual(page.records[0].title, "Second")
                self.assertEqual(
                    page.records[0].model_dump(by_alias=True)["noteId"],
                    "9007199254740994",
                )
                page2 = await note_service.page(db, tenant=tenant, current=2, size=1)
                self.assertEqual(page2.records[0].title, "First")
                note = await note_service.create(
                    db, NoteCreate(title="Third"), tenant=tenant
                )
                self.assertEqual(note.tenant_id, 1)
                self.assertEqual(NoteOut.model_validate(note).title, "Third")
                session.rollback()
                self.assertEqual(session.query(Note).count(), 0)
        finally:
            engine.dispose()

    async def test_input_rejects_tenant_override_and_empty_title(self):
        for body in ({"title": "ok", "tenantId": 2}, {"title": "  "}):
            with self.assertRaises(ValidationError):
                NoteCreate.model_validate(body)


if __name__ == "__main__":
    unittest.main()
