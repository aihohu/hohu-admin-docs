#!/usr/bin/env python3
"""Publish a checked static website on Ubuntu, or switch to a retained release."""

import argparse
import fcntl
import hashlib
import os
import re
import shutil
import signal
import sys
import tarfile
import tempfile
import time
import uuid
from pathlib import Path, PurePosixPath
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen

RELEASE_PATTERN = re.compile(r"[0-9a-f]{40}-[0-9]+-[0-9]+")
REQUIRED_FILES = (
    "index.html",
    "zh/index.html",
    "guide/user/index.html",
    "zh/guide/user/index.html",
    "404.html",
    "sitemap.xml",
)


def require(condition, message):
    if not condition:
        raise ValueError(message)


def directory(path):
    require(not path.is_symlink(), f"Directory must not be a symlink: {path}")
    path.mkdir(mode=0o755, exist_ok=True)
    require(path.is_dir(), f"Not a directory: {path}")
    return path


def checksum(path):
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_site(path):
    for file in REQUIRED_FILES:
        require((path / file).is_file(), f"Required page is missing: {file}")
    require((path / "assets").is_dir(), "Assets directory is missing")
    require(
        any(file.is_file() for file in (path / "assets").rglob("*")),
        "Assets directory is empty",
    )


def unpack(archive, destination):
    with tarfile.open(archive, "r:gz") as package:
        members = package.getmembers()
        require(len(members) <= 10000, "Archive has too many files")
        require(
            sum(member.size for member in members) <= 256 * 1024 * 1024,
            "Archive is too large",
        )
        for member in members:
            path = PurePosixPath(member.name)
            require(
                not path.is_absolute() and ".." not in path.parts, "Unsafe archive path"
            )
            require(
                member.isfile() or member.isdir(),
                "Archive links and special files are forbidden",
            )
        for member in members:
            target = destination.joinpath(*PurePosixPath(member.name).parts)
            if member.isdir():
                target.mkdir(mode=0o755, parents=True, exist_ok=True)
            else:
                target.parent.mkdir(mode=0o755, parents=True, exist_ok=True)
                with package.extractfile(member) as source, target.open("xb") as output:
                    shutil.copyfileobj(source, output)
                target.chmod(0o644)


def preserve_assets(release, shared):
    for source in (release / "assets").rglob("*"):
        if not source.is_file():
            continue
        relative = source.relative_to(release / "assets")
        parent = shared
        for part in relative.parent.parts:
            parent = directory(parent / part)
        target = parent / relative.name
        require(not target.is_symlink(), "Shared asset must not be a symlink")
        if target.exists():
            require(
                target.is_file() and checksum(target) == checksum(source),
                f"Asset collision: {relative}",
            )
        else:
            temporary = target.with_name(f".{target.name}.{uuid.uuid4().hex}")
            try:
                shutil.copyfile(source, temporary)
                temporary.chmod(0o644)
                os.replace(temporary, target)
            finally:
                temporary.unlink(missing_ok=True)


def linked_release(base, name):
    link = base / name
    if not link.is_symlink():
        require(not link.exists(), f"{name} must be a release symlink")
        return None
    target = link.resolve(strict=True)
    require(target.parent == base / "releases", f"{name} points outside releases")
    require(RELEASE_PATTERN.fullmatch(target.name), f"Invalid {name} release")
    return target


def switch(base, name, release):
    link = base / name
    if release is None:
        link.unlink(missing_ok=True)
        return
    temporary = base / f".{name}.{uuid.uuid4().hex}"
    try:
        temporary.symlink_to(release.relative_to(base), target_is_directory=True)
        os.replace(temporary, link)
    finally:
        temporary.unlink(missing_ok=True)


def check_health(url, release, attempts):
    last_error = None
    for attempt in range(attempts):
        try:
            for path in (
                "/release.txt",
                "/",
                "/zh/",
                "/guide/user/",
                "/zh/guide/user/",
            ):
                query = urlencode({"release": release.name})
                request = Request(
                    f"{url.rstrip('/')}{path}?{query}",
                    headers={"Cache-Control": "no-cache"},
                )
                with urlopen(request, timeout=5) as response:
                    require(response.status == 200, f"Health check failed: {path}")
                    if path == "/release.txt":
                        require(
                            response.read(256).decode().strip() == release.name,
                            "Health check served another release",
                        )
            return
        except (OSError, ValueError) as error:
            last_error = error
            if attempt + 1 < attempts:
                time.sleep(2)
    raise ValueError(f"Health check failed; restored the previous site: {last_error}")


