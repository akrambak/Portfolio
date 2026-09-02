# Deployment

Push to `main` → GitHub Actions builds → an atomic release is shipped over SSH → PM2 reloads → a health check gates it, rolling back automatically if it fails.

The VPS runs Apache under Virtualmin, which reverse-proxies to a Node process on loopback port 3100.

```
push to main
  └─ .github/workflows/deploy.yml   (ubuntu-latest, Node pinned by .nvmrc)
       npm ci → lint → build → scripts/package-release.sh → release.tar.gz
       scp over SSH (key from secrets, known_hosts pinned)
  └─ VPS: scripts/remote-activate.sh
       unpack → releases/<sha> → flip `current` → pm2 reload
       health check → rollback on failure → prune to 5
  └─ Apache (Virtualmin vhost, TLS) → 127.0.0.1:3100
```

Nothing is destructive until the symlink flips, and rollback is a symlink swap.

## Why a Node server and not a static export

`src/i18n/request.ts` calls `cookies()`, so most routes render per request — `next build` marks `/`, `/work`, `/about`, `/contact` and `/blog` as `ƒ (Dynamic)`. There is no static export to drop into `public_html`; the app needs a long-lived process.

## Files

| Path | Role |
| --- | --- |
| `.nvmrc` | Node major. CI reads it; `remote-activate.sh` refuses to deploy if the VPS disagrees. |
| `ecosystem.config.js` | PM2 process definition. Self-locating — no hardcoded username. |
| `scripts/package-release.sh` | Build output → `dist/` → `release.tar.gz`. Shared by CI and local deploys. |
| `scripts/remote-activate.sh` | Runs on the VPS. Unpack, flip, reload, health check, rollback, prune. |
| `scripts/deploy-local.sh` | Deploy from your machine, bypassing CI. Runs the same activate script. |
| `scripts/vps-bootstrap.sh` | One-time VPS prep. Idempotent. |
| `.github/workflows/ci.yml` | PRs: lint + build + package. |
| `.github/workflows/deploy.yml` | `main`: the full pipeline. |

## VPS layout

Deliberately outside `public_html`, so Apache never serves application source:

```
/home/<domain-user>/apps/portfolio/
├── releases/<sha>/       immutable release trees (newest 3 kept)
├── current -> releases/<sha>
├── shared/
│   ├── .env.production   runtime secrets, mode 600, symlinked into each release
│   ├── ecosystem.config.js
│   └── logs/
└── tmp/                  upload staging
```

PM2's `cwd` is the `current` **symlink**, not a release realpath. That matters twice: `/blog` resolves `content/blog` through `process.cwd()` at request time, and the path `pm2 save` persists stays valid across deploys and pruning, so a reboot restores the app correctly.

`HOSTNAME=127.0.0.1` in `ecosystem.config.js` is a security requirement, not a preference. Next's standalone server binds `0.0.0.0` by default, which would expose port 3100 to the internet un-proxied and un-TLS'd, bypassing Apache entirely.

## Current server state (verified 2026-09-02)

The site was already live before this pipeline existed, deployed by hand. Most of the
setup below is therefore **already done**:

| | State |
| --- | --- |
| Host | `bak-dev.com` → `164.132.224.213`, Debian 12, OpenSSH 9.2p1 |
| User | `bak-dev`, home `/home/bak-dev` |
| Node | **v24.12.0**, npm 11.7.0 — root's nvm build, exposed at `/usr/local/bin/node` |
| PM2 | 6.0.14, app `portfolio` on :3100, `pm2-bak-dev.service` enabled, `pm2-logrotate` configured |
| Apache | proxying `bak-dev.com` → `127.0.0.1:3100`, with `/.well-known` correctly excluded |
| Disk | 2048M Virtualmin **per-user quota** on `bak-dev` — invisible to `df`, which shows the host's 102GB free |

`.nvmrc` is set to **24** to match this box. `remote-activate.sh` compares them and refuses
to deploy on a mismatch, so if node here ever changes, change `.nvmrc` with it.

The Apache proxy exclusion was verified by content type rather than assumed:
`/definitely-not-a-route` returns Apache-proxied Next output (`charset=utf-8`), while
`/.well-known/acme-challenge/nope` returns Apache's own error page (`charset=iso-8859-1`) —
i.e. served from disk, so Let's Encrypt renewal is not routed into Node.

## Cutover (completed 2026-09-02)

