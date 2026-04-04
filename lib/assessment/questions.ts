// ============================================
// NicheGenius AI - Client-Safe Question Bank
// No server-side dependencies - safe for 'use client'
// ============================================

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
  options?: Array<{ value: string; label: string }>;
  required: boolean;
  order: number;
  min?: number;
  max?: number;
  placeholder?: string;
}

export const QUESTION_BANK: Question[] = [
  // ─── MBTI (20 questions) ─────────────────────────────────────────────
  { id: 'mbti_1', text: 'At social events, I tend to:', category: 'personality_mbti', type: 'choice', options: [{ value: 'E', label: 'Engage with many people and feel energized' }, { value: 'I', label: 'Prefer deep conversations with a few people' }], required: true, order: 1 },
  { id: 'mbti_2', text: 'When making decisions, I rely more on:', category: 'personality_mbti', type: 'choice', options: [{ value: 'T', label: 'Logic, analysis, and objective criteria' }, { value: 'F', label: 'Personal values, empathy, and how others feel' }], required: true, order: 2 },
  { id: 'mbti_3', text: 'I prefer work environments that are:', category: 'personality_mbti', type: 'choice', options: [{ value: 'J', label: 'Structured, planned, and organized' }, { value: 'P', label: 'Flexible, spontaneous, and adaptable' }], required: true, order: 3 },
  { id: 'mbti_4', text: 'When learning something new, I focus on:', category: 'personality_mbti', type: 'choice', options: [{ value: 'S', label: 'Concrete facts, details, and practical applications' }, { value: 'N', label: 'Patterns, possibilities, and the big picture' }], required: true, order: 4 },
  { id: 'mbti_5', text: 'After a long day, I recharge by:', category: 'personality_mbti', type: 'choice', options: [{ value: 'E', label: 'Going out with friends or attending events' }, { value: 'I', label: 'Spending quiet time alone or with close family' }], required: true, order: 5 },
  { id: 'mbti_6', text: 'When starting a project, I typically:', category: 'personality_mbti', type: 'choice', options: [{ value: 'J', label: 'Create a detailed plan before beginning' }, { value: 'P', label: 'Dive in and figure things out as I go' }], required: true, order: 6 },
  { id: 'mbti_7', text: 'I am more drawn to:', category: 'personality_mbti', type: 'choice', options: [{ value: 'S', label: 'What is real and actual right now' }, { value: 'N', label: 'What could be possible in the future' }], required: true, order: 7 },
  { id: 'mbti_8', text: 'In conflicts, I prioritize:', category: 'personality_mbti', type: 'choice', options: [{ value: 'T', label: 'Finding the most fair and logical solution' }, { value: 'F', label: 'Maintaining harmony and understanding feelings' }], required: true, order: 8 },
  { id: 'mbti_9', text: 'I get my best ideas when:', category: 'personality_mbti', type: 'choice', options: [{ value: 'E', label: 'Brainstorming and talking with others' }, { value: 'I', label: 'Reflecting quietly on my own' }], required: true, order: 9 },
  { id: 'mbti_10', text: 'My workspace is usually:', category: 'personality_mbti', type: 'choice', options: [{ value: 'J', label: 'Neat, organized, and everything in its place' }, { value: 'P', label: 'A bit messy but I know where everything is' }], required: true, order: 10 },
  { id: 'mbti_11', text: 'I trust more:', category: 'personality_mbti', type: 'choice', options: [{ value: 'S', label: 'My direct experience and observations' }, { value: 'N', label: 'My gut feelings and intuition' }], required: true, order: 11 },
  { id: 'mbti_12', text: 'When giving feedback, I tend to be:', category: 'personality_mbti', type: 'choice', options: [{ value: 'T', label: 'Direct and straightforward, even if it stings' }, { value: 'F', label: 'Diplomatic and considerate of feelings' }], required: true, order: 12 },
  { id: 'mbti_13', text: 'I feel most productive when:', category: 'personality_mbti', type: 'choice', options: [{ value: 'E', label: 'Working in a team with lots of interaction' }, { value: 'I', label: 'Working independently with minimal interruptions' }], required: true, order: 13 },
  { id: 'mbti_14', text: 'Deadlines make me feel:', category: 'personality_mbti', type: 'choice', options: [{ value: 'J', label: 'Motivated — I plan ahead to finish early' }, { value: 'P', label: 'Pressured — I do my best work last minute' }], required: true, order: 14 },
  { id: 'mbti_15', text: 'I prefer reading or watching content about:', category: 'personality_mbti', type: 'choice', options: [{ value: 'S', label: 'Practical how-to guides and real examples' }, { value: 'N', label: 'Theories, ideas, and future possibilities' }], required: true, order: 15 },
  { id: 'mbti_16', text: 'When someone shares a problem, I first:', category: 'personality_mbti', type: 'choice', options: [{ value: 'T', label: 'Analyze the situation and suggest solutions' }, { value: 'F', label: 'Listen empathetically and validate their feelings' }], required: true, order: 16 },
  { id: 'mbti_17', text: 'At meetings, I usually:', category: 'personality_mbti', type: 'choice', options: [{ value: 'E', label: 'Speak up often and share ideas actively' }, { value: 'I', label: 'Listen carefully and speak when I have something important' }], required: true, order: 17 },
  { id: 'mbti_18', text: 'I prefer plans that are:', category: 'personality_mbti', type: 'choice', options: [{ value: 'J', label: 'Firm and settled so I can prepare' }, { value: 'P', label: 'Open-ended so I can adapt as needed' }], required: true, order: 18 },
  { id: 'mbti_19', text: 'I am more interested in:', category: 'personality_mbti', type: 'choice', options: [{ value: 'S', label: 'Perfecting proven methods and techniques' }, { value: 'N', label: 'Inventing new approaches and innovations' }], required: true, order: 19 },
  { id: 'mbti_20', text: 'My ideal weekend involves:', category: 'personality_mbti', type: 'choice', options: [{ value: 'E', label: 'Social activities, events, and meeting people' }, { value: 'I', label: 'Quiet activities, hobbies, and personal time' }], required: true, order: 20 },

  // ─── Big Five (25 questions - scale 1-5) ─────────────────────────────
  { id: 'b5_1', text: 'I enjoy trying new experiences and exploring unfamiliar places.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 21 },
  { id: 'b5_2', text: 'I keep my promises and follow through on commitments.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 22 },
  { id: 'b5_3', text: 'I feel comfortable being the center of attention.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 23 },
  { id: 'b5_4', text: 'I go out of my way to help others, even strangers.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 24 },
  { id: 'b5_5', text: 'I handle stress and setbacks without getting too upset.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 25 },
  { id: 'b5_6', text: 'I am curious about many different topics and subjects.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 26 },
  { id: 'b5_7', text: 'I pay close attention to details in my work.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 27 },
  { id: 'b5_8', text: 'I start conversations with people I do not know.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 28 },
  { id: 'b5_9', text: 'I believe most people have good intentions.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 29 },
  { id: 'b5_10', text: 'I worry about things that might go wrong.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 30 },
  { id: 'b5_11', text: 'I enjoy creative activities like art, writing, or music.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 31 },
  { id: 'b5_12', text: 'I am disciplined and can resist temptation.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 32 },
  { id: 'b5_13', text: 'I feel energized after spending time with groups.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 33 },
  { id: 'b5_14', text: 'I cooperate easily with others, even in disagreements.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 34 },
  { id: 'b5_15', text: 'I bounce back quickly from disappointments.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 35 },
  { id: 'b5_16', text: 'I prefer variety over routine in my daily life.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 36 },
  { id: 'b5_17', text: 'I set goals and systematically work toward them.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 37 },
  { id: 'b5_18', text: 'I enjoy being in leadership roles.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 38 },
  { id: 'b5_19', text: 'I am patient with people who make mistakes.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 39 },
  { id: 'b5_20', text: 'I sometimes feel overwhelmed by emotions.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 40 },
  { id: 'b5_21', text: 'I challenge the status quo and question authority.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 41 },
  { id: 'b5_22', text: 'I finish tasks on time without procrastinating.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 42 },
  { id: 'b5_23', text: 'I am talkative and outgoing in most situations.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 43 },
  { id: 'b5_24', text: 'I forgive others easily, even after being wronged.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 44 },
  { id: 'b5_25', text: 'I stay calm under pressure.', category: 'personality_big5', type: 'scale', min: 1, max: 5, required: true, order: 45 },

  // ─── Enneagram (15 questions) ─────────────────────────────────────────
  { id: 'enn_1', text: 'My primary motivation in life is:', category: 'personality_enneagram', type: 'choice', options: [{ value: '1', label: 'Being correct and improving everything' }, { value: '2', label: 'Being needed and helping others' }, { value: '3', label: 'Being successful and admired' }], required: true, order: 46 },
  { id: 'enn_2', text: 'My secondary motivation is:', category: 'personality_enneagram', type: 'choice', options: [{ value: '4', label: 'Being unique and authentic' }, { value: '5', label: 'Understanding and mastering knowledge' }, { value: '6', label: 'Being secure and prepared' }], required: true, order: 47 },
  { id: 'enn_3', text: 'I also deeply value:', category: 'personality_enneagram', type: 'choice', options: [{ value: '7', label: 'Having fun and exciting experiences' }, { value: '8', label: 'Being strong and in control' }, { value: '9', label: 'Maintaining peace and harmony' }], required: true, order: 48 },
  { id: 'enn_4', text: 'My biggest fear is:', category: 'personality_enneagram', type: 'choice', options: [{ value: '1', label: 'Being corrupt or defective' }, { value: '3', label: 'Being worthless or a failure' }, { value: '5', label: 'Being helpless or incapable' }], required: true, order: 49 },
  { id: 'enn_5', text: 'Under stress, I tend to:', category: 'personality_enneagram', type: 'choice', options: [{ value: '1', label: 'Become critical and rigid' }, { value: '4', label: 'Withdraw and become moody' }, { value: '7', label: 'Distract myself with activity' }], required: true, order: 50 },
  { id: 'enn_6', text: 'In relationships, I am known for being:', category: 'personality_enneagram', type: 'choice', options: [{ value: '2', label: 'Generous and attentive to needs' }, { value: '6', label: 'Loyal and dependable' }, { value: '9', label: 'Easy-going and supportive' }], required: true, order: 51 },
  { id: 'enn_7', text: 'My approach to work is:', category: 'personality_enneagram', type: 'choice', options: [{ value: '1', label: 'Methodical and quality-focused' }, { value: '3', label: 'Efficient and results-oriented' }, { value: '8', label: 'Direct and commanding' }], required: true, order: 52 },
  { id: 'enn_8', text: 'When I feel insecure, I:', category: 'personality_enneagram', type: 'choice', options: [{ value: '2', label: 'Try harder to please people' }, { value: '5', label: 'Retreat into my mind and research' }, { value: '6', label: 'Seek reassurance from trusted sources' }], required: true, order: 53 },
  { id: 'enn_9', text: 'My ideal day includes:', category: 'personality_enneagram', type: 'choice', options: [{ value: '4', label: 'Creative self-expression and meaningful experiences' }, { value: '7', label: 'Adventure, variety, and new discoveries' }, { value: '9', label: 'Comfort, peace, and pleasant activities' }], required: true, order: 54 },
  { id: 'enn_10', text: 'People often describe me as:', category: 'personality_enneagram', type: 'choice', options: [{ value: '1', label: 'Principled and responsible' }, { value: '3', label: 'Ambitious and charming' }, { value: '8', label: 'Confident and assertive' }], required: true, order: 55 },
  { id: 'enn_11', text: 'What drains my energy most:', category: 'personality_enneagram', type: 'choice', options: [{ value: '2', label: 'Feeling unappreciated for my help' }, { value: '4', label: 'Feeling ordinary and insignificant' }, { value: '6', label: 'Uncertainty and unpredictability' }], required: true, order: 56 },
  { id: 'enn_12', text: 'My communication style is:', category: 'personality_enneagram', type: 'choice', options: [{ value: '5', label: 'Precise, thoughtful, and measured' }, { value: '7', label: 'Enthusiastic, fast-paced, and idea-filled' }, { value: '9', label: 'Calm, agreeable, and inclusive' }], required: true, order: 57 },
  { id: 'enn_13', text: 'I handle conflict by:', category: 'personality_enneagram', type: 'choice', options: [{ value: '1', label: 'Pointing out what is right and fair' }, { value: '8', label: 'Confronting it head-on with force' }, { value: '9', label: 'Avoiding it and hoping it resolves' }], required: true, order: 58 },
  { id: 'enn_14', text: 'My spending habits tend toward:', category: 'personality_enneagram', type: 'choice', options: [{ value: '3', label: 'Investing in appearance and status' }, { value: '5', label: 'Minimal spending, saving resources' }, { value: '7', label: 'Spontaneous purchases for experiences' }], required: true, order: 59 },
  { id: 'enn_15', text: 'My deepest desire is to:', category: 'personality_enneagram', type: 'choice', options: [{ value: '2', label: 'Be truly loved for who I am' }, { value: '4', label: 'Find my unique identity and purpose' }, { value: '8', label: 'Protect myself and those I care about' }], required: true, order: 60 },

  // ─── Values (10 questions) ───────────────────────────────────────────
  { id: 'val_1', text: 'Rank how important financial freedom is to you:', category: 'personality_values', type: 'scale', min: 1, max: 5, required: true, order: 61 },
  { id: 'val_2', text: 'Rank how important creative expression is to you:', category: 'personality_values', type: 'scale', min: 1, max: 5, required: true, order: 62 },
  { id: 'val_3', text: 'Rank how important helping others is to you:', category: 'personality_values', type: 'scale', min: 1, max: 5, required: true, order: 63 },
  { id: 'val_4', text: 'Rank how important personal growth is to you:', category: 'personality_values', type: 'scale', min: 1, max: 5, required: true, order: 64 },
  { id: 'val_5', text: 'Rank how important work-life balance is to you:', category: 'personality_values', type: 'scale', min: 1, max: 5, required: true, order: 65 },
  { id: 'val_6', text: 'Rank how important recognition and status is to you:', category: 'personality_values', type: 'scale', min: 1, max: 5, required: true, order: 66 },
  { id: 'val_7', text: 'Rank how important independence is to you:', category: 'personality_values', type: 'scale', min: 1, max: 5, required: true, order: 67 },
  { id: 'val_8', text: 'Rank how important security and stability is to you:', category: 'personality_values', type: 'scale', min: 1, max: 5, required: true, order: 68 },
  { id: 'val_9', text: 'Rank how important adventure and novelty is to you:', category: 'personality_values', type: 'scale', min: 1, max: 5, required: true, order: 69 },
  { id: 'val_10', text: 'Rank how important family and relationships is to you:', category: 'personality_values', type: 'scale', min: 1, max: 5, required: true, order: 70 },

  // ─── Background: Work (15 questions) ─────────────────────────────────
  { id: 'work_1', text: 'How many years of professional work experience do you have?', category: 'background_work', type: 'choice', options: [{ value: '0-2', label: '0-2 years' }, { value: '3-5', label: '3-5 years' }, { value: '6-10', label: '6-10 years' }, { value: '10+', label: '10+ years' }], required: true, order: 71 },
  { id: 'work_2', text: 'Which industry is your primary experience in?', category: 'background_work', type: 'choice', options: [{ value: 'tech', label: 'Technology / Software' }, { value: 'health', label: 'Healthcare / Wellness' }, { value: 'finance', label: 'Finance / Business' }, { value: 'education', label: 'Education / Training' }, { value: 'creative', label: 'Creative / Media' }, { value: 'service', label: 'Service / Hospitality' }, { value: 'other', label: 'Other' }], required: true, order: 72 },
  { id: 'work_3', text: 'Have you managed a team before?', category: 'background_work', type: 'choice', options: [{ value: 'yes', label: 'Yes, I have managed teams' }, { value: 'no', label: 'No, I have not' }, { value: 'some', label: 'Informally or on small projects' }], required: true, order: 73 },
  { id: 'work_4', text: 'Do you have experience in sales or marketing?', category: 'background_work', type: 'choice', options: [{ value: 'extensive', label: 'Yes, extensive experience' }, { value: 'some', label: 'Some experience' }, { value: 'none', label: 'No experience' }], required: true, order: 74 },
  { id: 'work_5', text: 'Have you ever run your own business or side hustle?', category: 'background_work', type: 'choice', options: [{ value: 'yes_success', label: 'Yes, successfully' }, { value: 'yes_tried', label: 'Yes, but it did not work out' }, { value: 'no', label: 'No, never' }], required: true, order: 75 },
  { id: 'work_6', text: 'Rate your public speaking ability:', category: 'background_work', type: 'scale', min: 1, max: 5, required: true, order: 76 },
  { id: 'work_7', text: 'Rate your writing ability:', category: 'background_work', type: 'scale', min: 1, max: 5, required: true, order: 77 },
  { id: 'work_8', text: 'Rate your technical/computer skills:', category: 'background_work', type: 'scale', min: 1, max: 5, required: true, order: 78 },
  { id: 'work_9', text: 'Rate your networking ability:', category: 'background_work', type: 'scale', min: 1, max: 5, required: true, order: 79 },
  { id: 'work_10', text: 'Rate your problem-solving ability:', category: 'background_work', type: 'scale', min: 1, max: 5, required: true, order: 80 },
  { id: 'work_11', text: 'What is your current employment status?', category: 'background_work', type: 'choice', options: [{ value: 'employed_ft', label: 'Employed full-time' }, { value: 'employed_pt', label: 'Employed part-time' }, { value: 'self_employed', label: 'Self-employed' }, { value: 'unemployed', label: 'Between jobs' }, { value: 'student', label: 'Student' }, { value: 'retired', label: 'Retired' }], required: true, order: 81 },
  { id: 'work_12', text: 'What type of work energizes you most?', category: 'background_work', type: 'choice', options: [{ value: 'creating', label: 'Creating and building things' }, { value: 'teaching', label: 'Teaching and mentoring' }, { value: 'analyzing', label: 'Analyzing and solving problems' }, { value: 'connecting', label: 'Connecting with people' }, { value: 'organizing', label: 'Organizing and managing' }], required: true, order: 82 },
  { id: 'work_13', text: 'How many hours per week can you dedicate to a side project?', category: 'background_work', type: 'choice', options: [{ value: '1-5', label: '1-5 hours' }, { value: '6-10', label: '6-10 hours' }, { value: '11-20', label: '11-20 hours' }, { value: '20+', label: '20+ hours (full-time)' }], required: true, order: 83 },
  { id: 'work_14', text: 'Do you have experience creating digital content?', category: 'background_work', type: 'choice', options: [{ value: 'yes_regular', label: 'Yes, I create content regularly' }, { value: 'yes_some', label: 'Some experience' }, { value: 'no', label: 'No experience' }], required: true, order: 84 },
  { id: 'work_15', text: 'Have you ever taught or trained someone?', category: 'background_work', type: 'choice', options: [{ value: 'professional', label: 'Yes, professionally' }, { value: 'informal', label: 'Informally (friends, family, coworkers)' }, { value: 'no', label: 'Not really' }], required: true, order: 85 },

  // ─── Goals: Income (5 questions) ─────────────────────────────────────
  { id: 'inc_1', text: 'What is your monthly income goal from your online niche?', category: 'goals_income', type: 'choice', options: [{ value: '1k', label: '$1,000 - $3,000' }, { value: '5k', label: '$3,000 - $10,000' }, { value: '10k', label: '$10,000 - $25,000' }, { value: '25k+', label: '$25,000+' }], required: true, order: 86 },
  { id: 'inc_2', text: 'How quickly do you want to reach your first $1,000?', category: 'goals_income', type: 'choice', options: [{ value: '1m', label: 'Within 1 month' }, { value: '3m', label: 'Within 3 months' }, { value: '6m', label: 'Within 6 months' }, { value: '1y', label: 'Within a year' }], required: true, order: 87 },
  { id: 'inc_3', text: 'How much are you willing to invest upfront?', category: 'goals_income', type: 'choice', options: [{ value: '0', label: '$0 — Only free tools' }, { value: 'low', label: '$1 - $100' }, { value: 'mid', label: '$100 - $500' }, { value: 'high', label: '$500+' }], required: true, order: 88 },
  { id: 'inc_4', text: 'Which revenue model appeals to you most?', category: 'goals_income', type: 'choice', options: [{ value: 'products', label: 'Selling digital products (courses, ebooks)' }, { value: 'services', label: 'Offering services (coaching, consulting)' }, { value: 'content', label: 'Content monetization (ads, sponsors)' }, { value: 'affiliate', label: 'Affiliate marketing' }, { value: 'mixed', label: 'A mix of everything' }], required: true, order: 89 },
  { id: 'inc_5', text: 'Is this intended to replace your full-time income?', category: 'goals_income', type: 'choice', options: [{ value: 'yes', label: 'Yes, within 6-12 months' }, { value: 'eventually', label: 'Eventually, but not immediately' }, { value: 'side', label: 'No, just a profitable side project' }], required: true, order: 90 },

  // ─── Content Style: Platform (5 questions) ──────────────────────────
  { id: 'plat_1', text: 'Which platform are you most comfortable with?', category: 'content_platform', type: 'choice', options: [{ value: 'tiktok', label: 'TikTok' }, { value: 'youtube', label: 'YouTube' }, { value: 'instagram', label: 'Instagram' }, { value: 'twitter', label: 'X (Twitter)' }, { value: 'linkedin', label: 'LinkedIn' }, { value: 'blog', label: 'Blog / Website' }, { value: 'podcast', label: 'Podcast' }], required: true, order: 91 },
  { id: 'plat_2', text: 'Do you prefer short-form or long-form content?', category: 'content_platform', type: 'choice', options: [{ value: 'short', label: 'Short-form (60 seconds or less)' }, { value: 'medium', label: 'Medium-form (2-10 minutes)' }, { value: 'long', label: 'Long-form (10+ minutes or articles)' }, { value: 'mixed', label: 'A mix' }], required: true, order: 92 },
  { id: 'plat_3', text: 'Are you comfortable showing your face on camera?', category: 'content_platform', type: 'choice', options: [{ value: 'yes', label: 'Yes, very comfortable' }, { value: 'learning', label: 'Getting there, still nervous' }, { value: 'no', label: 'No, I prefer faceless content' }], required: true, order: 93 },
  { id: 'plat_4', text: 'How often can you post content?', category: 'content_platform', type: 'choice', options: [{ value: 'daily', label: 'Daily' }, { value: '3-5', label: '3-5 times per week' }, { value: '1-2', label: '1-2 times per week' }, { value: 'monthly', label: 'A few times per month' }], required: true, order: 94 },
  { id: 'plat_5', text: 'What content format excites you most?', category: 'content_platform', type: 'choice', options: [{ value: 'video', label: 'Video (tutorials, vlogs, live)' }, { value: 'writing', label: 'Writing (blog posts, threads, newsletters)' }, { value: 'visual', label: 'Visual (graphics, carousels, infographics)' }, { value: 'audio', label: 'Audio (podcasts, spaces)' }], required: true, order: 95 },
];

export const SECTION_MAP: Record<string, { title: string; description: string; icon: string }> = {
  personality_mbti: { title: 'Personality: How You Think', description: 'MBTI-based questions about your cognitive preferences', icon: '🧠' },
  personality_big5: { title: 'Personality: Who You Are', description: 'Big Five personality traits assessment', icon: '⭐' },
  personality_enneagram: { title: 'Personality: What Drives You', description: 'Enneagram motivations and fears', icon: '🔮' },
  personality_values: { title: 'Your Core Values', description: 'What matters most to you in life and work', icon: '💎' },
  background_work: { title: 'Your Background & Skills', description: 'Experience, skills, and capabilities', icon: '💼' },
  goals_income: { title: 'Your Income Goals', description: 'Financial targets and business model preferences', icon: '💰' },
  content_platform: { title: 'Your Content Style', description: 'Platform preferences and content creation style', icon: '🎯' },
};

export function getQuestionsByCategory(category: string): Question[] {
  return QUESTION_BANK.filter((q) => q.category === category);
}

export function getSections(): string[] {
  return [...new Set(QUESTION_BANK.map((q) => q.category))];
}
