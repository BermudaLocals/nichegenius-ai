'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, BarChart3, Target, Zap, Video, MessageSquare,
  ChevronRight, Clock, CheckCircle2, ArrowRight, TrendingUp,
  DollarSign, Users, Layers, Rocket, RefreshCw, Play,
  Menu, X,
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

// Desktop Sidebar
function Sidebar() {
  return (
    <aside className="flex max-lg:hidden flex-col w-64 min-h-screen bg-zinc-950 border-r border-white/5 p-6 gap-2">
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
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all min-h-[44px]',
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

// Mobile Header + Drawer
function MobileHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="hidden max-lg:sticky max-lg:block top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm text-white">NicheGenius AI</span>
            </Link>
          </div>
          <Badge variant="success" size="sm" dot className="flex max-sm:hidden">Complete</Badge>
        </div>
      </header>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden max-lg:block"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-zinc-950 border-r border-white/5 p-6 hidden max-lg:block"
            >
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-white">NicheGenius AI</span>
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all min-h-[48px]',
                      item.active
                        ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]',
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ---- Mock Data ----
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

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-8 max-lg:px-6 max-md:px-4 py-8 max-sm:py-6 space-y-8 max-sm:space-y-6">

            {/* Welcome Header */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0}>
              <div className="flex flex-row items-center max-sm:flex-col max-sm:items-start justify-between gap-3">
                <div>
                  <h1 className="text-3xl max-sm:text-2xl font-bold">
                    Welcome back, <GradientText>{MOCK_USER.name}</GradientText>
                  </h1>
                  <p className="text-zinc-500 mt-1 text-sm">Here&apos;s your niche discovery progress</p>
                </div>
                <Badge variant="success" dot className="self-auto max-sm:self-start">Assessment Complete</Badge>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-4 max-lg:grid-cols-2 gap-4 max-sm:gap-3">
              {[
                { label: 'Assessment', value: 100, suffix: '%', icon: Brain, desc: 'Complete' },
                { label: 'Niches Found', value: 3, suffix: '', icon: Target, desc: 'Top matches' },
                { label: 'Products Planned', value: 12, suffix: '', icon: Layers, desc: 'Across 3 niches' },
                { label: 'Revenue Potential', value: 15, suffix: 'K/mo', icon: DollarSign, desc: 'Conservative estimate', format: 'currency' as const },
              ].map((stat, i) => (
                <motion.div key={stat.label} variants={fadeInUp} custom={i * 0.1}>
                  <GlassCard intensity="light" className="p-5 max-sm:p-4 space-y-3 max-sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 max-sm:w-8 max-sm:h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <stat.icon className="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5 text-violet-400" />
                      </div>
                    </div>
                    <div>
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} className="text-2xl max-sm:text-xl font-bold text-white" />
                      <p className="text-xs max-sm:text-[10px] text-zinc-500 mt-0.5">{stat.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Top 3 Niche Matches */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0.3}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg max-sm:text-base font-semibold">Your Top Niche Matches</h2>
                <Link href="/blueprint">
                  <Button variant="ghost" size="sm" iconRight={<ChevronRight className="w-4 h-4" />} className="min-h-[44px]">
                    View Blueprint
                  </Button>
                </Link>
              </div>
              {/* Stack vertically on mobile, 3-col on desktop */}
              <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
                {MOCK_NICHES.map((niche, i) => (
                  <motion.div key={niche.name} variants={fadeInUp} custom={0.4 + i * 0.1}>
                    <GlassCard intensity="medium" className="p-6 max-sm:p-5 space-y-4 h-full">
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
                          size={80}
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
            <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-6 max-sm:gap-4">
              {/* Quick Actions */}
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0.5} className="col-span-1">
                <h2 className="text-lg max-sm:text-base font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3 max-sm:space-y-2">
                  {[
                    { label: 'View Full Blueprint', href: '/blueprint', icon: Target, color: 'from-violet-500 to-purple-600' },
                    { label: 'Retake Assessment', href: '/assessment', icon: RefreshCw, color: 'from-purple-500 to-fuchsia-600' },
                    { label: 'AI Coaching Chat', href: '/dashboard/chat', icon: MessageSquare, color: 'from-fuchsia-500 to-pink-600' },
                    { label: 'Generate AI Video', href: '/dashboard/video', icon: Play, color: 'from-pink-500 to-rose-600' },
                  ].map((action) => (
                    <Link key={action.label} href={action.href}>
                      <GlassCard intensity="light" className="p-4 max-sm:p-3.5 flex items-center gap-3 group cursor-pointer hover:border-violet-500/20 transition-all min-h-[52px]">
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
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0.6} className="col-span-2 max-lg:col-span-1">
                <h2 className="text-lg max-sm:text-base font-semibold mb-4">Recent Activity</h2>
                <GlassCard intensity="light" className="p-6 max-sm:p-4">
                  <div className="space-y-6 max-sm:space-y-4">
                    {MOCK_ACTIVITY.map((item, i) => (
                      <div key={i} className="flex gap-4 max-sm:gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-4 h-4 text-violet-400" />
                          </div>
                          {i < MOCK_ACTIVITY.length - 1 && <div className="w-px flex-1 bg-white/5 mt-2" />}
                        </div>
                        <div className="pb-6 max-sm:pb-4 min-w-0">
                          <p className="text-sm max-sm:text-xs text-zinc-300">{item.text}</p>
                          <p className="text-xs max-sm:text-[10px] text-zinc-600 mt-1 flex items-center gap-1">
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
              <h2 className="text-lg max-sm:text-base font-semibold mb-4">Market Intelligence — {MOCK_NICHES[0].name}</h2>
              <GlassCard intensity="medium" className="p-6 max-sm:p-4">
                {/* Scrollable on mobile */}
                <div className="grid grid-cols-4 max-lg:grid-cols-2 gap-6 max-sm:gap-4">
                  {[
                    { label: 'Market Size', value: '$4.2B', change: '+12% YoY' },
                    { label: 'Avg. Competition', value: 'Medium', change: '347 competitors' },
                    { label: 'Trending Topics', value: '24', change: 'This month' },
                    { label: 'Entry Difficulty', value: 'Low', change: 'Good opportunity' },
                  ].map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <p className="text-xs max-sm:text-[10px] text-zinc-500">{stat.label}</p>
                      <p className="text-xl max-sm:text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-xs max-sm:text-[10px] text-violet-400">{stat.change}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
}
