'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Brain, Target, Layers, Video, Calendar, Globe, BarChart3,
  TrendingUp, DollarSign, ChevronRight, Download, Share2,
  Star, Users, Zap, BookOpen, CheckCircle2, ArrowRight,
  MessageSquare, Play, ShoppingBag, FileText, Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GradientText } from '@/components/ui/gradient-text';
import { ScoreRing } from '@/components/ui/score-ring';
import { ProgressBar } from '@/components/ui/progress-bar';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { cn } from '@/lib/utils';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d } }),
};

// ---- Tabs ----
const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'niches', label: 'Niche Matches', icon: Target },
  { id: 'funnel', label: 'Sales Funnel', icon: Layers },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'content', label: 'Content Strategy', icon: Calendar },
  { id: 'video', label: 'Video Script', icon: Video },
  { id: 'market', label: 'Market Intel', icon: Globe },
];

// ---- Mock Data ----
const MOCK_PROFILE = {
  mbti: 'ENFJ', enneagram: 3, topStrength: 'Communication',
  bigFive: { openness: 82, conscientiousness: 78, extraversion: 85, agreeableness: 74, neuroticism: 32 },
};

const MOCK_NICHES = [
  {
    rank: 1, name: 'AI-Powered Fitness Coaching', score: 97, personalFit: 94, market: 89,
    description: 'Combine your communication skills with the booming AI fitness market to create personalized coaching programs.',
    subNiches: ['AI Workout Plans', 'Nutrition AI Bots', 'Remote PT with AI', 'Wearable Data Coaching'],
    marketSize: '$4.2B', growth: '+18%', competition: 'Medium', entry: 'Low barrier',
  },
  {
    rank: 2, name: 'Digital Productivity Systems', score: 91, personalFit: 88, market: 85,
    description: 'Your organizational strengths and tech affinity align perfectly with teaching productivity systems.',
    subNiches: ['Notion Templates', 'AI Workflow Automation', 'Time Management Courses', 'Digital Minimalism'],
    marketSize: '$2.8B', growth: '+15%', competition: 'High', entry: 'Low barrier',
  },
  {
    rank: 3, name: 'Sustainable Living Education', score: 84, personalFit: 82, market: 79,
    description: 'Your values alignment and teaching ability make you ideal for the growing eco-conscious education space.',
    subNiches: ['Zero Waste Living', 'Eco Product Reviews', 'Sustainable Fashion', 'Green Home Tech'],
    marketSize: '$1.9B', growth: '+22%', competition: 'Low', entry: 'Very low barrier',
  },
];

const MOCK_FUNNEL = [
  { step: 1, name: 'Lead Magnet', title: '"7-Day AI Fitness Challenge"', format: 'Free PDF + Email Sequence', price: 'Free', desc: 'Captures leads with a compelling free challenge. Delivers instant value and builds trust.' },
  { step: 2, name: 'Tripwire', title: '"AI Workout Generator"', format: 'Low-ticket Digital Tool', price: '$27', desc: 'Converts leads into buyers with an irresistible low-price offer that delivers outsized value.' },
  { step: 3, name: 'Core Offer', title: '"AI Fitness Mastery Course"', format: '8-Week Video Course + Community', price: '$297', desc: 'Your main revenue driver. Comprehensive course with weekly coaching calls and community access.' },
  { step: 4, name: 'Premium', title: '"1:1 AI Coaching Program"', format: 'High-Ticket Coaching', price: '$2,497', desc: 'Premium offering for serious clients. Personalized AI coaching plans with direct access to you.' },
];

const MOCK_PRODUCTS = [
  { name: 'AI Workout Generator', format: 'SaaS Tool', price: '$27/mo', desc: 'AI-powered workout plans based on user goals, equipment, and fitness level' },
  { name: 'AI Fitness Mastery', format: 'Video Course', price: '$297', desc: '8-week comprehensive course teaching how to build an AI fitness coaching business' },
  { name: 'Fitness AI Templates', format: 'Template Pack', price: '$47', desc: 'Pre-built Notion + Airtable templates for managing AI fitness clients' },
  { name: 'Coaching Accelerator', format: 'Group Program', price: '$997', desc: '12-week intensive program to launch your AI fitness coaching practice' },
];

