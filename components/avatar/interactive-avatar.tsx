'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type AvatarState = 'idle' | 'thinking' | 'speaking' | 'listening';

interface InteractiveAvatarProps {
  state?: AvatarState;
  size?: 'sm' | 'md' | 'lg';
  showVideo?: boolean;
  onVideoEnd?: () => void;
}

const STATE_LABELS: Record<AvatarState, { label: string; color: string }> = {
  idle: { label: 'Online', color: 'bg-emerald-500' },
  thinking: { label: 'Thinking...', color: 'bg-violet-500' },
  speaking: { label: 'Speaking', color: 'bg-blue-500' },
  listening: { label: 'Listening', color: 'bg-amber-500' },
};

export function InteractiveAvatar({
  state = 'idle',
  size = 'lg',
  showVideo = false,
  onVideoEnd,
}: InteractiveAvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const sizes = {
    sm: { container: 'w-32 h-32', ring: 'w-36 h-36' },
    md: { container: 'w-56 h-56', ring: 'w-60 h-60' },
    lg: { container: 'w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96', ring: 'w-76 h-76 sm:w-84 sm:h-84 md:w-[25rem] md:h-[25rem]' },
  };

  // Play video when state is speaking and showVideo is true
  useEffect(() => {
    if (showVideo && state === 'speaking' && videoRef.current && videoLoaded) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setVideoPlaying(true);
    } else if (state !== 'speaking' && videoRef.current) {
      videoRef.current.pause();
      setVideoPlaying(false);
    }
  }, [state, showVideo, videoLoaded]);

  const handleVideoEnd = () => {
    setVideoPlaying(false);
    onVideoEnd?.();
  };

  const stateInfo = STATE_LABELS[state];

  return (
    <div className="relative flex flex-col items-center">
      {/* Ambient glow rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className={`absolute rounded-full bg-violet-500/10 blur-3xl ${
            size === 'lg' ? 'w-[30rem] h-[30rem]' : size === 'md' ? 'w-72 h-72' : 'w-44 h-44'
          }`}
          animate={{
            scale: state === 'thinking' ? [1, 1.2, 1] : state === 'speaking' ? [1, 1.1, 1] : [1, 1.05, 1],
            opacity: state === 'thinking' ? [0.3, 0.6, 0.3] : [0.2, 0.35, 0.2],
          }}
          transition={{ duration: state === 'thinking' ? 1.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute rounded-full bg-purple-600/10 blur-2xl ${
            size === 'lg' ? 'w-[26rem] h-[26rem]' : size === 'md' ? 'w-64 h-64' : 'w-40 h-40'
          }`}
          animate={{
            scale: state === 'speaking' ? [1, 1.15, 1] : [1, 1.03, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>

      {/* Pulse rings for thinking state */}
      <AnimatePresence>
        {state === 'thinking' && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`pulse-${i}`}
                className={`absolute rounded-full border border-violet-500/30 ${sizes[size].ring}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.4], opacity: [0.5, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Audio waveform for speaking state */}
      <AnimatePresence>
        {state === 'speaking' && (
          <motion.div
            className="absolute -bottom-2 flex items-end gap-[3px] h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-violet-500 to-purple-400 rounded-full"
                animate={{ height: [4, 12 + Math.random() * 20, 4] }}
                transition={{ duration: 0.3 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.05 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listening ring */}
      <AnimatePresence>
        {state === 'listening' && (
          <motion.div
            className={`absolute rounded-full border-2 border-amber-500/40 ${sizes[size].ring}`}
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      {/* Main avatar container */}
      <motion.div
        className={`relative ${sizes[size].container} rounded-full overflow-hidden border-2 ${
          state === 'speaking' ? 'border-blue-500/50' :
          state === 'thinking' ? 'border-violet-500/50' :
          state === 'listening' ? 'border-amber-500/50' :
          'border-white/10'
        } shadow-2xl shadow-violet-500/20 z-10`}
        animate={{
          y: state === 'idle' ? [0, -6, 0] : 0,
          scale: state === 'speaking' ? [1, 1.02, 1] : 1,
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* Video layer (plays when speaking) */}
        <video
          ref={videoRef}
          src="/avatars/aria-welcome.mp4"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            videoPlaying ? 'opacity-100' : 'opacity-0'
          }`}
          playsInline
          muted={false}
          onEnded={handleVideoEnd}
          onLoadedData={() => setVideoLoaded(true)}
          preload="auto"
        />

        {/* Portrait image (shows when not playing video) */}
        <Image
          src="/avatars/aria-portrait.png"
          alt="Aria — NicheGenius AI Advisor"
          fill
          className={`object-cover transition-opacity duration-500 ${
            videoPlaying ? 'opacity-0' : 'opacity-100'
          }`}
          priority
          sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, 384px"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Inner glow ring */}
        <div className={`absolute inset-0 rounded-full ring-1 ring-inset ${
          state === 'speaking' ? 'ring-blue-400/30' :
          state === 'thinking' ? 'ring-violet-400/40' :
          state === 'listening' ? 'ring-amber-400/30' :
          'ring-white/10'
        }`} />
      </motion.div>

      {/* Status badge */}
      <motion.div
        className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className={`w-2 h-2 rounded-full ${stateInfo.color}`}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-xs font-medium text-zinc-300">{stateInfo.label}</span>
        <span className="text-[10px] text-zinc-600">Aria • v1.7</span>
      </motion.div>

      {/* CSS Styles */}
      <style jsx global>{`
        @keyframes avatar-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
      `}</style>
    </div>
  );
}

export default InteractiveAvatar;
