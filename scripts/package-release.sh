#!/usr/bin/env bash
#
# Assemble a deployable release tree from a completed `next build`.
#
# Run AFTER `npm run build`. Produces:
#   dist/            the exact tree that runs on the VPS
#   release.tar.gz   that tree, packed
#
# Used by both .github/workflows/deploy.yml and scripts/deploy-local.sh so the
# CI and local paths cannot drift apart.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DIST="${DIST_DIR:-dist}"
TARBALL="${TARBALL:-release.tar.gz}"

log() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
die() { printf '\033[1;31mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

[ -d .next ] || die "No .next/ — run 'npm run build' first."

# `output: "standalone"` in next.config.ts produces this. If it is missing, the
# build ran without it and the resulting bundle would need a full node_modules.
STANDALONE=".next/standalone"
[ -f "$STANDALONE/server.js" ] || die \
  "$STANDALONE/server.js not found. Is output: \"standalone\" set in next.config.ts?"

log "Cleaning $DIST"
rm -rf "$DIST" "$TARBALL"
mkdir -p "$DIST"

log "Copying standalone server + traced node_modules"
cp -R "$STANDALONE"/. "$DIST"/

# --- The three things Next does NOT put in standalone -------------------------
# .next/static and public/ are documented omissions: the standalone server
# expects them to be placed alongside it.
log "Copying .next/static"
mkdir -p "$DIST/.next"
cp -R .next/static "$DIST/.next/static"

if [ -d public ]; then
  log "Copying public/"
  cp -R public "$DIST/public"
fi

# content/ must be present at RUNTIME: src/lib/mdxUtils.ts reads
# path.join(process.cwd(), 'content/blog') on every request to /blog, which is
# dynamic because src/i18n/request.ts calls cookies().
#
# Next's tracer does currently pull content/ into standalone on its own, but only
# as a side effect of /blog/[slug] being prerendered. That is incidental and would
# stop holding if the blog routes changed. Copy it explicitly and assert on it
# below, so the guarantee does not depend on tracer behaviour. A bundle missing
# this still serves /blog as a 200 with an empty list - a silent failure.
log "Copying content/ (read from disk at request time)"
cp -R content "$DIST/content"

# --- Deploy machinery that travels with the release ---------------------------
mkdir -p "$DIST/scripts"
cp scripts/remote-activate.sh "$DIST/scripts/remote-activate.sh"
chmod +x "$DIST/scripts/remote-activate.sh"
cp ecosystem.config.js "$DIST/ecosystem.config.js"
cp .nvmrc "$DIST/.nvmrc"

# --- Traceability -------------------------------------------------------------
cat > "$DIST/RELEASE" <<META
sha=${GITHUB_SHA:-$(git rev-parse HEAD 2>/dev/null || echo unknown)}
ref=${GITHUB_REF_NAME:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)}
built_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)
built_by=${GITHUB_ACTOR:-$(whoami)}
node=$(node --version)
META

# --- Guard rails: fail here, not in production --------------------------------
log "Verifying bundle contents"
[ -f "$DIST/server.js" ]            || die "dist/server.js missing"
[ -d "$DIST/.next/static" ]         || die "dist/.next/static missing"
[ -d "$DIST/content/blog" ]         || die "dist/content/blog missing"

mdx_count=$(find "$DIST/content/blog" -name '*.mdx' | wc -l | tr -d ' ')
src_count=$(find content/blog -name '*.mdx' | wc -l | tr -d ' ')
[ "$mdx_count" -eq "$src_count" ] || die \
  "content/blog copied $mdx_count of $src_count .mdx files"
[ "$mdx_count" -gt 0 ] || die "content/blog has no .mdx files"
log "content/blog: $mdx_count posts"

log "Packing $TARBALL"
tar -czf "$TARBALL" -C "$DIST" .

size=$(du -sh "$TARBALL" | cut -f1)
log "Done — $TARBALL ($size)"
