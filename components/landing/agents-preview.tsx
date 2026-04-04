'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GradientText } from '@/components/ui/gradient-text';

// ── Agent Mini Data ──────────────────────────────────────────────────────

const AGENTS = [
  { name: 'NicheScout', emoji: '🔍', gradient: 'from-violet-500 to-purple-600' },
  { name: 'PersonaMapper', emoji: '🧠', gradient: 'from-purple-500 to-pink-600' },
  { name: 'MarketOracle', emoji: '📊', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'CompetitorSpy', emoji: '🕵️', gradient: 'from-emerald-500 to-teal-500' },
  { name: 'ContentArchitect', emoji: '✍️', gradient: 'from-amber-500 to-orange-500' },
  { name: 'FunnelForge', emoji: '🔥', gradient: 'from-red-500 to-rose-500' },
  { name: 'ProductGenius', emoji: '📦', gradient: 'from-indigo-500 to-violet-500' },
  { name: 'TrendRadar', emoji: '📡', gradient: 'from-cyan-500 to-blue-500' },
  { name: 'ScriptWriter', emoji: '🎬', gradient: 'from-pink-500 to-rose-500' },
  { name: 'GrowthCoach', emoji: '🚀', gradient: 'from-violet-600 to-purple-500' },
];

// ── Component ────────────────────────────────────────────────────────────

export function AgentsPreview() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-300">Powered by 10 AI Agents</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Meet Your <GradientText>AI Team</GradientText>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            10 specialized AI agents collaborate 24/7 through our Model Context Protocol
            to build your perfect business blueprint.
          </p>
        </motion.div>

        {/* Scrollable Agent Row */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-none snap-x snap-mandatory"
          >
            {AGENTS.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                className="flex-shrink-0 snap-center"
              >
                <div
                  className={cn(
                    'flex flex-col items-center gap-3 p-5 rounded-2xl',
                    'bg-white/[0.03] backdrop-blur-sm',
                    'border border-white/[0.06]',
                    'hover:bg-white/[0.06] hover:border-white/[0.12]',
                    'transition-all duration-300',
                    'w-[120px]',
                    'group cursor-default',
                  )}
                >
                  <div
                    className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center',
                      'bg-gradient-to-br',
                      agent.gradient,
                      'shadow-lg group-hover:scale-110 transition-transform duration-300',
                    )}
                  >
                    <span className="text-2xl">{agent.emoji}</span>
                  </div>
                  <span className="text-xs font-medium text-zinc-300 text-center leading-tight">
                    {agent.name}
                  </span>
                  {/* Online dot */}
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-emerald-400/70 font-medium">Online</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <Link
            href="/agents"
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
              'text-sm font-semibold text-violet-300',
              'bg-violet-500/10 border border-violet-500/20',
              'hover:bg-violet-500/20 hover:text-violet-200',
              'transition-all duration-300 group',
            )}
          >
            Meet your AI team
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default AgentsPreview;
