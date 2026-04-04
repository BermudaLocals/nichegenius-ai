import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Rate Limiting Store ─────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 120;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ─── Blocked Scraper User Agents ─────────────────────────────────────────────
const BLOCKED_AGENTS = [
  'httrack', 'scrapy', 'webripper', 'sitecopy', 'webcopier',
  'webzip', 'teleport', 'offline explorer', 'webstripper',
];

function isScraperUA(ua: string): boolean {
  const lower = ua.toLowerCase();
  return BLOCKED_AGENTS.some((b) => lower.includes(b));
}

// ─── Protected File Extensions ───────────────────────────────────────────────
const BLOCKED_EXTENSIONS = /\.(ts|tsx|prisma|env|git|map|log|bak)$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // ── Allow Next.js internals and static assets ──────────────────────────────
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/avatars/') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|webp|avif)$/)
  ) {
    return NextResponse.next();
  }

  // ── Block known scraper tools ──────────────────────────────────────────────
  if (isScraperUA(userAgent)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // ── Block source file access ───────────────────────────────────────────────
  if (BLOCKED_EXTENSIONS.test(pathname)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // ── Rate limiting ─────────────────────────────────────────────────────────
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // ── Build response with security headers ───────────────────────────────────
  const response = NextResponse.next();
  const hostname = request.headers.get('host') || '';
  const isDev = hostname.includes('localhost') || hostname.includes('loca.lt');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: blob: https: http:`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `connect-src 'self' https: wss: ${isDev ? 'http://localhost:* ws://localhost:* ws://*.loca.lt:*' : ''}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `media-src 'self' blob: https:`,
    `worker-src 'self' blob:`,
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );
  response.headers.set('X-Protected-Content', 'NicheGenius-AI/2.0');
  response.headers.delete('X-Powered-By');

  // No-cache for HTML pages
  const isPage = !pathname.startsWith('/api/') && !pathname.includes('.');
  if (isPage) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
  }

  if (!isDev) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)).*)',
  ],
};
