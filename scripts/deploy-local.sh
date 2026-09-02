#!/usr/bin/env bash
#
# Deploy straight from this machine to the VPS, bypassing GitHub Actions.
#
# The normal path is `git push origin main`, which runs .github/workflows/deploy.yml.
# This script exists for when CI is down, you need to ship an uncommitted fix, or
# you want to test a deploy change without pushing. It runs the SAME
# scripts/remote-activate.sh that CI runs, so the two cannot diverge.
#
# Config: copy .env.deploy.example to .env.deploy and fill it in (gitignored),
# or set the same variables in the environment.
#
#   bash scripts/deploy-local.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

log()  { printf '==> %s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
die()  { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

if [ -f .env.deploy ]; then
  log "Loading .env.deploy"
  set -a
  # shellcheck disable=SC1091
  . ./.env.deploy
  set +a
fi

VPS_HOST="${VPS_HOST:?VPS_HOST is required (set it in .env.deploy)}"
VPS_USER="${VPS_USER:?VPS_USER is required (set it in .env.deploy)}"
VPS_PORT="${VPS_PORT:-22}"
APP_DIR="${APP_DIR:?APP_DIR is required (set it in .env.deploy)}"
APP_NAME="${APP_NAME:-portfolio}"
PORT="${PORT:-3100}"
SSH_KEY="${SSH_KEY:-}"

# NEXT_PUBLIC_* is inlined by `next build`, so it must be right HERE, at build
# time. Setting it on the VPS does nothing.
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://bak-dev.com}"

SSH_OPTS=(-p "$VPS_PORT" -o BatchMode=yes -o ConnectTimeout=15)
SCP_OPTS=(-P "$VPS_PORT" -o BatchMode=yes -o ConnectTimeout=15)
if [ -n "$SSH_KEY" ]; then
  SSH_OPTS+=(-i "$SSH_KEY" -o IdentitiesOnly=yes)
  SCP_OPTS+=(-i "$SSH_KEY" -o IdentitiesOnly=yes)
fi

REMOTE="$VPS_USER@$VPS_HOST"

# A local deploy ships your working tree, not a commit, so make it obvious what
# is going out and tag the release so it is distinguishable in releases/.
SHA="$(git rev-parse --short HEAD 2>/dev/null || echo nogit)"
STAMP="$(date -u +%Y%m%d%H%M%S)"
RELEASE_ID="local-$STAMP-$SHA"

if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  warn "Working tree is dirty - deploying uncommitted changes as $RELEASE_ID"
fi

# CI builds on the .nvmrc version; your machine might be on something else.
# The output is plain JS so a mismatch is usually harmless, but remote-activate.sh
# gates the VPS against .nvmrc, not against whatever built this - so say so.
WANT_MAJOR="$(tr -dc '0-9.' < .nvmrc | cut -d. -f1)"
HAVE_MAJOR="$(node --version | tr -d v | cut -d. -f1)"
if [ "$WANT_MAJOR" != "$HAVE_MAJOR" ]; then
  warn "Building with local Node v$HAVE_MAJOR, but .nvmrc pins v$WANT_MAJOR (what CI and the VPS use)."
fi

log "Target:  $REMOTE:$APP_DIR"
log "Release: $RELEASE_ID"
log "Site URL baked into the build: $NEXT_PUBLIC_SITE_URL"

# ---------------------------------------------------------------------------
log "Building"
npm run build

log "Packaging"
GITHUB_SHA="$RELEASE_ID" bash scripts/package-release.sh

# ---------------------------------------------------------------------------
log "Uploading release.tar.gz"
ssh "${SSH_OPTS[@]}" "$REMOTE" "mkdir -p '$APP_DIR/tmp'"
scp "${SCP_OPTS[@]}" release.tar.gz "$REMOTE:$APP_DIR/tmp/$RELEASE_ID.tar.gz"

# remote-activate.sh lives inside the tarball, so pull it out before running it.
log "Activating"
ssh "${SSH_OPTS[@]}" "$REMOTE" "
  set -euo pipefail
  cd '$APP_DIR/tmp'
  rm -rf activate && mkdir -p activate
  tar -xzf '$RELEASE_ID.tar.gz' -C activate ./scripts/remote-activate.sh
  APP_DIR='$APP_DIR' \
  RELEASE_ID='$RELEASE_ID' \
  TARBALL='$APP_DIR/tmp/$RELEASE_ID.tar.gz' \
  APP_NAME='$APP_NAME' \
  PORT='$PORT' \
  bash activate/scripts/remote-activate.sh
"

log "Deployed $RELEASE_ID to $VPS_HOST"
