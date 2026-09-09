import { DaySchedule, DrillQuestion, Flashcard, OperatorProfile } from './types';

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

export const CGPA_HISTORY = [
  { semester: 'Sem 1', gpa: 3.65 },
  { semester: 'Sem 2', gpa: 3.71 },
  { semester: 'Sem 3', gpa: 3.79 },
  { semester: 'Sem 4', gpa: 3.84 },
];

export const RADAR_ATTRIBUTES = [
  { axis: 'CONCURRENCY', value: 92, maxValue: 100 },
  { axis: 'MEMORY', value: 88, maxValue: 100 },
  { axis: 'DP', value: 42, maxValue: 100, isDeficit: true },
  { axis: 'QUERIES', value: 78, maxValue: 100 },
  { axis: 'PROB', value: 51, maxValue: 100 },
  { axis: 'GRAPH', value: 85, maxValue: 100 },
];

export const INITIAL_SCHEDULE_DAYS: DaySchedule[] = [
  {
    dayName: 'MON',
    dateNumber: 21,
    totalHours: 3.5,
    completedHours: 3.5,
    lecturesCount: 2,
    labsCount: 0,
    transitMins: 15,
    items: [
      {
        id: 'mon-1',
        time: '09:00 — 10:30',
        title: 'CS280: Discrete Mathematics',
        location: 'Hall A',
        badge: 'Completed',
      },
    ],
  },
  {
    dayName: 'TUE',
    dateNumber: 22,
    totalHours: 4.0,
    completedHours: 4.0,
    lecturesCount: 1,
    labsCount: 2,
    transitMins: 20,
    items: [
      {
        id: 'tue-1',
        time: '11:00 — 13:00',
        title: 'CS312: Algorithm Lab',
        location: 'Turing Lab 2',
        badge: 'Completed',
      },
    ],
  },
  {
    dayName: 'WED',
    dateNumber: 23,
    isToday: true,
    totalHours: 4.5,
    completedHours: 2.5,
    lecturesCount: 2,
    labsCount: 1,
    transitMins: 25,
    items: [
      {
        id: 'wed-1',
        time: '10:00 — 11:30',
        title: 'CS301: Operating Systems',
        subtitle: 'Virtual Memory Architectures, Paging & TLB Invalidation',
        location: 'Hall B, West Wing',
        badge: 'In 20 min',
        badgeType: 'active',
        attachedDoc: {
          name: 'Slide_08_Virtual_Mem.pdf',
          description: 'Virtual Memory & TLB Invalidation',
          syncedPercent: 100,
        },
      },
      {
        id: 'wed-2',
        time: '13:00 — 14:30',
        title: 'CS312: Algorithm Design & Complexity',
        location: 'Turing Lab 3',
        badge: 'Upcoming',
        badgeType: 'upcoming',
        preparationNote: 'Bring Problem Set 3 Solutions',
        isRequired: true,
      },
      {
        id: 'wed-3',
        time: '15:00 — 16:30',
        title: 'CS340: Distributed Systems',
        subtitle: 'Raft Consensus Protocol',
        location: 'Seminar Room 4',
        badge: 'Upcoming',
        badgeType: 'upcoming',
      },
    ],
    freeWindow: {
      time: '11:30 — 13:00',
      duration: '90m Free Window',
      recommendation: '30m Dynamic Programming drill recommended before algorithm lab.',
    },
  },
  {
    dayName: 'THU',
    dateNumber: 24,
    totalHours: 3.0,
    completedHours: 0,
    lecturesCount: 1,
    labsCount: 1,
    transitMins: 20,
    items: [
      {
        id: 'thu-1',
        time: '14:00 — 15:30',
        title: 'CS320: Database Systems',
        location: 'Hall C',
        badge: 'Upcoming',
      },
    ],
  },
  {
    dayName: 'FRI',
    dateNumber: 25,
    totalHours: 5.0,
    completedHours: 0,
    lecturesCount: 2,
    labsCount: 1,
    transitMins: 30,
    items: [
      {
        id: 'fri-1',
        time: '09:00 — 10:30',
        title: 'Machine Learning Quiz 3',
        subtitle: 'Backprop derivations & Attention Heads',
        location: 'Auditorium A',
        badge: 'Exam',
        badgeType: 'urgent',
      },
    ],
  },
  {
    dayName: 'SAT',
    dateNumber: 26,
    totalHours: 2.0,
    completedHours: 0,
    lecturesCount: 0,
    labsCount: 0,
    transitMins: 0,
    items: [
      {
        id: 'sat-1',
        time: '10:00 — 12:00',
        title: 'Study Squad: DP & Graph Repertoire',
        location: 'Library Annex 4B',
        badge: 'Peer Session',
      },
    ],
  },
];

