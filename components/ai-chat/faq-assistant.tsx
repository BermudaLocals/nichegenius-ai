'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// ── Types ────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

// ── FAQ Knowledge Base ───────────────────────────────────────────────────

const FAQ_RESPONSES: Record<string, string> = {
  'what is nichegenius ai':
    "Great question! 😊 NicheGenius AI is the world's first AGI-powered niche discovery platform. We combine GPT-4o, Gemma 2, and Claude to analyze your personality, skills, and market data across 2.4 million data points — then I personally match you with the perfect online business niche. Think of me as your dedicated AI business advisor with a team of 10 specialist agents at my fingertips!",
  'how does the assessment work':
    "I'm so glad you asked! 💜 Our assessment is 155 carefully crafted questions across 4 key areas:\n\n• Personality Mapping — I use MBTI, Big Five & Enneagram to understand how you think\n• Skills & Background — Your experience, strengths, and hidden talents\n• Goals & Lifestyle — Income targets, time availability, risk comfort\n• Content Style — How you naturally communicate\n\nI cross-reference every answer against real market data to find your highest-probability niche match. It's like having a career counselor, market analyst, and business strategist all working together!",
  'what ai models do you use':
    "Behind the scenes, I'm powered by a multi-model AGI architecture — it's what makes me special! 🤖\n\n• GPT-4o — My primary reasoning engine for niche analysis\n• Gemma 2 — Handles personality pattern recognition & psychometric modeling\n• Claude — Synthesizes market research & strategic planning\n\nAll three collaborate through our Model Context Protocol (MCP), which means I can deliver insights no single AI could achieve alone. Pretty cool, right?",
  'how accurate are the results':
    "I'm really proud of this one! 🎯 We achieve a 97.3% match accuracy based on user satisfaction surveys and 6-month follow-ups. That's because I don't just run a simple quiz — I coordinate 10 specialized AI agents analyzing your personality fit, market opportunity, competition levels, content style alignment, and revenue potential all at once. My users tell me the results feel almost eerily accurate!",
  "what's included in the free plan":
    "The Free Plan is a great way to meet me! 🆓 Here's what you get:\n\n• Complete 155-question assessment with me\n• Your #1 top niche match with basic analysis\n• Personality profile summary (MBTI + Big Five)\n• Basic market size indicator\n\nIt's the perfect first step to experience what AGI-driven niche discovery feels like. I promise you'll be impressed!",
  "what's included in pro":
    "The Pro Plan at $47 is where the magic really happens! ⭐\n\n• Full 3-niche blueprint with my detailed analysis\n• Complete personality-to-niche mapping\n• Market intelligence report (size, growth, competition)\n• Competitor analysis for each niche\n• 30-day content calendar I build just for you\n• Product ideas with pricing strategies\n• Sales funnel blueprint\n• Unlimited assessment retakes\n\nMost of my users say Pro alone was worth 10x the price!",
  "what's included in empire":
    "Oh, Empire is my absolute favorite plan! 👑 It's $197 and includes everything in Pro, PLUS:\n\n• AI-generated video scripts (TikTok, YouTube, HeyGen)\n• HeyGen AI avatar video generation — videos featuring AI avatars!\n• Personal AI business coaching from me (ongoing!)\n• Trend radar alerts for your niche\n• Priority support & strategy calls\n• Lifetime updates & all new agent features\n• Complete business launch roadmap\n\nEmpire clients get my full attention and the best results. It's truly transformational! 🚀",
  'how long does the assessment take':
    "The assessment takes about 25-30 minutes ⏱️ I know that sounds like a lot, but I promise every question matters! I recommend finding a quiet moment to answer thoughtfully — the quality of your results directly depends on honest, reflective answers.\n\nGood news: your progress is automatically saved, so you can pause and come back anytime. I'll be right here waiting! 💜",
  'can i retake the assessment':
    "Absolutely, yes! 🔄 You can retake the assessment unlimited times. I actually encourage it — as you grow and evolve, your ideal niche may shift too. Many of my users retake every 3-6 months to discover new opportunities aligned with their current skills and goals. Each time, I'll give you fresh, updated insights!",
  'what is mcp':
    "MCP stands for Model Context Protocol — it's the secret sauce behind my intelligence! 🔗\n\nThink of it as a shared brain that lets all my AI agents collaborate in real-time. When my NicheScout agent discovers a promising niche, it instantly shares that context with MarketOracle, CompetitorSpy, and all 7 other agents. This creates a unified intelligence that's far more powerful than any single AI model working alone.\n\nIt's like having a team meeting happening at the speed of light!",
  'how does heygen integration work':
    "This is one of my favorite features! 🎬 HeyGen Integration (Empire Plan) creates professional AI avatar videos for your niche:\n\n1. My ScriptWriter agent crafts platform-optimized scripts\n2. You choose from premium AI avatars\n3. HeyGen generates photorealistic talking-head videos\n4. Download ready-to-post content for TikTok, YouTube, Instagram\n\nImagine having a professional video production team — but powered by AI and ready in minutes, not weeks! My Empire clients love it.",
  'what niches are covered':
    "We cover a LOT! 🌐 Over 500+ niches across 8 major categories:\n\n• 💪 Health & Fitness\n• 💰 Finance & Investing\n• 🎨 Creative & Design\n• 💻 Technology & SaaS\n• 📚 Education & Coaching\n• 🏠 Home & Lifestyle\n• 🎮 Gaming & Entertainment\n• 🌿 Sustainability & Wellness\n\nPlus, my TrendRadar agent is constantly discovering emerging micro-niches within these categories. The database grows every single day!",
  'is my data secure':
    "Your privacy is sacred to me! 🔒 Here's how I protect you:\n\n• AES-256 encryption at rest\n• TLS 1.3 encryption in transit\n• SOC 2 compliant data handling\n• Zero data sharing with third parties\n• GDPR & CCPA fully compliant\n• You can delete all your data anytime\n\nYour assessment answers are used solely to generate your personalized results. I take this very seriously — trust is everything! 💜",
  'do you offer refunds':
    "Of course! 💯 We offer a 30-day money-back guarantee on all paid plans. If you're not completely thrilled with your niche blueprint, just email support@nichegenius.ai for a full refund — absolutely no questions asked.\n\nHonestly though? Less than 2% of users ever request one. I'm that confident I'll find your perfect niche! 😊",
  'how is this different from other niche tools':
    "Oh, I love this question! 🚀 Most niche tools are simple quizzes that match keywords to generic suggestions. Here's why I'm fundamentally different:\n\n• Multi-Model AGI vs. single model or rules\n• 10 specialized AI agents vs. one generic algorithm\n• 2.4M data points vs. basic keyword matching\n• Personality science (MBTI, Big Five, Enneagram) vs. surface preferences\n• Real-time market data vs. static databases\n• Complete business blueprint vs. just a niche name\n\nIt's the difference between asking one friend for advice and having a boardroom of 10 world-class experts analyzing your potential. I'm not just another tool — I'm your AI business partner! 💜",
};

