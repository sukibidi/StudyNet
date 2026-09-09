import React, { useState } from 'react';
import { DaySchedule, ScheduleItem } from '../types';
import { playTacticalChirp } from '../utils/audio';

interface TimetableInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSession: (dayDateNumber: number, session: ScheduleItem) => void;
  scheduleDays: DaySchedule[];
}

const COURSE_PRESETS = [
  {
    name: 'Multimedia Systems & Digital Signal Processing',
    code: 'MM201',
    defaultLocation: 'Digital Media Lab 4B',
    defaultType: 'LAB' as const,
    defaultDoc: 'MM201_Shader_Pipelines.pdf',
    defaultNotes: 'Review discrete cosine transform (DCT) & WebGL shaders',
  },
  {
    name: 'Operating Systems: Kernel & Virtual Memory',
    code: 'CS301',
    defaultLocation: 'Hall B, West Wing',
    defaultType: 'LECTURE' as const,
    defaultDoc: 'CS301_Virtual_Memory_Paging.pdf',
    defaultNotes: 'Review multi-level paging & TLB miss handlers',
  },
  {
    name: 'Distributed Systems & Consensus Protocols',
    code: 'CS340',
    defaultLocation: 'Seminar Room 2',
    defaultType: 'TUTORIAL' as const,
    defaultDoc: 'CS340_Raft_Consensus.pdf',
    defaultNotes: 'Bring Raft leader election partition diagrams',
  },
  {
    name: 'Algorithms & Computational Complexity',
    code: 'CS210',
    defaultLocation: 'Turing Hall',
    defaultType: 'LECTURE' as const,
    defaultDoc: 'CS210_Dynamic_Programming.pdf',
    defaultNotes: 'Prepare state-transition recurrence relations',
  },
  {
    name: 'Relational Database Engines & Storage',
    code: 'CS240',
    defaultLocation: 'Lab 102, Science Complex',
    defaultType: 'LAB' as const,
    defaultDoc: 'CS240_BTree_Indexing.pdf',
    defaultNotes: 'Test B+ tree fill-factor benchmark suite',
  },
  {
    name: 'Computer Networks & Distributed Sockets',
    code: 'CS320',
    defaultLocation: 'Hall C, North Wing',
    defaultType: 'LECTURE' as const,
    defaultDoc: 'CS320_TCP_Congestion.pdf',
    defaultNotes: 'Packet trace packet capture analysis',
  },
  {
    name: 'Autonomous Focus & Spaced Drill Block',
    code: 'DRILL',
    defaultLocation: 'Main Library Pod 3',
    defaultType: 'STUDY' as const,
    defaultDoc: '',
    defaultNotes: 'Flashcard spaced repetition interval drill',
  },
];

const TIME_SLOT_PRESETS = [
  { label: '08:30 — 10:00 (Slot 1 • Morning Core)', start: '08:30', end: '10:00' },
  { label: '10:00 — 11:30 (Slot 2 • Standard Class)', start: '10:00', end: '11:30' },
  { label: '12:00 — 13:30 (Slot 3 • Midday Colloquium)', start: '12:00', end: '13:30' },
  { label: '14:00 — 15:30 (Slot 4 • Afternoon Lab / Studio)', start: '14:00', end: '15:30' },
  { label: '16:00 — 17:30 (Slot 5 • Discussion & Drill)', start: '16:00', end: '17:30' },
  { label: '18:00 — 19:30 (Slot 6 • Evening Study Block)', start: '18:00', end: '19:30' },
];

const LOCATION_PRESETS = [
  'Digital Media Lab 4B',
  'Hall B, West Wing',
  'Seminar Room 2',
  'Turing Hall',
  'Main Library Pod 3',
  'Virtual Telemetry Stream',
  'Lab 102, Science Complex',
  'Hall C, North Wing',
];

