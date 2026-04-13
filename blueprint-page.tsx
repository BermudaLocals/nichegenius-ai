'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain, Target, Layers, Video, Calendar, Globe, BarChart3,
  TrendingUp, DollarSign, ChevronRight, Download, Share2,
  Star, Users, Zap, BookOpen, CheckCircle2, ArrowRight,
  MessageSquare, Play, ShoppingBag, FileText, Mail,
  Rocket, Settings, UserCheck, Palette, Package, AlertCircle,
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
  { id: 'launch', label: 'Launch System', icon: Rocket },
  { id: 'content', label: 'Content Strategy', icon: Calendar },
  { id: 'video', label: 'Video Script', icon: Video },
  { id: 'market', label: 'Market Intel', icon: Globe },
];

// ---- Types ----
type NicheMatch = {
  rank: number;
  name: string;
  score: number;
  personalFit: number;
  market: number;
  description: string;
  subNiches: string[];
  marketSize: string;
  growth: string;
  competition: string;
  entry: string;
};

type Personality = {
  mbti?: string;
  enneagram?: string;
  topStrength?: string;
  bigFive?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
};

type AssessmentResults = {
  success: boolean;
  personality: Personality;
  nicheMatches: NicheMatch[];
  answersCount: number;
  timestamp: string;
};

// ---- Fallback placeholder data (shown when no real results yet) ----
const PLACEHOLDER_PROFILE: Personality = {
  mbti: 'XXXX',
  enneagram: '—',
  topStrength: 'Your Top Strength',
  bigFive: { openness: 75, conscientiousness: 70, extraversion: 65, agreeableness: 72, neuroticism: 40 },
};

const PLACEHOLDER_NICHES: NicheMatch[] = [
  {
    rank: 1, name: 'Your Top Niche', score: 95, personalFit: 92, market: 88,
    description: 'Your #1 niche match based on your personality, skills, and market opportunity.',
    subNiches: ['Sub-Niche A', 'Sub-Niche B', 'Sub-Niche C', 'Sub-Niche D'],
    marketSize: '$X.XB', growth: '+XX%', competition: 'Medium', entry: 'Low barrier',
  },
  {
    rank: 2, name: 'Your Second Niche', score: 88, personalFit: 85, market: 82,
    description: 'A strong alternative niche that leverages your secondary skills and interests.',
    subNiches: ['Sub-Niche E', 'Sub-Niche F', 'Sub-Niche G', 'Sub-Niche H'],
    marketSize: '$X.XB', growth: '+XX%', competition: 'High', entry: 'Low barrier',
  },
  {
    rank: 3, name: 'Your Third Niche', score: 81, personalFit: 78, market: 76,
    description: 'An emerging opportunity that matches your values and long-term vision.',
    subNiches: ['Sub-Niche I', 'Sub-Niche J', 'Sub-Niche K', 'Sub-Niche L'],
    marketSize: '$X.XB', growth: '+XX%', competition: 'Low', entry: 'Very low barrier',
  },
];

// ---- Static content (not dependent on results) ----
const PLACEHOLDER_FUNNEL = [
  { step: 1, name: 'Free Entry', title: '"Your Free Lead Magnet"', format: 'Free PDF / Challenge / Mini-Course', price: 'Free', desc: 'Captures leads with a compelling free offer. Delivers instant value and builds trust with your ideal audience.' },
  { step: 2, name: 'Low-Ticket', title: '"Your Tripwire Product"', format: 'Low-Ticket Digital Product', price: '$17–$47', desc: 'Converts leads into paying customers with an irresistible low-price offer that delivers outsized value.' },
  { step: 3, name: 'Core Offer', title: '"Your Core Product"', format: 'Video Course / Program / Membership', price: '$97–$497', desc: 'Your main revenue driver. A comprehensive product that fully solves your customer\'s core problem.' },
  { step: 4, name: 'Premium', title: '"Your Premium Offer"', format: 'High-Ticket Coaching / Program', price: '$997–$2,997', desc: 'Premium offering for serious clients. Personalized support, group coaching, or done-for-you services.' },
  { step: 5, name: 'Recurring', title: '"Your Recurring Revenue"', format: 'Membership / Subscription / Community', price: '$27–$97/mo', desc: 'Predictable monthly income through ongoing access, community, updates, or subscription services.' },
];

