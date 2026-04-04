/**
 * Content Obfuscation Module
 * Encodes/decodes content for transit to prevent static HTML scraping.
 * Uses ROT13 + Base64 double encoding with fragment reassembly.
 */

// ─── ROT13 Cipher ────────────────────────────────────────────────────────────
function rot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

// ─── Base64 helpers (works in both Node and browser) ─────────────────────────
function toBase64(str: string): string {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
  return Buffer.from(str, 'utf-8').toString('base64');
}

function fromBase64(b64: string): string {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return decodeURIComponent(escape(window.atob(b64)));
  }
  return Buffer.from(b64, 'base64').toString('utf-8');
}

// ─── Double Encode: ROT13 → Base64 ──────────────────────────────────────────
export function encode(text: string): string {
  const rotated = rot13(text);
  return toBase64(rotated);
}

// ─── Double Decode: Base64 → ROT13 ──────────────────────────────────────────
export function decode(encoded: string): string {
  const rotated = fromBase64(encoded);
  return rot13(rotated);
}

// ─── Fragment Interface ──────────────────────────────────────────────────────
export interface ContentFragment {
  id: string;
  index: number;
  data: string;        // encoded chunk
  checksum: number;    // simple hash for integrity
}

// ─── Simple checksum for integrity verification ──────────────────────────────
function simpleChecksum(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

// ─── Generate crypto-safe random ID ──────────────────────────────────────────
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `frag_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

// ─── Fragmentize: split content into encoded chunks ──────────────────────────
export function fragmentize(
  content: string,
  chunkCount: number = 5,
): ContentFragment[] {
  const chunkSize = Math.ceil(content.length / chunkCount);
  const fragments: ContentFragment[] = [];

  for (let i = 0; i < chunkCount; i++) {
    const start = i * chunkSize;
    const chunk = content.slice(start, start + chunkSize);
    if (chunk.length === 0) continue;

    const encodedData = encode(chunk);
    fragments.push({
      id: generateId(),
      index: i,
      data: encodedData,
      checksum: simpleChecksum(chunk),
    });
  }

  // Shuffle fragments so order isn't obvious in transit
  return fragments.sort(() => Math.random() - 0.5);
}

// ─── Reassemble: decode and join fragments in order ──────────────────────────
export function reassemble(fragments: ContentFragment[]): string {
  const sorted = [...fragments].sort((a, b) => a.index - b.index);
  const parts: string[] = [];

  for (const fragment of sorted) {
    const decoded = decode(fragment.data);
    const checksum = simpleChecksum(decoded);

    if (checksum !== fragment.checksum) {
      console.warn(`Fragment ${fragment.id} integrity check failed`);
    }

    parts.push(decoded);
  }

  return parts.join('');
}

// ─── Convenience: encode an object for API transit ───────────────────────────
export function encodePayload<T>(payload: T): string {
  return encode(JSON.stringify(payload));
}

// ─── Convenience: decode an object from API transit ──────────────────────────
export function decodePayload<T>(encoded: string): T {
  return JSON.parse(decode(encoded)) as T;
}
