import React from 'react';
import { ScreenType } from '../types';

interface LoadingSkeletonProps {
  screen?: ScreenType;
  onCancel?: () => void;
  statusText?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  screen = 'HOME',
  onCancel,
  statusText = 'SYNCHRONIZING TELEMETRY STREAM...',
}) => {
  return (
    <div
      id="loading-skeleton-container"
      className="w-full max-w-xl mx-auto px-4 pt-[72px] pb-28 space-y-5 flex flex-col items-stretch animate-fadeIn"
    >
      {/* 1. Tactical Buffering Status Banner */}
      <div className="bg-[#10141a] rounded-xl p-3.5 border border-[#ff3344]/30 flex items-center justify-between gap-3 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer-crimson pointer-events-none opacity-40"></div>
        <div className="flex items-center gap-2.5 z-10">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff3344] animate-ping"></span>
          <div>
            <span className="text-xs font-mono-code font-bold text-white tracking-wider uppercase block">
              {statusText}
            </span>
            <span className="text-[10px] font-mono-code text-[#8b949e] block">
              StudyNet Gateway // Node HK-47 • Decrypting Academic Cache
            </span>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="z-10 text-[10px] font-mono-code text-[#ff3344] hover:underline px-2 py-1 rounded bg-[#161b22] border border-[#ff3344]/40"
          >
            Skip
          </button>
        )}
      </div>

      {/* 2. Screen-Specific Skeletons */}
      {screen === 'HOME' && <HomeSkeleton />}
      {screen === 'SCHED' && <SchedSkeleton />}
      {screen === 'AI-NET' && <AiNetSkeleton />}
      {screen === 'DECKS' && <DecksSkeleton />}
      {screen === 'STATS' && <StatsSkeleton />}
      {screen === 'DRILL' && <DrillSkeleton />}
      {screen === 'LOGIN' && <LoginSkeleton />}
      {screen === 'EDIT_PROFILE' && <StatsSkeleton />}
    </div>
  );
};

/* --- HOME SKELETON --- */
const HomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Boss Countdown Card Skeleton */}
      <div className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 rounded skeleton-shimmer"></div>
          <div className="h-5 w-24 rounded-full skeleton-shimmer-crimson"></div>
        </div>

        <div className="space-y-1.5">
          <div className="h-6 w-3/4 rounded skeleton-shimmer"></div>
          <div className="h-3.5 w-1/2 rounded skeleton-shimmer"></div>
        </div>

        {/* 4 Countdown Boxes */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#0d1117] rounded-xl p-3 border border-[#21262d] flex flex-col items-center gap-1.5"
            >
              <div className="h-7 w-10 rounded skeleton-shimmer"></div>
              <div className="h-2.5 w-8 rounded skeleton-shimmer"></div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="h-11 w-full rounded-xl skeleton-shimmer-crimson"></div>
      </div>

      {/* Cognitive Radar Card Skeleton */}
      <div className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-4 w-40 rounded skeleton-shimmer"></div>
            <div className="h-3 w-48 rounded skeleton-shimmer"></div>
          </div>
          <div className="h-5 w-16 rounded skeleton-shimmer"></div>
        </div>

        {/* Wireframe radar circle shimmer */}
        <div className="py-6 flex flex-col items-center justify-center relative">
          <div className="w-48 h-48 rounded-full border border-[#21262d] flex items-center justify-center relative skeleton-shimmer-subtle">
            <div className="w-36 h-36 rounded-full border border-dashed border-[#30363d] flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-[#21262d]"></div>
            </div>
            {/* Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#21262d]"></div>
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#21262d]"></div>
          </div>
        </div>

        {/* Radar topic chips shimmer */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 rounded-lg skeleton-shimmer"></div>
          ))}
        </div>
      </div>

      {/* Protocol Recommendation Skeleton */}
      <div className="bg-[#10141a] rounded-2xl p-4 border border-[rgba(255,255,255,0.07)] flex items-center justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-3.5 w-24 rounded skeleton-shimmer-crimson"></div>
          <div className="h-4 w-48 rounded skeleton-shimmer"></div>
        </div>
        <div className="h-9 w-24 rounded-xl skeleton-shimmer"></div>
      </div>
    </div>
  );
};