const PLACEHOLDER_PRODUCTS = [
  { name: 'Your Digital Product', format: 'eBook / Template Pack', price: '$27–$47', desc: 'A digital product that solves a specific problem for your ideal client — templates, guides, or toolkits' },
  { name: 'Your Video Course', format: 'Video Course', price: '$97–$297', desc: 'A comprehensive course teaching your expertise step-by-step with actionable lessons and resources' },
  { name: 'Your Template Collection', format: 'Template Pack', price: '$37–$67', desc: 'Pre-built templates, swipe files, or systems your audience can plug in and use immediately' },
  { name: 'Your Group Program', format: 'Group Program', price: '$497–$997', desc: 'A structured group coaching program with live calls, accountability, and community support' },
];

const PLACEHOLDER_CONTENT = [
  { day: 1, platform: 'TikTok', type: 'Reel', hook: '"[Your attention-grabbing hook about your niche transformation]"' },
  { day: 2, platform: 'Instagram', type: 'Carousel', hook: '"[X ways to solve {your audience\'s biggest pain point}]"' },
  { day: 3, platform: 'YouTube', type: 'Long-form', hook: '"[I tried {your method} for 30 days — here\'s what happened]"' },
  { day: 4, platform: 'Twitter/X', type: 'Thread', hook: '"[Your industry] is about to change forever. Here\'s why →"' },
  { day: 5, platform: 'TikTok', type: 'Reel', hook: '"[Quick tip that delivers immediate value to your audience]"' },
  { day: 6, platform: 'Instagram', type: 'Story', hook: '"[Day in the life of a {your niche} creator]"' },
  { day: 7, platform: 'YouTube', type: 'Shorts', hook: '"[One surprising fact about {your niche topic}]"' },
];

const PLACEHOLDER_SCRIPT = `Welcome to [Your Channel / Brand Name]!

I'm [Your Name], and today I want to share something that completely changed how I think about [your niche topic].

What if I told you that [your core promise / transformation]?

I know that sounds ambitious. But after [your experience / journey], I can tell you — the results speak for themselves.

In this video, I'm going to show you:
- [Key point 1: The problem your audience faces]
- [Key point 2: Your unique solution or method]
- [Key point 3: How to get started today]
- [Key point 4: Results they can expect]

Let's dive in...

[Continue for your target video length covering each point with demonstrations, examples, and actionable steps]`;

const LAUNCH_STAGES = [
  {
    stage: 1, name: 'Tool Setup', icon: Settings,
    color: 'from-blue-500 to-cyan-600',
    description: 'Set up your AI-powered toolkit for rapid product creation and publishing.',
    tasks: ['Create ChatGPT account (free or Plus)', 'Set up Canva account (free or Pro)', 'Choose your storefront: Stan Store or Beacons', 'Connect payment processing'],
  },
  {
    stage: 2, name: 'Client Clarity', icon: UserCheck,
    color: 'from-violet-500 to-purple-600',
    description: 'Define your ideal client avatar so every product you create speaks directly to their needs.',
    tasks: ['Identify your ideal client\'s biggest pain point', 'Define their desired transformation', 'Map their current situation vs. dream outcome', 'Create your client avatar document'],
  },
  {
    stage: 3, name: 'Product Creation', icon: Package,
    color: 'from-fuchsia-500 to-pink-600',
    description: 'Build a digital product that solves your client\'s core problem using AI-assisted creation.',
    tasks: ['Choose your product format (eBook, course, templates)', 'Use ChatGPT to outline and draft content', 'Structure content into actionable modules', 'Add bonuses and quick-win resources'],
  },
  {
    stage: 4, name: 'Design + Publish', icon: Palette,
    color: 'from-amber-500 to-orange-600',
    description: 'Design professional visuals in Canva and publish on your chosen storefront.',
    tasks: ['Design product cover and mockups in Canva', 'Create sales page graphics and thumbnails', 'Set up product listing on Stan Store / Beacons', 'Launch and share with your audience'],
  },
];

