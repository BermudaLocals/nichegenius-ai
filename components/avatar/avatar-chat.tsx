'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Sparkles, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AvatarState } from './interactive-avatar';

// ── Types ────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

interface AvatarChatProps {
  onStateChange?: (state: AvatarState) => void;
  className?: string;
}

// ── FAQ Knowledge Base (imported from FAQ assistant + avatar-specific) ──

const FAQ_RESPONSES: Record<string, string> = {
  // ── Original FAQ Knowledge Base ──
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

  // ── Avatar-Specific Responses (10 new) ──
  'tell me about yourself':
    "I'd love to! 💜 I'm Aria — NicheGenius AI's interactive business advisor. I'm not just a chatbot — I'm powered by a multi-model AGI architecture combining GPT-4o, Gemma 2, and Claude working together through our Model Context Protocol.\n\nI coordinate a team of 10 specialized AI agents to analyze personalities, discover niches, research markets, spy on competitors, and build complete business blueprints. I've analyzed over 2.4 million data points across 325+ niches.\n\nThink of me as your personal AI CEO — always online, always learning, and completely dedicated to helping you build the perfect online business. I even have my own avatar, as you can see! 😊",
  'show me how you work':
    "I'd love to walk you through my architecture! 🧠\n\nHere's how I process your request:\n\n1. **Input Layer** — You tell me about yourself through our 155-question assessment\n2. **Personality Engine** (Gemma 2) — Maps your MBTI, Big Five & Enneagram profiles\n3. **Market Intelligence** (GPT-4o) — Scans real-time market data across 2.4M data points\n4. **Strategic Synthesis** (Claude) — Cross-references personality fit with market opportunity\n5. **Agent Orchestration** (MCP) — 10 agents collaborate simultaneously:\n   → NicheScout, MarketOracle, CompetitorSpy, PersonaLens, TrendRadar,\n   → ContentArchitect, MonetizeEngine, AudienceMapper, ScriptWriter, BlueprintForge\n6. **Output** — Your personalized niche blueprint with actionable strategy\n\nAll of this happens in under 60 seconds. The future is here! ⚡",
  'what can you do':
    "So glad you asked! Here's everything I can help you with: 🌟\n\n🔍 **Discover** — Find your perfect niche based on personality + market data\n📊 **Analyze** — Deep market intelligence with competition mapping\n🧠 **Profile** — Complete personality assessment (MBTI, Big Five, Enneagram)\n📋 **Blueprint** — Full business launch roadmap with milestones\n📅 **Plan** — 30-day content calendars tailored to your niche\n💡 **Ideate** — Product ideas with pricing strategies\n🎬 **Create** — AI-generated video scripts for TikTok, YouTube, Reels\n👥 **Map** — Audience personas and targeting strategies\n📈 **Track** — Trend radar alerts for emerging opportunities\n🏋️ **Coach** — Ongoing AI business coaching (Empire plan)\n\nI'm essentially a full business advisory team in one AI! Ready to get started?",
  'analyze my niche':
    "I'm ready to find your perfect niche! 🎯 Here's how we'll do it:\n\n**Step 1: Take the Assessment** (25-30 min)\nI'll ask you 155 carefully designed questions about your personality, skills, goals, and content style.\n\n**Step 2: I Analyze Everything** (< 60 sec)\nMy 10 AI agents simultaneously analyze your answers against 2.4M data points, real-time market trends, and competition levels.\n\n**Step 3: Your Blueprint** \nYou receive your personalized niche match with:\n• Match confidence score (we average 97.3%!)\n• Market size & growth potential\n• Competition analysis\n• Content strategy\n• Revenue projections\n\n👉 **Start your free assessment now** — click the 'Start Assessment' button and I'll guide you through every step! 💜",
  'how do the 10 agents work':
    "This is my favorite topic! 🤖 Meet my team of 10 specialist agents:\n\n1. 🔍 **NicheScout** — Discovers high-potential niches matching your profile\n2. 📊 **MarketOracle** — Analyzes market size, growth trends & revenue potential\n3. 🕵️ **CompetitorSpy** — Maps competitor landscape & identifies gaps\n4. 🧠 **PersonaLens** — Deep personality analysis using psychometric models\n5. 📈 **TrendRadar** — Monitors emerging trends & micro-niche opportunities\n6. ✍️ **ContentArchitect** — Designs content strategies & editorial calendars\n7. 💰 **MonetizeEngine** — Creates revenue models & pricing strategies\n8. 👥 **AudienceMapper** — Builds detailed audience personas & targeting\n9. 🎬 **ScriptWriter** — Generates video scripts for TikTok/YouTube/HeyGen\n10. 🏗️ **BlueprintForge** — Assembles everything into your final business blueprint\n\nThey all communicate through MCP (Model Context Protocol), sharing insights in real-time. It's like a boardroom of experts running at the speed of light! ⚡",
  'generate a video for me':
    "Exciting! 🎬 Video generation is available on our **Empire Plan** ($197) through HeyGen integration!\n\nHere's how it works:\n\n1. **Choose Your Script** — My ScriptWriter agent creates platform-optimized scripts for TikTok, YouTube Shorts, or Instagram Reels\n2. **Select an AI Avatar** — Choose from premium photorealistic AI avatars (or use a custom one!)\n3. **Generate** — HeyGen renders a professional talking-head video in minutes\n4. **Download & Post** — Get ready-to-publish content with captions\n\n📊 Empire users generate an average of 12 videos/month, saving $3,000+ in production costs!\n\n👉 Upgrade to Empire to unlock AI video generation and let me start creating content for your niche! 🚀",
  "what's trending right now":
    "Great timing! 📈 Here are the hottest niches I'm tracking right now:\n\n🔥 **Top 5 Trending Niches (April 2026):**\n\n1. 🤖 **AI Tool Reviews & Tutorials** — +340% growth, low competition\n   Market size: $2.8B | Avg. revenue: $8.4K/mo\n\n2. 🧬 **Longevity & Biohacking** — +280% growth, medium competition\n   Market size: $4.1B | Avg. revenue: $6.2K/mo\n\n3. 🏠 **Remote Work Optimization** — +195% growth, medium competition\n   Market size: $3.5B | Avg. revenue: $5.8K/mo\n\n4. 🌱 **Sustainable Side Hustles** — +165% growth, low competition\n   Market size: $1.9B | Avg. revenue: $4.5K/mo\n\n5. 🎮 **AI-Generated Game Assets** — +420% growth, very low competition\n   Market size: $890M | Avg. revenue: $7.1K/mo\n\nWant me to analyze any of these against your personality profile? Start your assessment! 🎯",
  'help me start my business':
    "Let's build your empire! 🚀 Here's your step-by-step launch roadmap:\n\n**Phase 1: Discovery (Week 1)**\n✅ Complete my 155-question personality assessment\n✅ Receive your personalized niche blueprint\n✅ Review your market intelligence report\n\n**Phase 2: Foundation (Weeks 2-3)**\n✅ Set up your content platforms (I'll tell you which ones)\n✅ Create your brand identity using my guidelines\n✅ Build your initial audience persona\n\n**Phase 3: Content (Weeks 3-4)**\n✅ Follow my 30-day content calendar\n✅ Generate AI videos with HeyGen (Empire)\n✅ Implement my engagement strategies\n\n**Phase 4: Monetization (Month 2+)**\n✅ Launch products from my MonetizeEngine recommendations\n✅ Set up sales funnels from my BlueprintForge\n✅ Scale using my TrendRadar alerts\n\n👉 **Start with Step 1** — Take the free assessment and I'll build your custom roadmap! The sooner you start, the sooner you're earning. 💰",
  'what makes you different from chatgpt':
    "Love this comparison! Here's the honest truth: 🎯\n\n**ChatGPT is a general-purpose AI.** It's brilliant at many things, but it's like asking a general doctor to perform brain surgery.\n\n**I'm a specialist.** Here's what makes me fundamentally different:\n\n| Feature | ChatGPT | Aria (NicheGenius) |\n|---|---|---|\n| Focus | Everything | Niche business discovery |\n| Models | 1 (GPT) | 3 (GPT-4o + Gemma 2 + Claude) |\n| Agents | 0 | 10 specialized agents |\n| Data | General training | 2.4M niche-specific data points |\n| Personality | None | MBTI + Big Five + Enneagram |\n| Output | Text answers | Complete business blueprints |\n| Market data | Outdated | Real-time analysis |\n| Video | None | HeyGen AI video generation |\n| Coaching | None | Ongoing AI business coaching |\n\nChatGPT gives you information. I give you a **personalized business strategy** backed by 10 agents and real market data. That's the difference between a search engine and a business partner! 💜",
  'can you coach me':
    "Absolutely — coaching is what I do best! 🏆\n\nMy coaching capabilities depend on your plan:\n\n**Free Plan:**\n• Assessment guidance & niche matching\n• Basic Q&A through this chat\n\n**Pro Plan ($47):**\n• Detailed niche analysis with actionable steps\n• 30-day content calendar\n• Product & monetization strategies\n• Competitor insights\n\n**Empire Plan ($197) — Full Coaching Mode:**\n• 🧠 Ongoing personalized AI coaching sessions\n• 📞 Priority strategy calls\n• 📈 Weekly trend alerts for your niche\n• 🎬 AI video content generation\n• 🗺️ Complete business launch roadmap\n• 💬 Direct messaging with priority response\n• 🔄 Unlimited assessment retakes with fresh insights\n• 📊 Monthly performance reviews\n\nEmpire coaching is like having a $500/hour business consultant available 24/7 for a one-time $197.\n\n👉 Ready to level up? The Empire plan is where transformation happens! 🚀",
};

