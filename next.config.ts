import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/modules", destination: "/work?c=modules", permanent: true },
      { source: "/themes", destination: "/work?c=ecommerce", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
