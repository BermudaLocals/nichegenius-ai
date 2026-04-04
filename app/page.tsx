'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Brain, Sparkles, Target, Zap, BarChart3, TrendingUp,
  Video, Bot, Users, Star, Check, ArrowRight, ChevronRight,
  Cpu, Database, Globe, Layers, MessageSquare, Shield,
  BookOpen, Calendar, DollarSign, Rocket, Crown, Gift,
  Menu, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GradientText } from '@/components/ui/gradient-text';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ScoreRing } from '@/components/ui/score-ring';
import { AgentsPreview } from '@/components/landing/agents-preview';

// ---- Animation Variants ----

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ---- Floating Orbs Background ----

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] max-md:w-[300px] h-[600px] max-md:h-[300px] rounded-full bg-violet-600/10 blur-[120px] max-md:blur-[80px]"
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ top: '-10%', left: '-5%' }}
      />
      <motion.div
        className="absolute w-[500px] max-md:w-[250px] h-[500px] max-md:h-[250px] rounded-full bg-purple-600/8 blur-[100px] max-md:blur-[60px]"
        animate={{ x: [0, -40, 60, 0], y: [0, 50, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ top: '30%', right: '-10%' }}
      />
      <motion.div
        className="absolute w-[400px] max-md:w-[200px] h-[400px] max-md:h-[200px] rounded-full bg-indigo-600/6 blur-[80px] max-md:blur-[60px]"
        animate={{ x: [0, 30, -50, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ bottom: '10%', left: '20%' }}
      />
    </div>
  );
}

// ---- Mobile Navigation ----

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'AI Agents', href: '/agents' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 max-lg:px-6 max-md:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">NicheGenius AI</span>
            </Link>

            {/* Desktop Nav */}
            <div className="flex items-center gap-6 max-md:hidden">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
              <Link href="/assessment">
                <Button size="sm" glow>Start Free Assessment</Button>
              </Link>
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hidden max-md:flex w-11 h-11 items-center justify-center rounded-xl hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 hidden max-md:block"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 text-base text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <Link href="/assessment" onClick={() => setIsOpen(false)}>
                  <Button size="lg" glow fullWidth>Start Free Assessment</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---- Section Wrapper ----

function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative py-32 max-lg:py-24 max-md:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-8 max-lg:px-6 max-md:px-4">{children}</div>
    </section>
  );
}

