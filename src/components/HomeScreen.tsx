import React, { useState, useEffect } from 'react';
import { OperatorProfile, ScreenType } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onStartDrill: () => void;
  isZeroData?: boolean;
  operatorProfile?: OperatorProfile;
  alertsWithin24hCount?: number;
  onOpenAlertCenter?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onStartDrill,
  isZeroData = false,
  operatorProfile,
  alertsWithin24hCount = 0,
  onOpenAlertCenter,
}) => {
  const [countdown, setCountdown] = useState({ days: 6, hours: 14, mins: 22, secs: 18 });
  const [actionToast, setActionToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 2500);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const format2 = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-[72px] pb-28 space-y-6 flex flex-col items-stretch">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#161b22] border border-[#00e599] rounded-xl text-xs font-mono-code text-[#00e599] shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{actionToast}</span>
        </div>
      )}

      {/* Zero Data Telemetry Alert Banner */}
      {isZeroData && (
        <div className="bg-[#0d1117] border border-[#ffaa00]/30 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#ffaa00] animate-ping"></span>
            <div>
              <div className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">
                STANDBY TELEMETRY MODE
              </div>
              <div className="text-[11px] text-[#8b949e]">
                Unindexed Operator Baseline • Zero Datasets Loaded
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono-code text-[#ffaa00] bg-[#ffaa00]/10 border border-[#ffaa00]/25 px-2 py-0.5 rounded uppercase">
            Fresh State
          </span>
        </div>
      )}

      {/* 24-Hour Proximity Alert Banner */}
      {!isZeroData && alertsWithin24hCount > 0 && onOpenAlertCenter && (
        <div
          id="tactical-proximity-hud-banner"
          onClick={onOpenAlertCenter}
          className="bg-gradient-to-r from-[#1a0f12] via-[#161b22] to-[#10141a] border border-[#ff3344]/50 hover:border-[#ff3344] rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all shadow-[0_0_15px_rgba(255,51,68,0.15)] group"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3344] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff3344]"></span>
            </span>
            <div>
              <div className="text-xs font-mono-code font-bold text-[#ff3344] uppercase tracking-wider flex items-center gap-1.5">
                <span>// 24H PROXIMITY ALERT</span>
                <span className="px-1.5 py-0.2 rounded bg-[#ff3344]/20 text-[10px] font-bold border border-[#ff3344]/40">
                  {alertsWithin24hCount} DEADLINE{alertsWithin24hCount > 1 ? 'S' : ''} DETECTED
                </span>
              </div>
              <div className="text-[11px] text-[#8b949e] group-hover:text-white transition-colors">
                Upcoming exams or tasks due within 24 hours. Tap to review tactical timeline.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono-code text-[#ff3344] group-hover:translate-x-0.5 transition-transform shrink-0">
            <span className="hidden sm:inline text-[11px] font-bold">INSPECT</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </div>
      )}

      {/* 1. PRIORITY TARGET EXAM CARD */}
      <div
        id="priority-target-exam-card"
        className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-4 shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center justify-between pb-1 border-b border-[#21262d]">
          <div className="flex items-center gap-2 text-[#ff3344]">
            <span className="material-symbols-outlined text-base">
              {isZeroData ? 'radar' : 'warning'}
            </span>
            <span className="text-xs font-mono-code font-bold tracking-wider uppercase">
              {isZeroData ? 'Threat Telemetry' : 'Priority Target'}
            </span>
          </div>
          <span
            className={`text-[10px] font-mono-code px-2 py-0.5 rounded uppercase tracking-wider ${
              isZeroData
                ? 'text-[#00e599] bg-[#00e599]/10 border border-[#00e599]/25'
                : 'text-[#ff3344] bg-[#ff3344]/10 border border-[#ff3344]/25'
            }`}
          >
            {isZeroData ? 'Standby / Idle' : 'High Severity'}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-heading font-bold text-white tracking-tight">
            {isZeroData
              ? 'NO ACTIVE TARGET EXAM'
              : (operatorProfile?.targetExam || 'CS301 MIDTERM EXAM')}
          </h2>
          <p className="text-xs text-[#8b949e] font-sans mt-0.5">
            {isZeroData
              ? 'Threat radar clear • No examinations scheduled in current cycle'
              : 'Main Auditorium C • Scope: Modules 1-7'}
          </p>
        </div>

        {/* T-Minus Countdown Well */}
        <div className="bg-[#0d1117] rounded-xl p-3.5 border border-[#21262d] flex items-center justify-between">
          <span className="text-[11px] font-mono-code text-[#8b949e] uppercase tracking-wider">
            T-MINUS TARGET
          </span>
          <div className="font-mono-code text-base font-bold text-white tracking-widest flex items-center gap-1">
            {isZeroData ? (
              <span className="text-[#8b949e] tracking-wider">--D : --H : --M : --S</span>
            ) : (
              <>
                <span>{format2(countdown.days)}</span>
                <span className="text-[#ff3344]">:</span>
                <span>{format2(countdown.hours)}</span>
                <span className="text-[#ff3344]">:</span>
                <span>{format2(countdown.mins)}</span>
                <span className="text-[#ff3344]">:</span>
                <span className="text-[#ff5c6c]">{format2(countdown.secs)}</span>
              </>
            )}
          </div>
        </div>

        {/* Readiness Assessment */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs font-mono-code">
            <span className="text-[#8b949e]">Readiness Assessment</span>
            <span className={isZeroData ? 'text-[#8b949e]' : 'text-white font-bold'}>
              {isZeroData ? '0% (Uncalibrated)' : '62%'}
            </span>
          </div>
          <div className="h-2 w-full bg-[#161b22] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ff3344] rounded-full shadow-[0_0_10px_rgba(255,51,68,0.5)] transition-all"
              style={{ width: isZeroData ? '0%' : '62%' }}
            />
          </div>
        </div>

        {isZeroData && (
          <button
            onClick={() => triggerToast('Syllabus indexing modal initiated')}
            className="w-full py-2 px-3 bg-[#161b22] hover:bg-[#1c222b] text-white rounded-xl border border-[#30363d] hover:border-[#ff3344] font-mono-code text-xs font-bold uppercase transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm text-[#ff3344]">add_circle</span>
            <span>+ Link Course Syllabus / Schedule Exam</span>
          </button>
        )}
      </div>

      {/* 2. TODAY'S SCHEDULE */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">
            Today&apos;s Schedule
          </span>
          <span className="text-[10px] font-mono-code text-[#8b949e] uppercase tracking-wider">
            {isZeroData ? '0 Sessions' : '2 Sessions'}
          </span>
        </div>

        {isZeroData ? (
          <div className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#00e599]">
              <span className="material-symbols-outlined text-xl">event_available</span>
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">
                FREE COGNITIVE BANDWIDTH
              </h3>
              <p className="text-xs text-[#8b949e] mt-1 max-w-sm mx-auto leading-relaxed">
                No mandatory lectures or lab blocks detected for this cycle. Free window available
                for spaced repetition reviews or targeted problem drills.
              </p>
            </div>
            <button
              onClick={() => triggerToast('Academic calendar sync prompt')}
              className="py-2 px-4 bg-[#161b22] hover:bg-[#1c222b] text-white rounded-xl border border-[#30363d] hover:border-[#ff3344] font-mono-code text-xs font-semibold uppercase transition-all inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm text-[#ff3344]">sync</span>
              <span>Sync Calendar / Add Session</span>
            </button>
          </div>
        ) : (
          <>
            {/* Session 1 */}
            <div className="bg-[#10141a] rounded-2xl p-4 border border-[rgba(255,255,255,0.07)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono-code text-xs font-bold text-white">10:00 — 11:30</span>
                  <span className="text-[10px] font-mono-code text-[#ff3344] bg-[#ff3344]/15 px-2 py-0.5 rounded border border-[#ff3344]/30 font-semibold uppercase">
                    In 25 Min
                  </span>
                </div>
                <span className="text-[11px] font-mono-code text-[#8b949e] bg-[#161b22] px-2 py-0.5 rounded border border-[#21262d]">
                  Hall B
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold font-heading text-white">CS301: Operating Systems</h3>
                <p className="text-xs text-[#8b949e] mt-0.5 leading-snug">
                  Virtual Memory Architectures, Paging &amp; TLB Invalidation
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#21262d] text-xs">
                <div className="flex items-center gap-2 text-[#8b949e] truncate">
                  <span className="material-symbols-outlined text-[#ff3344] text-base">description</span>
                  <span className="font-mono-code text-[11px] truncate">Slide_08_Virtual_Mem.pdf</span>
                </div>
                <span className="font-mono-code text-[10px] text-[#00e599] font-medium bg-[#00e599]/10 px-2 py-0.5 rounded border border-[#00e599]/25 shrink-0">
                  Synced 100%
                </span>
              </div>
            </div>

            {/* Session 2 */}
            <div className="bg-[#10141a] rounded-2xl p-4 border border-[rgba(255,255,255,0.07)] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono-code text-xs font-bold text-white">13:00 — 14:30</span>
                  <span className="text-[10px] font-mono-code text-[#8b949e] bg-[#161b22] px-2 py-0.5 rounded border border-[#21262d] uppercase">
                    Upcoming
                  </span>
                </div>
                <span className="text-[11px] font-mono-code text-[#8b949e] bg-[#161b22] px-2 py-0.5 rounded border border-[#21262d]">
                  Lab 3
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold font-heading text-white">CS312: Algorithm Design</h3>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#ff5c6c] pt-1">
                <span className="material-symbols-outlined text-sm">info</span>
                <span className="text-[11px]">Preparation: Bring Problem Set 3</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. CGPA TRAJECTORY */}
      <div
        id="cgpa-trajectory-card"
        className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
          <div>
            <h3 className="text-sm font-bold font-heading text-white">CGPA TRAJECTORY</h3>
            <p className="text-[11px] font-mono-code text-[#8b949e]">Academic Progress Matrix</p>
          </div>
          <span
            className={`text-[10px] font-mono-code px-2 py-0.5 rounded font-medium uppercase ${
              isZeroData
                ? 'text-[#8b949e] bg-[#161b22] border border-[#30363d]'
                : 'text-[#ff3344] bg-[#ff3344]/10 border border-[#ff3344]/25'
            }`}
          >
            {isZeroData ? 'Unranked' : 'Top 5% Class'}
          </span>
        </div>

        {/* Numbers Row */}
        <div className="grid grid-cols-3 gap-2 bg-[#0d1117] p-3 rounded-xl border border-[#21262d] text-center">
          <div>
            <span className="text-[10px] font-mono-code text-[#8b949e] uppercase">Baseline</span>
            <div className="font-mono-code text-sm font-bold text-white mt-0.5">
              {isZeroData ? '--' : '3.50'}
            </div>
          </div>
          <div className="border-x border-[#21262d]">
            <span className="text-[10px] font-mono-code text-[#ff3344] uppercase">Current</span>
            <div className="font-mono-code text-sm font-bold text-[#ff3344] mt-0.5">
              {isZeroData ? '--' : '3.84'}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono-code text-[#8b949e] uppercase">Delta</span>
            <div
              className={`font-mono-code text-sm font-bold mt-0.5 ${
                isZeroData ? 'text-[#8b949e]' : 'text-[#00e599]'
              }`}
            >
              {isZeroData ? '--' : '+0.19'}
            </div>
          </div>
        </div>

        {/* SVG Progress Graph */}
        <div className="py-2">
          <svg className="w-full h-24 overflow-visible" viewBox="0 0 320 80">
            <defs>
              <linearGradient id="cgpa-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff3344" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ff3344" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="20" y1="20" x2="300" y2="20" stroke="#21262d" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="20" y1="50" x2="300" y2="50" stroke="#21262d" strokeWidth="1" strokeDasharray="2 2" />

            {isZeroData ? (
              <>
                {/* Flat Zero Baseline */}
                <line x1="30" y1="50" x2="290" y2="50" stroke="#30363d" strokeWidth="2" strokeDasharray="4 4" />
                <text x="160" y="44" textAnchor="middle" fill="#8b949e" className="font-mono-code text-[10px] uppercase">
                  INITIALIZING SEMESTER 01 • 0 GRADED CREDITS
                </text>
              </>
            ) : (
              <>
                {/* Filled area */}
                <path
                  d="M 30 65 L 110 52 L 200 38 L 290 20 L 290 75 L 30 75 Z"
                  fill="url(#cgpa-gradient)"
                />

                {/* Trajectory Stroke */}
                <path
                  d="M 30 65 L 110 52 L 200 38 L 290 20"
                  fill="none"
                  stroke="#ff3344"
                  strokeWidth="2.5"
                />

                {/* Data Dots */}
                <circle cx="30" cy="65" r="3" fill="#ffffff" stroke="#ff3344" strokeWidth="1.5" />
                <circle cx="110" cy="52" r="3" fill="#ffffff" stroke="#ff3344" strokeWidth="1.5" />
                <circle cx="200" cy="38" r="3" fill="#ffffff" stroke="#ff3344" strokeWidth="1.5" />
                <circle cx="290" cy="20" r="4.5" fill="#ffffff" stroke="#ff3344" strokeWidth="2" className="animate-pulse" />
              </>
            )}
          </svg>

          <div className="grid grid-cols-4 text-center font-mono-code text-[10px] mt-1 text-[#8b949e]">
            <div>
              <span>Sem 1</span>
              <div className="text-white">{isZeroData ? '--' : '3.65'}</div>
            </div>
            <div>
              <span>Sem 2</span>
              <div className="text-white">{isZeroData ? '--' : '3.71'}</div>
            </div>
            <div>
              <span>Sem 3</span>
              <div className="text-white">{isZeroData ? '--' : '3.79'}</div>
            </div>
            <div>
              <span className={isZeroData ? 'text-[#8b949e]' : 'text-[#ff3344] font-bold'}>Sem 4</span>
              <div className={isZeroData ? 'text-[#8b949e]' : 'text-[#ff3344] font-bold'}>
                {isZeroData ? '--' : '3.84'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats matrix */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#21262d] text-center">
          <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#21262d]">
            <span className="text-[10px] font-mono-code text-[#8b949e] uppercase">Credits</span>
            <div className="font-mono-code text-xs font-bold text-white mt-0.5">
              {isZeroData ? '0 / 128' : '78 / 128'}
            </div>
          </div>
          <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#21262d]">
            <span className="text-[10px] font-mono-code text-[#8b949e] uppercase">Cognitive XP</span>
            <div className="font-mono-code text-xs font-bold text-[#ff3344] mt-0.5">
              {isZeroData ? '0 XP' : '14,920'}
            </div>
          </div>
          <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#21262d]">
            <span className="text-[10px] font-mono-code text-[#8b949e] uppercase">Accuracy</span>
            <div className="font-mono-code text-xs font-bold text-white mt-0.5">
              {isZeroData ? '--' : '94.8%'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. URGENT DIRECTIVES */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">
            Urgent Directives
          </span>
          <span className="text-[10px] font-mono-code text-[#8b949e] uppercase tracking-wider">
            {isZeroData ? '0 Pending' : '3 Pending'}
          </span>
        </div>

        {isZeroData ? (
          <div className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#00e599]">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
            <div>
              <h4 className="text-sm font-bold font-heading text-white">ALL DIRECTIVES RESOLVED</h4>
              <p className="text-xs text-[#8b949e] mt-1 max-w-sm mx-auto">
                No active deadlines or homework submissions in the triage buffer. System status is
                all-clear.
              </p>
            </div>
            <button
              onClick={() => triggerToast('Create directive modal')}
              className="py-2 px-3 bg-[#161b22] hover:bg-[#1c222b] text-white rounded-xl border border-[#30363d] hover:border-[#ff3344] font-mono-code text-xs font-semibold uppercase transition-all inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm text-[#ff3344]">add_task</span>
              <span>+ Create Directive</span>
            </button>
          </div>
        ) : (
          <>
            {/* Directive 1 */}
            <div className="bg-[#10141a] rounded-2xl p-4 border border-[rgba(255,255,255,0.07)] border-l-4 border-l-[#ff3344] space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-[11px] font-mono-code">
                <span className="text-[#ff3344] font-bold uppercase tracking-wider">
                  Critical Priority
                </span>
                <span className="text-[#8b949e]">Due in 28h</span>
              </div>
              <h4 className="text-sm font-bold text-white font-heading">Distributed Systems HW 2</h4>
              <p className="text-xs text-[#8b949e]">Implement Raft Consensus State Machine</p>
            </div>

            {/* Directive 2 */}
            <div className="bg-[#10141a] rounded-2xl p-4 border border-[rgba(255,255,255,0.07)] border-l-4 border-l-[#38bdf8] space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-[11px] font-mono-code">
                <span className="text-[#38bdf8] font-semibold uppercase tracking-wider">Active Target</span>
                <span className="text-[#8b949e]">Fri 09:00</span>
              </div>
              <h4 className="text-sm font-bold text-white font-heading">Machine Learning Quiz 3</h4>
              <p className="text-xs text-[#8b949e]">Backprop derivations &amp; Attention Heads</p>
            </div>

            {/* Directive 3 */}
            <div
              onClick={() => onNavigate('DECKS')}
              className="bg-[#10141a] rounded-2xl p-4 border border-[rgba(255,255,255,0.07)] border-l-4 border-l-[#8b949e] space-y-1.5 shadow-sm cursor-pointer hover:border-[#ff3344]/40 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] font-mono-code">
                <span className="text-[#8b949e] uppercase tracking-wider">Cooldown Review</span>
                <span className="text-[#ff3344] font-bold">18 Stale Cards</span>
              </div>
              <h4 className="text-sm font-bold text-white font-heading">Virtual Memory Review Deck</h4>
              <p className="text-xs text-[#8b949e]">Spaced recall protocol initiated • Tap to review</p>
            </div>
          </>
        )}
      </div>

      {/* 5. INDEXED INTELLIGENCE (NotebookLM Grounded) */}
      <div
        id="indexed-intelligence-card"
        className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-3.5 shadow-sm"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff3344] text-base">psychology</span>
            <span className="text-xs font-mono-code font-bold tracking-wider uppercase text-white">
              Indexed Intelligence
            </span>
          </div>
          <span className="text-[10px] font-mono-code text-[#8b949e]">
            {isZeroData ? 'Standby' : 'NotebookLM Grounded'}
          </span>
        </div>

        <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d] space-y-2">
          {isZeroData ? (
            <div className="py-2 text-center space-y-1">
              <span className="material-symbols-outlined text-[#8b949e] text-2xl">upload_file</span>
              <h4 className="text-xs font-bold text-white font-mono-code">
                NO COURSE MATERIALS INDEXED
              </h4>
              <p className="text-[11px] text-[#8b949e] leading-relaxed max-w-xs mx-auto">
                Ingest PDF lecture slides, syllabus, or past papers to generate grounded AI answers
                and targeted practice drills.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs font-mono-code">
                <span className="text-[10px] font-bold text-[#ff3344] bg-[#ff3344]/15 px-1.5 py-0.5 rounded border border-[#ff3344]/30">
                  PDF
                </span>
                <span className="text-[#8b949e]">42 Pages • Embedded</span>
              </div>

              <h4 className="text-sm font-bold text-white font-mono-code truncate">
                CS301_Lecture_08_Virtual_Memory.pdf
              </h4>

              <p className="text-xs text-[#8b949e] leading-relaxed">
                Multi-level Page Tables, TLB Shootdown, Inverted Indexes
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            id="home-execute-chat-btn"
            onClick={() => onNavigate('AI-NET')}
            className="bg-[#ff3344] hover:bg-[#e62637] text-white py-3 px-3 rounded-xl font-mono-code text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 glow-crimson active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>{isZeroData ? 'Launch Chat' : 'Execute Chat'}</span>
          </button>

          <button
            id="home-generate-drill-btn"
            onClick={onStartDrill}
            className="bg-[#161b22] hover:bg-[#1c222b] text-white py-3 px-3 rounded-xl border border-[#30363d] hover:border-[#ff3344]/40 font-mono-code text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-base text-[#ff3344]">bolt</span>
            <span>{isZeroData ? 'Sample Drill' : 'Generate Drill'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
