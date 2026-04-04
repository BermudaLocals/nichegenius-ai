// ============================================
// NicheGenius AI - Multi-Model AI Engine
// Routes between GPT-4o, Gemma 2, and Claude
// ============================================

import { generateText, generateObject, streamText, CoreMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { z, ZodType } from 'zod';

// ---- Provider Initialization ----

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// ---- Types ----

export type AIProviderName = 'openai' | 'google' | 'anthropic';

export type TaskType =
  | 'niche_analysis'
  | 'market_research'
  | 'blueprint_generation'
  | 'product_ideation'
  | 'sales_copy'
  | 'content_strategy'
  | 'competitor_analysis'
  | 'trend_analysis'
  | 'script_writing'
  | 'general';

export interface AIEngineConfig {
  provider?: AIProviderName;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AIEngineRequest {
  task: TaskType;
  prompt: string;
  systemPrompt?: string;
  messages?: CoreMessage[];
  config?: AIEngineConfig;
}

export interface AIEngineResponse {
  text: string;
  provider: AIProviderName;
  model: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  latencyMs: number;
  finishReason: string;
}

export interface AIStructuredRequest<T> extends AIEngineRequest {
  schema: ZodType<T>;
  schemaName?: string;
  schemaDescription?: string;
}

// ---- Task-to-Provider Routing Map ----
// Optimized routing based on each model's strengths

const TASK_ROUTING: Record<TaskType, { provider: AIProviderName; model: string; temperature: number }> = {
  niche_analysis: {
    provider: 'openai',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    temperature: 0.7,
  },
  market_research: {
    provider: 'anthropic',
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    temperature: 0.5,
  },
  blueprint_generation: {
    provider: 'anthropic',
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    temperature: 0.6,
  },
  product_ideation: {
    provider: 'openai',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    temperature: 0.8,
  },
  sales_copy: {
    provider: 'openai',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    temperature: 0.75,
  },
  content_strategy: {
    provider: 'anthropic',
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    temperature: 0.6,
  },
  competitor_analysis: {
    provider: 'anthropic',
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    temperature: 0.4,
  },
  trend_analysis: {
    provider: 'google',
    model: process.env.GOOGLE_AI_MODEL || 'gemma-2-27b-it',
    temperature: 0.5,
  },
  script_writing: {
    provider: 'openai',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    temperature: 0.7,
  },
  general: {
    provider: 'openai',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    temperature: 0.7,
  },
};

// ---- Model Resolution ----

function getModel(provider: AIProviderName, modelId: string) {
  switch (provider) {
    case 'openai':
      return openai(modelId);
    case 'google':
      return google(modelId);
    case 'anthropic':
      return anthropic(modelId);
    default:
      throw new AIEngineError(`Unknown AI provider: ${provider}`, 'INVALID_PROVIDER');
  }
}

function resolveConfig(task: TaskType, config?: AIEngineConfig) {
  const defaults = TASK_ROUTING[task] || TASK_ROUTING.general;
  return {
    provider: config?.provider || defaults.provider,
    model: config?.model || defaults.model,
    temperature: config?.temperature ?? defaults.temperature,
    maxTokens: config?.maxTokens ?? 4096,
    topP: config?.topP ?? 0.95,
    frequencyPenalty: config?.frequencyPenalty ?? 0,
    presencePenalty: config?.presencePenalty ?? 0,
  };
}

// ---- Custom Error Class ----

export class AIEngineError extends Error {
  code: string;
  provider?: AIProviderName;
  statusCode?: number;

  constructor(message: string, code: string, provider?: AIProviderName, statusCode?: number) {
    super(message);
    this.name = 'AIEngineError';
    this.code = code;
    this.provider = provider;
    this.statusCode = statusCode;
  }
}

// ---- Retry Logic with Exponential Backoff ----

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on auth errors or invalid requests
      if (lastError.message.includes('401') || lastError.message.includes('400')) {
        throw lastError;
      }

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500;
        console.warn(
          `[AIEngine] Attempt ${attempt + 1}/${maxRetries + 1} failed: ${lastError.message}. Retrying in ${Math.round(delay)}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// ---- Fallback Chain ----
// If primary provider fails, try alternates

const FALLBACK_CHAIN: Record<AIProviderName, AIProviderName[]> = {
  openai: ['anthropic', 'google'],
  anthropic: ['openai', 'google'],
  google: ['openai', 'anthropic'],
};

const FALLBACK_MODELS: Record<AIProviderName, string> = {
  openai: process.env.OPENAI_MODEL || 'gpt-4o',
  anthropic: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
  google: process.env.GOOGLE_AI_MODEL || 'gemma-2-27b-it',
};

// ---- Core Engine Functions ----

/**
 * Generate text using the multi-model AI engine.
 * Automatically routes to the best provider based on task type.
 * Includes retry logic and provider fallback.
 */
export async function generate(request: AIEngineRequest): Promise<AIEngineResponse> {
  const resolved = resolveConfig(request.task, request.config);
  const startTime = Date.now();

  const providers: Array<{ provider: AIProviderName; model: string }> = [
    { provider: resolved.provider, model: resolved.model },
    ...FALLBACK_CHAIN[resolved.provider].map((p) => ({
      provider: p,
      model: FALLBACK_MODELS[p],
    })),
  ];

  let lastError: Error | undefined;

  for (const { provider, model } of providers) {
    try {
      const result = await withRetry(async () => {
        const aiModel = getModel(provider, model);

        const messages: CoreMessage[] = request.messages || [
          ...(request.systemPrompt
            ? [{ role: 'system' as const, content: request.systemPrompt }]
            : []),
          { role: 'user' as const, content: request.prompt },
        ];

        return await generateText({
          model: aiModel,
          messages,
          temperature: resolved.temperature,
          maxTokens: resolved.maxTokens,
          topP: resolved.topP,
          frequencyPenalty: provider === 'openai' ? resolved.frequencyPenalty : undefined,
          presencePenalty: provider === 'openai' ? resolved.presencePenalty : undefined,
        });
      });

      const latencyMs = Date.now() - startTime;

      return {
        text: result.text,
        provider,
        model,
        tokensUsed: {
          prompt: result.usage?.promptTokens ?? 0,
          completion: result.usage?.completionTokens ?? 0,
          total: result.usage?.totalTokens ?? 0,
        },
        latencyMs,
        finishReason: result.finishReason || 'stop',
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[AIEngine] Provider ${provider}/${model} failed: ${lastError.message}`);
    }
  }

  throw new AIEngineError(
    `All AI providers failed. Last error: ${lastError?.message}`,
    'ALL_PROVIDERS_FAILED',
  );
}

