import { withSentryConfig } from "@sentry/nextjs/config";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: process.env.ANALYZE === "true",
});

// 현재 로드 중인 스크립트 출처를 열거한 report-only CSP입니다. 당장 차단하지 않고
// 위반 보고만 받아, 예상치 못한 외부 스크립트(공급망 변조나 주입)를 탐지하는 것이 목적입니다.
// Next.js의 hydration 인라인 스크립트와 GTM·Clarity 부트스트랩 때문에 'unsafe-inline'/'unsafe-eval'은
// 허용하며, 출처 목록을 바꿀 때는 반드시 아래 표의 서비스와 대응되는지 확인합니다.
// 보고 기간 동안 위반이 없으면 Content-Security-Policy-Report-Only를 Content-Security-Policy로 승격합니다.
// script-src 하나만 선언합니다. default-src를 넣으면 report-only 특성상 이미지·연결·스타일 등
// 모든 리소스 위반이 함께 쏟아져 스크립트 출처 탐지라는 목적이 묻히기 때문입니다.
const scriptSrcReportOnly = [
  "script-src",
  "'self'",
  "'unsafe-inline'",
  "'unsafe-eval'",
  // Google Tag Manager / Google Analytics (@next/third-parties)
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://ssl.google-analytics.com",
  // Microsoft Clarity (인라인 부트스트랩 + 태그 스크립트)
  "https://www.clarity.ms",
  "https://*.clarity.ms",
  // 카카오 JavaScript SDK
  "https://t1.kakaocdn.net",
  // 네이버 지도 v3 (maps.js 및 submodule)
  "https://oapi.map.naver.com",
  "https://*.map.naver.com",
  "https://*.pstatic.net",
  // Vercel Analytics / Speed Insights
  "https://va.vercel-scripts.com",
].join(" ");

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none';",
  },
  {
    key: "Content-Security-Policy-Report-Only",
    value: scriptSrcReportOnly,
  },
  {
    key: "Permissions-Policy",
    value: "microphone=(), payment=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  async rewrites() {
    if (!apiBaseUrl) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: require.resolve("@svgr/webpack"),
          options: {
            svgo: true,
            titleProp: true,
            svgoConfig: {
              plugins: [
                { name: "removeViewBox", active: false },
                { name: "removeDimensions", active: true },
              ],
            },
            replaceAttrValues: {
              "#000": "currentColor",
              "#000000": "currentColor",
              "#D9D9D9": "currentColor",
            },
          },
        },
      ],
    });
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.mypetlife.co.kr",
      },
      {
        protocol: "https",
        hostname: "i.namu.wiki",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.police.go.kr",
      },
      {
        protocol: "http",
        hostname: "**.police.go.kr",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

// export default nextConfig;
export default withSentryConfig(withBundleAnalyzer(withNextIntl(nextConfig)), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "finditem",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
