"""Exercise the production publisher on a real POSIX filesystem."""

import hashlib
import io
import os
import subprocess
import sys
import tarfile
import tempfile
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

SCRIPT = Path(__file__).resolve().parents[1] / "scripts/deploy/publish.py"
UPLOAD_SCRIPT = SCRIPT.with_name("upload.sh")


class DeploymentTest(unittest.TestCase):
    def setUp(self):
        temporary_root = Path(os.environ["HOHU_DEPLOY_TEST_DIR"])
        temporary_root.mkdir(parents=True, exist_ok=True)
        self.temporary = tempfile.TemporaryDirectory(dir=temporary_root)
        self.base = Path(self.temporary.name) / "site"
        self.incoming = self.base / ".incoming"
        self.incoming.mkdir(parents=True)
        self.unhealthy = False
        self.wrong_marker = False
        self.block_health = False
        self.health_entered = threading.Event()
        self.health_continue = threading.Event()
        fixture = self

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                path = urlsplit(self.path).path
                if path == "/release.txt" and fixture.block_health:
                    fixture.health_entered.set()
                    fixture.health_continue.wait(10)
                file = fixture.base / "current" / path.lstrip("/")
                if file.is_dir():
                    file = file / "index.html"
                if fixture.unhealthy or not file.is_file():
                    self.send_error(503)
                    return
                self.send_response(200)
                self.end_headers()
                content = (
                    b"another-release"
                    if path == "/release.txt" and fixture.wrong_marker
                    else file.read_bytes()
                )
                try:
                    self.wfile.write(content)
                except BrokenPipeError:
                    pass

            def log_message(self, *_args):
                pass

        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.health_url = f"http://127.0.0.1:{self.server.server_port}"
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.health_continue.set()
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.temporary.cleanup()

    @staticmethod
    def release(number):
        return f"{number:040x}-{number}-1"

    def archive(self, number, missing=None, extra=None):
        files = {
            "index.html": b"English home",
            "zh/index.html": b"Chinese home",
            "guide/user/index.html": b"English guide",
            "zh/guide/user/index.html": b"Chinese guide",
            "404.html": b"Not found",
            "sitemap.xml": b"<urlset />",
            f"assets/app.{number}.js": str(number).encode(),
        }
        files.pop(missing, None)
        if extra:
            files.update(extra)
        path = self.incoming / f"{self.release(number)}.tar.gz"
        with tarfile.open(path, "w:gz") as archive:
            for name, content in files.items():
                member = tarfile.TarInfo(name)
                if isinstance(content, tarfile.TarInfo):
                    archive.addfile(content)
                else:
                    member.size = len(content)
                    archive.addfile(member, io.BytesIO(content))
        return path, hashlib.sha256(path.read_bytes()).hexdigest()

    def command(self, number, *, rollback=False, digest=None, **archive_options):
        command = [
            sys.executable,
            "-B",
            str(SCRIPT),
            "rollback" if rollback else "publish",
            "--base",
            str(self.base),
            "--health-url",
            self.health_url,
            "--health-attempts",
            "1",
        ]
        if not rollback:
            archive, actual_digest = self.archive(number, **archive_options)
            command.extend(
                [
                    "--release",
                    self.release(number),
                    "--archive",
                    str(archive),
                    "--sha256",
                    digest or actual_digest,
                ]
            )
        return command

    def run_command(self, command, success=True):
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=20,
            preexec_fn=lambda: os.umask(0o077),
        )
        if success:
            self.assertEqual(result.returncode, 0, result.stderr)
        else:
            self.assertNotEqual(result.returncode, 0)
        return result

    def current(self):
        return (self.base / "current" / "release.txt").read_text().strip()

    def test_publish_rollback_and_old_assets(self):
        self.run_command(self.command(1))
        self.assertEqual((self.base / "current/zh").stat().st_mode & 0o777, 0o755)
        self.assertEqual(
            (self.base / "current/index.html").stat().st_mode & 0o777, 0o644
        )
        self.run_command(self.command(2))
        self.assertEqual(self.current(), self.release(2))
        self.assertEqual((self.base / "previous").resolve().name, self.release(1))
        self.assertEqual((self.base / "shared-assets/app.1.js").read_bytes(), b"1")
        self.run_command(self.command(0, rollback=True))
        self.assertEqual(self.current(), self.release(1))
        self.assertEqual((self.base / "previous").resolve().name, self.release(2))

    def test_checksum_failure_does_not_change_current(self):
        self.run_command(self.command(1))
        result = self.run_command(self.command(2, digest="0" * 64), success=False)
        self.assertIn("checksum", result.stderr.lower())
        self.assertEqual(self.current(), self.release(1))

    def test_archive_rejects_path_traversal_and_links(self):
        for number, name, content in [
            (1, "../../escaped.txt", b"escape"),
            (2, "/absolute.txt", b"escape"),
            (3, "assets/link.js", tarfile.TarInfo("assets/link.js")),
        ]:
            with self.subTest(name=name):
                if isinstance(content, tarfile.TarInfo):
                    content.type = tarfile.SYMTYPE
                    content.linkname = "../../escaped.txt"
                self.run_command(
                    self.command(number, extra={name: content}), success=False
                )
                self.assertFalse((self.base / "current").is_symlink())
                self.assertFalse((self.base / "escaped.txt").exists())

    def test_missing_page_and_conflicting_asset_do_not_switch(self):
        self.run_command(self.command(1))
        self.run_command(self.command(2, missing="zh/index.html"), success=False)
        self.assertEqual(self.current(), self.release(1))
        self.run_command(
            self.command(3, extra={"assets/app.1.js": b"changed"}), success=False
        )
        self.assertEqual(self.current(), self.release(1))
        self.assertEqual((self.base / "shared-assets/app.1.js").read_bytes(), b"1")

    def test_failed_health_restores_current_and_previous(self):
        self.run_command(self.command(1))
        self.run_command(self.command(2))
        self.unhealthy = True
        self.run_command(self.command(3), success=False)
        self.assertEqual(self.current(), self.release(2))
        self.assertEqual((self.base / "previous").resolve().name, self.release(1))
        self.run_command(self.command(0, rollback=True), success=False)
        self.assertEqual(self.current(), self.release(2))
        self.assertEqual((self.base / "previous").resolve().name, self.release(1))

    def test_failed_first_publish_leaves_no_current(self):
        self.unhealthy = True
        self.run_command(self.command(1), success=False)
        self.assertFalse((self.base / "current").is_symlink())

    def test_healthy_pages_with_wrong_release_marker_are_rejected(self):
        self.run_command(self.command(1))
        self.wrong_marker = True
        result = self.run_command(self.command(2), success=False)
        self.assertIn("another release", result.stderr)
        self.assertEqual(self.current(), self.release(1))

    def test_interrupted_health_check_restores_current(self):
        self.run_command(self.command(1))
        self.block_health = True
        process = subprocess.Popen(
            self.command(2), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        try:
            self.assertTrue(self.health_entered.wait(5))
            process.terminate()
            _stdout, stderr = process.communicate(timeout=10)
            self.assertNotEqual(process.returncode, 0, stderr)
            self.assertEqual(self.current(), self.release(1))
        finally:
            self.health_continue.set()
            if process.poll() is None:
                process.kill()
                process.communicate()

    def test_invalid_release_and_external_archive_are_rejected(self):
        command = self.command(1)
        command[command.index("--release") + 1] = "../outside"
        self.run_command(command, success=False)
        command = self.command(2)
        command[command.index("--archive") + 1] = str(self.base / "outside.tar.gz")
        self.run_command(command, success=False)
        self.assertFalse((self.base / "current").is_symlink())

    def test_symlinked_release_directory_is_rejected(self):
        outside = Path(self.temporary.name) / "outside"
        outside.mkdir()
        (self.base / "releases").symlink_to(outside, target_is_directory=True)
        self.run_command(self.command(1), success=False)
        self.assertEqual(list(outside.iterdir()), [])

    def test_server_lock_serializes_publishers(self):
        self.block_health = True
        first = subprocess.Popen(
            self.command(1), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        second = None
        try:
            self.assertTrue(self.health_entered.wait(5))
            second = subprocess.Popen(
                self.command(2),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            with self.assertRaises(subprocess.TimeoutExpired):
                second.wait(timeout=0.3)
            self.health_continue.set()
            for process in [first, second]:
                _stdout, stderr = process.communicate(timeout=15)
                self.assertEqual(process.returncode, 0, stderr)
            self.assertEqual(self.current(), self.release(2))
        finally:
            self.health_continue.set()
            for process in [first, second]:
                if process and process.poll() is None:
                    process.kill()
                    process.communicate()

    def client_environment(self):
        return {
            **os.environ,
            "GITHUB_WORKSPACE": str(self.base),
            "DOCS_SSH_HOST": "example.invalid",
            "DOCS_SSH_USER": "docs-deploy",
            "DOCS_SSH_PORT": "22",
            "DOCS_DEPLOY_PATH": "/var/www/docs-site",
            "DOCS_SITE_ORIGIN": "https://example.invalid",
            "DOCS_SSH_KEY": "private-key-must-not-be-logged",
            "DOCS_SSH_KNOWN_HOSTS": "example.invalid ssh-ed25519 example",
            "RELEASE_ID": self.release(1),
        }

    def test_client_rejects_unsafe_connection_values_before_upload(self):
        for key, value in (
            ("DOCS_SSH_HOST", "host; unexpected-command"),
            ("DOCS_SSH_USER", "-root"),
            ("DOCS_SSH_PORT", "0"),
            ("DOCS_SSH_PORT", "65536"),
            ("DOCS_DEPLOY_PATH", "/var/www/site/../../outside"),
            ("DOCS_DEPLOY_PATH", "/var/www/site//nested"),
            ("RELEASE_ID", "../outside"),
        ):
            with self.subTest(key=key, value=value):
                result = subprocess.run(
                    ["bash", str(UPLOAD_SCRIPT)],
                    env={**self.client_environment(), key: value},
                    capture_output=True,
                    text=True,
                    timeout=5,
                )
                self.assertNotEqual(result.returncode, 0)
                self.assertNotIn("private-key-must-not-be-logged", result.stderr)
                self.assertFalse((self.base / ".local/private").exists())

    def test_client_removes_temporary_credentials_after_transport_failure(self):
        artifact = self.base / ".local/artifacts/website.tar.gz"
        artifact.parent.mkdir(parents=True)
        artifact.write_bytes(b"upload fixture")
        publisher = self.base / "scripts/deploy/publish.py"
        publisher.parent.mkdir(parents=True)
        publisher.write_text("# publisher fixture")
        tools = self.base / "mock-tools"
        tools.mkdir()
        for name, contents in {
            "ssh": '#!/bin/sh\nprintf "%s\\n" "$@" >> "$SSH_TEST_LOG"\n',
            "scp": '#!/bin/sh\nprintf "upload failed\\n" >&2\nexit 1\n',
        }.items():
            tool = tools / name
            tool.write_text(contents)
            tool.chmod(0o755)
        log = self.base / "ssh.log"
        result = subprocess.run(
            ["bash", str(UPLOAD_SCRIPT)],
            env={
                **self.client_environment(),
                "PATH": f"{tools}:{os.environ['PATH']}",
                "SSH_TEST_LOG": str(log),
            },
            capture_output=True,
            text=True,
            timeout=10,
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("upload failed", result.stderr)
        self.assertNotIn(
            "private-key-must-not-be-logged", result.stdout + result.stderr
        )
        self.assertEqual(list((self.base / ".local/private").iterdir()), [])
        self.assertIn("rm -f", log.read_text())

    def test_client_rejects_unsafe_site_origin_before_upload(self):
        for origin in (
            "https://host'; unexpected-command",
            "https://host/subpath",
            "https://user:password@host",
            "http://host",
        ):
            with self.subTest(origin=origin):
                result = subprocess.run(
                    ["bash", str(UPLOAD_SCRIPT)],
                    env={**self.client_environment(), "DOCS_SITE_ORIGIN": origin},
                    capture_output=True,
                    text=True,
                    timeout=5,
                )
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("site origin", result.stderr.lower())
                self.assertFalse((self.base / ".local/private").exists())

    def test_cli_requires_explicit_site_directory_and_origin(self):
        result = self.run_command(
            [sys.executable, "-B", str(SCRIPT), "rollback"], success=False
        )
        self.assertIn("required", result.stderr)
        self.assertIn("--base", result.stderr)
        self.assertIn("--health-url", result.stderr)


if __name__ == "__main__":
    unittest.main()
