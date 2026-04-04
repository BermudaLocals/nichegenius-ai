'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  Brain,
  BarChart3,
  Eye,
  Pen,
  Flame,
  Package,
  Radio,
  Clapperboard,
  Rocket,
  ArrowRight,
  Zap,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GradientText } from '@/components/ui/gradient-text';
import { Button } from '@/components/ui/button';

// ── Agent Data ───────────────────────────────────────────────────────────

type Agent = {
  id: string;
  name: string;
  emoji: string;
  icon: typeof Search;
  role: string;
  description: string;
  capabilities: string[];
  poweredBy: string;
  gradient: string;
  glowColor: string;
};

const AGENTS: Agent[] = [
  {
    id: 'nichescout',
    name: 'NicheScout',
    emoji: '🔍',
    icon: Search,
    role: 'Niche Research Agent',
    description:
      'Discovers and validates profitable niches using real-time market data. Analyzes search volume, competition density, monetization potential, and trend trajectories across 500+ niche categories.',
    capabilities: ['Market Validation', 'Opportunity Scoring', 'Trend Detection'],
    poweredBy: 'GPT-4o',
    gradient: 'from-violet-500 to-purple-600',
    glowColor: 'violet',
  },
  {
    id: 'personamapper',
    name: 'PersonaMapper',
    emoji: '🧠',
    icon: Brain,
    role: 'Personality Analysis Agent',
    description:
      'Maps your MBTI, Big Five, and Enneagram profiles to entrepreneurial strengths. Identifies cognitive patterns, communication styles, and work preferences to find your ideal business model.',
    capabilities: ['MBTI Profiling', 'Strength Mapping', 'Style Analysis'],
    poweredBy: 'Gemma 2',
    gradient: 'from-purple-500 to-pink-600',
    glowColor: 'purple',
  },
  {
    id: 'marketoracle',
    name: 'MarketOracle',
    emoji: '📊',
    icon: BarChart3,
    role: 'Market Intelligence Agent',
    description:
      'Analyzes market size, growth rates, competition levels, and entry barriers with surgical precision. Provides TAM/SAM/SOM breakdowns and revenue projections for each recommended niche.',
    capabilities: ['Market Sizing', 'Growth Analysis', 'Revenue Projection'],
    poweredBy: 'GPT-4o',
    gradient: 'from-blue-500 to-cyan-500',
    glowColor: 'blue',
  },
  {
    id: 'competitorspy',
    name: 'CompetitorSpy',
    emoji: '🕵️',
    icon: Eye,
    role: 'Competitor Analysis Agent',
    description:
      'Identifies top competitors, dissects their strategies, reveals market gaps, and exposes weaknesses you can exploit. Maps the competitive landscape so you enter with an unfair advantage.',
    capabilities: ['Gap Analysis', 'Strategy Mapping', 'Weakness Detection'],
    poweredBy: 'Claude',
    gradient: 'from-emerald-500 to-teal-500',
    glowColor: 'emerald',
  },
  {
    id: 'contentarchitect',
    name: 'ContentArchitect',
    emoji: '✍️',
    icon: Pen,
    role: 'Content Strategy Agent',
    description:
      'Builds 30-day content calendars with viral hooks, platform-specific strategies, and engagement optimization. Creates content pillars and posting schedules tailored to your niche and personality.',
    capabilities: ['Content Calendar', 'Viral Hooks', 'Platform Strategy'],
    poweredBy: 'GPT-4o',
    gradient: 'from-amber-500 to-orange-500',
    glowColor: 'amber',
  },
  {
    id: 'funnelforge',
    name: 'FunnelForge',
    emoji: '🔥',
    icon: Flame,
    role: 'Sales Funnel Agent',
    description:
      'Designs high-converting 4-step sales funnels with optimized pricing, compelling copy, and proven conversion tactics. From lead magnet to upsell, every step is engineered for maximum revenue.',
    capabilities: ['Funnel Design', 'Price Optimization', 'Conversion Tactics'],
    poweredBy: 'Claude',
    gradient: 'from-red-500 to-rose-500',
    glowColor: 'red',
  },
  {
    id: 'productgenius',
    name: 'ProductGenius',
    emoji: '📦',
    icon: Package,
    role: 'Product Ideation Agent',
    description:
      'Generates digital product ideas with complete outlines, competitive pricing, and launch strategies. From eBooks to courses to SaaS — each idea is validated against market demand.',
    capabilities: ['Product Ideas', 'Launch Strategy', 'Pricing Models'],
    poweredBy: 'GPT-4o',
    gradient: 'from-indigo-500 to-violet-500',
    glowColor: 'indigo',
  },
  {
    id: 'trendradar',
    name: 'TrendRadar',
    emoji: '📡',
    icon: Radio,
    role: 'Trend Analysis Agent',
    description:
      'Detects emerging trends, seasonal patterns, and viral content opportunities before they peak. Monitors social signals, search patterns, and market shifts to keep you ahead of the curve.',
    capabilities: ['Trend Detection', 'Seasonal Patterns', 'Viral Signals'],
    poweredBy: 'Gemma 2',
    gradient: 'from-cyan-500 to-blue-500',
    glowColor: 'cyan',
  },
  {
    id: 'scriptwriter',
    name: 'ScriptWriter',
    emoji: '🎬',
    icon: Clapperboard,
    role: 'Video Script Agent',
    description:
      'Creates TikTok Live scripts, YouTube outlines, and HeyGen avatar scripts optimized for each platform. Writes hooks that stop the scroll and CTAs that drive action.',
    capabilities: ['TikTok Scripts', 'YouTube Outlines', 'HeyGen Scripts'],
    poweredBy: 'Claude',
    gradient: 'from-pink-500 to-rose-500',
    glowColor: 'pink',
  },
  {
    id: 'growthcoach',
    name: 'GrowthCoach',
    emoji: '🚀',
    icon: Rocket,
    role: 'AI Business Coach',
    description:
      'Provides ongoing personalized coaching, milestone tracking, and strategy adjustments. Like having a world-class business mentor available 24/7, adapting advice as your business evolves.',
    capabilities: ['1-on-1 Coaching', 'Milestone Tracking', 'Strategy Pivots'],
    poweredBy: 'GPT-4o',
    gradient: 'from-violet-600 to-purple-500',
    glowColor: 'violet',
  },
];