The pipeline took over a site that had been deployed by hand, reusing the same PM2 name
(`portfolio`) and port (3100) so Apache needed no change. Four things went wrong on the way,
each now guarded against in code. They are recorded because they are the reasons the checks
exist, and removing a check because it "never fires" would reintroduce one of them.

1. **Secrets defined as repository *variables*.** `secrets.*` resolved to empty strings, and
   the SSH step wrote empty files and exited 0. Now validated explicitly.
2. **CRLF in the pasted key.** OpenSSH would not parse it. Now stripped with `tr -d '
'`.
3. **`pm2 reload` does not adopt a changed `cwd`/`script`.** It kept running the old checkout
   while reporting success. Now `pm2 delete` + `pm2 start`.
4. **The health check confused a port with an identity.** It probed :3100, got a healthy site,
   and never noticed it was the *old* build — including the `/blog` content assertion, since
   the old app served real posts. Now it requests the manifest under the new release's own
   `BUILD_ID`, which only that build can serve.

Two of these produced a **green deploy that changed nothing**, which is worse than a red one.

A second PM2 daemon (`pm2-root.service`) was also running the app as root and holding :3100.
It was deleted from root's PM2. **Root must run `pm2 save`**, or a reboot resurrects it and
the conflict returns.

The old 930MB checkout at `/home/bak-dev/Portfolio` has been deleted — it was consuming half
the account quota, and its two unique commits are on `origin/main`. There is therefore **no
git checkout on the VPS any more**, by design: CI builds, the server only receives bundles.

### Rollback

`current` is a symlink and the previous release is kept, so rollback is a symlink swap:

```bash
cd /home/bak-dev/apps/portfolio
ls -1t releases                       # pick the previous one
ln -sfn releases/<sha> current
pm2 delete portfolio && pm2 start shared/ecosystem.config.js && pm2 save
```

`pm2 delete` then `start` rather than `reload`, for the reason in item 3 above.

This path is not theoretical: deploy #4 failed activation, rolled back automatically, and the
site stayed up on the previous release with zero restarts.

## First-time setup

**1. Release layout.** `scripts/vps-bootstrap.sh` lives in this repo and is **not** shipped in
the release tarball — it has to run before any release exists. Copy it over, then run it as
`bak-dev` (never root), from the repo root on your machine:

```powershell
scp -i "$HOME\.ssh\portfolio_deploy" scripts/vps-bootstrap.sh bak-dev@bak-dev.com:/tmp/
```

```powershell
ssh -i "$HOME\.ssh\portfolio_deploy" bak-dev@bak-dev.com "APP_DIR=/home/bak-dev/apps/portfolio bash /tmp/vps-bootstrap.sh"
```

Use PowerShell, not Git Bash, for that second command. Git Bash rewrites POSIX-looking
arguments into Windows paths (MSYS path conversion), turning `/home/bak-dev/apps/portfolio`
into `Files/Git/home/bak-dev/apps/portfolio` before it ever reaches the server. Prefixing
with `MSYS_NO_PATHCONV=1` also works.

Do not pass the script as an absolute Windows path to `scp` either — `scp` treats `:` as the
host separator, so `C:\web\...` parses as a host named `C`. Change directory first.

The script is idempotent and safe to re-run. It creates `releases/`, `shared/logs/`,
`shared/.env.production` (mode 600) and `tmp/`, refuses to run as root or to use an `APP_DIR`
inside `public_html`, and checks node against `.nvmrc` plus the `/usr/local/bin/node` symlink
that `ecosystem.config.js` pins. It then reports only what is genuinely outstanding — it
probes the live site and the boot unit rather than printing a fixed checklist, because on this
box the proxy is already correct and "fixing" it would break a working site.

**2. Apache proxy.** Already configured and verified (see above). Nothing to do.

For reference, if it ever needs rebuilding, do it through **Virtualmin → Server Configuration
→ Proxy Paths**, not by editing `/etc/apache2/sites-available/bak-dev.com.conf` by hand —
Virtualmin rewrites that file on domain changes and drops manual edits. Order matters:

| Path | Target |
| --- | --- |
| `/.well-known` | *not proxied — served from disk* |
| `/` | `http://127.0.0.1:3100/` |

> The `/.well-known` entry must come first. Virtualmin renews Let's Encrypt certs by writing
> to `public_html/.well-known/acme-challenge/`. A catch-all `ProxyPass /` sends those to Node,
> which 404s — and the cert quietly fails to renew about 60 days later.