export const FLASHCARDS_DECK: Flashcard[] = [
  {
    id: 'card-14',
    course: 'CS301 OPERATING SYSTEMS',
    cardNumber: 14,
    totalCards: 32,
    topic: 'Virtual Memory & Paging',
    category: 'Memory Management',
    question: 'What is the primary trade-off between Inverted Page Tables and Multi-Level Hierarchical Paging?',
    keyAspect: 'Physical memory overhead vs. translation lookup speed and TLB miss penalties.',
    comparison: {
      leftTitle: 'INVERTED TABLE',
      leftValue: 'Fixed RAM Footprint',
      leftSub: 'Bound by physical RAM frames',
      rightTitle: 'HIERARCHICAL',
      rightValue: 'Multi-Access Latency',
      rightSub: 'Memory page walks (CR3 depth)',
    },
    explanation: 'Inverted page tables allocate one entry per frame in physical memory rather than per virtual page, drastically lowering RAM consumption for large 64-bit addresses. However, linear search or hash bucket collisions necessitate extra memory lookups upon TLB misses compared to indexed hierarchical page directories.',
    retentionStability: 68,
  },
  {
    id: 'card-15',
    course: 'CS301 OPERATING SYSTEMS',
    cardNumber: 15,
    totalCards: 32,
    topic: 'TLB Shootdown Protocol',
    category: 'Concurrency & SMP',
    question: 'Why is an inter-processor interrupt (IPI) required during a multi-core TLB Shootdown?',
    keyAspect: 'Cache coherency across distributed hardware TLBs on shared address spaces.',
    comparison: {
      leftTitle: 'SINGLE CORE',
      leftValue: 'Local INVLPG',
      leftSub: 'Single instruction cycle flush',
      rightTitle: 'SMP MULTI-CORE',
      rightValue: 'IPI Synchronization',
      rightSub: 'Stalls cores until acknowledge',
    },
    explanation: 'When modifying page table entries (PTE) that may be cached across other CPU cores, the modifying CPU must broadcast an IPI to invalidate stale translations in each core’s local TLB before freeing or remapping memory.',
    retentionStability: 82,
  },
  {
    id: 'card-16',
    course: 'CS312 ALGORITHM DESIGN',
    cardNumber: 16,
    totalCards: 32,
    topic: '0/1 Knapsack vs Unbounded Knapsack',
    category: 'Dynamic Programming',
    question: 'How does the state transition recurrence distinguish between 0/1 and Unbounded Knapsack?',
    keyAspect: 'Reference index in the DP table: prior row (i - 1) versus current row (i).',
    comparison: {
      leftTitle: '0/1 KNAPSACK',
      leftValue: 'dp[i-1][w - w[i]]',
      leftSub: 'Prevents multiple item inclusions',
      rightTitle: 'UNBOUNDED',
      rightValue: 'dp[i][w - w[i]]',
      rightSub: 'Allows infinite re-sampling of item i',
    },
    explanation: '0/1 Knapsack samples the subproblem without the current item (row i-1), ensuring each item is used at most once. Unbounded Knapsack re-samples the current row (row i) with reduced capacity, permitting infinite inclusion.',
    retentionStability: 42,
  },
];

