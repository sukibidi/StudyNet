import React, { useState } from 'react';
import { SubjectTaken, ExpertiseAnalysisSummary } from '../types';
import { computeExpertiseSummary } from '../expertiseData';

interface MemoryExpertiseGraphProps {
  subjects: SubjectTaken[];
  onAddSubject: () => void;
  onEditSubject: (subj: SubjectTaken) => void;
  onDeleteSubject: (id: string) => void;
  onRunAiAnalysis: () => void;
  isAnalyzing?: boolean;
}

export const MemoryExpertiseGraph: React.FC<MemoryExpertiseGraphProps> = ({
  subjects,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  onRunAiAnalysis,
  isAnalyzing = false,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || ''
  );
  const [viewMode, setViewMode] = useState<'RADAR' | 'BARS'>('RADAR');

  const selectedSubject =
    subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const summary: ExpertiseAnalysisSummary = computeExpertiseSummary(subjects);

  // SVG Radar coordinates math
  const size = 340;
  const center = size / 2;
  const radius = 118;
  const count = subjects.length;

  // Generate radar points for a given metric
  const getCoordinates = (index: number, valuePercent: number) => {
    // Angle in radians starting from top (-pi/2)
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / Math.max(count, 1);
    const r = (radius * Math.max(0, Math.min(100, valuePercent))) / 100;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Polygon path strings
  const expertisePoints = subjects
    .map((s, idx) => {
      const { x, y } = getCoordinates(idx, s.proficiencyPercent);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const memoryPoints = subjects
    .map((s, idx) => {
      const { x, y } = getCoordinates(idx, s.memoryRetentionPercent);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="space-y-4">
      {/* 1. TOP TELEMETRY SUMMARY STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-[#10141a] rounded-xl p-3 border border-[rgba(255,255,255,0.07)]">
          <span className="text-[10px] font-mono-code text-[#8b949e] uppercase block">
            Dominant Expertise
          </span>
          <span className="text-xs font-bold font-mono-code text-white mt-1 block truncate">
            {subjects[0]?.name.split(' ')[0] || 'Unset'} ({subjects[0]?.grade || '—'})
          </span>
          <span className="text-[10px] font-mono-code text-[#ff3344] mt-0.5 block">
            {subjects[0]?.proficiencyPercent || 0}% Proficiency
          </span>
        </div>

        <div className="bg-[#10141a] rounded-xl p-3 border border-[rgba(255,255,255,0.07)]">
          <span className="text-[10px] font-mono-code text-[#8b949e] uppercase block">
            Avg Memory Retention
          </span>
          <span className="text-xs font-bold font-mono-code text-[#00e599] mt-1 block">
            {summary.averageMemoryRetention}% Active
          </span>
          <span className="text-[10px] font-mono-code text-[#8b949e] mt-0.5 block">
            Spaced Decay: Optimal
          </span>
        </div>

        <div className="bg-[#10141a] rounded-xl p-3 border border-[rgba(255,255,255,0.07)]">
          <span className="text-[10px] font-mono-code text-[#8b949e] uppercase block">
            Subjects Evaluated
          </span>
          <span className="text-xs font-bold font-mono-code text-white mt-1 block">
            {subjects.length} Ingested
          </span>
          <span className="text-[10px] font-mono-code text-[#388bfd] mt-0.5 block">
            Full Radar Calibrated
          </span>
        </div>

        <div className="bg-[#10141a] rounded-xl p-3 border border-[rgba(255,255,255,0.07)] flex flex-col justify-between">
          <span className="text-[10px] font-mono-code text-[#8b949e] uppercase block">
            Actions
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <button
              onClick={onAddSubject}
              className="flex-1 py-1 px-1.5 rounded-lg bg-[#ff3344] hover:bg-[#e62637] text-white font-mono-code text-[10px] font-bold uppercase transition-all shadow-[0_0_8px_rgba(255,51,68,0.3)] text-center"
              title="Add Subject & Grade"
            >
              + Subject
            </button>
            <button
              onClick={onRunAiAnalysis}
              disabled={isAnalyzing}
              className="py-1 px-2 rounded-lg bg-[#161b22] hover:bg-[#21262d] border border-[#ff3344]/40 text-[#ff5c6c] font-mono-code text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0"
              title="Run AI Neural Analysis"
            >
              <span className={`material-symbols-outlined text-xs ${isAnalyzing ? 'animate-spin' : ''}`}>
                bolt
              </span>
              <span>AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE CORE DUAL GRAPH CARD */}
      <div className="bg-[#10141a] rounded-2xl p-4 sm:p-5 border border-[rgba(255,255,255,0.07)] space-y-4 shadow-sm">
        {/* Graph Header and View Mode Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#21262d]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ff3344] text-base">
                radar
              </span>
              <h2 className="text-xs sm:text-sm font-bold font-heading text-white tracking-wide uppercase">
                Memory &amp; Expertise Spectrum
              </h2>
            </div>
            <p className="text-[11px] font-mono-code text-[#8b949e] mt-0.5">
              Comparative telemetry: Domain Expertise Level vs. Active Memory Retention
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Legend indicators */}
            <div className="flex items-center gap-3 text-[10px] font-mono-code pr-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff3344] shadow-[0_0_6px_#ff3344]"></span>
                <span className="text-white font-bold">Expertise</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00e599] shadow-[0_0_6px_#00e599]"></span>
                <span className="text-white font-bold">Memory</span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="bg-[#161b22] p-0.5 rounded-lg border border-[#21262d] flex items-center">
              <button
                onClick={() => setViewMode('RADAR')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono-code font-bold uppercase transition-all ${
                  viewMode === 'RADAR'
                    ? 'bg-[#ff3344] text-white shadow-sm'
                    : 'text-[#8b949e] hover:text-white'
                }`}
              >
                Radar
              </button>
              <button
                onClick={() => setViewMode('BARS')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono-code font-bold uppercase transition-all ${
                  viewMode === 'BARS'
                    ? 'bg-[#ff3344] text-white shadow-sm'
                    : 'text-[#8b949e] hover:text-white'
                }`}
              >
                Bars
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: RADAR SPECTRUM */}
        {viewMode === 'RADAR' && (
          <div className="flex flex-col items-center justify-center py-2 relative">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full max-w-[310px] sm:max-w-[340px] h-auto overflow-visible select-none"
            >
              {/* Concentric Guide Rings */}
              {[0.25, 0.5, 0.75, 1.0].map((level) => {
                const r = radius * level;
                return (
                  <g key={level}>
                    <circle
                      cx={center}
                      cy={center}
                      r={r}
                      fill="none"
                      stroke="#21262d"
                      strokeWidth={1}
                      strokeDasharray={level < 1 ? '2 3' : undefined}
                    />
                    <text
                      x={center + 3}
                      y={center - r + 9}
                      fill="#5c6370"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {Math.round(level * 100)}%
                    </text>
                  </g>
                );
              })}

              {/* Axis Spokes & Labels */}
              {subjects.map((subj, idx) => {
                const { x, y, angle } = getCoordinates(idx, 100);
                // Label positioning slightly outside radius
                const labelDist = radius + 24;
                const lx = center + labelDist * Math.cos(angle);
                const ly = center + labelDist * Math.sin(angle);

                const isSelected = selectedSubject?.id === subj.id;
                let textAnchor = 'middle';
                if (Math.cos(angle) > 0.3) textAnchor = 'start';
                else if (Math.cos(angle) < -0.3) textAnchor = 'end';

                return (
                  <g key={subj.id}>
                    {/* Spoke Line */}
                    <line
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke={isSelected ? '#ff3344' : '#21262d'}
                      strokeWidth={isSelected ? 1.5 : 1}
                    />

                    {/* Interactive Clickable Spoke Label */}
                    <g
                      className="cursor-pointer group"
                      onClick={() => setSelectedSubjectId(subj.id)}
                    >
                      <text
                        x={lx}
                        y={ly - 2}
                        fill={isSelected ? '#ff3344' : '#c9d1d9'}
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor={textAnchor}
                        className="transition-colors group-hover:fill-[#ff3344]"
                      >
                        {subj.code || subj.name.split(' ')[0]} ({subj.grade})
                      </text>
                      <text
                        x={lx}
                        y={ly + 9}
                        fill={isSelected ? '#00e599' : '#8b949e'}
                        fontSize="8.5"
                        fontFamily="monospace"
                        textAnchor={textAnchor}
                      >
                        {subj.memoryRetentionPercent}% mem
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Memory Retention Polygon (Emerald layer) */}
              {subjects.length >= 2 && (
                <polygon
                  points={memoryPoints}
                  fill="rgba(0, 229, 153, 0.18)"
                  stroke="#00e599"
                  strokeWidth={2}
                  className="transition-all duration-300"
                />
              )}

              {/* Expertise Polygon (Crimson layer) */}
              {subjects.length >= 2 && (
                <polygon
                  points={expertisePoints}
                  fill="rgba(255, 51, 68, 0.22)"
                  stroke="#ff3344"
                  strokeWidth={2.2}
                  className="transition-all duration-300"
                />
              )}

              {/* Data points on the vertices */}
              {subjects.map((subj, idx) => {
                const expCoord = getCoordinates(idx, subj.proficiencyPercent);
                const memCoord = getCoordinates(idx, subj.memoryRetentionPercent);
                const isSelected = selectedSubject?.id === subj.id;

                return (
                  <g key={`points-${subj.id}`}>
                    {/* Memory point (Diamond) */}
                    <circle
                      cx={memCoord.x}
                      cy={memCoord.y}
                      r={isSelected ? 4.5 : 3.5}
                      fill="#00e599"
                      stroke="#0d1117"
                      strokeWidth={1.5}
                      className="cursor-pointer"
                      onClick={() => setSelectedSubjectId(subj.id)}
                    />

                    {/* Expertise point (Circle) */}
                    <circle
                      cx={expCoord.x}
                      cy={expCoord.y}
                      r={isSelected ? 5.5 : 4}
                      fill="#ff3344"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="cursor-pointer"
                      onClick={() => setSelectedSubjectId(subj.id)}
                    />
                  </g>
                );
              })}

              {/* Center Pivot Marker */}
              <circle cx={center} cy={center} r={3} fill="#ff3344" />
            </svg>
          </div>
        )}

        {/* VIEW 2: DUAL METRIC BARS */}
        {viewMode === 'BARS' && (
          <div className="space-y-3 pt-1">
            {subjects.map((subj) => {
              const isSelected = selectedSubject?.id === subj.id;
              return (
                <div
                  key={subj.id}
                  onClick={() => setSelectedSubjectId(subj.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#161b22] border-[#ff3344]/50 shadow-[0_0_12px_rgba(255,51,68,0.15)]'
                      : 'bg-[#0d1117] border-[#21262d] hover:border-[#30363d]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono-code text-xs font-bold text-white truncate">
                        {subj.name}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#8b949e]">
                        ({subj.code})
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#ff3344]/15 border border-[#ff3344]/30 text-[#ff3344] shrink-0">
                      Grade: {subj.grade}
                    </span>
                  </div>

                  {/* Dual Bars */}
                  <div className="space-y-1.5 font-mono-code text-[10px]">
                    <div>
                      <div className="flex justify-between text-[#8b949e] mb-0.5">
                        <span className="text-[#ff5c6c]">Expertise Proficiency</span>
                        <span className="text-white font-bold">{subj.proficiencyPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#161b22] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ff3344] rounded-full transition-all duration-500"
                          style={{ width: `${subj.proficiencyPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#8b949e] mb-0.5">
                        <span className="text-[#00e599]">Active Memory Retention</span>
                        <span className="text-white font-bold">{subj.memoryRetentionPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#161b22] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00e599] rounded-full transition-all duration-500"
                          style={{ width: `${subj.memoryRetentionPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. SELECTED SUBJECT DIAGNOSTIC BREAKDOWN */}
        {selectedSubject && (
          <div className="bg-[#0d1117] rounded-xl p-3.5 sm:p-4 border border-[#21262d] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">
                    {selectedSubject.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">
                    Grade {selectedSubject.grade}
                  </span>
                </div>
                <p className="text-[11px] font-mono-code text-[#ff3344] mt-0.5">
                  Area of Expertise: {selectedSubject.areaOfExpertise}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => onEditSubject(selectedSubject)}
                  className="px-2.5 py-1 rounded-lg bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-[10px] font-mono-code text-[#c9d1d9] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-xs">edit</span>
                  <span>Edit</span>
                </button>
                {subjects.length > 1 && (
                  <button
                    onClick={() => onDeleteSubject(selectedSubject.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#161b22] hover:bg-[#ff3344]/20 border border-[#30363d] hover:border-[#ff3344]/40 text-[10px] font-mono-code text-[#8b949e] hover:text-[#ff3344] flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">delete</span>
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

            {/* Metrics Comparison */}
            <div className="grid grid-cols-2 gap-2 font-mono-code">
              <div className="bg-[#161b22] p-2.5 rounded-lg border border-[#21262d]">
                <div className="text-[10px] text-[#8b949e] uppercase">
                  Expertise Proficiency
                </div>
                <div className="text-base font-bold text-[#ff3344] mt-0.5">
                  {selectedSubject.proficiencyPercent}%
                </div>
                <div className="text-[9px] text-[#8b949e] mt-0.5">
                  Derived from Grade {selectedSubject.grade}
                </div>
              </div>

              <div className="bg-[#161b22] p-2.5 rounded-lg border border-[#21262d]">
                <div className="text-[10px] text-[#8b949e] uppercase">
                  Memory Retention
                </div>
                <div className="text-base font-bold text-[#00e599] mt-0.5">
                  {selectedSubject.memoryRetentionPercent}%
                </div>
                <div className="text-[9px] text-[#8b949e] mt-0.5">
                  Active Spaced Trace
                </div>
              </div>
            </div>

            {/* Key Strengths list */}
            {selectedSubject.keyStrengths && selectedSubject.keyStrengths.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#8b949e] block">
                  AI Analyzed Domain Strengths:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {selectedSubject.keyStrengths.map((str, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-[#161b22] px-2.5 py-1.5 rounded-lg border border-[#21262d] text-[11px] font-sans text-[#c9d1d9] flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff3344] shrink-0"></span>
                      <span className="truncate">{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cognitive AI Note */}
            {selectedSubject.cognitiveNotes && (
              <div className="bg-[#161b22] p-2.5 rounded-lg border-l-2 border-l-[#ff3344] border-y border-r border-[#21262d] text-xs text-[#8b949e] leading-relaxed">
                <span className="text-white font-mono-code font-bold text-[10px] uppercase block mb-0.5">
                  AI Tactical Note:
                </span>
                {selectedSubject.cognitiveNotes}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. SUBJECTS & GRADES INGESTION LIST */}
      <div className="bg-[#10141a] rounded-2xl p-4 sm:p-5 border border-[rgba(255,255,255,0.07)] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff3344] text-base">
              list_alt
            </span>
            <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-white">
              Ingested Academic Record ({subjects.length} Subjects)
            </h3>
          </div>
          <button
            onClick={onAddSubject}
            className="text-[10px] font-mono-code font-bold uppercase text-[#ff3344] hover:text-[#ff5c6c] flex items-center gap-1 transition-colors"
          >
            <span>+ Add Subject</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              onClick={() => setSelectedSubjectId(subj.id)}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                selectedSubject?.id === subj.id
                  ? 'bg-[#161b22] border-[#ff3344]/50'
                  : 'bg-[#0d1117] border-[#21262d] hover:border-[#30363d]'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold font-mono-code text-white truncate">
                    {subj.name}
                  </span>
                </div>
                <div className="text-[10px] font-mono-code text-[#8b949e] truncate mt-0.5">
                  {subj.areaOfExpertise}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold font-mono-code bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">
                  {subj.grade}
                </span>
                <div className="text-[9px] font-mono-code text-[#8b949e] mt-0.5">
                  {subj.proficiencyPercent}% Exp
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