const MOCK_CONTENT = [
  { day: 1, platform: 'TikTok', type: 'Reel', hook: '"AI just wrote my client a perfect workout in 10 seconds"' },
  { day: 2, platform: 'Instagram', type: 'Carousel', hook: '"5 ways AI is revolutionizing personal training"' },
  { day: 3, platform: 'YouTube', type: 'Long-form', hook: '"I let AI coach me for 30 days — here\'s what happened"' },
  { day: 4, platform: 'Twitter/X', type: 'Thread', hook: '"The fitness industry is about to change forever. Here\'s why →"' },
  { day: 5, platform: 'TikTok', type: 'Reel', hook: '"My AI fitness bot just outperformed a $200/hr trainer"' },
  { day: 6, platform: 'Instagram', type: 'Story', hook: '"Day in the life of an AI fitness coach"' },
  { day: 7, platform: 'YouTube', type: 'Shorts', hook: '"This AI can predict your ideal workout split"' },
];

const MOCK_SCRIPT = `Welcome to the future of fitness coaching!

I'm [Your Name], and I discovered something that completely changed how I think about personal training.

What if I told you that artificial intelligence can now create workout plans that are MORE personalized than what most human trainers offer?

I know that sounds crazy. But after spending 6 months testing every AI fitness tool on the market, I can tell you — the results speak for themselves.

In this video, I'm going to show you:
- How AI analyzes your body type, goals, and schedule to create the perfect workout
- The 3 AI tools that are disrupting the $4.2 billion fitness industry
- How you can start an AI fitness coaching business with zero certifications
- My exact funnel that generates $15K/month in passive income

Let's dive in...

[Continue for ~60 minutes covering each point with demonstrations, case studies, and actionable steps]`;

// ============================================
// TAB CONTENT COMPONENTS
// ============================================