export const TimetableInputModal: React.FC<TimetableInputModalProps> = ({
  isOpen,
  onClose,
  onAddSession,
  scheduleDays,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(23);
  const [selectedCoursePreset, setSelectedCoursePreset] = useState<string>(COURSE_PRESETS[0].name);
  const [title, setTitle] = useState(COURSE_PRESETS[0].name);
  const [courseCode, setCourseCode] = useState(COURSE_PRESETS[0].code);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOT_PRESETS[3].label);
  const [startTime, setStartTime] = useState(TIME_SLOT_PRESETS[3].start);
  const [endTime, setEndTime] = useState(TIME_SLOT_PRESETS[3].end);
  const [isCustomTime, setIsCustomTime] = useState(false);

  const [sessionType, setSessionType] = useState<'LECTURE' | 'LAB' | 'TUTORIAL' | 'EXAM' | 'STUDY'>(
    COURSE_PRESETS[0].defaultType
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(COURSE_PRESETS[0].defaultLocation);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customLocationText, setCustomLocationText] = useState('');

  const [subtitle, setSubtitle] = useState('');
  const [notes, setNotes] = useState(COURSE_PRESETS[0].defaultNotes);
  const [docName, setDocName] = useState(COURSE_PRESETS[0].defaultDoc);
  const [isRequired, setIsRequired] = useState(true);

  if (!isOpen) return null;

  // Handle Course Preset Change from Dropdown
  const handleCourseDropdownChange = (courseName: string) => {
    setSelectedCoursePreset(courseName);
    if (courseName === '__CUSTOM__') {
      setTitle('');
      setCourseCode('');
      setNotes('');
      setDocName('');
    } else {
      const match = COURSE_PRESETS.find((c) => c.name === courseName);
      if (match) {
        setTitle(match.name);
        setCourseCode(match.code);
        setSelectedLocation(match.defaultLocation);
        setIsCustomLocation(false);
        setSessionType(match.defaultType);
        setNotes(match.defaultNotes);
        setDocName(match.defaultDoc);
      }
    }
    playTacticalChirp(650, 0.05);
  };

  // Handle Time Slot Dropdown Change
  const handleTimeSlotDropdownChange = (slotLabel: string) => {
    setSelectedTimeSlot(slotLabel);
    if (slotLabel === '__CUSTOM__') {
      setIsCustomTime(true);
    } else {
      setIsCustomTime(false);
      const match = TIME_SLOT_PRESETS.find((s) => s.label === slotLabel);
      if (match) {
        setStartTime(match.start);
        setEndTime(match.end);
      }
    }
    playTacticalChirp(720, 0.05);
  };

  // Handle Location Dropdown Change
  const handleLocationDropdownChange = (loc: string) => {
    setSelectedLocation(loc);
    if (loc === '__CUSTOM__') {
      setIsCustomLocation(true);
    } else {
      setIsCustomLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const sessionTitle = courseCode.trim()
      ? `${courseCode.trim().toUpperCase()}: ${title.trim()}`
      : title.trim();

    const finalLocation = isCustomLocation
      ? customLocationText.trim() || 'Turing Hall'
      : selectedLocation;

    const newSession: ScheduleItem = {
      id: `sched-${Date.now()}`,
      time: `${startTime} — ${endTime}`,
      title: sessionTitle,
      subtitle: subtitle.trim() || undefined,
      location: finalLocation,
      badge: sessionType === 'EXAM' ? 'EXAM' : sessionType === 'LAB' ? 'LAB' : 'Upcoming',
      badgeType: sessionType === 'EXAM' ? 'urgent' : 'upcoming',
      attachedDoc: docName.trim()
        ? {
            name: docName.trim(),
            description: 'Course lecture notes & slides',
            syncedPercent: 100,
          }
        : undefined,
      preparationNote: notes.trim() || undefined,
      isRequired,
    };

    onAddSession(selectedDayNumber, newSession);
    playTacticalChirp(880, 0.1);
    onClose();
  };

  return (
    <div
      id="timetable-input-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#10141a] border border-[#ff3344]/30 rounded-2xl w-full max-w-lg max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#21262d] flex items-center justify-between bg-[#161b22]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff3344]/15 border border-[#ff3344]/30 flex items-center justify-center text-[#ff3344]">
              <span className="material-symbols-outlined text-base">calendar_add_on</span>
            </div>
            <div>
              <h2 className="text-sm font-bold font-heading text-white tracking-wide uppercase">
                Input Timetable Schedule
              </h2>
              <p className="text-[11px] font-mono-code text-[#8b949e]">
                Select session parameters via tactical dropdown menus
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-[#8b949e] hover:text-white flex items-center justify-center border border-[#30363d] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* 1. SELECT DAY DROPDOWN */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-[#ff3344]">calendar_month</span>
              <span>1. Schedule Day (Dropdown) *</span>
            </label>
            <div className="relative">
              <select
                value={selectedDayNumber}
                onChange={(e) => setSelectedDayNumber(Number(e.target.value))}
                className="w-full h-10 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 pr-8 text-xs font-mono-code text-white focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {scheduleDays.map((day) => (
                  <option key={day.dateNumber} value={day.dateNumber}>
                    {day.dayName}, Oct {day.dateNumber} {day.dateNumber === 23 ? '• (Today - Active)' : ''}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8b949e]">
                <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
              </div>
            </div>
          </div>

          {/* 2. COURSE / SUBJECT DROPDOWN */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-[#ff3344]">school</span>
              <span>2. Course / Subject Selection (Dropdown) *</span>
            </label>
            <div className="relative">
              <select
                value={selectedCoursePreset}
                onChange={(e) => handleCourseDropdownChange(e.target.value)}
                className="w-full h-10 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 pr-8 text-xs font-sans text-white focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {COURSE_PRESETS.map((course, idx) => (
                  <option key={idx} value={course.name}>
                    [{course.code}] {course.name}
                  </option>
                ))}
                <option value="__CUSTOM__">+ Enter Custom Course...</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8b949e]">
                <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
              </div>
            </div>

            {/* If Custom Course chosen, show input fields */}
            {selectedCoursePreset === '__CUSTOM__' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 animate-fade-in">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="Course name (e.g. Multimedia Systems)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-9 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 text-xs font-sans text-white placeholder-[#5c6370] focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Code (e.g. MM201)"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full h-9 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 text-xs font-mono-code text-white placeholder-[#5c6370] focus:outline-none uppercase"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. TIME SLOT DROPDOWN & SESSION TYPE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-[#ff3344]">schedule</span>
                <span>3. Time Period (Dropdown) *</span>
              </label>
              <div className="relative">
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => handleTimeSlotDropdownChange(e.target.value)}
                  className="w-full h-10 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 pr-8 text-xs font-mono-code text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  {TIME_SLOT_PRESETS.map((slot, idx) => (
                    <option key={idx} value={slot.label}>
                      {slot.label}
                    </option>
                  ))}
                  <option value="__CUSTOM__">Custom Time Slot...</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8b949e]">
                  <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                </div>
              </div>

              {/* Custom Time Fields if chosen */}
              {isCustomTime && (
                <div className="grid grid-cols-2 gap-2 pt-1 animate-fade-in">
                  <div>
                    <span className="text-[10px] font-mono-code text-[#8b949e] block">Start Time</span>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full h-8 bg-[#161b22] border border-[#21262d] rounded-lg px-2 text-xs font-mono-code text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code text-[#8b949e] block">End Time</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full h-8 bg-[#161b22] border border-[#21262d] rounded-lg px-2 text-xs font-mono-code text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. SESSION TYPE DROPDOWN */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-[#ff3344]">category</span>
                <span>4. Session Type (Dropdown)</span>
              </label>
              <div className="relative">
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value as any)}
                  className="w-full h-10 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 pr-8 text-xs font-mono-code text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="LECTURE">Lecture (Core Academic)</option>
                  <option value="LAB">Lab Session (Hands-on Drill)</option>
                  <option value="TUTORIAL">Tutorial / Recitation</option>
                  <option value="EXAM">Exam / Midterm Assessment</option>
                  <option value="STUDY">Autonomous Study Block</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8b949e]">
                  <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. LOCATION DROPDOWN */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-[#ff3344]">pin_drop</span>
              <span>5. Location / Room (Dropdown)</span>
            </label>
            <div className="relative">
              <select
                value={isCustomLocation ? '__CUSTOM__' : selectedLocation}
                onChange={(e) => handleLocationDropdownChange(e.target.value)}
                className="w-full h-10 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 pr-8 text-xs font-mono-code text-white focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {LOCATION_PRESETS.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
                <option value="__CUSTOM__">+ Custom Room / Venue...</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8b949e]">
                <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
              </div>
            </div>

            {isCustomLocation && (
              <input
                type="text"
                placeholder="Enter custom location / building room"
                value={customLocationText}
                onChange={(e) => setCustomLocationText(e.target.value)}
                className="w-full h-9 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 text-xs font-sans text-white placeholder-[#5c6370] focus:outline-none mt-1 animate-fade-in"
              />
            )}
          </div>

          {/* Subtitle & Preparation Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide">
                Topic Focus / Subtitle (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Video compression & WebGL shaders"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full h-9 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 text-xs font-sans text-white placeholder-[#5c6370] focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono-code text-[#8b949e] font-bold uppercase tracking-wide">
                Preparation Note
              </label>
              <input
                type="text"
                placeholder="e.g. Bring Problem Set 3 / GPU assets"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-9 bg-[#161b22] border border-[#21262d] focus:border-[#ff3344] rounded-xl px-3 text-xs font-sans text-white placeholder-[#5c6370] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Mandatory Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="is-required-checkbox"
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="rounded bg-[#161b22] border-[#21262d] text-[#ff3344] focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="is-required-checkbox" className="text-xs font-mono-code text-[#c9d1d9] cursor-pointer">
              Mark as Mandatory / Required Academic Session
            </label>
          </div>

          {/* Live Preview Card */}
          <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-3 space-y-1.5">
            <span className="text-[10px] font-mono-code text-[#8b949e] uppercase font-bold block">
              Live Session Card Preview:
            </span>
            <div className="bg-[#10141a] p-3 rounded-lg border border-[rgba(255,255,255,0.07)] border-l-4 border-l-[#ff3344] flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono-code text-[#8b949e] truncate">
                  {startTime} — {endTime} • {isCustomLocation ? (customLocationText || 'Turing Hall') : selectedLocation}
                </div>
                <div className="text-xs font-bold font-heading text-white mt-0.5 truncate">
                  {courseCode ? `${courseCode.toUpperCase()}: ` : ''}{title || 'Untitled Session'}
                </div>
                {subtitle && <div className="text-[10px] text-[#8b949e] mt-0.5 truncate">{subtitle}</div>}
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#ff3344]/15 text-[#ff3344] border border-[#ff3344]/30 uppercase shrink-0">
                {sessionType}
              </span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#21262d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#21262d] text-xs font-mono-code text-[#8b949e] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#ff3344] hover:bg-[#e62637] text-white font-mono-code text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(255,51,68,0.3)] active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">event_available</span>
              <span>Add to Timetable</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
