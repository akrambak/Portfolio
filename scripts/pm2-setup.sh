#!/usr/bin/env bash
#
# Register (or refresh) the PM2 app from ecosystem.config.js and persist it
# so the pm2-bak-dev systemd unit restores it on boot.
#
# Re-execs as bak-dev: running PM2 commands as root against bak-dev's daemon
# leaves root-owned files in /home/bak-dev/.pm2.
#
set -euo pipefail

APP_USER=bak-dev
APP_DIR=/home/bak-dev/Portfolio
APP_NAME=portfolio
APP_PORT=3100
export PM2_HOME="/home/$APP_USER/.pm2"

if [ "$(id -un)" != "$APP_USER" ]; then
  echo "==> Re-executing as $APP_USER"
  exec sudo -u "$APP_USER" PM2_HOME="$PM2_HOME" bash "$0" "$@"
fi

cd "$APP_DIR"

echo "==> Registering $APP_NAME from ecosystem.config.js"
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
pm2 start ecosystem.config.js

echo "==> Saving process list for boot"
pm2 save

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
