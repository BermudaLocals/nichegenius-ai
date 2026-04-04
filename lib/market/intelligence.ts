// ============================================
// NicheGenius AI - Market Intelligence Engine
// Real-time market data aggregation & analysis
// ============================================

import { generate } from '@/lib/ai/engine';
import { getPrompt } from '@/lib/ai/prompts';
import { searchKnowledge } from '@/lib/knowledge/vector-store';

// ---- Types ----

export interface MarketData {
  niche: string;
  marketSize: {
    total: number;
    currency: string;
    year: number;
    addressable: number;
    serviceable: number;
  };
  growthRate: {
    annual: number;
    projected5Year: number;
    trend: 'accelerating' | 'steady' | 'decelerating';
  };
  competition: {
    level: 'low' | 'moderate' | 'high' | 'saturated';
    numberOfPlayers: number;
    dominantModel: string;
    barrierToEntry: 'low' | 'medium' | 'high';
  };
  audience: {
    size: number;
    demographics: {
      ageRange: string;
      primaryGender: string;
      incomeLevel: string;
      education: string;
    };
    psychographics: {
      values: string[];
      painPoints: string[];
      aspirations: string[];
    };
    platforms: string[];
  };
  monetization: {
    averageCustomerValue: number;
    averageOrderValue: number;
    commonModels: string[];
    pricingRange: { min: number; max: number };
  };
  seasonality: {
    peakMonths: number[];
    lowMonths: number[];
    isEvergreen: boolean;
  };
  lastUpdated: string;
}

export interface Competitor {
  name: string;
  website: string;
  estimatedRevenue: number;
  marketShare: number;
  audienceSize: number;
  strengths: string[];
  weaknesses: string[];
  contentStrategy: string;
  monetizationModel: string;
  uniqueSellingProposition: string;
  platforms: string[];
  priceRange: { min: number; max: number };
}

export interface CompetitorLandscape {
  niche: string;
  totalCompetitors: number;
  topCompetitors: Competitor[];
  marketGaps: string[];
  differentiationOpportunities: string[];
  competitiveAdvantages: string[];
  entryStrategy: string;
}

export interface Trend {
  name: string;
  category: string;
  direction: 'rising' | 'stable' | 'declining';
  strength: number;
  timeframe: string;
  relatedKeywords: string[];
  contentOpportunities: string[];
  monetizationAngle: string;
  confidence: number;
}

export interface TrendReport {
  niche: string;
  generatedAt: string;
  trends: Trend[];
  emergingTopics: string[];
  decliningTopics: string[];
  contentGaps: string[];
  predictedNextTrends: string[];
}

export interface RevenueEstimate {
  niche: string;
  audienceSize: number;
  scenarios: {
    conservative: {
      monthly: number;
      annual: number;
      conversionRate: number;
      averagePrice: number;
      assumptions: string[];
    };
    moderate: {
      monthly: number;
      annual: number;
      conversionRate: number;
      averagePrice: number;
      assumptions: string[];
    };
    optimistic: {
      monthly: number;
      annual: number;
      conversionRate: number;
      averagePrice: number;
      assumptions: string[];
    };
  };
  revenueStreams: Array<{
    name: string;
    type: string;
    estimatedMonthly: number;
    effort: 'low' | 'medium' | 'high';
    timeToRevenue: string;
  }>;
  milestones: Array<{
    revenue: number;
    timeframe: string;
    requirements: string[];
  }>;
}

// ---- AI-Powered Market Analysis ----

/**
 * Comprehensive niche market analysis using AI + knowledge base.
 */
