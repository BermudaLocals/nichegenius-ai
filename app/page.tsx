'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Brain, ArrowRight, Check, Zap, Database, Video,
  BarChart3, Target, TrendingUp, BookOpen, Star,
  Shield, Users, ChevronDown, Cpu, Globe, Layers,
  DollarSign, Calendar, MessageSquare, Gift, Crown,
  Rocket, ChevronRight,
} from 'lucide-react';

// ============================================
// DESIGN TOKENS — single source of truth
// ============================================
const T = {
  bg: '#050508',
  surface: '#0d0d14',
  border: 'rgba(255,255,255,0.07)',
  borderHover: 'rgba(139,92,246,0.35)',
  accent: '#7c3aed',
  accentLight: '#a78bfa',
  accentGlow: 'rgba(124,58,237,0.15)',
  text: '#ffffff',
  muted: '#71717a',
  subtle: '#3f3f46',
};

// ============================================
// NAV
// ============================================
function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 16, color: T.text, letterSpacing: '-0.02em' }}>NicheGenius AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['How It Works', 'Pricing', 'Dashboard'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} style={{ fontSize: 14, color: T.muted, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.text)}
              onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
            >{l}</a>
          ))}
          <Link href="/assessment" style={{
            padding: '8px 20px', borderRadius: 10, background: T.accent,
            color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}>Start Free</Link>
        </div>
      </div>
    </nav>
  );
}

