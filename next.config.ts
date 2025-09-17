import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/libs/Env';

const withNextIntl = createNextIntlPlugin('./src/libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ['@electric-sql/pglite'],
  webpack: (config: any, { isServer: _isServer }: { isServer: boolean }) => {
    // Suppress OpenTelemetry warnings
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
    ];

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'd141z16voa3qs7.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'd3et1vq9iwo5q0.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'd5tjr81ani1jr.cloudfront.net',
      },
    ] as any[],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sign-in',
        permanent: true,
      },
    ];
  },
  headers: async () => [
    {
      source: '/:all*(svg|jpg|png)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      // Add proper headers for service worker
      source: '/sw.js',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
        },
        {
          key: 'Service-Worker-Allowed',
          value: '/',
        },
        {
          key: 'Content-Type',
          value: 'application/javascript; charset=utf-8',
        },
      ],
    },
    {
      // Add proper headers for manifest
      source: '/manifest.json',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
        },
        {
          key: 'Content-Type',
          value: 'application/manifest+json; charset=utf-8',
        },
      ],
    },
  ],
};

// Apply plugins
const configWithPlugins = withNextIntl(nextConfig);
const analyzerConfig = bundleAnalyzer(configWithPlugins);

// Only use Sentry in production
const config = process.env.NODE_ENV === 'production'
  ? withSentryConfig(
      analyzerConfig,
      {
        // Sentry options
        org: 'nextjs-boilerplate-org',
        project: 'nextjs-boilerplate',
        silent: !process.env.CI,
        widenClientFileUpload: true,
        reactComponentAnnotation: {
          enabled: true,
        },
        tunnelRoute: '/monitoring',
        hideSourceMaps: true,
        disableLogger: true,
        automaticVercelMonitors: true,
        telemetry: false,
      },
    )
  : analyzerConfig;

export default config;
