'use server';

import { NextResponse } from 'next/server';
import { authenticateToken } from '@/app/middleware/auth';
import { searchKnowledge, getNicheData, findSimilarNiches } from '@/lib/knowledge/vector-store';
import { z } from 'zod';

// Rate limiting
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 40;

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

// Filter schemas
const nicheFilterSchema = z.object({
  industries: z.array(z.string()).optional(),
  audienceSize: z.enum(['small', 'medium', 'large', 'any']).optional().default('any'),
  competition: z.enum(['low', 'medium', 'high', 'any']).optional().default('any'),
  revenuePotential: z.enum(['low', 'medium', 'high', 'any']).optional().default('any'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'any']).optional().default('any'),
  searchTerm: z.string().optional(),
  limit: z.number().int().positive().max(50).optional().default(10),
});

export async function POST(req: Request) {
  const authRes = await authenticateToken(req);
  if (!authRes.ok) return authRes;

  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const filters = nicheFilterSchema.parse(body);

    let niches = [];

    // If searchTerm provided, use vector search
    if (filters.searchTerm) {
      const vectorResults = await searchKnowledge({
        query: filters.searchTerm,
        filters: {
          type: 'niche',
          ...(filters.industries?.length && { industry: { in: filters.industries } }),
        },
        topK: filters.limit * 2, // Get more to allow filtering
      });
      niches = vectorResults.map((entry) => entry.metadata);
    } else {
      // Otherwise, fetch niche data from knowledge base index
      const allNiches = await getNicheData(''); // Empty fetches all? We'll adapt: need a list function
      niches = allNiches || [];
    }

    // Apply filters
    let filtered = niches.filter((niche: any) => {
      if (filters.industries?.length && !filters.industries.includes(niche.industry)) return false;
      if (filters.audienceSize !== 'any' && niche.audienceSize !== filters.audienceSize) return false;
      if (filters.competition !== 'any' && niche.competitionLevel !== filters.competition) return false;
      if (filters.revenuePotential !== 'any' && niche.revenuePotential !== filters.revenuePotential) return false;
      if (filters.skillLevel !== 'any' && niche.requiredSkillLevel !== filters.skillLevel) return false;
      return true;
    });

    // Sort by match score / viability
    filtered.sort((a: any, b: any) => (b.viabilityScore || 0) - (a.viabilityScore || 0));

    // Limit results
    const results = filtered.slice(0, filters.limit);

    return NextResponse.json(
      { niches: results, count: results.length, filtersApplied: filters },
      { status: 200 }
    );
  } catch (e) {
    console.error('Niche matches filter error:', e);
    return NextResponse.json({ error: 'Invalid request or server error' }, { status: 400 });
  }
}

// Optional GET to discover available industries
export async function GET(req: Request) {
  const authRes = await authenticateToken(req);
  if (!authRes.ok) return authRes;

  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    // In a real system, fetch distinct industry list from DB or knowledge base
    const mockIndustries = [
      'Health & Fitness', 'Personal Development', 'Business & Finance',
      'Technology', 'Creativity & Arts', 'Lifestyle', 'Education', 'Parenting'
    ];
    return NextResponse.json({ industries: mockIndustries }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch industries' }, { status: 500 });
  }
}
