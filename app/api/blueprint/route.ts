'use server';

import { NextResponse } from 'next/server';
import { authenticateToken } from '@/app/middleware/auth';
import { generateBlueprint } from '@/lib/assessment/engine';
import { getNicheData } from '@/lib/knowledge/vector-store';
import { getFullMarketIntelligence } from '@/lib/market/intelligence';
import { z } from 'zod';

// Rate limiting: simple in‑memory per‑IP store
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

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

export async function GET(req: Request) {
  // Auth
  const authRes = await authenticateToken(req);
  if (!authRes.ok) return authRes;

  // Rate limit per IP
  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    // Use query params: niche,userId
    const url = new URL(req.url);
    const niche = url.searchParams.get('niche');
    const userId = req.headers.get('x-user-id');

    if (!niche) {
      return NextResponse.json({ error: 'Missing niche parameter' }, { status: 400 });
    }

    // Fetch knowledge & market intel in parallel
    const [nicheData, marketIntel] = await Promise.all([
      getNicheData(niche),
      getFullMarketIntelligence(niche),
    ]);

    // Build profile stub from knowledge + optional user ID
    const profile = {
      niche,
      userId,
      knowledge: nicheData,
      market: marketIntel,
    };

    // Generate blueprint
    const blueprint = await generateBlueprint([niche], profile);

    return NextResponse.json(blueprint, { status: 200 });
  } catch (err: any) {
    console.error('Blueprint generation failed:', err);
    return NextResponse.json({ error: 'Failed to generate blueprint' }, { status: 500 });
  }
}

// Optional: POST to store custom blueprint edits
export async function POST(req: Request) {
  const authRes = await authenticateToken(req);
  if (!authRes.ok) return authRes;

  try {
    const body = await req.json();
    const schema = z.object({
      niche: z.string(),
      edits: z.record(z.any()).optional(),
    });
    const { niche, edits } = schema.parse(body);

    // In a real system, persist edits to DB and return updated blueprint
    return NextResponse.json({ success: true, niche, edits }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
