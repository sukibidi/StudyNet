import { supabase, SupabaseProfile, SupabaseSubject, SupabaseAlert, SupabaseScheduleDay, SupabaseScheduleItem, SupabaseFlashcard, SupabaseDrillQuestion, SupabaseCgpaHistory, SupabaseRadarAttribute } from './supabase';

const PROFILE_ID_KEY = 'studynet_profile_id';

export function getCurrentProfileId(): string | null {
  try {
    return localStorage.getItem(PROFILE_ID_KEY);
  } catch (e) {
    return null;
  }
}

export async function ensureProfileId(): Promise<string> {
  let id = getCurrentProfileId();
  if (!id) {
    id = crypto.randomUUID();
    try {
      localStorage.setItem(PROFILE_ID_KEY, id);
    } catch (e) {}
  }
  return id;
}

export async function getOrCreateProfile(): Promise<SupabaseProfile> {
  const profileId = await ensureProfileId();
  
  const { data: existing } = await supabase
    .from('operator_profiles')
    .select('*')
    .eq('id', profileId)
    .maybeSingle();

  if (existing) return existing as SupabaseProfile;

  const { data: newProfile, error } = await supabase
    .from('operator_profiles')
    .insert({
      id: profileId,
      name: 'Operator',
      role: 'OPERATOR',
      level: 1,
      xp: 0,
      xp_max: 1000,
      rank: 'Unranked',
      cgpa: 0,
      target_cgpa: 4.0,
      is_zero_data: true,
    })
    .select()
    .single();

  if (error) throw error;
  return newProfile as SupabaseProfile;
}

export async function fetchProfile(profileId: string): Promise<SupabaseProfile | null> {
  const { data } = await supabase
    .from('operator_profiles')
    .select('*')
    .eq('id', profileId)
    .maybeSingle();
  return data as SupabaseProfile | null;
}

export async function updateProfile(profileId: string, updates: Partial<SupabaseProfile>): Promise<SupabaseProfile> {
  const { data, error } = await supabase
    .from('operator_profiles')
    .update(updates)
    .eq('id', profileId)
    .select()
    .single();
  if (error) throw error;
  return data as SupabaseProfile;
}

export async function fetchSubjects(profileId: string): Promise<SupabaseSubject[]> {
  const { data } = await supabase
    .from('subjects')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: true });
  return (data || []) as SupabaseSubject[];
}

export async function saveSubject(profileId: string, subject: Partial<SupabaseSubject> & { id?: string }): Promise<SupabaseSubject> {
  const { id, ...rest } = subject;
  if (id) {
    const { data, error } = await supabase
      .from('subjects')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as SupabaseSubject;
  }
  const { data, error } = await supabase
    .from('subjects')
    .insert({ ...rest, profile_id: profileId })
    .select()
    .single();
  if (error) throw error;
  return data as SupabaseSubject;
}