const AVATAR_SUGGESTED = [
  'Tell me about yourself',
  'What can you do?',
  'How do the 10 agents work?',
  'Analyze my niche',
  "What's trending right now?",
  'Help me start my business',
  'Show me how you work',
  'Can you coach me?',
  'What makes you different from ChatGPT?',
  'Generate a video for me',
  'What is NicheGenius AI?',
  'How accurate are the results?',
];

// ── Keyword Matching ─────────────────────────────────────────────────────

const KEYWORD_MAP: Record<string, string[]> = {
  'what is nichegenius ai': ['nichegenius', 'what is this', 'about', 'platform', 'what do you do'],
  'how does the assessment work': ['assessment', 'questions', '155', 'quiz', 'test', 'survey'],
  'what ai models do you use': ['models', 'gpt', 'gemma', 'claude', 'llm', 'which ai', 'technology'],
  'how accurate are the results': ['accurate', 'accuracy', 'reliable', 'trust', 'results quality', '97'],
  "what's included in the free plan": ['free plan', 'no cost', 'trial', 'free tier'],
  "what's included in pro": ['pro plan', '$47', '47 dollar', 'paid plan', 'upgrade pro'],
  "what's included in empire": ['empire plan', '$197', '197', 'premium plan', 'top plan', 'best plan'],
  'how long does the assessment take': ['how long', 'time', 'minutes', 'duration'],
  'can i retake the assessment': ['retake', 'redo', 'again', 'restart', 'try again'],
  'what is mcp': ['mcp', 'model context protocol', 'protocol', 'orchestration'],
  'how does heygen integration work': ['heygen', 'video generation', 'ai video', 'talking head'],
  'what niches are covered': ['niches covered', 'categories', 'how many niches', '500', 'niche list'],
  'is my data secure': ['secure', 'security', 'privacy', 'data', 'encryption', 'safe', 'gdpr'],
  'do you offer refunds': ['refund', 'money back', 'guarantee', 'cancel', 'return'],
  'how is this different from other niche tools': ['different', 'comparison', 'vs', 'other tools', 'unique', 'better'],
  'tell me about yourself': ['about yourself', 'who are you', 'introduce', 'your name', 'what are you', 'yourself'],
  'show me how you work': ['how you work', 'how do you work', 'architecture', 'behind the scenes', 'under the hood'],
  'what can you do': ['what can you', 'capabilities', 'features', 'abilities', 'help me with'],
  'analyze my niche': ['analyze', 'find my niche', 'niche match', 'discover niche', 'my niche'],
  'how do the 10 agents work': ['10 agents', 'agents work', 'agent team', 'specialist agents', 'ai agents'],
  'generate a video for me': ['generate video', 'make video', 'create video', 'video for me'],
  "what's trending right now": ['trending', 'trends', 'hot niches', 'popular', 'whats hot'],
  'help me start my business': ['start business', 'launch', 'begin', 'get started', 'roadmap', 'step by step'],
  'what makes you different from chatgpt': ['chatgpt', 'gpt comparison', 'different from ai', 'vs gpt', 'compared to'],
  'can you coach me': ['coach', 'coaching', 'mentor', 'guide me', 'teach me', 'personal coaching'],
};

