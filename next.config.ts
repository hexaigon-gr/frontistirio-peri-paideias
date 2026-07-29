import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // This project is nested inside another pnpm project that also has a
  // lockfile, so Next would otherwise infer the parent directory as the
  // workspace root. Pin it to this directory.
  turbopack: {
    root: __dirname,
  },
};

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");
export default withNextIntl(nextConfig);