/**
 * Generate structured output conforming to a Zod schema.
 * Uses the AI SDK's generateObject for type-safe results.
 */
export async function generateStructured<T>(
  request: AIStructuredRequest<T>,
): Promise<{ data: T; meta: Omit<AIEngineResponse, 'text'> }> {
  const resolved = resolveConfig(request.task, request.config);
  const startTime = Date.now();

  const providers: Array<{ provider: AIProviderName; model: string }> = [
    { provider: resolved.provider, model: resolved.model },
    ...FALLBACK_CHAIN[resolved.provider].map((p) => ({
      provider: p,
      model: FALLBACK_MODELS[p],
    })),
  ];

  let lastError: Error | undefined;

  for (const { provider, model } of providers) {
    try {
      const result = await withRetry(async () => {
        const aiModel = getModel(provider, model);

        const messages: CoreMessage[] = request.messages || [
          ...(request.systemPrompt
            ? [{ role: 'system' as const, content: request.systemPrompt }]
            : []),
          { role: 'user' as const, content: request.prompt },
        ];

        return await generateObject({
          model: aiModel,
          schema: request.schema as ZodType<T>,
          schemaName: request.schemaName,
          schemaDescription: request.schemaDescription,
          messages,
          temperature: resolved.temperature,
          maxTokens: resolved.maxTokens,
        });
      });

      const latencyMs = Date.now() - startTime;

      return {
        data: result.object as T,
        meta: {
          provider,
          model,
          tokensUsed: {
            prompt: result.usage?.promptTokens ?? 0,
            completion: result.usage?.completionTokens ?? 0,
            total: result.usage?.totalTokens ?? 0,
          },
          latencyMs,
          finishReason: result.finishReason || 'stop',
        },
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[AIEngine] Structured generation failed with ${provider}/${model}: ${lastError.message}`);
    }
  }

  throw new AIEngineError(
    `Structured generation failed across all providers. Last error: ${lastError?.message}`,
    'STRUCTURED_GEN_FAILED',
  );
}

/**
 * Stream text responses for real-time UI updates.
 * Returns a ReadableStream compatible with Next.js streaming responses.
 */
export async function stream(request: AIEngineRequest) {
  const resolved = resolveConfig(request.task, request.config);
  const aiModel = getModel(resolved.provider, resolved.model);

  const messages: CoreMessage[] = request.messages || [
    ...(request.systemPrompt
      ? [{ role: 'system' as const, content: request.systemPrompt }]
      : []),
    { role: 'user' as const, content: request.prompt },
  ];

  const result = streamText({
    model: aiModel,
    messages,
    temperature: resolved.temperature,
    maxTokens: resolved.maxTokens,
    topP: resolved.topP,
  });

  return result;
}

/**
 * Generate embeddings for vector search (Pinecone).
 * Always uses OpenAI's embedding model.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: embeddingModel,
        input: text.slice(0, 8191), // Max input length
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new AIEngineError(
        `Embedding generation failed: ${response.status} ${errorBody}`,
        'EMBEDDING_FAILED',
        'openai',
        response.status,
      );
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    if (error instanceof AIEngineError) throw error;
    throw new AIEngineError(
      `Embedding generation error: ${error instanceof Error ? error.message : String(error)}`,
      'EMBEDDING_ERROR',
      'openai',
    );
  }
}

/**
 * Batch generate embeddings for multiple texts.
 */
export async function generateEmbeddings(
  texts: string[],
): Promise<Array<{ text: string; embedding: number[] }>> {
  const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
  const batchSize = 100;
  const results: Array<{ text: string; embedding: number[] }> = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: embeddingModel,
        input: batch.map((t) => t.slice(0, 8191)),
      }),
    });

    if (!response.ok) {
      throw new AIEngineError(
        `Batch embedding failed: ${response.status}`,
        'BATCH_EMBEDDING_FAILED',
        'openai',
        response.status,
      );
    }

    const data = await response.json();

    for (let j = 0; j < data.data.length; j++) {
      results.push({
        text: batch[j],
        embedding: data.data[j].embedding,
      });
    }
  }

  return results;
}

/**
 * Quick helper: one-shot text generation with a simple prompt.
 */
export async function quickGenerate(
  prompt: string,
  task: TaskType = 'general',
  systemPrompt?: string,
): Promise<string> {
  const response = await generate({ task, prompt, systemPrompt });
  return response.text;
}

/**
 * Quick helper: one-shot structured generation.
 */
export async function quickStructured<T>(
  prompt: string,
  schema: ZodType<T>,
  task: TaskType = 'general',
  systemPrompt?: string,
): Promise<T> {
  const response = await generateStructured<T>({
    task,
    prompt,
    systemPrompt,
    schema,
  });
  return response.data;
}

/**
 * Get available providers and their status.
 */
export function getProviderStatus(): Record<AIProviderName, { configured: boolean; model: string }> {
  return {
    openai: {
      configured: !!process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o',
    },
    google: {
      configured: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      model: process.env.GOOGLE_AI_MODEL || 'gemma-2-27b-it',
    },
    anthropic: {
      configured: !!process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    },
  };
}

/**
 * Estimate token count for a text (rough approximation).
 * ~4 characters per token for English text.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Calculate cost estimate for a generation.
 * Prices per 1M tokens (approximate, as of early 2025).
 */
export function estimateCost(
  provider: AIProviderName,
  promptTokens: number,
  completionTokens: number,
): number {
  const pricing: Record<AIProviderName, { input: number; output: number }> = {
    openai: { input: 2.5, output: 10.0 }, // GPT-4o pricing per 1M tokens
    google: { input: 0.15, output: 0.6 }, // Gemma 2 pricing per 1M tokens
    anthropic: { input: 3.0, output: 15.0 }, // Claude 3.5 Sonnet pricing per 1M tokens
  };

  const rates = pricing[provider];
  const inputCost = (promptTokens / 1_000_000) * rates.input;
  const outputCost = (completionTokens / 1_000_000) * rates.output;

  return Math.round((inputCost + outputCost) * 10000) / 10000; // Round to 4 decimal places
}
