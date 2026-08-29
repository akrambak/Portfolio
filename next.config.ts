import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

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