const CREATION_TRACKS = [
  {
    track: 1, name: 'Beginner (Manual)', badge: 'Easy Start',
    description: 'Write and format everything yourself using ChatGPT for content and Canva for design.',
    tools: ['ChatGPT (content writing)', 'Canva (manual design)', 'Google Docs (drafting)'],
    time: '5–7 days', difficulty: 'Beginner',
  },
  {
    track: 2, name: 'Fast (Canva AI)', badge: 'Recommended',
    description: 'Leverage Canva\'s AI features for rapid design and layout.',
    tools: ['ChatGPT (content)', 'Canva AI (auto-design)', 'Magic Write (copy)'],
    time: '2–3 days', difficulty: 'Intermediate',
  },
  {
    track: 3, name: 'Advanced (Interactive App)', badge: 'Pro Level',
    description: 'Build an interactive digital product or app experience. Highest value, highest perceived worth.',
    tools: ['ChatGPT + Code Interpreter', 'Canva (branding)', 'Web builder / No-code tool'],
    time: '7–14 days', difficulty: 'Advanced',
  },
];

const SALES_LADDER = [
  { level: 1, name: 'Free Entry', price: '$0', color: 'from-green-500 to-emerald-600', desc: 'Lead magnet, free challenge, or mini-guide to build your email list and establish trust.', examples: 'Free PDF, Checklist, 3-Day Challenge, Quiz' },
  { level: 2, name: 'Low-Ticket', price: '$7–$47', color: 'from-blue-500 to-cyan-600', desc: 'Small, focused product that converts subscribers into paying customers.', examples: 'Template pack, Mini-course, Toolkit, Swipe file' },
  { level: 3, name: 'Core Offer', price: '$97–$497', color: 'from-violet-500 to-purple-600', desc: 'Your main product that delivers the full transformation your audience needs.', examples: 'Full course, Comprehensive program, Membership' },
  { level: 4, name: 'Premium Offer', price: '$997–$2,997', color: 'from-fuchsia-500 to-pink-600', desc: 'High-touch, premium experience for clients who want accelerated results.', examples: 'Group coaching, Done-with-you program, VIP access' },
  { level: 5, name: 'Recurring Revenue', price: '$27–$97/mo', color: 'from-amber-500 to-orange-600', desc: 'Predictable monthly income through ongoing value delivery.', examples: 'Community membership, Subscription box, Monthly content' },
];

// ============================================
// TAB CONTENT COMPONENTS
// ============================================

