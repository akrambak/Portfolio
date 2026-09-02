// PM2 process definition for the production site (bak-dev.com).
//
// Apache reverse-proxies bak-dev.com -> 127.0.0.1:3100, so this app owns :3100.
// Do not hand-run `next start` in production: it will only collide with this
// process. Ship changes by pushing to main (.github/workflows/deploy.yml), or
// with `npm run deploy:local` to bypass CI.
//
// Deployed to <APP_DIR>/shared/ecosystem.config.js by scripts/remote-activate.sh
// and reloaded from there, so it self-locates: APP_DIR is this file's parent's
// parent. Nothing here hardcodes a username, and a rollback reuses this same
// file rather than one from inside a release tree.
//
//   Inspect:  npm run pm2:status / npm run pm2:logs
//
// Runs as the bak-dev user, whose PM2 daemon is started at boot by the
// pm2-bak-dev systemd unit.
//
// CommonJS on purpose - package.json has no "type": "module", and PM2 requires
// ecosystem files to be CJS regardless.
const path = require("path");

const APP_DIR = path.resolve(__dirname, "..");

module.exports = {
  apps: [
    {
      name: process.env.APP_NAME || "portfolio",

      // `cwd` is the `current` SYMLINK, not a release realpath. Two reasons:
      // 1. Next reads content/blog via process.cwd() at request time
      //    (src/lib/mdxUtils.ts) - cwd must be the live release.
      // 2. The path pm2 save() persists stays valid across deploys and release
      //    pruning, so the app comes back correctly after a reboot.
      cwd: path.join(APP_DIR, "current"),

      // The standalone server built by `output: "standalone"`. Unlike a
      // `next start` deployment this takes no args - port and host come from
      // the environment below.
      script: "server.js",

      // Use the system node, not root's nvm build. The original ad-hoc
      // registration pointed at /root/.nvm/versions/node/v24.12.0/bin/node:
      // a bak-dev process depending on a binary inside root's home, which
      // breaks the site the day that nvm version is upgraded or removed.
      // This is a stable *path*, not independence - the symlink still resolves
      // into root's nvm, which remains the only node on the box.
      interpreter: "/usr/local/bin/node",

      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,

      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || "3100",
        // Next's standalone server binds 0.0.0.0 by default, which would expose
        // the app port to the internet un-proxied and un-TLS'd. Apache is the
        // only thing that should be able to reach it.
        HOSTNAME: "127.0.0.1",
      },

      // Safety net against a slow leak. Steady state is ~280MB, ~440MB after
      // two days uptime, on a 7.7GB box - so a 512M ceiling would recycle the
      // process every couple of days for no reason.
      max_memory_restart: "800M",

      // A crash loop should surface as downtime, not an infinite restart spin.
      max_restarts: 10,
      min_uptime: "20s",

      kill_timeout: 5000,
      listen_timeout: 10000,

      merge_logs: true,
      time: true, // timestamp log lines - without this, stale and live errors are indistinguishable
      out_file: path.join(APP_DIR, "shared", "logs", "out.log"),
      error_file: path.join(APP_DIR, "shared", "logs", "error.log"),
    },
  ],
};