export async function deleteSubject(id: string): Promise<void> {
  const { error } = await supabase.from('subjects').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAlerts(profileId: string): Promise<SupabaseAlert[]> {
  const { data } = await supabase
    .from('alerts')
    .select('*')
    .eq('profile_id', profileId)
    .order('timestamp', { ascending: false });
  return (data || []) as SupabaseAlert[];
}

export async function saveAlert(profileId: string, alert: Partial<SupabaseAlert> & { id?: string }): Promise<SupabaseAlert> {
  const { id, ...rest } = alert;
  if (id) {
    const { data, error } = await supabase
      .from('alerts')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as SupabaseAlert;
  }
  const { data, error } = await supabase
    .from('alerts')
    .insert({ ...rest, profile_id: profileId })
    .select()
    .single();
  if (error) throw error;
  return data as SupabaseAlert;
}

export async function fetchScheduleDays(profileId: string): Promise<SupabaseScheduleDay[]> {
  const { data } = await supabase
    .from('schedule_days')
    .select('*')
    .eq('profile_id', profileId)
    .order('date_number', { ascending: true });
  return (data || []) as SupabaseScheduleDay[];
}

export async function saveScheduleDay(profileId: string, day: Partial<SupabaseScheduleDay> & { id?: string }): Promise<SupabaseScheduleDay> {
  const { id, ...rest } = day;
  if (id) {
    const { data, error } = await supabase
      .from('schedule_days')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as SupabaseScheduleDay;
  }
  const { data, error } = await supabase
    .from('schedule_days')
    .insert({ ...rest, profile_id: profileId })
    .select()
    .single();
  if (error) throw error;
  return data as SupabaseScheduleDay;
}

export async function fetchScheduleItems(dayId: string): Promise<SupabaseScheduleItem[]> {
  const { data } = await supabase
    .from('schedule_items')
    .select('*')
    .eq('day_id', dayId)
    .order('created_at', { ascending: true });
  return (data || []) as SupabaseScheduleItem[];
}

export async function saveScheduleItem(dayId: string, item: Partial<SupabaseScheduleItem> & { id?: string }): Promise<SupabaseScheduleItem> {
  const { id, ...rest } = item;
  if (id) {
    const { data, error } = await supabase
      .from('schedule_items')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as SupabaseScheduleItem;
  }
  const { data, error } = await supabase
    .from('schedule_items')
    .insert({ ...rest, day_id: dayId })
    .select()
    .single();
  if (error) throw error;
  return data as SupabaseScheduleItem;
}

export async function fetchFlashcards(profileId: string): Promise<SupabaseFlashcard[]> {
  const { data } = await supabase
    .from('flashcards')
    .select('*')
    .eq('profile_id', profileId)
    .order('card_number', { ascending: true });
  return (data || []) as SupabaseFlashcard[];
}

export async function saveFlashcard(profileId: string, card: Partial<SupabaseFlashcard> & { id?: string }): Promise<SupabaseFlashcard> {
  const { id, ...rest } = card;
  if (id) {
    const { data, error } = await supabase
      .from('flashcards')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as SupabaseFlashcard;
  }
  const { data, error } = await supabase
    .from('flashcards')
    .insert({ ...rest, profile_id: profileId })
    .select()
    .single();
  if (error) throw error;
  return data as SupabaseFlashcard;
}

export async function fetchDrillQuestions(profileId: string): Promise<SupabaseDrillQuestion[]> {
  const { data } = await supabase
    .from('drill_questions')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: true });
  return (data || []) as SupabaseDrillQuestion[];
}

export async function saveDrillQuestion(profileId: string, q: Partial<SupabaseDrillQuestion> & { id?: string }): Promise<SupabaseDrillQuestion> {
  const { id, ...rest } = q;
  if (id) {
    const { data, error } = await supabase
      .from('drill_questions')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as SupabaseDrillQuestion;
  }
  const { data, error } = await supabase
    .from('drill_questions')
    .insert({ ...rest, profile_id: profileId })
    .select()
    .single();
  if (error) throw error;
  return data as SupabaseDrillQuestion;
}

export async function fetchCgpaHistory(profileId: string): Promise<SupabaseCgpaHistory[]> {
  const { data } = await supabase
    .from('cgpa_history')
    .select('*')
    .eq('profile_id', profileId)
    .order('semester', { ascending: true });
  return (data || []) as SupabaseCgpaHistory[];
}

export async function fetchRadarAttributes(profileId: string): Promise<SupabaseRadarAttribute[]> {
  const { data } = await supabase
    .from('radar_attributes')
    .select('*')
    .eq('profile_id', profileId);
  return (data || []) as SupabaseRadarAttribute[];
}

export async function saveRadarAttribute(profileId: string, attr: Partial<SupabaseRadarAttribute> & { axis: string }): Promise<SupabaseRadarAttribute> {
  const { axis, ...rest } = attr;
  const { data, error } = await supabase
    .from('radar_attributes')
    .upsert({ ...rest, profile_id: profileId, axis }, { onConflict: 'profile_id,axis' })
    .select()
    .single();
  if (error) throw error;
  return data as SupabaseRadarAttribute;
}
