/**
 * Invisible Watermarking Module
 * Embeds traceable, invisible watermarks into text and visual elements.
 * Uses zero-width Unicode characters for text and canvas overlays for screenshots.
 */

// ─── Zero-Width Character Mapping ────────────────────────────────────────────
// We encode binary data using 4 invisible Unicode characters:
const ZW_CHARS = {
  '0': '\u200B', // Zero-width space
  '1': '\u200C', // Zero-width non-joiner
  S: '\u200D',   // Zero-width joiner (separator)
  E: '\uFEFF',   // BOM / zero-width no-break space (end marker)
} as const;

// ─── Binary Encoding Helpers ─────────────────────────────────────────────────
function textToBinary(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join('');
}

function binaryToText(binary: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    if (byte.length === 8) {
      bytes.push(parseInt(byte, 2));
    }
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// ─── Encode payload into zero-width characters ───────────────────────────────
function encodeToZeroWidth(payload: string): string {
  const binary = textToBinary(payload);
  let encoded = ZW_CHARS.S; // Start marker
  for (const bit of binary) {
    encoded += ZW_CHARS[bit as '0' | '1'];
  }
  encoded += ZW_CHARS.E; // End marker
  return encoded;
}

// ─── Decode zero-width characters back to payload ────────────────────────────
function decodeFromZeroWidth(text: string): string | null {
  try {
    // Extract zero-width characters
    const zwRegex = /[\u200B\u200C\u200D\uFEFF]/g;
    const zwChars = text.match(zwRegex);
    if (!zwChars) return null;

    // Find start and end markers
    const startIdx = zwChars.indexOf(ZW_CHARS.S);
    const endIdx = zwChars.lastIndexOf(ZW_CHARS.E);
    if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) return null;

    // Decode binary
    let binary = '';
    for (let i = startIdx + 1; i < endIdx; i++) {
      if (zwChars[i] === ZW_CHARS['0']) binary += '0';
      else if (zwChars[i] === ZW_CHARS['1']) binary += '1';
    }

    return binaryToText(binary);
  } catch {
    return null;
  }
}

// ─── Watermark Payload ───────────────────────────────────────────────────────
interface WatermarkPayload {
  t: number;   // timestamp
  s: string;   // session ID (truncated)
  f: string;   // fingerprint hash (truncated)
  v: number;   // version
}

function createPayload(userId: string): string {
  const payload: WatermarkPayload = {
    t: Date.now(),
    s: userId.slice(0, 12),
    f: userId.slice(-8),
    v: 1,
  };
  return JSON.stringify(payload);
}

// ─── Text Watermarking ───────────────────────────────────────────────────────

/**
 * Add invisible zero-width watermark to text content.
 * The watermark is distributed throughout the text to survive partial copying.
 * @param text - The visible text to watermark
 * @param userId - User/session identifier to embed
 * @returns Watermarked text (visually identical)
 */
export function addTextWatermark(text: string, userId: string): string {
  const payload = createPayload(userId);
  const encoded = encodeToZeroWidth(payload);

  // Strategy: insert watermark fragments at word boundaries
  // This way partial copies still contain traceable fragments
  const words = text.split(' ');
  if (words.length < 2) {
    return text + encoded;
  }

  // Split encoded watermark into chunks and distribute
  const chunkSize = Math.ceil(encoded.length / Math.min(words.length - 1, 5));
  const chunks: string[] = [];
  for (let i = 0; i < encoded.length; i += chunkSize) {
    chunks.push(encoded.slice(i, i + chunkSize));
  }

  // Insert chunks at evenly spaced word boundaries
  const result: string[] = [];
  const insertionPoints = chunks.map((_, i) =>
    Math.floor(((i + 1) / (chunks.length + 1)) * words.length),
  );

  let chunkIdx = 0;
  for (let i = 0; i < words.length; i++) {
    result.push(words[i]);
    if (chunkIdx < insertionPoints.length && i === insertionPoints[chunkIdx]) {
      result.push(chunks[chunkIdx]);
      chunkIdx++;
    }
  }

  // Append remaining chunks at end
  while (chunkIdx < chunks.length) {
    result.push(chunks[chunkIdx]);
    chunkIdx++;
  }

  return result.join(' ');
}

/**
 * Extract watermark data from text (for tracing copied content).
 * @param text - Text that may contain a watermark
 * @returns Decoded watermark payload or null
 */
export function extractTextWatermark(text: string): WatermarkPayload | null {
  const decoded = decodeFromZeroWidth(text);
  if (!decoded) return null;

  try {
    return JSON.parse(decoded) as WatermarkPayload;
  } catch {
    return null;
  }
}

/**
 * Remove watermark from text (utility for internal use).
 */
export function stripWatermark(text: string): string {
  return text.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
}

// ─── Visual (Canvas) Watermarking ────────────────────────────────────────────

/**
 * Add invisible canvas-based watermark to a DOM element.
 * Creates a near-invisible overlay that appears in screenshots.
 * @param element - DOM element to watermark
 * @param userId - User/session identifier to embed
 */
export function addVisualWatermark(
  element: HTMLElement,
  userId: string,
): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;

  try {
    const rect = element.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.003;
      z-index: 9999;
      mix-blend-mode: multiply;
    `;
    canvas.setAttribute('data-ng-wm', '1');
    canvas.setAttribute('aria-hidden', 'true');

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const payload = `NG|${userId.slice(0, 16)}|${Date.now()}`;

    // Draw repeating pattern of the payload
    ctx.fillStyle = 'rgba(128, 128, 128, 1)';
    ctx.font = '10px monospace';

    const lineHeight = 14;
    const textWidth = ctx.measureText(payload).width + 20;

    for (let y = 0; y < canvas.height; y += lineHeight) {
      for (let x = 0; x < canvas.width; x += textWidth) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.3); // Slight angle for pattern disruption
        ctx.fillText(payload, 0, 0);
        ctx.restore();
      }
    }

    // Ensure parent is positioned for overlay
    const position = window.getComputedStyle(element).position;
    if (position === 'static') {
      element.style.position = 'relative';
    }

    element.appendChild(canvas);
    return canvas;
  } catch {
    return null;
  }
}

/**
 * Add a DOM-based invisible watermark (alternative to canvas).
 * Uses CSS to create patterns that are invisible normally but appear
 * when the page is saved, printed, or screenshotted with certain tools.
 */
export function addDOMWatermark(
  container: HTMLElement,
  userId: string,
): HTMLDivElement | null {
  if (typeof document === 'undefined') return null;

  try {
    const watermark = document.createElement('div');
    const payload = `NicheGenius-${userId.slice(0, 16)}-${Date.now()}`;

    watermark.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99999;
      opacity: 0;
      font-size: 1px;
      color: rgba(0, 0, 0, 0.001);
      overflow: hidden;
      user-select: none;
    `;
    watermark.setAttribute('data-ng-dwm', '1');
    watermark.setAttribute('aria-hidden', 'true');

    // Fill with traceable content that goes with "Save As"
    const content = Array(100).fill(payload).join(' ');
    watermark.textContent = content;

    // Add as print-visible watermark via @media print
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        [data-ng-dwm] {
          opacity: 0.15 !important;
          font-size: 8px !important;
          color: rgba(0, 0, 0, 0.3) !important;
        }
      }
    `;

    container.appendChild(style);
    container.appendChild(watermark);
    return watermark;
  } catch {
    return null;
  }
}
