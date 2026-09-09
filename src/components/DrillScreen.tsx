import React, { useState, useEffect } from 'react';
import { DrillQuestion, ScreenType } from '../types';
import { loadDrillQuestionsFromSupabase, saveDrillQuestionToSupabase } from '../data';

interface DrillScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onFinish?: (xpEarned: number) => void;
  operatorName?: string;
}

export const DrillScreen: React.FC<DrillScreenProps> = ({ onNavigate, onFinish, operatorName }) => {
  const [questions, setQuestions] = useState<DrillQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadQuestions() {
      try {
        const qs = await loadDrillQuestionsFromSupabase();
        if (!cancelled) {
          setQuestions(qs);
        }
      } catch (e) {
        console.error('Failed to load drill questions from Supabase:', e);
        if (!cancelled) {
          try {
            const saved = localStorage.getItem('studynet_drill_questions');
            if (saved) setQuestions(JSON.parse(saved));
          } catch (e2) {}
        }
      } finally {
        if (!cancelled) setIsLoadingQuestions(false);
      }
    }
    loadQuestions();
    return () => { cancelled = true; };
  }, []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState('opt-a');
  const [isFlagged, setIsFlagged] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(85);
  const [completedNotification, setCompletedNotification] = useState<string | null>(null);

  const question = questions[currentQuestionIndex] || questions[0];

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(questions[currentQuestionIndex + 1].options[0].id);
    } else {
      setCompletedNotification(`Protocol Completed! +120 XP added to ${operatorName || 'Operator'} profile.`);
      setTimeout(() => {
        if (onFinish) onFinish(120);
        onNavigate('STATS');
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-[72px] pb-28 space-y-4 flex flex-col items-stretch">
      {/* 1. DRILL CONTEXT & PROGRESS HEADER */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs font-sans">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#10141a] rounded-full border border-[#21262d] text-[#8b949e]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3344] animate-pulse"></span>
            <span className="font-medium text-white">Dynamic Programming • Memoization</span>
            <span className="text-[#5c6370]">|</span>
            <span className="text-[#ff3344] font-medium">58% Past Fail Rate</span>
          </div>
          <span className="text-xs font-mono-code font-medium text-[#00e599]">
            +120 XP on completion
          </span>
        </div>

        <div className="bg-[#10141a] rounded-2xl border border-[#21262d] p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium font-heading text-white">
              Question {question.id} of 5
            </span>
            <span className="text-[#8b949e] font-mono-code text-[11px]">40% Completed</span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="grid grid-cols-5 gap-1.5 w-full">
            <div className="h-1.5 rounded-full bg-[#ff3344]" />
            <div className="h-1.5 rounded-full bg-[#ff3344] shadow-[0_0_8px_rgba(255,51,68,0.5)]" />
            <div className="h-1.5 rounded-full bg-[#1c222b]" />
            <div className="h-1.5 rounded-full bg-[#1c222b]" />
            <div className="h-1.5 rounded-full bg-[#1c222b]" />
          </div>
        </div>
      </div>

      {/* 2. PROBLEM SPECIFICATION CARD */}
      <section className="bg-[#10141a] rounded-2xl border border-[#21262d] p-4 sm:p-5 flex flex-col gap-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 bg-[#161b22] text-[#8b949e] text-[11px] font-mono-code font-medium tracking-wide rounded-md border border-[#21262d]">
            {question.course}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg sm:text-xl font-bold font-heading tracking-tight text-white">
            {question.title}
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#8b949e]">
            {question.problem}
          </p>
        </div>

        {/* Parameters Summary */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-[#0d1117] border border-[#21262d] rounded-xl px-3 py-2 flex flex-col">
            <span className="text-[10px] text-[#5c6370] uppercase font-mono-code">Capacity</span>
            <span className="font-mono-code text-xs font-semibold text-white mt-0.5">
              {question.capacity}
            </span>
          </div>
          <div className="bg-[#0d1117] border border-[#21262d] rounded-xl px-3 py-2 flex flex-col">
            <span className="text-[10px] text-[#5c6370] uppercase font-mono-code">Weights</span>
            <span className="font-mono-code text-xs font-semibold text-white mt-0.5">
              {question.weights}
            </span>
          </div>
          <div className="bg-[#0d1117] border border-[#21262d] rounded-xl px-3 py-2 flex flex-col">
            <span className="text-[10px] text-[#5c6370] uppercase font-mono-code">Values</span>
            <span className="font-mono-code text-xs font-semibold text-white mt-0.5">
              {question.values}
            </span>
          </div>
        </div>
      </section>

      {/* 3. MULTIPLE-CHOICE RECURRENCE OPTIONS */}
      <section className="flex flex-col gap-2.5">
        <div className="text-xs font-medium text-[#8b949e] px-1 font-sans">
          Select Optimal Formulation
        </div>

        {question.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`w-full text-left rounded-2xl p-4 transition-all relative group ${
                isSelected
                  ? 'bg-[#10141a] border-2 border-[#ff3344] shadow-[0_0_16px_rgba(255,51,68,0.2)]'
                  : 'bg-[#10141a] hover:bg-[#161b22] border border-[#21262d]'
              }`}
              type="button"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                    isSelected
                      ? 'border-[#ff3344] bg-[#ff3344]/15'
                      : 'border-[#30363d] group-hover:border-[#8b949e]'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#ff3344]" />}
                </div>

                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <span
                    className={`font-mono-code text-[13px] break-all ${
                      isSelected ? 'font-semibold text-white' : 'text-[#8b949e]'
                    }`}
                  >
                    {opt.formula}
                  </span>
                  <span className="text-xs text-[#8b949e] leading-snug">
                    {opt.description}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {/* 4. SOLUTION RATIONALE & VERIFICATION DRAWER */}
      <section className="bg-[#10141a] rounded-2xl border border-[#21262d] p-4 sm:p-5 flex flex-col gap-3.5">
        <div className="flex items-center justify-between pb-1 border-b border-[#21262d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff3344] text-[18px]">verified</span>
            <span className="text-sm font-semibold font-heading text-white">
              {question.verifiedLabel}
            </span>
          </div>
          <span className="text-[11px] text-[#8b949e] font-mono-code">0/1 Subproblem Matrix</span>
        </div>

        {/* Mini Matrix Visualization */}
        <div className="bg-[#0d1117] rounded-xl p-3 border border-[#21262d] overflow-x-auto">
          <div className="text-[10px] text-[#5c6370] mb-2 font-mono-code flex items-center justify-between">
            <span>STATES (i \ w)</span>
            <span>CAPACITIES 0 → 5</span>
          </div>

          <div className="font-mono-code text-xs text-[#8b949e] space-y-1 min-w-[240px]">
            {/* Header row */}
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[#5c6370] pb-1 border-b border-[#21262d]">
              <span></span>
              {question.matrix.capacities.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>

            {/* Matrix Data rows */}
            {question.matrix.rows.map((row, rIdx) => (
              <div
                key={rIdx}
                className={`grid grid-cols-7 gap-1 text-center py-1 ${
                  rIdx === 1 ? 'bg-[#161b22] rounded' : ''
                }`}
              >
                <span className="text-[#5c6370] font-medium">{row.label}</span>
                {row.cells.map((cell, cIdx) => (
                  <span
                    key={cIdx}
                    className={
                      cell.highlight ? 'text-[#ff3344] font-bold underline decoration-[#ff3344]' : ''
                    }
                  >
                    {cell.val}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Rationale Callout */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0d1117] border border-[#21262d]">
          <span className="material-symbols-outlined text-[#ff3344] text-[18px] shrink-0 mt-0.5">
            lightbulb
          </span>
          <p className="text-xs sm:text-sm text-[#8b949e] leading-relaxed">
            {question.explanation}
          </p>
        </div>
      </section>

      {/* 5. STICKY BOTTOM ACTION BUTTONS */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e14]/92 backdrop-blur-md border-t border-[#21262d] pb-safe">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            id="drill-flag-btn"
            type="button"
            onClick={() => setIsFlagged(!isFlagged)}
            className={`w-2/5 h-12 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-mono-code font-bold uppercase transition-colors ${
              isFlagged
                ? 'bg-[#ff3344]/15 border-[#ff3344] text-[#ff3344]'
                : 'bg-[#10141a] hover:bg-[#161b22] border-[#21262d] text-[#8b949e] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">
              {isFlagged ? 'flag_circle' : 'flag'}
            </span>
            <span>{isFlagged ? 'Flagged' : 'Flag for Review'}</span>
          </button>

          <button
            id="drill-submit-btn"
            type="button"
            onClick={handleSubmit}
            className="w-3/5 h-12 rounded-xl bg-[#ff3344] hover:bg-[#e62637] text-white font-mono-code font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 glow-crimson active:scale-[0.98] transition-all"
          >
            <span>Submit &amp; Proceed</span>
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </button>
        </div>
      </footer>

      {/* Completion toast */}
      {completedNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#161b22] border border-[#00e599] text-[#00e599] font-mono-code text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{completedNotification}</span>
        </div>
      )}
    </div>
  );
};