def activate(base, release, url, attempts):
    current = linked_release(base, "current")
    linked_release(base, "previous")
    validate_site(release)
    switch(base, "current", release)
    try:
        check_health(url, release, attempts)
        if current and current != release:
            switch(base, "previous", current)
    except BaseException:
        switch(base, "current", current)
        raise


def publish(args, base, incoming, releases, shared):
    archive = Path(args.archive)
    require(not archive.is_symlink(), "Archive must not be a symlink")
    require(
        archive.resolve(strict=True).parent == incoming,
        "Archive must be inside .incoming",
    )
    require(
        archive.name == f"{args.release}.tar.gz",
        "Archive filename must match the release",
    )
    require(checksum(archive) == args.sha256, "Archive checksum mismatch")
    release = releases / args.release
    require(
        not release.exists() and not release.is_symlink(),
        "Release already exists; use a new run attempt",
    )
    staging = Path(tempfile.mkdtemp(prefix=f"{args.release}.", dir=incoming))
    try:
        staging.chmod(0o755)
        unpack(archive, staging)
        validate_site(staging)
        marker = staging / "release.txt"
        marker.write_text(f"{args.release}\n")
        marker.chmod(0o644)
        preserve_assets(staging, shared)
        os.rename(staging, release)
    finally:
        if staging.exists():
            shutil.rmtree(staging)
    activate(base, release, args.health_url, args.health_attempts)
    return release


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("publish", "rollback"))
    parser.add_argument("--base", required=True)
    parser.add_argument("--health-url", required=True)
    parser.add_argument("--health-attempts", type=int, default=3)
    parser.add_argument("--release")
    parser.add_argument("--archive")
    parser.add_argument("--sha256")
    args = parser.parse_args()
    require(1 <= args.health_attempts <= 5, "Health attempts must be between 1 and 5")
    url = urlsplit(args.health_url)
    require(
        url.scheme in ("http", "https")
        and url.netloc
        and url.path in ("", "/")
        and not url.query
        and not url.fragment
        and not url.username,
        "Health URL must be a site origin",
    )
    if args.action == "publish":
        require(
            args.release and RELEASE_PATTERN.fullmatch(args.release),
            "Invalid release ID",
        )
        require(args.archive, "Archive is required")
        require(
            args.sha256 and re.fullmatch(r"[0-9a-f]{64}", args.sha256),
            "SHA-256 is required",
        )
    elif args.release:
        require(RELEASE_PATTERN.fullmatch(args.release), "Invalid rollback release ID")
    return args


def interrupted(signum, _frame):
    raise RuntimeError(f"Deployment interrupted by signal {signum}")


def main():
    os.umask(0o022)
    args = arguments()
    requested_base = Path(args.base)
    require(
        requested_base.is_absolute() and not requested_base.is_symlink(),
        "Base must be an absolute directory",
    )
    base = requested_base.resolve(strict=True)
    require(len(base.parts) >= 4, "Base must be a dedicated site directory")
    require(
        base.is_dir() and os.access(base, os.W_OK),
        "Base must exist and be writable by the deployment user",
    )
    lock_path = base / ".deploy.lock"
    require(not lock_path.is_symlink(), "Deployment lock must not be a symlink")
    with lock_path.open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        incoming = directory(base / ".incoming")
        releases = directory(base / "releases")
        shared = directory(base / "shared-assets")
        linked_release(base, "current")
        linked_release(base, "previous")
        if args.action == "publish":
            release = publish(args, base, incoming, releases, shared)
        else:
            release = (
                releases / args.release
                if args.release
                else linked_release(base, "previous")
            )
            require(
                release and release.is_dir() and not release.is_symlink(),
                "No retained release to roll back to",
            )
            preserve_assets(release, shared)
            activate(base, release, args.health_url, args.health_attempts)
        print(
            f"{args.action.capitalize()} succeeded: {release.name} at {args.health_url}"
        )


if __name__ == "__main__":
    for deployment_signal in (signal.SIGTERM, signal.SIGINT, signal.SIGHUP):
        signal.signal(deployment_signal, interrupted)
    try:
        main()
    except (OSError, ValueError, RuntimeError, tarfile.TarError) as error:
        print(f"Deployment failed: {error}", file=sys.stderr)
        sys.exit(1)
