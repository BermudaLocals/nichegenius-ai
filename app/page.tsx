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
        className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-violet-600/10 blur-[80px] md:blur-[120px]"
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ top: '-10%', left: '-5%' }}
      />
      <motion.div
        className="absolute w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full bg-purple-600/8 blur-[60px] md:blur-[100px]"
        animate={{ x: [0, -40, 60, 0], y: [0, 50, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ top: '30%', right: '-10%' }}
      />
      <motion.div
        className="absolute w-[200px] md:w-[400px] h-[200px] md:h-[400px] rounded-full bg-indigo-600/6 blur-[60px] md:blur-[80px]"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">NicheGenius AI</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
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
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"
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
            className="fixed inset-x-0 top-16 z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 md:hidden"
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
    <section id={id} className={`relative py-16 md:py-24 lg:py-32 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
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

      <motion.div style={{ y, opacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
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
              className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
            >
              Your genius niche is{' '}
              <GradientText from="from-violet-400" via="via-purple-400" to="to-fuchsia-400">
                hidden in your DNA.
              </GradientText>{' '}
              <br className="hidden sm:block" />
              Our AGI finds it.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed mx-auto lg:mx-0"
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
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link href="/assessment" className="w-full sm:w-auto">
                <Button size="xl" glow iconRight={<ArrowRight className="w-5 h-5" />} fullWidth className="sm:w-auto min-h-[48px]">
                  Discover Your Genius Niche
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button size="xl" variant="secondary" fullWidth className="sm:w-auto min-h-[48px]">
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
              className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 pt-4 justify-center lg:justify-start"
            >
              {[
                { value: 155, label: 'Questions', suffix: '' },
                { value: 2.4, label: 'Data Points', suffix: 'M', format: 'decimal' as const, decimals: 1 },
                { value: 500, label: 'Niches', suffix: '+' },
                { value: 97.3, label: 'Match Accuracy', suffix: '%', format: 'decimal' as const, decimals: 1 },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-1.5 justify-center lg:justify-start">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    format={stat.format || 'number'}
                    decimals={stat.decimals || 0}
                    className="text-lg sm:text-xl font-bold text-white"
                  />
                  <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</span>
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
            className="hidden lg:block"
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
        className="text-center space-y-4 mb-10 md:mb-16"
      >
        <p className="text-sm text-violet-400 uppercase tracking-widest font-medium">Multi-Model Intelligence</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Powered by the world&apos;s most{' '}
          <GradientText>advanced AI</GradientText>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
          Our AGI engine routes each analysis to the optimal model — creative tasks to GPT-4o,
          research to Claude, fast scoring to Gemma — for superhuman accuracy.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
      >
        {models.map((model, i) => (
          <motion.div key={model.name} variants={fadeInUp} custom={i * 0.1}>
            <GlassCard intensity="light" className="p-4 sm:p-6 text-center space-y-2 sm:space-y-3 h-full">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-violet-500/10 flex items-center justify-center">
                <model.icon className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
              </div>
              <p className="font-semibold text-white text-xs sm:text-sm">{model.name}</p>
              <p className="text-[10px] sm:text-xs text-zinc-500">{model.desc}</p>
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
        className="text-center space-y-4 mb-12 md:mb-20"
      >
        <Badge variant="violet">How It Works</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          From personality quiz to{' '}
          <GradientText>profitable niche</GradientText> in 30 minutes
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.15}
          >
            <GlassCard intensity="light" className="p-5 sm:p-6 h-full space-y-4 relative overflow-hidden group">
              {/* Step number bg */}
              <div className="absolute -top-4 -right-4 text-[80px] sm:text-[120px] font-black text-white/[0.02] leading-none select-none group-hover:text-white/[0.04] transition-colors">
                {step.num}
              </div>

              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>

              <div>
                <span className="text-xs text-violet-400 font-mono">Step {step.num}</span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">{step.title}</h3>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{step.desc}</p>

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
        className="text-center space-y-4 mb-10 md:mb-16"
      >
        <Badge variant="violet">Your Blueprint Includes</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Everything you need to{' '}
          <GradientText>launch with confidence</GradientText>
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {deliverables.map((item, i) => (
          <motion.div key={item.title} variants={fadeInUp} custom={i * 0.08}>
            <GlassCard intensity="light" className="p-5 sm:p-6 h-full space-y-3 group">
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
        className="text-center space-y-4 mb-10 md:mb-16"
      >
        <Badge variant="violet">Technology</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Built with{' '}
          <GradientText>cutting-edge AI</GradientText>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
          Under the hood, NicheGenius AI orchestrates multiple AI models, vector databases,
          and MCP servers to deliver intelligence no single model can match.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.1}
          >
            <GlassCard intensity="medium" className="p-5 sm:p-6 h-full space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                </div>
                <Badge variant="violet" size="sm">{feature.badge}</Badge>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
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
        className="text-center space-y-4 mb-10 md:mb-16"
      >
        <Badge variant="violet">Who This Is For</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Built for people who are{' '}
          <GradientText>ready to start</GradientText>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {personas.map((persona, i) => (
          <motion.div
            key={persona.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.1}
          >
            <GlassCard intensity="light" className="p-5 sm:p-6 h-full space-y-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base">{persona.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{persona.desc}</p>
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
        className="text-center space-y-4 mb-10 md:mb-16"
      >
        <Badge variant="violet">Pricing</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Invest in your{' '}
          <GradientText>perfect niche</GradientText>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          One-time payment. No subscriptions. Your blueprint is yours forever.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
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
              className={`p-6 sm:p-8 h-full flex flex-col ${plan.popular ? 'ring-1 ring-violet-500/30' : ''}`}
            >
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                    <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-violet-400' : 'text-zinc-400'}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-zinc-500">/{plan.period}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400">{plan.desc}</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-zinc-300">{feature}</span>
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
        className="relative text-center space-y-6 sm:space-y-8 max-w-3xl mx-auto"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/20">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          Your niche genius is{' '}
          <GradientText from="from-violet-400" via="via-purple-400" to="to-fuchsia-400">
            waiting.
          </GradientText>
        </h2>

        <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto">
          Stop guessing. Stop scrolling. Stop watching others build the business you could have.
          Take 30 minutes. Discover your genius niche. Start building your empire today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/assessment" className="w-full sm:w-auto">
            <Button size="xl" glow iconRight={<ArrowRight className="w-5 h-5" />} fullWidth className="sm:w-auto min-h-[48px]">
              Discover Your Genius Niche
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 pt-4">
          {[
            { icon: Shield, text: 'Money-Back Guarantee' },
            { icon: Zap, text: 'Instant Results' },
            { icon: Star, text: '97.3% Accuracy' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500">
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
// I. FOOTER
// ============================================

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">NicheGenius AI</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xs">
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
                  <Link href={link.href} className="text-xs sm:text-sm text-zinc-500 hover:text-violet-400 transition-colors min-h-[44px] flex items-center">
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
                  <Link href={link.href} className="text-xs sm:text-sm text-zinc-500 hover:text-violet-400 transition-colors min-h-[44px] flex items-center">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
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
      <WhoIsForSection />
      <PricingSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