**3. Deploy key.** Already generated and installed: `~/.ssh/portfolio_deploy` locally,
fingerprint `SHA256:LpDNsfj7Lg0LRu8Sla+4tjZTQ0HgqJgQUuLVqGKYn0s`, authorised for `bak-dev`.
Verified with `Server accepts key` / `Authenticated to bak-dev.com using "publickey"`.

To reissue it later, generate on your own machine — never on the VPS — and note that in
PowerShell `~` is **not** expanded for native executables, so the path must be spelled out:

```powershell
ssh-keygen -t ed25519 -f "$HOME\.ssh\portfolio_deploy" -C "github-actions-deploy" -N ""
```

The private half goes in the GitHub secret; the public half in `~bak-dev/.ssh/authorized_keys`
(dir `700`, file `600`, home not group-writable, or sshd ignores it silently).

To revoke, delete that line from `authorized_keys` — it kills CI's access without touching
your personal keys.

**4. Host key for pinning.** Run this **on your own machine, not on the VPS.** The value is
the server's key *as your client recorded it*; the VPS has never connected to itself, so
running it there returns nothing at all — silently, with exit status 0.

`ssh-keyscan` does not work from this machine: OpenSSH_for_Windows 9.5p2 fails with
`choose_kex: unsupported KEX method sntrup761x25519-sha512@openssh.com`, confirmed against
both github.com and bak-dev.com, and Git Bash resolves to the same System32 binary. Take the
key from a real connection instead. Connect once interactively so the key is recorded — a
`BatchMode` connection will not write it:

```powershell
ssh bak-dev@bak-dev.com          # accept the fingerprint, then exit
ssh-keygen -F bak-dev.com -f "$HOME\.ssh\known_hosts"
```

Note `"$HOME\.ssh\..."` rather than `~/.ssh/...`: PowerShell does not expand `~` for native
executables, and on the VPS the backslashes are not separators, so the wrong form fails in
opposite ways on each machine.

**Verify the key is genuine before pinning it.** A pin copied from a compromised channel
gives the appearance of security with none of it. Compare what your client recorded against
what the server itself reports:

```powershell
ssh bak-dev@bak-dev.com "ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub"
```

Verified 2026-09-02: both sides give `SHA256:k+3dkZAJCG+Beog7Kc8qALjHyid+A6HEbbavAP5qwNA`,
with the server-side comment `root@vps-c1adef4c` matching the hostname.

Pin **all modern host key types**, not just the one your `known_hosts` happens to hold, so the
runner cannot fail on host-key algorithm preference. Over the now-verified channel:

```powershell
ssh bak-dev@bak-dev.com 'for f in /etc/ssh/ssh_host_*_key.pub; do read -r t k _ < "$f"; echo "bak-dev.com $t $k"; done'
```

Paste the `ecdsa-sha2-nistp256`, `ssh-ed25519` and `ssh-rsa` lines. **Skip `ssh-dss`** — that
legacy DSA key exists in `/etc/ssh` but OpenSSH 9.2 will never negotiate it, so pinning it is
dead weight.

**5. GitHub configuration** (Settings → Secrets and variables → Actions):

| Kind | Name | Value |
| --- | --- | --- |
| Variable | `VPS_HOST` | `bak-dev.com` |
| Variable | `VPS_USER` | `bak-dev` |
| Variable | `VPS_PORT` | `22` |
| Variable | `APP_DIR` | `/home/bak-dev/apps/portfolio` |
| Variable | `APP_NAME` | `portfolio` |
| Variable | `APP_PORT` | `3100` |
| Variable | `NEXT_PUBLIC_SITE_URL` | `https://bak-dev.com` |
| Secret | `VPS_SSH_KEY` | contents of `~/.ssh/portfolio_deploy` (private half) |
| Secret | `VPS_KNOWN_HOSTS` | the `ssh-keygen -F` output from step 4 |

The workflow uses stock OpenSSH with `known_hosts` pinned from that secret — not
`StrictHostKeyChecking=no`, and no third-party SSH actions. An unpinned host key would let
anything that wins a DNS or BGP race collect the deploy key.

## Environment variables

**`NEXT_PUBLIC_*` values are inlined into the JavaScript bundle by `next build`.** `NEXT_PUBLIC_SITE_URL` (read in `src/config/site.ts`) is therefore fixed at build time — putting it in `shared/.env.production` on the VPS has no effect whatsoever. Change it in the GitHub variable and rebuild.

Server-only secrets — an email provider key for `src/app/api/contact/route.ts`, say — go in `shared/.env.production` on the VPS. The standalone server loads that file from its cwd at startup, and it is symlinked into each release, so it survives deploys and rollbacks.

