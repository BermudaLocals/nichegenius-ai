'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveAvatar } from '@/components/avatar/interactive-avatar';
import Link from 'next/link';

type AvatarState = 'idle' | 'thinking' | 'speaking' | 'listening';

const ARIA_RESPONSES: Record<string, { text: string; followUp?: string }> = {
  'hello': { text: "Hi there! I'm Aria, your personal AI niche advisor. I'm powered by GPT-4o, Gemma 2, and Claude working together to find your perfect online niche. How can I help you today?", followUp: "Try asking me about finding your niche or how the assessment works!" },
  'who are you': { text: "I'm Aria — a humanoid AI advisor built specifically for NicheGenius. I combine personality science, market intelligence, and AGI analysis to help you discover your perfect online niche. I'm not a generic chatbot — I'm specialized in niche discovery with access to 325 niches and 2.4 million data points.", followUp: "Want to start your assessment?" },
  'how does it work': { text: "Here's how I help you find your genius niche: First, you take our 155-question personality assessment covering MBTI, Big Five, Enneagram, and your values. Then I analyze your background, skills, and experience. My AGI engine cross-references everything against 325 real niches with market data. Finally, you get a complete blueprint with ranked niches, a sales funnel, product ideas, content calendar, and even a TikTok Live script!", followUp: "Ready to begin?" },
  'niche': { text: "Finding the right niche is everything. Most people pick a random topic and burn out. I match your personality DNA to market opportunity. Your niche should sit at the intersection of what you're naturally good at, what you enjoy, and what the market will pay for. That's exactly what our AGI engine calculates.", followUp: "Take the assessment to discover yours!" },
  'assessment': { text: "The assessment has 155 carefully designed questions across 7 categories: MBTI typing, Big Five personality traits, Enneagram patterns, core values, your background and skills, your goals, and your content style preferences. It takes about 25-30 minutes and every answer shapes your personalized blueprint.", followUp: "Start now at /assessment" },
  'agents': { text: "I work with a team of 10 specialized AI agents: NicheScout finds opportunities, PersonaMapper analyzes your personality, MarketOracle provides market data, CompetitorSpy analyzes competition, ContentArchitect plans your content strategy, FunnelForge designs your sales funnel, ProductGenius creates product ideas, TrendRadar tracks trends, ScriptWriter creates video scripts, and GrowthCoach guides your journey.", followUp: "Visit /agents to meet them all!" },
  'pricing': { text: "We have three plans: Free gives you a basic niche match. Pro at $47 unlocks the full 155-question assessment, 3 ranked niches, complete blueprint, sales funnel, and content calendar. Empire at $197 adds AI video scripts, 1-on-1 coaching, competitor analysis, revenue projections, and lifetime updates.", followUp: "Which plan interests you?" },
  'blueprint': { text: "Your blueprint is a comprehensive 7-section report: Overview of your personality-niche match, 3 AGI-ranked niche options, a complete sales funnel from free lead magnet to high-ticket offer, digital product ideas with pricing, a 30-day content calendar, a 60-minute TikTok Live script, and real-time market intelligence for your niche.", followUp: "Take the assessment to generate yours!" },
  'help': { text: "I can help you with: understanding how NicheGenius works, learning about the assessment process, exploring the 10 AI agents, understanding pricing plans, discovering what's in your blueprint, or just chatting about finding your perfect niche. What would you like to know?", followUp: "Just type your question!" },
  'default': { text: "That's a great question! While I'm in demo mode right now, the full version of me can analyze your personality, cross-reference 325 niches, generate complete business blueprints, and even create video scripts for your content. Take the assessment to experience my full capabilities!", followUp: "Try asking about the assessment, agents, pricing, or how it works!" },
};

function matchResponse(input: string): { text: string; followUp?: string } {
  const lower = input.toLowerCase();
  for (const [key, value] of Object.entries(ARIA_RESPONSES)) {
    if (key === 'default') continue;
    if (lower.includes(key)) return value;
  }
  // Check for common variations
  if (lower.includes('hi') || lower.includes('hey') || lower.includes('hello')) return ARIA_RESPONSES['hello'];
  if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) return ARIA_RESPONSES['pricing'];
  if (lower.includes('work') || lower.includes('process') || lower.includes('how')) return ARIA_RESPONSES['how does it work'];
  if (lower.includes('agent') || lower.includes('team')) return ARIA_RESPONSES['agents'];
  if (lower.includes('report') || lower.includes('result') || lower.includes('blueprint')) return ARIA_RESPONSES['blueprint'];
  if (lower.includes('quiz') || lower.includes('test') || lower.includes('assess') || lower.includes('question')) return ARIA_RESPONSES['assessment'];
  return ARIA_RESPONSES['default'];
}

