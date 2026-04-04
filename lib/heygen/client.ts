// ============================================
// NicheGenius AI - HeyGen API Client
// AI Avatar Video Generation Integration
// ============================================

import { retry } from '@/lib/utils';

// ---- Types ----

export interface HeyGenVideo {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  createdAt: string;
  caption: boolean;
  title: string;
  error: string | null;
}

export interface HeyGenAvatar {
  avatarId: string;
  avatarName: string;
  gender: 'male' | 'female' | 'non-binary';
  previewImageUrl: string;
  previewVideoUrl: string;
  premium: boolean;
  type: 'standard' | 'custom' | 'studio';
}

export interface HeyGenVoice {
  voiceId: string;
  name: string;
  language: string;
  gender: 'male' | 'female';
  previewAudioUrl: string;
  supportedFormats: string[];
  emotionSupport: boolean;
}

export interface CreateVideoInput {
  script: string;
  avatarId?: string;
  voiceId?: string;
  title?: string;
  background?: {
    type: 'color' | 'image' | 'video';
    value: string;
  };
  dimension?: {
    width: number;
    height: number;
  };
  caption?: boolean;
  test?: boolean;
}

export interface VideoStatusResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  error: string | null;
}

interface HeyGenApiResponse<T> {
  code: number;
  data: T;
  message: string | null;
  error: string | null;
}

// ---- Error Class ----

export class HeyGenError extends Error {
  code: number;
  endpoint: string;

  constructor(message: string, code: number, endpoint: string) {
    super(message);
    this.name = 'HeyGenError';
    this.code = code;
    this.endpoint = endpoint;
  }
}

// ---- Constants ----

const HEYGEN_BASE_URL = 'https://api.heygen.com';
const API_VERSION = 'v2';

// ---- Internal Fetch Wrapper ----

