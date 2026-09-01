// PM2 process definition for the production site (bak-dev.com).
//
// Apache reverse-proxies bak-dev.com -> 127.0.0.1:3100, so this app owns :3100.
// Do not hand-run `next start` in production: it will only collide with this
// process. Ship changes with `npm run deploy`, which builds as bak-dev and
// restarts this app.
//
//   Register/refresh:  npm run pm2:setup
//   Inspect:           npm run pm2:status / npm run pm2:logs
//
// Runs as the bak-dev user, whose PM2 daemon is started at boot by the
// pm2-bak-dev systemd unit.
module.exports = {
  apps: [
    {
      name: 'portfolio',
      cwd: '/home/bak-dev/Portfolio',
      script: './node_modules/.bin/next',
      args: 'start -p 3100',

      // Use the system node, not root's nvm build. The previous ad-hoc
      // registration pointed at /root/.nvm/versions/node/v24.12.0/bin/node:
      // a bak-dev process depending on a binary inside root's home, which
      // breaks the site the day that nvm version is upgraded or removed.
      interpreter: '/usr/local/bin/node',

      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,

      // Safety net against a slow leak. Steady state is ~280MB, ~440MB after
      // two days uptime, on a 7.7GB box.
      max_memory_restart: '800M',

      env: {
        NODE_ENV: 'production',
        PORT: 3100,
      },

      merge_logs: true,
      time: true, // timestamp log lines - without this, stale and live errors are indistinguishable
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
};
