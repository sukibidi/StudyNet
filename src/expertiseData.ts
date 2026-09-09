import { SubjectTaken, GradeLetter, ExpertiseAnalysisSummary } from './types';

export const GRADE_PROFICIENCY_MAP: Record<GradeLetter, number> = {
  'A+': 98,
  'A': 92,
  'A-': 86,
  'B+': 80,
  'B': 74,
  'B-': 68,
  'C+': 62,
  'C': 55,
  'D': 45,
  'F': 25,
};

export const GRADE_MEMORY_RETENTION_MAP: Record<GradeLetter, number> = {
  'A+': 94,
  'A': 88,
  'A-': 82,
  'B+': 72,
  'B': 64,
  'B-': 56,
  'C+': 48,
  'C': 40,
  'D': 30,
  'F': 15,
};

// Default subjects taken by student (Multimedia with A+ featured front-and-center)
export const INITIAL_SUBJECTS_TAKEN: SubjectTaken[] = [
  {
    id: 'subj-multimedia',
    name: 'Multimedia Systems & Computing',
    code: 'MM201',
    grade: 'A+',
    term: 'Semester 3',
    credits: 4,
    areaOfExpertise: 'Multimedia & Digital Signal Architecture',
    proficiencyPercent: 98,
    memoryRetentionPercent: 95,
    keyStrengths: [
      'Video codec pipelines (H.265 / AV1 bitstream analysis)',
      'WebGL shader mathematics & 3D raymarching',
      'Lossless entropy encoding & Fourier transforms',
      'Spatial 3D audio rendering & psychoacoustics',
    ],
    cognitiveNotes:
      'Dominant high-mastery axis. Grade A+ indicates elite synthesis of creative digital media engineering and high-performance pipeline architecture.',
  },
  {
    id: 'subj-os',
    name: 'Operating Systems & Virtual Memory',
    code: 'CS301',
    grade: 'A',
    term: 'Semester 4',
    credits: 4,
    areaOfExpertise: 'Kernel Architecture & Memory Systems',
    proficiencyPercent: 92,
    memoryRetentionPercent: 88,
    keyStrengths: [
      'Multi-level virtual memory paging & TLB cache',
      'Preemptive thread scheduling & synchronization primitives',
      'Copy-on-write page fault handlers',
    ],
    cognitiveNotes:
      'Solid operational foundation. Memory retention remains high across paging mechanics.',
  },
  {
    id: 'subj-algo',
    name: 'Algorithm Design & Complexity',
    code: 'CS312',
    grade: 'B+',
    term: 'Semester 4',
    credits: 4,
    areaOfExpertise: 'Dynamic Programming & Graph Optimizations',
    proficiencyPercent: 80,
    memoryRetentionPercent: 70,
    keyStrengths: [
      'Asymptotic Big-O verification & master theorem',
      'Greedy graph traversal & minimum spanning trees',
    ],
    cognitiveNotes:
      'Moderate memory decay in 2D memoization transitions. Targeted drills recommended before exams.',
  },
  {
    id: 'subj-networks',
    name: 'Computer Networks & Distributed Systems',
    code: 'CS340',
    grade: 'A-',
    term: 'Semester 4',
    credits: 3,
    areaOfExpertise: 'Distributed Protocols & Network Concurrency',
    proficiencyPercent: 86,
    memoryRetentionPercent: 82,
    keyStrengths: [
      'Raft consensus protocol state machines',
      'TCP congestion control & sliding window buffers',
      'Non-blocking async socket I/O multiplexing',
    ],
    cognitiveNotes:
      'High proficiency in consensus mechanics. Spaced repetition maintains stability.',
  },
  {
    id: 'subj-db',
    name: 'Database Architecture & Query Engines',
    code: 'CS320',
    grade: 'A',
    term: 'Semester 3',
    credits: 3,
    areaOfExpertise: 'Relational Engines & B-Tree Storage',
    proficiencyPercent: 90,
    memoryRetentionPercent: 85,
    keyStrengths: [
      'B+ tree index node splitting & range scans',
      'Write-Ahead Logging (WAL) & ACID durability guarantees',
      'Query plan optimization & relational algebra equivalence',
    ],
    cognitiveNotes:
      'Strong theoretical mastery. Stable long-term memory trace.',
  },
];

