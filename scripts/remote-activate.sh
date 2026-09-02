#!/usr/bin/env bash
#
# Runs ON THE VPS. Turns an uploaded release.tar.gz into the live app.
#
#   unpack -> releases/<id> -> flip `current` -> pm2 reload
#   -> health check -> rollback on failure -> prune old releases
#
# Ships inside the tarball so this logic is versioned and reviewable in the
# repo rather than buried in workflow YAML.
#
# Invoked as:
#   APP_DIR=... RELEASE_ID=... TARBALL=... bash remote-activate.sh
#
set -euo pipefail

APP_DIR="${APP_DIR:?APP_DIR is required}"
RELEASE_ID="${RELEASE_ID:?RELEASE_ID is required}"
TARBALL="${TARBALL:?TARBALL is required}"
APP_NAME="${APP_NAME:-portfolio}"
PORT="${PORT:-3100}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-45}"

RELEASES="$APP_DIR/releases"
SHARED="$APP_DIR/shared"
CURRENT="$APP_DIR/current"
TARGET="$RELEASES/$RELEASE_ID"

log()  { printf '==> %s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
die()  { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# A non-interactive `ssh host cmd` gets a non-login shell, so an nvm- or
# npm-prefix-installed node/pm2 is not on PATH. Recover it explicitly rather
# than failing with a bare "pm2: command not found".
# ---------------------------------------------------------------------------
bootstrap_path() {
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
  fi
  for d in "$HOME/.npm-global/bin" "$HOME/.local/bin" /usr/local/bin /usr/bin; do
    if [ -d "$d" ]; then
      case ":$PATH:" in
        *":$d:"*) ;;
        *) PATH="$PATH:$d" ;;
      esac
    fi
  done
  export PATH
}
bootstrap_path

command -v node >/dev/null || die "node not found on PATH ($PATH)"
command -v pm2  >/dev/null || die "pm2 not found on PATH - run scripts/vps-bootstrap.sh first"
command -v curl >/dev/null || die "curl not found - needed for the health check"

# ---------------------------------------------------------------------------
# 1. Node major must match what the bundle was built against.
# ---------------------------------------------------------------------------
[ -f "$TARBALL" ] || die "Tarball not found: $TARBALL"

WANT_MAJOR="$(tar -xzOf "$TARBALL" ./.nvmrc 2>/dev/null | tr -dc '0-9.' | cut -d. -f1)"
HAVE_MAJOR="$(node --version | tr -d v | cut -d. -f1)"
if [ -n "$WANT_MAJOR" ] && [ "$WANT_MAJOR" != "$HAVE_MAJOR" ]; then
  die "Node major mismatch: bundle built for v$WANT_MAJOR, VPS has v$HAVE_MAJOR. Align .nvmrc with the VPS or upgrade node."
fi
log "Node v$HAVE_MAJOR matches the bundle"

# ---------------------------------------------------------------------------
# 2. Unpack into a fresh release directory.
# ---------------------------------------------------------------------------
mkdir -p "$RELEASES" "$SHARED/logs"

if [ -e "$TARGET" ]; then
  log "Release $RELEASE_ID already unpacked - replacing it"
  rm -rf "$TARGET"
fi

log "Unpacking to $TARGET"
mkdir -p "$TARGET"
tar -xzf "$TARBALL" -C "$TARGET"
[ -f "$TARGET/server.js" ] || die "Unpacked release has no server.js"

# ---------------------------------------------------------------------------
# 3. Runtime env. The standalone server loads .env.production from its cwd, so
#    a symlink into shared/ keeps secrets out of every release tree.
#    NEXT_PUBLIC_* vars are already inlined at build time - setting them here
#    would have no effect.
# ---------------------------------------------------------------------------
if [ ! -f "$SHARED/.env.production" ]; then
  log "Creating empty $SHARED/.env.production"
  : > "$SHARED/.env.production"
  chmod 600 "$SHARED/.env.production"
fi
ln -sfn "$SHARED/.env.production" "$TARGET/.env.production"

# The PM2 config lives in shared/ so a rollback reuses it unchanged, and so the
# path pm2 save records survives release pruning.
cp "$TARGET/ecosystem.config.js" "$SHARED/ecosystem.config.js"
ECOSYSTEM="$SHARED/ecosystem.config.js"

# ---------------------------------------------------------------------------
# 4. Flip the symlink. Everything before this point was inert.
# ---------------------------------------------------------------------------
PREVIOUS=""
if [ -L "$CURRENT" ]; then
  PREVIOUS="$(readlink "$CURRENT")"
  log "Previous release: $(basename "$PREVIOUS")"
