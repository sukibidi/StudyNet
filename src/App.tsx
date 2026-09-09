import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationDock } from './components/NavigationDock';
import { HomeScreen } from './components/HomeScreen';
import { SchedScreen } from './components/SchedScreen';
import { AiNetScreen } from './components/AiNetScreen';
import { DecksScreen } from './components/DecksScreen';
import { StatsScreen } from './components/StatsScreen';
import { DrillScreen } from './components/DrillScreen';
import { LoginScreen } from './components/LoginScreen';
import { EditProfileModal } from './components/EditProfileModal';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { TacticalToastManager } from './components/TacticalToastManager';
import { TacticalAlertCenterModal } from './components/TacticalAlertCenterModal';
import { OPERATOR_PROFILE, INITIAL_SCHEDULE_DAYS, isProfileZeroData } from './data';
import { INITIAL_TACTICAL_ALERTS, isWithin24Hours } from './alertsData';
import { DaySchedule, OperatorProfile, ScheduleItem, ScreenType, TacticalAlert } from './types';
import { initAudioSettings, playTacticalChirp } from './utils/audio';
import { TimetableInputModal } from './components/TimetableInputModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('HOME');
  const [operatorProfile, setOperatorProfile] = useState<OperatorProfile>(() => {
    try {
      const saved = localStorage.getItem('studynet_operator_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return OPERATOR_PROFILE;
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const syncTimerRef = useRef<number | null>(null);

  // Derived Zero-Data state directly from active Operator Profile
  const isZeroData = isProfileZeroData(operatorProfile);

  // Tactical Alert & Notification State
  const [alerts, setAlerts] = useState<TacticalAlert[]>(() => {
    try {
      const saved = localStorage.getItem('studynet_tactical_alerts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TACTICAL_ALERTS;
  });

  const [activeToasts, setActiveToasts] = useState<TacticalAlert[]>([]);
  const [isAlertCenterOpen, setIsAlertCenterOpen] = useState(false);
  const toastQueueInitializedRef = useRef(false);

  // Timetable Schedule State & Modal
  const [scheduleDays, setScheduleDays] = useState<DaySchedule[]>(() => {
    try {
      const saved = localStorage.getItem('studynet_schedule_days');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SCHEDULE_DAYS;
  });
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);

  const handleAddTimetableSession = (dayNumber: number, session: ScheduleItem) => {
    setScheduleDays((prev) => {
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
  };

  // Initialize audio settings and queue initial <24h toasts
  useEffect(() => {
    initAudioSettings();

    // Initial alert toast trigger for items within 24h
    if (!toastQueueInitializedRef.current && !isZeroData) {
      toastQueueInitializedRef.current = true;
      const initialWithin24h = alerts.filter(
        (a) => isWithin24Hours(a) && !a.acknowledged && !a.dismissed
      );

      if (initialWithin24h.length > 0) {
        // Trigger initial alert after brief tactical boot delay
        const timer = setTimeout(() => {
          setActiveToasts(initialWithin24h);
          playTacticalChirp();
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [alerts, isZeroData]);

  // Persist alerts
  useEffect(() => {
    try {
      localStorage.setItem('studynet_tactical_alerts', JSON.stringify(alerts));
    } catch (e) {}
  }, [alerts]);

  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, []);

  const handleSyncTelemetry = (duration = 750) => {
    setIsLoading(true);
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = window.setTimeout(() => {
      setIsLoading(false);
    }, duration);
  };

  const handleSwitchAccount = (profile: OperatorProfile) => {
    setOperatorProfile(profile);
    try {
      localStorage.setItem('studynet_operator_profile', JSON.stringify(profile));
    } catch (e) {}
    handleSyncTelemetry(600);
    playTacticalChirp(540, 0.08);
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const handleStartDrill = () => {
    setCurrentScreen('DRILL');
  };

  const handleFinishDrill = (earnedXp: number) => {
    setOperatorProfile((prev) => {
      const updated = {
        ...prev,
        xp: Math.min(prev.xp + earnedXp, prev.xpMax),
      };
      try {
        localStorage.setItem('studynet_operator_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleSaveProfile = (updated: OperatorProfile) => {
    setOperatorProfile(updated);
    try {
      localStorage.setItem('studynet_operator_profile', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoginSuccess = (profile: OperatorProfile) => {
    setOperatorProfile(profile);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('studynet_operator_profile', JSON.stringify(profile));
    } catch (e) {}
    handleSyncTelemetry(800);
  };

  // Tactical Alert Handlers
  const alertCount24h = isZeroData
    ? 0
    : alerts.filter((a) => isWithin24Hours(a) && !a.acknowledged).length;

  const handleDismissToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAcknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
    setActiveToasts([]);
  };

  const handleTriggerToast = (alert: TacticalAlert) => {
    setActiveToasts((prev) => {
      const filtered = prev.filter((t) => t.id !== alert.id);
      return [alert, ...filtered];
    });
    playTacticalChirp();
  };

  const handleAddCustomAlert = (newAlert: TacticalAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    if (isWithin24Hours(newAlert)) {
      handleTriggerToast(newAlert);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-white flex flex-col antialiased selection:bg-[#ff3344] selection:text-white overflow-x-hidden">
      {/* Top Fixed HUD Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        timerString="01:22"
        operatorProfile={operatorProfile}
        onSwitchProfile={handleSwitchAccount}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        isSyncing={isLoading}
        onSyncTelemetry={() => handleSyncTelemetry(900)}
        alertCount24h={alertCount24h}
        onOpenAlertCenter={() => setIsAlertCenterOpen(true)}
      />

      {/* Floating Tactical Toast Manager */}
      {!isZeroData && (
        <TacticalToastManager
          activeToasts={activeToasts}
          onDismiss={handleDismissToast}
          onAcknowledge={handleAcknowledgeAlert}
          onNavigate={handleNavigate}
          onOpenAlertCenter={() => setIsAlertCenterOpen(true)}
          totalAlertCount={alertCount24h}
        />
      )}

      {/* Tactical Alert Center Modal */}
      <TacticalAlertCenterModal
        isOpen={isAlertCenterOpen}
        onClose={() => setIsAlertCenterOpen(false)}
        alerts={alerts}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onAcknowledgeAll={handleAcknowledgeAll}
        onTriggerToast={handleTriggerToast}
        onAddCustomAlert={handleAddCustomAlert}
        onNavigate={handleNavigate}
      />

      {/* Main Screen Content Viewport - Strictly Centered without Horizontal Scroll */}
      <main className="flex-1 w-full flex flex-col items-center justify-start overflow-x-hidden">
        {isLoading ? (
          <LoadingSkeleton
            screen={currentScreen}
            onCancel={() => setIsLoading(false)}
            statusText={`BUFFERING ${currentScreen} TELEMETRY...`}
          />
        ) : (
          <>
            {currentScreen === 'HOME' && (
              <HomeScreen
                onNavigate={handleNavigate}
                onStartDrill={handleStartDrill}
                isZeroData={isZeroData}
                operatorProfile={operatorProfile}
                alertsWithin24hCount={alertCount24h}
                onOpenAlertCenter={() => setIsAlertCenterOpen(true)}
              />
            )}

            {currentScreen === 'SCHED' && (
              <SchedScreen
                onNavigate={handleNavigate}
                onStartDrill={handleStartDrill}
                isZeroData={isZeroData}
                scheduleDays={scheduleDays}
                onAddSession={handleAddTimetableSession}
                onOpenTimetableModal={() => setIsTimetableModalOpen(true)}
              />
            )}

            {currentScreen === 'AI-NET' && (
              <AiNetScreen
                onNavigate={handleNavigate}
                onStartDrill={handleStartDrill}
                isZeroData={isZeroData}
              />
            )}

            {currentScreen === 'DECKS' && (
              <DecksScreen
                onNavigate={handleNavigate}
                isZeroData={isZeroData}
              />
            )}

            {currentScreen === 'STATS' && (
              <StatsScreen
                onNavigate={handleNavigate}
                onStartDrill={handleStartDrill}
                isZeroData={isZeroData}
                profile={operatorProfile}
                onEditProfile={() => setIsEditProfileOpen(true)}
                onOpenLogin={() => handleNavigate('LOGIN')}
                onSwitchProfile={handleSwitchAccount}
              />
            )}

            {currentScreen === 'DRILL' && (
              <DrillScreen
                onNavigate={handleNavigate}
                onFinish={handleFinishDrill}
                operatorName={operatorProfile.name}
              />
            )}

            {currentScreen === 'LOGIN' && (
              <LoginScreen
                currentProfile={operatorProfile}
                isAlreadyAuthenticated={isAuthenticated}
                onLoginSuccess={handleLoginSuccess}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'EDIT_PROFILE' && (
              <div className="w-full max-w-xl mx-auto px-4 pt-[72px] pb-28 space-y-4 flex flex-col items-stretch">
                <div className="bg-[#10141a] rounded-2xl p-5 border border-[#21262d] flex items-center justify-between">
                  <span className="font-heading font-bold text-white text-sm">Operator Dossier Editor</span>
                  <button
                    onClick={() => handleNavigate('STATS')}
                    className="text-xs font-mono-code text-[#ff3344] hover:underline"
                  >
                    Back to Stats
                  </button>
                </div>
                <StatsScreen
                  onNavigate={handleNavigate}
                  onStartDrill={handleStartDrill}
                  isZeroData={isZeroData}
                  profile={operatorProfile}
                  onEditProfile={() => setIsEditProfileOpen(true)}
                  onOpenLogin={() => handleNavigate('LOGIN')}
                  onSwitchProfile={handleSwitchAccount}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit Profile Dossier Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={operatorProfile}
        onSave={handleSaveProfile}
      />

      {/* Timetable Schedule Input Modal */}
      <TimetableInputModal
        isOpen={isTimetableModalOpen}
        onClose={() => setIsTimetableModalOpen(false)}
        onAddSession={handleAddTimetableSession}
        scheduleDays={scheduleDays}
      />

      {/* Bottom Tactical Navigation Dock */}
      <NavigationDock
        currentScreen={currentScreen}
        onSelectScreen={handleNavigate}
      />
    </div>
  );
}
