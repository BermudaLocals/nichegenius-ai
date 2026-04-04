// ============================================
// NicheGenius AI - Knowledge Base / Vector Store
// Pinecone-powered semantic search for niche intelligence
// ============================================

import { Pinecone, type Index, type RecordMetadata } from '@pinecone-database/pinecone';
import { generateEmbedding, generateEmbeddings } from '@/lib/ai/engine';

// ---- Types ----

export interface KnowledgeEntry {
  id: string;
  content: string;
  title: string;
  category: string;
  subcategory?: string;
  namespace?: string;
  source?: string;
  sourceUrl?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  quality?: number;
}

export interface NicheData {
  nicheName: string;
  category: string;
  marketSize: string;
  growthRate: string;
  competitionLevel: string;
  demographics: Record<string, unknown>;
  keywords: string[];
  painPoints: string[];
  opportunities: string[];
  threats: string[];
  trendData: Record<string, unknown>;
  estimatedRevenue: {
    conservative: number;
    moderate: number;
    optimistic: number;
  };
  lastUpdated: string;
}

export interface MarketIntel {
  niche: string;
  region: string;
  marketSize: number;
  growthRate: number;
  topCompetitors: Array<{
    name: string;
    estimatedRevenue: number;
    marketShare: number;
  }>;
  trends: Array<{
    name: string;
    direction: 'rising' | 'stable' | 'declining';
    strength: number;
  }>;
  demographics: {
    ageRange: string;
    gender: string;
    income: string;
    interests: string[];
  };
  channels: Array<{
    name: string;
    effectiveness: number;
    costPerAcquisition: number;
  }>;
  lastUpdated: string;
}

export interface SearchResult {
  id: string;
  score: number;
  content: string;
  title: string;
  category: string;
  metadata: Record<string, unknown>;
}

export interface SearchFilters {
  category?: string;
  subcategory?: string;
  namespace?: string;
  tags?: string[];
  minQuality?: number;
  source?: string;
}

// ---- Error Class ----

export class VectorStoreError extends Error {
  operation: string;

  constructor(message: string, operation: string) {
    super(message);
    this.name = 'VectorStoreError';
    this.operation = operation;
  }
}

// ---- Pinecone Client Singleton ----

let _pinecone: Pinecone | null = null;
let _index: Index | null = null;

function getPinecone(): Pinecone {
  if (!_pinecone) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new VectorStoreError('PINECONE_API_KEY is not configured', 'init');
    }
    _pinecone = new Pinecone({ apiKey });
  }
  return _pinecone;
}

function getIndex(): Index {
  if (!_index) {
    const indexName = process.env.PINECONE_INDEX_NAME || 'nichegenius-knowledge';
    _index = getPinecone().index(indexName);
  }
  return _index;
}

function getNamespace(ns?: string): ReturnType<Index['namespace']> {
  const namespace = ns || process.env.PINECONE_NAMESPACE || 'niche-data';
  return getIndex().namespace(namespace);
}

// ---- Core Operations ----

/**
 * Upsert knowledge entries into the vector store.
 * Generates embeddings and stores with metadata.
 */
export async function upsertKnowledge(
  entries: KnowledgeEntry[],
  namespace?: string,
): Promise<{ upserted: number; failed: number; errors: string[] }> {
  const errors: string[] = [];
  let upserted = 0;
  let failed = 0;

  // Process in batches of 50
  const batchSize = 50;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);

    try {
      // Generate embeddings for the batch
      const texts = batch.map((e) => `${e.title}\n\n${e.content}`.slice(0, 8191));
      const embeddingResults = await generateEmbeddings(texts);

      // Build Pinecone vectors
      const vectors = batch.map((entry, idx) => ({
        id: entry.id,
        values: embeddingResults[idx].embedding,
        metadata: {
          title: entry.title,
          content: entry.content.slice(0, 10000),
          category: entry.category,
          subcategory: entry.subcategory || '',
          source: entry.source || '',
          sourceUrl: entry.sourceUrl || '',
          tags: entry.tags.join(','),
          quality: entry.quality ?? 0.5,
          ...entry.metadata,
        } satisfies RecordMetadata,
      }));

      await getNamespace(namespace).upsert(vectors);
      upserted += vectors.length;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      errors.push(`Batch ${Math.floor(i / batchSize)}: ${msg}`);
      failed += batch.length;
    }
  }

  return { upserted, failed, errors };
}

