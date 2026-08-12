import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Applied to every response.
 *
 * `frame-ancestors` rather than `X-Frame-Options`, which it supersedes. This is
 * deliberately NOT a full CSP: the JSON-LD is inline and a real `script-src`
 * needs a nonce, which needs the middleware, which is a separate piece of work.
 * Shipping the cheap headers now beats shipping nothing while a perfect CSP is
 * designed.
 *
 * Vercel sets HSTS itself on a custom domain, but it is declared here so the
 * header does not depend on the host, and `preload` is left off on purpose: it
 * is a one-way door that also binds every future subdomain.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
] as const;

const nextConfig: NextConfig = {
  // This project is nested inside another pnpm project that also has a
  // lockfile, so Next would otherwise infer the parent directory as the
  // workspace root. Pin it to this directory.
  turbopack: {
    root: __dirname,
  },

  /* Announcing the framework and its version to every visitor buys nothing. */
  poweredByHeader: false,

  images: {
    /* AVIF first. Measured on this site's own textures, AVIF landed at a
       fraction of the WebP size at visually identical quality, and the
       soft-alpha assets in particular collapse almost to nothing. Next falls
       back to WebP for anything that does not accept AVIF. */
    formats: ["image/avif", "image/webp"],
    /* 1280 and 1366 are the two most common laptop widths and neither was in
       the default ladder, so a 1280 viewport jumped straight to the 1920
       variant and downloaded 2.25x the pixels it could display. */
    deviceSizes: [640, 750, 828, 1080, 1200, 1280, 1366, 1920, 2048, 3840],
    /* The optimizer's output is content-addressed by URL and query, so a short
       TTL only costs revalidation round trips. */
    minimumCacheTTL: 31536000,
  },

  headers: async () => [
    {
      source: "/:path*",
      headers: [...SECURITY_HEADERS],
    },
    {
      /* Static files under `public/` are served with `max-age=0`, which is the
         right default for anything that can change in place, but the board
         textures are the LCP resource on most pages and they are versioned by
         filename. */
      source: "/images/texture/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
  ],
};

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");
export default withNextIntl(nextConfig);
