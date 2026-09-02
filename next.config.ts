import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  // Self-contained server bundle for the VPS: `.next/standalone` carries its own
  // traced `node_modules`, so a release is ~16MB packed instead of a full install.
  // `.next/static` and `public/` are deliberately left out of it by Next and must
  // be placed alongside the server — scripts/package-release.sh does that, and
  // also copies `content/`, which /blog reads from disk at request time.
  output: "standalone",

  // Keep nodemailer (src/lib/mail.ts) a real runtime require instead of letting
  // webpack bundle it. Its transports are resolved dynamically, which the bundler
  // mangles; as an external, Next's dependency tracer copies the package into
  // .next/standalone/node_modules intact. scripts/package-release.sh asserts it
  // landed there — a missing traced dependency is a production-only 500.
  serverExternalPackages: ["nodemailer"],

  // Portfolio / Modules / Themes collapsed into a single filterable /work grid.
  // Permanent so existing inbound links and search results follow.
  async redirects() {
    return [
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/modules", destination: "/work", permanent: true },
      { source: "/themes", destination: "/work", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