elif [ -e "$CURRENT" ]; then
  die "$CURRENT exists but is not a symlink - refusing to touch it"
fi

log "Pointing current -> releases/$RELEASE_ID"
ln -sfn "$TARGET" "$CURRENT"

# ---------------------------------------------------------------------------
# 5. Reload PM2.
# ---------------------------------------------------------------------------
# `pm2 reload <ecosystem>` restarts an existing app but does NOT adopt a changed
# cwd or script - PM2 keeps the pm_exec_path it was first started with. Reloading
# over a hand-rolled `next start` registration therefore silently kept running the
# old checkout. Delete and start instead, so the running process always matches
# the config on disk. In fork mode a reload is a restart anyway, so this costs
# nothing extra.
reload_app() {
  if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    log "Replacing existing pm2 app $APP_NAME"
    pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
  fi
  APP_NAME="$APP_NAME" PORT="$PORT" pm2 start "$ECOSYSTEM"
}

log "Reloading pm2 app $APP_NAME"
reload_app

# ---------------------------------------------------------------------------
# 6. Health check. Hit /blog as well as / - /blog is the route that breaks when
#    content/ is missing from the bundle, and it fails as an empty list rather
#    than a non-200, so the body is checked too.
# ---------------------------------------------------------------------------
# Prove the thing answering on $PORT is the release we just deployed, not some
# other process that happens to hold the port. Without this a stale app - or a
# second pm2 daemon under another user - serves a perfectly healthy old site and
# the deploy reports success while changing nothing.
build_id_matches() {
  local want served
  want="$(cat "$CURRENT/.next/BUILD_ID" 2>/dev/null || true)"
  [ -n "$want" ] || { warn "release has no .next/BUILD_ID"; return 1; }

  # Every build serves its own manifest under its own build id.
  served="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 \
    "http://127.0.0.1:$PORT/_next/static/$want/_buildManifest.js" || true)"
  if [ "$served" = "200" ]; then
    return 0
  fi
  warn "Port $PORT is serving a DIFFERENT build (manifest for $want returned ${served:-none})."
  warn "Something other than this release is bound to $PORT - check for a second pm2 daemon (pm2-root.service) or an orphaned process."
  return 1
}

health_check() {
  local base="http://127.0.0.1:$PORT"
  local deadline=$(( SECONDS + HEALTH_TIMEOUT ))
  local code

  while [ "$SECONDS" -lt "$deadline" ]; do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$base/" || true)"
    if [ "$code" = "200" ]; then
      build_id_matches || return 1
      if ! curl -fsS --max-time 10 "$base/blog" > /tmp/.healthcheck-blog 2>/dev/null; then
        warn "/ is up but /blog failed"
        return 1
      fi
      # A bundle missing content/blog still returns 200, with an empty index.
      if ! grep -q 'href="/blog/' /tmp/.healthcheck-blog; then
        warn "/blog returned 200 but links no posts - content/ likely missing from the bundle"
        return 1
      fi
      rm -f /tmp/.healthcheck-blog
      return 0
    fi
    sleep 2
  done

  warn "Timed out after ${HEALTH_TIMEOUT}s (last status: ${code:-none})"
  return 1
}

log "Health check on 127.0.0.1:$PORT"
if health_check; then
  log "Healthy"
else
  printf '\n--- pm2 logs (last 40 lines) ---\n' >&2
  pm2 logs "$APP_NAME" --lines 40 --nostream >&2 || true

  if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ]; then
    warn "Rolling back to $(basename "$PREVIOUS")"
    ln -sfn "$PREVIOUS" "$CURRENT"
    reload_app
    if health_check; then
      die "Deploy failed health check - rolled back to $(basename "$PREVIOUS"), site is up."
    fi
    die "Deploy failed health check AND rollback did not recover. Site is DOWN."
  fi
  die "Deploy failed health check and there is no previous release to roll back to."
fi

pm2 save --force >/dev/null
log "pm2 state saved"

# ---------------------------------------------------------------------------
# 7. Prune. Never remove whatever current points at.
# ---------------------------------------------------------------------------
live="$(basename "$(readlink -f "$CURRENT")")"
while IFS= read -r r; do
  [ -n "$r" ] || continue
  [ "$r" = "$live" ] && continue
  log "Pruning old release $r"
  rm -rf "${RELEASES:?}/$r"
done < <(ls -1t "$RELEASES" 2>/dev/null | tail -n +$((KEEP_RELEASES + 1)) || true)

rm -f "$TARBALL"
log "Deployed $RELEASE_ID"
