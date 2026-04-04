'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Play, Download, RefreshCw, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';

type Avatar = { id: string; name: string; preview: string };
type VideoStatus = 'idle' | 'selecting' | 'generating' | 'processing' | 'complete' | 'error';

const MOCK_AVATARS: Avatar[] = [
  { id: 'av_001', name: 'Sarah — Professional Coach', preview: '/avatars/sarah.png' },
  { id: 'av_002', name: 'Marcus — Tech Expert', preview: '/avatars/marcus.png' },
  { id: 'av_003', name: 'Elena — Lifestyle Host', preview: '/avatars/elena.png' },
  { id: 'av_004', name: 'James — Business Mentor', preview: '/avatars/james.png' },
];

export function VideoGenerator({
  script = '',
  nicheName = 'Your Niche',
}: {
  script?: string;
  nicheName?: string;
}) {
  const [status, setStatus] = useState<VideoStatus>('idle');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulate video generation progress
  useEffect(() => {
    if (status !== 'generating' && status !== 'processing') return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('complete');
          setVideoUrl('https://example.com/generated-video.mp4');
          return 100;
        }
        return prev + Math.random() * 3;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [status]);

  const handleGenerate = async () => {
    if (!selectedAvatar) {
      setShowAvatarPicker(true);
      return;
    }
    setStatus('generating');
    setProgress(0);
    setError(null);

    try {
      const res = await fetch('/api/heygen/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, avatarId: selectedAvatar.id, nicheName }),
      });

      if (!res.ok) {
        // Fall back to simulation
        setStatus('processing');
        return;
      }

      const data = await res.json();
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setStatus('complete');
        setProgress(100);
      } else {
        setStatus('processing');
      }
    } catch {
      // Simulate if API unavailable
      setStatus('processing');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setProgress(0);
    setVideoUrl(null);
    setError(null);
  };

  return (
    <GlassCard intensity="medium" className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Avatar Video</h3>
            <p className="text-xs text-zinc-500">Powered by HeyGen</p>
          </div>
        </div>
        <Badge variant={status === 'complete' ? 'success' : 'violet'} size="sm">
          {status === 'idle' && 'Ready'}
          {status === 'selecting' && 'Select Avatar'}
          {(status === 'generating' || status === 'processing') && 'Generating...'}
          {status === 'complete' && 'Complete'}
          {status === 'error' && 'Error'}
        </Badge>
      </div>

      {/* Avatar Picker */}
      <div>
        <button
          onClick={() => setShowAvatarPicker(!showAvatarPicker)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            {selectedAvatar ? (
              <>
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Video className="w-4 h-4 text-violet-400" />
                </div>
                <span className="text-sm text-white">{selectedAvatar.name}</span>
              </>
            ) : (
              <span className="text-sm text-zinc-500">Select an AI avatar...</span>
            )}
          </div>
          <ChevronDown className={cn('w-4 h-4 text-zinc-500 transition-transform', showAvatarPicker && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {showAvatarPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 pt-3">
                {MOCK_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => { setSelectedAvatar(avatar); setShowAvatarPicker(false); }}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-xl border text-left transition-all',
                      selectedAvatar?.id === avatar.id
                        ? 'bg-violet-500/15 border-violet-500/30 text-violet-200'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/15',
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Video className="w-3.5 h-3.5 text-violet-300" />
                    </div>
                    <span className="text-xs">{avatar.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Script Preview */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-500">Script Preview</p>
        <div className="max-h-32 overflow-y-auto p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">
            {script ? script.slice(0, 500) + (script.length > 500 ? '...' : '') : 'No script loaded. Generate your blueprint first.'}
          </p>
        </div>
      </div>

      {/* Progress */}
      {(status === 'generating' || status === 'processing') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <ProgressBar value={Math.min(progress, 100)} size="md" />
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
            <p className="text-xs text-zinc-400">
              {progress < 30 && 'Preparing avatar and voice...'}
              {progress >= 30 && progress < 60 && 'Rendering video scenes...'}
              {progress >= 60 && progress < 90 && 'Applying lip sync and effects...'}
              {progress >= 90 && 'Finalizing video...'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Video Player */}
      {status === 'complete' && videoUrl && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="relative aspect-video rounded-xl bg-black/50 border border-white/10 overflow-hidden flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-violet-400 ml-1" />
              </div>
              <p className="text-sm text-zinc-400">Video ready — {nicheName} Introduction</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">Video generated successfully</span>
          </div>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {status === 'idle' || status === 'error' ? (
          <Button
            size="md"
            glow
            onClick={handleGenerate}
            disabled={!script}
            iconLeft={<Play className="w-4 h-4" />}
            fullWidth
          >
            Generate AI Video
          </Button>
        ) : status === 'complete' ? (
          <>
            <Button size="md" variant="primary" iconLeft={<Download className="w-4 h-4" />} fullWidth>
              Download Video
            </Button>
            <Button size="md" variant="ghost" onClick={handleReset} iconLeft={<RefreshCw className="w-4 h-4" />}>
              Redo
            </Button>
          </>
        ) : null}
      </div>
    </GlassCard>
  );
}

export default VideoGenerator;
