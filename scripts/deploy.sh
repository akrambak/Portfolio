#!/usr/bin/env bash
#
# Build and restart the production site (bak-dev.com).
#
# Two rules this script exists to enforce:
#
#   1. Never build as root. `npm ci` / `next build` as root leaves root-owned
#      files in .next/ and node_modules/. The server runs as bak-dev, so it can
#      read them but not write .next/cache -- which silently breaks the ISR and
#      image-optimisation caches. This script re-execs as bak-dev.
#
#   2. Never hand-run `next start` in production. PM2 owns :3100. A manual start
#      just collides with the process that is already serving the site.
#
set -euo pipefail

APP_USER=bak-dev
APP_DIR=/home/bak-dev/Portfolio
APP_NAME=portfolio
APP_PORT=3100
export PM2_HOME="/home/$APP_USER/.pm2"

# Re-exec as the runtime user if invoked as root.
if [ "$(id -un)" != "$APP_USER" ]; then
  echo "==> Re-executing as $APP_USER (never build as root)"
  exec sudo -u "$APP_USER" PM2_HOME="$PM2_HOME" bash "$0" "$@"
fi

cd "$APP_DIR"

# Reinstall only when the lockfile moved ahead of the installed tree.
if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  echo "==> Lockfile changed - npm ci"
  npm ci
fi

echo "==> Building as $(id -un)"
npm run build

echo "==> Restarting $APP_NAME"
pm2 restart "$APP_NAME" --update-env

echo "==> Health check on :$APP_PORT"
code=$(curl -s -o /dev/null -w '%{http_code}' \
  --retry 30 --retry-delay 1 --retry-connrefused --max-time 90 \
  "http://127.0.0.1:$APP_PORT/" || true)

if [ "$code" != "200" ]; then
  echo "!! Health check failed (HTTP ${code:-000}). Recent errors:" >&2
  pm2 logs "$APP_NAME" --lines 30 --nostream --err >&2 || true
  exit 1
fi

echo "==> OK - $APP_NAME healthy on :$APP_PORT (HTTP $code)"
