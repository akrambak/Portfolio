#!/usr/bin/env bash
#
# One-time VPS preparation. Idempotent - safe to re-run.
#
# Run as the Virtualmin DOMAIN USER (not root), from anywhere:
#   APP_DIR=/home/<domain-user>/apps/portfolio bash vps-bootstrap.sh
#
# Creates the release layout, installs pm2 if missing, and prints the two
# commands that still need root plus the Virtualmin steps.
#
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/apps/portfolio}"
APP_NAME="${APP_NAME:-portfolio}"
PORT="${PORT:-3100}"

log()  { printf '==> %s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
die()  { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

if [ "$(id -u)" = "0" ]; then
  die "Do not run this as root. Run it as the Virtualmin domain user that will own the app."
fi

# ---------------------------------------------------------------------------
# Node
# ---------------------------------------------------------------------------
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
fi

command -v node >/dev/null || die "node not found on PATH for this user."
NODE_MAJOR="$(node --version | tr -d v | cut -d. -f1)"
WANT_MAJOR="${WANT_NODE_MAJOR:-24}"
log "node $(node --version) at $(command -v node)"
if [ "$NODE_MAJOR" != "$WANT_MAJOR" ]; then
  warn "Node v$NODE_MAJOR does not match the .nvmrc target (v$WANT_MAJOR)."
  warn "remote-activate.sh will refuse to deploy until these agree."
  warn "Either change node here, or set .nvmrc to $NODE_MAJOR so CI builds to match."
fi

# On this box node is root's nvm build, exposed at /usr/local/bin/node, which is
# what ecosystem.config.js pins as the interpreter. If that symlink is gone the
# PM2 app will not start even though `node` works in your shell.
if [ ! -x /usr/local/bin/node ]; then
  warn "/usr/local/bin/node is missing or not executable."
  warn "ecosystem.config.js pins it as the interpreter - fix it before deploying."
fi

# ---------------------------------------------------------------------------
# Directory layout. Deliberately OUTSIDE public_html so Apache never serves
# the application source.
# ---------------------------------------------------------------------------
case "$APP_DIR" in
  *public_html*)
    die "APP_DIR is inside public_html. Apache would serve the source. Pick e.g. \$HOME/apps/portfolio."
    ;;
esac

log "Creating layout under $APP_DIR"
mkdir -p "$APP_DIR/releases" "$APP_DIR/shared/logs" "$APP_DIR/tmp"

if [ ! -f "$APP_DIR/shared/.env.production" ]; then
  : > "$APP_DIR/shared/.env.production"
  log "Created shared/.env.production (empty)"
fi
chmod 600 "$APP_DIR/shared/.env.production"
chmod 700 "$APP_DIR"

# ---------------------------------------------------------------------------
# PM2
# ---------------------------------------------------------------------------
if command -v pm2 >/dev/null; then
  log "pm2 $(pm2 --version) already installed at $(command -v pm2)"
else
  log "Installing pm2 globally for this user"
  npm install -g pm2
  command -v pm2 >/dev/null || die "pm2 still not on PATH after install. Check your npm prefix."
fi

# ---------------------------------------------------------------------------
# What is actually left. Checked rather than assumed - printing a generic
# checklist invites re-running root steps that are already done, and the Apache
# one is worse than useless on a box whose proxy already works.
# ---------------------------------------------------------------------------
SITE_URL="${SITE_URL:-https://bak-dev.com}"
todo=0

echo
echo "--------------------------------------------------------------------"
echo "Layout ready at $APP_DIR"
echo

# 1. PM2 boot persistence
if systemctl is-enabled "pm2-$(id -un).service" >/dev/null 2>&1; then
  log "pm2 boot unit (pm2-$(id -un).service) is enabled - nothing to do"
else
  todo=$((todo + 1))
  cat <<'PM2TODO'

  [ ] Make pm2 survive a reboot. Run:

        pm2 startup systemd

      then run exactly the 'sudo env PATH=... ' command it prints, and after
      the first deploy:

        pm2 save
PM2TODO
fi

# 2. Reverse proxy. A 200 over HTTPS means Apache already proxies to the app.
code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$SITE_URL/" 2>/dev/null || echo 000)"
if [ "$code" = "200" ]; then
  log "$SITE_URL answers 200 - reverse proxy already configured, leave it alone"

  # Proxying /.well-known would break Let's Encrypt renewal silently, ~60 days
  # later. Apache's own error page is iso-8859-1; Next's is utf-8.
  ct="$(curl -s -o /dev/null -w '%{content_type}' --max-time 15         "$SITE_URL/.well-known/acme-challenge/bootstrap-probe" 2>/dev/null || true)"
  case "$ct" in
    *iso-8859-1*) log "/.well-known is served from disk - cert renewal is safe" ;;
    *utf-8*)      todo=$((todo + 1))
                  warn "/.well-known is being proxied to Node. Let's Encrypt renewal WILL fail."
                  warn "In Virtualmin -> Server Configuration -> Proxy Paths, add /.well-known"
                  warn "as unproxied ABOVE the catch-all / rule." ;;
    *)            warn "Could not classify /.well-known (content-type: ${ct:-none}) - check by hand." ;;
  esac
else
  todo=$((todo + 1))
  cat <<PROXYTODO

  [ ] $SITE_URL returned ${code:-000}, so the reverse proxy is not serving
      the app yet. In Virtualmin -> Server Configuration -> Proxy Paths,
      ORDER MATTERS:

        /.well-known   ->  (leave unproxied - served from disk)
        /              ->  http://127.0.0.1:$PORT/

      The /.well-known entry must come FIRST, or ACME challenges go to Node
      and cert renewal fails silently about 60 days later.

      Then Web Configuration -> Edit Directives, in BOTH vhosts:
        ProxyPreserveHost On
        ProxyTimeout 60
      and in the :443 vhost only:
        RequestHeader set X-Forwarded-Proto "https"

      Configure this through Virtualmin, not by editing the vhost file -
      Virtualmin rewrites it on domain changes and drops manual edits.
PROXYTODO
fi

# 3. Deploy key
if [ -f "$HOME/.ssh/authorized_keys" ] && [ -s "$HOME/.ssh/authorized_keys" ]; then
  log "$(grep -c . "$HOME/.ssh/authorized_keys") key(s) in authorized_keys"
else
  todo=$((todo + 1))
  echo
  echo "  [ ] No authorized_keys yet - append the deploy public key:"
  echo "        mkdir -p ~/.ssh && chmod 700 ~/.ssh"
  echo "        cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
fi

echo
if [ "$todo" -eq 0 ]; then
  log "Nothing left to do on this box - set the GitHub variables and deploy."
else
  warn "$todo item(s) above still need attention."
fi
echo "--------------------------------------------------------------------"
