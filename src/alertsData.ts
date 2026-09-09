import { TacticalAlert } from './types';
import { fetchAlerts, saveAlert, getCurrentProfileId, ensureProfileId } from './lib/api';

export async function loadAlertsFromSupabase(): Promise<TacticalAlert[]> {
  const profileId = getCurrentProfileId() || (await ensureProfileId());
  const alerts = await fetchAlerts(profileId);
  return alerts.map((a) => ({
    id: a.id,
    type: a.type as TacticalAlert['type'],
    title: a.title,
    subtitle: a.subtitle,
    courseCode: a.course_code,
    dueDate: a.due_date,
    hoursRemaining: a.hours_remaining,
    severity: a.severity as TacticalAlert['severity'],
    actionScreen: a.action_screen as TacticalAlert['actionScreen'],
    actionLabel: a.action_label,
    acknowledged: a.acknowledged,
    timestamp: a.timestamp,
    source: a.source as TacticalAlert['source'],
  }));
}

export async function saveAlertToSupabase(alert: TacticalAlert): Promise<TacticalAlert> {
  const profileId = getCurrentProfileId() || (await ensureProfileId());
  const saved = await saveAlert(profileId, {
    id: alert.id,
    type: alert.type,
    title: alert.title,
    subtitle: alert.subtitle,
    course_code: alert.courseCode,
    due_date: alert.dueDate,
    hours_remaining: alert.hoursRemaining,
    severity: alert.severity,
    action_screen: alert.actionScreen,
    action_label: alert.actionLabel,
    acknowledged: alert.acknowledged,
    timestamp: alert.timestamp,
    source: alert.source,
  });
  return {
    id: saved.id,
    type: saved.type as TacticalAlert['type'],
    title: saved.title,
    subtitle: saved.subtitle,
    courseCode: saved.course_code,
    dueDate: saved.due_date,
    hoursRemaining: saved.hours_remaining,
    severity: saved.severity as TacticalAlert['severity'],
    actionScreen: saved.action_screen as TacticalAlert['actionScreen'],
    actionLabel: saved.action_label,
    acknowledged: saved.acknowledged,
    timestamp: saved.timestamp,
    source: saved.source as TacticalAlert['source'],
  };
}

export function isWithin24Hours(alert: TacticalAlert): boolean {
  return alert.hoursRemaining > 0 && alert.hoursRemaining <= 24;
}

export function formatRemainingHours(hours: number): string {
  if (hours <= 0) return 'OVERDUE';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}M REMAINING`;
  return `${h}H ${m.toString().padStart(2, '0')}M REMAINING`;
}

export function getCountdownTMinus(hours: number): string {
  if (hours <= 0) return 'T-MINUS 00:00 [DUE]';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `T-MINUS ${h.toString().padStart(2, '0')}H ${m.toString().padStart(2, '0')}M`;
}
