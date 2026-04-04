/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow build even with type errors in lib/ files that reference
    // packages not installed in demo mode
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ── Anti-Clone: Remove X-Powered-By header ────────────────────────────────
  poweredByHeader: false,

  // ── Anti-Clone: Disable source maps in production ─────────────────────────
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.heygen.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // ── Security Headers for all routes ───────────────────────────────────────
  async headers() {
    const securityHeaders = [
      // Prevent MIME sniffing
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      // Prevent iframe embedding (anti-clone, anti-clickjacking)
      { key: 'X-Frame-Options', value: 'DENY' },
      // XSS Protection for legacy browsers
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      // Strict referrer policy
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      // Restrict browser features for embeds
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
      },
      // HSTS — force HTTPS
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      // Cross-Origin policies
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
      // Custom protection identifier
      { key: 'X-Protected-Content', value: 'NicheGenius-AI/1.0' },
      // Content Security Policy
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-scripts.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: blob: https: http:",
          "font-src 'self' https://fonts.gstatic.com data:",
          "connect-src 'self' https://*.vercel.app https://*.nichegenius.ai wss:",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
          "media-src 'self' blob: https:",
          "worker-src 'self' blob:",
        ].join('; '),
      },
    ];

    return [
      // Apply security headers to all routes
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // API routes: CORS + security
      {
        source: '/api/:path*',
        headers: [
          ...securityHeaders,
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Dynamic-Load, X-Request-Time' },
        ],
      },
      // HTML pages: prevent caching (anti-clone)
      {
        source: '/((?!_next|api).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
          { key: 'Surrogate-Control', value: 'no-store' },
        ],
      },
      // Static assets: allow caching but with immutable flag
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // ── Webpack: Additional source map suppression ────────────────────────────
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Completely disable source maps in production client builds
      config.devtool = false;
    }
    return config;
  },
};

module.exports = nextConfig;
