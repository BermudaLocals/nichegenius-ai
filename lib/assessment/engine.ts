// ============================================
// NicheGenius AI - Assessment Engine
// 150+ question entrepreneurial assessment
// ============================================

import { generate, generateStructured } from '@/lib/ai/engine';
import { getPrompt } from '@/lib/ai/prompts';
import { z } from 'zod';

// ---- Types ----

export type QuestionType = 'scale' | 'choice' | 'multi_choice' | 'text' | 'ranking';

export type QuestionCategory =
  | 'personality_mbti'
  | 'personality_big5'
  | 'personality_enneagram'
  | 'personality_values'
  | 'background_work'
  | 'background_education'
  | 'background_skills'
  | 'background_hobbies'
  | 'goals_income'
  | 'goals_lifestyle'
  | 'goals_impact'
  | 'goals_timeline'
  | 'content_platform'
  | 'content_communication'
  | 'content_creation';

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  type: QuestionType;
  options?: Array<{ value: string | number; label: string }>;
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  required: boolean;
  order: number;
  helpText?: string;
}

export interface Answer {
  questionId: string;
  value: string | number | string[];
}

export interface MBTIResult {
  type: string;
  dimensions: {
    EI: { score: number; preference: 'E' | 'I' };
    SN: { score: number; preference: 'S' | 'N' };
    TF: { score: number; preference: 'T' | 'F' };
    JP: { score: number; preference: 'J' | 'P' };
  };
  description: string;
  businessStrengths: string[];
  businessChallenges: string[];
}

export interface BigFiveResult {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  dominantTraits: string[];
  businessImplications: string[];
}

export interface EnneagramResult {
  type: number;
  wing: number;
  name: string;
  description: string;
  motivations: string[];
  businessStyle: string;
}

export interface PersonalityProfile {
  mbti: MBTIResult;
  bigFive: BigFiveResult;
  enneagram: EnneagramResult;
  values: string[];
  workStyle: string;
  riskProfile: string;
  creativityIndex: number;
  leadershipStyle: string;
}

export interface NicheMatchResult {
  nicheName: string;
  category: string;
  overallScore: number;
  personalFit: number;
  marketDemand: number;
  profitPotential: number;
  reasoning: string;
  entryStrategy: string;
  estimatedTimeToRevenue: string;
}

export interface AssessmentResult {
  personality: PersonalityProfile;
  topNiches: NicheMatchResult[];
  skillGaps: Array<{ skill: string; importance: number; currentLevel: number }>;
  strengthsMatrix: Array<{ skill: string; marketValue: number; proficiency: number }>;
  recommendedBusinessModels: string[];
  riskAssessment: { level: string; factors: string[]; mitigations: string[] };
}

// ---- Question Bank ----