export function deriveAreaOfExpertise(subjectName: string, grade: GradeLetter): string {
  const lower = subjectName.toLowerCase();
  let domain = 'Specialized Technical Systems';

  if (lower.includes('multimedia') || lower.includes('media') || lower.includes('audio') || lower.includes('graphics') || lower.includes('video')) {
    domain = 'Multimedia & Digital Signal Architecture';
  } else if (lower.includes('os') || lower.includes('operating') || lower.includes('kernel') || lower.includes('memory')) {
    domain = 'Kernel Architecture & Memory Systems';
  } else if (lower.includes('algo') || lower.includes('data struct') || lower.includes('dynamic prog')) {
    domain = 'Dynamic Programming & Algorithmic Design';
  } else if (lower.includes('net') || lower.includes('distrib') || lower.includes('cloud') || lower.includes('consensus')) {
    domain = 'Distributed Protocols & Network Concurrency';
  } else if (lower.includes('db') || lower.includes('data') || lower.includes('sql') || lower.includes('relational')) {
    domain = 'Relational Engines & Storage Systems';
  } else if (lower.includes('ai') || lower.includes('machine learn') || lower.includes('neural') || lower.includes('deep learn')) {
    domain = 'Artificial Intelligence & Neural Architectures';
  } else if (lower.includes('sec') || lower.includes('crypto') || lower.includes('cyber')) {
    domain = 'Applied Cryptography & Security Protocols';
  } else if (lower.includes('math') || lower.includes('linear') || lower.includes('calc') || lower.includes('prob')) {
    domain = 'Mathematical Modeling & Discrete Analysis';
  }

  return domain;
}

export function generateKeyStrengthsForSubject(subjectName: string, grade: GradeLetter): string[] {
  const lower = subjectName.toLowerCase();
  const isHigh = grade === 'A+' || grade === 'A' || grade === 'A-';

  if (lower.includes('multimedia') || lower.includes('media')) {
    return [
      isHigh ? 'Elite proficiency in video encoding (AV1/H.265)' : 'Core understanding of digital media pipelines',
      'WebGL rendering pipelines & GPU shader passes',
      'Psychoacoustic lossy compression & FFT filtering',
    ];
  }

  if (lower.includes('os') || lower.includes('operating')) {
    return [
      'Multi-level paging & page directory bit math',
      'Kernel thread synchronization & deadlock avoidance',
      'TLB miss traps & cache coherence protocols',
    ];
  }

  return [
    `Formal mastery of ${subjectName} principles`,
    'Core analytical problem formulation & verification',
    'Practical lab implementation & metric profiling',
  ];
}

export function computeExpertiseSummary(subjects: SubjectTaken[]): ExpertiseAnalysisSummary {
  if (subjects.length === 0) {
    return {
      dominantDomain: 'Uncalibrated (No Subjects Ingested)',
      averageProficiency: 0,
      averageMemoryRetention: 0,
      cognitiveRetentionHealth: 'CRITICAL_REVIEW_NEEDED',
      recommendations: ['Input your taken courses and grades to calibrate cognitive radar.'],
    };
  }

  const avgProf = Math.round(
    subjects.reduce((sum, s) => sum + s.proficiencyPercent, 0) / subjects.length
  );
  const avgMem = Math.round(
    subjects.reduce((sum, s) => sum + s.memoryRetentionPercent, 0) / subjects.length
  );

  // Dominant domain is highest proficiency
  const sorted = [...subjects].sort((a, b) => b.proficiencyPercent - a.proficiencyPercent);
  const dominant = `${sorted[0].name} (${sorted[0].grade}) — ${sorted[0].areaOfExpertise}`;

  // Retention health
  let health: 'OPTIMAL' | 'MODERATE_DECAY' | 'CRITICAL_REVIEW_NEEDED' = 'OPTIMAL';
  if (avgMem < 70) {
    health = 'CRITICAL_REVIEW_NEEDED';
  } else if (avgMem < 82) {
    health = 'MODERATE_DECAY';
  }

  // Recommendations
  const lowestMem = [...subjects].sort((a, b) => a.memoryRetentionPercent - b.memoryRetentionPercent)[0];
  const recs: string[] = [];
  recs.push(`Dominant area of expertise confirmed in ${sorted[0].name} with ${sorted[0].grade} grade (${sorted[0].proficiencyPercent}% proficiency).`);
  if (lowestMem && lowestMem.memoryRetentionPercent < 75) {
    recs.push(`Memory decay detected in ${lowestMem.name} (${lowestMem.memoryRetentionPercent}% retention). Prioritize active recall flashcard drills.`);
  } else {
    recs.push(`Cognitive memory retention is stable at ${avgMem}%. Spaced repetition interval running smoothly.`);
  }

  return {
    dominantDomain: dominant,
    averageProficiency: avgProf,
    averageMemoryRetention: avgMem,
    cognitiveRetentionHealth: health,
    recommendations: recs,
  };
}
