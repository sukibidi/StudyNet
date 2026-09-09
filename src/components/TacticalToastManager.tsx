import React, { useState, useEffect } from 'react';
import { ScreenType, TacticalAlert } from '../types';
import { getCountdownTMinus } from '../alertsData';
import { playTacticalClick } from '../utils/audio';

interface TacticalToastManagerProps {
  activeToasts: TacticalAlert[];
  onDismiss: (alertId: string) => void;
  onAcknowledge: (alertId: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenAlertCenter: () => void;
  totalAlertCount: number;
}

export const TacticalToastManager: React.FC<TacticalToastManagerProps> = ({
  activeToasts,
  onDismiss,
  onAcknowledge,
  onNavigate,
  onOpenAlertCenter,
  totalAlertCount,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Top toast in queue
  const currentToast = activeToasts[0];

  useEffect(() => {
    if (!currentToast || isPaused || minimized) return;

    // Auto dismiss after 8.5 seconds if not paused
    const timer = setTimeout(() => {
      onDismiss(currentToast.id);
    }, 8500);

    return () => clearTimeout(timer);
  }, [currentToast, isPaused, minimized, onDismiss]);

  if (!currentToast) {
    return null;
  }

  const isCritical = currentToast.severity === 'CRITICAL' || currentToast.hoursRemaining <= 6;
  const isUrgent = currentToast.severity === 'URGENT' || (currentToast.hoursRemaining > 6 && currentToast.hoursRemaining <= 12);

  const borderColor = isCritical
    ? 'border-[#ff3344]'
    : isUrgent
    ? 'border-[#ffaa00]'
    : 'border-[#388bfd]';

  const glowColor = isCritical
    ? 'shadow-[0_0_20px_rgba(255,51,68,0.25)]'
    : isUrgent
    ? 'shadow-[0_0_20px_rgba(255,170,0,0.2)]'
    : 'shadow-[0_0_15px_rgba(56,139,253,0.2)]';

  const badgeBg = isCritical
    ? 'bg-[#ff3344]/20 text-[#ff3344] border-[#ff3344]/40'
    : isUrgent
    ? 'bg-[#ffaa00]/20 text-[#ffaa00] border-[#ffaa00]/40'
    : 'bg-[#388bfd]/20 text-[#388bfd] border-[#388bfd]/40';

  const pulseDot = isCritical
    ? 'bg-[#ff3344] animate-ping'
    : isUrgent
    ? 'bg-[#ffaa00] animate-pulse'
    : 'bg-[#388bfd]';

  if (minimized) {
    return (
      <div className="fixed top-16 right-4 z-50 animate-fadeIn">
        <button
          onClick={() => {
            playTacticalClick();
            setMinimized(false);
          }}
          className="bg-[#10141a]/95 backdrop-blur-md border border-[#ff3344] rounded-xl px-3 py-2 text-xs font-mono-code text-white shadow-xl flex items-center gap-2 hover:bg-[#161b22] transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-[#ff3344] animate-ping"></span>
          <span className="font-bold text-[#ff3344]">{activeToasts.length} ALERT{activeToasts.length > 1 ? 'S' : ''} PENDING</span>
          <span className="material-symbols-outlined text-sm">unfold_more</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="tactical-toast-anchor"
      className="fixed top-16 inset-x-0 sm:left-auto sm:right-4 z-50 px-3 sm:px-0 max-w-md w-full pointer-events-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`bg-[#10141a]/95 backdrop-blur-md rounded-2xl border ${borderColor} ${glowColor} overflow-hidden transition-all duration-300 transform translate-y-0`}
      >
        {/* Header telemetry band */}
        <div className="px-3.5 py-2 bg-[#161b22]/90 border-b border-[#21262d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseDot}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isCritical ? 'bg-[#ff3344]' : 'bg-[#ffaa00]'}`}></span>
            </span>
            <span className="font-mono-code font-bold text-[10px] tracking-wider text-white uppercase">
              {currentToast.type === 'EXAM'
                ? '// EXAM PROXIMITY ALERT'
                : '// TACTICAL DEADLINE ALERT'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`font-mono-code text-[10px] px-2 py-0.5 rounded font-bold border ${badgeBg}`}>
              {getCountdownTMinus(currentToast.hoursRemaining)}
            </span>
            <button
              type="button"
              onClick={() => {
                playTacticalClick();
                setMinimized(true);
              }}
              title="Minimize to badge"
              className="w-5 h-5 rounded flex items-center justify-center text-[#8b949e] hover:text-white hover:bg-[#21262d]"
            >
              <span className="material-symbols-outlined text-[14px]">remove</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playTacticalClick();
                onDismiss(currentToast.id);
              }}
              title="Dismiss toast"
              className="w-5 h-5 rounded flex items-center justify-center text-[#8b949e] hover:text-[#ff3344] hover:bg-[#21262d]"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-3.5 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-[#21262d] text-[#8b949e] font-mono-code text-[10px] font-bold">
                  {currentToast.courseCode}
                </span>
                <span className="text-[10px] font-mono-code text-[#ffaa00]">
                  Due: {currentToast.dueDate}
                </span>
              </div>
              <h4 className="font-heading font-bold text-sm text-white leading-snug">
                {currentToast.title}
              </h4>
            </div>
          </div>

          {currentToast.subtitle && (
            <p className="text-xs text-[#8b949e] line-clamp-2 leading-relaxed font-sans">
              {currentToast.subtitle}
            </p>
          )}

          {/* Action Row */}
          <div className="pt-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              {currentToast.actionScreen && (
                <button
                  type="button"
                  onClick={() => {
                    playTacticalClick();
                    onNavigate(currentToast.actionScreen!);
                    onAcknowledge(currentToast.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold uppercase transition-all flex items-center gap-1.5 ${
                    isCritical
                      ? 'bg-[#ff3344] text-white hover:bg-[#ff4d5d] shadow-[0_0_12px_rgba(255,51,68,0.4)]'
                      : 'bg-[#ffaa00] text-[#0a0e14] hover:bg-[#ffbb22]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  <span>{currentToast.actionLabel || 'Deploy Now'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  playTacticalClick();
                  onAcknowledge(currentToast.id);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-xs font-mono-code text-[#8b949e] hover:text-white transition-colors"
              >
                Acknowledge
              </button>
            </div>

            {/* Queue count & alert center trigger */}
            <button
              type="button"
              onClick={() => {
                playTacticalClick();
                onOpenAlertCenter();
              }}
              className="text-[11px] font-mono-code text-[#8b949e] hover:text-[#ff3344] underline whitespace-nowrap pl-1"
            >
              {activeToasts.length > 1
                ? `+${activeToasts.length - 1} more`
                : 'All Alerts'}
            </button>
          </div>
        </div>

        {/* Progress Bar for Auto-dismiss */}
        <div className="w-full h-1 bg-[#161b22] overflow-hidden">
          <div
            className={`h-full ${
              isCritical ? 'bg-[#ff3344]' : isUrgent ? 'bg-[#ffaa00]' : 'bg-[#388bfd]'
            } transition-all ${isPaused ? 'opacity-50' : 'animate-progressBar'}`}
            style={{
              animationDuration: '8.5s',
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
