import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const isDev = process.env.NODE_ENV === "development";

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

  // The app served no security headers at all: no CSP, nothing pinning the frame
  // policy, nothing stopping a sniffed content type. Apache fronts the standalone
  // server and could set these, but then they live on the VPS instead of in the
  // repo, where a redeploy to anywhere else quietly loses them.
  async headers() {
    // Every third-party origin, grouped by the tag that needs it. All of them load
    // through GTM and only after consent (see src/lib/consent.ts) — the CSP is the
    // second fence: a tag someone adds in the GTM UI that is not listed here is
    // blocked, which is the point. Add an origin here in the same change as the tag.
    const origins = {
      gtm: ["https://www.googletagmanager.com"],
      // GTM's Preview/debug mode (Tag Assistant) injects its own UI.
      gtmPreview: ["https://tagmanager.google.com"],
      ga4: [
        "https://www.google-analytics.com",
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
      ],
      googleAds: [
        "https://www.googleadservices.com",
        "https://googleads.g.doubleclick.net",
        "https://*.doubleclick.net",
        "https://www.google.com",
        "https://*.google.com",
      ],
      meta: ["https://connect.facebook.net", "https://www.facebook.com"],
      clarity: ["https://www.clarity.ms", "https://*.clarity.ms", "https://c.bing.com"],
    };

    // React refresh evaluates the modules it swaps in, so `unsafe-eval` is the
    // price of HMR. Production never gets it.
    const scriptSrc = [
      "'self'",
      // Next inlines hydration data and the flash-of-wrong-theme guard, and the GTM
      // and Consent Mode bootstraps in the layout are inline too. All are
      // build-authored, but CSP cannot tell them from an injected one without a
      // nonce — which needs per-request rendering this app deliberately does not
      // have (pages are prerendered). The remaining directives are still worth
      // having, so this stays honest about what it does not buy.
      "'unsafe-inline'",
      ...origins.gtm,
      ...origins.gtmPreview,
      ...origins.ga4,
      ...origins.googleAds,
      "https://connect.facebook.net",
      "https://www.clarity.ms",
      "https://*.clarity.ms",
      ...(isDev ? ["'unsafe-eval'"] : []),
    ].join(" ");

    const csp = [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      // Tailwind's runtime layer and framer-motion both write style attributes.
      // Google Fonts is only for GTM Preview's own panel.
      `style-src 'self' 'unsafe-inline' ${origins.gtmPreview.join(" ")} https://fonts.googleapis.com`,
      // Tracking pixels are images.
      [
        "img-src 'self' data: blob:",
        ...origins.gtm,
        ...origins.gtmPreview,
        ...origins.ga4,
        ...origins.googleAds,
        ...origins.meta,
        ...origins.clarity,
      ].join(" "),
      // next/font/google self-hosts at build time; gstatic is GTM Preview's.
      "font-src 'self' data: https://fonts.gstatic.com",
      [
        "connect-src 'self'",
        ...origins.gtm,
        ...origins.ga4,
        ...origins.googleAds,
        ...origins.meta,
        ...origins.clarity,
      ].join(" "),
      // The GTM noscript iframe, Google Ads' conversion iframe, Meta's pixel frame.
      "frame-src https://www.googletagmanager.com https://td.doubleclick.net https://www.facebook.com",
      "object-src 'none'",
      // Neither is used, and both are how an injected tag rewrites where relative
      // URLs and form posts actually go.
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          // frame-ancestors already covers this for current browsers; kept for the
          // ones that only honour the older header.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the origin cross-site, the full path same-origin. The contact page
          // carries no query string worth leaking, but /blog paths are still ours.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing here asks for hardware. Denying it means an injected third-party
          // tag cannot either.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Deliberately without includeSubDomains: bak-dev.com's MX and Virtualmin
          // panel are siblings on the same box, and pinning them to HTTPS from here
          // would be a decision this app has no business making for them.
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
        ],
      },
    ];
  },

  // Portfolio / Modules / Themes collapsed into a single filterable /work grid.
  // Permanent so existing inbound links and search results follow.
  // Each alias twice: unprefixed for English and under /fr. (An optional `:lang?`
  // segment in the destination 500s when it is absent, so they are spelled out.)
  async redirects() {
    const aliases: Array<[string, string]> = [
      ["/portfolio", "/work"],
      ["/modules", "/work"],
      ["/themes", "/work"],
      ["/freelance", "/hire-me"],
      ["/work-with-me", "/hire-me"],
    ];
    return ["", "/fr"].flatMap((prefix) =>
      aliases.map(([from, to]) => ({
        source: `${prefix}${from}`,
        destination: `${prefix}${to}`,
        permanent: true,
      })),
    );
  },
};

export default withNextIntl(nextConfig);
