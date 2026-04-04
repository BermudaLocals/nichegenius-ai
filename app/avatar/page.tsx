'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Brain, Sparkles, Zap } from 'lucide-react';
import { InteractiveAvatar } from '@/components/avatar/interactive-avatar';
import { AvatarChat } from '@/components/avatar/avatar-chat';
import type { AvatarState } from '@/components/avatar/interactive-avatar';

// ── CSS for particles ───────────────────────────────────────────────────

const PARTICLE_STYLES = `
@keyframes particle-drift {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) translateX(var(--drift-x, 20px)); opacity: 0; }
}
@keyframes particle-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.5); }
}
`;

// ── Particle Background ─────────────────────────────────────────────────

function ParticleField() {
  const [particles, setParticles] = useState<
    { id: number; left: string; delay: string; duration: string; size: number; drift: string }[]
  >([]);

  useEffect(() => {
    const items = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${8 + Math.random() * 12}s`,
      size: 1 + Math.random() * 3,
      drift: `${-30 + Math.random() * 60}px`,
    }));
    setParticles(items);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-violet-400/60"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            animation: `particle-drift ${p.duration} ${p.delay} linear infinite`,
            ['--drift-x' as string]: p.drift,
          }}
        />
      ))}
      {/* Static ambient particles */}
      {particles.slice(0, 15).map((p) => (
        <div
          key={`s-${p.id}`}
          className="absolute rounded-full bg-purple-500/30"
          style={{
            left: p.left,
            top: `${Math.random() * 100}%`,
            width: p.size * 1.5,
            height: p.size * 1.5,
            animation: `particle-pulse ${3 + Math.random() * 4}s ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Suggested Questions (floating around avatar) ────────────────────────

const FLOATING_QUESTIONS = [
  { text: 'What can you do?', angle: -40, distance: 280 },
  { text: 'Analyze my niche', angle: -15, distance: 310 },
  { text: "What's trending?", angle: 15, distance: 290 },
  { text: 'How do agents work?', angle: 40, distance: 300 },
];

function FloatingQuestions({
  onSelect,
  visible,
}: {
  onSelect: (q: string) => void;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block">
      {FLOATING_QUESTIONS.map((q, i) => {
        const rad = (q.angle * Math.PI) / 180;
        const x = Math.sin(rad) * q.distance;
        const y = -Math.cos(rad) * q.distance * 0.5 - 40;

        return (
          <motion.button
            key={q.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 + i * 0.2, duration: 0.4 }}
            onClick={() => onSelect(q.text)}
            className="absolute pointer-events-auto"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="px-4 py-2 rounded-full bg-white/[0.05] backdrop-blur-md border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/20 hover:border-violet-400/40 hover:text-violet-200 transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-violet-500/5"
            >
              {q.text}
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────

export default function AvatarPage() {
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [chatKey, setChatKey] = useState(0);

  // Force a question into the chat from floating suggestions
  const handleFloatingSelect = (question: string) => {
    // We increment key to signal a new question; the chat component
    // will pick it up via a shared ref pattern or we scroll + type it.
    // For simplicity, we'll inject through the DOM input.
    const input = document.querySelector<HTMLInputElement>(
      'input[placeholder="Ask Aria anything..."]',
    );
    if (input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      nativeInputValueSetter?.call(input, question);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      // Auto-submit after a short delay
      setTimeout(() => {
        const form = input.closest('form');
        form?.dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true }),
        );
      }, 100);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PARTICLE_STYLES }} />
      <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
        {/* ── Background layers ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-black to-purple-950/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)]" />
        <ParticleField />

        {/* ── Top Bar ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-4"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Brain className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[11px] font-medium text-violet-300">AGI Active</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-300">3 Models Online</span>
            </div>
          </div>
        </motion.header>

        {/* ── Avatar Section ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-2 sm:mb-4"
          >
            <h1 className="text-2xl sm:text-3xl font-bold">
              Meet{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-500 bg-clip-text text-transparent">
                Aria
              </span>
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Your AI Business Advisor</p>
          </motion.div>

          {/* Avatar Display Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative flex items-center justify-center"
          >
            {/* Glow ring behind avatar */}
            <div className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full bg-violet-600/10 blur-[60px]" />
            <div className="absolute w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] rounded-full bg-purple-500/15 blur-[40px]" />

            {/* Avatar */}
            <InteractiveAvatar
              state={avatarState}
              size="lg"
              className="relative z-10"
            />

            {/* Floating Questions */}
            <FloatingQuestions
              onSelect={handleFloatingSelect}
              visible={avatarState === 'idle'}
            />
          </motion.div>

          {/* ── Chat Section ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-20 w-full max-w-2xl mx-auto mt-4 sm:mt-6 px-4 pb-6"
          >
            <AvatarChat
              key={chatKey}
              onStateChange={setAvatarState}
            />
          </motion.div>
        </div>

        {/* ── Footer info ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="relative z-10 text-center pb-4 px-4"
        >
          <p className="text-[10px] text-zinc-600">
            Aria is powered by NicheGenius AGI • GPT-4o + Gemma 2 + Claude •
            Model Context Protocol
          </p>
        </motion.div>
      </div>
    </>
  );
}
