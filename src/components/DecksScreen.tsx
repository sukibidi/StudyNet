import React, { useState } from 'react';
import { FLASHCARDS_DECK } from '../data';
import { ScreenType } from '../types';

interface DecksScreenProps {
  onNavigate: (screen: ScreenType) => void;
  isZeroData?: boolean;
}

export const DecksScreen: React.FC<DecksScreenProps> = ({ onNavigate, isZeroData = false }) => {
  const [deck, setDeck] = useState(FLASHCARDS_DECK);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [reviewCount, setReviewCount] = useState(14);
  const [streakDays, setStreakDays] = useState(14);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const currentCard = deck[currentIndex] || deck[0];

  const handleRate = (interval: string) => {
    setFeedbackToast(`Interval scheduled: ${interval}`);
    setTimeout(() => setFeedbackToast(null), 2000);

    setIsAnswerRevealed(false);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((i) => i + 1);
      setReviewCount((c) => c + 1);
    } else {
      // Loop back or show completion
      setCurrentIndex(0);
      setReviewCount(14);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-[72px] pb-28 space-y-5 flex flex-col items-stretch">
      {/* 1. CARD TOPIC & RETENTION STATUS */}
      <div
        id="deck-status-card"
        className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-3.5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-code text-[#8b949e] uppercase tracking-wider">
            {isZeroData ? 'NO ACTIVE DECK LOADED' : currentCard.course}
          </span>
          <span
            className={`text-xs font-mono-code px-2.5 py-0.5 rounded-lg font-semibold border ${
              isZeroData
                ? 'text-[#8b949e] bg-[#161b22] border-[#21262d]'
                : 'text-[#ff3344] bg-[#ff3344]/15 border-[#ff3344]/30'
            }`}
          >
            {isZeroData ? '0 Cards Due' : `Card ${currentCard.cardNumber} of ${currentCard.totalCards}`}
          </span>
        </div>

        <h2 className="text-lg font-bold font-heading text-white tracking-tight">
          {isZeroData ? 'Spaced Repetition Queue Clear' : currentCard.topic}
        </h2>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono-code">
            <div className="flex items-center gap-1.5 text-[#8b949e]">
              <span className="material-symbols-outlined text-[#ff3344] text-sm">trending_up</span>
              <span>Retention Stability</span>
            </div>
            <div>
              <span className="text-white font-bold">{isZeroData ? '0%' : `${currentCard.retentionStability}%`}</span>
              <span className="text-[#8b949e]"> • {isZeroData ? 'Standby Queue' : 'High Tier'}</span>
            </div>
          </div>

          {/* Segmented Stability Progress Bar */}
          <div className="grid grid-cols-10 gap-1.5 w-full">
            {Array.from({ length: 10 }).map((_, idx) => {
              const isFilled = !isZeroData && idx < Math.round(currentCard.retentionStability / 10);
              return (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    isFilled ? 'bg-[#ff3344] shadow-[0_0_6px_rgba(255,51,68,0.4)]' : 'bg-[#1c222b]'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. FLASHCARD INTERACTIVE CONTAINER */}
      {isZeroData ? (
        <div className="bg-[#10141a] rounded-2xl p-6 border border-[rgba(255,255,255,0.07)] text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e]">
            <span className="material-symbols-outlined text-2xl">style</span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white uppercase tracking-wide">
              NO FLASHCARDS IN QUEUE
            </h3>
            <p className="text-xs text-[#8b949e] mt-1 max-w-sm mx-auto leading-relaxed">
              Your spaced repetition queue is clear for today. Generate flashcards directly from indexed lecture documents or add custom problem sets.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={() => onNavigate('AI-NET')}
              className="py-2.5 px-4 bg-[#ff3344] hover:bg-[#e62637] text-white rounded-xl font-mono-code text-xs font-bold uppercase transition-all inline-flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,51,68,0.3)]"
            >
              <span className="material-symbols-outlined text-sm">psychology</span>
              <span>Generate Cards with AI-NET</span>
            </button>
            <button
              onClick={() => {
                setFeedbackToast('Flashcard builder modal ready');
                setTimeout(() => setFeedbackToast(null), 2000);
              }}
              className="py-2.5 px-4 bg-[#161b22] hover:bg-[#1f2530] text-white rounded-xl border border-[#30363d] hover:border-[#ff3344] font-mono-code text-xs font-semibold uppercase transition-all inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm text-[#ff3344]">add_card</span>
              <span>+ Add Manual Card</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            id="flashcard-interactive-box"
            className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
              <div className="flex items-center gap-2 text-xs font-mono-code">
                <span className="text-white font-bold">QUESTION {currentCard.cardNumber}</span>
                <span className="text-[#5c6370]">•</span>
                <span className="text-[#8b949e]">{currentCard.category}</span>
              </div>
              <button
                onClick={() => {
                  setIsAnswerRevealed(false);
                  setCurrentIndex((idx) => (idx + 1) % deck.length);
                }}
                className="text-[#8b949e] hover:text-white transition-colors"
                title="Next Question"
              >
                <span className="material-symbols-outlined text-base">swap_horiz</span>
              </button>
            </div>

            {/* Question text */}
            <h3 className="text-base sm:text-lg font-bold font-heading text-white leading-snug">
              {currentCard.question}
            </h3>

            {/* Key aspect hint */}
            <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#ff3344] text-base shrink-0 mt-0.5">
                lightbulb
              </span>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                <strong className="text-white font-medium">Key aspect:</strong> {currentCard.keyAspect}
              </p>
            </div>

            {/* Reveal Answer Button */}
            {!isAnswerRevealed ? (
              <button
                id="reveal-flashcard-answer-btn"
                onClick={() => setIsAnswerRevealed(true)}
                className="w-full bg-[#ff3344] hover:bg-[#e62637] text-white py-3.5 px-4 rounded-xl font-mono-code text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 glow-crimson active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-base">visibility</span>
                <span>Reveal Answer</span>
              </button>
            ) : (
              <div className="space-y-4 pt-2">
                {/* Side-by-side comparison cards */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Inverted Table */}
                  <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-code text-[#8b949e] uppercase">
                        {currentCard.comparison.leftTitle}
                      </span>
                      <span className="material-symbols-outlined text-[#00d2ff] text-sm">memory</span>
                    </div>
                    <div className="font-heading font-bold text-xs sm:text-sm text-white">
                      {currentCard.comparison.leftValue}
                    </div>
                    <div className="text-[11px] text-[#8b949e]">
                      {currentCard.comparison.leftSub}
                    </div>
                  </div>

                  {/* Hierarchical */}
                  <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-code text-[#8b949e] uppercase">
                        {currentCard.comparison.rightTitle}
                      </span>
                      <span className="material-symbols-outlined text-[#f59e0b] text-sm">account_tree</span>
                    </div>
                    <div className="font-heading font-bold text-xs sm:text-sm text-white">
                      {currentCard.comparison.rightValue}
                    </div>
                    <div className="text-[11px] text-[#8b949e]">
                      {currentCard.comparison.rightSub}
                    </div>
                  </div>
                </div>

                {/* Explanation box */}
                <div className="bg-[#161b22] p-3 rounded-xl border border-[#21262d] text-xs text-[#8b949e] leading-relaxed">
                  {currentCard.explanation}
                </div>
              </div>
            )}
          </div>

          {/* 3. HOW WELL DID YOU KNOW THIS? Spaced Repetition Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono-code px-1 text-[#8b949e]">
              <span>How well did you know this?</span>
              <span>Next Review Interval</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleRate('<1m')}
                className="bg-[#10141a] hover:bg-[#161b22] p-2.5 rounded-xl border border-[#21262d] hover:border-[#ff3344]/40 flex flex-col items-center justify-center transition-all group"
              >
                <span className="text-xs font-mono-code font-bold text-[#ff3344]">Again</span>
                <span className="text-[10px] font-mono-code text-[#8b949e] mt-0.5">&lt;1m</span>
              </button>

              <button
                onClick={() => handleRate('12h')}
                className="bg-[#10141a] hover:bg-[#161b22] p-2.5 rounded-xl border border-[#21262d] hover:border-[#f59e0b]/40 flex flex-col items-center justify-center transition-all group"
              >
                <span className="text-xs font-mono-code font-bold text-[#f59e0b]">Hard</span>
                <span className="text-[10px] font-mono-code text-[#8b949e] mt-0.5">12h</span>
              </button>

              <button
                onClick={() => handleRate('2d')}
                className="bg-[#10141a] hover:bg-[#161b22] p-2.5 rounded-xl border border-[#21262d] hover:border-white/40 flex flex-col items-center justify-center transition-all group"
              >
                <span className="text-xs font-mono-code font-bold text-white">Good</span>
                <span className="text-[10px] font-mono-code text-[#8b949e] mt-0.5">2d</span>
              </button>

              <button
                onClick={() => handleRate('4d')}
                className="bg-[#10141a] hover:bg-[#161b22] p-2.5 rounded-xl border border-[#21262d] hover:border-[#00e599]/40 flex flex-col items-center justify-center transition-all group"
              >
                <span className="text-xs font-mono-code font-bold text-[#00e599]">Easy</span>
                <span className="text-[10px] font-mono-code text-[#8b949e] mt-0.5">4d</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* 4. BOTTOM TELEMETRY PILL */}
      <div className="bg-[#10141a] rounded-xl p-3 border border-[rgba(255,255,255,0.07)] flex items-center justify-between text-xs font-mono-code">
        <div className="flex items-center gap-1.5 text-[#8b949e]">
          <span className="material-symbols-outlined text-sm">layers</span>
          <span>{isZeroData ? '0 Remaining' : '18 Remaining'}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#8b949e]">
          <span className="material-symbols-outlined text-sm">schedule</span>
          <span>{isZeroData ? '0 Mins Est.' : '7 Mins Est.'}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#ff3344]">
          <span className="material-symbols-outlined text-sm">local_fire_department</span>
          <span className="font-bold">{isZeroData ? '0-Day Streak' : `${streakDays}-Day Streak`}</span>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#161b22] border border-[#ff3344] px-4 py-2 rounded-xl text-xs font-mono-code text-white shadow-2xl animate-fade-in">
          {feedbackToast}
        </div>
      )}
    </div>
  );
};
