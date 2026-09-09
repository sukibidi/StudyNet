import React, { useState } from 'react';
import { ScreenType, TacticalAlert, AlertType, AlertSeverity } from '../types';
import { formatRemainingHours, getCountdownTMinus, isWithin24Hours } from '../alertsData';
import { isAudioEnabled, toggleAudioEnabled, playTacticalChirp, playTacticalClick, playUrgentAlertSound } from '../utils/audio';

interface TacticalAlertCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: TacticalAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onAcknowledgeAll: () => void;
  onTriggerToast: (alert: TacticalAlert) => void;
  onAddCustomAlert: (alert: TacticalAlert) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const TacticalAlertCenterModal: React.FC<TacticalAlertCenterModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onAcknowledgeAlert,
  onAcknowledgeAll,
  onTriggerToast,
  onAddCustomAlert,
  onNavigate,
}) => {
  const [filterTab, setFilterTab] = useState<'WITHIN_24H' | 'ALL' | 'ACKNOWLEDGED'>('WITHIN_24H');
  const [soundActive, setSoundActive] = useState(isAudioEnabled());
  const [showAddForm, setShowAddForm] = useState(false);

  // New Alert form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS301');
  const [newType, setNewType] = useState<AlertType>('DEADLINE');
  const [newHours, setNewHours] = useState('4.5');
  const [newActionScreen, setNewActionScreen] = useState<ScreenType>('SCHED');

  if (!isOpen) return null;

  const within24hAlerts = alerts.filter((a) => isWithin24Hours(a) && !a.acknowledged);
  const allUpcomingAlerts = alerts.filter((a) => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter((a) => a.acknowledged);

  const displayedAlerts =
    filterTab === 'WITHIN_24H'
      ? within24hAlerts
      : filterTab === 'ALL'
      ? allUpcomingAlerts
      : acknowledgedAlerts;

  const handleToggleSound = () => {
    const newState = toggleAudioEnabled();
    setSoundActive(newState);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedHours = Math.max(0.1, parseFloat(newHours) || 4.0);
    const severity: AlertSeverity =
      parsedHours <= 6 ? 'CRITICAL' : parsedHours <= 12 ? 'URGENT' : 'WARNING';

    const newAlert: TacticalAlert = {
      id: `alert-custom-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      courseCode: newCourse.trim().toUpperCase() || 'CORE',
      dueDate: `In ${parsedHours.toFixed(1)} hours`,
      hoursRemaining: parsedHours,
      severity,
      actionScreen: newActionScreen,
      actionLabel:
        newActionScreen === 'DRILL'
          ? 'Deploy Drill'
          : newActionScreen === 'DECKS'
          ? 'Review Decks'
          : newActionScreen === 'AI-NET'
          ? 'Query AI-Net'
          : 'View Schedule',
      timestamp: Date.now(),
      source: 'USER',
    };

    onAddCustomAlert(newAlert);
    playTacticalChirp();
    setNewTitle('');
    setNewSubtitle('');
    setShowAddForm(false);
  };

  const simulateAlert = (type: 'EXAM' | 'DEADLINE' | 'LAB') => {
    let alert: TacticalAlert;
    if (type === 'EXAM') {
      alert = {
        id: `sim-exam-${Date.now()}`,
        type: 'EXAM',
        title: 'CS312 Surprise Diagnostic Exam',
        subtitle: 'Bellman-Ford & Dijkstra shortest path proof questions',
        courseCode: 'CS312',
        dueDate: 'Today in 02h 30m',
        hoursRemaining: 2.5,
        severity: 'CRITICAL',
        actionScreen: 'DRILL',
        actionLabel: 'Deploy To Drill',
        timestamp: Date.now(),
      };
    } else if (type === 'LAB') {
      alert = {
        id: `sim-lab-${Date.now()}`,
        type: 'LAB',
        title: 'Operating Systems Lab 5 Check-off',
        subtitle: 'Demonstrate multi-threaded mutex deadlock prevention in terminal',
        courseCode: 'CS301',
        dueDate: 'Today in 05h 15m',
        hoursRemaining: 5.25,
        severity: 'URGENT',
        actionScreen: 'AI-NET',
        actionLabel: 'Query AI-Net',
        timestamp: Date.now(),
      };
    } else {
      alert = {
        id: `sim-task-${Date.now()}`,
        type: 'DEADLINE',
        title: 'Problem Set 4: Network Flow Cuts',
        subtitle: 'Ford-Fulkerson augmentation graph submission portal closes',
        courseCode: 'CS340',
        dueDate: 'Tonight in 01h 45m',
        hoursRemaining: 1.75,
        severity: 'CRITICAL',
        actionScreen: 'SCHED',
        actionLabel: 'Inspect Timetable',
        timestamp: Date.now(),
      };
    }

    onAddCustomAlert(alert);
    playUrgentAlertSound();
    onTriggerToast(alert);
  };

  return (
    <div
      id="tactical-alert-center-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#10141a] border border-[#21262d] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-[#161b22] border-b border-[#21262d] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3344] animate-pulse"></span>
            <div>
              <h3 className="font-heading font-bold text-sm text-white tracking-wide uppercase">
                TACTICAL ALERT CENTER // 24H PROXIMITY TELEMETRY
              </h3>
              <p className="text-[11px] font-mono-code text-[#8b949e]">
                {within24hAlerts.length} urgent deadline{within24hAlerts.length !== 1 ? 's' : ''} requiring immediate operator readiness
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`px-2 py-1 rounded text-xs font-mono-code flex items-center gap-1 border transition-colors ${
                soundActive
                  ? 'bg-[#00e599]/10 text-[#00e599] border-[#00e599]/40 hover:bg-[#00e599]/20'
                  : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-white'
              }`}
              title={soundActive ? 'Tactical Audio Enabled (Click to mute)' : 'Audio Muted (Click to enable)'}
            >
              <span className="material-symbols-outlined text-sm">
                {soundActive ? 'volume_up' : 'volume_off'}
              </span>
              <span className="hidden sm:inline text-[10px]">{soundActive ? 'SFX ON' : 'MUTED'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playTacticalClick();
                onClose();
              }}
              className="w-8 h-8 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Quick Simulator Bar */}
        <div className="px-4 py-2.5 bg-[#0d1117] border-b border-[#21262d] flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono-code">
          <span className="text-[10px] text-[#8b949e] uppercase shrink-0">
            SIMULATE ALERT:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => simulateAlert('EXAM')}
              className="px-2 py-0.5 rounded bg-[#ff3344]/15 hover:bg-[#ff3344]/25 text-[#ff3344] border border-[#ff3344]/30 text-[10px] transition-colors"
            >
              + Exam (2.5h)
            </button>
            <button
              type="button"
              onClick={() => simulateAlert('DEADLINE')}
              className="px-2 py-0.5 rounded bg-[#ffaa00]/15 hover:bg-[#ffaa00]/25 text-[#ffaa00] border border-[#ffaa00]/30 text-[10px] transition-colors"
            >
              + P-Set (1.75h)
            </button>
            <button
              type="button"
              onClick={() => simulateAlert('LAB')}
              className="px-2 py-0.5 rounded bg-[#388bfd]/15 hover:bg-[#388bfd]/25 text-[#388bfd] border border-[#388bfd]/30 text-[10px] transition-colors"
            >
              + Lab (5h)
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-2 py-0.5 rounded bg-[#161b22] hover:bg-[#21262d] text-white border border-[#30363d] text-[10px] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[12px]">add</span>
              <span>Custom</span>
            </button>
          </div>
        </div>

        {/* Add Custom Alert Form Dropdown */}
        {showAddForm && (
          <form
            onSubmit={handleCreateAlert}
            className="p-4 bg-[#141a22] border-b border-[#21262d] space-y-3 animate-fadeIn text-xs font-mono-code"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#ff3344] uppercase tracking-wider text-[11px]">
                // CREATE NEW TACTICAL DEADLINE
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-[#8b949e] hover:text-white text-[11px]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#8b949e] block mb-1">TASK / EXAM TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS301 Final Project Review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-white placeholder-[#5c6370] focus:border-[#ff3344] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8b949e] block mb-1">COURSE CODE</label>
                <input
                  type="text"
                  placeholder="e.g. CS301"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-white placeholder-[#5c6370] focus:border-[#ff3344] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-[#8b949e] block mb-1">TYPE</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as AlertType)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-2 py-1.5 text-white focus:border-[#ff3344] focus:outline-none"
                >
                  <option value="DEADLINE">DEADLINE</option>
                  <option value="EXAM">EXAM</option>
                  <option value="LAB">LAB</option>
                  <option value="QUIZ">QUIZ</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#8b949e] block mb-1">HOURS UNTIL DUE</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  max="168"
                  value={newHours}
                  onChange={(e) => setNewHours(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-white focus:border-[#ff3344] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8b949e] block mb-1">TARGET ACTION</label>
                <select
                  value={newActionScreen}
                  onChange={(e) => setNewActionScreen(e.target.value as ScreenType)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-2 py-1.5 text-white focus:border-[#ff3344] focus:outline-none"
                >
                  <option value="DRILL">DRILL</option>
                  <option value="SCHED">SCHEDULE</option>
                  <option value="DECKS">FLASHCARDS</option>
                  <option value="AI-NET">AI-NET</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#8b949e] block mb-1">SUBTITLE / NOTES</label>
              <input
                type="text"
                placeholder="e.g. Chapter 8 page tables and TLB miss handling review"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-white placeholder-[#5c6370] focus:border-[#ff3344] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#ff3344] hover:bg-[#ff4d5d] text-white rounded-lg font-bold uppercase transition-colors"
            >
              Add Deadline & Fire Toast
            </button>
          </form>
        )}

        {/* Tab Filters */}
        <div className="p-3 bg-[#10141a] border-b border-[#21262d] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                playTacticalClick();
                setFilterTab('WITHIN_24H');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-colors ${
                filterTab === 'WITHIN_24H'
                  ? 'bg-[#ff3344]/20 text-[#ff3344] border border-[#ff3344]/40 font-bold'
                  : 'text-[#8b949e] hover:text-white bg-[#161b22]'
              }`}
            >
              Within 24h ({within24hAlerts.length})
            </button>
            <button
              type="button"
              onClick={() => {
                playTacticalClick();
                setFilterTab('ALL');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-colors ${
                filterTab === 'ALL'
                  ? 'bg-[#388bfd]/20 text-[#388bfd] border border-[#388bfd]/40 font-bold'
                  : 'text-[#8b949e] hover:text-white bg-[#161b22]'
              }`}
            >
              All Upcoming ({allUpcomingAlerts.length})
            </button>
            <button
              type="button"
              onClick={() => {
                playTacticalClick();
                setFilterTab('ACKNOWLEDGED');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-colors ${
                filterTab === 'ACKNOWLEDGED'
                  ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40 font-bold'
                  : 'text-[#8b949e] hover:text-white bg-[#161b22]'
              }`}
            >
              History ({acknowledgedAlerts.length})
            </button>
          </div>

          {displayedAlerts.length > 0 && filterTab !== 'ACKNOWLEDGED' && (
            <button
              type="button"
              onClick={() => {
                playTacticalClick();
                onAcknowledgeAll();
              }}
              className="text-[11px] font-mono-code text-[#8b949e] hover:text-white px-2 py-1 bg-[#161b22] border border-[#21262d] rounded-lg transition-colors"
            >
              Acknowledge All
            </button>
          )}
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {displayedAlerts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#30363d]">
                notifications_off
              </span>
              <p className="text-xs font-mono-code text-[#8b949e]">
                No tactical alerts in this filter category.
              </p>
              {filterTab === 'WITHIN_24H' && (
                <button
                  type="button"
                  onClick={() => simulateAlert('EXAM')}
                  className="text-xs font-mono-code text-[#ff3344] hover:underline"
                >
                  Click to simulate a 24-hour exam reminder
                </button>
              )}
            </div>
          ) : (
            displayedAlerts.map((alert) => {
              const isCrit = alert.severity === 'CRITICAL' || alert.hoursRemaining <= 6;
              const isUrg = alert.severity === 'URGENT' || (alert.hoursRemaining > 6 && alert.hoursRemaining <= 12);
              const is24h = isWithin24Hours(alert);

              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    alert.acknowledged
                      ? 'bg-[#10141a]/60 border-[#21262d] opacity-60'
                      : isCrit
                      ? 'bg-[#161b22] border-[#ff3344]/50 hover:border-[#ff3344] shadow-sm'
                      : isUrg
                      ? 'bg-[#161b22] border-[#ffaa00]/40 hover:border-[#ffaa00]'
                      : 'bg-[#161b22] border-[#21262d] hover:border-[#388bfd]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-mono-code text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            alert.type === 'EXAM'
                              ? 'bg-[#ff3344]/20 text-[#ff3344]'
                              : alert.type === 'LAB'
                              ? 'bg-[#388bfd]/20 text-[#388bfd]'
                              : 'bg-[#ffaa00]/20 text-[#ffaa00]'
                          }`}
                        >
                          {alert.type}
                        </span>

                        <span className="font-mono-code text-[10px] text-[#8b949e] px-1 bg-[#21262d] rounded">
                          {alert.courseCode}
                        </span>

                        <span
                          className={`font-mono-code text-[10px] font-bold ${
                            isCrit ? 'text-[#ff3344]' : isUrg ? 'text-[#ffaa00]' : 'text-[#8b949e]'
                          }`}
                        >
                          {getCountdownTMinus(alert.hoursRemaining)}
                        </span>

                        {is24h && (
                          <span className="px-1.5 py-0.2 rounded bg-[#ff3344]/10 text-[#ff3344] text-[9px] font-mono-code font-bold uppercase border border-[#ff3344]/30">
                            &lt; 24H WINDOW
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading font-bold text-sm text-white">
                        {alert.title}
                      </h4>

                      {alert.subtitle && (
                        <p className="text-xs text-[#8b949e] font-sans">
                          {alert.subtitle}
                        </p>
                      )}

                      <div className="text-[11px] font-mono-code text-[#5c6370] pt-1">
                        Due: {alert.dueDate} • {formatRemainingHours(alert.hoursRemaining)}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {!alert.acknowledged ? (
                        <>
                          {alert.actionScreen && (
                            <button
                              type="button"
                              onClick={() => {
                                playTacticalClick();
                                onNavigate(alert.actionScreen!);
                                onAcknowledgeAlert(alert.id);
                                onClose();
                              }}
                              className={`px-2.5 py-1 rounded text-xs font-mono-code font-bold flex items-center gap-1 transition-colors ${
                                isCrit
                                  ? 'bg-[#ff3344] text-white hover:bg-[#ff4d5d]'
                                  : 'bg-[#161b22] text-[#ffaa00] border border-[#ffaa00]/40 hover:bg-[#ffaa00]/20'
                              }`}
                            >
                              <span className="material-symbols-outlined text-xs">arrow_forward</span>
                              <span>{alert.actionLabel || 'Deploy'}</span>
                            </button>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                playTacticalChirp();
                                onTriggerToast(alert);
                                onClose();
                              }}
                              className="px-2 py-0.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[10px] font-mono-code text-[#8b949e] hover:text-white"
                              title="Show floating toast alert"
                            >
                              Fire Toast
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                playTacticalClick();
                                onAcknowledgeAlert(alert.id);
                              }}
                              className="px-2 py-0.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[10px] font-mono-code text-[#8b949e] hover:text-[#00e599]"
                              title="Mark as acknowledged"
                            >
                              Ack
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] font-mono-code text-[#00e599]">
                          <span className="material-symbols-outlined text-xs">check</span>
                          <span>ACKNOWLEDGED</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#161b22] border-t border-[#21262d] flex items-center justify-between text-xs font-mono-code text-[#8b949e]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00e599]"></span>
            <span>StudyNet Proximity Daemon: Active</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg transition-colors"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
