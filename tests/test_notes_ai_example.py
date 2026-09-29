"""Exercise tutorial tools without models, Redis or the application database."""

import unittest
from types import SimpleNamespace

from test_notes_example import AsyncAdapter, Note, TenantContext, create_engine, Session

from app.core.exceptions import AuthorizationException
from app.modules.ai.core.context import AiToolContext, DataScopeContext
from app.modules.ai.agents.tools.registry import ToolRegistry
from app.modules.ai.schemas.confirm import ConfirmationPresentation
from notes.ai_tools import note_create, note_list, _dry_run_note_create
from notes.projection import can_view_note


class NotesAiExampleTest(unittest.IsolatedAsyncioTestCase):
    async def test_registration_resolves_preview_and_validates_catalog(self):
        registry = ToolRegistry()
        for function in (note_list, note_create):
            registry.register(function.__ai_tool_meta__, function)

        class Catalog:
            def __init__(self):
                self.results = iter(
                    [["notes"], ["business:note:list", "business:note:add"]]
                )

            async def execute(self, query):
                rows = next(self.results)
                return SimpleNamespace(
                    scalars=lambda: SimpleNamespace(all=lambda: rows)
                )

        await registry.validate_on_startup(Catalog())
        self.assertIs(registry.find("note.create").dry_run_fn, _dry_run_note_create)

    async def test_tools_keep_scope_preview_is_read_only_and_create_needs_approval(
        self,
    ):
        engine = create_engine("sqlite://")
        with engine.begin() as connection:
            connection.exec_driver_sql(
                "CREATE TABLE biz_note (note_id BIGINT PRIMARY KEY, "
                "tenant_id BIGINT NOT NULL, title VARCHAR(120) NOT NULL)"
            )
        try:
            with Session(engine) as session:
                session.add_all(
                    [
                        Note(note_id=101, tenant_id=1, title="Visible"),
                        Note(note_id=102, tenant_id=2, title="Other tenant"),
                    ]
                )
                session.flush()
                tenant = TenantContext(1, "alpha", 1, 1, "access_token")
                db = AsyncAdapter(session)
                ctx = AiToolContext(
                    user=SimpleNamespace(user_id=1),
                    perms={"business:note:list", "business:note:add"},
                    db=db,
                    data_scope=DataScopeContext(tenant, None, None),
                    trace_id="docs-example",
                    tool_meta=note_list.__ai_tool_meta__,
                    tenant=tenant,
                )
                result = await note_list(ctx)
                self.assertEqual(result.data["total"], 1)
                self.assertEqual(result.data["records"][0]["noteId"], "101")
                self.assertEqual(
                    result.projection.subject_refs, ({"type": "note", "id": "101"},)
                )
                self.assertTrue(await can_view_note(db, "101", tenant=tenant))
                self.assertFalse(await can_view_note(db, "102", tenant=tenant))
                self.assertFalse(await can_view_note(db, "invalid", tenant=tenant))
                preview = await _dry_run_note_create(ctx, title="  Demo  ")
                ConfirmationPresentation.model_validate(
                    {
                        "title": "note.create",
                        "summaryKey": preview.summary_key,
                        "summaryParams": preview.summary_params,
                        "fields": preview.confirmation_fields,
                    }
                )
                self.assertEqual(session.query(Note).count(), 2)
                self.assertEqual(preview.execution_args, {"title": "Demo"})
                ctx.tool_meta = note_create.__ai_tool_meta__
                self.assertTrue(ctx.tool_meta.hitl_always)
                with self.assertRaises(AuthorizationException):
                    await note_create(ctx, title="Demo")
                ctx.approved_business_snapshot = preview.business_snapshot
                with self.assertRaises(AuthorizationException):
                    await note_create(ctx, title="Changed")
                created = await note_create(ctx, title="Demo")
                self.assertTrue(created.ok)
                self.assertEqual(created.data["title"], "Demo")
                session.rollback()
                self.assertEqual(session.query(Note).count(), 0)
        finally:
            engine.dispose()


if __name__ == "__main__":
    unittest.main()
