// ============================================
// NicheGenius AI - Utility Functions
// ============================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ---- Class Name Merging ----

/**
 * Merge Tailwind CSS classes with clsx + tailwind-merge.
 * Handles conditional classes and deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ---- Formatters ----

/**
 * Format a number as currency.
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/**
 * Format a number with locale-specific separators.
 */
export function formatNumber(
  value: number,
  options?: {
    locale?: string;
    decimals?: number;
    compact?: boolean;
  },
): string {
  const { locale = 'en-US', decimals, compact = false } = options ?? {};

  if (compact) {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: decimals ?? 1,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 2,
  }).format(value);
}

/**
 * Format a date with various presets.
 */
export function formatDate(
  date: Date | string | number,
  style: 'short' | 'medium' | 'long' | 'relative' | 'iso' = 'medium',
  locale: string = 'en-US',
): string {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) return 'Invalid date';

  switch (style) {
    case 'short':
      return new Intl.DateTimeFormat(locale, {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      }).format(d);

    case 'medium':
      return new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(d);

    case 'long':
      return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(d);

    case 'relative': {
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHr = Math.round(diffMin / 60);
      const diffDay = Math.round(diffHr / 24);

      if (diffSec < 60) return 'just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHr < 24) return `${diffHr}h ago`;
      if (diffDay < 7) return `${diffDay}d ago`;
      if (diffDay < 30) return `${Math.round(diffDay / 7)}w ago`;
      if (diffDay < 365) return `${Math.round(diffDay / 30)}mo ago`;
      return `${Math.round(diffDay / 365)}y ago`;
    }

    case 'iso':
      return d.toISOString();

    default:
      return d.toLocaleDateString(locale);
  }
}

// ---- String Utilities ----

/**
 * Convert a string to a URL-safe slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncate(text: string, maxLength: number, suffix: string = '…'): string {
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength - suffix.length).trimEnd();
  return trimmed + suffix;
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Title case: capitalize first letter of each word.
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Strip HTML tags from a string.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// ---- Async Utilities ----

/**
 * Delay execution for a specified duration.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    onRetry?: (error: Error, attempt: number) => void;
  },
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 30000, onRetry } = options ?? {};
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delayMs = Math.min(
          baseDelay * Math.pow(2, attempt) + Math.random() * 500,
          maxDelay,
        );
        onRetry?.(lastError, attempt + 1);
        await delay(delayMs);
      }
    }
  }

  throw lastError;
}

// ---- ID Generation ----

/**
 * Generate a unique ID with optional prefix.
 * Uses crypto.randomUUID when available, falls back to timestamp + random.
 */
export function generateId(prefix?: string): string {
  let id: string;

  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    id = crypto.randomUUID();
  } else {
    id =
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 10);
  }

  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Generate a short, human-friendly ID (8 chars).
 */
export function shortId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// ---- Object Utilities ----

/**
 * Safely parse JSON with a fallback value.
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Deep clone an object using structured clone.
 */
export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Pick specified keys from an object.
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specified keys from an object.
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

// ---- Validation Utilities ----

/**
 * Check if a value is a valid email address.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Check if a value is a valid URL.
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ---- Math Utilities ----

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate percentage.
 */
export function percentage(value: number, total: number, decimals: number = 1): number {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(decimals));
}

/**
 * Linear interpolation between two values.
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Map a value from one range to another.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

// ---- Array Utilities ----

/**
 * Chunk an array into groups of specified size.
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Get unique values from an array.
 */
export function unique<T>(array: T[], keyFn?: (item: T) => unknown): T[] {
  if (!keyFn) return [...new Set(array)];

  const seen = new Set();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Shuffle an array (Fisher-Yates).
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Group array items by a key function.
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = keyFn(item);
      (groups[key] ??= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}
