import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Include native sharp binaries and libvips in serverless API bundles.
  outputFileTracingIncludes: {
    "/api/*": ["./node_modules/@img/sharp-*/**/*"],
  },
  i18n: {
    locales: ["en", "id"],
    defaultLocale: "en",
    localeDetection: false,
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sxpbvxnektftzpkuighq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
