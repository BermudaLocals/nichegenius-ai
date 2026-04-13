'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, ChevronLeft, ChevronRight, Clock, Sparkles,
  CheckCircle2, SkipForward, Save, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { GradientText } from '@/components/ui/gradient-text';
import { cn } from '@/lib/utils';
import { QUESTION_BANK, SECTION_MAP, type Question } from '@/lib/assessment/questions';

// ---- Constants ----
const STORAGE_KEY = 'nichegenius_assessment';
const SECTIONS = [
  { id: 'personality_mbti', label: 'MBTI', icon: '🧠', category: 'Personality' },
  { id: 'personality_bigfive', label: 'Big Five', icon: '🎭', category: 'Personality' },
  { id: 'personality_enneagram', label: 'Enneagram', icon: '🔮', category: 'Personality' },
  { id: 'personality_values', label: 'Values', icon: '💎', category: 'Personality' },
  { id: 'background_work', label: 'Work', icon: '💼', category: 'Background' },
  { id: 'background_education', label: 'Education', icon: '🎓', category: 'Background' },
  { id: 'background_skills', label: 'Skills', icon: '⚡', category: 'Background' },
  { id: 'background_hobbies', label: 'Hobbies', icon: '🎨', category: 'Background' },
  { id: 'goals_income', label: 'Income', icon: '💰', category: 'Goals' },
  { id: 'goals_lifestyle', label: 'Lifestyle', icon: '🌴', category: 'Goals' },
  { id: 'goals_impact', label: 'Impact', icon: '🌍', category: 'Goals' },
  { id: 'goals_timeline', label: 'Timeline', icon: '⏰', category: 'Goals' },
  { id: 'content_platform', label: 'Platform', icon: '📱', category: 'Content Style' },
  { id: 'content_communication', label: 'Communication', icon: '💬', category: 'Content Style' },
  { id: 'content_creation', label: 'Creation', icon: '✍️', category: 'Content Style' },
];

type SavedProgress = {
  answers: Record<string, string | string[] | number>;
  currentIndex: number;
  startTime: number;
};

// ---- Slide Variants ----
const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

