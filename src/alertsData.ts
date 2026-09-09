import { TacticalAlert } from './types';

export const INITIAL_TACTICAL_ALERTS: TacticalAlert[] = [
  {
    id: 'alert-cs312-ps3',
    type: 'DEADLINE',
    title: 'Problem Set 3: DP Recurrence Derivations',
    subtitle: 'Upload PDF proof & complexity analysis before Turing Lab begins',
    courseCode: 'CS312',
    dueDate: 'Today at 13:00',
    hoursRemaining: 4.25,
    severity: 'CRITICAL',
    actionScreen: 'SCHED',
    actionLabel: 'Inspect Timetable',
    timestamp: Date.now() - 1000 * 60 * 15,
    source: 'SCHEDULE',
  },
  {
    id: 'alert-cs301-exam',
    type: 'EXAM',
    title: 'CS301 Midterm: Operating Systems',
    subtitle: 'Virtual Memory, TLB Invalidation, Paging & Inode Architecture',
    courseCode: 'CS301',
    dueDate: 'Tomorrow at 09:00',
    hoursRemaining: 14.5,
    severity: 'CRITICAL',
    actionScreen: 'DRILL',
    actionLabel: 'Deploy To Drill',
    timestamp: Date.now() - 1000 * 60 * 45,
    source: 'SYSTEM',
  },
  {
    id: 'alert-cs301-lab4',
    type: 'LAB',
    title: 'Lab 4 Buffer Cache Implementation',
    subtitle: 'Commit & push C-code to Turing Git server before midnight',
    courseCode: 'CS301',
    dueDate: 'Tonight at 23:59',
    hoursRemaining: 8.75,
    severity: 'URGENT',
    actionScreen: 'AI-NET',
    actionLabel: 'Query AI-Net',
    timestamp: Date.now() - 1000 * 60 * 120,
    source: 'SCHEDULE',
  },
  {
    id: 'alert-ml-quiz3',
    type: 'QUIZ',
    title: 'Machine Learning Quiz 3',
    subtitle: 'Auditorium A • Backpropagation derivations & Attention Heads',
    courseCode: 'CS460',
    dueDate: 'Tomorrow at 14:00',
    hoursRemaining: 21.0,
    severity: 'WARNING',
    actionScreen: 'DECKS',
    actionLabel: 'Review Flashcards',
    timestamp: Date.now() - 1000 * 60 * 200,
    source: 'SYSTEM',
  },
  {
    id: 'alert-cs340-raft',
    type: 'DEADLINE',
    title: 'Distributed Raft Consensus Milestone',
    subtitle: 'Leader election heartbeat & log replication test suite',
    courseCode: 'CS340',
    dueDate: 'In 2 days at 18:00',
    hoursRemaining: 48.0,
    severity: 'INFO',
    actionScreen: 'SCHED',
    actionLabel: 'View Milestone',
    timestamp: Date.now() - 1000 * 60 * 300,
    source: 'SCHEDULE',
  },
];

export function isWithin24Hours(alert: TacticalAlert): boolean {
  return alert.hoursRemaining > 0 && alert.hoursRemaining <= 24;
}

export function formatRemainingHours(hours: number): string {
  if (hours <= 0) return 'OVERDUE';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}M REMAINING`;
  return `${h}H ${m.toString().padStart(2, '0')}M REMAINING`;
}

export function getCountdownTMinus(hours: number): string {
  if (hours <= 0) return 'T-MINUS 00:00 [DUE]';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `T-MINUS ${h.toString().padStart(2, '0')}H ${m.toString().padStart(2, '0')}M`;
}
