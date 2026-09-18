import { DaySchedule, DrillQuestion, Flashcard, OperatorProfile } from './types';
import { fetchScheduleDays, fetchScheduleItems, saveScheduleDay, saveScheduleItem, fetchFlashcards, saveFlashcard, fetchDrillQuestions, saveDrillQuestion, ensureProfileId, isGuestMode } from './lib/api';

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

export const isProfileZeroData = (profile?: OperatorProfile | null): boolean => {
  if (!profile) return false;
  return profile.isZeroData === true;
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
  if (isGuestMode()) {
    const saved = localStorage.getItem('studynet_flashcards');
    return saved ? JSON.parse(saved) as Flashcard[] : [];
  }
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
  if (isGuestMode()) {
    const saved = JSON.parse(localStorage.getItem('studynet_flashcards') || '[]') as Flashcard[];
    localStorage.setItem('studynet_flashcards', JSON.stringify([card, ...saved.filter((savedCard) => savedCard.id !== card.id)]));
    return card;
  }
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
