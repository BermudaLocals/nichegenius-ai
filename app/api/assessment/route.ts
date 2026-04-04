'use strict';

import { NextResponse } from 'next/server';
import { authenticateToken } from '@/app/middleware/auth';
import { calculateAssessment } from '@/lib/assessment/engine';
import { z } from 'zod';

// Rate limiting store (in‑memory)
const rateLimitStore = new Map<string>(/* ip => { count, windowStart } */);
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 per minute

function getIP(req: Request): string {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
             req.headers.get('remote-address') || 
             '127.0.0.1';
  return ip;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }
  const { count, windowStart } = record;
  if (now - windowStart > WINDOW_MS) {
    // Reset window
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (count >= MAX_REQUESTS) {
    return true;
  }
  rateLimitStore.set(ip, { count: count + 1, windowStart });
  return false;
}

// Apply rate limiting
function withRateLimit(req: Request, res: NextResponse) {
  const ip = getIP(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': `${Math.ceil(WINDOW_MS / 1000)}` } }
    );
  }
  return res;
}

export async function POST(req: Request) {
  // Apply JWT auth
  const authResponse = await authenticateToken(req);
  if (!authResponse.ok) {
    return authResponse; // unauthorized/forbidden response
  }

  // Rate limiting
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.split(' ')[1];
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const rateLimitResponse = withRateLimit(req, NextResponse);
  if (rateLimitResponse) return rateLimitResponse;

  // Parse and validate request body
  const bodySchema = z.object({
    answers: z.array(z.string()).min(155, 'Insufficient answers provided')
  });
  let parsed;
  try {
    const rawBody = await req.json();
    parsed = bodySchema.parse(rawBody);
  } catch (e) {
    return NextResponse.json(
      { error: 'Invalid request payload' },
      { status: 400 }
    );
  }

  // Run assessment engine
  try {
    const result = await calculateAssessment(parsed.answers);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error('Assessment error:', err);
    return NextResponse.json(
      { error: 'Assessment processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  // Apply JWT auth (read‑only access still requires valid token)
  const authResponse = await authenticateToken(req);
  if (!authResponse.ok) {
    return authResponse;
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const rateLimitResponse = withRateLimit(req, NextResponse);
  if (rateLimitResponse) return rateLimitResponse;

  // Stub: In a real system pull saved assessment results from DB
  return NextResponse.json(
    { message: 'Assessment endpoint accessible' },
    { status: 200 }
  );
}
