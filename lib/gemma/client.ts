// ============================================
// NicheGenius AI - Google Gemma Client
// Fast local inference for niche analysis tasks
// Fallback to Gemini if Gemma unavailable
// ============================================

import { generateText, generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

// ---- Provider Setup ----

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

const PRIMARY_MODEL = process.env.GOOGLE_AI_MODEL || 'gemma-2-27b-it';
const FALLBACK_MODEL = 'gemini-1.5-flash';

// ---- Types ----

export interface NicheFitResult {
  overallFit: number;
  skillAlignment: number;
  passionMatch: number;
  experienceRelevance: number;
  marketViability: number;
  reasoning: string;
  strengths: string[];
  gaps: string[];
  recommendation: 'strong_fit' | 'good_fit' | 'moderate_fit' | 'weak_fit' | 'poor_fit';
}

export interface QuickInsight {
  summary: string;
  keyPoints: string[];
  opportunities: string[];
  risks: string[];
  actionItems: string[];
  confidence: number;
}

export interface ContentClassification {
  primaryCategory: string;
  secondaryCategories: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  tone: string;
  targetAudience: string;
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  topics: string[];
  confidence: number;
}

export interface KeywordResult {
  keywords: Array<{
    keyword: string;
    relevance: number;
    category: 'primary' | 'secondary' | 'long_tail';
    searchIntent: 'informational' | 'transactional' | 'navigational' | 'commercial';
  }>;
  mainTopic: string;
  relatedTopics: string[];
}

export interface UserProfile {
  skills: string[];
  passions: string[];
  experience: string;
  budget: string;
  timeCommitment: string;
  targetIncome: number;
  riskTolerance: string;
}

// ---- Error Handling ----

export class GemmaError extends Error {
  model: string;
  fallbackUsed: boolean;

  constructor(message: string, model: string, fallbackUsed: boolean = false) {
    super(message);
    this.name = 'GemmaError';
    this.model = model;
    this.fallbackUsed = fallbackUsed;
  }
}

// ---- Model Resolution with Fallback ----

async function withFallback<T>(fn: (modelId: string) => Promise<T>): Promise<T> {
  try {
    return await fn(PRIMARY_MODEL);
  } catch (primaryError) {
    console.warn(
      `[Gemma] Primary model ${PRIMARY_MODEL} failed: ${primaryError instanceof Error ? primaryError.message : String(primaryError)}. Falling back to ${FALLBACK_MODEL}...`,
    );

    try {
      return await fn(FALLBACK_MODEL);
    } catch (fallbackError) {
      throw new GemmaError(
        `Both ${PRIMARY_MODEL} and ${FALLBACK_MODEL} failed. Last error: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`,
        FALLBACK_MODEL,
        true,
      );
    }
  }
}

// ---- Core Functions ----

/**
 * Analyze niche-to-user fit with fast scoring.
 * Returns a detailed compatibility assessment.
 */
export async function analyzeNicheFit(
  userProfile: UserProfile,
  niche: { name: string; category: string; description?: string },
): Promise<NicheFitResult> {
  const schema = z.object({
    overallFit: z.number().min(0).max(100),
    skillAlignment: z.number().min(0).max(100),
    passionMatch: z.number().min(0).max(100),
    experienceRelevance: z.number().min(0).max(100),
    marketViability: z.number().min(0).max(100),
    reasoning: z.string(),
    strengths: z.array(z.string()),
    gaps: z.array(z.string()),
    recommendation: z.enum(['strong_fit', 'good_fit', 'moderate_fit', 'weak_fit', 'poor_fit']),
  });

  const result = await withFallback(async (modelId) => {
    return await generateObject({
      model: google(modelId),
      schema,
      schemaName: 'NicheFitAnalysis',
      schemaDescription: 'Analysis of how well a niche matches a user profile',
      messages: [
        {
          role: 'system',
          content:
            'You are a niche-fit analyst. Score the compatibility between a user profile and a niche opportunity. Be precise with scores (0-100) and specific with reasoning. Evaluate skill alignment, passion match, experience relevance, and market viability.',
        },
        {
          role: 'user',
          content: `Analyze the fit between this user and niche:

## User Profile
- Skills: ${userProfile.skills.join(', ')}
- Passions: ${userProfile.passions.join(', ')}
- Experience: ${userProfile.experience}
- Budget: ${userProfile.budget}
- Time: ${userProfile.timeCommitment}
- Target Income: $${userProfile.targetIncome}/month
- Risk Tolerance: ${userProfile.riskTolerance}

## Niche
- Name: ${niche.name}
- Category: ${niche.category}
${niche.description ? `- Description: ${niche.description}` : ''}

Provide scores (0-100) for each dimension and an overall fit assessment.`,
        },
      ],
      temperature: 0.4,
      maxTokens: 1024,
    });
  });

  return result.object;
}

/**
 * Generate quick insights on a topic.
 * Optimized for speed — returns structured analysis in seconds.
 */
export async function generateQuickInsight(topic: string): Promise<QuickInsight> {
  const schema = z.object({
    summary: z.string(),
    keyPoints: z.array(z.string()),
    opportunities: z.array(z.string()),
    risks: z.array(z.string()),
    actionItems: z.array(z.string()),
    confidence: z.number().min(0).max(100),
  });

  const result = await withFallback(async (modelId) => {
    return await generateObject({
      model: google(modelId),
      schema,
      schemaName: 'QuickInsight',
      schemaDescription: 'Rapid analysis of a business topic',
      messages: [
        {
          role: 'system',
          content:
            'You are a rapid business analyst. Provide concise, actionable insights on any business topic. Focus on opportunities and practical next steps. Be specific with recommendations.',
        },
        {
          role: 'user',
          content: `Provide quick business insights on: ${topic}

Include:
- Brief summary (2-3 sentences)
- 3-5 key points
- 2-3 opportunities
- 2-3 risks
- 3-5 actionable items
- Confidence score (0-100)`,
        },
      ],
      temperature: 0.5,
      maxTokens: 1024,
    });
  });

  return result.object;
}

/**
 * Classify content by category, sentiment, and characteristics.
 * Useful for organizing knowledge base entries.
 */
export async function classifyContent(content: string): Promise<ContentClassification> {
  const schema = z.object({
    primaryCategory: z.string(),
    secondaryCategories: z.array(z.string()),
    sentiment: z.enum(['positive', 'negative', 'neutral', 'mixed']),
    tone: z.string(),
    targetAudience: z.string(),
    complexity: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    topics: z.array(z.string()),
    confidence: z.number().min(0).max(100),
  });

  const truncated = content.length > 3000 ? content.slice(0, 3000) + '...' : content;

  const result = await withFallback(async (modelId) => {
    return await generateObject({
      model: google(modelId),
      schema,
      schemaName: 'ContentClassification',
      schemaDescription: 'Classification of content characteristics',
      messages: [
        {
          role: 'system',
          content:
            'You are a content classifier. Analyze the provided content and classify it by category, sentiment, tone, target audience, complexity level, and extract key topics. Be precise and consistent in your classifications.',
        },
        {
          role: 'user',
          content: `Classify this content:

---
${truncated}
---

Provide detailed classification with confidence score.`,
        },
      ],
      temperature: 0.3,
      maxTokens: 512,
    });
  });

  return result.object;
}

/**
 * Extract keywords and topics from text.
 * Returns categorized keywords with relevance scores.
 */
export async function extractKeywords(text: string): Promise<KeywordResult> {
  const schema = z.object({
    keywords: z.array(
      z.object({
        keyword: z.string(),
        relevance: z.number().min(0).max(100),
        category: z.enum(['primary', 'secondary', 'long_tail']),
        searchIntent: z.enum(['informational', 'transactional', 'navigational', 'commercial']),
      }),
    ),
    mainTopic: z.string(),
    relatedTopics: z.array(z.string()),
  });

  const truncated = text.length > 3000 ? text.slice(0, 3000) + '...' : text;

  const result = await withFallback(async (modelId) => {
    return await generateObject({
      model: google(modelId),
      schema,
      schemaName: 'KeywordExtraction',
      schemaDescription: 'Keywords and topics extracted from text',
      messages: [
        {
          role: 'system',
          content:
            'You are an SEO and keyword analysis specialist. Extract relevant keywords from text content, categorize them by importance and search intent, and identify the main topic and related topics. Focus on commercially valuable keywords.',
        },
        {
          role: 'user',
          content: `Extract keywords from this text:

---
${truncated}
---

Provide:
- 10-20 keywords with relevance scores, category (primary/secondary/long_tail), and search intent
- Main topic identification
- 5-10 related topics`,
        },
      ],
      temperature: 0.3,
      maxTokens: 1024,
    });
  });

  return result.object;
}

/**
 * Quick text generation for simple tasks.
 */
export async function quickGenerate(
  prompt: string,
  options?: { temperature?: number; maxTokens?: number },
): Promise<string> {
  const result = await withFallback(async (modelId) => {
    return await generateText({
      model: google(modelId),
      messages: [
        { role: 'user', content: prompt },
      ],
      temperature: options?.temperature ?? 0.6,
      maxTokens: options?.maxTokens ?? 1024,
    });
  });

  return result.text;
}

/**
 * Batch analyze multiple niches against a user profile.
 * Returns sorted results by fit score.
 */
export async function batchAnalyzeNiches(
  userProfile: UserProfile,
  niches: Array<{ name: string; category: string; description?: string }>,
): Promise<Array<NicheFitResult & { nicheName: string }>> {
  const results = await Promise.allSettled(
    niches.map(async (niche) => {
      const fit = await analyzeNicheFit(userProfile, niche);
      return { ...fit, nicheName: niche.name };
    }),
  );

  return results
    .filter((r): r is PromiseFulfilledResult<NicheFitResult & { nicheName: string }> =>
      r.status === 'fulfilled',
    )
    .map((r) => r.value)
    .sort((a, b) => b.overallFit - a.overallFit);
}

/**
 * Check if Gemma/Google AI is properly configured.
 */
export function isGemmaConfigured(): boolean {
  return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
}

/**
 * Get current model information.
 */
export function getModelInfo(): { primary: string; fallback: string; configured: boolean } {
  return {
    primary: PRIMARY_MODEL,
    fallback: FALLBACK_MODEL,
    configured: isGemmaConfigured(),
  };
}
