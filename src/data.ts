import { DaySchedule, DrillQuestion, Flashcard, OperatorProfile } from './types';
import { fetchScheduleDays, fetchScheduleItems, saveScheduleDay, saveScheduleItem, fetchFlashcards, saveFlashcard, fetchDrillQuestions, saveDrillQuestion, ensureProfileId } from './lib/api';

export const DEFAULT_AVATARS = [
  {
    id: 'maya',
    name: 'Maya Lin (Tactical Default)',
    url: 'https://lh3.googleusercontent.com/aida/AEtjO1WsUeHjMDNWehAkSiExoKIBAqbn0WHSBb8bMlTg2WNrHu-HubAk-emKoCWEnM02iuJBPFpSSkcEuCqmPASrQ526qGrd_qThALUz3AJPoaWTK33a8jIJNxLivpibY6oeiRka-AskWLoxU3Vrr6kcILLgqtd6XBL60SwuY15gpJ6nww9y02JYYJCSsISYSGle33UF7hGFhWTBfGEcmC1daPaiMvWx1F5LTl9KgiKryIGxHNZMe-1CmqLqqzI',
  },
  {
    id: 'ash',
    name: 'Ash Fury (Cyber Architect)',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'cadet',
    name: 'Cadet Recruit (Zero Baseline)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'neural',
    name: 'Neural Specialist',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'hacker',
    name: 'Systems Hacker',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'synth',
    name: 'Quantum Operator',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
];

export const OPERATOR_PROFILE: OperatorProfile = {
  name: 'Ash Fury',
  email: 'AshFuryz@gmail.com',
  handle: '@ashfuryz',
  role: 'CYBER-SYSTEMS ARCHITECT',
  institution: 'Advanced Systems Laboratory',
  level: 5,
  xp: 9420,
  xpMax: 10000,
  rank: 'Top 1% Elite Cohort',
  cgpa: 3.92,
  targetCgpa: 4.00,
  avatarUrl: DEFAULT_AVATARS[1].url,
  targetExam: 'Distributed Consensus & Kernel Internals',
  focusArea: 'Concurrency & Virtual Memory Paging',
  isZeroData: false,
};

export const PRESET_OPERATORS: OperatorProfile[] = [
  OPERATOR_PROFILE,
  {
    name: 'Maya Lin',
    email: 'maya.lin@univ.edu',
    handle: '@mayalin_cs',
    role: 'CS-CORE OPERATOR',
    institution: 'Dept of Computer Science & Engineering',
    level: 4,
    xp: 8450,
    xpMax: 10000,
    rank: 'Top 4% CS Dept',
    cgpa: 3.84,
    targetCgpa: 3.90,
    avatarUrl: DEFAULT_AVATARS[0].url,
    targetExam: 'CS301 Midterm Exam',
    focusArea: 'Dynamic Programming: Memoization Tables',
    isZeroData: false,
  },
  {
    name: 'Recruit Cadet',
    email: 'cadet@univ.edu',
    handle: '@cadet_01',
    role: 'OPERATOR STANDBY',
    institution: 'Division of Computing Fundamentals',
    level: 1,
    xp: 0,
    xpMax: 1000,
    rank: 'Unranked Cadet',
    cgpa: 0.00,
    targetCgpa: 3.80,
    avatarUrl: DEFAULT_AVATARS[2].url,
    targetExam: 'Initial Benchmark Diagnostic',
    focusArea: 'Baseline Diagnostic Telemetry',
    isZeroData: true,
  },
];

export const isProfileZeroData = (profile?: OperatorProfile | null): boolean => {
  if (!profile) return false;
  if (typeof profile.isZeroData === 'boolean') return profile.isZeroData;
  return (
    profile.email === 'cadet@univ.edu' ||
    profile.role === 'OPERATOR STANDBY' ||
    profile.level === 1
  );
};

export async function loadScheduleDaysFromSupabase(): Promise<DaySchedule[]> {
  const profileId = await ensureProfileId();
  const days = await fetchScheduleDays(profileId);
  const result: DaySchedule[] = [];
  for (const day of days) {
    const items = await fetchScheduleItems(day.id);
    result.push({
      dayName: day.day_name,
      dateNumber: day.date_number,
      isToday: day.is_today,
      totalHours: day.total_hours,
      completedHours: day.completed_hours,
      lecturesCount: day.lectures_count,
      labsCount: day.labs_count,
      transitMins: day.transit_mins,
      items: items.map((item) => ({
        id: item.id,
        time: item.time,
        title: item.title,
        subtitle: item.subtitle,
        location: item.location,
        badge: item.badge,
        badgeType: item.badge_type as 'active' | 'upcoming' | 'urgent' | undefined,
        attachedDoc: item.attached_doc as { name: string; description: string; syncedPercent: number } | undefined,
        preparationNote: item.preparation_note,
        isRequired: item.is_required,
      })),
      freeWindow: day.free_window as { time: string; duration: string; recommendation: string } | undefined,
    });
  }
  return result;
}

export async function saveScheduleDayWithItems(day: DaySchedule): Promise<void> {
  const profileId = await ensureProfileId();
  const existing = await fetchScheduleDays(profileId);
  const found = existing.find((d) => d.date_number === day.dateNumber);
  if (found) {
    await saveScheduleDay(profileId, {
      id: found.id,
      day_name: day.dayName,
      date_number: day.dateNumber,
      is_today: day.isToday,
      total_hours: day.totalHours,
      completed_hours: day.completedHours,
      lectures_count: day.lecturesCount,
      labs_count: day.labsCount,
      transit_mins: day.transitMins,
      free_window: day.freeWindow as Record<string, any>,
    });
    for (const item of day.items) {
      await saveScheduleItem(found.id, {
        id: item.id,
        time: item.time,
        title: item.title,
        subtitle: item.subtitle,
        location: item.location,
        badge: item.badge,
        badge_type: item.badgeType,
        attached_doc: item.attachedDoc as Record<string, any>,
        preparation_note: item.preparationNote,
        is_required: item.isRequired,
      });
    }
  } else {
    const saved = await saveScheduleDay(profileId, {
      day_name: day.dayName,
      date_number: day.dateNumber,
      is_today: day.isToday,
      total_hours: day.totalHours,
      completed_hours: day.completedHours,
      lectures_count: day.lecturesCount,
      labs_count: day.labsCount,
      transit_mins: day.transitMins,
      free_window: day.freeWindow as Record<string, any>,
    });
    for (const item of day.items) {
      await saveScheduleItem(saved.id, {
        time: item.time,
        title: item.title,
        subtitle: item.subtitle,
        location: item.location,
        badge: item.badge,
        badge_type: item.badgeType,
        attached_doc: item.attachedDoc as Record<string, any>,
        preparation_note: item.preparationNote,
        is_required: item.isRequired,
      });
    }
  }
}

export async function loadFlashcardsFromSupabase(): Promise<Flashcard[]> {
  const profileId = await ensureProfileId();
  const cards = await fetchFlashcards(profileId);
  return cards.map((card) => ({
    id: card.id,
    course: card.course,
    cardNumber: card.card_number,
    totalCards: card.total_cards,
    topic: card.topic,
    category: card.category,
    question: card.question,
    keyAspect: card.key_aspect,
    comparison: card.comparison as Flashcard['comparison'],
    explanation: card.explanation,
    retentionStability: card.retention_stability,
  }));
}

export async function saveFlashcardToSupabase(card: Flashcard): Promise<Flashcard> {
  const profileId = await ensureProfileId();
  const saved = await saveFlashcard(profileId, {
    id: card.id,
    course: card.course,
    card_number: card.cardNumber,
    total_cards: card.totalCards,
    topic: card.topic,
    category: card.category,
    question: card.question,
    key_aspect: card.keyAspect,
    comparison: card.comparison,
    explanation: card.explanation,
    retention_stability: card.retentionStability,
  });
  return {
    id: saved.id,
    course: saved.course,
    cardNumber: saved.card_number,
    totalCards: saved.total_cards,
    topic: saved.topic,
    category: saved.category,
    question: saved.question,
    keyAspect: saved.key_aspect,
    comparison: saved.comparison as Flashcard['comparison'],
    explanation: saved.explanation,
    retentionStability: saved.retention_stability,
  };
}

export async function loadDrillQuestionsFromSupabase(): Promise<DrillQuestion[]> {
  const profileId = await ensureProfileId();
  const questions = await fetchDrillQuestions(profileId);
  return questions.map((q) => ({
    id: Number(q.id),
    course: q.course,
    title: q.title,
    context: q.context,
    problem: q.problem,
    capacity: q.capacity,
    weights: q.weights,
    values: q.values,
    options: q.options as DrillQuestion['options'],
    selectedOptionId: q.selected_option_id,
    verifiedLabel: q.verified_label,
    matrix: q.matrix as DrillQuestion['matrix'],
    explanation: q.explanation,
  }));
}

export async function saveDrillQuestionToSupabase(question: DrillQuestion): Promise<DrillQuestion> {
  const profileId = await ensureProfileId();
  const saved = await saveDrillQuestion(profileId, {
    id: String(question.id),
    course: question.course,
    title: question.title,
    context: question.context,
    problem: question.problem,
    capacity: question.capacity,
    weights: question.weights,
    values: question.values,
    options: question.options,
    selected_option_id: question.selectedOptionId,
    verified_label: question.verifiedLabel,
    matrix: question.matrix,
    explanation: question.explanation,
  });
  return {
    id: Number(saved.id),
    course: saved.course,
    title: saved.title,
    context: saved.context,
    problem: saved.problem,
    capacity: saved.capacity,
    weights: saved.weights,
    values: saved.values,
    options: saved.options as DrillQuestion['options'],
    selectedOptionId: saved.selected_option_id,
    verifiedLabel: saved.verified_label,
    matrix: saved.matrix as DrillQuestion['matrix'],
    explanation: saved.explanation,
  };
}
