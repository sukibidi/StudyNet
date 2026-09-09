import React, { useState } from 'react';
import { DaySchedule, ScheduleItem, ScreenType } from '../types';
import { INITIAL_SCHEDULE_DAYS } from '../data';
import { TimetableInputModal } from './TimetableInputModal';

interface SchedScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onStartDrill: () => void;
  isZeroData?: boolean;
  scheduleDays?: DaySchedule[];
  onAddSession?: (dayDateNumber: number, session: ScheduleItem) => void;
  onOpenTimetableModal?: () => void;
}

export const SchedScreen: React.FC<SchedScreenProps> = ({
  onNavigate,
  onStartDrill,
  isZeroData = false,
  scheduleDays: externalScheduleDays,
  onAddSession: externalAddSession,
  onOpenTimetableModal,
}) => {
  const [internalScheduleDays, setInternalScheduleDays] = useState<DaySchedule[]>(() => {
    try {
      const saved = localStorage.getItem('studynet_schedule_days');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SCHEDULE_DAYS;
  });

  const [isLocalTimetableModalOpen, setIsLocalTimetableModalOpen] = useState(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState(23);
  const [scheduleToast, setScheduleToast] = useState<string | null>(null);

  const activeScheduleDays = externalScheduleDays || internalScheduleDays;

  const triggerToast = (msg: string) => {
    setScheduleToast(msg);
    setTimeout(() => setScheduleToast(null), 2500);
  };

  const handleAddSession = (dayNumber: number, session: ScheduleItem) => {
    if (externalAddSession) {
      externalAddSession(dayNumber, session);
    } else {
      setInternalScheduleDays((prev) => {
        const updated = prev.map((day) => {
          if (day.dateNumber === dayNumber) {
            const isLab = session.badge === 'LAB';
            return {
              ...day,
              items: [...day.items, session],
              totalHours: Number((day.totalHours + 1.5).toFixed(1)),
              lecturesCount: isLab ? day.lecturesCount : day.lecturesCount + 1,
              labsCount: isLab ? day.labsCount + 1 : day.labsCount,
            };
          }
          return day;
        });
        try {
          localStorage.setItem('studynet_schedule_days', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    triggerToast(`Added ${session.title} to Schedule!`);
  };

  const handleOpenModal = () => {
    if (onOpenTimetableModal) {
      onOpenTimetableModal();
    } else {
      setIsLocalTimetableModalOpen(true);
    }
  };

  const currentDay =
    activeScheduleDays.find((d) => d.dateNumber === selectedDayNumber) ||
    activeScheduleDays[2] ||
    activeScheduleDays[0];

  const totalHours = isZeroData ? 0 : currentDay.totalHours;
  const completedHours = isZeroData ? 0 : currentDay.completedHours;
  const lecturesCount = isZeroData ? 0 : currentDay.lecturesCount;
  const labsCount = isZeroData ? 0 : currentDay.labsCount;
  const transitMins = isZeroData ? 0 : currentDay.transitMins;

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 pt-[72px] pb-28 space-y-5 sm:space-y-6 flex flex-col items-stretch">
      {/* Toast */}
      {scheduleToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#161b22] border border-[#00e599] rounded-xl text-xs font-mono-code text-[#00e599] shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{scheduleToast}</span>
        </div>
      )}

      {/* 1. HORIZONTAL DATE PICKER STRIP */}
      <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 select-none w-full max-w-full">
        {activeScheduleDays.map((day) => {
          const isSelected = day.dateNumber === selectedDayNumber;
          return (
            <button
              key={day.dateNumber}
              onClick={() => setSelectedDayNumber(day.dateNumber)}
              className={`flex-1 min-w-[48px] sm:min-w-[50px] py-2 sm:py-2.5 px-1 rounded-xl flex flex-col items-center justify-center border transition-all duration-150 ${
                isSelected
                  ? 'bg-[#1c222b] border-[#ff3344]/50 shadow-[0_0_12px_rgba(255,51,68,0.2)]'
                  : 'bg-[#10141a] border-[#21262d] text-[#8b949e] hover:border-[#30363d]'
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] font-mono-code font-bold uppercase tracking-wider ${
                    isSelected ? 'text-[#ff3344]' : 'text-[#8b949e]'
                  }`}
                >
                  {day.dayName}
                </span>
                {day.isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#ff3344]"></span>}
              </div>
              <span
                className={`font-mono-code text-sm sm:text-base font-bold mt-0.5 ${
                  isSelected ? 'text-white' : 'text-[#8b949e]'
                }`}
              >
                {day.dateNumber}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. WORKLOAD OVERVIEW CARD */}
      <div
        id="workload-overview-card"
        className="bg-[#10141a] rounded-2xl p-4 sm:p-5 border border-[rgba(255,255,255,0.07)] space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff3344] text-base">bar_chart</span>
            <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-white">
              Workload Overview
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="font-mono-code text-xs text-white">
              <span className="font-bold">{totalHours} hrs</span>{' '}
              <span className="text-[#8b949e]">Total</span>
            </div>

            <button
              onClick={handleOpenModal}
              className="py-1 px-2.5 bg-[#ff3344] hover:bg-[#e62637] text-white rounded-lg font-mono-code text-[11px] font-bold uppercase tracking-wider transition-all shadow-[0_0_8px_rgba(255,51,68,0.3)] flex items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-xs">add</span>
              <span>+ Input Timetable</span>
            </button>
          </div>
        </div>

        {/* 10-Segment Progress Bar */}
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 10 }).map((_, idx) => {
            const isFilled =
              !isZeroData &&
              totalHours > 0 &&
              idx < Math.round((completedHours / totalHours) * 10);
            return (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  isFilled
                    ? 'bg-[#ff3344] shadow-[0_0_6px_rgba(255,51,68,0.4)]'
                    : 'bg-[#1c222b]'
                }`}
              />
            );
          })}
        </div>

        {/* Workload breakdown metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#21262d] text-center font-mono-code">
          <div>
            <span className="block text-[10px] text-[#8b949e] uppercase">Lectures</span>
            <span className="text-xs font-bold text-white mt-0.5 block">
              {lecturesCount} sessions
            </span>
          </div>
          <div className="border-x border-[#21262d]">
            <span className="block text-[10px] text-[#8b949e] uppercase">Labs</span>
            <span className="text-xs font-bold text-white mt-0.5 block">
              {labsCount} session
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-[#8b949e] uppercase">Transit</span>
            <span className="text-xs font-bold text-[#ff3344] mt-0.5 block">
              {transitMins} mins
            </span>
          </div>
        </div>
      </div>

      {/* 3. TODAY'S SESSIONS SCHEDULE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">
            {currentDay.dayName} {currentDay.dateNumber} — Schedule
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-code text-[#8b949e] uppercase tracking-wider">
              {isZeroData ? '0 Sessions Active' : `${currentDay.items.length} Sessions Active`}
            </span>
            <button
              onClick={handleOpenModal}
              className="text-[10px] font-mono-code font-bold text-[#ff3344] hover:text-[#ff5c6c] uppercase transition-colors"
            >
              + Add Class
            </button>
          </div>
        </div>

        {isZeroData || currentDay.items.length === 0 ? (
          <div className="bg-[#10141a] rounded-2xl p-6 border border-[rgba(255,255,255,0.07)] text-center space-y-3.5 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e]">
              <span className="material-symbols-outlined text-2xl">calendar_today</span>
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">
                NO SESSIONS SCHEDULED FOR THIS CYCLE
              </h3>
              <p className="text-xs text-[#8b949e] mt-1 max-w-sm mx-auto leading-relaxed">
                Your timetable for this day is clear. You can add custom classes, lectures, labs, or study sessions with the input timetable popup.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={handleOpenModal}
                className="py-2 px-3 bg-[#ff3344] hover:bg-[#e62637] text-white rounded-xl font-mono-code text-xs font-bold uppercase transition-all inline-flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,51,68,0.3)]"
              >
                <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                <span>+ Input Timetable Schedule</span>
              </button>
              <button
                onClick={() => triggerToast('LMS sync connected')}
                className="py-2 px-3 bg-[#161b22] hover:bg-[#1f2530] text-white rounded-xl border border-[#30363d] hover:border-[#ff3344] font-mono-code text-xs font-semibold uppercase transition-all inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-[#ff3344]">sync</span>
                <span>Sync iCal / LMS</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {currentDay.items.map((session, idx) => {
              const isActive = session.badgeType === 'active';
              const isUrgent = session.badgeType === 'urgent';

              return (
                <div
                  key={session.id || idx}
                  className={`bg-[#10141a] rounded-2xl p-4 border transition-all ${
                    isActive
                      ? 'border-[rgba(255,255,255,0.07)] border-l-4 border-l-[#ff3344] shadow-sm'
                      : isUrgent
                      ? 'border-[#ff3344]/40 border-l-4 border-l-[#ff3344]'
                      : 'border-[rgba(255,255,255,0.07)] hover:border-[#30363d]'
                  } space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono-code">
                      <span className="material-symbols-outlined text-sm text-[#8b949e]">schedule</span>
                      <span className="font-bold text-white">{session.time}</span>
                    </div>

                    {session.badge && (
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-mono-code px-2 py-0.5 rounded-full font-semibold uppercase ${
                          isActive
                            ? 'text-[#ff3344] bg-[#ff3344]/15 border border-[#ff3344]/30'
                            : isUrgent
                            ? 'text-[#ffaa00] bg-[#ffaa00]/15 border border-[#ffaa00]/30'
                            : 'text-[#8b949e] bg-[#161b22] border border-[#21262d]'
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#ff3344] animate-ping"></span>}
                        {session.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold font-heading text-white">
                      {session.title}
                    </h3>
                    {session.subtitle && (
                      <p className="text-xs text-[#8b949e] mt-0.5">{session.subtitle}</p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-[#8b949e] mt-1 font-sans">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span>{session.location}</span>
                    </div>
                  </div>

                  {/* Attached Document Card if present */}
                  {session.attachedDoc && (
                    <div className="bg-[#0d1117] p-3 rounded-xl border border-[#21262d] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#ff3344]/10 border border-[#ff3344]/30 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[#ff3344] text-base">
                            description
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono-code text-xs font-semibold text-white truncate">
                            {session.attachedDoc.name}
                          </div>
                          <div className="text-[10px] text-[#8b949e] truncate">
                            {session.attachedDoc.description}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('AI-NET')}
                        className="px-3 py-1 bg-[#161b22] hover:bg-[#1f2530] text-xs font-mono-code text-white rounded-lg border border-[#30363d] hover:border-[#ff3344]/40 transition-colors shrink-0"
                      >
                        Open
                      </button>
                    </div>
                  )}

                  {/* Preparation Note if present */}
                  {session.preparationNote && (
                    <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#ff3344]/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[#8b949e]">
                        <span className="material-symbols-outlined text-[#ff3344] text-base">
                          assignment_late
                        </span>
                        <span className="text-xs">{session.preparationNote}</span>
                      </div>
                      {session.isRequired && (
                        <span className="text-[10px] font-mono-code font-bold text-[#ff3344] uppercase tracking-wider">
                          Required
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Suggested Focus: Free Window if available */}
            {currentDay.freeWindow && (
              <div className="bg-[#10141a]/60 rounded-2xl p-4 border border-dashed border-[#ff3344]/30 space-y-2.5 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono-code text-[#8b949e]">
                    <span className="material-symbols-outlined text-sm">hourglass_top</span>
                    <span>{currentDay.freeWindow.time}</span>
                  </div>
                  <span className="text-[10px] font-mono-code text-[#8b949e] bg-[#161b22] px-2 py-0.5 rounded border border-[#21262d]">
                    {currentDay.freeWindow.duration}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-[#ff3344] uppercase tracking-wide">
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    <span>Suggested Focus</span>
                  </div>
                  <p className="text-xs text-[#8b949e] mt-1 leading-relaxed">
                    {currentDay.freeWindow.recommendation}
                  </p>
                </div>

                <button
                  onClick={onStartDrill}
                  className="inline-flex items-center gap-1.5 text-xs font-mono-code font-bold text-[#ff3344] hover:text-[#ff5c6c] transition-colors group pt-1"
                >
                  <span>Start DP Drill</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* End of schedule separator */}
      <div className="flex items-center justify-center gap-3 pt-4 text-[10px] font-mono-code text-[#5c6370] uppercase tracking-widest">
        <span className="w-8 h-px bg-[#21262d]"></span>
        <span>End of Daily Schedule</span>
        <span className="w-8 h-px bg-[#21262d]"></span>
      </div>

      {/* Local Modal Fallback */}
      <TimetableInputModal
        isOpen={isLocalTimetableModalOpen}
        onClose={() => setIsLocalTimetableModalOpen(false)}
        onAddSession={handleAddSession}
        scheduleDays={activeScheduleDays}
      />
    </div>
  );
};