/* --- SCHEDULE SKELETON --- */
const SchedSkeleton: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Date Picker Strip Skeleton */}
      <div className="flex items-center justify-between gap-1.5 overflow-x-hidden">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex-1 h-14 rounded-xl skeleton-shimmer border border-[#21262d]"
          ></div>
        ))}
      </div>

      {/* Transit Window Banner Skeleton */}
      <div className="bg-[#10141a] rounded-2xl p-4 border border-[rgba(255,255,255,0.07)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl skeleton-shimmer"></div>
          <div className="space-y-1.5">
            <div className="h-4 w-36 rounded skeleton-shimmer"></div>
            <div className="h-3 w-28 rounded skeleton-shimmer"></div>
          </div>
        </div>
        <div className="h-7 w-20 rounded-lg skeleton-shimmer-emerald"></div>
      </div>

      {/* Timeline Items Skeleton */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-[#10141a] rounded-2xl p-4 border border-[rgba(255,255,255,0.07)] space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-20 rounded skeleton-shimmer"></div>
              <div className="h-5 w-16 rounded-full skeleton-shimmer"></div>
            </div>
            <div className="h-5 w-48 rounded skeleton-shimmer"></div>
            <div className="h-3.5 w-32 rounded skeleton-shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- AI-NET SKELETON --- */
const AiNetSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Document Index Card Skeleton */}
      <div className="bg-[#10141a] rounded-2xl p-4 border border-[rgba(255,255,255,0.07)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg skeleton-shimmer-crimson"></div>
          <div className="space-y-1">
            <div className="h-4 w-44 rounded skeleton-shimmer"></div>
            <div className="h-2.5 w-28 rounded skeleton-shimmer"></div>
          </div>
        </div>
        <div className="h-6 w-20 rounded skeleton-shimmer"></div>
      </div>

      {/* Chat Messages Skeleton */}
      <div className="space-y-4 pt-2">
        {/* User Prompt Skeleton */}
        <div className="flex justify-end">
          <div className="max-w-[75%] bg-[#161b22] rounded-2xl p-3.5 border border-[#21262d] space-y-1.5">
            <div className="h-3.5 w-40 rounded skeleton-shimmer"></div>
            <div className="h-3 w-28 rounded skeleton-shimmer"></div>
          </div>
        </div>

        {/* AI Answer Skeleton */}
        <div className="bg-[#10141a] rounded-2xl p-4 border border-[#21262d] space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full skeleton-shimmer-crimson"></div>
              <div className="h-3.5 w-32 rounded skeleton-shimmer"></div>
            </div>
            <div className="h-4 w-12 rounded skeleton-shimmer"></div>
          </div>

          <div className="space-y-2">
            <div className="h-3.5 w-full rounded skeleton-shimmer"></div>
            <div className="h-3.5 w-5/6 rounded skeleton-shimmer"></div>
            <div className="h-3.5 w-4/6 rounded skeleton-shimmer"></div>
          </div>

          {/* Code Block Skeleton */}
          <div className="bg-[#0d1117] rounded-xl p-3 border border-[#21262d] space-y-2">
            <div className="h-3 w-24 rounded skeleton-shimmer"></div>
            <div className="h-3 w-48 rounded skeleton-shimmer"></div>
            <div className="h-3 w-36 rounded skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- DECKS SKELETON --- */
const DecksSkeleton: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Retention Card Skeleton */}
      <div className="bg-[#10141a] rounded-2xl p-4 border border-[rgba(255,255,255,0.07)] flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-36 rounded skeleton-shimmer"></div>
          <div className="h-3 w-24 rounded skeleton-shimmer"></div>
        </div>
        <div className="h-8 w-24 rounded-lg skeleton-shimmer-emerald"></div>
      </div>

      {/* Big Flashcard Skeleton */}
      <div className="min-h-[260px] bg-[#10141a] rounded-2xl p-6 border border-[#21262d] flex flex-col justify-between space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded skeleton-shimmer"></div>
          <div className="h-5 w-16 rounded-full skeleton-shimmer"></div>
        </div>

        <div className="space-y-3 py-4 flex flex-col items-center text-center">
          <div className="h-5 w-4/5 rounded skeleton-shimmer"></div>
          <div className="h-5 w-3/5 rounded skeleton-shimmer"></div>
          <div className="h-3 w-32 rounded skeleton-shimmer-subtle mt-4"></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="h-10 rounded-xl skeleton-shimmer"></div>
          <div className="h-10 rounded-xl skeleton-shimmer"></div>
          <div className="h-10 rounded-xl skeleton-shimmer-emerald"></div>
        </div>
      </div>
    </div>
  );
};

/* --- STATS SKELETON --- */
const StatsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Operator Card Skeleton */}
      <div className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl skeleton-shimmer shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <div className="h-5 w-36 rounded skeleton-shimmer"></div>
              <div className="h-4 w-20 rounded-full skeleton-shimmer-crimson"></div>
            </div>
            <div className="h-3 w-24 rounded skeleton-shimmer"></div>
            <div className="h-2 w-full rounded-full skeleton-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Boss Telemetry Skeleton */}
      <div className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-40 rounded skeleton-shimmer"></div>
          <div className="h-6 w-16 rounded-lg skeleton-shimmer-crimson"></div>
        </div>
        <div className="h-3 w-3/4 rounded skeleton-shimmer"></div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-14 rounded-xl skeleton-shimmer bg-[#0d1117]"></div>
          <div className="h-14 rounded-xl skeleton-shimmer bg-[#0d1117]"></div>
        </div>
      </div>

      {/* Diagnostic Checklist Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-32 rounded skeleton-shimmer mb-3"></div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-xl skeleton-shimmer bg-[#10141a] border border-[#21262d]"
          ></div>
        ))}
      </div>
    </div>
  );
};

/* --- DRILL SKELETON --- */
const DrillSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="h-4 w-44 rounded skeleton-shimmer"></div>
      <div className="h-2 w-full rounded-full skeleton-shimmer"></div>
      <div className="bg-[#10141a] rounded-2xl p-5 border border-[#21262d] space-y-4">
        <div className="h-6 w-3/4 rounded skeleton-shimmer"></div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl skeleton-shimmer"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* --- LOGIN SKELETON --- */
const LoginSkeleton: React.FC = () => {
  return (
    <div className="bg-[#10141a] rounded-2xl p-6 border border-[#21262d] space-y-5">
      <div className="h-6 w-48 rounded skeleton-shimmer"></div>
      <div className="h-3 w-36 rounded skeleton-shimmer"></div>
      <div className="space-y-3 pt-2">
        <div className="h-10 rounded-xl skeleton-shimmer"></div>
        <div className="h-10 rounded-xl skeleton-shimmer"></div>
        <div className="h-11 rounded-xl skeleton-shimmer-crimson"></div>
      </div>
    </div>
  );
};