export const DRILL_QUESTIONS: DrillQuestion[] = [
  {
    id: 2,
    course: 'CS312 Algorithm Design',
    title: '0/1 Knapsack State Space Optimization',
    context: 'Dynamic Programming • Memoization | 58% Past Fail Rate',
    problem: 'Given a discrete set of items with weights W = [2, 3, 4, 5] and values V = [3, 4, 5, 6], with maximum sack capacity C = 5. What is the optimal subproblem recurrence relation for computing dp[i][w]?',
    capacity: 'C = 5',
    weights: '[2, 3, 4, 5]',
    values: '[3, 4, 5, 6]',
    options: [
      {
        id: 'opt-a',
        formula: 'dp[i][w] = max(dp[i-1][w], dp[i-1][w - w[i]] + v[i])',
        description: 'Include or exclude item i using previous item states (i-1)',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        formula: 'dp[i][w] = dp[i-1][w] + dp[i][w - w[i]]',
        description: 'Additive branch without bounds optimization',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        formula: 'dp[i][w] = max(dp[i][w-1], dp[i-1][w])',
        description: 'LCS recurrence omitting item weights and values',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        formula: 'dp[i][w] = min(dp[i-1][w], v[i] * w)',
        description: 'Minimization heuristic for greedy bounds',
        isCorrect: false,
      },
    ],
    selectedOptionId: 'opt-a',
    verifiedLabel: 'Optimal Recurrence Verified',
    matrix: {
      capacities: [0, 1, 2, 3, 4, 5],
      rows: [
        {
          label: 'i=0',
          cells: [
            { val: 0 },
            { val: 0 },
            { val: 3 },
            { val: 3 },
            { val: 3 },
            { val: 3 },
          ],
        },
        {
          label: 'i=1',
          cells: [
            { val: 0 },
            { val: 0 },
            { val: 3 },
            { val: 4 },
            { val: 4 },
            { val: 7, highlight: true },
          ],
        },
        {
          label: 'i=2',
          cells: [
            { val: 0 },
            { val: 0 },
            { val: 3 },
            { val: 4 },
            { val: 5 },
            { val: 7, highlight: true },
          ],
        },
      ],
    },
    explanation: '0/1 Knapsack strictly samples from prior row index i - 1 when factoring chosen item value. Using current row i enables reuse, turning it into Unbounded Knapsack.',
  },
  {
    id: 3,
    course: 'CS312 Algorithm Design',
    title: 'Longest Common Subsequence (LCS) State Transitions',
    context: 'String Recurrence • 2D Dynamic Programming',
    problem: 'Given two sequences X[1..m] and Y[1..n], what is the recurrence relation when X[i] == Y[j] vs when X[i] != Y[j]?',
    capacity: 'O(m × n)',
    weights: 'Characters X[i], Y[j]',
    values: 'Length count',
    options: [
      {
        id: 'opt-lcs-a',
        formula: 'if X[i]==Y[j]: dp[i-1][j-1]+1; else max(dp[i-1][j], dp[i][j-1])',
        description: 'Extend diagonal match by 1; take max of adjacent predecessors otherwise',
        isCorrect: true,
      },
      {
        id: 'opt-lcs-b',
        formula: 'dp[i][j] = dp[i-1][j-1] + (X[i] == Y[j] ? 1 : 0)',
        description: 'Single diagonal transition without branch pruning',
        isCorrect: false,
      },
    ],
    selectedOptionId: 'opt-lcs-a',
    verifiedLabel: 'Diagonal Subproblem Proved',
    matrix: {
      capacities: [0, 1, 2, 3, 4],
      rows: [
        {
          label: 'j=0',
          cells: [{ val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }],
        },
        {
          label: 'j=1',
          cells: [{ val: 0 }, { val: 1, highlight: true }, { val: 1 }, { val: 1 }, { val: 1 }],
        },
      ],
    },
    explanation: 'When characters match, the optimal prefix is extended unconditionally by 1 from dp[i-1][j-1]. When disjoint, the subproblem inherits the best of either eliminating X[i] or Y[j].',
  },
];