// ============================================
// HERO
// ============================================
function Hero() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, border: `1px solid rgba(124,58,237,0.3)`, background: 'rgba(124,58,237,0.08)', marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>World's First AGI Niche Discovery</span>
            </div>

            <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 58, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: T.text, margin: '0 0 24px' }}>
              Your genius niche<br />
              is hidden in<br />
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your DNA.</span>
            </h1>

            <p style={{ fontSize: 18, color: T.muted, lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
              Answer 155 questions. Our multi-model AGI analyzes your personality, skills, and market data across 2.4 million data points to reveal your perfect niche.
            </p>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 48 }}>
              <Link href="/assessment" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 28px', borderRadius: 12,
                background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 0 40px rgba(124,58,237,0.3)',
              }}>
                Discover Your Genius Niche <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" style={{ fontSize: 15, color: T.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                See how it works <ChevronDown size={16} />
              </a>
            </div>

            <div style={{ display: 'flex', gap: 40 }}>
              {[['155', 'Questions'], ['2.4M', 'Data Points'], ['500+', 'Niches'], ['97.3%', 'Accuracy']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>{v}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Preview Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)', borderRadius: 32, pointerEvents: 'none' }} />
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 24, padding: 28, position: 'relative' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.accentLight, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Your #1 Niche Match</span>
                  <span style={{ padding: '4px 10px', borderRadius: 100, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80', fontSize: 12, fontWeight: 600 }}>97% Match</span>
                </div>

                <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 20, fontWeight: 700, color: T.text, margin: '0 0 20px', letterSpacing: '-0.02em' }}>AI-Powered Fitness Coaching</h3>

                <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 24 }}>
                  {[['97', 'Overall'], ['94', 'Personal Fit'], ['89', 'Market']].map(([score, label], i) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 8px' }}>
                        <svg viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                          <circle cx="36" cy="36" r="30" fill="none"
                            stroke={i === 0 ? '#7c3aed' : i === 1 ? '#a855f7' : '#06b6d4'}
                            strokeWidth="5" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 30 * parseInt(score) / 100} ${2 * Math.PI * 30}`}
                          />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: T.text }}>{score}</div>
                      </div>
                      <div style={{ fontSize: 11, color: T.muted }}>{label}</div>
                    </div>
                  ))}
                </div>

                {[['Market Demand', 92], ['Profit Potential', 88], ['Competition Gap', 76]].map(([label, val]) => (
                  <div key={label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.muted, marginBottom: 6 }}>
                      <span>{label}</span><span style={{ color: T.text, fontWeight: 600 }}>{val}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1, delay: 0.8 }}
                        style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#7c3aed,#a855f7)' }} />
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(124,58,237,0.08)', border: `1px solid rgba(124,58,237,0.15)`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', marginRight: 4 }}>
                    {['A', 'B', 'C', 'D'].map((l, i) => (
                      <div key={l} style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', border: `2px solid ${T.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', marginLeft: i > 0 ? -8 : 0 }}>{l}</div>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: T.muted }}>2,847 others matched this niche</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// POWERED BY
// ============================================
function PoweredBy() {
  const models = [
    { icon: Brain, name: 'GPT-4o', desc: 'Creative & Sales' },
    { icon: Zap, name: 'Gemma 2', desc: 'Fast Analysis' },
    { icon: BookOpen, name: 'Claude', desc: 'Research & Strategy' },
    { icon: Database, name: 'Pinecone', desc: '2.4M Knowledge Base' },
    { icon: Video, name: 'HeyGen', desc: 'AI Video Generation' },
  ];

  return (
    <section style={{ borderTop: `1px solid ${T.border}`, padding: '80px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: T.accentLight, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Multi-Model Intelligence</p>
          <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: '-0.02em', margin: 0 }}>Powered by the world's most advanced AI</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {models.map(({ icon: Icon, name, desc }) => (
            <div key={name} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '24px 20px', textAlign: 'center', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = T.borderHover)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,58,237,0.1)', border: `1px solid rgba(124,58,237,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Icon size={20} color={T.accentLight} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS
// ============================================
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Deep Personality Mapping', desc: 'MBTI + Big Five + Enneagram + Values — 155 scientifically-designed questions reveal your entrepreneurial DNA.', tag: '25 minutes', icon: Brain },
    { n: '02', title: 'Background Intelligence', desc: 'Your skills, experience, education, and passions are mapped against 500+ profitable niche opportunities.', tag: '5 minutes', icon: Target },
    { n: '03', title: 'AGI Market Analysis', desc: 'Real-time market data, competition landscape, and trend analysis across our 2.4 million data point knowledge engine.', tag: 'Instant', icon: BarChart3 },
    { n: '04', title: 'Your Genius Blueprint', desc: '3 ranked niche matches with complete business blueprint, product roadmap, sales funnel, AI video script, and content strategy.', tag: 'Instant', icon: Rocket },
  ];

  return (
    <section id="how-it-works" style={{ borderTop: `1px solid ${T.border}`, padding: '80px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: T.accentLight, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>How It Works</p>
          <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: '-0.02em', margin: 0 }}>From quiz to profitable niche in 30 minutes</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {steps.map(({ n, title, desc, tag, icon: Icon }, i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = T.borderHover)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
            >
              <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 48, fontWeight: 900, color: 'rgba(255,255,255,0.03)', lineHeight: 1, fontFamily: '"Space Grotesk", sans-serif' }}>{n}</div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(168,85,247,0.1))', border: `1px solid rgba(124,58,237,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={20} color={T.accentLight} />
              </div>
              <div style={{ fontSize: 11, color: T.accentLight, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Step {n}</div>
              <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 16, fontWeight: 700, color: T.text, margin: '0 0 10px', letterSpacing: '-0.01em' }}>{title}</h3>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: '0 0 16px' }}>{desc}</p>
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 100, background: 'rgba(124,58,237,0.1)', border: `1px solid rgba(124,58,237,0.2)`, color: T.accentLight, fontSize: 11, fontWeight: 600 }}>{tag}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// WHAT YOU GET
// ============================================
function WhatYouGet() {
  const items = [
    { icon: Target, title: '3 AGI-Ranked Niche Matches', desc: 'Confidence scores, reasoning, and entry strategy for each' },
    { icon: BookOpen, title: 'Complete Business Blueprint', desc: 'Step-by-step roadmap from zero to your first $10K month' },
    { icon: Layers, title: '4-Step Sales Funnel', desc: 'Lead magnet → tripwire → core offer → premium with pricing' },
    { icon: Video, title: 'AI-Generated Video Script', desc: 'Professional niche intro video powered by HeyGen avatars' },
    { icon: Calendar, title: '30-Day Content Calendar', desc: 'Platform-specific content plan with hooks and posting schedule' },
    { icon: Globe, title: 'Competitor Intelligence', desc: 'Top competitors analyzed — strengths, weaknesses, gaps to exploit' },
    { icon: DollarSign, title: 'Revenue Projections', desc: 'Conservative, moderate, and optimistic revenue models' },
    { icon: MessageSquare, title: 'AI Coaching Chat', desc: 'Ongoing AI business coaching tailored to your niche and profile' },
  ];

  return (
    <section style={{ borderTop: `1px solid ${T.border}`, padding: '80px 32px', background: 'linear-gradient(180deg,transparent,rgba(124,58,237,0.04),transparent)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: T.accentLight, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Your Blueprint Includes</p>
          <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: '-0.02em', margin: 0 }}>Everything you need to launch with confidence</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {items.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}
              style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = T.borderHover)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={18} color={T.accentLight} />
              </div>
              <h4 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 14, fontWeight: 700, color: T.text, margin: '0 0 8px', letterSpacing: '-0.01em' }}>{title}</h4>
              <p style={{ fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.5 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// ARIA — SINGLE, CLEAN, FOCUSED
// ============================================
function AriaSection() {
  return (
    <section id="aria" style={{ borderTop: `1px solid ${T.border}`, padding: '80px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

        {/* Left — copy */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: T.accentLight, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>AI Avatar Assistant</p>
          <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 40, fontWeight: 800, color: T.text, letterSpacing: '-0.03em', margin: '0 0 20px', lineHeight: 1.1 }}>
            Meet Aria.<br />
            <span style={{ background: 'linear-gradient(135deg,#a78bfa,#e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your AI business advisor.</span>
          </h2>
          <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.7, marginBottom: 32 }}>
            Talk face-to-face with our AGI-powered avatar. Aria combines 10 specialist agents, 3 AI models, and 2.4 million data points to guide you to your perfect niche — in real time.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36 }}>
            {[['10', 'AI Agents'], ['3', 'AI Models'], ['2.4M', 'Data Points'], ['24/7', 'Available']].map(([v, l]) => (
              <div key={l} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>{v}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          <Link href="/avatar" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '13px 24px', borderRadius: 12,
            background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
            color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 0 30px rgba(124,58,237,0.25)',
          }}>
            Talk to Aria <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right — single avatar card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 340 }}>
            <div style={{ position: 'absolute', inset: -24, background: 'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 28, padding: 36, textAlign: 'center', position: 'relative' }}>
              {/* Avatar */}
              <div style={{ position: 'relative', width: 160, height: 180, margin: '0 auto 20px' }}>
                <svg viewBox="0 0 160 180" style={{ width: '100%', filter: 'drop-shadow(0 0 20px rgba(124,58,237,0.4))' }}>
                  <defs>
                    <linearGradient id="h1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                    <linearGradient id="b1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <path d="M50 115 Q50 100 65 95 L80 92 L95 95 Q110 100 110 115 L116 158 Q116 174 95 179 L65 179 Q44 174 44 158 Z" fill="url(#b1)" />
                  <rect x="74" y="84" width="12" height="12" rx="5" fill="#a78bfa" fillOpacity="0.7" />
                  <ellipse cx="80" cy="58" rx="28" ry="32" fill="url(#h1)" />
                  <path d="M52 54 Q54 34 67 27 Q80 22 93 27 Q106 34 108 54" fill="#4c1d95" fillOpacity="0.5" />
                  <ellipse cx="68" cy="57" rx="5" ry="5" fill="#ede9fe" />
                  <circle cx="68" cy="57" r="2.5" fill="#7c3aed" />
                  <ellipse cx="92" cy="57" rx="5" ry="5" fill="#ede9fe" />
                  <circle cx="92" cy="57" r="2.5" fill="#7c3aed" />
                  <path d="M73 70 Q80 76 87 70" fill="none" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {/* Pulse rings */}
                <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: '1px solid rgba(124,58,237,0.2)', animation: 'ping 3s infinite' }} />
                <div style={{ position: 'absolute', inset: -24, borderRadius: '50%', border: '1px solid rgba(124,58,237,0.1)', animation: 'ping 3s infinite 1s' }} />
              </div>

              <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 22, fontWeight: 800, color: T.text, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Aria</h3>
              <p style={{ fontSize: 13, color: T.accentLight, margin: '0 0 12px' }}>AGI-Powered Business Advisor</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>Online — Ready to chat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// AI AGENTS — clean grid, no clutter
// ============================================
function AgentsSection() {
  const agents = [
    { emoji: '🔍', name: 'NicheScout', role: 'Identifies untapped opportunities' },
    { emoji: '🧠', name: 'PersonaMapper', role: 'Maps your personality to niches' },
    { emoji: '📊', name: 'MarketOracle', role: 'Analyzes market size & trends' },
    { emoji: '🕵️', name: 'CompetitorSpy', role: 'Tracks competitor weaknesses' },
    { emoji: '✍️', name: 'ContentArchitect', role: 'Designs your content strategy' },
    { emoji: '🔥', name: 'FunnelForge', role: 'Builds your sales funnel' },
    { emoji: '📦', name: 'ProductGenius', role: 'Creates your product roadmap' },
    { emoji: '📡', name: 'TrendRadar', role: 'Detects emerging opportunities' },
    { emoji: '🎬', name: 'ScriptWriter', role: 'Generates your video scripts' },
    { emoji: '🚀', name: 'GrowthCoach', role: 'Plans your scaling strategy' },
  ];

  return (
    <section style={{ borderTop: `1px solid ${T.border}`, padding: '80px 32px', background: 'linear-gradient(180deg,transparent,rgba(124,58,237,0.03),transparent)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: T.accentLight, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Powered by 10 AI Agents</p>
          <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: '-0.02em', margin: '0 0 12px' }}>Meet your AI team</h2>
          <p style={{ fontSize: 16, color: T.muted, margin: 0 }}>10 specialized agents collaborating 24/7 through Model Context Protocol</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          {agents.map(({ emoji, name, role }, i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}
              style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '20px 16px', textAlign: 'center', transition: 'border-color 0.2s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>{emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 4 }}>{name}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 600 }}>Online</span>
              </div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.4 }}>{role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PRICING
// ============================================
function Pricing() {
  const plans = [
    {
      name: 'Free', price: '$0', period: 'forever', icon: Gift, popular: false,
      desc: 'Get started with a basic personality assessment and one niche match.',
      features: ['Basic personality assessment (40 questions)', '1 niche match with reasoning', 'Niche viability score', 'Basic market overview'],
      cta: 'Start Free',
    },
    {
      name: 'Pro', price: '$47', period: 'one-time', icon: Star, popular: true,
      desc: 'Complete 155-question assessment with full 3-niche blueprint.',
      features: ['Full 155-question deep assessment', '3 AGI-ranked niche matches', 'Complete business blueprint', '4-step sales funnel with pricing', '30-day content calendar', 'Revenue projections (3 scenarios)', 'Personality profile report'],
      cta: 'Get Your Blueprint',
    },
    {
      name: 'Empire', price: '$197', period: 'one-time', icon: Crown, popular: false,
      desc: 'Everything in Pro plus AI video, competitor intel, and ongoing AI coaching.',
      features: ['Everything in Pro', 'AI-generated video script (HeyGen)', 'Full competitor intelligence report', 'AI coaching chat (30 days)', 'Revenue optimization plan', 'Email sequence templates', 'Priority support', 'Lifetime blueprint updates'],
      cta: 'Build Your Empire',
    },
  ];

  return (
    <section id="pricing" style={{ borderTop: `1px solid ${T.border}`, padding: '80px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: T.accentLight, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Pricing</p>
          <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: '-0.02em', margin: '0 0 12px' }}>Invest in your perfect niche</h2>
          <p style={{ fontSize: 15, color: T.muted, margin: 0 }}>One-time payment. No subscriptions. Your blueprint is yours forever.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {plans.map(({ name, price, period, icon: Icon, popular, desc, features, cta }) => (
            <div key={name} style={{ position: 'relative' }}>
              {popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '4px 14px', borderRadius: 100, background: T.accent, color: '#fff', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', zIndex: 1 }}>
                  Most Popular
                </div>
              )}
              <div style={{
                background: popular ? 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(168,85,247,0.08))' : T.surface,
                border: `1px solid ${popular ? 'rgba(124,58,237,0.4)' : T.border}`,
                borderRadius: 20, padding: 28, height: '100%', display: 'flex', flexDirection: 'column',
                boxShadow: popular ? '0 0 40px rgba(124,58,237,0.12)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: popular ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={popular ? T.accentLight : T.muted} />
                  </div>
                  <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>{name}</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 36, fontWeight: 900, color: T.text, letterSpacing: '-0.03em' }}>{price}</span>
                  <span style={{ fontSize: 13, color: T.muted, marginLeft: 4 }}>/{period}</span>
                </div>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, marginBottom: 20 }}>{desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                  {features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                      <Check size={14} color={T.accentLight} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.4 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/assessment" style={{
                  display: 'block', textAlign: 'center', padding: '12px 20px', borderRadius: 12,
                  background: popular ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(255,255,255,0.06)',
                  border: popular ? 'none' : `1px solid ${T.border}`,
                  color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  boxShadow: popular ? '0 0 20px rgba(124,58,237,0.25)' : 'none',
                }}>{cta}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FINAL CTA
// ============================================
function FinalCTA() {
  return (
    <section style={{ borderTop: `1px solid ${T.border}`, padding: '100px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
            <Zap size={28} color="#fff" />
          </div>
          <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 48, fontWeight: 900, color: T.text, letterSpacing: '-0.03em', margin: '0 0 20px', lineHeight: 1.1 }}>
            Your niche genius<br />
            <span style={{ background: 'linear-gradient(135deg,#a78bfa,#e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>is waiting.</span>
          </h2>
          <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.7, marginBottom: 40 }}>
            Stop guessing. Stop scrolling. Take 30 minutes. Discover your genius niche. Start building your empire today.
          </p>
          <Link href="/assessment" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 36px', borderRadius: 14,
            background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
            color: '#fff', fontSize: 17, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 0 60px rgba(124,58,237,0.35)',
          }}>
            Discover Your Genius Niche <ArrowRight size={20} />
          </Link>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 32 }}>
            {[[Shield, 'Money-Back Guarantee'], [Zap, 'Instant Results'], [Star, '97.3% Accuracy']].map(([Icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.muted }}>
                <Icon size={14} />{text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${T.border}`, padding: '48px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={16} color="#fff" />
            </div>
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 15, color: T.text }}>NicheGenius AI</span>
          </div>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, maxWidth: 280 }}>The world's first AGI-powered niche discovery platform. Find your genius niche with multi-model AI analysis.</p>
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product</h4>
          {[['Dashboard', '/dashboard'], ['Assessment', '/assessment'], ['Pricing', '#pricing'], ['How It Works', '#how-it-works']].map(([l, h]) => (
            <a key={l} href={h} style={{ display: 'block', fontSize: 13, color: T.muted, textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.text)}
              onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
            >{l}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Account</h4>
          {[['Sign In', '/auth/sign-in'], ['Sign Up', '/auth/sign-up'], ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([l, h]) => (
            <a key={l} href={h} style={{ display: 'block', fontSize: 13, color: T.muted, textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.text)}
              onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
            >{l}</a>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '32px auto 0', paddingTop: 24, borderTop: `1px solid ${T.border}`, textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: T.subtle, margin: 0 }}>© 2026 NicheGenius AI. All rights reserved. Built with AGI-powered intelligence.</p>
      </div>
    </footer>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function HomePage() {
  return (
    <main style={{ background: T.bg, minHeight: '100vh', color: T.text, fontFamily: '"Space Grotesk", -apple-system, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes ping { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(1.5);opacity:0} }
      `}</style>
      <Nav />
      <Hero />
      <PoweredBy />
      <HowItWorks />
      <WhatYouGet />
      <AriaSection />
      <AgentsSection />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
