import React, { useState, useEffect } from 'react';
import { Flashcard, ScreenType } from '../types';
import { loadFlashcardsFromSupabase, saveFlashcardToSupabase } from '../data';

interface DecksScreenProps {
  onNavigate: (screen: ScreenType) => void;
  isZeroData?: boolean;
}

export const DecksScreen: React.FC<DecksScreenProps> = ({ onNavigate, isZeroData = false }) => {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [isLoadingDeck, setIsLoadingDeck] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadDeck() {
      try {
        const cards = await loadFlashcardsFromSupabase();
        if (!cancelled) {
          setDeck(cards);
        }
      } catch (e) {
        console.error('Failed to load flashcards from Supabase:', e);
        if (!cancelled) {
          try {
            const saved = localStorage.getItem('studynet_flashcards');
            if (saved) setDeck(JSON.parse(saved));
          } catch (e2) {}
        }
      } finally {
        if (!cancelled) setIsLoadingDeck(false);
      }
    }
    loadDeck();
    return () => { cancelled = true; };
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [reviewCount, setReviewCount] = useState(14);
  const [streakDays, setStreakDays] = useState(14);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [deckView, setDeckView] = useState<'ALL' | 'DUE' | 'RECENT'>('ALL');
  const [manualTopic, setManualTopic] = useState('');
  const [manualQuestion, setManualQuestion] = useState('');
  const [manualAnswer, setManualAnswer] = useState('');

  const currentCard = deck[currentIndex] || deck[0];
  const isDeckEmpty = !isLoadingDeck && deck.length === 0;
  const visibleDeck = deck.filter((card) => {
    if (deckView === 'DUE') return card.retentionStability < 70;
    if (deckView === 'RECENT') return card.category === 'AI-NET GENERATED';
    return true;
  });
  const currentVisibleCard = visibleDeck[currentIndex] || visibleDeck[0] || currentCard;

  useEffect(() => {
    if (visibleDeck.length === 0 || currentIndex >= visibleDeck.length) setCurrentIndex(0);
  }, [visibleDeck.length, currentIndex]);

  const handleRate = async (interval: string) => {
    setFeedbackToast(`Interval scheduled: ${interval}`);
    setTimeout(() => setFeedbackToast(null), 2000);

    setIsAnswerRevealed(false);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((i) => i + 1);
      setReviewCount((c) => c + 1);
    } else {
      setCurrentIndex(0);
      setReviewCount(14);
    }
  };

  const handleSaveManualCard = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!manualTopic.trim() || !manualQuestion.trim() || !manualAnswer.trim()) return;

    const card: Flashcard = {
      id: crypto.randomUUID(),
      course: 'PERSONAL DECK',
      cardNumber: deck.length + 1,
      totalCards: deck.length + 1,
      topic: manualTopic.trim(),
      category: 'MANUAL',
      question: manualQuestion.trim(),
      keyAspect: 'Recall the answer before revealing it.',
      comparison: {
        leftTitle: 'PROMPT',
        leftValue: 'Active recall',
        leftSub: 'Try answering from memory first.',
        rightTitle: 'SOURCE',
        rightValue: 'Personal',
        rightSub: 'Added manually to your deck.',
      },
      explanation: manualAnswer.trim(),
      retentionStability: 50,
    };

    setDeck((previous) => [card, ...previous]);
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
    setIsBuilderOpen(false);
    setManualTopic('');
    setManualQuestion('');
    setManualAnswer('');

    try {
      await saveFlashcardToSupabase(card);
    } catch (error) {
      console.warn('Manual flashcard persistence fallback:', error);
      try {
        const savedCards = JSON.parse(localStorage.getItem('studynet_flashcards') || '[]') as Flashcard[];
        localStorage.setItem('studynet_flashcards', JSON.stringify([card, ...savedCards]));
      } catch (storageError) {
        console.warn('Manual flashcard local fallback unavailable:', storageError);
      }
    }
    setFeedbackToast('Card added to your deck');
    setTimeout(() => setFeedbackToast(null), 2000);
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
            {isDeckEmpty ? 'NO ACTIVE DECK LOADED' : currentVisibleCard?.course || 'FLASHCARD DECK'}
          </span>
          <span
            className={`text-xs font-mono-code px-2.5 py-0.5 rounded-lg font-semibold border ${
              isZeroData
                ? 'text-[#8b949e] bg-[#161b22] border-[#21262d]'
                : 'text-[#ff3344] bg-[#ff3344]/15 border-[#ff3344]/30'
            }`}
          >
            {isDeckEmpty ? '0 Cards Due' : `${visibleDeck.length} ${deckView === 'ALL' ? 'Cards' : deckView === 'DUE' ? 'Due' : 'Recent'}`}
          </span>
        </div>

        <h2 className="text-lg font-bold font-heading text-white tracking-tight">
          {isLoadingDeck ? 'Loading your deck...' : isDeckEmpty ? 'Your flashcard deck is empty' : currentVisibleCard?.topic}
        </h2>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono-code">
            <div className="flex items-center gap-1.5 text-[#8b949e]">
              <span className="material-symbols-outlined text-[#ff3344] text-sm">trending_up</span>
              <span>Retention Stability</span>
            </div>
            <div>
              <span className="text-white font-bold">{isDeckEmpty ? '0%' : `${currentVisibleCard?.retentionStability || 0}%`}</span>
              <span className="text-[#8b949e]"> • {isDeckEmpty ? 'Standby Queue' : 'Active Review'}</span>
            </div>
          </div>

          {/* Segmented Stability Progress Bar */}
          <div className="grid grid-cols-10 gap-1.5 w-full">
            {Array.from({ length: 10 }).map((_, idx) => {
              const isFilled = !isDeckEmpty && Boolean(currentVisibleCard) && idx < Math.round((currentVisibleCard?.retentionStability || 0) / 10);
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

      <div className="grid grid-cols-3 gap-1 rounded-xl border border-[#21262d] bg-[#161b22] p-1 font-mono-code">
        {[
          ['ALL', 'All Cards'],
          ['DUE', 'Due for Review'],
          ['RECENT', 'Recently Generated'],
        ].map(([view, label]) => (
          <button
            key={view}
            type="button"
            onClick={() => setDeckView(view as 'ALL' | 'DUE' | 'RECENT')}
            className={`rounded-lg px-2 py-2 text-[10px] font-bold transition-all ${deckView === view ? 'bg-[#ff3344] text-white' : 'text-[#8b949e] hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 2. FLASHCARD INTERACTIVE CONTAINER */}
      {isLoadingDeck ? (
        <div className="bg-[#10141a] rounded-2xl p-8 border border-[rgba(255,255,255,0.07)] text-center space-y-3 shadow-sm">
          <span className="material-symbols-outlined text-3xl text-[#ff3344] animate-spin">sync</span>
          <p className="text-xs font-mono-code text-[#8b949e]">Loading your flashcard deck...</p>
        </div>
      ) : isDeckEmpty || visibleDeck.length === 0 ? (
        <div className="bg-[#10141a] rounded-2xl p-6 border border-[rgba(255,255,255,0.07)] text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e]">
            <span className="material-symbols-outlined text-2xl">style</span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white uppercase tracking-wide">
              {isDeckEmpty ? 'NO FLASHCARDS IN DECK' : 'NO CARDS IN THIS VIEW'}
            </h3>
            <p className="text-xs text-[#8b949e] mt-1 max-w-sm mx-auto leading-relaxed">
              {isDeckEmpty ? 'Generate cards from AI Chat or add a manual card to begin.' : 'Try another view or generate a new card from AI Chat.'}
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
              onClick={() => setIsBuilderOpen(true)}
              className="py-2.5 px-4 bg-[#161b22] hover:bg-[#1f2530] text-white rounded-xl border border-[#30363d] hover:border-[#ff3344] font-mono-code text-xs font-semibold uppercase transition-all inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm text-[#ff3344]">add_card</span>
              <span>Add Manual Card</span>
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
                <span className="text-white font-bold">QUESTION {currentVisibleCard.cardNumber}</span>
                <span className="text-[#5c6370]">•</span>
                <span className="text-[#8b949e]">{currentVisibleCard.category}</span>
              </div>
              <button
                onClick={() => {
                  setIsAnswerRevealed(false);
                  setCurrentIndex((idx) => (idx + 1) % visibleDeck.length);
                }}
                className="text-[#8b949e] hover:text-white transition-colors"
                title="Next Question"
              >
                <span className="material-symbols-outlined text-base">swap_horiz</span>
              </button>
            </div>

            {/* Question text */}
            <h3 className="text-base sm:text-lg font-bold font-heading text-white leading-snug">
              {currentVisibleCard.question}
            </h3>

            {/* Key aspect hint */}
            <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#ff3344] text-base shrink-0 mt-0.5">
                lightbulb
              </span>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                <strong className="text-white font-medium">Key aspect:</strong> {currentVisibleCard.keyAspect}
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
                        {currentVisibleCard.comparison.leftTitle}
                      </span>
                      <span className="material-symbols-outlined text-[#00d2ff] text-sm">memory</span>
                    </div>
                    <div className="font-heading font-bold text-xs sm:text-sm text-white">
                      {currentVisibleCard.comparison.leftValue}
                    </div>
                    <div className="text-[11px] text-[#8b949e]">
                      {currentVisibleCard.comparison.leftSub}
                    </div>
                  </div>

                  {/* Hierarchical */}
                  <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-code text-[#8b949e] uppercase">
                        {currentVisibleCard.comparison.rightTitle}
                      </span>
                      <span className="material-symbols-outlined text-[#f59e0b] text-sm">account_tree</span>
                    </div>
                    <div className="font-heading font-bold text-xs sm:text-sm text-white">
                      {currentVisibleCard.comparison.rightValue}
                    </div>
                    <div className="text-[11px] text-[#8b949e]">
                      {currentVisibleCard.comparison.rightSub}
                    </div>
                  </div>
                </div>

                {/* Explanation box */}
                <div className="bg-[#161b22] p-3 rounded-xl border border-[#21262d] text-xs text-[#8b949e] leading-relaxed">
                  {currentVisibleCard.explanation}
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
          <span>{isDeckEmpty ? '0 Remaining' : `${deck.length} In Deck`}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#8b949e]">
          <span className="material-symbols-outlined text-sm">schedule</span>
          <span>{isDeckEmpty ? '0 Mins Est.' : `${Math.max(1, deck.length * 2)} Mins Est.`}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#ff3344]">
          <span className="material-symbols-outlined text-sm">local_fire_department</span>
          <span className="font-bold">{isDeckEmpty ? '0-Day Streak' : `${streakDays}-Day Streak`}</span>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#161b22] border border-[#ff3344] px-4 py-2 rounded-xl text-xs font-mono-code text-white shadow-2xl animate-fade-in">
          {feedbackToast}
        </div>
      )}

      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <form onSubmit={handleSaveManualCard} className="w-full max-w-lg space-y-4 rounded-2xl border border-[#ff3344]/30 bg-[#10141a] p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
              <div>
                <h2 className="font-heading text-sm font-bold uppercase text-white">Add Manual Card</h2>
                <p className="mt-1 text-[11px] font-mono-code text-[#8b949e]">Create a quick active-recall prompt.</p>
              </div>
              <button type="button" onClick={() => setIsBuilderOpen(false)} className="text-[#8b949e] hover:text-white" title="Close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <input required value={manualTopic} onChange={(event) => setManualTopic(event.target.value)} placeholder="Topic, e.g. Operating Systems" className="w-full rounded-xl border border-[#21262d] bg-[#0d1117] px-3 py-2.5 text-xs text-white outline-none focus:border-[#ff3344]" />
            <textarea required value={manualQuestion} onChange={(event) => setManualQuestion(event.target.value)} placeholder="Question" rows={3} className="w-full resize-none rounded-xl border border-[#21262d] bg-[#0d1117] px-3 py-2.5 text-xs text-white outline-none focus:border-[#ff3344]" />
            <textarea required value={manualAnswer} onChange={(event) => setManualAnswer(event.target.value)} placeholder="Answer or explanation" rows={4} className="w-full resize-none rounded-xl border border-[#21262d] bg-[#0d1117] px-3 py-2.5 text-xs text-white outline-none focus:border-[#ff3344]" />
            <div className="flex justify-end gap-2 border-t border-[#21262d] pt-3">
              <button type="button" onClick={() => setIsBuilderOpen(false)} className="rounded-xl border border-[#21262d] bg-[#161b22] px-4 py-2 text-xs font-mono-code text-[#8b949e]">Cancel</button>
              <button type="submit" className="rounded-xl bg-[#ff3344] px-4 py-2 text-xs font-mono-code font-bold uppercase text-white">Add to Deck</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