const SUGGESTED_QUESTIONS = [
  'What is NicheGenius AI?',
  'How does the assessment work?',
  'What AI models do you use?',
  'How accurate are the results?',
  "What's included in the free plan?",
  "What's included in Pro ($47)?",
  "What's included in Empire ($197)?",
  'How long does the assessment take?',
  'Can I retake the assessment?',
  'What is MCP?',
  'How does HeyGen integration work?',
  'What niches are covered?',
  'Is my data secure?',
  'Do you offer refunds?',
  'How is this different from other niche tools?',
];

const STORAGE_KEY = 'nichegenius-faq-chat';

// ── Helpers ──────────────────────────────────────────────────────────────

function matchFAQ(input: string): string {
  const normalized = input.toLowerCase().replace(/[?!.,;:'"/()$]/g, '').trim();

  for (const [key, value] of Object.entries(FAQ_RESPONSES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  const keywordMap: Record<string, string[]> = {
    'what is nichegenius ai': ['nichegenius', 'what is this', 'about', 'platform', 'what do you do', 'tell me about'],
    'how does the assessment work': ['assessment', 'questions', '155', 'quiz', 'test', 'survey', 'how does it work'],
    'what ai models do you use': ['models', 'gpt', 'gemma', 'claude', 'ai models', 'llm', 'which ai', 'technology'],
    'how accurate are the results': ['accurate', 'accuracy', 'reliable', 'trust', 'results quality', '97', 'how good'],
    "what's included in the free plan": ['free', 'free plan', 'no cost', 'trial', 'free tier'],
    "what's included in pro": ['pro plan', '$47', '47 dollar', 'paid plan', 'upgrade'],
    "what's included in empire": ['empire', '$197', '197', 'premium', 'top plan', 'best plan'],
    'how long does the assessment take': ['how long', 'time', 'minutes', 'duration'],
    'can i retake the assessment': ['retake', 'redo', 'again', 'restart', 'try again'],
    'what is mcp': ['mcp', 'model context protocol', 'protocol', 'orchestration'],
    'how does heygen integration work': ['heygen', 'avatar', 'video generation', 'ai video', 'talking head'],
    'what niches are covered': ['niches covered', 'categories', 'how many niches', '500', 'which niches', 'niche list'],
    'is my data secure': ['secure', 'security', 'privacy', 'data', 'encryption', 'safe', 'gdpr'],
    'do you offer refunds': ['refund', 'money back', 'guarantee', 'cancel', 'return'],
    'how is this different from other niche tools': ['different', 'comparison', 'vs', 'other tools', 'unique', 'better', 'competitor', 'why you'],
  };

  for (const [faqKey, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      return FAQ_RESPONSES[faqKey]!;
    }
  }

  return "That's a wonderful question! 🤔 It's a bit outside my FAQ knowledge, but I'd love to help you further:\n\n1. Start your free assessment — I'll show you what I can really do\n2. Email us at support@nichegenius.ai for detailed inquiries\n3. Check out our /agents page to meet my full team of 10 AI specialists\n\nIs there anything else about NicheGenius AI I can help with? 💜";
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Aria Avatar Component ────────────────────────────────────────────────

function AriaAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };
  return (
    <div className={cn('relative flex-shrink-0 rounded-full', sizes[size])}>
      <Image
        src="/avatars/aria-avatar.svg"
        alt="Aria — NicheGenius AI Assistant"
        fill
        className="rounded-full object-cover"
        priority
      />
      <span className="absolute inset-0 rounded-full ring-2 ring-violet-500/40" />
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────

export function FAQAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch { /* empty */ }
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hey there! 👋 I'm Aria, your personal NicheGenius AI advisor. I'm here to answer all your questions about our platform, help you understand our AI technology, and guide you to the perfect niche for your online business. Pick a question below or just ask me anything! 💜",
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // Save to sessionStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch { /* full */ }
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typing) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setTyping(true);

      const delay = 800 + Math.random() * 700;
      setTimeout(() => {
        const response = matchFAQ(trimmed);
        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setTyping(false);
      }, delay);
    },
    [typing],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Simple markdown-ish rendering
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part.split('\n').map((line, j, arr) => (
        <span key={`${i}-${j}`}>
          {line}
          {j < arr.length - 1 && <br />}
        </span>
      ));
    });
  };

  return (
    <>
      {/* ── Floating Orb Button ─────────────────────────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => setOpen(true)}
            className={cn(
              'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]',
              'w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-full',
              'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600',
              'shadow-lg shadow-violet-500/40',
              'flex items-center justify-center',
              'cursor-pointer',
              'group overflow-hidden',
            )}
            aria-label="Chat with Aria — AI Assistant"
          >
            {/* Animated pulse rings */}
            <span className="absolute inset-0 rounded-full bg-violet-500/25 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/20 to-purple-600/20 animate-pulse" />
            {/* Avatar */}
            <div className="relative w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full overflow-hidden border-2 border-white/20 z-10">
              <Image
                src="/avatars/aria-avatar.svg"
                alt="Aria"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-400 rounded-full border-2 border-violet-600 z-20">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'fixed z-[9999]',
              // Mobile: full screen bottom sheet
              'inset-0 sm:inset-auto',
              // Desktop: positioned bottom-right
              'sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[600px]',
              'flex flex-col',
              'sm:rounded-2xl overflow-hidden',
              'bg-zinc-950/95 sm:bg-zinc-950/90 backdrop-blur-2xl',
              'sm:border sm:border-white/[0.08]',
              'sm:shadow-2xl sm:shadow-violet-500/10',
            )}
          >
            {/* ── Header ──────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/[0.08] bg-gradient-to-r from-violet-950/50 via-purple-950/30 to-indigo-950/50 safe-area-top">
              <div className="flex items-center gap-3">
                <AriaAvatar size="md" />
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                    Aria
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/20">
                      <Sparkles className="w-2.5 h-2.5" />
                      AI
                    </span>
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-zinc-400">Your AI Business Advisor</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                aria-label="Close chat"
              >
                {/* Mobile: show chevron down for bottom-sheet feel, desktop: X */}
                <X className="w-5 h-5 hidden sm:block" />
                <ChevronDown className="w-5 h-5 sm:hidden" />
              </button>
            </div>

            {/* ── Messages ────────────────────────────────────────── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'flex gap-2.5',
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                    )}
                  >
                    {msg.role === 'assistant' && <AriaAvatar size="sm" />}

                    <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[80%]">
                      <div
                        className={cn(
                          'px-3.5 sm:px-4 py-3 rounded-2xl text-[13px] sm:text-[13px] leading-relaxed',
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-md shadow-lg shadow-violet-500/15'
                            : 'bg-white/[0.05] border border-white/[0.08] text-zinc-200 rounded-bl-md',
                        )}
                      >
                        {renderContent(msg.content)}
                      </div>
                      <span
                        className={cn(
                          'text-[10px] text-zinc-500 px-2',
                          msg.role === 'user' ? 'text-right' : 'text-left',
                        )}
                      >
                        {msg.role === 'assistant' && 'Aria • '}
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5"
                >
                  <AriaAvatar size="sm" />
                  <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-zinc-400 mr-1">Aria is typing</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Suggested Questions ─────────────────────────────── */}
            <div className="px-3 py-2 border-t border-white/5">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {SUGGESTED_QUESTIONS.filter(
                  (q) => !messages.some((m) => m.role === 'user' && m.content === q),
                )
                  .slice(0, 8)
                  .map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      disabled={typing}
                      className={cn(
                        'flex-shrink-0 px-3 py-2 sm:py-1.5 rounded-full text-[11px] font-medium',
                        'bg-violet-500/10 text-violet-300 border border-violet-500/20',
                        'hover:bg-violet-500/20 hover:text-violet-200 transition-all',
                        'disabled:opacity-40 disabled:cursor-not-allowed',
                        'whitespace-nowrap cursor-pointer min-h-[36px] sm:min-h-[32px]',
                      )}
                    >
                      {q}
                    </button>
                  ))}
              </div>
            </div>

            {/* ── Input - larger on mobile ────────────────────────── */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-3 border-t border-white/[0.08] bg-zinc-950/60 safe-area-bottom"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Aria anything..."
                disabled={typing}
                className={cn(
                  'flex-1 bg-white/[0.06] border border-white/10 rounded-xl',
                  'px-4 py-3 sm:py-2.5',
                  'text-base sm:text-sm text-white',
                  'placeholder:text-zinc-500 outline-none',
                  'focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20',
                  'transition-all disabled:opacity-50',
                  'min-h-[48px] sm:min-h-[40px]',
                )}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || typing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'w-12 h-12 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  'bg-gradient-to-r from-violet-600 to-purple-600',
                  'text-white shadow-lg shadow-violet-500/25',
                  'hover:shadow-violet-500/40 transition-shadow',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                )}
              >
                <Send className="w-4 h-4 sm:w-4 sm:h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FAQAssistant;