function OverviewTab() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <GlassCard intensity="medium" className="p-5 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-white">Executive Summary</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Based on your ENFJ personality type, high extraversion, strong communication skills, and passion for health technology,
            our AGI engine identified <strong className="text-violet-300">AI-Powered Fitness Coaching</strong> as your #1 niche match
            with a 97% confidence score. The $4.2B market is growing at 18% annually with medium competition,
            making it an ideal entry point for your unique skill set.
          </p>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.1}>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Your Personality Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <GlassCard intensity="light" className="p-4 sm:p-5 text-center space-y-2">
            <p className="text-[10px] sm:text-xs text-zinc-500">MBTI Type</p>
            <p className="text-2xl sm:text-3xl font-bold text-violet-400">{MOCK_PROFILE.mbti}</p>
            <p className="text-[10px] sm:text-xs text-zinc-500">"The Protagonist"</p>
          </GlassCard>
          <GlassCard intensity="light" className="p-4 sm:p-5 text-center space-y-2">
            <p className="text-[10px] sm:text-xs text-zinc-500">Enneagram</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-400">Type {MOCK_PROFILE.enneagram}</p>
            <p className="text-[10px] sm:text-xs text-zinc-500">"The Achiever"</p>
          </GlassCard>
          <GlassCard intensity="light" className="p-4 sm:p-5 text-center space-y-2">
            <p className="text-[10px] sm:text-xs text-zinc-500">Top Strength</p>
            <p className="text-2xl sm:text-3xl font-bold text-fuchsia-400">{MOCK_PROFILE.topStrength}</p>
            <p className="text-[10px] sm:text-xs text-zinc-500">Key differentiator</p>
          </GlassCard>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.2}>
        <GlassCard intensity="light" className="p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Big Five Personality Traits</h3>
          {Object.entries(MOCK_PROFILE.bigFive).map(([trait, val]) => (
            <div key={trait} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 capitalize">{trait}</span>
                <span className="text-zinc-300">{val}%</span>
              </div>
              <ProgressBar value={val} size="sm" showPercentage={false} />
            </div>
          ))}
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.3}>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Top 3 Niche Matches</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {MOCK_NICHES.map((n, i) => (
            <GlassCard key={n.name} intensity="light" className="p-4 sm:p-5 text-center space-y-3">
              <Badge variant={i === 0 ? 'success' : 'default'} size="sm">#{n.rank}</Badge>
              <ScoreRing score={n.score} size={70} strokeWidth={5} label="Match" delay={0.5 + i * 0.2} />
              <h4 className="text-xs sm:text-sm font-semibold text-white">{n.name}</h4>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function NicheMatchesTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {MOCK_NICHES.map((niche, i) => (
        <motion.div key={niche.name} variants={fadeIn} initial="hidden" animate="visible" custom={i * 0.1}>
          <GlassCard intensity="medium" className="p-5 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <Badge variant={i === 0 ? 'success' : i === 1 ? 'violet' : 'default'}>#{niche.rank} Match</Badge>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-2">{niche.name}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">{niche.description}</p>
              </div>
              <div className="flex justify-center sm:justify-end">
                <ScoreRing score={niche.score} size={80} strokeWidth={6} label="Score" delay={0.3 + i * 0.2} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-zinc-500">Personal Fit</span><span className="text-zinc-300">{niche.personalFit}%</span></div>
                <ProgressBar value={niche.personalFit} size="sm" showPercentage={false} />
                <div className="flex justify-between text-xs"><span className="text-zinc-500">Market Score</span><span className="text-zinc-300">{niche.market}%</span></div>
                <ProgressBar value={niche.market} size="sm" showPercentage={false} gradientFrom="from-purple-500" gradientTo="to-fuchsia-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5"><p className="text-[10px] text-zinc-500">Market Size</p><p className="text-sm font-semibold text-white">{niche.marketSize}</p></div>
                <div className="space-y-0.5"><p className="text-[10px] text-zinc-500">Growth</p><p className="text-sm font-semibold text-green-400">{niche.growth}</p></div>
                <div className="space-y-0.5"><p className="text-[10px] text-zinc-500">Competition</p><p className="text-sm font-semibold text-white">{niche.competition}</p></div>
                <div className="space-y-0.5"><p className="text-[10px] text-zinc-500">Entry</p><p className="text-sm font-semibold text-white">{niche.entry}</p></div>
              </div>
            </div>

            <div>
              <p className="text-xs text-zinc-500 mb-2">Sub-Niches</p>
              <div className="flex flex-wrap gap-2">
                {niche.subNiches.map((sub) => (
                  <Badge key={sub} variant="default" size="sm">{sub}</Badge>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

function SalesFunnelTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <GlassCard intensity="medium" className="p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Your 4-Step Sales Funnel</h3>
          <p className="text-xs sm:text-sm text-zinc-400">Optimized for the AI Fitness Coaching niche. Each step builds trust and increases commitment.</p>
        </GlassCard>
      </motion.div>

      <div className="space-y-3 sm:space-y-4">
        {MOCK_FUNNEL.map((step, i) => (
          <motion.div key={step.step} variants={fadeIn} initial="hidden" animate="visible" custom={0.1 + i * 0.1}>
            <GlassCard intensity="light" className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className={cn(
                  'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold',
                  i === 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                  i === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                  i === 2 ? 'bg-gradient-to-br from-violet-500 to-purple-600' :
                  'bg-gradient-to-br from-amber-500 to-orange-600',
                )}>
                  {step.step}
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Badge variant="default" size="sm">{step.name}</Badge>
                      <h4 className="text-sm sm:text-base font-semibold text-white mt-1">{step.title}</h4>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-violet-400">{step.price}</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-zinc-500">{step.format}</p>
                  <p className="text-xs sm:text-sm text-zinc-400">{step.desc}</p>
                </div>
              </div>
              {i < MOCK_FUNNEL.length - 1 && (
                <div className="flex justify-center py-2">
                  <ChevronRight className="w-5 h-5 text-zinc-700 rotate-90" />
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {MOCK_PRODUCTS.map((product, i) => (
        <motion.div key={product.name} variants={fadeIn} initial="hidden" animate="visible" custom={i * 0.1}>
          <GlassCard intensity="light" className="p-5 sm:p-6 h-full space-y-3">
            <div className="flex items-start justify-between">
              <Badge variant="violet" size="sm">{product.format}</Badge>
              <span className="text-base sm:text-lg font-bold text-white">{product.price}</span>
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-white">{product.name}</h4>
            <p className="text-xs sm:text-sm text-zinc-400">{product.desc}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

function ContentTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <GlassCard intensity="medium" className="p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2">30-Day Content Calendar</h3>
          <p className="text-xs sm:text-sm text-zinc-400">Platform-specific content plan with hooks, formats, and posting schedule. First 7 days shown.</p>
        </GlassCard>
      </motion.div>
      <div className="space-y-2 sm:space-y-3">
        {MOCK_CONTENT.map((item, i) => (
          <motion.div key={i} variants={fadeIn} initial="hidden" animate="visible" custom={i * 0.05}>
            <GlassCard intensity="light" className="p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold text-violet-400">D{item.day}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <Badge variant="default" size="sm">{item.platform}</Badge>
                  <Badge variant="violet" size="sm">{item.type}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1 truncate">{item.hook}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function VideoScriptTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <GlassCard intensity="medium" className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white">AI-Generated Video Script</h3>
              <p className="text-xs sm:text-sm text-zinc-400">60-minute TikTok Live / YouTube script for your niche introduction</p>
            </div>
            <Button variant="primary" size="sm" iconLeft={<Play className="w-4 h-4" />} className="min-h-[44px] w-full sm:w-auto">
              Generate HeyGen Video
            </Button>
          </div>
        </GlassCard>
      </motion.div>
      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.1}>
        <GlassCard intensity="light" className="p-5 sm:p-6">
          <pre className="text-xs sm:text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed font-sans">
            {MOCK_SCRIPT}
          </pre>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function MarketIntelTab() {
  const niche = MOCK_NICHES[0];
  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Market Size', value: niche.marketSize, icon: DollarSign },
            { label: 'Annual Growth', value: niche.growth, icon: TrendingUp },
            { label: 'Competition', value: niche.competition, icon: Users },
            { label: 'Entry Barrier', value: niche.entry, icon: Zap },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeIn} custom={i * 0.08}>
              <GlassCard intensity="light" className="p-4 sm:p-5 space-y-2">
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
                <p className="text-[10px] sm:text-xs text-zinc-500">{stat.label}</p>
                <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.2}>
        <GlassCard intensity="medium" className="p-5 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-white">Competitor Landscape</h3>
          <div className="space-y-3">
            {[
              { name: 'FitAI Pro', audience: '120K', strength: 'App-first approach', weakness: 'No coaching element' },
              { name: 'GymGenius', audience: '85K', strength: 'Strong community', weakness: 'No AI integration' },
              { name: 'TrainSmart AI', audience: '45K', strength: 'Advanced algorithms', weakness: 'Poor marketing' },
            ].map((comp) => (
              <div key={comp.name} className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 rounded-xl bg-white/[0.02]">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-semibold text-white">{comp.name}</span>
                    <Badge variant="default" size="sm">{comp.audience} followers</Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-1">
                    <span className="text-[10px] sm:text-xs text-green-400">✓ {comp.strength}</span>
                    <span className="text-[10px] sm:text-xs text-red-400">✗ {comp.weakness}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.3}>
        <GlassCard intensity="light" className="p-5 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-white">Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            {['AI Personal Training', 'Wearable Tech Coaching', 'Home Gym AI', 'Nutrition AI', 'Recovery Optimization', 'Virtual PT Sessions', 'Fitness App Development', 'AI Body Analysis'].map((topic) => (
              <Badge key={topic} variant="violet" size="sm">{topic}</Badge>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

// ============================================
// MAIN BLUEPRINT PAGE
// ============================================

export default function BlueprintPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const topNiche = MOCK_NICHES[0];

  const TAB_CONTENT: Record<string, React.ReactNode> = {
    overview: <OverviewTab />,
    niches: <NicheMatchesTab />,
    funnel: <SalesFunnelTab />,
    products: <ProductsTab />,
    content: <ContentTab />,
    video: <VideoScriptTab />,
    market: <MarketIntelTab />,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-purple-950/20" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
          <motion.div variants={fadeIn} initial="hidden" animate="visible" className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="min-h-[44px]">← Dashboard</Button>
                </Link>
                <Badge variant="success" dot>Blueprint Ready</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Your <GradientText>Genius Blueprint</GradientText>
              </h1>
              <p className="text-sm sm:text-base text-zinc-400">
                Top match: <strong className="text-white">{topNiche.name}</strong> with {topNiche.score}% confidence
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button variant="secondary" size="sm" iconLeft={<Share2 className="w-4 h-4" />} className="min-h-[44px] flex-1 sm:flex-none">Share</Button>
              <Button variant="secondary" size="sm" iconLeft={<Download className="w-4 h-4" />} className="min-h-[44px] flex-1 sm:flex-none">Export PDF</Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs - scrollable on mobile */}
      <div className="border-b border-white/5 sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-h-[44px] flex-shrink-0',
                  activeTab === tab.id
                    ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]',
                )}
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content - full width on mobile */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {TAB_CONTENT[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
