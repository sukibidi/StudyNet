export type ScreenType = 'HOME' | 'SCHED' | 'AI-NET' | 'DECKS' | 'STATS' | 'DRILL' | 'LOGIN' | 'EDIT_PROFILE';

export type AlertType = 'EXAM' | 'DEADLINE' | 'LAB' | 'QUIZ' | 'DRILL';
export type AlertSeverity = 'CRITICAL' | 'URGENT' | 'WARNING' | 'INFO';

export interface TacticalAlert {
  id: string;
  type: AlertType;
  title: string;
  subtitle?: string;
  courseCode: string;
  dueDate: string;
  hoursRemaining: number; // in hours, e.g. 3.5 or 14
  severity: AlertSeverity;
  actionScreen?: ScreenType;
  actionLabel?: string;
  dismissed?: boolean;
  acknowledged?: boolean;
  timestamp: number;
  source?: 'SCHEDULE' | 'SYSTEM' | 'USER';
}

export interface OperatorProfile {
  name: string;
  email?: string;
  handle?: string;
  role: string;
  institution?: string;
  level: number;
  xp: number;
  xpMax: number;
  rank: string;
  cgpa: number;
  targetCgpa: number;
  avatarUrl: string;
  targetExam?: string;
  focusArea?: string;
  isZeroData?: boolean;
}

export interface ExamCountdown {
  title: string;
  course: string;
  subtitle: string;
  location: string;
  scope: string;
  targetDate: string; // ISO string
  readinessPercent: number;
  streakDays: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  location: string;
  badge?: string;
  badgeType?: 'active' | 'upcoming' | 'urgent';
  attachedDoc?: {
    name: string;
    description: string;
    syncedPercent: number;
  };
  preparationNote?: string;
  isRequired?: boolean;
}

export interface DaySchedule {
  dayName: string;
  dateNumber: number;
  isToday?: boolean;
  totalHours: number;
  completedHours: number;
  lecturesCount: number;
  labsCount: number;
  transitMins: number;
  items: ScheduleItem[];
  freeWindow?: {
    time: string;
    duration: string;
    recommendation: string;
  };
}

export interface CognitiveAttribute {
  axis: string;
  value: number;
  maxValue: number;
  isDeficit?: boolean;
}

export interface CognitivePerk {
  id: string;
  title: string;
  effect: string;
  type: 'EQUIPPED' | 'PASSIVE' | 'AVAILABLE';
  icon: string;
}

export interface Flashcard {
  id: string;
  course: string;
  cardNumber: number;
  totalCards: number;
  topic: string;
  category: string;
  question: string;
  keyAspect: string;
  revealed?: boolean;
  comparison: {
    leftTitle: string;
    leftValue: string;
    leftSub: string;
    rightTitle: string;
    rightValue: string;
    rightSub: string;
  };
  explanation: string;
  retentionStability: number;
}

export interface DrillQuestion {
  id: number;
  course: string;
  title: string;
  context: string;
  problem: string;
  capacity: string;
  weights: string;
  values: string;
  options: {
    id: string;
    formula: string;
    description: string;
    isCorrect: boolean;
  }[];
  selectedOptionId?: string;
  verifiedLabel: string;
  matrix: {
    capacities: number[];
    rows: {
      label: string;
      cells: { val: number; highlight?: boolean }[];
    }[];
  };
  explanation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai-net';
  timestamp: string;
  text: string;
  messageReferences?: string;
  breakdown?: {
    outerBits: string;
    innerBits: string;
    offsetBits: string;
    pageSize: string;
  };
  sequence?: string[];
  examTip?: string;
}

export type GradeLetter = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F';

export interface SubjectAiInsight {
  status: 'OPTIMAL_RETENTION' | 'STABLE' | 'DECAY_WARNING' | 'CRITICAL_DRILL';
  examReadiness: number; // 0-100%
  dominantConcepts: string[];
  focusWeaknesses?: string[];
  recommendedDrillTopic: string;
  verdict: string;
  analyzedAt: string;
}

export interface SubjectTaken {
  id: string;
  name: string;
  code: string;
  grade: GradeLetter;
  term?: string;
  credits?: number;
  areaOfExpertise: string;
  proficiencyPercent: number; // 0-100%
  memoryRetentionPercent: number; // 0-100%
  keyStrengths?: string[];
  cognitiveNotes?: string;
  aiInsight?: SubjectAiInsight;
}

export interface ExpertiseAnalysisSummary {
  dominantDomain: string;
  averageProficiency: number;
  averageMemoryRetention: number;
  cognitiveRetentionHealth: 'OPTIMAL' | 'MODERATE_DECAY' | 'CRITICAL_REVIEW_NEEDED';
  recommendations: string[];
}

