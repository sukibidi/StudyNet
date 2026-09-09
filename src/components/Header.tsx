import React, { useState, useRef, useEffect } from 'react';
import { OperatorProfile, ScreenType } from '../types';
import { PRESET_OPERATORS, isProfileZeroData } from '../data';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  timerString?: string;
  operatorProfile?: OperatorProfile;
  onSwitchProfile?: (profile: OperatorProfile) => void;
  onOpenEditProfile?: () => void;
  isSyncing?: boolean;
  onSyncTelemetry?: () => void;
  alertCount24h?: number;
  onOpenAlertCenter?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  timerString,
  operatorProfile,
  onSwitchProfile,
  alertCount24h = 0,
  onOpenAlertCenter,
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isZero = isProfileZeroData(operatorProfile);
  const avatarUrl =
    operatorProfile?.avatarUrl ||
    (isZero
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountMenuOpen]);

  // Screen label dictionary for clean header display
  const getScreenLabel = (screen: ScreenType) => {
    switch (screen) {
      case 'HOME':
        return 'OVERVIEW';
      case 'SCHED':
        return 'TIMETABLE';
      case 'AI-NET':
        return 'AI-NET';
      case 'DECKS':
        return 'DECKS';
      case 'STATS':
        return 'DOSSIER';
      case 'DRILL':
        return 'EXAM DRILL';
      case 'LOGIN':
        return 'GATEWAY';
      default:
        return 'HUD';
    }
  };

  // Header when on Login Screen
  if (currentScreen === 'LOGIN') {
    return (
      <header id="hud-login-header" className="fixed top-0 inset-x-0 z-50 bg-[#0a0e14]/90 backdrop-blur-md pt-safe border-b border-[#21262d]">
        <div className="max-w-xl mx-auto h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#ff3344] animate-pulse"></span>
            <span className="font-bold font-mono-code tracking-wider text-xs text-white uppercase">
              STUDYNET // ACCESS
            </span>
          </div>
          <button
            onClick={() => onNavigate('HOME')}
            className="text-xs font-mono-code text-[#8b949e] hover:text-white px-2.5 py-1 bg-[#161b22] border border-[#21262d] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Return to HUD</span>
          </button>
        </div>
      </header>
    );
  }

  // Specific header for Drill mode
  if (currentScreen === 'DRILL') {
    return (
      <header id="hud-drill-header" className="fixed top-0 inset-x-0 z-50 bg-[#0a0e14]/90 backdrop-blur-md pt-safe border-b border-[#21262d]">
        <div className="max-w-xl mx-auto h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="drill-back-btn"
              onClick={() => onNavigate('STATS')}
              className="w-8 h-8 flex items-center justify-center text-[#8b949e] hover:text-white bg-[#161b22] rounded-lg border border-[#30363d] transition-colors"
              title="Return to HUD"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <span className="font-heading font-bold text-sm tracking-tight text-white">DP Exam Drill</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#161b22] border border-[#ff3344]/40 rounded-full">
              <span className="material-symbols-outlined text-[#ff3344] text-[15px]">schedule</span>
              <span className="font-mono-code text-xs font-semibold text-white tracking-wide">
                {timerString || '01:22'}
              </span>
            </div>
            <div
              className="relative w-7 h-7 rounded-full overflow-hidden border border-[#30363d] cursor-pointer"
              onClick={() => onNavigate('STATS')}
              title={operatorProfile?.name || 'Operator'}
            >
              <img src={avatarUrl} alt="Operator" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Clean, uncluttered HUD header
  return (
    <header id="hud-main-header" className="fixed top-0 inset-x-0 z-50 bg-[#0a0e14]/95 backdrop-blur-md pt-safe border-b border-[#21262d]">
      <div className="max-w-xl mx-auto h-14 px-4 flex items-center justify-between relative">
        {/* Left Side: Brand Logo & Current View */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('HOME')}
            className="flex items-center gap-1.5 focus:outline-none group text-left"
            title="Go to Overview"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff3344] group-hover:scale-125 transition-transform animate-pulse"></span>
            <span className="font-bold font-mono-code tracking-wider text-xs text-white uppercase group-hover:text-[#ff3344] transition-colors">
              STUDYNET
            </span>
          </button>

          <span className="text-[#30363d] font-mono-code text-xs select-none">//</span>

          <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-[#161b22] border border-[#21262d] text-[#8b949e] font-semibold tracking-wider">
            {getScreenLabel(currentScreen)}
          </span>
        </div>

        {/* Right Side: Tactical Alert Bell & Clean Account Switcher Pill */}
        <div className="flex items-center gap-2">
          {/* Notification Alert Bell (with subtle pulse badge if active) */}
          {onOpenAlertCenter && (
            <button
              id="tactical-alerts-bell-btn"
              type="button"
              onClick={onOpenAlertCenter}
              className={`relative w-8 h-8 rounded-lg bg-[#161b22] hover:bg-[#1f2530] flex items-center justify-center border transition-all active:scale-95 ${
                alertCount24h > 0
                  ? 'border-[#ff3344]/50 text-[#ff3344]'
                  : 'border-[#21262d] text-[#8b949e] hover:text-white'
              }`}
              title={`Alert Center (${alertCount24h} urgent deadline${alertCount24h !== 1 ? 's' : ''} in 24h)`}
            >
              <span className="material-symbols-outlined text-[17px]">
                {alertCount24h > 0 ? 'notifications_active' : 'notifications'}
              </span>

              {alertCount24h > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#ff3344] text-white text-[9px] font-mono-code font-bold flex items-center justify-center leading-none border border-[#0a0e14] animate-pulse">
                  {alertCount24h}
                </span>
              )}
            </button>
          )}

          {/* Account Switcher Pill & Dropdown Anchor */}
          <div className="relative" ref={menuRef}>
            <button
              id="operator-account-btn"
              type="button"
              onClick={() => setIsAccountMenuOpen((prev) => !prev)}
              className={`flex items-center gap-2 p-1 sm:pl-2.5 sm:pr-1.5 rounded-xl border transition-all select-none ${
                isAccountMenuOpen
                  ? 'bg-[#1f2530] border-[#ff3344]/50'
                  : 'bg-[#161b22] hover:bg-[#1c222b] border-[#21262d] hover:border-[#30363d]'
              }`}
              title="Switch Operator Account (Dummy Data / Zero Data)"
            >
              <div className="hidden sm:flex flex-col items-end text-right min-w-0">
                <span className="text-xs font-mono-code font-bold text-white leading-tight truncate max-w-[90px]">
                  {operatorProfile?.name.split(' ')[0] || 'Operator'}
                </span>
                <span
                  className={`text-[9px] font-mono-code uppercase font-semibold leading-none ${
                    isZero ? 'text-[#8b949e]' : 'text-[#00e599]'
                  }`}
                >
                  {isZero ? 'Zero Data' : 'Dummy Data'}
                </span>
              </div>

              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#30363d] shrink-0">
                <img
                  src={avatarUrl}
                  alt={operatorProfile?.name || 'Operator'}
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="material-symbols-outlined text-xs text-[#8b949e] hidden sm:inline">
                {isAccountMenuOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
            </button>

            {/* Account Switcher Popover Dropdown */}
            {isAccountMenuOpen && (
              <div
                id="account-switcher-dropdown"
                className="absolute right-0 mt-2 w-72 bg-[#10141a] border border-[#30363d] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-3"
              >
                {/* Active Account Info */}
                <div className="p-2.5 bg-[#161b22] rounded-xl border border-[#21262d] flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-[#30363d] shrink-0">
                    <img
                      src={avatarUrl}
                      alt={operatorProfile?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">
                        {operatorProfile?.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono-code uppercase px-1.5 py-0.5 rounded font-bold ${
                          isZero
                            ? 'bg-[#21262d] text-[#8b949e]'
                            : 'bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30'
                        }`}
                      >
                        {isZero ? 'Zero Baseline' : 'Populated'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-code text-[#8b949e] truncate block">
                      {operatorProfile?.email || operatorProfile?.role}
                    </span>
                  </div>
                </div>

                {/* Account Selection Roster */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1 text-[10px] font-mono-code text-[#8b949e] uppercase tracking-wider font-semibold">
                    <span>Select Account Mode</span>
                    <span>1-Click Switch</span>
                  </div>

                  {PRESET_OPERATORS.map((preset) => {
                    const isCurrent = operatorProfile?.email === preset.email;
                    const presetIsZero = isProfileZeroData(preset);

                    return (
                      <button
                        key={preset.email || preset.name}
                        type="button"
                        onClick={() => {
                          if (onSwitchProfile) onSwitchProfile(preset);
                          setIsAccountMenuOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl flex items-center gap-2.5 transition-all text-left ${
                          isCurrent
                            ? 'bg-[#ff3344]/10 border border-[#ff3344]/40 text-white'
                            : 'hover:bg-[#161b22] border border-transparent text-[#c9d1d9]'
                        }`}
                      >
                        <img
                          src={preset.avatarUrl}
                          alt={preset.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#21262d] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-white truncate">
                              {preset.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono-code px-1.5 py-0.2 rounded ${
                                presetIsZero
                                  ? 'text-[#8b949e] bg-[#21262d]'
                                  : 'text-[#00e599] bg-[#00e599]/10'
                              }`}
                            >
                              {presetIsZero ? 'ZERO DATA' : 'DUMMY DATA'}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono-code text-[#8b949e] truncate block">
                            LVL {preset.level} • {presetIsZero ? 'Standby Baseline' : `${preset.cgpa} CGPA`}
                          </span>
                        </div>
                        {isCurrent && (
                          <span className="material-symbols-outlined text-sm text-[#ff3344] shrink-0">
                            check
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Navigation Footer */}
                <div className="pt-2 border-t border-[#21262d] grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      onNavigate('STATS');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-[#161b22] hover:bg-[#1f2530] text-[11px] font-mono-code text-[#c9d1d9] hover:text-white border border-[#21262d] text-center flex items-center justify-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">account_circle</span>
                    <span>Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      onNavigate('LOGIN');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-[#161b22] hover:bg-[#1f2530] text-[11px] font-mono-code text-[#ff3344] hover:text-white border border-[#ff3344]/30 hover:border-[#ff3344] text-center flex items-center justify-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">logout</span>
                    <span>All Accounts</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