// ============================================
// A. HERO SECTION
// ============================================

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <FloatingOrbs />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-[0.02]" />

      <motion.div style={{ y, opacity }} className="max-w-7xl mx-auto px-8 max-lg:px-6 max-md:px-4 py-32 max-lg:py-24 max-md:py-16 relative z-10 w-full">
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-16 max-lg:gap-8 items-center">
          {/* Left: Copy */}
          <div className="space-y-8 max-sm:space-y-6 text-left max-lg:text-center">
            <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0.1}>
              <Badge variant="violet" dot>
                The World&apos;s First AGI-Powered Niche Discovery
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="text-7xl max-lg:text-5xl max-md:text-3xl font-bold leading-[1.1] tracking-tight"
            >
              Your genius niche is{' '}
              <GradientText from="from-violet-400" via="via-purple-400" to="to-fuchsia-400">
                hidden in your DNA.
              </GradientText>{' '}
              <br className="block max-sm:hidden" />
              Our AGI finds it.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="text-lg max-sm:text-base text-zinc-400 max-w-xl leading-relaxed mx-0 max-lg:mx-auto"
            >
              Answer 155 questions. Our multi-model AGI engine analyzes your personality,
              skills, and market data across 2.4 million data points to reveal the perfect
              niche for your online empire.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
              className="flex flex-row max-sm:flex-col flex-wrap gap-4 max-sm:gap-3 justify-start max-lg:justify-center"
            >
              <Link href="/assessment" className="w-auto max-sm:w-full">
                <Button size="xl" glow iconRight={<ArrowRight className="w-5 h-5" />} fullWidth className="w-auto max-sm:w-full min-h-[48px]">
                  Discover Your Genius Niche
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-auto max-sm:w-full">
                <Button size="xl" variant="secondary" fullWidth className="w-auto max-sm:w-full min-h-[48px]">
                  See How It Works
                </Button>
              </Link>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.7}
              className="flex flex-wrap max-sm:grid max-sm:grid-cols-2 gap-6 max-sm:gap-4 pt-4 justify-start max-lg:justify-center"
            >
              {[
                { value: 155, label: 'Questions', suffix: '' },
                { value: 2.4, label: 'Data Points', suffix: 'M', format: 'decimal' as const, decimals: 1 },
                { value: 500, label: 'Niches', suffix: '+' },
                { value: 97.3, label: 'Match Accuracy', suffix: '%', format: 'decimal' as const, decimals: 1 },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-1.5 justify-start max-lg:justify-center">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    format={stat.format || 'number'}
                    decimals={stat.decimals || 0}
                    className="text-xl max-sm:text-lg font-bold text-white"
                  />
                  <span className="text-xs max-sm:text-[10px] text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Preview Card */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            custom={0.6}
            className="block max-lg:hidden"
          >
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-transparent rounded-3xl blur-2xl" />

              <GlassCard glow="violet" intensity="strong" className="relative p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Your #1 Niche Match</p>
                    <h3 className="text-xl font-bold text-white mt-1">AI-Powered Fitness Coaching</h3>
                  </div>
                  <Badge variant="success" dot>97% Match</Badge>
                </div>

                <div className="flex justify-center gap-8 py-4">
                  <ScoreRing score={97} size={100} strokeWidth={6} label="Overall" delay={0.8} />
                  <ScoreRing score={94} size={100} strokeWidth={6} label="Personal Fit" gradientFrom="#a855f7" gradientTo="#ec4899" delay={1} />
                  <ScoreRing score={89} size={100} strokeWidth={6} label="Market" gradientFrom="#06b6d4" gradientTo="#3b82f6" delay={1.2} />
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Market Demand', value: 92 },
                    { label: 'Profit Potential', value: 88 },
                    { label: 'Competition Gap', value: 76 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-28">{item.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: 1.5, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-xs text-zinc-300 w-8 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500">2,847 others matched to this niche</span>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// B. POWERED BY SECTION
// ============================================

function PoweredBySection() {
  const models = [
    { name: 'GPT-4o', desc: 'Creative & Sales', icon: Brain },
    { name: 'Gemma 2', desc: 'Fast Analysis', icon: Zap },
    { name: 'Claude', desc: 'Research & Strategy', icon: BookOpen },
    { name: 'Pinecone', desc: '2.4M Knowledge Base', icon: Database },
    { name: 'HeyGen', desc: 'AI Video Generation', icon: Video },
  ];

  return (
    <Section className="border-t border-white/5">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center space-y-4 mb-16 max-md:mb-10"
      >
        <p className="text-sm text-violet-400 uppercase tracking-widest font-medium">Multi-Model Intelligence</p>
        <h2 className="text-4xl max-md:text-3xl max-sm:text-2xl font-bold text-white">
          Powered by the world&apos;s most{' '}
          <GradientText>advanced AI</GradientText>
        </h2>
        <p className="text-base max-sm:text-sm text-zinc-400 max-w-2xl mx-auto">
          Our AGI engine routes each analysis to the optimal model — creative tasks to GPT-4o,
          research to Claude, fast scoring to Gemma — for superhuman accuracy.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 gap-4 max-sm:gap-3"
      >
        {models.map((model, i) => (
          <motion.div key={model.name} variants={fadeInUp} custom={i * 0.1}>
            <GlassCard intensity="light" className="p-6 max-sm:p-4 text-center space-y-3 max-sm:space-y-2 h-full">
              <div className="w-12 h-12 max-sm:w-10 max-sm:h-10 mx-auto rounded-xl bg-violet-500/10 flex items-center justify-center">
                <model.icon className="w-6 h-6 max-sm:w-5 max-sm:h-5 text-violet-400" />
              </div>
              <p className="font-semibold text-white text-sm max-sm:text-xs">{model.name}</p>
              <p className="text-xs max-sm:text-[10px] text-zinc-500">{model.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

// ============================================
// C. HOW IT WORKS
// ============================================

function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Deep Personality Mapping',
      desc: 'MBTI + Big Five + Enneagram + Values — 155 scientifically-designed questions reveal your entrepreneurial DNA.',
      detail: '155 questions · 25 minutes',
      icon: Brain,
      color: 'from-violet-500 to-purple-600',
    },
    {
      num: '02',
      title: 'Background Intelligence',
      desc: 'Your skills, experience, education, and passions are mapped against 500+ profitable niche opportunities.',
      detail: 'Skills + Experience · 5 minutes',
      icon: Target,
      color: 'from-purple-500 to-fuchsia-600',
    },
    {
      num: '03',
      title: 'AGI Market Analysis',
      desc: 'Real-time market data, competition landscape, and trend analysis across our 2.4 million data point knowledge engine.',
      detail: '2.4M data points · Instant',
      icon: BarChart3,
      color: 'from-fuchsia-500 to-pink-600',
    },
    {
      num: '04',
      title: 'Your Genius Blueprint',
      desc: '3 ranked niche matches with complete business blueprint, product roadmap, sales funnel, AI video script, and content strategy.',
      detail: 'Full blueprint · Instant',
      icon: Rocket,
      color: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <Section id="how-it-works">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center space-y-4 mb-20 max-md:mb-12"
      >
        <Badge variant="violet">How It Works</Badge>
        <h2 className="text-4xl max-md:text-3xl max-sm:text-2xl font-bold text-white">
          From personality quiz to{' '}
          <GradientText>profitable niche</GradientText> in 30 minutes
        </h2>
      </motion.div>

      <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-8 max-lg:gap-6 max-md:gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.15}
          >
            <GlassCard intensity="light" className="p-6 max-sm:p-5 h-full space-y-4 relative overflow-hidden group">
              {/* Step number bg */}
              <div className="absolute -top-4 -right-4 text-[120px] max-sm:text-[80px] font-black text-white/[0.02] leading-none select-none group-hover:text-white/[0.04] transition-colors">
                {step.num}
              </div>

              <div className={`w-12 h-12 max-sm:w-10 max-sm:h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                <step.icon className="w-6 h-6 max-sm:w-5 max-sm:h-5 text-white" />
              </div>

              <div>
                <span className="text-xs text-violet-400 font-mono">Step {step.num}</span>
                <h3 className="text-lg max-sm:text-base font-bold text-white mt-1">{step.title}</h3>
              </div>

              <p className="text-sm max-sm:text-xs text-zinc-400 leading-relaxed">{step.desc}</p>

              <div className="pt-2">
                <Badge variant="default" size="sm">{step.detail}</Badge>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ============================================
// D. WHAT YOU GET
// ============================================

function WhatYouGetSection() {
  const deliverables = [
    { icon: Target, title: '3 AGI-Ranked Niche Matches', desc: 'With confidence scores, reasoning, and entry strategy for each match' },
    { icon: BookOpen, title: 'Complete Business Blueprint', desc: 'Step-by-step roadmap from zero to your first $10K month' },
    { icon: Layers, title: '4-Step Sales Funnel', desc: 'Lead magnet → tripwire → core offer → premium, with pricing strategy' },
    { icon: Video, title: 'AI-Generated Video Script', desc: 'Professional niche intro video script powered by HeyGen AI avatars' },
    { icon: Calendar, title: '30-Day Content Calendar', desc: 'Platform-specific content plan with hooks, topics, and posting schedule' },
    { icon: Globe, title: 'Competitor Intelligence Report', desc: 'Top competitors analyzed — their strengths, weaknesses, and gaps you can exploit' },
    { icon: DollarSign, title: 'Revenue Projections', desc: 'Conservative, moderate, and optimistic revenue models with milestones' },
    { icon: MessageSquare, title: 'AI Coaching Chat', desc: 'Ongoing AI-powered business coaching tailored to your niche and profile' },
  ];

  return (
    <Section className="bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center space-y-4 mb-16 max-md:mb-10"
      >
        <Badge variant="violet">Your Blueprint Includes</Badge>
        <h2 className="text-4xl max-md:text-3xl max-sm:text-2xl font-bold text-white">
          Everything you need to{' '}
          <GradientText>launch with confidence</GradientText>
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6 max-sm:gap-4"
      >
        {deliverables.map((item, i) => (
          <motion.div key={item.title} variants={fadeInUp} custom={i * 0.08}>
            <GlassCard intensity="light" className="p-6 max-sm:p-5 h-full space-y-3 group">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                <item.icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-semibold text-white text-sm">{item.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

// ============================================
// E. AI FEATURES SHOWCASE
// ============================================

function AIFeaturesSection() {
  const features = [
    {
      icon: Cpu,
      title: 'MCP-Powered Intelligence',
      desc: '6 specialized AI servers working in parallel — trend analysis, product ideas, content generation, market data, niche research, and competitor intelligence.',
      badge: '6 Servers',
    },
    {
      icon: Video,
      title: 'HeyGen AI Avatar',
      desc: 'Your niche introduction video generated by AI avatars. Professional, on-brand video content without ever touching a camera.',
      badge: 'AI Video',
    },
    {
      icon: Zap,
      title: 'Gemma Fast Analysis',
      desc: 'Instant niche compatibility scoring using Google\'s Gemma 2 model. Get real-time feedback as you complete your assessment.',
      badge: 'Instant',
    },
    {
      icon: Database,
      title: 'Knowledge Engine',
      desc: '2.4 million curated entries across 500+ niches. Market data, competitor profiles, trending topics, and revenue benchmarks.',
      badge: '2.4M Entries',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Market Data',
      desc: 'Live competition analysis, trend detection, and market sizing. Know the exact landscape before you commit to a niche.',
      badge: 'Live Data',
    },
  ];

  return (
    <Section>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center space-y-4 mb-16 max-md:mb-10"
      >
        <Badge variant="violet">Technology</Badge>
        <h2 className="text-4xl max-md:text-3xl max-sm:text-2xl font-bold text-white">
          Built with{' '}
          <GradientText>cutting-edge AI</GradientText>
        </h2>
        <p className="text-base max-sm:text-sm text-zinc-400 max-w-2xl mx-auto">
          Under the hood, NicheGenius AI orchestrates multiple AI models, vector databases,
          and MCP servers to deliver intelligence no single model can match.
        </p>
      </motion.div>

      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6 max-sm:gap-4">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.1}
          >
            <GlassCard intensity="medium" className="p-6 max-sm:p-5 h-full space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 max-sm:w-10 max-sm:h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 max-sm:w-5 max-sm:h-5 text-violet-400" />
                </div>
                <Badge variant="violet" size="sm">{feature.badge}</Badge>
              </div>
              <h3 className="text-lg max-sm:text-base font-semibold text-white">{feature.title}</h3>
              <p className="text-sm max-sm:text-xs text-zinc-400 leading-relaxed">{feature.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ============================================
// F. WHO THIS IS FOR
// ============================================

function WhoIsForSection() {
  const personas = [
    {
      title: 'The Career Pivoter',
      desc: 'You have years of experience but feel stuck. Your skills are valuable — you just need the right niche to monetize them.',
      traits: ['5+ years experience', 'Ready for change', 'Valuable expertise'],
    },
    {
      title: 'The Side Hustler',
      desc: 'You want to build income outside your 9-5. Limited time means you need the RIGHT niche from day one — no guessing.',
      traits: ['Limited time', 'High motivation', 'Needs clarity'],
    },
    {
      title: 'The Creative Entrepreneur',
      desc: 'You have too many ideas and can\'t decide. Our AGI cuts through analysis paralysis to find your ONE genius niche.',
      traits: ['Many interests', 'Creative skills', 'Needs focus'],
    },
    {
      title: 'The Knowledge Expert',
      desc: 'You know your stuff but don\'t know how to package and sell it. We map your expertise to the most profitable opportunities.',
      traits: ['Deep knowledge', 'Teaching ability', 'Needs strategy'],
    },
  ];

  return (
    <Section className="bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center space-y-4 mb-16 max-md:mb-10"
      >
        <Badge variant="violet">Who This Is For</Badge>
        <h2 className="text-4xl max-md:text-3xl max-sm:text-2xl font-bold text-white">
          Built for people who are{' '}
          <GradientText>ready to start</GradientText>
        </h2>
      </motion.div>

      <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6 max-sm:gap-4">
        {personas.map((persona, i) => (
          <motion.div
            key={persona.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.1}
          >
            <GlassCard intensity="light" className="p-6 max-sm:p-5 h-full space-y-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-white text-base max-sm:text-sm">{persona.title}</h3>
              <p className="text-sm max-sm:text-xs text-zinc-400 leading-relaxed">{persona.desc}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {persona.traits.map((trait) => (
                  <Badge key={trait} variant="default" size="sm">{trait}</Badge>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ============================================
// G. PRICING SECTION
// ============================================

function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      desc: 'Get started with a basic personality assessment and one niche match.',
      features: [
        'Basic personality assessment (40 questions)',
        '1 niche match with reasoning',
        'Niche viability score',
        'Basic market overview',
      ],
      cta: 'Start Free',
      variant: 'secondary' as const,
      popular: false,
      icon: Gift,
    },
    {
      name: 'Pro',
      price: '$47',
      period: 'one-time',
      desc: 'Complete 155-question assessment with full 3-niche blueprint and business plan.',
      features: [
        'Full 155-question deep assessment',
        '3 AGI-ranked niche matches',
        'Complete business blueprint',
        '4-step sales funnel with pricing',
        '30-day content calendar',
        'Revenue projections (3 scenarios)',
        'Personality profile report',
      ],
      cta: 'Get Your Blueprint',
      variant: 'primary' as const,
      popular: true,
      icon: Star,
    },
    {
      name: 'Empire',
      price: '$197',
      period: 'one-time',
      desc: 'Everything in Pro plus AI video, competitor intel, and ongoing AI coaching.',
      features: [
        'Everything in Pro',
        'AI-generated video script (HeyGen)',
        'Full competitor intelligence report',
        'AI coaching chat (30 days)',
        'Revenue optimization plan',
        'Email sequence templates',
        'Priority support',
        'Lifetime blueprint updates',
      ],
      cta: 'Build Your Empire',
      variant: 'primary' as const,
      popular: false,
      icon: Crown,
    },
  ];

  return (
    <Section id="pricing">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center space-y-4 mb-16 max-md:mb-10"
      >
        <Badge variant="violet">Pricing</Badge>
        <h2 className="text-4xl max-md:text-3xl max-sm:text-2xl font-bold text-white">
          Invest in your{' '}
          <GradientText>perfect niche</GradientText>
        </h2>
        <p className="text-base max-sm:text-sm text-zinc-400 max-w-xl mx-auto">
          One-time payment. No subscriptions. Your blueprint is yours forever.
        </p>
      </motion.div>

      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-8 max-sm:gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.15}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <Badge variant="violet">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </Badge>
              </div>
            )}
            <GlassCard
              intensity={plan.popular ? 'strong' : 'light'}
              glow={plan.popular ? 'violet' : 'none'}
              className={`p-8 max-sm:p-6 h-full flex flex-col ${plan.popular ? 'ring-1 ring-violet-500/30' : ''}`}
            >
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                    <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-violet-400' : 'text-zinc-400'}`} />
                  </div>
                  <h3 className="text-xl max-sm:text-lg font-bold text-white">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl max-sm:text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-zinc-500">/{plan.period}</span>
                </div>
                <p className="text-sm max-sm:text-xs text-zinc-400">{plan.desc}</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm max-sm:text-xs text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/assessment">
                <Button
                  variant={plan.variant}
                  size="lg"
                  fullWidth
                  glow={plan.popular}
                  iconRight={<ChevronRight className="w-4 h-4" />}
                  className="min-h-[48px]"
                >
                  {plan.cta}
                </Button>
              </Link>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ============================================
// H. FINAL CTA
// ============================================

function FinalCTASection() {
  return (
    <Section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-purple-950/10 to-transparent" />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative text-center space-y-8 max-sm:space-y-6 max-w-3xl mx-auto"
      >
        <div className="w-20 h-20 max-sm:w-16 max-sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/20">
          <Sparkles className="w-10 h-10 max-sm:w-8 max-sm:h-8 text-white" />
        </div>

        <h2 className="text-5xl max-md:text-4xl max-sm:text-3xl font-bold text-white leading-tight">
          Your niche genius is{' '}
          <GradientText from="from-violet-400" via="via-purple-400" to="to-fuchsia-400">
            waiting.
          </GradientText>
        </h2>

        <p className="text-lg max-sm:text-base text-zinc-400 max-w-xl mx-auto">
          Stop guessing. Stop scrolling. Stop watching others build the business you could have.
          Take 30 minutes. Discover your genius niche. Start building your empire today.
        </p>

        <div className="flex flex-row max-sm:flex-col gap-4 justify-center pt-4">
          <Link href="/assessment" className="w-auto max-sm:w-full">
            <Button size="xl" glow iconRight={<ArrowRight className="w-5 h-5" />} fullWidth className="w-auto max-sm:w-full min-h-[48px]">
              Discover Your Genius Niche
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-sm:gap-4 pt-4">
          {[
            { icon: Shield, text: 'Money-Back Guarantee' },
            { icon: Zap, text: 'Instant Results' },
            { icon: Star, text: '97.3% Accuracy' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-sm max-sm:text-xs text-zinc-500">
              <item.icon className="w-4 h-4" />
              {item.text}
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}


// ============================================
// H2. MEET ARIA — AVATAR CTA
// ============================================

function MeetAriaSection() {
  return (
    <Section id="meet-aria" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-14 max-sm:mb-10"
        >
          <motion.div variants={fadeInUp} custom={0}>
            <Badge variant="outline" className="mb-4 border-violet-500/30 text-violet-300">
              <Sparkles className="w-3 h-3 mr-1" />
              Interactive AI Avatar
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            custom={0.1}
            className="text-5xl max-lg:text-4xl max-sm:text-3xl font-bold mb-4"
          >
            Meet{' '}
            <GradientText>Aria</GradientText>
            {' '}— Your AI Business Advisor
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            custom={0.2}
            className="text-zinc-400 max-w-2xl mx-auto text-lg max-sm:text-base"
          >
            Talk face-to-face with our AGI-powered avatar. Aria combines 10 specialist
            agents, 3 AI models, and 2.4M data points to guide you to your perfect niche.
          </motion.p>
        </motion.div>

        {/* Avatar Preview Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={scaleIn}
          custom={0.3}
          className="relative mx-auto max-w-lg"
        >
          <div className="relative rounded-3xl border border-white/[0.08] bg-black/60 backdrop-blur-xl overflow-hidden p-10 max-sm:p-8">
            {/* Glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-600/15 blur-[80px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full bg-purple-500/20 blur-[50px]" />

            {/* Avatar silhouette */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Animated avatar preview */}
              <div className="relative w-[200px] h-[240px] mb-6">
                <svg viewBox="0 0 200 240" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.4))' }}>
                  <defs>
                    <linearGradient id="aria-prev-head" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="aria-prev-body" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.5" />
                    </linearGradient>
                    <radialGradient id="aria-prev-eye">
                      <stop offset="0%" stopColor="#c4b5fd" />
                      <stop offset="60%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <g className="animate-float" style={{ animationDuration: '5s' }}>
                    {/* Body */}
                    <path d="M65 140 Q65 125 82 118 L100 115 L118 118 Q135 125 135 140 L142 195 Q142 218 118 225 L82 225 Q58 218 58 195 Z" fill="url(#aria-prev-body)" />
                    {/* Neck */}
                    <rect x="93" y="105" width="14" height="14" rx="6" fill="#a78bfa" fillOpacity="0.7" />
                    {/* Head */}
                    <ellipse cx="100" cy="75" rx="34" ry="40" fill="url(#aria-prev-head)" />
                    {/* Hair */}
                    <path d="M66 70 Q68 42 85 33 Q100 27 115 33 Q132 42 134 70" fill="#6d28d9" fillOpacity="0.5" />
                    {/* Eyes */}
                    <ellipse cx="87" cy="74" rx="5" ry="5" fill="url(#aria-prev-eye)" />
                    <circle cx="87" cy="74" r="2.5" fill="#ede9fe" />
                    <ellipse cx="113" cy="74" rx="5" ry="5" fill="url(#aria-prev-eye)" />
                    <circle cx="113" cy="74" r="2.5" fill="#ede9fe" />
                    {/* Smile */}
                    <path d="M92 88 Q100 94 108 88" fill="none" stroke="#5b21b6" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                </svg>
                {/* Pulse rings */}
                <span className="absolute inset-0 rounded-full border border-violet-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                <span className="absolute inset-[-8px] rounded-full border border-violet-500/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Aria</h3>
              <p className="text-violet-300 text-sm mb-1">AGI-Powered Business Advisor</p>
              <div className="flex items-center gap-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-zinc-400">Online — Ready to chat</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-[11px] text-zinc-500 mb-8">
                <span>10 AI Agents</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>3 Models</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>2.4M Data Points</span>
              </div>

              {/* CTA Button */}
              <Link href="/avatar" className="w-full">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all group"
                >
                  Talk to Aria
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ============================================
// I. FOOTER
// ============================================

function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 max-sm:py-12">
      <div className="max-w-7xl mx-auto px-8 max-lg:px-6 max-md:px-4">
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-12 max-sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">NicheGenius AI</span>
            </div>
            <p className="text-sm max-sm:text-xs text-zinc-500 max-w-xs">
              The world&apos;s first AGI-powered niche discovery platform. Find your genius niche
              with multi-model AI analysis.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Product</h4>
            <ul className="space-y-2">
              {[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Assessment', href: '/assessment' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'How It Works', href: '#how-it-works' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm max-sm:text-xs text-zinc-500 hover:text-violet-400 transition-colors min-h-[44px] flex items-center">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Account</h4>
            <ul className="space-y-2">
              {[
                { label: 'Sign In', href: '/auth/sign-in' },
                { label: 'Sign Up', href: '/auth/sign-up' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm max-sm:text-xs text-zinc-500 hover:text-violet-400 transition-colors min-h-[44px] flex items-center">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 max-sm:mt-8 pt-8 max-sm:pt-6 text-center">
          <p className="text-xs text-zinc-600">
            © 2026 NicheGenius AI. All rights reserved. Built with AGI-powered intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function HomePage() {
  return (
    <main className="relative bg-zinc-950 text-white overflow-x-hidden">
      <MobileNav />
      <HeroSection />
      <PoweredBySection />
      <HowItWorksSection />
      <WhatYouGetSection />
      <AIFeaturesSection />
      <AgentsPreview />
      <MeetAriaSection />
      <WhoIsForSection />
      <PricingSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