/**
 * Search the knowledge base with semantic similarity.
 */
export async function searchKnowledge(
  query: string,
  filters?: SearchFilters,
  topK: number = 10,
  namespace?: string,
): Promise<SearchResult[]> {
  try {
    const queryEmbedding = await generateEmbedding(query);

    // Build Pinecone filter
    const filter: Record<string, unknown> = {};
    if (filters?.category) filter.category = { $eq: filters.category };
    if (filters?.subcategory) filter.subcategory = { $eq: filters.subcategory };
    if (filters?.source) filter.source = { $eq: filters.source };
    if (filters?.minQuality) filter.quality = { $gte: filters.minQuality };
    if (filters?.tags && filters.tags.length > 0) {
      // Tags stored as comma-separated string; use $in for partial match
      filter.tags = { $in: filters.tags };
    }

    const results = await getNamespace(namespace).query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });

    return (
      results.matches?.map((match) => ({
        id: match.id,
        score: match.score ?? 0,
        content: (match.metadata?.content as string) || '',
        title: (match.metadata?.title as string) || '',
        category: (match.metadata?.category as string) || '',
        metadata: (match.metadata as Record<string, unknown>) || {},
      })) ?? []
    );
  } catch (error) {
    throw new VectorStoreError(
      `Search failed: ${error instanceof Error ? error.message : String(error)}`,
      'search',
    );
  }
}

/**
 * Get niche-specific data from the knowledge base.
 */
export async function getNicheData(
  nicheName: string,
  namespace?: string,
): Promise<NicheData | null> {
  const results = await searchKnowledge(
    `${nicheName} niche market data overview analysis`,
    { category: 'niche-profile' },
    5,
    namespace,
  );

  if (results.length === 0) return null;

  // Aggregate data from top results
  const topResult = results[0];
  const allMetadata = results.map((r) => r.metadata);

  return {
    nicheName,
    category: (topResult.metadata.category as string) || 'general',
    marketSize: (topResult.metadata.marketSize as string) || 'Unknown',
    growthRate: (topResult.metadata.growthRate as string) || 'Unknown',
    competitionLevel: (topResult.metadata.competitionLevel as string) || 'moderate',
    demographics: (topResult.metadata.demographics as Record<string, unknown>) || {},
    keywords: extractFieldFromResults(allMetadata, 'keywords'),
    painPoints: extractFieldFromResults(allMetadata, 'painPoints'),
    opportunities: extractFieldFromResults(allMetadata, 'opportunities'),
    threats: extractFieldFromResults(allMetadata, 'threats'),
    trendData: (topResult.metadata.trendData as Record<string, unknown>) || {},
    estimatedRevenue: {
      conservative: (topResult.metadata.revenueConservative as number) || 0,
      moderate: (topResult.metadata.revenueModerate as number) || 0,
      optimistic: (topResult.metadata.revenueOptimistic as number) || 0,
    },
    lastUpdated: (topResult.metadata.lastUpdated as string) || new Date().toISOString(),
  };
}

/**
 * Get market intelligence for a niche in a specific region.
 */
export async function getMarketIntelligence(
  niche: string,
  region: string = 'global',
  namespace?: string,
): Promise<MarketIntel | null> {
  const results = await searchKnowledge(
    `${niche} market intelligence ${region} competitors trends demographics`,
    { category: 'market-intel' },
    10,
    namespace,
  );

  if (results.length === 0) return null;

  const topResult = results[0];
  const allMetadata = results.map((r) => r.metadata);

  return {
    niche,
    region,
    marketSize: (topResult.metadata.marketSize as number) || 0,
    growthRate: (topResult.metadata.growthRate as number) || 0,
    topCompetitors: parseJsonField<MarketIntel['topCompetitors']>(
      topResult.metadata.topCompetitors,
      [],
    ),
    trends: parseJsonField<MarketIntel['trends']>(topResult.metadata.trends, []),
    demographics: parseJsonField<MarketIntel['demographics']>(
      topResult.metadata.demographics,
      { ageRange: '', gender: '', income: '', interests: [] },
    ),
    channels: parseJsonField<MarketIntel['channels']>(topResult.metadata.channels, []),
    lastUpdated: (topResult.metadata.lastUpdated as string) || new Date().toISOString(),
  };
}