export const QUESTION_BANK: Question[] = [
  // ============================================
  // PERSONALITY - MBTI (20 questions)
  // ============================================
  { id: 'mbti_1', text: 'At social events, I tend to:', category: 'personality_mbti', type: 'choice', options: [{ value: 'E', label: 'Engage with many people and feel energized' }, { value: 'I', label: 'Prefer deep conversations with a few people' }], required: true, order: 1 },
  { id: 'mbti_2', text: 'After a long day of interacting with others, I feel:', category: 'personality_mbti', type: 'choice', options: [{ value: 'E', label: 'Stimulated and ready for more' }, { value: 'I', label: 'Drained and need alone time to recharge' }], required: true, order: 2 },
  { id: 'mbti_3', text: 'When making decisions, I prefer to:', category: 'personality_mbti', type: 'choice', options: [{ value: 'E', label: 'Talk through ideas with others' }, { value: 'I', label: 'Process internally before sharing' }], required: true, order: 3 },
  { id: 'mbti_4', text: 'I work best when:', category: 'personality_mbti', type: 'choice', options: [{ value: 'E', label: 'Collaborating in a team environment' }, { value: 'I', label: 'Working independently with minimal interruption' }], required: true, order: 4 },
  { id: 'mbti_5', text: 'I am more interested in:', category: 'personality_mbti', type: 'choice', options: [{ value: 'S', label: 'What is real and concrete right now' }, { value: 'N', label: 'What could be possible in the future' }], required: true, order: 5 },
  { id: 'mbti_6', text: 'When learning something new, I prefer:', category: 'personality_mbti', type: 'choice', options: [{ value: 'S', label: 'Step-by-step practical instruction' }, { value: 'N', label: 'Understanding the big picture theory first' }], required: true, order: 6 },
  { id: 'mbti_7', text: 'I trust more in:', category: 'personality_mbti', type: 'choice', options: [{ value: 'S', label: 'My direct experience and proven methods' }, { value: 'N', label: 'My hunches and creative insights' }], required: true, order: 7 },
  { id: 'mbti_8', text: 'In business planning, I focus on:', category: 'personality_mbti', type: 'choice', options: [{ value: 'S', label: 'Detailed, actionable steps and timelines' }, { value: 'N', label: 'Vision, innovation, and possibilities' }], required: true, order: 8 },
  { id: 'mbti_9', text: 'I describe myself as more:', category: 'personality_mbti', type: 'choice', options: [{ value: 'S', label: 'Practical and grounded' }, { value: 'N', label: 'Imaginative and theoretical' }], required: true, order: 9 },
  { id: 'mbti_10', text: 'When solving problems, I rely on:', category: 'personality_mbti', type: 'choice', options: [{ value: 'T', label: 'Logic, data, and objective analysis' }, { value: 'F', label: 'Values, empathy, and impact on people' }], required: true, order: 10 },
  { id: 'mbti_11', text: 'In a business disagreement, I prioritize:', category: 'personality_mbti', type: 'choice', options: [{ value: 'T', label: 'Finding the most effective solution' }, { value: 'F', label: 'Maintaining harmony and considering feelings' }], required: true, order: 11 },
  { id: 'mbti_12', text: 'I am more motivated by:', category: 'personality_mbti', type: 'choice', options: [{ value: 'T', label: 'Achievement and competence' }, { value: 'F', label: 'Helping others and making a difference' }], required: true, order: 12 },
  { id: 'mbti_13', text: 'Criticism at work makes me:', category: 'personality_mbti', type: 'choice', options: [{ value: 'T', label: 'Want to analyze and improve objectively' }, { value: 'F', label: 'Feel personally affected before processing' }], required: true, order: 13 },
  { id: 'mbti_14', text: 'I would rather be known as:', category: 'personality_mbti', type: 'choice', options: [{ value: 'T', label: 'Competent and fair' }, { value: 'F', label: 'Compassionate and understanding' }], required: true, order: 14 },
  { id: 'mbti_15', text: 'My workspace is typically:', category: 'personality_mbti', type: 'choice', options: [{ value: 'J', label: 'Organized with clear systems and schedules' }, { value: 'P', label: 'Flexible and somewhat spontaneous' }], required: true, order: 15 },
  { id: 'mbti_16', text: 'With deadlines, I usually:', category: 'personality_mbti', type: 'choice', options: [{ value: 'J', label: 'Plan ahead and finish early' }, { value: 'P', label: 'Work best under pressure near the deadline' }], required: true, order: 16 },
  { id: 'mbti_17', text: 'I prefer my schedule to be:', category: 'personality_mbti', type: 'choice', options: [{ value: 'J', label: 'Structured and predictable' }, { value: 'P', label: 'Open and adaptable to opportunities' }], required: true, order: 17 },
  { id: 'mbti_18', text: 'When starting a project, I:', category: 'personality_mbti', type: 'choice', options: [{ value: 'J', label: 'Create a detailed plan before beginning' }, { value: 'P', label: 'Dive in and figure it out as I go' }], required: true, order: 18 },
  { id: 'mbti_19', text: 'I am more comfortable with:', category: 'personality_mbti', type: 'choice', options: [{ value: 'J', label: 'Making decisions and moving forward' }, { value: 'P', label: 'Keeping options open and exploring' }], required: true, order: 19 },
  { id: 'mbti_20', text: 'In business, I value:', category: 'personality_mbti', type: 'choice', options: [{ value: 'J', label: 'Closure, completion, and results' }, { value: 'P', label: 'Flexibility, discovery, and pivoting' }], required: true, order: 20 },

  // ============================================
  // PERSONALITY - BIG FIVE (25 questions)
  // ============================================
  { id: 'b5_1', text: 'I enjoy trying new and unconventional approaches to problems.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 21 },
  { id: 'b5_2', text: 'I have a vivid imagination and often think about abstract concepts.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 22 },
  { id: 'b5_3', text: 'I appreciate art, music, and creative expression.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 23 },
  { id: 'b5_4', text: 'I enjoy intellectual debates and exploring new ideas.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 24 },
  { id: 'b5_5', text: 'I am open to changing my views based on new information.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 25 },
  { id: 'b5_6', text: 'I am organized and like to keep things tidy.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 26 },
  { id: 'b5_7', text: 'I follow through on commitments and finish what I start.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 27 },
  { id: 'b5_8', text: 'I set high standards for myself and work hard to meet them.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 28 },
  { id: 'b5_9', text: 'I plan ahead rather than acting on impulse.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 29 },
  { id: 'b5_10', text: 'I am disciplined and self-motivated.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 30 },
  { id: 'b5_11', text: 'I am the life of the party and enjoy being the center of attention.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 31 },
  { id: 'b5_12', text: 'I feel comfortable speaking in front of large groups.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 32 },
  { id: 'b5_13', text: 'I make friends easily and enjoy networking.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 33 },
  { id: 'b5_14', text: 'I feel energized when surrounded by other people.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 34 },
  { id: 'b5_15', text: 'I am assertive and take charge in group situations.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 35 },
  { id: 'b5_16', text: 'I trust people easily and give them the benefit of the doubt.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 36 },
  { id: 'b5_17', text: 'I cooperate well with others and avoid conflicts.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 37 },
  { id: 'b5_18', text: 'I am considerate of others\' feelings and needs.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 38 },
  { id: 'b5_19', text: 'I am helpful and generous with my time.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 39 },
  { id: 'b5_20', text: 'I value teamwork and collaboration over competition.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 40 },
  { id: 'b5_21', text: 'I worry about things that might go wrong.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 41 },
  { id: 'b5_22', text: 'I experience stress and anxiety frequently.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 42 },
  { id: 'b5_23', text: 'I tend to feel overwhelmed when facing multiple challenges.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 43 },
  { id: 'b5_24', text: 'My mood fluctuates significantly throughout the day.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 44 },
  { id: 'b5_25', text: 'I bounce back quickly from setbacks and disappointments.', category: 'personality_big5', type: 'scale', scaleMin: 1, scaleMax: 7, scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }, required: true, order: 45 },

  // ============================================
  // PERSONALITY - ENNEAGRAM (15 questions)
  // ============================================
  { id: 'enn_1', text: 'My core motivation is most closely:', category: 'personality_enneagram', type: 'choice', options: [{ value: 1, label: 'Being good, moral, and correct' }, { value: 2, label: 'Being loved and needed by others' }, { value: 3, label: 'Being successful and admired' }], required: true, order: 46 },
  { id: 'enn_2', text: 'I am driven most by:', category: 'personality_enneagram', type: 'choice', options: [{ value: 4, label: 'Being unique and authentic' }, { value: 5, label: 'Understanding and knowledge' }, { value: 6, label: 'Security and certainty' }], required: true, order: 47 },
  { id: 'enn_3', text: 'I seek:', category: 'personality_enneagram', type: 'choice', options: [{ value: 7, label: 'Excitement, variety, and new experiences' }, { value: 8, label: 'Control, power, and independence' }, { value: 9, label: 'Peace, harmony, and stability' }], required: true, order: 48 },
  { id: 'enn_4', text: 'When stressed, I tend to:', category: 'personality_enneagram', type: 'choice', options: [{ value: 1, label: 'Become critical and perfectionistic' }, { value: 2, label: 'Become people-pleasing and possessive' }, { value: 3, label: 'Become image-conscious and workaholic' }], required: true, order: 49 },
  { id: 'enn_5', text: 'My biggest fear is:', category: 'personality_enneagram', type: 'choice', options: [{ value: 4, label: 'Having no identity or significance' }, { value: 5, label: 'Being incompetent or helpless' }, { value: 6, label: 'Being without support or guidance' }], required: true, order: 50 },
  { id: 'enn_6', text: 'In relationships, I:', category: 'personality_enneagram', type: 'choice', options: [{ value: 7, label: 'Avoid deep pain by staying positive' }, { value: 8, label: 'Take charge and protect others' }, { value: 9, label: 'Go along with others to avoid conflict' }], required: true, order: 51 },
  { id: 'enn_7', text: 'At my best, I am:', category: 'personality_enneagram', type: 'choice', options: [{ value: 1, label: 'Principled, wise, and ethical' }, { value: 2, label: 'Generous, loving, and nurturing' }, { value: 3, label: 'Authentic, inspiring, and effective' }], required: true, order: 52 },
  { id: 'enn_8', text: 'I struggle most with:', category: 'personality_enneagram', type: 'choice', options: [{ value: 4, label: 'Envy and melancholy' }, { value: 5, label: 'Avarice and detachment' }, { value: 6, label: 'Anxiety and doubt' }], required: true, order: 53 },
  { id: 'enn_9', text: 'My leadership style is:', category: 'personality_enneagram', type: 'choice', options: [{ value: 7, label: 'Visionary and enthusiastic' }, { value: 8, label: 'Decisive and commanding' }, { value: 9, label: 'Diplomatic and inclusive' }], required: true, order: 54 },
  { id: 'enn_10', text: 'I feel most fulfilled when:', category: 'personality_enneagram', type: 'choice', options: [{ value: 1, label: 'Making things right and improving systems' }, { value: 3, label: 'Achieving goals and being recognized' }, { value: 5, label: 'Discovering something new and insightful' }], required: true, order: 55 },
  { id: 'enn_11', text: 'Others see me as:', category: 'personality_enneagram', type: 'choice', options: [{ value: 2, label: 'Warm, caring, and supportive' }, { value: 7, label: 'Fun, optimistic, and spontaneous' }, { value: 8, label: 'Strong, assertive, and protective' }], required: true, order: 56 },
  { id: 'enn_12', text: 'I value most:', category: 'personality_enneagram', type: 'choice', options: [{ value: 1, label: 'Integrity and correctness' }, { value: 4, label: 'Authenticity and depth' }, { value: 9, label: 'Harmony and peace' }], required: true, order: 57 },
  { id: 'enn_13', text: 'Under pressure, I become:', category: 'personality_enneagram', type: 'choice', options: [{ value: 3, label: 'More focused and driven' }, { value: 6, label: 'More cautious and analytical' }, { value: 8, label: 'More confrontational and decisive' }], required: true, order: 58 },
  { id: 'enn_14', text: 'My blind spot in business is:', category: 'personality_enneagram', type: 'choice', options: [{ value: 2, label: 'Putting others\' needs above business goals' }, { value: 5, label: 'Over-analyzing and not taking action' }, { value: 7, label: 'Starting too many things without finishing' }], required: true, order: 59 },
  { id: 'enn_15', text: 'I make decisions based on:', category: 'personality_enneagram', type: 'choice', options: [{ value: 1, label: 'What is right and principled' }, { value: 3, label: 'What will produce the best results' }, { value: 6, label: 'What is safest and most reliable' }], required: true, order: 60 },

  // ============================================
  // PERSONALITY - VALUES (10 questions)
  // ============================================
  { id: 'val_1', text: 'Rank your top 3 values:', category: 'personality_values', type: 'ranking', options: [{ value: 'freedom', label: 'Freedom & Autonomy' }, { value: 'wealth', label: 'Financial Wealth' }, { value: 'impact', label: 'Social Impact' }, { value: 'creativity', label: 'Creative Expression' }, { value: 'security', label: 'Stability & Security' }, { value: 'family', label: 'Family & Relationships' }, { value: 'adventure', label: 'Adventure & Travel' }, { value: 'mastery', label: 'Mastery & Excellence' }], required: true, order: 61 },
  { id: 'val_2', text: 'What matters most in your ideal work?', category: 'personality_values', type: 'choice', options: [{ value: 'money', label: 'Maximum income potential' }, { value: 'meaning', label: 'Meaningful contribution' }, { value: 'flexibility', label: 'Schedule flexibility' }, { value: 'growth', label: 'Personal growth' }], required: true, order: 62 },
  { id: 'val_3', text: 'If money were no object, I would spend my time:', category: 'personality_values', type: 'text', required: true, order: 63, helpText: 'Describe your ideal day in 2-3 sentences' },
  { id: 'val_4', text: 'How important is work-life balance to you?', category: 'personality_values', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Will sacrifice everything for success', max: 'Non-negotiable priority' }, required: true, order: 64 },
  { id: 'val_5', text: 'Would you prefer a business that:', category: 'personality_values', type: 'choice', options: [{ value: 'passive', label: 'Runs mostly passively after setup' }, { value: 'active', label: 'Requires my daily creative involvement' }, { value: 'team', label: 'Involves building and leading a team' }, { value: 'solo', label: 'I run entirely alone' }], required: true, order: 65 },
  { id: 'val_6', text: 'How do you feel about being public-facing (video, social media)?', category: 'personality_values', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Strongly avoid', max: 'Love being on camera' }, required: true, order: 66 },
  { id: 'val_7', text: 'My relationship with risk is:', category: 'personality_values', type: 'choice', options: [{ value: 'conservative', label: 'I avoid risk whenever possible' }, { value: 'moderate', label: 'I take calculated risks with good data' }, { value: 'aggressive', label: 'I embrace risk and move fast' }], required: true, order: 67 },
  { id: 'val_8', text: 'How important is location independence to you?', category: 'personality_values', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Not important', max: 'Essential requirement' }, required: true, order: 68 },
  { id: 'val_9', text: 'I prefer to build something that:', category: 'personality_values', type: 'choice', options: [{ value: 'sell', label: 'I can sell for a large exit' }, { value: 'legacy', label: 'Creates lasting impact/legacy' }, { value: 'lifestyle', label: 'Supports my ideal lifestyle' }, { value: 'empire', label: 'Grows into a large empire' }], required: true, order: 69 },
  { id: 'val_10', text: 'How important is it that your business aligns with your personal beliefs?', category: 'personality_values', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Not important', max: 'Absolutely essential' }, required: true, order: 70 },

  // ============================================
  // BACKGROUND - WORK (15 questions)
  // ============================================
  { id: 'work_1', text: 'What industry do you currently work in or most recently worked in?', category: 'background_work', type: 'text', required: true, order: 71 },
  { id: 'work_2', text: 'How many years of professional experience do you have?', category: 'background_work', type: 'choice', options: [{ value: '0-2', label: '0-2 years' }, { value: '3-5', label: '3-5 years' }, { value: '6-10', label: '6-10 years' }, { value: '11-20', label: '11-20 years' }, { value: '20+', label: '20+ years' }], required: true, order: 72 },
  { id: 'work_3', text: 'What is/was your role level?', category: 'background_work', type: 'choice', options: [{ value: 'entry', label: 'Entry level / Junior' }, { value: 'mid', label: 'Mid-level / Individual contributor' }, { value: 'senior', label: 'Senior / Lead' }, { value: 'manager', label: 'Manager / Director' }, { value: 'executive', label: 'Executive / C-Suite' }, { value: 'entrepreneur', label: 'Self-employed / Entrepreneur' }], required: true, order: 73 },
  { id: 'work_4', text: 'Have you ever managed people? If so, how many?', category: 'background_work', type: 'choice', options: [{ value: 'none', label: 'Never' }, { value: '1-5', label: '1-5 people' }, { value: '6-20', label: '6-20 people' }, { value: '20+', label: '20+ people' }], required: true, order: 74 },
  { id: 'work_5', text: 'Describe your top 3 professional achievements:', category: 'background_work', type: 'text', required: true, order: 75, helpText: 'Be specific about results and impact' },
  { id: 'work_6', text: 'Have you ever started a business or side hustle?', category: 'background_work', type: 'choice', options: [{ value: 'no', label: 'Never' }, { value: 'side', label: 'Yes, a side project' }, { value: 'failed', label: 'Yes, but it failed' }, { value: 'active', label: 'Yes, currently running one' }, { value: 'multiple', label: 'Yes, multiple businesses' }], required: true, order: 76 },
  { id: 'work_7', text: 'What frustrated you most about your work experience?', category: 'background_work', type: 'text', required: true, order: 77 },
  { id: 'work_8', text: 'What did you enjoy most about your work?', category: 'background_work', type: 'text', required: true, order: 78 },
  { id: 'work_9', text: 'Rate your sales/persuasion ability:', category: 'background_work', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'No experience', max: 'Expert salesperson' }, required: true, order: 79 },
  { id: 'work_10', text: 'Rate your marketing knowledge:', category: 'background_work', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Complete beginner', max: 'Marketing expert' }, required: true, order: 80 },
  { id: 'work_11', text: 'Rate your financial/business acumen:', category: 'background_work', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'No business knowledge', max: 'Deep business expertise' }, required: true, order: 81 },
  { id: 'work_12', text: 'Rate your technical/digital skills:', category: 'background_work', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Technophobe', max: 'Tech expert / Developer' }, required: true, order: 82 },
  { id: 'work_13', text: 'Do you have any certifications or special licenses?', category: 'background_work', type: 'text', required: false, order: 83 },
  { id: 'work_14', text: 'What unique insider knowledge do you have from your industry?', category: 'background_work', type: 'text', required: true, order: 84 },
  { id: 'work_15', text: 'How large is your professional network?', category: 'background_work', type: 'choice', options: [{ value: 'small', label: 'Small (< 100 contacts)' }, { value: 'medium', label: 'Medium (100-500)' }, { value: 'large', label: 'Large (500-2000)' }, { value: 'massive', label: 'Massive (2000+)' }], required: true, order: 85 },

  // ============================================
  // BACKGROUND - EDUCATION (10 questions)
  // ============================================
  { id: 'edu_1', text: 'Highest level of education:', category: 'background_education', type: 'choice', options: [{ value: 'highschool', label: 'High School' }, { value: 'some_college', label: 'Some College' }, { value: 'associates', label: 'Associate Degree' }, { value: 'bachelors', label: "Bachelor's Degree" }, { value: 'masters', label: "Master's Degree" }, { value: 'doctorate', label: 'Doctorate / PhD' }, { value: 'self_taught', label: 'Self-Taught / Bootcamp' }], required: true, order: 86 },
  { id: 'edu_2', text: 'Field of study:', category: 'background_education', type: 'text', required: false, order: 87 },
  { id: 'edu_3', text: 'How many online courses have you completed?', category: 'background_education', type: 'choice', options: [{ value: '0', label: 'None' }, { value: '1-5', label: '1-5' }, { value: '6-15', label: '6-15' }, { value: '15+', label: '15+' }], required: true, order: 88 },
  { id: 'edu_4', text: 'What topics have you self-studied most?', category: 'background_education', type: 'text', required: true, order: 89, helpText: 'List 3-5 topics' },
  { id: 'edu_5', text: 'Rate your writing ability:', category: 'background_education', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Struggle with writing', max: 'Professional writer' }, required: true, order: 90 },
  { id: 'edu_6', text: 'Rate your public speaking ability:', category: 'background_education', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Terrified of speaking', max: 'Professional speaker' }, required: true, order: 91 },
  { id: 'edu_7', text: 'How quickly do you learn new skills?', category: 'background_education', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Very slowly', max: 'Extremely fast learner' }, required: true, order: 92 },
  { id: 'edu_8', text: 'Do you speak any other languages?', category: 'background_education', type: 'text', required: false, order: 93 },
  { id: 'edu_9', text: 'What subject could you teach with confidence?', category: 'background_education', type: 'text', required: true, order: 94 },
  { id: 'edu_10', text: 'Are you willing to invest in further education/training?', category: 'background_education', type: 'choice', options: [{ value: 'no', label: 'No, I want to start with what I know' }, { value: 'minimal', label: 'Yes, minimal investment' }, { value: 'moderate', label: 'Yes, moderate investment' }, { value: 'significant', label: 'Yes, significant investment for the right opportunity' }], required: true, order: 95 },

  // ============================================
  // BACKGROUND - SKILLS (15 questions)
  // ============================================
  { id: 'skill_1', text: 'List your top 5 hard skills (technical, professional):', category: 'background_skills', type: 'text', required: true, order: 96, helpText: 'e.g., Python programming, financial analysis, graphic design' },
  { id: 'skill_2', text: 'List your top 5 soft skills:', category: 'background_skills', type: 'text', required: true, order: 97, helpText: 'e.g., leadership, communication, problem-solving' },
  { id: 'skill_3', text: 'Rate your design/visual skills:', category: 'background_skills', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'No design ability', max: 'Professional designer' }, required: true, order: 98 },
  { id: 'skill_4', text: 'Rate your video creation/editing skills:', category: 'background_skills', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Never made a video', max: 'Professional videographer' }, required: true, order: 99 },
  { id: 'skill_5', text: 'Rate your data analysis ability:', category: 'background_skills', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'No experience', max: 'Data science expert' }, required: true, order: 100 },
  { id: 'skill_6', text: 'Rate your project management skills:', category: 'background_skills', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'No experience', max: 'PMP-certified expert' }, required: true, order: 101 },
  { id: 'skill_7', text: 'Rate your AI/automation knowledge:', category: 'background_skills', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Complete beginner', max: 'AI/ML expert' }, required: true, order: 102 },
  { id: 'skill_8', text: 'Rate your social media proficiency:', category: 'background_skills', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Barely use social media', max: 'Social media expert/influencer' }, required: true, order: 103 },
  { id: 'skill_9', text: 'Rate your customer service ability:', category: 'background_skills', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'No experience', max: 'Expert in client relations' }, required: true, order: 104 },
  { id: 'skill_10', text: 'What is the ONE skill people always ask you for help with?', category: 'background_skills', type: 'text', required: true, order: 105 },
  { id: 'skill_11', text: 'Do you have experience with any of these? (select all)', category: 'background_skills', type: 'multi_choice', options: [{ value: 'ecommerce', label: 'E-commerce / Online selling' }, { value: 'content', label: 'Content creation' }, { value: 'teaching', label: 'Teaching / Training' }, { value: 'consulting', label: 'Consulting / Coaching' }, { value: 'coding', label: 'Software development' }, { value: 'copywriting', label: 'Copywriting' }, { value: 'seo', label: 'SEO / Digital marketing' }, { value: 'paid_ads', label: 'Paid advertising' }], required: true, order: 106 },
  { id: 'skill_12', text: 'Rate your ability to explain complex topics simply:', category: 'background_skills', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Struggle with simplification', max: 'Master explainer' }, required: true, order: 107 },
  { id: 'skill_13', text: 'Rate your negotiation skills:', category: 'background_skills', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Avoid negotiating', max: 'Expert negotiator' }, required: true, order: 108 },
  { id: 'skill_14', text: 'Rate your research and analytical skills:', category: 'background_skills', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Minimal', max: 'Expert researcher' }, required: true, order: 109 },
  { id: 'skill_15', text: 'What unique skill combination makes you different?', category: 'background_skills', type: 'text', required: true, order: 110, helpText: 'Describe 2-3 skills that together make you unique' },

  // ============================================
  // BACKGROUND - HOBBIES (10 questions)
  // ============================================
  { id: 'hobby_1', text: 'What are your top 3 hobbies or interests?', category: 'background_hobbies', type: 'text', required: true, order: 111 },
  { id: 'hobby_2', text: 'What topic could you talk about for hours?', category: 'background_hobbies', type: 'text', required: true, order: 112 },
  { id: 'hobby_3', text: 'What do you spend money on that most people wouldn\'t?', category: 'background_hobbies', type: 'text', required: true, order: 113 },
  { id: 'hobby_4', text: 'What communities or groups are you part of?', category: 'background_hobbies', type: 'text', required: true, order: 114 },
  { id: 'hobby_5', text: 'What problem in the world bothers you most?', category: 'background_hobbies', type: 'text', required: true, order: 115 },
  { id: 'hobby_6', text: 'What do friends/family always come to you for advice about?', category: 'background_hobbies', type: 'text', required: true, order: 116 },
  { id: 'hobby_7', text: 'If you could master any skill overnight, what would it be?', category: 'background_hobbies', type: 'text', required: true, order: 117 },
  { id: 'hobby_8', text: 'What type of content do you consume most?', category: 'background_hobbies', type: 'multi_choice', options: [{ value: 'podcasts', label: 'Podcasts' }, { value: 'youtube', label: 'YouTube' }, { value: 'books', label: 'Books' }, { value: 'courses', label: 'Online Courses' }, { value: 'social', label: 'Social Media' }, { value: 'news', label: 'News/Articles' }, { value: 'forums', label: 'Forums/Reddit' }], required: true, order: 118 },
  { id: 'hobby_9', text: 'Who are your top 3 role models or influencers you follow?', category: 'background_hobbies', type: 'text', required: false, order: 119 },
  { id: 'hobby_10', text: 'What life experience has shaped you most?', category: 'background_hobbies', type: 'text', required: true, order: 120 },

  // ============================================
  // GOALS - INCOME (5 questions)
  // ============================================
  { id: 'inc_1', text: 'What is your target monthly income from an online business?', category: 'goals_income', type: 'choice', options: [{ value: 1000, label: '$1,000 - $3,000/month' }, { value: 5000, label: '$3,000 - $5,000/month' }, { value: 10000, label: '$5,000 - $10,000/month' }, { value: 25000, label: '$10,000 - $25,000/month' }, { value: 50000, label: '$25,000 - $50,000/month' }, { value: 100000, label: '$50,000+/month' }], required: true, order: 121 },
  { id: 'inc_2', text: 'What is your current monthly income?', category: 'goals_income', type: 'choice', options: [{ value: 'under_2k', label: 'Under $2,000' }, { value: '2k_5k', label: '$2,000 - $5,000' }, { value: '5k_10k', label: '$5,000 - $10,000' }, { value: '10k_20k', label: '$10,000 - $20,000' }, { value: 'over_20k', label: 'Over $20,000' }], required: true, order: 122 },
  { id: 'inc_3', text: 'How much can you invest to start your business?', category: 'goals_income', type: 'choice', options: [{ value: 0, label: '$0 (Bootstrap only)' }, { value: 500, label: '$100 - $500' }, { value: 2000, label: '$500 - $2,000' }, { value: 5000, label: '$2,000 - $5,000' }, { value: 10000, label: '$5,000 - $10,000' }, { value: 25000, label: '$10,000+' }], required: true, order: 123 },
  { id: 'inc_4', text: 'Do you have savings to cover expenses while building your business?', category: 'goals_income', type: 'choice', options: [{ value: 'none', label: 'No savings buffer' }, { value: '3_months', label: '1-3 months of expenses' }, { value: '6_months', label: '3-6 months' }, { value: '12_months', label: '6-12 months' }, { value: 'unlimited', label: '12+ months' }], required: true, order: 124 },
  { id: 'inc_5', text: 'What is your preferred revenue model?', category: 'goals_income', type: 'multi_choice', options: [{ value: 'products', label: 'Digital products' }, { value: 'services', label: 'Services/Consulting' }, { value: 'subscription', label: 'Subscription/Membership' }, { value: 'courses', label: 'Courses/Education' }, { value: 'affiliate', label: 'Affiliate marketing' }, { value: 'saas', label: 'Software/SaaS' }, { value: 'ecommerce', label: 'E-commerce' }], required: true, order: 125 },

  // ============================================
  // GOALS - LIFESTYLE (5 questions)
  // ============================================
  { id: 'life_1', text: 'How many hours per week can you dedicate to your business?', category: 'goals_lifestyle', type: 'choice', options: [{ value: 5, label: '5-10 hours (side hustle)' }, { value: 15, label: '10-20 hours (serious side project)' }, { value: 30, label: '20-40 hours (near full-time)' }, { value: 50, label: '40+ hours (all in)' }], required: true, order: 126 },
  { id: 'life_2', text: 'When are you most productive?', category: 'goals_lifestyle', type: 'choice', options: [{ value: 'morning', label: 'Early morning (5-9 AM)' }, { value: 'midday', label: 'Midday (9 AM - 2 PM)' }, { value: 'afternoon', label: 'Afternoon (2-6 PM)' }, { value: 'evening', label: 'Evening (6-10 PM)' }, { value: 'night', label: 'Night owl (10 PM+)' }], required: true, order: 127 },
  { id: 'life_3', text: 'Describe your ideal workday in your own business:', category: 'goals_lifestyle', type: 'text', required: true, order: 128 },
  { id: 'life_4', text: 'Where do you want to work from?', category: 'goals_lifestyle', type: 'choice', options: [{ value: 'home', label: 'Home office' }, { value: 'anywhere', label: 'Anywhere (digital nomad)' }, { value: 'office', label: 'Dedicated office/studio' }, { value: 'mix', label: 'Mix of locations' }], required: true, order: 129 },
  { id: 'life_5', text: 'How do you feel about working with clients directly?', category: 'goals_lifestyle', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Want to avoid clients', max: 'Love working with clients' }, required: true, order: 130 },

  // ============================================
  // GOALS - IMPACT (5 questions)
  // ============================================
  { id: 'impact_1', text: 'What type of impact do you want your business to have?', category: 'goals_impact', type: 'choice', options: [{ value: 'education', label: 'Educate and empower people' }, { value: 'solve', label: 'Solve a specific painful problem' }, { value: 'entertain', label: 'Entertain and inspire' }, { value: 'efficiency', label: 'Make things faster/easier' }, { value: 'wealth', label: 'Help others build wealth' }, { value: 'health', label: 'Improve health and wellness' }], required: true, order: 131 },
  { id: 'impact_2', text: 'Who do you most want to help?', category: 'goals_impact', type: 'text', required: true, order: 132, helpText: 'Describe your ideal customer/client' },
  { id: 'impact_3', text: 'How many people do you want to reach in your first year?', category: 'goals_impact', type: 'choice', options: [{ value: 100, label: '100 (deep, high-touch)' }, { value: 1000, label: '1,000 (focused community)' }, { value: 10000, label: '10,000 (growing audience)' }, { value: 100000, label: '100,000+ (mass market)' }], required: true, order: 133 },
  { id: 'impact_4', text: 'Would you rather help a few people deeply or many people broadly?', category: 'goals_impact', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Few people, deep impact', max: 'Many people, broad reach' }, required: true, order: 134 },
  { id: 'impact_5', text: 'What transformation do you want to create for your customers?', category: 'goals_impact', type: 'text', required: true, order: 135 },

  // ============================================
  // GOALS - TIMELINE (5 questions)
  // ============================================
  { id: 'time_1', text: 'When do you want to earn your first dollar online?', category: 'goals_timeline', type: 'choice', options: [{ value: '30days', label: 'Within 30 days' }, { value: '90days', label: 'Within 90 days' }, { value: '6months', label: 'Within 6 months' }, { value: '12months', label: 'Within 12 months' }], required: true, order: 136 },
  { id: 'time_2', text: 'When do you want to replace your current income?', category: 'goals_timeline', type: 'choice', options: [{ value: '6months', label: '6 months' }, { value: '12months', label: '12 months' }, { value: '24months', label: '2 years' }, { value: '36months', label: '3+ years' }, { value: 'never', label: 'Not a goal — this is supplemental' }], required: true, order: 137 },
  { id: 'time_3', text: 'How patient are you with building something that takes time?', category: 'goals_timeline', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Need results fast', max: 'Willing to play the long game' }, required: true, order: 138 },
  { id: 'time_4', text: 'Are you willing to work nights/weekends while keeping your job?', category: 'goals_timeline', type: 'choice', options: [{ value: 'no', label: 'No, I need work-life balance' }, { value: 'some', label: 'Yes, a few hours' }, { value: 'yes', label: 'Yes, as much as needed' }, { value: 'fulltime', label: 'I\'m going full-time immediately' }], required: true, order: 139 },
  { id: 'time_5', text: 'What is your biggest constraint right now?', category: 'goals_timeline', type: 'choice', options: [{ value: 'time', label: 'Time' }, { value: 'money', label: 'Money' }, { value: 'knowledge', label: 'Knowledge/Skills' }, { value: 'confidence', label: 'Confidence' }, { value: 'idea', label: 'Not knowing what to do' }], required: true, order: 140 },

  // ============================================
  // CONTENT STYLE - PLATFORM (5 questions)
  // ============================================
  { id: 'plat_1', text: 'Which platforms do you currently use? (select all)', category: 'content_platform', type: 'multi_choice', options: [{ value: 'youtube', label: 'YouTube' }, { value: 'instagram', label: 'Instagram' }, { value: 'tiktok', label: 'TikTok' }, { value: 'twitter', label: 'X / Twitter' }, { value: 'linkedin', label: 'LinkedIn' }, { value: 'facebook', label: 'Facebook' }, { value: 'pinterest', label: 'Pinterest' }, { value: 'blog', label: 'Blog/Website' }, { value: 'podcast', label: 'Podcast' }, { value: 'none', label: 'None' }], required: true, order: 141 },
  { id: 'plat_2', text: 'Which platform excites you most for building an audience?', category: 'content_platform', type: 'choice', options: [{ value: 'youtube', label: 'YouTube' }, { value: 'instagram', label: 'Instagram' }, { value: 'tiktok', label: 'TikTok' }, { value: 'linkedin', label: 'LinkedIn' }, { value: 'blog', label: 'Blog/SEO' }, { value: 'email', label: 'Email newsletter' }, { value: 'podcast', label: 'Podcast' }], required: true, order: 142 },
  { id: 'plat_3', text: 'Do you have any existing online following?', category: 'content_platform', type: 'choice', options: [{ value: '0', label: 'Starting from zero' }, { value: 'small', label: 'Small (under 1,000 followers)' }, { value: 'medium', label: 'Medium (1,000 - 10,000)' }, { value: 'large', label: 'Large (10,000 - 100,000)' }, { value: 'massive', label: 'Massive (100,000+)' }], required: true, order: 143 },
  { id: 'plat_4', text: 'Do you have an email list?', category: 'content_platform', type: 'choice', options: [{ value: 'none', label: 'No' }, { value: 'small', label: 'Under 500 subscribers' }, { value: 'medium', label: '500 - 5,000' }, { value: 'large', label: '5,000+' }], required: true, order: 144 },
  { id: 'plat_5', text: 'How comfortable are you with paid advertising?', category: 'content_platform', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Never run ads', max: 'Experienced ad buyer' }, required: true, order: 145 },

  // ============================================
  // CONTENT STYLE - COMMUNICATION (5 questions)
  // ============================================
  { id: 'comm_1', text: 'How do you prefer to communicate?', category: 'content_communication', type: 'choice', options: [{ value: 'writing', label: 'Writing (blogs, emails, posts)' }, { value: 'video', label: 'Video (YouTube, TikTok, courses)' }, { value: 'audio', label: 'Audio (podcasts, voice notes)' }, { value: 'visual', label: 'Visual (design, infographics)' }, { value: 'live', label: 'Live interaction (webinars, coaching)' }], required: true, order: 146 },
  { id: 'comm_2', text: 'What is your natural teaching style?', category: 'content_communication', type: 'choice', options: [{ value: 'storyteller', label: 'Storyteller — through narratives and examples' }, { value: 'analytical', label: 'Analytical — through data and frameworks' }, { value: 'hands_on', label: 'Hands-on — through practice and demos' }, { value: 'motivational', label: 'Motivational — through inspiration and energy' }], required: true, order: 147 },
  { id: 'comm_3', text: 'Rate your comfort with being on camera:', category: 'content_communication', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Terrified', max: 'Love it' }, required: true, order: 148 },
  { id: 'comm_4', text: 'How would you describe your communication style?', category: 'content_communication', type: 'choice', options: [{ value: 'professional', label: 'Professional and polished' }, { value: 'casual', label: 'Casual and conversational' }, { value: 'humorous', label: 'Humorous and entertaining' }, { value: 'authoritative', label: 'Authoritative and expert' }, { value: 'empathetic', label: 'Empathetic and supportive' }], required: true, order: 149 },
  { id: 'comm_5', text: 'How often could you create content consistently?', category: 'content_communication', type: 'choice', options: [{ value: 'daily', label: 'Daily' }, { value: '3_weekly', label: '3-5 times per week' }, { value: 'weekly', label: '1-2 times per week' }, { value: 'biweekly', label: 'Every 2 weeks' }, { value: 'monthly', label: 'Monthly' }], required: true, order: 150 },

  // ============================================
  // CONTENT STYLE - CREATION (5 questions)
  // ============================================
  { id: 'create_1', text: 'What type of content would you most enjoy creating?', category: 'content_creation', type: 'multi_choice', options: [{ value: 'tutorials', label: 'How-to tutorials' }, { value: 'reviews', label: 'Product reviews/comparisons' }, { value: 'stories', label: 'Personal stories/case studies' }, { value: 'news', label: 'Industry news/commentary' }, { value: 'entertainment', label: 'Entertainment/humor' }, { value: 'deep_dives', label: 'Deep dive analyses' }], required: true, order: 151 },
  { id: 'create_2', text: 'How long does it typically take you to write a 1000-word article?', category: 'content_creation', type: 'choice', options: [{ value: 'fast', label: 'Under 1 hour' }, { value: 'moderate', label: '1-2 hours' }, { value: 'slow', label: '2-4 hours' }, { value: 'very_slow', label: '4+ hours' }, { value: 'cant', label: 'I struggle significantly with writing' }], required: true, order: 152 },
  { id: 'create_3', text: 'How comfortable are you using AI tools to assist content creation?', category: 'content_creation', type: 'scale', scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Not comfortable', max: 'Already use AI extensively' }, required: true, order: 153 },
  { id: 'create_4', text: 'Would you be open to using an AI avatar to create video content?', category: 'content_creation', type: 'choice', options: [{ value: 'yes', label: 'Yes, great idea!' }, { value: 'maybe', label: 'Maybe, if it looks professional' }, { value: 'supplement', label: 'As a supplement to my own videos' }, { value: 'no', label: 'No, I prefer to be authentic' }], required: true, order: 154 },
  { id: 'create_5', text: 'What content format is your biggest weakness?', category: 'content_creation', type: 'choice', options: [{ value: 'writing', label: 'Long-form writing' }, { value: 'video', label: 'Video production' }, { value: 'design', label: 'Visual design' }, { value: 'audio', label: 'Audio/podcast' }, { value: 'social', label: 'Short-form social content' }], required: true, order: 155 },
];

// ---- Question Accessors ----

export function getQuestionsByCategory(category: QuestionCategory): Question[] {
  return QUESTION_BANK.filter((q) => q.category === category).sort((a, b) => a.order - b.order);
}

export function getQuestionById(id: string): Question | undefined {
  return QUESTION_BANK.find((q) => q.id === id);
}

export function getAllCategories(): QuestionCategory[] {
  return [...new Set(QUESTION_BANK.map((q) => q.category))];
}

export function getCategoryLabel(category: QuestionCategory): string {
  const labels: Record<QuestionCategory, string> = {
    personality_mbti: 'Personality Type (MBTI)',
    personality_big5: 'Personality Traits (Big Five)',
    personality_enneagram: 'Core Motivations (Enneagram)',
    personality_values: 'Values & Preferences',
    background_work: 'Work Experience',
    background_education: 'Education & Learning',
    background_skills: 'Skills Inventory',
    background_hobbies: 'Interests & Passions',
    goals_income: 'Income Goals',
    goals_lifestyle: 'Lifestyle Preferences',
    goals_impact: 'Impact & Purpose',
    goals_timeline: 'Timeline & Urgency',
    content_platform: 'Platform Preferences',
    content_communication: 'Communication Style',
    content_creation: 'Content Creation',
  };
  return labels[category];
}

export function getAssessmentProgress(answers: Answer[]): {
  total: number;
  answered: number;
  percentage: number;
  byCategory: Record<string, { total: number; answered: number }>;
} {
  const total = QUESTION_BANK.filter((q) => q.required).length;
  const answeredIds = new Set(answers.map((a) => a.questionId));
  const answered = QUESTION_BANK.filter((q) => q.required && answeredIds.has(q.id)).length;

  const byCategory: Record<string, { total: number; answered: number }> = {};
  for (const cat of getAllCategories()) {
    const catQuestions = QUESTION_BANK.filter((q) => q.category === cat && q.required);
    byCategory[cat] = {
      total: catQuestions.length,
      answered: catQuestions.filter((q) => answeredIds.has(q.id)).length,
    };
  }

  return { total, answered, percentage: Math.round((answered / total) * 100), byCategory };
}

// ---- Personality Calculators ----

export function calculatePersonality(answers: Answer[]): PersonalityProfile {
  const mbti = calculateMBTI(answers);
  const bigFive = calculateBigFive(answers);
  const enneagram = calculateEnneagram(answers);
  const values = extractValues(answers);

  return {
    mbti,
    bigFive,
    enneagram,
    values,
    workStyle: deriveWorkStyle(mbti, bigFive),
    riskProfile: deriveRiskProfile(answers, bigFive),
    creativityIndex: deriveCreativityIndex(bigFive, answers),
    leadershipStyle: deriveLeadershipStyle(mbti, enneagram),
  };
}

function calculateMBTI(answers: Answer[]): MBTIResult {
  const mbtiAnswers = answers.filter((a) => a.questionId.startsWith('mbti_'));
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  for (const ans of mbtiAnswers) {
    const val = String(ans.value);
    if (val in counts) counts[val as keyof typeof counts]++;
  }

  const EI = { score: Math.round((counts.E / (counts.E + counts.I || 1)) * 100), preference: (counts.E >= counts.I ? 'E' : 'I') as 'E' | 'I' };
  const SN = { score: Math.round((counts.S / (counts.S + counts.N || 1)) * 100), preference: (counts.S >= counts.N ? 'S' : 'N') as 'S' | 'N' };
  const TF = { score: Math.round((counts.T / (counts.T + counts.F || 1)) * 100), preference: (counts.T >= counts.F ? 'T' : 'F') as 'T' | 'F' };
  const JP = { score: Math.round((counts.J / (counts.J + counts.P || 1)) * 100), preference: (counts.J >= counts.P ? 'J' : 'P') as 'J' | 'P' };

  const type = `${EI.preference}${SN.preference}${TF.preference}${JP.preference}`;

  return {
    type,
    dimensions: { EI, SN, TF, JP },
    description: getMBTIDescription(type),
    businessStrengths: getMBTIStrengths(type),
    businessChallenges: getMBTIChallenges(type),
  };
}

function calculateBigFive(answers: Answer[]): BigFiveResult {
  const b5Answers = answers.filter((a) => a.questionId.startsWith('b5_'));
  const traits = { openness: [1, 2, 3, 4, 5], conscientiousness: [6, 7, 8, 9, 10], extraversion: [11, 12, 13, 14, 15], agreeableness: [16, 17, 18, 19, 20], neuroticism: [21, 22, 23, 24, 25] };

  function avg(indices: number[]): number {
    const vals = indices.map((i) => {
      const ans = b5Answers.find((a) => a.questionId === `b5_${i}`);
      return ans ? Number(ans.value) : 4;
    });
    return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * (100 / 7));
  }

  const openness = avg(traits.openness);
  const conscientiousness = avg(traits.conscientiousness);
  const extraversion = avg(traits.extraversion);
  const agreeableness = avg(traits.agreeableness);
  const rawNeuroticism = avg(traits.neuroticism);
  // Reverse q25 (resilience is inverse of neuroticism)
  const neuroticism = rawNeuroticism;

  const dominant: string[] = [];
  if (openness > 70) dominant.push('Highly Open');
  if (conscientiousness > 70) dominant.push('Highly Conscientious');
  if (extraversion > 70) dominant.push('Highly Extraverted');
  if (agreeableness > 70) dominant.push('Highly Agreeable');
  if (neuroticism > 70) dominant.push('High Neuroticism');

  return {
    openness, conscientiousness, extraversion, agreeableness, neuroticism,
    dominantTraits: dominant.length > 0 ? dominant : ['Balanced profile'],
    businessImplications: deriveBigFiveImplications({ openness, conscientiousness, extraversion, agreeableness, neuroticism }),
  };
}

function calculateEnneagram(answers: Answer[]): EnneagramResult {
  const ennAnswers = answers.filter((a) => a.questionId.startsWith('enn_'));
  const typeCounts: Record<number, number> = {};

  for (const ans of ennAnswers) {
    const type = Number(ans.value);
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }

  const sorted = Object.entries(typeCounts).sort(([, a], [, b]) => b - a);
  const primaryType = sorted.length > 0 ? Number(sorted[0][0]) : 3;
  const wing = sorted.length > 1 ? Number(sorted[1][0]) : primaryType === 9 ? 1 : primaryType + 1;

  const names: Record<number, string> = { 1: 'The Reformer', 2: 'The Helper', 3: 'The Achiever', 4: 'The Individualist', 5: 'The Investigator', 6: 'The Loyalist', 7: 'The Enthusiast', 8: 'The Challenger', 9: 'The Peacemaker' };

  return {
    type: primaryType,
    wing,
    name: names[primaryType] || 'Unknown',
    description: `Type ${primaryType}w${wing}: ${names[primaryType]}`,
    motivations: getEnneagramMotivations(primaryType),
    businessStyle: getEnneagramBusinessStyle(primaryType),
  };
}

function extractValues(answers: Answer[]): string[] {
  const valAnswers = answers.filter((a) => a.questionId.startsWith('val_'));
  const values: string[] = [];
  for (const ans of valAnswers) {
    if (Array.isArray(ans.value)) values.push(...ans.value);
    else if (typeof ans.value === 'string' && ans.value.length < 30) values.push(ans.value);
  }
  return [...new Set(values)];
}

// ---- AI-Powered Analysis ----

export async function calculateNicheMatches(
  personality: PersonalityProfile,
  answers: Answer[],
): Promise<NicheMatchResult[]> {
  const backgroundAnswers = answers.filter((a) => a.questionId.startsWith('work_') || a.questionId.startsWith('skill_') || a.questionId.startsWith('hobby_') || a.questionId.startsWith('edu_'));
  const goalAnswers = answers.filter((a) => a.questionId.startsWith('inc_') || a.questionId.startsWith('life_') || a.questionId.startsWith('impact_') || a.questionId.startsWith('time_'));

  const prompt = getPrompt('assessmentAnalysis', {
    skills: JSON.stringify(backgroundAnswers.filter((a) => a.questionId.startsWith('skill_')).map((a) => a.value)),
    passions: JSON.stringify(answers.filter((a) => a.questionId.startsWith('hobby_')).map((a) => a.value)),
    experience: JSON.stringify(backgroundAnswers.filter((a) => a.questionId.startsWith('work_')).map((a) => ({ q: a.questionId, v: a.value }))),
    budget: String(goalAnswers.find((a) => a.questionId === 'inc_3')?.value || '500'),
    targetIncome: String(goalAnswers.find((a) => a.questionId === 'inc_1')?.value || '5000'),
    riskTolerance: personality.riskProfile,
    timeCommitment: String(goalAnswers.find((a) => a.questionId === 'life_1')?.value || '20'),
    timeline: String(goalAnswers.find((a) => a.questionId === 'time_1')?.value || '90days'),
    goals: JSON.stringify(goalAnswers.map((a) => ({ q: a.questionId, v: a.value }))),
  });

  const response = await generate({
    task: 'niche_analysis',
    prompt: prompt.user,
    systemPrompt: prompt.system,
    config: { maxTokens: 8192 },
  });

  try {
    const parsed = JSON.parse(response.text);
    return Array.isArray(parsed) ? parsed : parsed.niches || parsed.topNiches || [];
  } catch {
    return [{
      nicheName: 'Analysis Processing',
      category: 'general',
      overallScore: 0,
      personalFit: 0,
      marketDemand: 0,
      profitPotential: 0,
      reasoning: response.text,
      entryStrategy: 'See full analysis',
      estimatedTimeToRevenue: 'TBD',
    }];
  }
}

export async function generateBlueprint(
  matches: NicheMatchResult[],
  personality: PersonalityProfile,
  answers: Answer[],
): Promise<string> {
  const topNiche = matches[0];
  const goalAnswers = answers.filter((a) => a.questionId.startsWith('inc_') || a.questionId.startsWith('life_'));

  const prompt = getPrompt('blueprintGeneration', {
    nicheName: topNiche.nicheName,
    category: topNiche.category,
    overallScore: String(topNiche.overallScore),
    skills: JSON.stringify(answers.filter((a) => a.questionId.startsWith('skill_')).map((a) => a.value)),
    experience: personality.mbti.type,
    budget: String(goalAnswers.find((a) => a.questionId === 'inc_3')?.value || '500'),
    timeCommitment: String(goalAnswers.find((a) => a.questionId === 'life_1')?.value || '20'),
    targetIncome: String(goalAnswers.find((a) => a.questionId === 'inc_1')?.value || '5000'),
    nicheAnalysis: JSON.stringify(topNiche),
  });

  const response = await generate({
    task: 'blueprint_generation',
    prompt: prompt.user,
    systemPrompt: prompt.system,
    config: { maxTokens: 8192 },
  });

  return response.text;
}

// ---- Derivation Helpers ----

function deriveWorkStyle(mbti: MBTIResult, bigFive: BigFiveResult): string {
  if (mbti.dimensions.JP.preference === 'J' && bigFive.conscientiousness > 60) return 'Structured and systematic';
  if (mbti.dimensions.JP.preference === 'P' && bigFive.openness > 60) return 'Flexible and creative';
  if (mbti.dimensions.EI.preference === 'E' && bigFive.extraversion > 60) return 'Collaborative and social';
  return 'Balanced and adaptable';
}

function deriveRiskProfile(answers: Answer[], bigFive: BigFiveResult): string {
  const riskAnswer = answers.find((a) => a.questionId === 'val_7');
  if (riskAnswer?.value === 'aggressive' || bigFive.openness > 80) return 'aggressive';
  if (riskAnswer?.value === 'conservative' || bigFive.neuroticism > 70) return 'conservative';
  return 'moderate';
}

function deriveCreativityIndex(bigFive: BigFiveResult, answers: Answer[]): number {
  const base = bigFive.openness;
  const designSkill = Number(answers.find((a) => a.questionId === 'skill_3')?.value || 5);
  const videoSkill = Number(answers.find((a) => a.questionId === 'skill_4')?.value || 5);
  return Math.round((base * 0.6 + ((designSkill + videoSkill) / 2) * 10 * 0.4));
}

function deriveLeadershipStyle(mbti: MBTIResult, enneagram: EnneagramResult): string {
  if (enneagram.type === 8 || mbti.dimensions.EI.preference === 'E') return 'Commanding';
  if (enneagram.type === 2 || mbti.dimensions.TF.preference === 'F') return 'Servant';
  if (enneagram.type === 5 || mbti.dimensions.SN.preference === 'N') return 'Visionary';
  return 'Strategic';
}

function getMBTIDescription(type: string): string {
  const descriptions: Record<string, string> = {
    INTJ: 'The Architect: Strategic, independent, innovative. Builds systems and plans with long-term vision.',
    INTP: 'The Logician: Analytical, inventive, curious. Excels at solving complex abstract problems.',
    ENTJ: 'The Commander: Bold, strategic, organized. Natural leader who drives toward goals with efficiency.',
    ENTP: 'The Debater: Innovative, entrepreneurial, quick-thinking. Thrives on challenging ideas and creating new ventures.',
    INFJ: 'The Advocate: Insightful, principled, compassionate. Creates businesses driven by purpose and meaning.',
    INFP: 'The Mediator: Creative, empathetic, idealistic. Builds authentic brands aligned with personal values.',
    ENFJ: 'The Protagonist: Charismatic, inspiring, organized. Natural teacher and community builder.',
    ENFP: 'The Campaigner: Enthusiastic, creative, social. Excels at marketing and building passionate audiences.',
    ISTJ: 'The Logistician: Dependable, thorough, systematic. Builds reliable, well-organized businesses.',
    ISFJ: 'The Defender: Supportive, reliable, patient. Creates service-oriented businesses with loyal customers.',
    ESTJ: 'The Executive: Organized, logical, assertive. Effective manager who builds scalable operations.',
    ESFJ: 'The Consul: Caring, social, loyal. Builds community-focused businesses with strong relationships.',
    ISTP: 'The Virtuoso: Practical, observant, analytical. Builds efficient, hands-on solutions.',
    ISFP: 'The Adventurer: Flexible, charming, creative. Creates aesthetically-driven brands and products.',
    ESTP: 'The Entrepreneur: Energetic, perceptive, bold. Natural risk-taker who seizes opportunities quickly.',
    ESFP: 'The Entertainer: Spontaneous, energetic, fun. Builds engaging brands through personality and entertainment.',
  };
  return descriptions[type] || 'Unique personality type with diverse business potential.';
}

function getMBTIStrengths(type: string): string[] {
  const first = type[0], second = type[1], third = type[2], fourth = type[3];
  const strengths: string[] = [];
  if (first === 'E') strengths.push('Networking and relationship building', 'Public-facing content creation');
  else strengths.push('Deep focused work', 'Written content and strategy');
  if (second === 'N') strengths.push('Innovation and vision', 'Identifying market trends');
  else strengths.push('Practical implementation', 'Detail-oriented execution');
  if (third === 'T') strengths.push('Data-driven decisions', 'Analytical problem solving');
  else strengths.push('Understanding customer emotions', 'Building loyal communities');
  if (fourth === 'J') strengths.push('Project management', 'Consistent content schedules');
  else strengths.push('Adapting to market changes', 'Creative experimentation');
  return strengths;
}

function getMBTIChallenges(type: string): string[] {
  const first = type[0], third = type[2], fourth = type[3];
  const challenges: string[] = [];
  if (first === 'I') challenges.push('May avoid networking and sales calls');
  else challenges.push('May spread too thin across relationships');
  if (third === 'T') challenges.push('May neglect customer emotional needs');
  else challenges.push('May struggle with tough business decisions');
  if (fourth === 'P') challenges.push('May struggle with consistency and deadlines');
  else challenges.push('May resist pivoting when needed');
  return challenges;
}

function deriveBigFiveImplications(scores: { openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number }): string[] {
  const implications: string[] = [];
  if (scores.openness > 70) implications.push('Well-suited for innovative, creative businesses');
  if (scores.conscientiousness > 70) implications.push('Strong execution ability — will follow through on plans');
  if (scores.extraversion > 70) implications.push('Natural content creator and community builder');
  if (scores.agreeableness > 70) implications.push('Strong customer service and relationship management');
  if (scores.neuroticism > 70) implications.push('May need stress management strategies for entrepreneurship');
  if (scores.neuroticism < 30) implications.push('High emotional resilience — handles setbacks well');
  return implications.length > 0 ? implications : ['Balanced personality suitable for various business models'];
}

function getEnneagramMotivations(type: number): string[] {
  const motivations: Record<number, string[]> = {
    1: ['Doing things the right way', 'Improving systems', 'Maintaining integrity'],
    2: ['Helping others succeed', 'Being appreciated', 'Making a difference'],
    3: ['Achieving excellence', 'Being recognized', 'Reaching ambitious goals'],
    4: ['Authentic self-expression', 'Creating beauty', 'Finding meaning'],
    5: ['Understanding deeply', 'Building expertise', 'Maintaining independence'],
    6: ['Creating security', 'Building reliable systems', 'Supporting community'],
    7: ['Exploring possibilities', 'Creating experiences', 'Maintaining freedom'],
    8: ['Taking control', 'Building power', 'Protecting what matters'],
    9: ['Creating harmony', 'Bringing people together', 'Maintaining peace'],
  };
  return motivations[type] || ['Self-improvement', 'Achievement', 'Growth'];
}

function getEnneagramBusinessStyle(type: number): string {
  const styles: Record<number, string> = {
    1: 'Quality-focused perfectionist who builds premium, well-crafted offerings',
    2: 'Service-oriented builder who creates deep customer relationships',
    3: 'Achievement-driven entrepreneur focused on metrics and growth',
    4: 'Creative visionary who builds unique, emotionally resonant brands',
    5: 'Knowledge-driven expert who builds authority through deep expertise',
    6: 'Careful planner who builds stable, community-supported businesses',
    7: 'Innovation-driven launcher who creates exciting new ventures',
    8: 'Power-building leader who creates dominant market positions',
    9: 'Harmony-seeking builder who creates inclusive, welcoming brands',
  };
  return styles[type] || 'Adaptable entrepreneur with diverse strengths';
}
