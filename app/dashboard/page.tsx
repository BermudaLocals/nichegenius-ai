'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain, BarChart3, Target, Zap, Video, MessageSquare,
  ChevronRight, Clock, CheckCircle2, ArrowRight, TrendingUp,
  DollarSign, Users, Layers, Rocket, RefreshCw, Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GradientText } from '@/components/ui/gradient-text';
import { ScoreRing } from '@/components/ui/score-ring';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d } }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

// ---- Sidebar ----
const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3, active: true },
  { label: 'Assessment', href: '/assessment', icon: Brain },
  { label: 'Blueprint', href: '/blueprint', icon: Target },
  { label: 'Market Intel', href: '/dashboard/market', icon: TrendingUp },
  { label: 'AI Coach', href: '/dashboard/chat', icon: MessageSquare },
  { label: 'Video Studio', href: '/dashboard/video', icon: Video },
];

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-zinc-950 border-r border-white/5 p-6 gap-2">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white">NicheGenius AI</span>
      </Link>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
            item.active
              ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]',
          )}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </Link>
      ))}
    </aside>
  );
}

// ---- Mock Data (replace with real data from API/Clerk) ----
const MOCK_USER = { name: 'Alex', assessmentComplete: true };
const MOCK_NICHES = [
  { name: 'AI-Powered Fitness Coaching', score: 97, personalFit: 94, market: 89, color: '#8b5cf6' },
  { name: 'Digital Productivity Systems', score: 91, personalFit: 88, market: 85, color: '#a855f7' },
  { name: 'Sustainable Living Education', score: 84, personalFit: 82, market: 79, color: '#d946ef' },
];
const MOCK_ACTIVITY = [
  { time: '2 hours ago', text: 'Blueprint generated for AI-Powered Fitness Coaching', icon: Target },
  { time: '3 hours ago', text: 'Assessment completed — 155/155 questions answered', icon: CheckCircle2 },
  { time: '1 day ago', text: 'Account created', icon: Users },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Welcome Header */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, <GradientText>{MOCK_USER.name}</GradientText>
                </h1>
                <p className="text-zinc-500 mt-1">Here&apos;s your niche discovery progress</p>
              </div>
              <Badge variant="success" dot>Assessment Complete</Badge>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Assessment', value: 100, suffix: '%', icon: Brain, desc: 'Complete' },
              { label: 'Niches Found', value: 3, suffix: '', icon: Target, desc: 'Top matches' },
              { label: 'Products Planned', value: 12, suffix: '', icon: Layers, desc: 'Across 3 niches' },
              { label: 'Revenue Potential', value: 15, suffix: 'K/mo', icon: DollarSign, desc: 'Conservative estimate', format: 'currency' as const },
            ].map((stat, i) => (
              <motion.div key={stat.label} variants={fadeInUp} custom={i * 0.1}>
                <GlassCard intensity="light" className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-violet-400" />
                    </div>
                  </div>
                  <div>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} className="text-2xl font-bold text-white" />
                    <p className="text-xs text-zinc-500 mt-0.5">{stat.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Top 3 Niche Matches */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0.3}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Top Niche Matches</h2>
              <Link href="/blueprint">
                <Button variant="ghost" size="sm" iconRight={<ChevronRight className="w-4 h-4" />}>
                  View Blueprint
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {MOCK_NICHES.map((niche, i) => (
                <motion.div key={niche.name} variants={fadeInUp} custom={0.4 + i * 0.1}>
                  <GlassCard intensity="medium" className="p-6 space-y-4 h-full">
                    <div className="flex items-start justify-between">
                      <Badge variant={i === 0 ? 'success' : i === 1 ? 'violet' : 'default'} size="sm">
                        #{i + 1} Match
                      </Badge>
                      <span className="text-xs text-zinc-500">#{i + 1}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm">{niche.name}</h3>
                    <div className="flex justify-center">
                      <ScoreRing
                        score={niche.score}
                        size={90}
                        strokeWidth={6}
                        label="Match"
                        delay={0.5 + i * 0.2}
                        gradientFrom={niche.color}
                        gradientTo={niche.color + '80'}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Personal Fit</span>
                        <span className="text-zinc-300">{niche.personalFit}%</span>
                      </div>
                      <ProgressBar value={niche.personalFit} size="sm" showPercentage={false} />
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Market Score</span>
                        <span className="text-zinc-300">{niche.market}%</span>
                      </div>
                      <ProgressBar value={niche.market} size="sm" showPercentage={false} gradientFrom="from-purple-500" gradientTo="to-fuchsia-500" />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions + Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0.5} className="lg:col-span-1">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { label: 'View Full Blueprint', href: '/blueprint', icon: Target, color: 'from-violet-500 to-purple-600' },
                  { label: 'Retake Assessment', href: '/assessment', icon: RefreshCw, color: 'from-purple-500 to-fuchsia-600' },
                  { label: 'AI Coaching Chat', href: '/dashboard/chat', icon: MessageSquare, color: 'from-fuchsia-500 to-pink-600' },
                  { label: 'Generate AI Video', href: '/dashboard/video', icon: Play, color: 'from-pink-500 to-rose-600' },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <GlassCard intensity="light" className="p-4 flex items-center gap-3 group cursor-pointer hover:border-violet-500/20 transition-all">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors flex-1">{action.label}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0.6} className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <GlassCard intensity="light" className="p-6">
                <div className="space-y-6">
                  {MOCK_ACTIVITY.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-violet-400" />
                        </div>
                        {i < MOCK_ACTIVITY.length - 1 && <div className="w-px flex-1 bg-white/5 mt-2" />}
                      </div>
                      <div className="pb-6">
                        <p className="text-sm text-zinc-300">{item.text}</p>
                        <p className="text-xs text-zinc-600 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Market Intelligence Summary */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0.7}>
            <h2 className="text-lg font-semibold mb-4">Market Intelligence — {MOCK_NICHES[0].name}</h2>
            <GlassCard intensity="medium" className="p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Market Size', value: '$4.2B', change: '+12% YoY' },
                  { label: 'Avg. Competition', value: 'Medium', change: '347 competitors' },
                  { label: 'Trending Topics', value: '24', change: 'This month' },
                  { label: 'Entry Difficulty', value: 'Low', change: 'Good opportunity' },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-xs text-zinc-500">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-violet-400">{stat.change}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
