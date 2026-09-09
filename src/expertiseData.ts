import { SubjectTaken, GradeLetter, ExpertiseAnalysisSummary } from './types';
import { fetchSubjects, saveSubject } from './lib/api';

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

export async function loadSubjectsFromSupabase(): Promise<SubjectTaken[]> {
  const profileId = (await import('./lib/api')).ensureProfileId();
  const subjects = await fetchSubjects(await profileId);
  return subjects.map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    grade: s.grade as GradeLetter,
    term: s.term,
    credits: s.credits,
    areaOfExpertise: s.area_of_expertise,
    proficiencyPercent: s.proficiency_percent,
    memoryRetentionPercent: s.memory_retention_percent,
    keyStrengths: s.key_strengths,
    cognitiveNotes: s.cognitive_notes,
    aiInsight: s.ai_insight as SubjectTaken['aiInsight'],
  }));
}

export async function saveSubjectToSupabase(subject: SubjectTaken): Promise<SubjectTaken> {
  const profileId = await (await import('./lib/api')).ensureProfileId();
  const saved = await saveSubject(await profileId, {
    id: subject.id,
    name: subject.name,
    code: subject.code,
    grade: subject.grade,
    term: subject.term,
    credits: subject.credits,
    area_of_expertise: subject.areaOfExpertise,
    proficiency_percent: subject.proficiencyPercent,
    memory_retention_percent: subject.memoryRetentionPercent,
    key_strengths: subject.keyStrengths,
    cognitive_notes: subject.cognitiveNotes,
    ai_insight: subject.aiInsight,
  });
  return {
    id: saved.id,
    name: saved.name,
    code: saved.code,
    grade: saved.grade as GradeLetter,
    term: saved.term,
    credits: saved.credits,
    areaOfExpertise: saved.area_of_expertise,
    proficiencyPercent: saved.proficiency_percent,
    memoryRetentionPercent: saved.memory_retention_percent,
    keyStrengths: saved.key_strengths,
    cognitiveNotes: saved.cognitive_notes,
    aiInsight: saved.ai_insight as SubjectTaken['aiInsight'],
  };
}

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

  const sorted = [...subjects].sort((a, b) => b.proficiencyPercent - a.proficiencyPercent);
  const dominant = `${sorted[0].name} (${sorted[0].grade}) — ${sorted[0].areaOfExpertise}`;

  let health: 'OPTIMAL' | 'MODERATE_DECAY' | 'CRITICAL_REVIEW_NEEDED' = 'OPTIMAL';
  if (avgMem < 70) {
    health = 'CRITICAL_REVIEW_NEEDED';
  } else if (avgMem < 82) {
    health = 'MODERATE_DECAY';
  }

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
