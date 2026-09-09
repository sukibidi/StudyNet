import React, { useState } from 'react';
import { SubjectTaken, GradeLetter } from '../types';
import {
  GRADE_PROFICIENCY_MAP,
  GRADE_MEMORY_RETENTION_MAP,
  deriveAreaOfExpertise,
  generateKeyStrengthsForSubject,
} from '../expertiseData';

interface SubjectGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: SubjectTaken) => void;
  editingSubject?: SubjectTaken | null;
}

const AVAILABLE_GRADES: GradeLetter[] = [
  'A+',
  'A',
  'A-',
  'B+',
  'B',
  'B-',
  'C+',
  'C',
  'D',
  'F',
];

const PRESET_SUBJECTS = [
  { name: 'Multimedia Systems & Computing', code: 'MM201', grade: 'A+' as GradeLetter },
  { name: 'Computer Graphics & Shader Pipelines', code: 'MM302', grade: 'A+' as GradeLetter },
  { name: 'Operating Systems Architecture', code: 'CS301', grade: 'A' as GradeLetter },
  { name: 'Algorithm Design & Complexity', code: 'CS312', grade: 'B+' as GradeLetter },
  { name: 'Distributed Systems & Cloud Computing', code: 'CS340', grade: 'A-' as GradeLetter },
  { name: 'Database Architecture & Query Engines', code: 'CS320', grade: 'A' as GradeLetter },
  { name: 'Machine Learning & Neural Networks', code: 'AI401', grade: 'A' as GradeLetter },
];

