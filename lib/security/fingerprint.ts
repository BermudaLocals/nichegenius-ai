/**
 * Browser Fingerprinting Module
 * Generates unique browser fingerprints for session tracking and anti-scraping.
 * Works entirely client-side — no external dependencies.
 */

// ─── Types ───────────────────────────────────────────────────────────────────
export interface BrowserFingerprint {
  canvas: string;
  webgl: string;
  audio: string;
  screen: string;
  timezone: string;
  language: string;
  plugins: string;
  fonts: string;
  hardware: string;
  platform: string;
}

export interface FingerprintResult {
  hash: string;
  components: BrowserFingerprint;
  sessionId: string;
  timestamp: number;
}

// ─── Hashing (FNV-1a for speed, SHA-256 when available) ──────────────────────
async function sha256(message: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback: FNV-1a 32-bit
  return fnv1a(message);
}

function fnv1a(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

// ─── Canvas Fingerprint ──────────────────────────────────────────────────────
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';

    // Draw unique pattern
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('NicheGenius 🦊', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('fingerprint', 4, 45);

    // Arc + gradient for GPU-level uniqueness
    ctx.beginPath();
    ctx.arc(50, 80, 30, 0, Math.PI * 2);
    const gradient = ctx.createLinearGradient(0, 0, 256, 128);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(1, '#0000ff');
    ctx.fillStyle = gradient;
    ctx.fill();

    return canvas.toDataURL();
  } catch {
    return 'canvas-error';
  }
}

// ─── WebGL Fingerprint ───────────────────────────────────────────────────────
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl || !(gl instanceof WebGLRenderingContext)) return 'no-webgl';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : 'unknown';
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : 'unknown';

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    const extensions = (gl.getSupportedExtensions() || []).join(',');

    return `${vendor}|${renderer}|${maxTextureSize}|${maxVertexAttribs}|${extensions.length}`;
  } catch {
    return 'webgl-error';
  }
}

// ─── Audio Fingerprint ───────────────────────────────────────────────────────
function getAudioFingerprint(): Promise<string> {
  return new Promise((resolve) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) {
        resolve('no-audio');
        return;
      }

      const context = new AudioCtx();
      const oscillator = context.createOscillator();
      const analyser = context.createAnalyser();
      const gain = context.createGain();
      const processor = context.createScriptProcessor(4096, 1, 1);

      gain.gain.value = 0; // Silent
      oscillator.type = 'triangle';
      oscillator.frequency.value = 10000;

      oscillator.connect(analyser);
      analyser.connect(processor);
      processor.connect(gain);
      gain.connect(context.destination);

      oscillator.start(0);

      const fingerprint: number[] = [];
      processor.onaudioprocess = (event) => {
        const data = event.inputBuffer.getChannelData(0);
        for (let i = 0; i < Math.min(data.length, 20); i++) {
          fingerprint.push(data[i]);
        }

        oscillator.stop();
        processor.disconnect();
        context.close();
        resolve(fingerprint.slice(0, 10).join(','));
      };

      // Timeout fallback
      setTimeout(() => {
        try {
          oscillator.stop();
          context.close();
        } catch { /* ignore */ }
        resolve('audio-timeout');
      }, 1000);
    } catch {
      resolve('audio-error');
    }
  });
}

// ─── Font Detection ──────────────────────────────────────────────────────────
function getFontFingerprint(): string {
  const testFonts = [
    'Arial', 'Courier New', 'Georgia', 'Helvetica', 'Times New Roman',
    'Trebuchet MS', 'Verdana', 'Comic Sans MS', 'Impact', 'Lucida Console',
    'Palatino', 'Garamond', 'Bookman', 'Tahoma', 'Lucida Sans',
  ];

  const baseFonts = ['monospace', 'serif', 'sans-serif'];
  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'no-font-ctx';

  const baseWidths: Record<string, number> = {};
  for (const base of baseFonts) {
    ctx.font = `${testSize} ${base}`;
    baseWidths[base] = ctx.measureText(testString).width;
  }

  const detected: string[] = [];
  for (const font of testFonts) {
    for (const base of baseFonts) {
      ctx.font = `${testSize} '${font}', ${base}`;
      const width = ctx.measureText(testString).width;
      if (width !== baseWidths[base]) {
        detected.push(font);
        break;
      }
    }
  }

  return detected.join(',');
}

// ─── Screen Fingerprint ──────────────────────────────────────────────────────
function getScreenFingerprint(): string {
  const s = window.screen;
  return [
    s.width,
    s.height,
    s.colorDepth,
    s.pixelDepth,
    window.devicePixelRatio || 1,
    s.availWidth,
    s.availHeight,
  ].join('|');
}

// ─── Hardware Fingerprint ────────────────────────────────────────────────────
function getHardwareFingerprint(): string {
  return [
    navigator.hardwareConcurrency || 'unknown',
    (navigator as unknown as { deviceMemory?: number }).deviceMemory || 'unknown',
    navigator.maxTouchPoints || 0,
  ].join('|');
}

// ─── Session Management ──────────────────────────────────────────────────────
const SESSION_KEY = '__ng_sid';

function generateSessionId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// ─── Request Tracking (scraping detection) ───────────────────────────────────
const REQUEST_LOG_KEY = '__ng_rlog';

interface RequestLog {
  timestamps: number[];
  count: number;
}

export function trackRequest(): { isSuspicious: boolean; requestCount: number } {
  if (typeof window === 'undefined') return { isSuspicious: false, requestCount: 0 };

  const now = Date.now();
  const windowMs = 60_000; // 1 minute window
  const threshold = 50;    // 50 requests/min = suspicious

  let log: RequestLog;
  try {
    const stored = sessionStorage.getItem(REQUEST_LOG_KEY);
    log = stored ? JSON.parse(stored) : { timestamps: [], count: 0 };
  } catch {
    log = { timestamps: [], count: 0 };
  }

  // Prune old timestamps
  log.timestamps = log.timestamps.filter((t) => now - t < windowMs);
  log.timestamps.push(now);
  log.count = log.timestamps.length;

  sessionStorage.setItem(REQUEST_LOG_KEY, JSON.stringify(log));

  return {
    isSuspicious: log.count > threshold,
    requestCount: log.count,
  };
}

// ─── Main Fingerprint Generator ──────────────────────────────────────────────
export async function generateFingerprint(): Promise<FingerprintResult> {
  if (typeof window === 'undefined') {
    return {
      hash: 'server-side',
      components: {
        canvas: '', webgl: '', audio: '', screen: '',
        timezone: '', language: '', plugins: '', fonts: '',
        hardware: '', platform: '',
      },
      sessionId: 'server',
      timestamp: Date.now(),
    };
  }

  const audio = await getAudioFingerprint();

  const components: BrowserFingerprint = {
    canvas: getCanvasFingerprint(),
    webgl: getWebGLFingerprint(),
    audio,
    screen: getScreenFingerprint(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language + '|' + navigator.languages.join(','),
    plugins: Array.from(navigator.plugins || [])
      .map((p) => p.name)
      .join(','),
    fonts: getFontFingerprint(),
    hardware: getHardwareFingerprint(),
    platform: navigator.platform || 'unknown',
  };

  const rawFingerprint = Object.values(components).join('|||');
  const hash = await sha256(rawFingerprint);

  return {
    hash,
    components,
    sessionId: getSessionId(),
    timestamp: Date.now(),
  };
}