// ---- Specialized Queries ----

/**
 * Find similar niches to a given niche.
 */
export async function findSimilarNiches(
  nicheName: string,
  topK: number = 5,
): Promise<SearchResult[]> {
  return searchKnowledge(
    `niches similar to ${nicheName} related markets adjacent opportunities`,
    { category: 'niche-profile' },
    topK,
  );
}

/**
 * Get product ideas for a niche.
 */
export async function getProductIdeas(
  nicheName: string,
  topK: number = 10,
): Promise<SearchResult[]> {
  return searchKnowledge(
    `${nicheName} product ideas digital products courses services`,
    { category: 'product-ideas' },
    topK,
  );
}

/**
 * Get content strategy data for a niche.
 */
export async function getContentStrategy(
  nicheName: string,
  topK: number = 10,
): Promise<SearchResult[]> {
  return searchKnowledge(
    `${nicheName} content strategy marketing social media SEO`,
    { category: 'content-strategy' },
    topK,
  );
}

/**
 * Search for scripts and copy templates.
 */
export async function getScriptTemplates(
  nicheName: string,
  scriptType: string,
  topK: number = 5,
): Promise<SearchResult[]> {
  return searchKnowledge(
    `${nicheName} ${scriptType} script template copy`,
    { category: 'scripts' },
    topK,
  );
}

// ---- Management Operations ----

/**
 * Delete entries from the vector store.
 */
export async function deleteEntries(
  ids: string[],
  namespace?: string,
): Promise<void> {
  try {
    await getNamespace(namespace).deleteMany(ids);
  } catch (error) {
    throw new VectorStoreError(
      `Delete failed: ${error instanceof Error ? error.message : String(error)}`,
      'delete',
    );
  }
}

/**
 * Delete all entries in a namespace.
 */
export async function clearNamespace(namespace?: string): Promise<void> {
  try {
    await getNamespace(namespace).deleteAll();
  } catch (error) {
    throw new VectorStoreError(
      `Clear namespace failed: ${error instanceof Error ? error.message : String(error)}`,
      'clear',
    );
  }
}

/**
 * Get index statistics.
 */
export async function getIndexStats(): Promise<{
  totalVectors: number;
  dimension: number;
  namespaces: Record<string, { vectorCount: number }>;
}> {
  try {
    const stats = await getIndex().describeIndexStats();
    return {
      totalVectors: stats.totalRecordCount ?? 0,
      dimension: stats.dimension ?? 1536,
      namespaces: Object.fromEntries(
        Object.entries(stats.namespaces ?? {}).map(([ns, data]) => [
          ns,
          { vectorCount: data.recordCount ?? 0 },
        ]),
      ),
    };
  } catch (error) {
    throw new VectorStoreError(
      `Stats failed: ${error instanceof Error ? error.message : String(error)}`,
      'stats',
    );
  }
}

/**
 * Check if the vector store is properly configured.
 */
export function isVectorStoreConfigured(): boolean {
  return !!(process.env.PINECONE_API_KEY && process.env.PINECONE_INDEX_NAME);
}

// ---- Internal Helpers ----

function extractFieldFromResults(
  metadataList: Record<string, unknown>[],
  field: string,
): string[] {
  const allValues = new Set<string>();

  for (const metadata of metadataList) {
    const value = metadata[field];
    if (typeof value === 'string') {
      value.split(',').forEach((v) => {
        const trimmed = v.trim();
        if (trimmed) allValues.add(trimmed);
      });
    } else if (Array.isArray(value)) {
      value.forEach((v) => {
        if (typeof v === 'string' && v.trim()) allValues.add(v.trim());
      });
    }
  }

  return Array.from(allValues);
}

function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'object') return value as T;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}