const SUGGESTED_QUESTIONS = [
  "Who are you?",
  "How does it work?",
  "Tell me about the assessment",
  "What agents do you use?",
  "What's in the blueprint?",
  "What are the pricing plans?",
];

export default function AvatarPage() {
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'aria'; text: string }>>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-dismiss intro after 3 seconds
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setAvatarState('thinking');
    setIsTyping(true);

    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const response = matchResponse(msg);
    setAvatarState('speaking');

    // Type out the response
    await new Promise(r => setTimeout(r, 500));
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'aria', text: response.text }]);

    if (response.followUp) {
      await new Promise(r => setTimeout(r, 1000));
      setMessages(prev => [...prev, { role: 'aria', text: response.followUp! }]);
    }

    // Return to idle after speaking
    setTimeout(() => setAvatarState('idle'), 3000);
  };

  return (
    <div className="min-h-screen bg-[#030108] text-white overflow-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-violet-500/3 rounded-full blur-[150px]" />
      </div>

      {/* Top nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 max-sm:px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">N</span>
          </div>
          <span className="font-bold text-white text-sm">NicheGenius AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/assessment" className="px-4 py-2 text-xs font-semibold text-violet-400 hover:text-white transition">
            Take Assessment
          </Link>
          <Link href="/agents" className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition">
            Meet Agents
          </Link>
        </div>
      </nav>

      {/* Main content - split layout */}
      <div className="relative z-10 flex flex-row max-lg:flex-col items-start max-lg:items-center justify-center gap-16 max-lg:gap-8 px-8 max-sm:px-4 pt-4 pb-20 max-w-7xl mx-auto">

        {/* Left side - Avatar */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* Intro overlay */}
          <AnimatePresence>
            {showIntro && (
              <motion.div
                className="absolute z-30 inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <p className="text-xs font-bold tracking-[0.3em] uppercase text-violet-400 mb-3">Meet Your AI Advisor</p>
                  <h1 className="text-6xl max-sm:text-5xl font-black text-white mb-2">Aria</h1>
                  <p className="text-zinc-500 text-sm">Powered by GPT-4o • Gemma 2 • Claude</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <InteractiveAvatar
            state={avatarState}
            size="lg"
            showVideo={avatarState === 'speaking'}
            onVideoEnd={() => setAvatarState('idle')}
          />

          {/* Avatar info */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-black text-white">Aria</h2>
            <p className="text-zinc-500 text-sm mt-1">Your Personal Niche Advisor</p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                <span className="text-[10px] text-zinc-600">GPT-4o</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-zinc-600">Gemma 2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-[10px] text-zinc-600">Claude</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right side - Chat */}
        <motion.div
          className="w-[32rem] max-xl:w-[28rem] max-lg:w-full flex flex-col"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-white">Chat with Aria</span>
            <span className="text-[10px] text-zinc-600 ml-auto">Knowledge: 2.4M data points • 325 niches</span>
          </div>

          {/* Chat messages */}
          <div className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 min-h-[24rem] max-h-[32rem] overflow-y-auto space-y-3">
            {/* Welcome message */}
            {messages.length === 0 && (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <p className="text-zinc-400 text-sm mb-1">Hi! I&apos;m Aria, your AI niche advisor.</p>
                <p className="text-zinc-600 text-xs">Ask me anything about finding your perfect niche.</p>
              </motion.div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-violet-600/30 border border-violet-500/20 text-white'
                    : 'bg-white/[0.04] border border-white/[0.06] text-zinc-300'
                }`}>
                  {msg.role === 'aria' && (
                    <span className="text-[10px] font-bold text-violet-400 block mb-1">Aria</span>
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-violet-400"
                        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length === 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-white/[0.03] border border-white/[0.06] rounded-full hover:bg-violet-500/10 hover:border-violet-500/20 hover:text-violet-400 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {q}
                </motion.button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="mt-3 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Aria anything..."
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
            <motion.button
              onClick={() => handleSend()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </motion.button>
          </div>

          {/* Bottom info */}
          <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-600 px-1">
            <span>Powered by 6 MCP Servers • 24 AI Tools</span>
            <span>10 Specialized Agents</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