async function heygenFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    throw new HeyGenError('HEYGEN_API_KEY is not configured', 401, endpoint);
  }

  const url = `${HEYGEN_BASE_URL}/${API_VERSION}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
      Accept: 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new HeyGenError(
      `HeyGen API error: ${response.status} - ${errorBody}`,
      response.status,
      endpoint,
    );
  }

  const json = (await response.json()) as HeyGenApiResponse<T>;

  if (json.error) {
    throw new HeyGenError(
      `HeyGen error: ${json.error}`,
      json.code || 500,
      endpoint,
    );
  }

  return json.data;
}

// ---- Video Generation ----

/**
 * Create a video from a script using an AI avatar.
 * Returns the video ID for status polling.
 */
export async function createVideoFromScript(
  input: CreateVideoInput,
): Promise<{ videoId: string }> {
  const avatarId = input.avatarId || process.env.HEYGEN_AVATAR_ID || 'Angela-inTshirt-20220820';
  const voiceId = input.voiceId || process.env.HEYGEN_VOICE_ID || 'en-US-JennyNeural';

  const payload = {
    video_inputs: [
      {
        character: {
          type: 'avatar',
          avatar_id: avatarId,
          avatar_style: 'normal',
        },
        voice: {
          type: 'text',
          input_text: input.script,
          voice_id: voiceId,
          speed: 1.0,
        },
        background: input.background
          ? {
              type: input.background.type,
              value: input.background.value,
            }
          : {
              type: 'color' as const,
              value: '#0f0f1a',
            },
      },
    ],
    dimension: input.dimension || { width: 1920, height: 1080 },
    caption: input.caption ?? false,
    test: input.test ?? process.env.NODE_ENV === 'development',
    title: input.title || 'NicheGenius AI Video',
  };

  const result = await retry(
    () =>
      heygenFetch<{ video_id: string }>('/video/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    { maxRetries: 2, baseDelay: 2000 },
  );

  return { videoId: result.video_id };
}

/**
 * Check the status of a video generation job.
 */
export async function getVideoStatus(videoId: string): Promise<VideoStatusResponse> {
  const result = await heygenFetch<{
    video_id: string;
    status: string;
    video_url: string | null;
    thumbnail_url: string | null;
    duration: number | null;
    error: string | null;
  }>(`/video/status.get?video_id=${encodeURIComponent(videoId)}`);

  return {
    id: result.video_id,
    status: result.status as VideoStatusResponse['status'],
    videoUrl: result.video_url,
    thumbnailUrl: result.thumbnail_url,
    duration: result.duration,
    error: result.error,
  };
}

/**
 * Poll for video completion with timeout.
 */
export async function waitForVideo(
  videoId: string,
  options?: { pollInterval?: number; timeout?: number },
): Promise<VideoStatusResponse> {
  const { pollInterval = 5000, timeout = 600000 } = options ?? {};
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const status = await getVideoStatus(videoId);

    if (status.status === 'completed') return status;
    if (status.status === 'failed') {
      throw new HeyGenError(
        `Video generation failed: ${status.error || 'Unknown error'}`,
        500,
        'video/status',
      );
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new HeyGenError(
    `Video generation timed out after ${timeout / 1000}s`,
    408,
    'video/status',
  );
}

// ---- Avatar Management ----

/**
 * List all available avatars.
 */
export async function listAvatars(): Promise<HeyGenAvatar[]> {
  const result = await heygenFetch<{
    avatars: Array<{
      avatar_id: string;
      avatar_name: string;
      gender: string;
      preview_image_url: string;
      preview_video_url: string;
      premium: boolean;
      type: string;
    }>;
  }>('/avatars');

  return result.avatars.map((a) => ({
    avatarId: a.avatar_id,
    avatarName: a.avatar_name,
    gender: a.gender as HeyGenAvatar['gender'],
    previewImageUrl: a.preview_image_url,
    previewVideoUrl: a.preview_video_url,
    premium: a.premium,
    type: a.type as HeyGenAvatar['type'],
  }));
}

// ---- Voice Management ----

/**
 * List all available voices.
 */
export async function listVoices(): Promise<HeyGenVoice[]> {
  const result = await heygenFetch<{
    voices: Array<{
      voice_id: string;
      name: string;
      language: string;
      gender: string;
      preview_audio: string;
      supported_formats: string[];
      emotion_support: boolean;
    }>;
  }>('/voices');

  return result.voices.map((v) => ({
    voiceId: v.voice_id,
    name: v.name,
    language: v.language,
    gender: v.gender as HeyGenVoice['gender'],
    previewAudioUrl: v.preview_audio,
    supportedFormats: v.supported_formats || [],
    emotionSupport: v.emotion_support || false,
  }));
}

// ---- Specialized Video Generators ----

/**
 * Generate a niche introduction video.
 * Creates a professional avatar video introducing a niche opportunity.
 */
export async function generateNicheIntroVideo(
  nicheName: string,
  script: string,
  options?: {
    avatarId?: string;
    voiceId?: string;
    background?: CreateVideoInput['background'];
  },
): Promise<{ videoId: string; status: string }> {
  const { videoId } = await createVideoFromScript({
    script,
    avatarId: options?.avatarId,
    voiceId: options?.voiceId,
    title: `NicheGenius: ${nicheName} - Introduction`,
    background: options?.background || {
      type: 'color',
      value: '#0f0f1a',
    },
    dimension: { width: 1920, height: 1080 },
    caption: true,
  });

  return { videoId, status: 'pending' };
}

/**
 * Generate a coaching/tutorial video.
 * Creates avatar videos for educational content delivery.
 */
export async function generateCoachingVideo(
  topic: string,
  script: string,
  options?: {
    avatarId?: string;
    voiceId?: string;
    style?: 'professional' | 'casual' | 'energetic';
  },
): Promise<{ videoId: string; status: string }> {
  const backgroundColors: Record<string, string> = {
    professional: '#1a1a2e',
    casual: '#16213e',
    energetic: '#0f3460',
  };

  const style = options?.style || 'professional';

  const { videoId } = await createVideoFromScript({
    script,
    avatarId: options?.avatarId,
    voiceId: options?.voiceId,
    title: `NicheGenius Coaching: ${topic}`,
    background: {
      type: 'color',
      value: backgroundColors[style],
    },
    dimension: { width: 1920, height: 1080 },
    caption: true,
  });

  return { videoId, status: 'pending' };
}

/**
 * Generate a sales/promotional video.
 */
export async function generateSalesVideo(
  productName: string,
  script: string,
  options?: {
    avatarId?: string;
    voiceId?: string;
  },
): Promise<{ videoId: string; status: string }> {
  const { videoId } = await createVideoFromScript({
    script,
    avatarId: options?.avatarId,
    voiceId: options?.voiceId,
    title: `${productName} - Sales Presentation`,
    background: {
      type: 'color',
      value: '#2b0070',
    },
    dimension: { width: 1920, height: 1080 },
    caption: true,
  });

  return { videoId, status: 'pending' };
}

// ---- Utility Functions ----

/**
 * Check if HeyGen integration is properly configured.
 */
export function isHeyGenConfigured(): boolean {
  return !!(process.env.HEYGEN_API_KEY && process.env.NEXT_PUBLIC_HEYGEN_ENABLED === 'true');
}

/**
 * Estimate video generation time based on script length.
 * Approximately 1 minute of processing per 30 seconds of video.
 */
export function estimateGenerationTime(scriptWordCount: number): {
  videoDurationSeconds: number;
  estimatedProcessingMinutes: number;
} {
  const wordsPerMinute = 150;
  const videoDurationSeconds = Math.ceil((scriptWordCount / wordsPerMinute) * 60);
  const estimatedProcessingMinutes = Math.ceil(videoDurationSeconds / 30);

  return {
    videoDurationSeconds,
    estimatedProcessingMinutes: Math.max(estimatedProcessingMinutes, 2),
  };
}

/**
 * Validate a script for HeyGen compatibility.
 */
export function validateScript(script: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: { wordCount: number; estimatedDuration: string; characterCount: number };
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const wordCount = script.split(/\s+/).filter(Boolean).length;
  const characterCount = script.length;
  const estimatedSeconds = Math.ceil((wordCount / 150) * 60);

  if (characterCount === 0) {
    errors.push('Script cannot be empty');
  }

  if (characterCount > 5000) {
    errors.push(`Script too long: ${characterCount} characters (max 5000)`);
  }

  if (wordCount < 10) {
    errors.push('Script too short: minimum 10 words required');
  }

  if (estimatedSeconds > 300) {
    warnings.push(`Long video: estimated ${Math.round(estimatedSeconds / 60)} minutes. Consider splitting.`);
  }

  if (/[^\x00-\x7F]/.test(script) && !/[\u00C0-\u024F]/.test(script)) {
    warnings.push('Script contains non-Latin characters. Verify voice compatibility.');
  }

  const minutes = Math.floor(estimatedSeconds / 60);
  const seconds = estimatedSeconds % 60;
  const estimatedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: { wordCount, estimatedDuration, characterCount },
  };
}
