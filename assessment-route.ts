'use strict';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Rate limiting store (in-memory)
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;

function getIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (now - record.windowStart > WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (record.count >= MAX_REQUESTS) return true;
  rateLimitStore.set(ip, { count: record.count + 1, windowStart: record.windowStart });
  return false;
}

// FIX: Schema now correctly expects array of {questionId, value} objects
const answerItemSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.number(), z.array(z.string())]),
});

const bodySchema = z.object({
  answers: z.array(answerItemSchema).min(1, 'At least one answer required'),
});

export async function POST(req: Request) {
  const ip = getIP(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  let parsed;
  try {
    const rawBody = await req.json();
    parsed = bodySchema.parse(rawBody);
  } catch (err) {
    console.error('Assessment validation error:', err);
    return NextResponse.json(
      { error: 'Invalid request payload', detail: String(err) },
      { status: 400 },
    );
  }

  try {
    const engine = await import('@/lib/assessment/engine');
    const personality = engine.calculatePersonality(parsed.answers);
    const nicheMatches = await engine.calculateNicheMatches(parsed.answers, personality);

    return NextResponse.json(
      {
        success: true,
        personality,
        nicheMatches,
        answersCount: parsed.answers.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error('Assessment engine error:', err);
    return NextResponse.json(
      { error: 'Assessment processing failed', detail: String(err) },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      service: 'NicheGenius AI Assessment Engine',
      version: '1.0.0',
      questionsCount: 155,
      sections: [
        'MBTI Personality (20 questions)',
        'Big Five Traits (25 questions)',
        'Enneagram Type (15 questions)',
        'Core Values (10 questions)',
        'Background & Skills (15 questions)',
        'Goals & Lifestyle (5 questions)',
        'Content Style (5 questions)',
      ],
      status: 'ready',
    },
    { status: 200 },
  );
}
