import React, { useState, useEffect } from 'react';
import { CognitiveRadar } from './CognitiveRadar';
import { OPERATOR_PROFILE, PRESET_OPERATORS, isProfileZeroData } from '../data';
import { OperatorProfile, ScreenType } from '../types';

interface StatsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onStartDrill: () => void;
  isZeroData?: boolean;
  profile?: OperatorProfile;
  onEditProfile?: () => void;
  onOpenLogin?: () => void;
  onSwitchProfile?: (profile: OperatorProfile) => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  onNavigate,
  onStartDrill,
  isZeroData = false,
  profile = OPERATOR_PROFILE,
  onEditProfile,
  onOpenLogin,
  onSwitchProfile,
}) => {
  const [countdown, setCountdown] = useState({ days: 6, hours: 14, mins: 22, secs: 40 });
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [loadoutState, setLoadoutState] = useState({
    spaced: !isZeroData,
    recall: !isZeroData,
    caffeine: !isZeroData,
  });

  // Sync loadout defaults if dataMode toggles
  useEffect(() => {
    setLoadoutState({
      spaced: !isZeroData,
      recall: !isZeroData,
      caffeine: !isZeroData,
    });
  }, [isZeroData]);

  // T-minus countdown ticker
  useEffect(() => {
    if (isZeroData) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isZeroData]);

  const format2 = (n: number) => String(n).padStart(2, '0');
  const equippedCount = Object.values(loadoutState).filter(Boolean).length;

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-[72px] pb-28 space-y-6 flex flex-col items-stretch">
      {/* 1. OPERATOR PROFILE CARD */}
      <div
        id="operator-profile-card"
        className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative shrink-0 self-start">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#30363d] bg-[#161b22]">
              <img
                alt={profile.name}
                className="w-full h-full object-cover"
                src={profile.avatarUrl}
              />
            </div>
            <span className="absolute -bottom-2 -right-1.5 bg-[#ff3344] text-white font-mono-code text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
              LVL {isZeroData ? 1 : profile.level}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg font-bold font-heading text-white tracking-tight truncate">
                {profile.name}
              </h1>
              <span
                className={`text-[11px] font-mono-code px-2 py-0.5 rounded border shrink-0 font-medium ${
                  isZeroData
                    ? 'text-[#8b949e] bg-[#161b22] border-[#21262d]'
                    : 'text-[#ff3344] bg-[#ff3344]/10 border-[#ff3344]/20'
                }`}
              >
                {isZeroData ? 'UNRANKED CADET' : profile.rank}
              </span>
            </div>
            <p className="text-xs text-[#8b949e] font-mono-code mt-0.5 truncate">
              {profile.handle ? `${profile.handle} • ` : ''}ROLE: {isZeroData ? 'OPERATOR STANDBY' : profile.role}
            </p>
            {profile.institution && (
              <p className="text-[11px] text-[#5c6370] font-mono-code truncate">
                {profile.institution}
              </p>
            )}

            <div className="mt-3">
              <div className="flex justify-between items-center text-[10px] font-mono-code mb-1.5">
                <span className="text-[#8b949e] uppercase tracking-wider">EXP Progress</span>
                <span className="text-white font-semibold">
                  {isZeroData ? '0' : profile.xp.toLocaleString()}{' '}
                  <span className="text-[#8b949e] font-normal">
                    / {isZeroData ? '1,000' : profile.xpMax.toLocaleString()} XP
                  </span>
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#1c222b] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff3344] rounded-full transition-all shadow-[0_0_8px_rgba(255,51,68,0.5)]"
                  style={{
                    width: isZeroData
                      ? '0%'
                      : `${(profile.xp / profile.xpMax) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Action Toolbar */}
        <div className="pt-2 border-t border-[#21262d] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono-code text-[#8b949e]">
              CGPA: <strong className="text-white">{isZeroData ? '0.00' : profile.cgpa.toFixed(2)}</strong> / {profile.targetCgpa.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onEditProfile && (
              <button
                id="edit-profile-action-btn"
                type="button"
                onClick={onEditProfile}
                className="px-2.5 py-1 rounded-lg bg-[#161b22] hover:bg-[#1f2530] text-[#ff3344] border border-[#ff3344]/40 hover:border-[#ff3344] text-[11px] font-mono-code font-bold inline-flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                <span>Edit Profile</span>
              </button>
            )}
            {onOpenLogin && (
              <button
                id="switch-operator-action-btn"
                type="button"
                onClick={onOpenLogin}
                className="px-2.5 py-1 rounded-lg bg-[#161b22] hover:bg-[#1f2530] text-[#8b949e] hover:text-white border border-[#21262d] text-[11px] font-mono-code font-medium inline-flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                <span>Gateway</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Account Switcher (Dummy Data vs Zero Data accounts) */}
        {onSwitchProfile && (
          <div className="pt-2.5 border-t border-[#21262d] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono-code text-[#8b949e]">
              <span className="uppercase font-bold tracking-wider">Account Telemetry Mode</span>
              <span>1-Click Switch</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {PRESET_OPERATORS.map((preset) => {
                const isCurrent = profile.email === preset.email;
                const presetZero = isProfileZeroData(preset);
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => onSwitchProfile(preset)}
                    className={`px-2 py-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-all ${
                      isCurrent
                        ? 'bg-[#ff3344]/10 border-[#ff3344] text-white'
                        : 'bg-[#161b22] border-[#21262d] hover:border-[#30363d] text-[#8b949e] hover:text-white'
                    }`}
                  >
                    <img
                      src={preset.avatarUrl}
                      alt={preset.name}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1 truncate">
                      <span className="text-[10px] font-mono-code font-bold block truncate">
                        {preset.name.split(' ')[0]}
                      </span>
                      <span
                        className={`text-[8px] font-mono-code font-semibold block leading-none truncate ${
                          presetZero ? 'text-[#8b949e]' : 'text-[#00e599]'
                        }`}
                      >
                        {presetZero ? 'Zero Data' : 'Dummy Data'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. EXAM READINESS & BOSS TELEMETRY */}
      <div
        id="battle-readiness-card"
        className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-base ${
                isZeroData ? 'text-[#8b949e]' : 'text-[#ff3344]'
              }`}
            >
              swords
            </span>
            <span className="text-xs font-mono-code font-bold tracking-wider uppercase text-white">
              Battle Readiness
            </span>
          </div>
          <span
            className={`text-[10px] font-mono-code px-2 py-0.5 rounded font-medium border ${
              isZeroData
                ? 'text-[#8b949e] bg-[#161b22] border-[#21262d]'
                : 'text-[#00e599] bg-[#00e599]/10 border-[#00e599]/20'
            }`}
          >
            {isZeroData ? 'STANDBY' : 'ACTIVE'}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="block text-[11px] font-mono-code text-[#8b949e] uppercase tracking-wider">
              Exam Readiness
            </span>
            <div className="text-4xl font-mono-code font-bold tracking-tight text-white mt-1">
              {isZeroData ? '0.0' : '78.4'}
              <span
                className={`text-xl font-heading font-semibold ${
                  isZeroData ? 'text-[#8b949e]' : 'text-[#ff3344]'
                }`}
              >
                %
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 bg-[#161b22] px-2.5 py-1.5 rounded-lg border border-[#21262d]">
              <span
                className={`material-symbols-outlined text-base ${
                  isZeroData ? 'text-[#8b949e]' : 'text-[#ff3344] animate-bounce'
                }`}
              >
                local_fire_department
              </span>
              <span className="text-xs font-mono-code font-bold text-white">
                {isZeroData ? '0 DAYS' : '14 DAYS'}
              </span>
            </div>
            <span className="text-[10px] font-mono-code text-[#8b949e] mt-1 uppercase tracking-wider">
              Study Streak
            </span>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isZeroData
              ? 'bg-[#0d1117] border-[#21262d]'
              : 'bg-[#0d1117] border-[#ff3344]/25'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                isZeroData
                  ? 'bg-[#161b22] border-[#21262d] text-[#8b949e]'
                  : 'bg-[#ff3344]/10 border-[#ff3344]/30 text-[#ff3344]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isZeroData ? 'shield' : 'skull'}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold font-mono-code text-white uppercase tracking-wide">
                {isZeroData ? 'No Boss Exam Scheduled' : 'Boss: CS301 Midterm'}
              </div>
              <div className="text-[11px] text-[#8b949e] truncate">
                {isZeroData
                  ? 'Connect academic schedule to activate target telemetry'
                  : 'Algorithmic Complexity & Structures'}
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] px-3 py-1.5 rounded-lg border border-[#21262d] self-start sm:self-auto font-mono-code text-xs font-bold text-[#8b949e] tracking-widest">
            {isZeroData ? '00D : 00H : 00M' : `${format2(countdown.days)}D : ${format2(countdown.hours)}H : ${format2(countdown.mins)}M`}
          </div>
        </div>
      </div>

      {/* 3. RPG 6-AXIS COGNITIVE RADAR */}
      <CognitiveRadar onDeficitClick={onStartDrill} isZeroData={isZeroData} />

      {/* 4. PRIORITY DIAGNOSTICS & WEAKNESS RECTIFICATION */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">
            Priority Diagnostics
          </span>
          <span className="text-[10px] font-mono-code text-[#8b949e] uppercase tracking-wider">
            {isZeroData ? '0 Actionable' : '1 Actionable'}
          </span>
        </div>

        {isZeroData ? (
          <div className="bg-[#10141a] rounded-2xl p-6 border border-[#21262d] relative shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-[#161b22] border border-[#21262d] flex items-center justify-center mx-auto mb-3 text-[#00e599]">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>

            <span className="text-[10px] font-mono-code font-bold text-[#00e599] bg-[#00e599]/10 border border-[#00e599]/20 px-2.5 py-0.5 rounded uppercase tracking-wider inline-block mb-2">
              DIAGNOSTIC TELEMETRY: CLEAR
            </span>

            <h2 className="text-base font-bold font-heading text-white leading-snug">
              No Critical Knowledge Deficits Detected
            </h2>
            <p className="text-xs text-[#8b949e] mt-1.5 leading-relaxed max-w-md mx-auto">
              Diagnostic telemetry is in nominal standby. Run your initial 90-second benchmark drill to calibrate your cognitive matrix and detect formulation latency.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                id="run-benchmark-calibration-btn"
                onClick={onStartDrill}
                className="bg-[#ff3344] hover:bg-[#e62637] text-white py-3 px-5 rounded-xl font-mono-code text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 active:scale-[0.98] glow-crimson"
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>
                <span>Run Initial Calibration Drill</span>
              </button>

              <button
                id="diagnostic-empty-info-btn"
                onClick={() => setShowDiagnosticModal(true)}
                className="w-11 h-11 rounded-xl bg-[#161b22] border border-[#21262d] text-[#8b949e] hover:text-white hover:border-[#ff3344]/40 flex items-center justify-center shrink-0 transition-colors"
                title="Telemetry Spec Info"
              >
                <span className="material-symbols-outlined text-base">info</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#10141a] rounded-2xl p-5 border border-[#ff3344]/30 relative shadow-sm hover:border-[#ff3344]/60 transition-colors">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#21262d]">
              <span className="text-[10px] font-mono-code font-bold text-[#ff3344] bg-[#ff3344]/10 border border-[#ff3344]/20 px-2 py-0.5 rounded uppercase tracking-wider">
                Critical Deficit
              </span>
              <span className="text-xs font-mono-code font-bold text-[#ff3344]">58% Fail Rate</span>
            </div>

            <div className="mt-3">
              <h2 className="text-base font-bold font-heading text-white leading-snug">
                Dynamic Programming: Memoization Tables
              </h2>
              <p className="text-xs text-[#8b949e] mt-1.5 leading-relaxed">
                State transition matrix latency spikes during 2D subproblem recurrence under 90-second drills.
              </p>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#21262d] flex items-center gap-3">
              <button
                id="run-protocol-dp-drill-btn"
                onClick={onStartDrill}
                className="flex-1 bg-[#ff3344] hover:bg-[#e62637] text-white py-3.5 px-4 rounded-xl font-mono-code text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 active:scale-[0.98] glow-crimson"
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>
                <span>Run Protocol: DP Drill</span>
              </button>

              <button
                id="diagnostic-info-btn"
                onClick={() => setShowDiagnosticModal(true)}
                className="w-11 h-11 rounded-xl bg-[#161b22] border border-[#21262d] text-[#8b949e] hover:text-white hover:border-[#ff3344]/40 flex items-center justify-center shrink-0 transition-colors"
                title="Diagnostic Telemetry Info"
              >
                <span className="material-symbols-outlined text-base">info</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. COGNITIVE LOADOUT / BUFFS */}
      <div className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-3 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff3344] text-base">shield</span>
            <span className="text-xs font-mono-code font-bold tracking-wider uppercase text-white">
              Active Cognitive Loadout
            </span>
          </div>
          <span className="text-[10px] font-mono-code text-[#8b949e] uppercase tracking-wider">
            {equippedCount} / 3 Equipped
          </span>
        </div>

        <div className="space-y-2">
          {/* Perk 1 */}
          <div
            onClick={() => setLoadoutState((s) => ({ ...s, spaced: !s.spaced }))}
            className="flex items-center justify-between p-3 rounded-xl bg-[#0d1117] border border-[#21262d] hover:border-[#ff3344]/30 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#161b22] flex items-center justify-center text-[#ff3344] shrink-0 border border-[#21262d]">
                <span className="material-symbols-outlined text-lg">neurology</span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white uppercase truncate">
                  Spaced Repetition V2
                </div>
                <div className="text-[10px] font-mono-code text-[#ff3344] mt-0.5 font-medium">
                  +15% Long-Term Retention
                </div>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono-code px-2 py-0.5 rounded border uppercase shrink-0 ml-2 ${
                loadoutState.spaced
                  ? 'text-[#00e599] bg-[#00e599]/10 border-[#00e599]/30'
                  : 'text-[#8b949e] bg-[#161b22] border-[#21262d]'
              }`}
            >
              {loadoutState.spaced ? 'EQUIPPED' : 'STANDBY'}
            </span>
          </div>

          {/* Perk 2 */}
          <div
            onClick={() => setLoadoutState((s) => ({ ...s, recall: !s.recall }))}
            className="flex items-center justify-between p-3 rounded-xl bg-[#0d1117] border border-[#21262d] hover:border-[#ff3344]/30 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#161b22] flex items-center justify-center text-[#ff3344] shrink-0 border border-[#21262d]">
                <span className="material-symbols-outlined text-lg">bolt</span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white uppercase truncate">
                  Active Recall Overdrive
                </div>
                <div className="text-[10px] font-mono-code text-[#ff3344] mt-0.5 font-medium">
                  +20% Rapid Response
                </div>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono-code px-2 py-0.5 rounded border uppercase shrink-0 ml-2 ${
                loadoutState.recall
                  ? 'text-[#00e599] bg-[#00e599]/10 border-[#00e599]/30'
                  : 'text-[#8b949e] bg-[#161b22] border-[#21262d]'
              }`}
            >
              {loadoutState.recall ? 'EQUIPPED' : 'STANDBY'}
            </span>
          </div>

          {/* Perk 3 */}
          <div
            onClick={() => setLoadoutState((s) => ({ ...s, caffeine: !s.caffeine }))}
            className="flex items-center justify-between p-3 rounded-xl bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#161b22] flex items-center justify-center text-[#8b949e] shrink-0 border border-[#21262d]">
                <span className="material-symbols-outlined text-lg">coffee</span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white uppercase truncate">
                  Caffeine Neural Shield
                </div>
                <div className="text-[10px] font-mono-code text-[#8b949e] mt-0.5">
                  -10% Mental Fatigue
                </div>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono-code px-2 py-0.5 rounded border uppercase shrink-0 ml-2 ${
                loadoutState.caffeine
                  ? 'text-[#00e599] bg-[#00e599]/10 border-[#00e599]/30'
                  : 'text-[#8b949e] bg-[#161b22] border-[#21262d]'
              }`}
            >
              {loadoutState.caffeine ? 'EQUIPPED' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>

      {/* DIAGNOSTIC MODAL */}
      {showDiagnosticModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#10141a] border border-[#ff3344]/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff3344]">diagnostics</span>
                <h3 className="font-heading font-bold text-white text-sm">TELEMETRY DIAGNOSTIC REPORT</h3>
              </div>
              <button
                onClick={() => setShowDiagnosticModal(false)}
                className="text-[#8b949e] hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              {isZeroData
                ? 'No past session friction recorded. The benchmark drill presents timed micro-problems in graph algorithms, recurrence relations, and relational indexing to calibrate cognitive latency metrics.'
                : 'Based on Maya’s last 6 homework drills in CS312, dynamic programming memoization tables exhibited high cognitive friction. 58% of subproblem state choices reverted to redundant re-computation under timed conditions.'}
            </p>
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#21262d] font-mono-code text-xs text-[#00d2ff]">
              {isZeroData
                ? 'Recommended protocol: Execute 1 benchmark drill to generate your baseline 6-axis polygon.'
                : 'Recommended intervention: 3 runs of Knapsack & LCS state relation formulation drills.'}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowDiagnosticModal(false);
                  onStartDrill();
                }}
                className="flex-1 bg-[#ff3344] hover:bg-[#e62637] text-white font-mono-code text-xs py-2.5 rounded-xl font-bold"
              >
                {isZeroData ? 'START BENCHMARK DRILL' : 'START INTERVENTION'}
              </button>
              <button
                onClick={() => setShowDiagnosticModal(false)}
                className="px-4 bg-[#161b22] text-[#8b949e] hover:text-white font-mono-code text-xs py-2.5 rounded-xl border border-[#21262d]"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