export const SubjectGradeModal: React.FC<SubjectGradeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSubject,
}) => {
  const [name, setName] = useState(editingSubject ? editingSubject.name : '');
  const [code, setCode] = useState(editingSubject ? editingSubject.code : '');
  const [grade, setGrade] = useState<GradeLetter>(editingSubject ? editingSubject.grade : 'A+');
  const [term, setTerm] = useState(editingSubject ? editingSubject.term || '' : 'Semester 4');
  const [credits, setCredits] = useState<number>(editingSubject ? editingSubject.credits || 3 : 3);
  const [customArea, setCustomArea] = useState(editingSubject ? editingSubject.areaOfExpertise : '');
  const [notes, setNotes] = useState(editingSubject ? editingSubject.cognitiveNotes || '' : '');

  if (!isOpen) return null;

  const derivedArea = customArea || (name ? deriveAreaOfExpertise(name, grade) : 'Unassigned Area');
  const previewProf = GRADE_PROFICIENCY_MAP[grade] || 75;
  const previewMem = GRADE_MEMORY_RETENTION_MAP[grade] || 70;

  const handleApplyPreset = (preset: typeof PRESET_SUBJECTS[0]) => {
    setName(preset.name);
    setCode(preset.code);
    setGrade(preset.grade);
    setCustomArea(deriveAreaOfExpertise(preset.name, preset.grade));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalArea = customArea.trim() || deriveAreaOfExpertise(name, grade);
    const keyStrengths = editingSubject?.keyStrengths || generateKeyStrengthsForSubject(name, grade);

    const newSubject: SubjectTaken = {
      id: editingSubject?.id || `subj-${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase() || 'CS-GEN',
      grade,
      term: term.trim() || 'Current Term',
      credits: Number(credits) || 3,
      areaOfExpertise: finalArea,
      proficiencyPercent: previewProf,
      memoryRetentionPercent: previewMem,
      keyStrengths,
      cognitiveNotes:
        notes.trim() ||
        (grade === 'A+' || grade === 'A'
          ? `High-caliber mastery recorded in ${name}. Dominant domain of expertise calibrated at ${previewProf}%.`
          : `Passing record in ${name}. Memory retention at ${previewMem}%; routine drill refresh advised.`),
    };

    onSave(newSubject);
    onClose();
  };

  return (
    <div
      id="subject-grade-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#10141a] border border-[#ff3344]/30 rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#21262d] flex items-center justify-between bg-[#161b22]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff3344]/15 border border-[#ff3344]/30 flex items-center justify-center text-[#ff3344]">
              <span className="material-symbols-outlined text-base">school</span>
            </div>
            <div>
              <h2 className="text-sm font-bold font-heading text-white tracking-wide uppercase">
                {editingSubject ? 'Edit Subject & Grade' : 'Input Subject & Grade'}
              </h2>
              <p className="text-[11px] font-mono-code text-[#8b949e]">
                AI will calibrate expertise domain &amp; memory retention vectors
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-[#8b949e] hover:text-white flex items-center justify-center border border-[#30363d] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Quick Presets */}
          {!editingSubject && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#8b949e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-[#ff3344]">bolt</span>
                <span>Quick Select Common Subjects</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SUBJECTS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 rounded-lg bg-[#161b22] hover:bg-[#21262d] border border-[#21262d] hover:border-[#ff3344]/40 text-[11px] font-mono-code text-[#c9d1d9] transition-all flex items-center gap-1.5"
                  >
                    <span>{preset.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-bold px-1 rounded bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">
                      {preset.grade}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subject Name and Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide">
                Subject / Course Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Multimedia Systems, Operating Systems"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 text-xs font-sans text-white placeholder-[#5c6370] focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide">
                Course Code
              </label>
              <input
                type="text"
                placeholder="e.g. MM201"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-10 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 text-xs font-mono-code text-white placeholder-[#5c6370] focus:outline-none transition-colors uppercase"
              />
            </div>
          </div>

          {/* Grade Selector & Academic Term */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide flex items-center justify-between">
              <span>Grade Achieved *</span>
              <span className="text-[#00e599] font-normal text-[10px]">
                Grade directly drives AI Expertise &amp; Memory Retention
              </span>
            </label>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {AVAILABLE_GRADES.map((g) => {
                const isSelected = grade === g;
                const isHigh = g === 'A+' || g === 'A' || g === 'A-';
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2 px-1 rounded-xl font-mono-code text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? isHigh
                          ? 'bg-[#ff3344] border-[#ff3344] text-white shadow-[0_0_12px_rgba(255,51,68,0.4)] scale-105'
                          : 'bg-[#00e599] border-[#00e599] text-black font-bold scale-105'
                        : 'bg-[#161b22] border-[#21262d] text-[#8b949e] hover:border-[#30363d] hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Term and Credits */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide">
                Semester / Academic Term
              </label>
              <input
                type="text"
                placeholder="e.g. Semester 3, Fall 2025"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full h-9 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 text-xs font-mono-code text-white placeholder-[#5c6370] focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide">
                Credit Hours
              </label>
              <select
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full h-9 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-2 text-xs font-mono-code text-white focus:outline-none transition-colors"
              >
                <option value={1}>1 Credit</option>
                <option value={2}>2 Credits</option>
                <option value={3}>3 Credits</option>
                <option value={4}>4 Credits</option>
                <option value={5}>5 Credits</option>
              </select>
            </div>
          </div>

          {/* AI Calculated Live Preview Card */}
          <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono-code">
              <span className="text-[#8b949e] uppercase font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse"></span>
                <span>AI Telemetry Prediction</span>
              </span>
              <span className="text-white font-bold">Grade: {grade}</span>
            </div>

            <div className="text-xs">
              <span className="text-[#8b949e] text-[10px] uppercase font-mono-code block">
                Mapped Area of Expertise:
              </span>
              <span className="text-white font-semibold font-sans mt-0.5 block">
                {derivedArea}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#21262d]">
              <div className="bg-[#161b22] p-2 rounded-lg border border-[#21262d] text-center">
                <span className="text-[10px] font-mono-code text-[#8b949e] uppercase block">
                  Expertise Level
                </span>
                <span className="text-base font-bold font-mono-code text-[#ff3344] mt-0.5 block">
                  {previewProf}%
                </span>
              </div>

              <div className="bg-[#161b22] p-2 rounded-lg border border-[#21262d] text-center">
                <span className="text-[10px] font-mono-code text-[#8b949e] uppercase block">
                  Memory Retention
                </span>
                <span className="text-base font-bold font-mono-code text-[#00e599] mt-0.5 block">
                  {previewMem}%
                </span>
              </div>
            </div>
          </div>

          {/* Additional Notes (optional) */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide">
              Cognitive / Course Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Completed with distinction in lab assignments and final project."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl p-2.5 text-xs font-sans text-white placeholder-[#5c6370] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#21262d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#21262d] text-xs font-mono-code text-[#8b949e] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#ff3344] hover:bg-[#e62637] text-white font-mono-code text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(255,51,68,0.3)] active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>{editingSubject ? 'Update Subject' : 'Save & Calibrate AI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