// ---- Confetti burst ----
function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${50 + (Math.random() - 0.5) * 40}%`,
            top: '40%',
            backgroundColor: ['#8b5cf6', '#a855f7', '#d946ef', '#f472b6', '#818cf8', '#fbbf24'][i % 6],
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0.5],
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 1.5, delay: Math.random() * 0.3, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// ---- Likert Scale Input ----
function LikertScale({
  value, onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
  return (
    <div className="flex gap-3 max-sm:gap-2 justify-center flex-wrap">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(n)}
          className={cn(
            'flex flex-col items-center gap-2 max-sm:gap-1.5 px-5 max-sm:px-3 py-4 max-sm:py-3 rounded-xl border transition-all min-w-[90px] max-sm:min-w-[60px] min-h-[44px]',
            value === n
              ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 shadow-lg shadow-violet-500/10'
              : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:border-white/20 hover:bg-white/[0.05]',
          )}
        >
          <span className="text-2xl max-sm:text-xl font-bold">{n}</span>
          <span className="text-[10px] max-sm:text-[9px] leading-tight text-center">{labels[n - 1]}</span>
        </motion.button>
      ))}
    </div>
  );
}

function ChoiceCards({
  options, value, onChange, multi = false,
}: {
  options: Array<{ value: string; label: string }>;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
  multi?: boolean;
}) {
  const selected = multi ? (Array.isArray(value) ? value : []) : value;

  function toggle(opt: { value: string; label: string }) {
    if (multi) {
      const arr = Array.isArray(selected) ? selected : [];
      if (arr.includes(opt.value)) onChange(arr.filter((x) => x !== opt.value));
      else onChange([...arr, opt.value]);
    } else {
      onChange(opt.value);
    }
  }

  return (
    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3 max-sm:gap-2">
      {options.map((opt) => {
        const isSelected = multi
          ? Array.isArray(selected) && selected.includes(opt.value)
          : selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggle(opt)}
            className={cn(
              'px-4 py-3 max-sm:py-3.5 rounded-xl border text-left text-sm transition-all min-h-[48px]',
              isSelected
                ? 'bg-violet-500/20 border-violet-500/50 text-violet-200'
                : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:border-white/20',
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-5 h-5 max-sm:w-6 max-sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                isSelected ? 'border-violet-400 bg-violet-500/30' : 'border-zinc-600',
              )}>
                {isSelected && <div className="w-2 h-2 max-sm:w-2.5 max-sm:h-2.5 rounded-full bg-violet-400" />}
              </div>
              <span className="text-sm">{opt.label}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ---- Text Input ----
function TextInput({
  value, onChange, placeholder,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Type your answer...'}
      rows={4}
      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm max-sm:text-base placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 resize-none transition-all min-h-[120px]"
    />
  );
}

// ---- Timer ----
function Timer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  const mins = Math.floor(elapsed / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  return (
    <div className="flex items-center gap-1.5 text-sm max-sm:text-xs text-zinc-500">
      <Clock className="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5" />
      <span className="tabular-nums">{mins}:{secs.toString().padStart(2, '0')}</span>
    </div>
  );
}

// ============================================
// MAIN ASSESSMENT PAGE
// ============================================

export default function AssessmentPage() {
  const router = useRouter();
  const questions: Question[] = useMemo(() => QUESTION_BANK, []);
  const totalQuestions = questions.length;

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [direction, setDirection] = useState(1);
  const [startTime, setStartTime] = useState(Date.now());
  const [showConfetti, setShowConfetti] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;

  // Find current section
  const currentSection = useMemo(() => {
    if (!currentQuestion) return SECTIONS[0];
    return (
      SECTIONS.find((s) => currentQuestion.category.startsWith(s.id) || s.id === currentQuestion.category) ||
      SECTIONS.find((s) => currentQuestion.category.includes(s.id.split('_').pop() || '')) ||
      SECTIONS[0]
    );
  }, [currentQuestion]);

  // Load saved progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: SavedProgress = JSON.parse(saved);
        setAnswers(data.answers || {});
        setCurrentIndex(data.currentIndex || 0);
        setStartTime(data.startTime || Date.now());
      }
    } catch {}
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      const data: SavedProgress = { answers, currentIndex, startTime };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [answers, currentIndex, startTime]);

  // Navigation
  const goNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      const nextQ = questions[currentIndex + 1];
      if (nextQ && currentQuestion && nextQ.category !== currentQuestion.category) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, totalQuestions, questions, currentQuestion]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const skipQuestion = useCallback(() => {
    goNext();
  }, [goNext]);

  // Answer handler
  const handleAnswer = useCallback((value: string | string[] | number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }, [currentQuestion]);

  // Submit assessment — FIXED
  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setSubmitError(null);

    const phases = [
      'Mapping your personality profile...',
      'Analyzing Big Five traits...',
      'Calculating Enneagram type...',
      'Scanning 500+ niche opportunities...',
      'Running AGI market analysis across 2.4M data points...',
      'Generating your genius blueprint...',
    ];

    for (let i = 0; i < phases.length; i++) {
      setLoadingPhase(i);
      await new Promise((r) => setTimeout(r, 2000));
    }

    try {
      // FIX: Convert answers Record into the array of {questionId, value} objects the API expects
      const answersArray = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value,
      }));

      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersArray }),
      });

      if (res.ok) {
        const data = await res.json();
        // Store results so the blueprint page can read them if user returns
        sessionStorage.setItem('nichegenius_results', JSON.stringify(data));
        localStorage.removeItem(STORAGE_KEY);
        // Redirect to Skool community on completion
        window.location.href = 'https://www.skool.com/ai-digital-dollars-academy-4501/about';
      } else {
        const errText = await res.text();
        console.error('Assessment API error:', res.status, errText);
        setSubmitting(false);
        setSubmitError('Something went wrong analyzing your profile. Please try again.');
      }
    } catch (err) {
      console.error('Network error submitting assessment:', err);
      setSubmitting(false);
      setSubmitError('Could not reach the server. Please check your connection and try again.');
    }
  }, [answers, router]);

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  // Loading/Analyzing screen
  if (submitting) {
    const phases = [
      'Mapping your personality profile...',
      'Analyzing Big Five traits...',
      'Calculating Enneagram type...',
      'Scanning 500+ niche opportunities...',
      'Running AGI market analysis across 2.4M data points...',
      'Generating your genius blueprint...',
    ];
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md w-full"
        >
          <div className="relative w-24 h-24 max-sm:w-20 max-sm:h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-400 animate-spin [animation-duration:1.5s]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-8 h-8 max-sm:w-7 max-sm:h-7 text-violet-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl max-sm:text-xl font-bold text-white">Our AGI is analyzing your profile</h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-violet-400 text-sm max-sm:text-xs"
              >
                {phases[loadingPhase]}
              </motion.p>
            </AnimatePresence>
          </div>

          <ProgressBar value={(loadingPhase + 1) * (100 / phases.length)} animate={false} size="sm" />

          <p className="text-xs text-zinc-600">This typically takes 15-30 seconds</p>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading questions...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <ConfettiBurst active={showConfetti} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 max-sm:px-3 py-4 max-sm:py-3">
          <div className="flex items-center justify-between mb-3 max-sm:mb-2">
            <div className="flex items-center gap-3 max-sm:gap-2">
              <div className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5 text-white" />
              </div>
              <span className="font-semibold text-sm max-sm:text-xs text-white inline max-sm:hidden">NicheGenius AI</span>
            </div>
            <div className="flex items-center gap-4 max-sm:gap-2">
              <Timer startTime={startTime} />
              <Badge variant="violet" size="sm">
                <span className="inline max-sm:hidden">{answeredCount}/{totalQuestions} answered</span>
                <span className="hidden max-sm:inline">{answeredCount}/{totalQuestions}</span>
              </Badge>
            </div>
          </div>
          <ProgressBar value={progress} size="sm" showPercentage={false} />
          <div className="flex items-center justify-between mt-2 max-sm:mt-1.5">
            <span className="text-xs max-sm:text-[10px] text-zinc-500">
              {currentSection.icon} {currentSection.category} › {currentSection.label}
            </span>
            <span className="text-xs max-sm:text-[10px] text-zinc-500">
              Q{currentIndex + 1}/{totalQuestions}
            </span>
          </div>
        </div>
      </header>

      {/* Section Progress Dots */}
      <div className="max-w-4xl mx-auto px-4 max-sm:px-3 py-4 max-sm:py-3">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3">
          {SECTIONS.map((section) => {
            const sectionQuestions = questions.filter((q) =>
              q.category.startsWith(section.id) || section.id === q.category,
            );
            const answeredInSection = sectionQuestions.filter((q) => answers[q.id] !== undefined).length;
            const isComplete = answeredInSection === sectionQuestions.length && sectionQuestions.length > 0;
            const isCurrent = section.id === currentSection.id;
            return (
              <div
                key={section.id}
                className={cn(
                  'flex-shrink-0 px-3 max-sm:px-2.5 py-1.5 rounded-full text-[10px] font-medium transition-all min-h-[32px] flex items-center',
                  isCurrent
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : isComplete
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-white/[0.03] text-zinc-600 border border-white/5',
                )}
              >
                {isComplete ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : null}
                {section.icon} {section.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {submitError && (
        <div className="max-w-2xl mx-auto px-4 max-sm:px-3 mb-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
            {submitError}
          </div>
        </div>
      )}

      {/* Question Area */}
      <main className="max-w-2xl mx-auto px-4 max-sm:px-3 pb-32 max-sm:pb-28">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <GlassCard intensity="medium" className="p-8 max-sm:p-5 space-y-8 max-sm:space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="violet" size="sm">Q{currentIndex + 1}</Badge>
                <Badge variant="default" size="sm">{currentQuestion.category}</Badge>
              </div>

              <h2 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-white leading-relaxed">
                {currentQuestion.text}
              </h2>

              <div className="pt-4 max-sm:pt-2">
                {currentQuestion.type === 'scale' && (
                  <LikertScale
                    value={typeof currentAnswer === 'number' ? currentAnswer : undefined}
                    onChange={(v) => handleAnswer(v)}
                  />
                )}
                {currentQuestion.type === 'choice' && currentQuestion.options && (
                  <ChoiceCards
                    options={currentQuestion.options}
                    value={typeof currentAnswer === 'string' ? currentAnswer : undefined}
                    onChange={(v) => handleAnswer(v)}
                  />
                )}
                {currentQuestion.type === 'multi-select' && currentQuestion.options && (
                  <ChoiceCards
                    options={currentQuestion.options}
                    value={Array.isArray(currentAnswer) ? currentAnswer : []}
                    onChange={(v) => handleAnswer(v)}
                    multi
                  />
                )}
                {currentQuestion.type === 'text' && (
                  <TextInput
                    value={typeof currentAnswer === 'string' ? currentAnswer : undefined}
                    onChange={(v) => handleAnswer(v)}
                  />
                )}
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-white/5 z-40">
        <div className="max-w-2xl mx-auto px-4 max-sm:px-3 py-4 max-sm:py-3">
          {/* Mobile layout */}
          <div className="hidden max-sm:flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="md"
                onClick={goBack}
                disabled={currentIndex === 0}
                iconLeft={<ChevronLeft className="w-4 h-4" />}
                className="flex-1 min-h-[48px]"
              >
                Back
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={skipQuestion}
                className="flex-1 min-h-[48px]"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Skip
              </Button>
            </div>
            {isLastQuestion ? (
              <Button
                size="lg"
                glow
                fullWidth
                onClick={handleSubmit}
                disabled={answeredCount < Math.floor(totalQuestions * 0.8)}
                iconRight={<Sparkles className="w-4 h-4" />}
                className="min-h-[52px]"
              >
                Analyze My Profile
              </Button>
            ) : (
              <Button
                size="lg"
                fullWidth
                onClick={goNext}
                iconRight={<ChevronRight className="w-4 h-4" />}
                className="min-h-[52px]"
              >
                Next
              </Button>
            )}
          </div>

          {/* Desktop layout */}
          <div className="flex max-sm:hidden items-center justify-between">
            <Button
              variant="ghost"
              size="md"
              onClick={goBack}
              disabled={currentIndex === 0}
              iconLeft={<ChevronLeft className="w-4 h-4" />}
              className="min-h-[44px]"
            >
              Back
            </Button>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="md" onClick={skipQuestion} className="min-h-[44px]">
                <SkipForward className="w-4 h-4 mr-1" />
                Skip
              </Button>

              {isLastQuestion ? (
                <Button
                  size="lg"
                  glow
                  onClick={handleSubmit}
                  disabled={answeredCount < Math.floor(totalQuestions * 0.8)}
                  iconRight={<Sparkles className="w-4 h-4" />}
                  className="min-h-[48px]"
                >
                  Analyze My Profile
                </Button>
              ) : (
                <Button
                  size="md"
                  onClick={goNext}
                  iconRight={<ChevronRight className="w-4 h-4" />}
                  className="min-h-[44px]"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
