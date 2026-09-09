import React, { useState } from 'react';
import { SubjectTaken } from '../types';
import { playTacticalChirp } from '../utils/audio';

interface SubjectSlideVaultProps {
  subjects: SubjectTaken[];
  onAddSubject: () => void;
  onEditSubject: (subject: SubjectTaken) => void;
  onDeleteSubject: (id: string) => void;
  onUpdateSubject: (updated: SubjectTaken) => void;
  onRunBatchAiAnalysis: () => void;
  isBatchAnalyzing: boolean;
  onStartDrill?: () => void;
}

export const SubjectSlideVault: React.FC<SubjectSlideVaultProps> = ({
  subjects,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  onUpdateSubject,
  onRunBatchAiAnalysis,
  isBatchAnalyzing,
  onStartDrill,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [analyzingSubjectId, setAnalyzingSubjectId] = useState<string | null>(null);
  const [inspectExpanded, setInspectExpanded] = useState(true);

  // Guard active index when subjects array changes
  const clampedIndex = subjects.length === 0 ? 0 : Math.min(activeSlideIndex, subjects.length - 1);
  const currentSubject = subjects[clampedIndex] as SubjectTaken | undefined;

  const handlePrev = () => {
    if (subjects.length <= 1) return;
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : subjects.length - 1));
    playTacticalChirp(520, 0.05);
  };

  const handleNext = () => {
    if (subjects.length <= 1) return;
    setActiveSlideIndex((prev) => (prev < subjects.length - 1 ? prev + 1 : 0));
    playTacticalChirp(740, 0.05);
  };

  const handleSelectSlide = (idx: number) => {
    setActiveSlideIndex(idx);
    playTacticalChirp(660, 0.05);
  };

  // Deep AI Analysis for the current active vault subject
  const handleAnalyzeCurrentSubject = async (subject: SubjectTaken) => {
    setAnalyzingSubjectId(subject.id);
    playTacticalChirp(880, 0.08);

    try {
      const res = await fetch('/api/analyze-vault-subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated: SubjectTaken = {
          ...subject,
          areaOfExpertise: data.areaOfExpertise || subject.areaOfExpertise,
          proficiencyPercent: data.proficiencyPercent ?? subject.proficiencyPercent,
          memoryRetentionPercent: data.memoryRetentionPercent ?? subject.memoryRetentionPercent,
          aiInsight: data.aiInsight,
        };
        onUpdateSubject(updated);
        playTacticalChirp(1040, 0.12);
      }
    } catch (err) {
      console.warn('Individual subject AI analysis fallback:', err);
    } finally {
      setAnalyzingSubjectId(null);
    }
  };

  const getGradeBadgeStyle = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'bg-[#ffb000]/15 text-[#ffb000] border-[#ffb000]/40 shadow-[0_0_12px_rgba(255,176,0,0.25)]';
      case 'A':
      case 'A-':
        return 'bg-[#00e599]/15 text-[#00e599] border-[#00e599]/40 shadow-[0_0_10px_rgba(0,229,153,0.2)]';
      case 'B+':
      case 'B':
        return 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/40';
      case 'B-':
      case 'C+':
      case 'C':
        return 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/40';
      default:
        return 'bg-[#ff3344]/15 text-[#ff3344] border-[#ff3344]/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. VAULT CONTROLLER & HUD TELEMETRY HEADER */}
      <div className="bg-[#10141a] rounded-2xl p-4 sm:p-5 border border-[rgba(255,255,255,0.07)] space-y-3.5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ff3344]/15 border border-[#ff3344]/30 flex items-center justify-center text-[#ff3344] shrink-0">
              <span className="material-symbols-outlined text-lg sm:text-xl">view_carousel</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold font-heading text-white tracking-wide uppercase">
                  Subject Slide Vault
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#161b22] text-[#8b949e] border border-[#21262d]">
                  {subjects.length} / 8 STORED
                </span>
              </div>
              <p className="text-[11px] font-mono-code text-[#8b949e]">
                Slide between taken subjects, put new courses, and run deep AI cognitive analysis
              </p>
            </div>
          </div>

          {/* Quick Vault Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
            <button
              onClick={onAddSubject}
              className="py-1.5 px-3 rounded-xl bg-[#ff3344] hover:bg-[#e62637] text-white text-xs font-mono-code font-bold uppercase transition-all shadow-[0_0_10px_rgba(255,51,68,0.25)] flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-xs">add_box</span>
              <span>+ Put Subject in Vault</span>
            </button>

            <button
              onClick={onRunBatchAiAnalysis}
              disabled={isBatchAnalyzing || subjects.length === 0}
              className="py-1.5 px-3 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#21262d] hover:border-[#ff3344]/40 text-xs font-mono-code text-[#c9d1d9] hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <span
                className={`material-symbols-outlined text-xs text-[#ff3344] ${
                  isBatchAnalyzing ? 'animate-spin' : ''
                }`}
              >
                {isBatchAnalyzing ? 'sync' : 'auto_awesome'}
              </span>
              <span>{isBatchAnalyzing ? 'Calibrating...' : 'Full Vault AI'}</span>
            </button>
          </div>
        </div>

        {/* Slide Vault Thumbnail Tabs (Quick Subject Jumper) */}
        {subjects.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
            <span className="text-[10px] font-mono-code text-[#8b949e] uppercase font-bold shrink-0 mr-1">
              Vault Rail:
            </span>
            {subjects.map((s, idx) => {
              const isSelected = idx === clampedIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSlide(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-code border transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#ff3344]/15 border-[#ff3344] text-white shadow-[0_0_8px_rgba(255,51,68,0.25)]'
                      : 'bg-[#161b22] border-[#21262d] text-[#8b949e] hover:text-white hover:border-[#30363d]'
                  }`}
                >
                  <span className="font-bold">{s.code}</span>
                  <span className="text-[10px] opacity-75">({s.grade})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. ACTIVE SLIDE VAULT CARD CAROUSEL */}
      {subjects.length === 0 ? (
        <div className="bg-[#10141a] rounded-2xl p-8 border border-dashed border-[#21262d] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#161b22] border border-[#21262d] flex items-center justify-center text-[#8b949e] mx-auto">
            <span className="material-symbols-outlined text-2xl">folder_off</span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white">Subject Vault Empty</h3>
            <p className="text-xs font-mono-code text-[#8b949e] max-w-sm mx-auto mt-1">
              Put your taken courses and grades (e.g. Multimedia with A+) into the vault for AI cognitive analysis.
            </p>
          </div>
          <button
            onClick={onAddSubject}
            className="py-2 px-4 rounded-xl bg-[#ff3344] hover:bg-[#e62637] text-white text-xs font-mono-code font-bold uppercase transition-all shadow-[0_0_12px_rgba(255,51,68,0.3)] inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>+ Put First Subject in Vault</span>
          </button>
        </div>
      ) : currentSubject ? (
        <div className="relative group">
          {/* Main Vault Sliding Pod */}
          <div className="bg-[#10141a] rounded-2xl border border-[#21262d] p-4 sm:p-6 space-y-5 shadow-lg relative overflow-hidden transition-all duration-300">
            {/* Ambient Background Accent Glow */}
            <div className="absolute top-0 right-0 w-64 h-32 bg-[#ff3344]/5 blur-3xl pointer-events-none" />

            {/* Slide Navigation Header Bar */}
            <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse" />
                <span className="text-[11px] font-mono-code text-[#8b949e] uppercase font-bold tracking-wider">
                  VAULT CHAMBER [0{clampedIndex + 1} / 0{subjects.length}]
                </span>
              </div>

              {/* Prev / Next Slide Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-lg bg-[#161b22] hover:bg-[#21262d] border border-[#21262d] text-[#8b949e] hover:text-white flex items-center justify-center transition-all active:scale-90"
                  title="Previous Subject"
                >
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-lg bg-[#161b22] hover:bg-[#21262d] border border-[#21262d] text-[#8b949e] hover:text-white flex items-center justify-center transition-all active:scale-90"
                  title="Next Subject"
                >
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Subject Title & Grade Presentation */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#161b22] text-[#ff3344] border border-[#ff3344]/30 uppercase">
                    {currentSubject.code}
                  </span>
                  <span className="text-xs font-mono-code text-[#8b949e]">
                    {currentSubject.term || 'Semester 1'} • {currentSubject.credits || 4} Credits
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                  {currentSubject.name}
                </h3>
                <p className="text-xs font-mono-code text-[#00e599] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>Calibrated Domain: {currentSubject.areaOfExpertise}</span>
                </p>
              </div>

              {/* Achieved Grade Big Pill */}
              <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                <div
                  className={`px-3 py-1.5 rounded-xl border text-center font-mono-code font-bold text-sm tracking-wide ${getGradeBadgeStyle(
                    currentSubject.grade
                  )}`}
                >
                  <span className="text-[10px] block opacity-75 uppercase">GRADE</span>
                  <span className="text-base font-bold">{currentSubject.grade}</span>
                </div>
              </div>
            </div>

            {/* Dual Telemetry Meters: Memory Retention & Expertise Mastery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Telemetry 1: Memory Retention */}
              <div className="bg-[#161b22] rounded-xl p-3.5 border border-[#21262d] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="text-[#8b949e] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-[#00e599]">psychology</span>
                    <span>Memory Retention</span>
                  </span>
                  <span className="text-[#00e599] font-bold">
                    {currentSubject.memoryRetentionPercent}%
                  </span>
                </div>
                <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#00e599] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,229,153,0.4)]"
                    style={{ width: `${currentSubject.memoryRetentionPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono-code text-[#8b949e]">
                  <span>Decay Interval: Active</span>
                  <span>{currentSubject.memoryRetentionPercent >= 75 ? 'Stable' : 'Needs Review'}</span>
                </div>
              </div>

              {/* Telemetry 2: Domain Proficiency */}
              <div className="bg-[#161b22] rounded-xl p-3.5 border border-[#21262d] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="text-[#8b949e] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-[#ff3344]">radar</span>
                    <span>Expertise Proficiency</span>
                  </span>
                  <span className="text-[#ff3344] font-bold">
                    {currentSubject.proficiencyPercent}%
                  </span>
                </div>
                <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#ff3344] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,51,68,0.4)]"
                    style={{ width: `${currentSubject.proficiencyPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono-code text-[#8b949e]">
                  <span>Based on Grade: {currentSubject.grade}</span>
                  <span>{currentSubject.proficiencyPercent >= 85 ? 'High Mastery' : 'Moderate'}</span>
                </div>
              </div>
            </div>

            {/* Subject Key Strengths Badges */}
            {currentSubject.keyStrengths && currentSubject.keyStrengths.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono-code text-[#8b949e] uppercase font-bold">
                  Ingested Knowledge Pillars:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentSubject.keyStrengths.map((str, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#161b22] text-[#c9d1d9] border border-[#21262d] text-xs font-mono-code"
                    >
                      {str}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 3. VAULT ACTION DECK (Analyse with AI, Edit, Eject) */}
            <div className="pt-2 border-t border-[#21262d] flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAnalyzeCurrentSubject(currentSubject)}
                  disabled={analyzingSubjectId === currentSubject.id}
                  className="py-2 px-4 rounded-xl bg-[#ff3344] hover:bg-[#e62637] text-white text-xs font-mono-code font-bold uppercase transition-all shadow-[0_0_12px_rgba(255,51,68,0.3)] flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  <span
                    className={`material-symbols-outlined text-sm ${
                      analyzingSubjectId === currentSubject.id ? 'animate-spin' : ''
                    }`}
                  >
                    {analyzingSubjectId === currentSubject.id ? 'sync' : 'neurology'}
                  </span>
                  <span>
                    {analyzingSubjectId === currentSubject.id
                      ? 'Analyzing...'
                      : 'Analyse with AI'}
                  </span>
                </button>

                <button
                  onClick={() => setInspectExpanded(!inspectExpanded)}
                  className="py-2 px-3 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#21262d] text-xs font-mono-code text-[#c9d1d9] hover:text-white transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm text-[#38bdf8]">
                    {inspectExpanded ? 'expand_less' : 'analytics'}
                  </span>
                  <span>{inspectExpanded ? 'Hide AI Telemetry' : 'Show AI Telemetry'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEditSubject(currentSubject)}
                  className="p-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#21262d] text-[#8b949e] hover:text-white transition-colors"
                  title="Edit Subject Dossier"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button
                  onClick={() => onDeleteSubject(currentSubject.id)}
                  className="p-2 rounded-xl bg-[#161b22] hover:bg-[#ff3344]/15 border border-[#21262d] hover:border-[#ff3344]/40 text-[#8b949e] hover:text-[#ff3344] transition-colors"
                  title="Eject Subject from Vault"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>

            {/* 4. DEEP AI TELEMETRY INSPECTOR (Expandable or always visible) */}
            {inspectExpanded && (
              <div className="bg-[#0d1117] rounded-xl p-4 border border-[#21262d] space-y-3 mt-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono-code text-[#38bdf8] font-bold uppercase tracking-wide flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">auto_graph</span>
                    <span>AI Cognitive Diagnosis for {currentSubject.code}</span>
                  </span>

                  {currentSubject.aiInsight?.examReadiness !== undefined && (
                    <span className="text-xs font-mono-code font-bold text-[#00e599] bg-[#00e599]/10 px-2 py-0.5 rounded border border-[#00e599]/30">
                      Exam Readiness: {currentSubject.aiInsight.examReadiness}%
                    </span>
                  )}
                </div>

                <p className="text-xs font-sans text-[#c9d1d9] leading-relaxed">
                  {currentSubject.aiInsight?.verdict ||
                    currentSubject.cognitiveNotes ||
                    `Based on your ${currentSubject.grade} standing, your ${currentSubject.areaOfExpertise} profile exhibits ${currentSubject.proficiencyPercent}% mastery. Regular retrieval drills are recommended to stabilize the synaptic decay curve.`}
                </p>

                {/* Dominant Concepts & Recommended Drill */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {currentSubject.aiInsight?.dominantConcepts && (
                    <div className="bg-[#161b22] p-2.5 rounded-lg border border-[#21262d] space-y-1">
                      <span className="text-[10px] font-mono-code text-[#8b949e] uppercase font-bold block">
                        Mastered Concepts:
                      </span>
                      <ul className="text-[11px] font-mono-code text-white space-y-0.5 list-disc list-inside">
                        {currentSubject.aiInsight.dominantConcepts.map((c, i) => (
                          <li key={i} className="truncate">{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentSubject.aiInsight?.recommendedDrillTopic && (
                    <div className="bg-[#161b22] p-2.5 rounded-lg border border-[#21262d] space-y-1.5">
                      <span className="text-[10px] font-mono-code text-[#ff3344] uppercase font-bold block">
                        Recommended Drill:
                      </span>
                      <p className="text-[11px] font-sans text-white">
                        {currentSubject.aiInsight.recommendedDrillTopic}
                      </p>
                      {onStartDrill && (
                        <button
                          onClick={onStartDrill}
                          className="mt-1 px-2.5 py-1 rounded bg-[#ff3344]/15 hover:bg-[#ff3344]/25 text-[#ff3344] border border-[#ff3344]/30 text-[10px] font-mono-code font-bold uppercase transition-all inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">play_arrow</span>
                          <span>Launch Spaced Drill</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
