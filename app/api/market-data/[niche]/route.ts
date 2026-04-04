'use server';

import { NextResponse } from 'next/server';
import { authenticateToken } from '@/app/middleware/auth';
import { getFullMarketIntelligence } from '@/lib/market/intelligence';
import { z } from 'zod';

// Rate limiting: per-IP store
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;

function getIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('remote-address') ||
    '127.0.0.1'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (now - record.windowStart > WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  rateLimitStore.set(ip, { count: record.count + 1, windowStart: record.windowStart });
  return true;
}

export async function GET(
  req: Request,
  { params }: { params: { niche: string } }
) {
  // JWT authentication
  const authRes = await authenticateToken(req);
  if (!authRes.ok) return authRes;

  // Rate limiting
  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Validate niche parameter
  const niche = params.niche;
  if (!niche) {
    return NextResponse.json({ error: 'Missing niche parameter' }, { status: 400 });
  }

  try {
    // Fetch comprehensive market intelligence
    const marketData = await getFullMarketIntelligence(niche);

    if (!marketData) {
      return NextResponse.json(
        { error: 'Market data not found for this niche' },
        { status: 404 }
      );
    }

    // Include niche name in response for clarity
    const response = {
      niche,
      ...marketData,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    console.error('Market data error for niche "' + niche + '":', err);
    return NextResponse.json(
      { error: 'Failed to retrieve market data' },
      { status: 500 }
    );
  }
}

// Optional: POST to store custom market data
export async function POST(req: Request, { params }: { params: { niche: string } }) {
  const authRes = await authenticateToken(req);
  if (!authRes.ok) return authRes;

  try {
    const body = await req.json();
    const schema = z.object({
      niche: z.string(),
      data: z.record(z.any()).optional(),
    });
    const { niche, data } = schema.parse(body);

    // In a real system, persist custom market data to DB
    return NextResponse.json(
      { success: true, niche, data: 'Data stored successfully' },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