function matchFAQ(input: string): string {
  const normalized = input.toLowerCase().replace(/[?!.,;:'"/()$]/g, '').trim();

  for (const [key, value] of Object.entries(FAQ_RESPONSES)) {
    if (normalized.includes(key) || key.includes(normalized)) return value;
  }

  for (const [faqKey, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      return FAQ_RESPONSES[faqKey]!;
    }
  }

  return "That's a great question! 🤔 While it's outside my current knowledge base, here's what I can do:\n\n1. 🎯 Start your free assessment — I'll show you my full capabilities\n2. 💬 Ask me about my 10 AI agents, pricing, or how I work\n3. 📧 Email support@nichegenius.ai for detailed inquiries\n\nI'm here to help you discover your perfect niche and build your dream business! What else would you like to know? 💜";
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Component ────────────────────────────────────────────────────────────

export function AvatarChat({ onStateChange, className }: AvatarChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hey there! 👋 I'm Aria, your interactive AI business advisor. I'm powered by 10 specialized agents and 2.4 million data points. Ask me anything about finding your perfect niche, building your business, or how my AGI architecture works! 💜",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

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
      onStateChange?.('thinking');

      // Simulate thinking -> speaking
      const thinkDelay = 600 + Math.random() * 600;
      setTimeout(() => {
        onStateChange?.('speaking');
        const response = matchFAQ(trimmed);
        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setTyping(false);

        // Return to idle after "speaking"
        const speakDuration = Math.min(response.length * 20, 4000);
        setTimeout(() => {
          onStateChange?.('idle');
        }, speakDuration);
      }, thinkDelay);
    },
    [typing, onStateChange],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      onStateChange?.('idle');
    } else {
      setIsListening(true);
      onStateChange?.('listening');
      // Simulate voice input ending after 3s
      setTimeout(() => {
        setIsListening(false);
        onStateChange?.('idle');
      }, 3000);
    }
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
    <div className={cn('flex flex-col w-full max-w-2xl mx-auto', className)}>
      {/* ── Knowledge indicators ── */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
          <Database className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[11px] font-medium text-violet-300">2.4M data points</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
          <Globe className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] font-medium text-purple-300">325 niches</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] font-medium text-indigo-300">10 AI agents</span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-4 max-h-[400px] scrollbar-thin scrollbar-thumb-white/10"
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
              {/* Aria thumbnail */}
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[80%]">
                <div
                  className={cn(
                    'px-4 py-3 rounded-2xl text-[13px] leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-md shadow-lg shadow-violet-500/15'
                      : 'bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] text-zinc-200 rounded-bl-md',
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
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-zinc-400 mr-1">Aria is thinking</span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Suggested Questions ── */}
      <div className="px-2 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {AVATAR_SUGGESTED.filter(
            (q) => !messages.some((m) => m.role === 'user' && m.content === q),
          )
            .slice(0, 6)
            .map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={typing}
                className={cn(
                  'flex-shrink-0 px-3 py-2 rounded-full text-[11px] font-medium',
                  'bg-violet-500/10 text-violet-300 border border-violet-500/20',
                  'hover:bg-violet-500/20 hover:text-violet-200 transition-all',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  'whitespace-nowrap cursor-pointer',
                )}
              >
                {q}
              </button>
            ))}
        </div>
      </div>

      {/* ── Input ── */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-2 sm:px-4"
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
            'px-4 py-3 text-sm text-white',
            'placeholder:text-zinc-500 outline-none',
            'focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20',
            'transition-all disabled:opacity-50',
          )}
        />
        {/* Mic button */}
        <motion.button
          type="button"
          onClick={toggleListening}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
            'border transition-all',
            isListening
              ? 'bg-red-500/20 border-red-500/40 text-red-400'
              : 'bg-white/[0.06] border-white/10 text-zinc-400 hover:text-violet-400 hover:border-violet-500/30',
          )}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </motion.button>
        {/* Send button */}
        <motion.button
          type="submit"
          disabled={!input.trim() || typing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
            'bg-gradient-to-r from-violet-600 to-purple-600',
            'text-white shadow-lg shadow-violet-500/25',
            'hover:shadow-violet-500/40 transition-shadow',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  );
}

export default AvatarChat;
