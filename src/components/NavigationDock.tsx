import React from 'react';
import { ScreenType } from '../types';

interface NavigationDockProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({ currentScreen, onSelectScreen }) => {
  if (currentScreen === 'DRILL' || currentScreen === 'LOGIN') {
    return null; // Drill and Login screens have dedicated tactical action bars
  }

  const navItems: { id: ScreenType; label: string; icon: string }[] = [
    { id: 'HOME', label: 'HOME', icon: 'grid_view' },
    { id: 'SCHED', label: 'SCHED', icon: 'calendar_today' },
    { id: 'AI-NET', label: 'AI-NET', icon: 'psychology' },
    { id: 'DECKS', label: 'DECKS', icon: 'style' },
    { id: 'STATS', label: 'STATS', icon: 'analytics' },
  ];

  return (
    <nav
      id="bottom-hud-dock"
      className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#0a0e14]/92 backdrop-blur-md border-t border-[#21262d]"
    >
      <div className="h-[68px] px-2 flex items-center justify-around max-w-xl mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id.toLowerCase()}`}
              onClick={() => onSelectScreen(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-150 ${
                isActive ? 'text-[#ff3344]' : 'text-[#8b949e] hover:text-white'
              }`}
            >
              {/* Subtle top indicator pip */}
              {isActive && (
                <span className="absolute -top-3 w-4 h-0.5 bg-[#ff3344] rounded-full shadow-[0_0_8px_#ff3344]"></span>
              )}
              <span className="material-symbols-outlined text-[20px] transition-transform duration-150 active:scale-90">
                {item.icon}
              </span>
              <span
                className={`font-mono-code text-[9px] mt-1 tracking-wider uppercase ${
                  isActive ? 'font-bold text-[#ff3344]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