const poweredByColors: Record<string, string> = {
  'GPT-4o': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Gemma 2': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Claude': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

// ── Animation Variants ───────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Agent Card ───────────────────────────────────────────────────────────

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = agent.icon;

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl',
          'bg-white/[0.03] backdrop-blur-xl',
          'border border-white/[0.06]',
          'p-6 max-sm:p-5 h-full',
          'transition-all duration-500',
          'hover:bg-white/[0.06] hover:border-white/[0.12]',
          'hover:shadow-2xl hover:shadow-violet-500/10',
          'hover:-translate-y-1',
        )}
      >
        {/* Gradient glow on hover */}
        <div
          className={cn(
            'absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500',
            'group-hover:opacity-100',
            'bg-gradient-to-br',
            agent.gradient,
            'blur-xl -z-10',
          )}
          style={{ opacity: hovered ? 0.08 : 0 }}
        />

        {/* Header: Icon + Status */}
        <div className="flex items-start justify-between mb-4 max-sm:mb-3">
          <div
            className={cn(
              'w-14 h-14 max-sm:w-12 max-sm:h-12 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br',
              agent.gradient,
              'shadow-lg',
            )}
          >
            <span className="text-2xl max-sm:text-xl">{agent.emoji}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
              Online
            </span>
          </div>
        </div>

        {/* Name + Role */}
        <h3 className="text-lg max-sm:text-base font-bold text-white mb-1">
          <GradientText from={`${agent.gradient.split(' ')[0]}`} to={`${agent.gradient.split(' ')[1]}`}>
            {agent.name}
          </GradientText>
        </h3>
        <p className="text-xs max-sm:text-[11px] font-medium text-zinc-400 mb-3 max-sm:mb-2">{agent.role}</p>

        {/* Description */}
        <p className="text-[13px] max-sm:text-xs text-zinc-400 leading-relaxed mb-4 max-sm:mb-3">
          {agent.description}
        </p>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1.5 mb-4 max-sm:mb-3">
          {agent.capabilities.map((cap) => (
            <span
              key={cap}
              className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.05] text-zinc-300 border border-white/[0.08]"
            >
              {cap}
            </span>
          ))}
        </div>

        {/* Powered By */}
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-zinc-500" />
          <span className="text-[10px] text-zinc-500">Powered by</span>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
              poweredByColors[agent.poweredBy],
            )}
          >
            {agent.poweredBy}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Flow Diagram Section ─────────────────────────────────────────────────

function FlowDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mt-24 max-sm:mt-16 mb-16 max-sm:mb-12"
    >
      <div className="text-center mb-12 max-sm:mb-8">
        <h2 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-white mb-3">
          All 10 Agents Work <GradientText>Together</GradientText>
        </h2>
        <p className="text-base max-sm:text-sm text-zinc-400 max-w-xl mx-auto">
          Connected through our Model Context Protocol, each agent shares insights
          in real-time to deliver results no single AI could achieve.
        </p>
      </div>

      {/* Visual Flow */}
      <div className="relative max-w-4xl mx-auto">
        <div className="grid grid-cols-5 max-md:grid-cols-4 max-sm:grid-cols-3 gap-4 max-sm:gap-3">
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex flex-col items-center gap-2 max-sm:gap-1.5"
            >
              <div
                className={cn(
                  'w-12 h-12 max-sm:w-10 max-sm:h-10 rounded-xl flex items-center justify-center',
                  'bg-gradient-to-br',
                  agent.gradient,
                  'shadow-lg text-lg max-sm:text-base',
                )}
              >
                {agent.emoji}
              </div>
              <span className="text-[11px] max-sm:text-[10px] font-medium text-zinc-300 text-center">
                {agent.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Center MCP hub */}
        <div className="mt-8 max-sm:mt-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-2xl" />
            <div className="relative flex items-center gap-3 max-sm:gap-2 px-6 max-sm:px-4 py-3 max-sm:py-2.5 rounded-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30">
              <Sparkles className="w-5 h-5 max-sm:w-4 max-sm:h-4 text-violet-400" />
              <span className="text-sm max-sm:text-xs font-semibold text-white">Model Context Protocol</span>
              <Sparkles className="w-5 h-5 max-sm:w-4 max-sm:h-4 text-violet-400" />
            </div>
          </motion.div>
        </div>

        {/* Connecting lines (CSS) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-violet-500/10" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────

export default function AgentsPage() {
  return (
    <main className="relative min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-80 left-1/2 -translate-x-1/2 w-[1000px] max-md:w-[600px] h-[700px] max-md:h-[500px] rounded-full bg-violet-600/8 blur-[160px] max-md:blur-[120px]" />
        <div className="absolute top-[40%] -right-60 max-md:-right-40 w-[600px] max-md:w-[400px] h-[600px] max-md:h-[400px] rounded-full bg-purple-900/10 blur-[120px] max-md:blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] max-md:w-[300px] h-[500px] max-md:h-[300px] rounded-full bg-indigo-900/8 blur-[140px] max-md:blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 max-sm:px-4 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors min-h-[44px]">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <Link href="/assessment">
            <Button size="sm" glow className="min-h-[44px]">
              Start Assessment
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </nav>

        {/* Hero */}
        <section className="pt-16 max-sm:pt-8 pb-12 max-sm:pb-8 px-6 max-sm:px-4 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 max-sm:px-3 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6 max-sm:mb-4">
              <Sparkles className="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5 text-violet-400" />
              <span className="text-sm max-sm:text-xs font-medium text-violet-300">10 Specialized AI Agents</span>
            </div>

            <h1 className="text-6xl max-md:text-4xl max-sm:text-3xl font-extrabold mb-6 max-sm:mb-4 leading-tight">
              Meet Your{' '}
              <GradientText from="from-violet-400" via="via-purple-400" to="to-pink-400" animate>
                AI Team
              </GradientText>
            </h1>

            <p className="text-xl max-md:text-lg max-sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              10 specialized AI agents working 24/7 to discover your perfect niche,
              build your strategy, and launch your online empire.
            </p>
          </motion.div>
        </section>

        {/* Agent Cards Grid — 3-col desktop, 2-col tablet, 1-col mobile */}
        <section className="px-6 max-sm:px-4 max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6 max-sm:gap-4"
          >
            {AGENTS.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </motion.div>
        </section>

        {/* Flow Diagram */}
        <section className="px-6 max-sm:px-4 max-w-7xl mx-auto">
          <FlowDiagram />
        </section>

        {/* CTA */}
        <section className="px-6 max-sm:px-4 pb-24 max-sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="relative p-12 max-md:p-8 max-sm:p-6 rounded-3xl max-sm:rounded-2xl bg-gradient-to-br from-violet-600/10 via-purple-600/5 to-transparent border border-violet-500/20 overflow-hidden">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-white mb-4">
                  Put All 10 Agents to Work for{' '}
                  <GradientText>You</GradientText>
                </h2>
                <p className="text-base max-sm:text-sm text-zinc-400 mb-8 max-sm:mb-6 max-w-lg mx-auto">
                  Start your free assessment and let our AGI engine analyze your
                  personality, skills, and market data to find your perfect niche.
                </p>
                <Link href="/assessment">
                  <Button size="xl" glow className="min-h-[52px] w-auto max-sm:w-full">
                    Start Free Assessment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