## Deploying

Normal path — merge to `main`. To re-run without a new commit:

```bash
gh workflow run deploy.yml
```

From your machine, bypassing CI (copy `.env.deploy.example` to `.env.deploy` first):

```bash
npm run deploy:local
```

That builds locally, packages, uploads, and calls the **same** `remote-activate.sh` CI uses, so the two paths cannot drift. Local releases are tagged `local-<timestamp>-<sha>` so they are distinguishable in `releases/`.

## Health check and rollback

After the reload, `remote-activate.sh` polls `http://127.0.0.1:3100` for up to 45s and requires:

1. `/` returns 200, **and**
2. `/blog` returns 200 **and its body contains post links**.

The second condition is not redundant. `/blog` is dynamic and reads `content/blog` from disk at request time; a bundle missing that directory still returns **200**, with an empty list. This was verified by deliberately removing `content/` from a packaged bundle — `/` and `/blog` both answered 200 while zero posts rendered. A status-code-only check would have shipped it.

On failure the script prints the last 40 lines of PM2 logs, flips `current` back to the previous release, reloads, re-checks, and exits non-zero. The workflow goes red and the site stays up.

Manual rollback:

```bash
cd /home/<domain-user>/apps/portfolio
ls -1t releases                       # pick one
ln -sfn releases/<previous-sha> current
pm2 reload shared/ecosystem.config.js --update-env && pm2 save
```

## Operations

```bash
pm2 status                                    # is it up
pm2 logs portfolio --lines 100                # recent output
pm2 describe portfolio                        # confirm cwd is .../current
cat /home/<domain-user>/apps/portfolio/current/RELEASE   # what is deployed
tail -f /home/<domain-user>/apps/portfolio/shared/logs/error.log
```

## Disk quota

The `bak-dev` account has a **2048M Virtualmin quota**, and `df` cannot see it — the host
shows 102GB free while the account has none. When it fills, `tar` fails with
`Disk quota exceeded` and exits **2**, which matches none of the deploy's own error paths.
That is what broke deploy #4.

`remote-activate.sh` now preflights available space (reading the per-user quota, falling back
to `df`) and refuses up front rather than failing half-extracted. Retention is 3 releases at
roughly 76MB each.

```bash
quota -s                                  # as bak-dev - the number that matters
du -sh ~/* | sort -rh | head              # where it went
```

If it tightens again, raise the quota in Virtualmin (Edit Virtual Server → Quota) rather than
cutting retention below 3 — two releases is the minimum for a rollback to have a target.

## Post-deploy verification

Run once after the first deploy, and after any change to this pipeline:

1. `curl -I https://bak-dev.com` → 200 over TLS, no `X-Powered-By`.
2. `curl -s https://bak-dev.com/blog | grep -c 'href="/blog/'` → 5, not 0.
3. `curl -I http://<vps-ip>:3100` from **off-box** → connection refused, proving the loopback bind.
4. Drop a test file in `public_html/.well-known/acme-challenge/` and fetch it over HTTPS → served from disk, not a Node 404. This is the cert-renewal check.
5. `pm2 describe portfolio` → online, `cwd` ends in `/current`, restart count 0.
6. **Deploy a second time** with a visible change and confirm it is actually served — a PM2 process pinned to a stale release path looks exactly like a successful deploy.
7. `sudo reboot`, then confirm the site returns unattended.
8. Break the health check on purpose (e.g. set `APP_PORT` to a wrong value), deploy, and confirm the workflow goes red **while the site stays up** on the previous release.

Step 8 is the one that proves the pipeline is safe rather than merely working.

> On the very first run, the workflow's final **Verify through Apache** step will fail until the Virtualmin proxy paths are in place — the release itself deploys and the local health check passes, but nothing is routing `bak-dev.com` to port 3100 yet. That failure is the signal that setup step 2 is still outstanding, not a broken deploy.

## Known behaviour

- `/portfolio`, `/modules`, `/themes` redirect with **308** (Next's `permanent: true`), not 301.
- `/blog/[slug]` pages are prerendered at build time; the `/blog` index is dynamic.
- `scripts/package-release.sh` copies `content/` explicitly and asserts the `.mdx` count matches. Next's tracer currently also picks it up on its own, but that is a side effect of `/blog/[slug]` being prerendered — it would stop holding if the blog routes changed. The explicit copy makes the guarantee independent of tracer behaviour, and the assertion fails the build rather than the site.
