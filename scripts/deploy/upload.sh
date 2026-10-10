#!/usr/bin/env bash
set -euo pipefail

fail() { printf '%s\n' "$1" >&2; exit 1; }

: "${GITHUB_WORKSPACE:?GITHUB_WORKSPACE is required}"
: "${DOCS_SSH_HOST:?Set DOCS_SSH_HOST in the production environment}"
: "${DOCS_SSH_USER:?Set DOCS_SSH_USER in the production environment}"
: "${DOCS_SSH_KEY:?Set DOCS_SSH_KEY in production secrets}"
: "${DOCS_SSH_KNOWN_HOSTS:?Set DOCS_SSH_KNOWN_HOSTS in production secrets}"
: "${DOCS_DEPLOY_PATH:?Set DOCS_DEPLOY_PATH in the production environment}"
: "${DOCS_SITE_ORIGIN:?Set DOCS_SITE_ORIGIN in the production environment}"
: "${RELEASE_ID:?RELEASE_ID is required}"
DOCS_SSH_PORT="${DOCS_SSH_PORT:-22}"

[[ "$DOCS_SSH_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]] || fail 'SSH host must be a hostname or IPv4 address'
[[ "$DOCS_SSH_USER" =~ ^[a-z_][a-z0-9_-]*$ ]] || fail 'Invalid SSH user'
[[ "$DOCS_SSH_PORT" =~ ^[0-9]{1,5}$ ]] && ((10#$DOCS_SSH_PORT >= 1 && 10#$DOCS_SSH_PORT <= 65535)) || fail 'Invalid SSH port'
[[ "$DOCS_DEPLOY_PATH" =~ ^/var/www/[a-zA-Z0-9_-][a-zA-Z0-9_./-]*$ ]] || fail 'Deploy path must be a directory below /var/www/'
[[ "$DOCS_DEPLOY_PATH" != */ && "$DOCS_DEPLOY_PATH" != *//* && "$DOCS_DEPLOY_PATH" != */../* && "$DOCS_DEPLOY_PATH" != */./* && "$DOCS_DEPLOY_PATH" != */.. && "$DOCS_DEPLOY_PATH" != */. ]] || fail 'Invalid deploy path'
[[ "$RELEASE_ID" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]] || fail 'Invalid release ID'
[[ "$DOCS_SITE_ORIGIN" =~ ^https://[a-zA-Z0-9][a-zA-Z0-9.-]*(:[0-9]{1,5})?/?$ ]] || fail 'Invalid site origin: use an HTTPS hostname without a path or credentials'

archive="$GITHUB_WORKSPACE/.local/artifacts/website.tar.gz"
publisher="$GITHUB_WORKSPACE/scripts/deploy/publish.py"
[[ -f "$archive" && -f "$publisher" ]] || fail 'Website artifact or publisher is missing'
digest="$(sha256sum "$archive")"
digest="${digest%% *}"
target="$DOCS_SSH_USER@$DOCS_SSH_HOST"
incoming="$DOCS_DEPLOY_PATH/.incoming/$RELEASE_ID"

umask 077
mkdir -p "$GITHUB_WORKSPACE/.local/private"
ssh_directory="$(mktemp -d "$GITHUB_WORKSPACE/.local/private/docs-ssh.XXXXXX")"
printf '%s\n' "$DOCS_SSH_KEY" | tr -d '\r' > "$ssh_directory/key"
printf '%s\n' "$DOCS_SSH_KNOWN_HOSTS" | tr -d '\r' > "$ssh_directory/known_hosts"
unset DOCS_SSH_KEY DOCS_SSH_KNOWN_HOSTS
ssh_options=(-i "$ssh_directory/key" -o "UserKnownHostsFile=$ssh_directory/known_hosts" -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=10 -o ServerAliveInterval=15 -o ServerAliveCountMax=2)

cleanup() {
  status=$?
  trap - EXIT
  ssh "${ssh_options[@]}" -p "$DOCS_SSH_PORT" "$target" "rm -f -- '$incoming.tar.gz' '$incoming.py'" >/dev/null 2>&1 || true
  rm -f -- "$ssh_directory/key" "$ssh_directory/known_hosts"
  rmdir -- "$ssh_directory"
  exit "$status"
}
trap cleanup EXIT

ssh "${ssh_options[@]}" -p "$DOCS_SSH_PORT" "$target" "test -d '$DOCS_DEPLOY_PATH' && test ! -L '$DOCS_DEPLOY_PATH' && test ! -L '$DOCS_DEPLOY_PATH/.incoming' && mkdir -p -- '$DOCS_DEPLOY_PATH/.incoming'"
scp "${ssh_options[@]}" -P "$DOCS_SSH_PORT" "$archive" "$target:$incoming.tar.gz"
scp "${ssh_options[@]}" -P "$DOCS_SSH_PORT" "$publisher" "$target:$incoming.py"
ssh "${ssh_options[@]}" -p "$DOCS_SSH_PORT" "$target" "python3 '$incoming.py' publish --base '$DOCS_DEPLOY_PATH' --release '$RELEASE_ID' --archive '$incoming.tar.gz' --sha256 '$digest' --health-url '$DOCS_SITE_ORIGIN' && install -m 0644 '$incoming.py' '$DOCS_DEPLOY_PATH/publish.py'"
