'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type AvatarState = 'idle' | 'thinking' | 'speaking' | 'listening';

interface InteractiveAvatarProps {
  state?: AvatarState;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// ── Keyframe Styles (injected once) ─────────────────────────────────────

const AVATAR_KEYFRAMES = `
@keyframes avatar-breathe {
  0%, 100% { transform: scaleY(1) translateY(0); }
  50% { transform: scaleY(1.008) translateY(-1.5px); }
}
@keyframes avatar-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
@keyframes avatar-head-tilt {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(1.5deg); }
  75% { transform: rotate(-1deg); }
}
@keyframes avatar-body-sway {
  0%, 100% { transform: translateX(0px); }
  33% { transform: translateX(2px); }
  66% { transform: translateX(-2px); }
}
@keyframes avatar-mouth-speak {
  0%, 100% { transform: scaleY(1); }
  15% { transform: scaleY(2.8); }
  30% { transform: scaleY(1.2); }
  45% { transform: scaleY(2.4); }
  60% { transform: scaleY(1); }
  75% { transform: scaleY(3); }
  90% { transform: scaleY(1.5); }
}
@keyframes avatar-pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.2); opacity: 0; }
}
@keyframes avatar-think-glow {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(139,92,246,0.3)); }
  50% { filter: drop-shadow(0 0 25px rgba(139,92,246,0.8)); }
}
@keyframes avatar-eye-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}
@keyframes avatar-hand-gesture {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  25% { transform: rotate(-5deg) translateY(-3px); }
  50% { transform: rotate(3deg) translateY(-5px); }
  75% { transform: rotate(-2deg) translateY(-2px); }
}
@keyframes waveform-bar {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}
@keyframes listen-ring {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 0.8; }
}
`;

// ── Avatar SVG ──────────────────────────────────────────────────────────

export function InteractiveAvatar({
  state = 'idle',
  className,
  size = 'lg',
}: InteractiveAvatarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizes = {
    sm: 'w-[180px] h-[220px]',
    md: 'w-[260px] h-[320px]',
    lg: 'w-[340px] h-[420px]',
  };

  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking';
  const isListening = state === 'listening';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: AVATAR_KEYFRAMES }} />
      <div
        className={cn(
          'relative flex items-center justify-center',
          sizes[size],
          className,
        )}
      >
        {/* ── Thinking pulse rings ── */}
        <AnimatePresence>
          {isThinking && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`pulse-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 rounded-full border border-violet-500/30"
                  style={{
                    animation: `avatar-pulse-ring 2s ease-out ${i * 0.6}s infinite`,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* ── Listening ring ── */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-[-8px] rounded-full border-2 border-violet-400/50"
              style={{ animation: 'listen-ring 1.5s ease-in-out infinite' }}
            />
          )}
        </AnimatePresence>

        {/* ── Main SVG Avatar ── */}
        <svg
          viewBox="0 0 340 420"
          className="w-full h-full"
          style={{
            animation: isThinking
              ? 'avatar-think-glow 2s ease-in-out infinite'
              : undefined,
            filter: mounted
              ? 'drop-shadow(0 0 12px rgba(139,92,246,0.3))'
              : undefined,
          }}
        >
          <defs>
            {/* Body gradient */}
            <linearGradient id="av-body-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#6d28d9" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.5" />
            </linearGradient>
            {/* Head gradient */}
            <linearGradient id="av-head-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.85" />
            </linearGradient>
            {/* Eye glow */}
            <radialGradient id="av-eye-glow">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="60%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
            </radialGradient>
            {/* Outer glow filter */}
            <filter id="av-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Soft shadow */}
            <filter id="av-shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4c1d95" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* ── Float group ── */}
          <g style={{ animation: 'avatar-float 6s ease-in-out infinite' }}>

            {/* ── Body Sway Group ── */}
            <g
              style={{
                transformOrigin: '170px 280px',
                animation: 'avatar-body-sway 8s ease-in-out infinite',
              }}
            >

              {/* ── Body / Torso ── */}
              <g filter="url(#av-shadow)">
                {/* Shoulders & torso */}
                <path
                  d="M110 235 Q110 210 140 200 L170 195 L200 200 Q230 210 230 235 L240 330 Q240 370 200 380 L140 380 Q100 370 100 330 Z"
                  fill="url(#av-body-grad)"
                  style={{ animation: 'avatar-breathe 4s ease-in-out infinite' }}
                />
                {/* Collar / neckline detail */}
                <path
                  d="M140 200 Q155 215 170 218 Q185 215 200 200"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />
                {/* Lapel lines */}
                <path
                  d="M150 218 L130 280"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
                <path
                  d="M190 218 L210 280"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
              </g>

              {/* ── Left Arm ── */}
              <g
                style={{
                  transformOrigin: '110px 235px',
                  animation: isSpeaking
                    ? 'avatar-hand-gesture 3s ease-in-out infinite'
                    : undefined,
                }}
              >
                <path
                  d="M110 235 Q90 260 85 300 Q82 320 88 335"
                  fill="none"
                  stroke="url(#av-body-grad)"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
                {/* Hand */}
                <ellipse cx="88" cy="338" rx="10" ry="12" fill="#a78bfa" fillOpacity="0.7" />
              </g>

              {/* ── Right Arm ── */}
              <g
                style={{
                  transformOrigin: '230px 235px',
                  animation: isSpeaking
                    ? 'avatar-hand-gesture 3.5s ease-in-out 0.3s infinite'
                    : undefined,
                }}
              >
                <path
                  d="M230 235 Q250 260 255 300 Q258 320 252 335"
                  fill="none"
                  stroke="url(#av-body-grad)"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
                <ellipse cx="252" cy="338" rx="10" ry="12" fill="#a78bfa" fillOpacity="0.7" />
              </g>

              {/* ── Head Group ── */}
              <g
                style={{
                  transformOrigin: '170px 140px',
                  animation: 'avatar-head-tilt 7s ease-in-out infinite',
                }}
              >
                {/* Neck */}
                <rect
                  x="158" y="180" width="24" height="22" rx="10"
                  fill="#a78bfa" fillOpacity="0.7"
                />

                {/* Head shape - oval */}
                <ellipse
                  cx="170" cy="135" rx="58" ry="68"
                  fill="url(#av-head-grad)"
                  filter="url(#av-glow)"
                />

                {/* Hair suggestion - top */}
                <path
                  d="M112 125 Q115 75 145 60 Q170 50 195 60 Q225 75 228 125"
                  fill="#6d28d9"
                  fillOpacity="0.6"
                />
                {/* Hair sides */}
                <path
                  d="M112 125 Q108 100 112 85" fill="none" stroke="#6d28d9"
                  strokeWidth="8" strokeLinecap="round" strokeOpacity="0.4"
                />
                <path
                  d="M228 125 Q232 100 228 85" fill="none" stroke="#6d28d9"
                  strokeWidth="8" strokeLinecap="round" strokeOpacity="0.4"
                />

                {/* ── Eyes ── */}
                <g style={{ animation: 'avatar-eye-blink 5s ease-in-out infinite' }}>
                  {/* Left eye */}
                  <ellipse cx="148" cy="132" rx="9" ry="9" fill="url(#av-eye-glow)" />
                  <circle cx="148" cy="132" r="4" fill="#ede9fe" />
                  <circle cx="149.5" cy="130.5" r="1.5" fill="white" />
                  {/* Right eye */}
                  <ellipse cx="192" cy="132" rx="9" ry="9" fill="url(#av-eye-glow)" />
                  <circle cx="192" cy="132" r="4" fill="#ede9fe" />
                  <circle cx="193.5" cy="130.5" r="1.5" fill="white" />
                </g>

                {/* Eyebrows */}
                <path d="M135 118 Q148 113 158 117" fill="none" stroke="#6d28d9" strokeWidth="2" strokeLinecap="round" />
                <path d="M182 117 Q192 113 205 118" fill="none" stroke="#6d28d9" strokeWidth="2" strokeLinecap="round" />

                {/* Nose hint */}
                <path d="M168 143 Q170 150 172 143" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeOpacity="0.5" />

                {/* ── Mouth ── */}
                <g style={{ transformOrigin: '170px 163px' }}>
                  {isSpeaking ? (
                    <ellipse
                      cx="170" cy="163" rx="10" ry="4"
                      fill="#4c1d95"
                      style={{ animation: 'avatar-mouth-speak 0.4s ease-in-out infinite' }}
                    />
                  ) : (
                    <path
                      d="M157 162 Q170 170 183 162"
                      fill="none"
                      stroke="#5b21b6"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              </g>
            </g>
          </g>

          {/* ── Waveform bars (speaking) ── */}
          {isSpeaking && (
            <g>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <rect
                  key={`wave-${i}`}
                  x={134 + i * 10}
                  y="392"
                  width="5"
                  rx="2.5"
                  height="18"
                  fill="#a78bfa"
                  fillOpacity="0.7"
                  style={{
                    transformOrigin: `${136.5 + i * 10}px 401px`,
                    animation: `waveform-bar ${0.3 + Math.random() * 0.4}s ease-in-out ${i * 0.07}s infinite`,
                  }}
                />
              ))}
            </g>
          )}
        </svg>

        {/* ── State label ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span
              className={cn(
                'px-3 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase',
                'backdrop-blur-md border',
                state === 'idle' && 'bg-violet-500/10 text-violet-300 border-violet-500/20',
                state === 'thinking' && 'bg-amber-500/10 text-amber-300 border-amber-500/20',
                state === 'speaking' && 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
                state === 'listening' && 'bg-sky-500/10 text-sky-300 border-sky-500/20',
              )}
            >
              {state === 'idle' && '● Online'}
              {state === 'thinking' && '◉ Thinking...'}
              {state === 'speaking' && '♫ Speaking'}
              {state === 'listening' && '◎ Listening...'}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default InteractiveAvatar;