export async function analyzeNicheMarket(niche: string): Promise<MarketData> {
  // Search knowledge base for existing data
  const knowledgeResults = await searchKnowledge(
    `${niche} market size growth competition audience demographics`,
    { category: 'market-intel' },
    5,
  ).catch(() => []);

  const contextData = knowledgeResults
    .map((r) => `${r.title}: ${r.content}`)
    .join('\n\n')
    .slice(0, 3000);

  const prompt = getPrompt('marketResearch', {
    nicheName: niche,
    region: 'global',
    dataPoints: 'market size, growth rate, competition level, audience demographics, monetization models, seasonality',
  });

  const response = await generate({
    task: 'market_research',
    prompt: `${prompt.user}\n\nExisting knowledge base data:\n${contextData}\n\nReturn a comprehensive JSON object with these exact fields:\n- marketSize: { total (number USD), currency, year, addressable, serviceable }\n- growthRate: { annual (percentage), projected5Year (percentage), trend }\n- competition: { level, numberOfPlayers, dominantModel, barrierToEntry }\n- audience: { size, demographics: { ageRange, primaryGender, incomeLevel, education }, psychographics: { values[], painPoints[], aspirations[] }, platforms[] }\n- monetization: { averageCustomerValue, averageOrderValue, commonModels[], pricingRange: { min, max } }\n- seasonality: { peakMonths[], lowMonths[], isEvergreen }\n\nReturn ONLY valid JSON.`,
    systemPrompt: prompt.system,
    config: { maxTokens: 4096 },
  });

  try {
    const parsed = extractJson(response.text);
    return {
      niche,
      marketSize: parsed.marketSize || defaultMarketSize(),
      growthRate: parsed.growthRate || defaultGrowthRate(),
      competition: parsed.competition || defaultCompetition(),
      audience: parsed.audience || defaultAudience(),
      monetization: parsed.monetization || defaultMonetization(),
      seasonality: parsed.seasonality || defaultSeasonality(),
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return createDefaultMarketData(niche);
  }
}

/**
 * Analyze competitor landscape for a niche.
 */
export async function getCompetitorLandscape(
  niche: string,
): Promise<CompetitorLandscape> {
  const prompt = getPrompt('competitorAnalysis', {
    nicheName: niche,
    competitors: 'top 5-7 competitors in this niche',
  });

  const response = await generate({
    task: 'competitor_analysis',
    prompt: `${prompt.user}\n\nAnalyze the competitive landscape for the "${niche}" niche.\nReturn a JSON object with:\n- totalCompetitors: estimated number\n- topCompetitors: array of { name, website, estimatedRevenue, marketShare, audienceSize, strengths[], weaknesses[], contentStrategy, monetizationModel, uniqueSellingProposition, platforms[], priceRange: { min, max } }\n- marketGaps: string[]\n- differentiationOpportunities: string[]\n- competitiveAdvantages: string[] (for a new entrant)\n- entryStrategy: string\n\nReturn ONLY valid JSON.`,
    systemPrompt: prompt.system,
    config: { maxTokens: 6144 },
  });

  try {
    const parsed = extractJson(response.text);
    return {
      niche,
      totalCompetitors: parsed.totalCompetitors || 50,
      topCompetitors: (parsed.topCompetitors || []).map(normalizeCompetitor),
      marketGaps: parsed.marketGaps || [],
      differentiationOpportunities: parsed.differentiationOpportunities || [],
      competitiveAdvantages: parsed.competitiveAdvantages || [],
      entryStrategy: parsed.entryStrategy || 'Focus on underserved sub-niches',
    };
  } catch {
    return createDefaultCompetitorLandscape(niche);
  }
}

/**
 * Get trending topics in a niche.
 */
export async function getTrendingTopics(niche: string): Promise<TrendReport> {
  const prompt = getPrompt('trendAnalysis', {
    nicheName: niche,
    timeframe: 'current and next 6 months',
  });

  const response = await generate({
    task: 'trend_analysis',
    prompt: `${prompt.user}\n\nAnalyze current and emerging trends in the "${niche}" niche.\nReturn a JSON object with:\n- trends: array of { name, category, direction ('rising'|'stable'|'declining'), strength (1-10), timeframe, relatedKeywords[], contentOpportunities[], monetizationAngle, confidence (0-1) }\n- emergingTopics: string[]\n- decliningTopics: string[]\n- contentGaps: string[]\n- predictedNextTrends: string[]\n\nInclude 8-12 trends. Return ONLY valid JSON.`,
    systemPrompt: prompt.system,
    config: { maxTokens: 4096 },
  });

  try {
    const parsed = extractJson(response.text);
    return {
      niche,
      generatedAt: new Date().toISOString(),
      trends: (parsed.trends || []).map(normalizeTrend),
      emergingTopics: parsed.emergingTopics || [],
      decliningTopics: parsed.decliningTopics || [],
      contentGaps: parsed.contentGaps || [],
      predictedNextTrends: parsed.predictedNextTrends || [],
    };
  } catch {
    return createDefaultTrendReport(niche);
  }
}

/**
 * Estimate revenue potential for a niche.
 */
export async function estimateRevenuePotential(
  niche: string,
  audienceSize: number = 1000,
): Promise<RevenueEstimate> {
  const response = await generate({
    task: 'niche_analysis',
    prompt: `Estimate revenue potential for an online business in the "${niche}" niche with an audience of ${audienceSize} people.

Return a detailed JSON object with:
- scenarios:
  - conservative: { monthly, annual, conversionRate (decimal), averagePrice, assumptions[] }
  - moderate: { monthly, annual, conversionRate, averagePrice, assumptions[] }
  - optimistic: { monthly, annual, conversionRate, averagePrice, assumptions[] }
- revenueStreams: array of { name, type, estimatedMonthly, effort ('low'|'medium'|'high'), timeToRevenue }
- milestones: array of { revenue (monthly), timeframe, requirements[] }

Be realistic with conversion rates (1-5% typical). Return ONLY valid JSON.`,
    systemPrompt: 'You are a business analytics expert specializing in online business revenue modeling. Provide realistic, data-driven estimates.',
    config: { maxTokens: 4096 },
  });

  try {
    const parsed = extractJson(response.text);
    return {
      niche,
      audienceSize,
      scenarios: {
        conservative: normalizeScenario(parsed.scenarios?.conservative, audienceSize, 0.01),
        moderate: normalizeScenario(parsed.scenarios?.moderate, audienceSize, 0.025),
        optimistic: normalizeScenario(parsed.scenarios?.optimistic, audienceSize, 0.05),
      },
      revenueStreams: (parsed.revenueStreams || []).map(normalizeRevenueStream),
      milestones: parsed.milestones || defaultMilestones(),
    };
  } catch {
    return createDefaultRevenueEstimate(niche, audienceSize);
  }
}

// ---- Composite Analysis ----

/**
 * Full market intelligence report combining all analyses.
 */
export async function getFullMarketIntelligence(niche: string): Promise<{
  market: MarketData;
  competitors: CompetitorLandscape;
  trends: TrendReport;
  revenue: RevenueEstimate;
  generatedAt: string;
}> {
  const [market, competitors, trends, revenue] = await Promise.all([
    analyzeNicheMarket(niche),
    getCompetitorLandscape(niche),
    getTrendingTopics(niche),
    estimateRevenuePotential(niche, 1000),
  ]);

  return {
    market,
    competitors,
    trends,
    revenue,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Quick niche viability score (0-100).
 */
export async function getNicheViabilityScore(niche: string): Promise<{
  score: number;
  breakdown: {
    marketSize: number;
    growthPotential: number;
    competitionFavorability: number;
    monetizationEase: number;
    audienceAccessibility: number;
  };
  verdict: string;
  recommendation: string;
}> {
  const response = await generate({
    task: 'niche_analysis',
    prompt: `Rate the viability of the "${niche}" niche for a new online entrepreneur on a scale of 0-100.

Return JSON with:
- score: overall viability (0-100)
- breakdown: { marketSize (0-100), growthPotential (0-100), competitionFavorability (0-100), monetizationEase (0-100), audienceAccessibility (0-100) }
- verdict: one of 'excellent' | 'good' | 'moderate' | 'challenging' | 'avoid'
- recommendation: 1-2 sentence actionable advice

Return ONLY valid JSON.`,
    systemPrompt: 'You are a niche viability analyst. Be honest and data-driven.',
    config: { maxTokens: 1024 },
  });

  try {
    const parsed = extractJson(response.text);
    return {
      score: clamp(parsed.score || 50, 0, 100),
      breakdown: {
        marketSize: clamp(parsed.breakdown?.marketSize || 50, 0, 100),
        growthPotential: clamp(parsed.breakdown?.growthPotential || 50, 0, 100),
        competitionFavorability: clamp(parsed.breakdown?.competitionFavorability || 50, 0, 100),
        monetizationEase: clamp(parsed.breakdown?.monetizationEase || 50, 0, 100),
        audienceAccessibility: clamp(parsed.breakdown?.audienceAccessibility || 50, 0, 100),
      },
      verdict: parsed.verdict || 'moderate',
      recommendation: parsed.recommendation || 'Further research recommended.',
    };
  } catch {
    return {
      score: 50,
      breakdown: { marketSize: 50, growthPotential: 50, competitionFavorability: 50, monetizationEase: 50, audienceAccessibility: 50 },
      verdict: 'moderate',
      recommendation: 'Unable to fully analyze. Try refining the niche name.',
    };
  }
}

// ---- Internal Helpers ----

function extractJson(text: string): Record<string, unknown> {
  // Try direct parse
  try {
    return JSON.parse(text);
  } catch {
    // Extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }
    // Extract first { ... } block
    const braceMatch = text.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      return JSON.parse(braceMatch[0]);
    }
    throw new Error('No JSON found in response');
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeCompetitor(raw: Record<string, unknown>): Competitor {
  return {
    name: String(raw.name || 'Unknown'),
    website: String(raw.website || ''),
    estimatedRevenue: Number(raw.estimatedRevenue || 0),
    marketShare: Number(raw.marketShare || 0),
    audienceSize: Number(raw.audienceSize || 0),
    strengths: Array.isArray(raw.strengths) ? raw.strengths.map(String) : [],
    weaknesses: Array.isArray(raw.weaknesses) ? raw.weaknesses.map(String) : [],
    contentStrategy: String(raw.contentStrategy || ''),
    monetizationModel: String(raw.monetizationModel || ''),
    uniqueSellingProposition: String(raw.uniqueSellingProposition || ''),
    platforms: Array.isArray(raw.platforms) ? raw.platforms.map(String) : [],
    priceRange: {
      min: Number((raw.priceRange as Record<string, unknown>)?.min || 0),
      max: Number((raw.priceRange as Record<string, unknown>)?.max || 0),
    },
  };
}

function normalizeTrend(raw: Record<string, unknown>): Trend {
  return {
    name: String(raw.name || 'Unknown trend'),
    category: String(raw.category || 'general'),
    direction: (['rising', 'stable', 'declining'].includes(String(raw.direction))
      ? String(raw.direction)
      : 'stable') as Trend['direction'],
    strength: clamp(Number(raw.strength || 5), 1, 10),
    timeframe: String(raw.timeframe || 'current'),
    relatedKeywords: Array.isArray(raw.relatedKeywords) ? raw.relatedKeywords.map(String) : [],
    contentOpportunities: Array.isArray(raw.contentOpportunities) ? raw.contentOpportunities.map(String) : [],
    monetizationAngle: String(raw.monetizationAngle || ''),
    confidence: clamp(Number(raw.confidence || 0.5), 0, 1),
  };
}

function normalizeScenario(
  raw: Record<string, unknown> | undefined,
  audienceSize: number,
  defaultRate: number,
): RevenueEstimate['scenarios']['conservative'] {
  if (!raw) {
    const avgPrice = 47;
    const monthly = Math.round(audienceSize * defaultRate * avgPrice);
    return {
      monthly,
      annual: monthly * 12,
      conversionRate: defaultRate,
      averagePrice: avgPrice,
      assumptions: ['Based on industry average conversion rates'],
    };
  }
  return {
    monthly: Number(raw.monthly || 0),
    annual: Number(raw.annual || Number(raw.monthly || 0) * 12),
    conversionRate: Number(raw.conversionRate || defaultRate),
    averagePrice: Number(raw.averagePrice || 47),
    assumptions: Array.isArray(raw.assumptions) ? raw.assumptions.map(String) : [],
  };
}

function normalizeRevenueStream(
  raw: Record<string, unknown>,
): RevenueEstimate['revenueStreams'][number] {
  return {
    name: String(raw.name || 'Unknown'),
    type: String(raw.type || 'digital'),
    estimatedMonthly: Number(raw.estimatedMonthly || 0),
    effort: (['low', 'medium', 'high'].includes(String(raw.effort))
      ? String(raw.effort)
      : 'medium') as 'low' | 'medium' | 'high',
    timeToRevenue: String(raw.timeToRevenue || '1-3 months'),
  };
}

// ---- Default Factories ----

function defaultMarketSize(): MarketData['marketSize'] {
  return { total: 0, currency: 'USD', year: new Date().getFullYear(), addressable: 0, serviceable: 0 };
}

function defaultGrowthRate(): MarketData['growthRate'] {
  return { annual: 0, projected5Year: 0, trend: 'steady' };
}

function defaultCompetition(): MarketData['competition'] {
  return { level: 'moderate', numberOfPlayers: 0, dominantModel: 'Unknown', barrierToEntry: 'medium' };
}

function defaultAudience(): MarketData['audience'] {
  return {
    size: 0,
    demographics: { ageRange: '25-44', primaryGender: 'Mixed', incomeLevel: 'Middle', education: 'College' },
    psychographics: { values: [], painPoints: [], aspirations: [] },
    platforms: [],
  };
}

function defaultMonetization(): MarketData['monetization'] {
  return { averageCustomerValue: 0, averageOrderValue: 0, commonModels: [], pricingRange: { min: 0, max: 0 } };
}

function defaultSeasonality(): MarketData['seasonality'] {
  return { peakMonths: [], lowMonths: [], isEvergreen: true };
}

function defaultMilestones(): RevenueEstimate['milestones'] {
  return [
    { revenue: 1000, timeframe: '3-6 months', requirements: ['Launch product', 'Build initial audience'] },
    { revenue: 5000, timeframe: '6-12 months', requirements: ['Grow audience to 2,000+', 'Launch 2-3 products'] },
    { revenue: 10000, timeframe: '12-18 months', requirements: ['Audience of 5,000+', 'Diversified revenue streams'] },
    { revenue: 25000, timeframe: '18-24 months', requirements: ['Audience of 15,000+', 'Team/automation in place'] },
  ];
}

function createDefaultMarketData(niche: string): MarketData {
  return {
    niche,
    marketSize: defaultMarketSize(),
    growthRate: defaultGrowthRate(),
    competition: defaultCompetition(),
    audience: defaultAudience(),
    monetization: defaultMonetization(),
    seasonality: defaultSeasonality(),
    lastUpdated: new Date().toISOString(),
  };
}

function createDefaultCompetitorLandscape(niche: string): CompetitorLandscape {
  return {
    niche,
    totalCompetitors: 0,
    topCompetitors: [],
    marketGaps: ['Market analysis pending'],
    differentiationOpportunities: ['Analysis in progress'],
    competitiveAdvantages: [],
    entryStrategy: 'Requires further analysis',
  };
}

function createDefaultTrendReport(niche: string): TrendReport {
  return {
    niche,
    generatedAt: new Date().toISOString(),
    trends: [],
    emergingTopics: [],
    decliningTopics: [],
    contentGaps: [],
    predictedNextTrends: [],
  };
}

function createDefaultRevenueEstimate(niche: string, audienceSize: number): RevenueEstimate {
  const conservative = Math.round(audienceSize * 0.01 * 27);
  const moderate = Math.round(audienceSize * 0.025 * 47);
  const optimistic = Math.round(audienceSize * 0.05 * 97);

  return {
    niche,
    audienceSize,
    scenarios: {
      conservative: {
        monthly: conservative,
        annual: conservative * 12,
        conversionRate: 0.01,
        averagePrice: 27,
        assumptions: ['1% conversion rate', '$27 average product price', 'Single product'],
      },
      moderate: {
        monthly: moderate,
        annual: moderate * 12,
        conversionRate: 0.025,
        averagePrice: 47,
        assumptions: ['2.5% conversion rate', '$47 average product price', '2-3 products'],
      },
      optimistic: {
        monthly: optimistic,
        annual: optimistic * 12,
        conversionRate: 0.05,
        averagePrice: 97,
        assumptions: ['5% conversion rate', '$97 average product price', 'Full product suite'],
      },
    },
    revenueStreams: [
      { name: 'Digital Products', type: 'product', estimatedMonthly: Math.round(moderate * 0.4), effort: 'medium', timeToRevenue: '1-2 months' },
      { name: 'Online Courses', type: 'course', estimatedMonthly: Math.round(moderate * 0.3), effort: 'high', timeToRevenue: '2-4 months' },
      { name: 'Affiliate Revenue', type: 'affiliate', estimatedMonthly: Math.round(moderate * 0.15), effort: 'low', timeToRevenue: '1-3 months' },
      { name: 'Coaching/Consulting', type: 'service', estimatedMonthly: Math.round(moderate * 0.15), effort: 'high', timeToRevenue: '1 month' },
    ],
    milestones: defaultMilestones(),
  };
}