function OverviewTab({ profile, niches }: { profile: Personality; niches: NicheMatch[] }) {
  return (
    <div className="space-y-8 max-lg:space-y-6">
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <GlassCard intensity="medium" className="p-6 max-md:p-5 space-y-4">
          <h3 className="text-lg max-md:text-base font-semibold text-white">Executive Summary</h3>
          <p className="text-sm max-md:text-xs text-zinc-400 leading-relaxed">
            Based on your personality assessment results, skill profile, and market analysis,
            our AGI engine has identified your <strong className="text-violet-300">top niche matches</strong> with
            confidence scores. Your unique combination of strengths, interests, and experience aligns
            with high-growth markets that match your entrepreneurial DNA.
          </p>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.1}>
        <h3 className="text-lg max-md:text-base font-semibold text-white mb-4">Your Personality Profile</h3>
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 max-md:gap-3">
          <GlassCard intensity="light" className="p-5 max-md:p-4 text-center space-y-2">
            <p className="text-xs max-sm:text-[10px] text-zinc-500">MBTI Type</p>
            <p className="text-3xl max-md:text-2xl font-bold text-violet-400">{profile.mbti || 'XXXX'}</p>
            <p className="text-xs max-sm:text-[10px] text-zinc-500">Your personality type</p>
          </GlassCard>
          <GlassCard intensity="light" className="p-5 max-md:p-4 text-center space-y-2">
            <p className="text-xs max-sm:text-[10px] text-zinc-500">Enneagram</p>
            <p className="text-3xl max-md:text-2xl font-bold text-purple-400">Type {profile.enneagram || '—'}</p>
            <p className="text-xs max-sm:text-[10px] text-zinc-500">Your core motivation</p>
          </GlassCard>
          <GlassCard intensity="light" className="p-5 max-md:p-4 text-center space-y-2">
            <p className="text-xs max-sm:text-[10px] text-zinc-500">Top Strength</p>
            <p className="text-xl max-md:text-lg font-bold text-fuchsia-400">{profile.topStrength || 'Your Top Strength'}</p>
            <p className="text-xs max-sm:text-[10px] text-zinc-500">Key differentiator</p>
          </GlassCard>
        </div>
      </motion.div>

      {profile.bigFive && (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.2}>
          <GlassCard intensity="light" className="p-6 max-md:p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Big Five Personality Traits</h3>
            {Object.entries(profile.bigFive).map(([trait, val]) => (
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
      )}

      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.3}>
        <h3 className="text-lg max-md:text-base font-semibold text-white mb-4">Top 3 Niche Matches</h3>
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 max-md:gap-3">
          {niches.map((n, i) => (
            <GlassCard key={n.name} intensity="light" className="p-5 max-md:p-4 text-center space-y-3">
              <Badge variant={i === 0 ? 'success' : 'default'} size="sm">#{n.rank}</Badge>
              <ScoreRing score={n.score} size={70} strokeWidth={5} label="Match" delay={0.5 + i * 0.2} />
              <h4 className="text-sm max-md:text-xs font-semibold text-white">{n.name}</h4>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function NicheMatchesTab({ niches }: { niches: NicheMatch[] }) {
  return (
    <div className="space-y-6 max-md:space-y-4">
      {niches.map((niche, i) => (
        <motion.div key={niche.name} variants={fadeIn} initial="hidden" animate="visible" custom={i * 0.1}>
          <GlassCard intensity="medium" className="p-6 max-md:p-5 space-y-6 max-md:space-y-4">
            <div className="flex items-start justify-between gap-4 max-sm:flex-col">
              <div className="flex-1">
                <Badge variant={i === 0 ? 'success' : i === 1 ? 'violet' : 'default'}>#{niche.rank} Match</Badge>
                <h3 className="text-xl max-md:text-lg font-bold text-white mt-2">{niche.name}</h3>
                <p className="text-sm max-md:text-xs text-zinc-400 mt-1">{niche.description}</p>
              </div>
              <div className="flex justify-end max-sm:justify-center">
                <ScoreRing score={niche.score} size={80} strokeWidth={6} label="Score" delay={0.3 + i * 0.2} />
              </div>
            </div>

            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
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
    <div className="space-y-6 max-md:space-y-4">
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <GlassCard intensity="medium" className="p-6 max-md:p-5">
          <h3 className="text-lg max-md:text-base font-semibold text-white mb-2">Your 5-Level Sales Ladder</h3>
          <p className="text-sm max-md:text-xs text-zinc-400">A complete revenue system from free entry to recurring income. Each level builds trust and increases customer lifetime value.</p>
        </GlassCard>
      </motion.div>

      <div className="space-y-4 max-md:space-y-3">
        {PLACEHOLDER_FUNNEL.map((step, i) => (
          <motion.div key={step.step} variants={fadeIn} initial="hidden" animate="visible" custom={0.1 + i * 0.1}>
            <GlassCard intensity="light" className="p-6 max-md:p-5">
              <div className="flex items-start gap-4 max-sm:flex-col max-sm:gap-3">
                <div className={cn(
                  'w-12 h-12 max-md:w-10 max-md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold',
                  i === 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                  i === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                  i === 2 ? 'bg-gradient-to-br from-violet-500 to-purple-600' :
                  i === 3 ? 'bg-gradient-to-br from-fuchsia-500 to-pink-600' :
                  'bg-gradient-to-br from-amber-500 to-orange-600',
                )}>
                  {step.step}
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center justify-between gap-2 max-sm:flex-col max-sm:items-start">
                    <div>
                      <Badge variant="default" size="sm">{step.name}</Badge>
                      <h4 className="text-base max-md:text-sm font-semibold text-white mt-1">{step.title}</h4>
                    </div>
                    <span className="text-xl max-md:text-lg font-bold text-violet-400">{step.price}</span>
                  </div>
                  <p className="text-xs max-sm:text-[10px] text-zinc-500">{step.format}</p>
                  <p className="text-sm max-md:text-xs text-zinc-400">{step.desc}</p>
                </div>
              </div>
              {i < PLACEHOLDER_FUNNEL.length - 1 && (
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
    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-3">
      {PLACEHOLDER_PRODUCTS.map((product, i) => (
        <motion.div key={product.name} variants={fadeIn} initial="hidden" animate="visible" custom={i * 0.1}>
          <GlassCard intensity="light" className="p-6 max-md:p-5 h-full space-y-3">
            <div className="flex items-start justify-between">
              <Badge variant="violet" size="sm">{product.format}</Badge>
              <span className="text-lg max-md:text-base font-bold text-white">{product.price}</span>
            </div>
            <h4 className="text-base max-md:text-sm font-semibold text-white">{product.name}</h4>
            <p className="text-sm max-md:text-xs text-zinc-400">{product.desc}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

function LaunchSystemTab() {
  return (
    <div className="space-y-8 max-lg:space-y-6">
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <GlassCard intensity="medium" className="p-6 max-md:p-5">
          <h3 className="text-lg max-md:text-base font-semibold text-white mb-2">AI Product Launch System — 4-Stage Workflow</h3>
          <p className="text-sm max-md:text-xs text-zinc-400">Follow these four stages to go from zero to a published digital product using AI tools.</p>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
        {LAUNCH_STAGES.map((stage, i) => (
          <motion.div key={stage.stage} variants={fadeIn} initial="hidden" animate="visible" custom={0.1 + i * 0.1}>
            <GlassCard intensity="light" className="p-6 max-md:p-5 h-full space-y-4">
              <div className={cn('w-12 h-12 max-md:w-10 max-md:h-10 rounded-xl flex items-center justify-center', `bg-gradient-to-br ${stage.color}`)}>
                <stage.icon className="w-6 h-6 max-md:w-5 max-md:h-5 text-white" />
              </div>
              <div>
                <Badge variant="violet" size="sm">Stage {stage.stage}</Badge>
                <h4 className="text-base max-md:text-sm font-bold text-white mt-2">{stage.name}</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{stage.description}</p>
              <ul className="space-y-2">
                {stage.tasks.map((task, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.3}>
        <h3 className="text-lg max-md:text-base font-semibold text-white mb-4">Choose Your Creation Track</h3>
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
          {CREATION_TRACKS.map((track, i) => (
            <GlassCard key={track.track} intensity={i === 1 ? 'medium' : 'light'} className={cn('p-6 max-md:p-5 h-full space-y-4', i === 1 && 'ring-1 ring-violet-500/30')}>
              <div className="flex items-center justify-between">
                <Badge variant={i === 1 ? 'success' : 'default'} size="sm">{track.badge}</Badge>
                <span className="text-xs text-zinc-500">Track {track.track}</span>
              </div>
              <h4 className="text-base max-md:text-sm font-bold text-white">{track.name}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{track.description}</p>
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Tools Used</p>
                {track.tools.map((tool) => (
                  <div key={tool} className="flex items-center gap-2 text-xs text-zinc-300">
                    <Zap className="w-3 h-3 text-violet-400 flex-shrink-0" />
                    <span>{tool}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-zinc-500">Timeline</p>
                  <p className="text-xs font-semibold text-white">{track.time}</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[10px] text-zinc-500">Difficulty</p>
                  <p className="text-xs font-semibold text-white">{track.difficulty}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.4}>
        <h3 className="text-lg max-md:text-base font-semibold text-white mb-4">5-Level Sales Ladder</h3>
        <GlassCard intensity="medium" className="p-6 max-md:p-5 space-y-1">
          {SALES_LADDER.map((level, i) => (
            <div key={level.level} className="flex items-stretch gap-4 max-sm:flex-col max-sm:gap-2">
              <div className="flex flex-col items-center max-sm:flex-row max-sm:gap-3">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm', `bg-gradient-to-br ${level.color}`)}>
                  {level.level}
                </div>
                {i < SALES_LADDER.length - 1 && <div className="w-0.5 flex-1 bg-white/5 my-1 max-sm:hidden" />}
              </div>
              <div className="flex-1 pb-6 max-sm:pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-sm font-semibold text-white">{level.name}</h4>
                  <span className="text-sm font-bold text-violet-400">{level.price}</span>
                </div>
                <p className="text-xs text-zinc-400 mb-2">{level.desc}</p>
                <p className="text-[10px] text-zinc-500"><span className="text-zinc-400">Examples:</span> {level.examples}</p>
              </div>
            </div>
          ))}
        </GlassCard>
      </motion.div>
    </div>
  );
}

function ContentTab() {
  return (
    <div className="space-y-6 max-md:space-y-4">
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <GlassCard intensity="medium" className="p-6 max-md:p-5">
          <h3 className="text-lg max-md:text-base font-semibold text-white mb-2">30-Day Content Calendar</h3>
          <p className="text-sm max-md:text-xs text-zinc-400">Platform-specific content plan with hooks, formats, and posting schedule. First 7 days shown.</p>
        </GlassCard>
      </motion.div>
      <div className="space-y-3 max-md:space-y-2">
        {PLACEHOLDER_CONTENT.map((item, i) => (
          <motion.div key={i} variants={fadeIn} initial="hidden" animate="visible" custom={i * 0.05}>
            <GlassCard intensity="light" className="p-4 max-md:p-3.5 flex items-center gap-4 max-md:gap-3">
              <div className="w-10 h-10 max-md:w-9 max-md:h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm max-md:text-xs font-bold text-violet-400">D{item.day}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 max-md:gap-1.5 flex-wrap">
                  <Badge variant="default" size="sm">{item.platform}</Badge>
                  <Badge variant="violet" size="sm">{item.type}</Badge>
                </div>
                <p className="text-sm max-md:text-xs text-zinc-300 mt-1 truncate">{item.hook}</p>
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
    <div className="space-y-6 max-md:space-y-4">
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <GlassCard intensity="medium" className="p-6 max-md:p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 max-sm:flex-col">
            <div>
              <h3 className="text-lg max-md:text-base font-semibold text-white">AI-Generated Video Script</h3>
              <p className="text-sm max-md:text-xs text-zinc-400">Customizable video script template for your niche introduction</p>
            </div>
            <Button variant="primary" size="sm" iconLeft={<Play className="w-4 h-4" />} className="min-h-[44px] max-sm:w-full">
              Generate HeyGen Video
            </Button>
          </div>
        </GlassCard>
      </motion.div>
      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.1}>
        <GlassCard intensity="light" className="p-6 max-md:p-5">
          <pre className="text-sm max-md:text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed font-sans">
            {PLACEHOLDER_SCRIPT}
          </pre>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function MarketIntelTab({ niches }: { niches: NicheMatch[] }) {
  const niche = niches[0];
  return (
    <div className="space-y-6 max-md:space-y-4">
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 max-md:gap-3">
          {[
            { label: 'Market Size', value: niche.marketSize, icon: DollarSign },
            { label: 'Annual Growth', value: niche.growth, icon: TrendingUp },
            { label: 'Competition', value: niche.competition, icon: Users },
            { label: 'Entry Barrier', value: niche.entry, icon: Zap },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeIn} custom={i * 0.08}>
              <GlassCard intensity="light" className="p-5 max-md:p-4 space-y-2">
                <stat.icon className="w-5 h-5 max-md:w-4 max-md:h-4 text-violet-400" />
                <p className="text-xs max-sm:text-[10px] text-zinc-500">{stat.label}</p>
                <p className="text-xl max-md:text-lg font-bold text-white">{stat.value}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.2}>
        <GlassCard intensity="medium" className="p-6 max-md:p-5 space-y-4">
          <h3 className="text-lg max-md:text-base font-semibold text-white">Competitor Landscape</h3>
          <div className="space-y-3">
            {[
              { name: 'Competitor A', audience: 'XXK', strength: 'Strong content strategy', weakness: 'No community element' },
              { name: 'Competitor B', audience: 'XXK', strength: 'Large engaged community', weakness: 'Outdated product offerings' },
              { name: 'Competitor C', audience: 'XXK', strength: 'Innovative product format', weakness: 'Weak marketing presence' },
            ].map((comp) => (
              <div key={comp.name} className="flex items-center gap-4 max-md:gap-3 p-3 rounded-xl bg-white/[0.02]">
                <div className="w-10 h-10 max-md:w-9 max-md:h-9 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm max-md:text-xs font-semibold text-white">{comp.name}</span>
                    <Badge variant="default" size="sm">{comp.audience} followers</Badge>
                  </div>
                  <div className="flex gap-4 max-sm:flex-col max-sm:gap-1 mt-1">
                    <span className="text-xs max-sm:text-[10px] text-green-400">✓ {comp.strength}</span>
                    <span className="text-xs max-sm:text-[10px] text-red-400">✗ {comp.weakness}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.3}>
        <GlassCard intensity="light" className="p-6 max-md:p-5 space-y-4">
          <h3 className="text-lg max-md:text-base font-semibold text-white">Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            {['Niche Trend 1', 'Niche Trend 2', 'Niche Trend 3', 'Emerging Topic A', 'Emerging Topic B', 'Growth Area 1', 'Growth Area 2', 'Hot Topic'].map((topic) => (
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);

  // Load results from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('nichegenius_results');
      if (stored) {
        const parsed: AssessmentResults = JSON.parse(stored);
        if (parsed.success && parsed.nicheMatches && parsed.nicheMatches.length > 0) {
          setResults(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load results from sessionStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use real results if available, otherwise use placeholders
  const profile = results?.personality || PLACEHOLDER_PROFILE;
  const niches = results?.nicheMatches?.length ? results.nicheMatches : PLACEHOLDER_NICHES;
  const topNiche = niches[0];
  const isRealData = !!results;

  const TAB_CONTENT: Record<string, React.ReactNode> = {
    overview: <OverviewTab profile={profile} niches={niches} />,
    niches: <NicheMatchesTab niches={niches} />,
    funnel: <SalesFunnelTab />,
    products: <ProductsTab />,
    launch: <LaunchSystemTab />,
    content: <ContentTab />,
    video: <VideoScriptTab />,
    market: <MarketIntelTab niches={niches} />,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-violet-500 animate-spin mx-auto" />
          <p className="text-zinc-400 text-sm">Loading your blueprint...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-purple-950/20" />
        <div className="max-w-6xl mx-auto px-8 max-lg:px-6 max-md:px-4 py-12 max-md:py-8 relative">
          <motion.div variants={fadeIn} initial="hidden" animate="visible" className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start max-md:gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="min-h-[44px]">← Dashboard</Button>
                </Link>
                {isRealData
                  ? <Badge variant="success" dot>Blueprint Ready</Badge>
                  : <Badge variant="default" dot>Sample Blueprint</Badge>
                }
              </div>
              <h1 className="text-4xl max-lg:text-3xl max-md:text-2xl font-bold">
                Your <GradientText>Genius Blueprint</GradientText>
              </h1>
              <p className="text-base max-md:text-sm text-zinc-400">
                Top match: <strong className="text-white">{topNiche.name}</strong> with {topNiche.score}% confidence
              </p>
              {!isRealData && (
                <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 w-fit">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Showing sample data. <Link href="/assessment" className="underline underline-offset-2 hover:text-amber-300">Take the assessment</Link> to see your real results.</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 max-md:gap-2 max-md:w-full">
              <Button variant="secondary" size="sm" iconLeft={<Share2 className="w-4 h-4" />} className="min-h-[44px] max-md:flex-1">Share</Button>
              <Button variant="secondary" size="sm" iconLeft={<Download className="w-4 h-4" />} className="min-h-[44px] max-md:flex-1">Export PDF</Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-8 max-lg:px-6 max-md:px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none max-md:-mx-4 max-md:px-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 max-md:gap-1.5 px-4 max-md:px-3 py-2.5 rounded-xl text-sm max-md:text-xs font-medium transition-all whitespace-nowrap min-h-[44px] flex-shrink-0',
                  activeTab === tab.id
                    ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]',
                )}
              >
                <tab.icon className="w-4 h-4 max-md:w-3.5 max-md:h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-8 max-lg:px-6 max-md:px-4 py-8 max-md:py-6">
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
