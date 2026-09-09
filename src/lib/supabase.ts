import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in .env, then restart the dev server.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseProfile = {
  id: string;
  name: string;
  email?: string;
  handle?: string;
  role: string;
  institution?: string;
  level: number;
  xp: number;
  xp_max: number;
  rank: string;
  cgpa: number;
  target_cgpa: number;
  avatar_url: string;
  target_exam?: string;
  focus_area?: string;
  is_zero_data: boolean;
};

export type SupabaseSubject = {
  id: string;
  profile_id: string;
  name: string;
  code: string;
  grade: string;
  term?: string;
  credits?: number;
  area_of_expertise: string;
  proficiency_percent: number;
  memory_retention_percent: number;
  key_strengths: string[];
  cognitive_notes?: string;
  ai_insight?: Record<string, any>;
};

export type SupabaseAlert = {
  id: string;
  profile_id: string;
  type: 'EXAM' | 'DEADLINE' | 'LAB' | 'QUIZ' | 'DRILL';
  title: string;
  subtitle?: string;
  course_code: string;
  due_date: string;
  hours_remaining: number;
  severity: 'CRITICAL' | 'URGENT' | 'WARNING' | 'INFO';
  action_screen?: string;
  action_label?: string;
  dismissed?: boolean;
  acknowledged?: boolean;
  timestamp: number;
  source?: 'SCHEDULE' | 'SYSTEM' | 'USER';
};

export type SupabaseScheduleDay = {
  id: string;
  profile_id: string;
  day_name: string;
  date_number: number;
  is_today?: boolean;
  total_hours: number;
  completed_hours: number;
  lectures_count: number;
  labs_count: number;
  transit_mins: number;
  free_window?: Record<string, any>;
};

export type SupabaseScheduleItem = {
  id: string;
  day_id: string;
  time: string;
  title: string;
  subtitle?: string;
  location: string;
  badge?: string;
  badge_type?: 'active' | 'upcoming' | 'urgent';
  attached_doc?: Record<string, any>;
  preparation_note?: string;
  is_required?: boolean;
};

export type SupabaseFlashcard = {
  id: string;
  profile_id: string;
  course: string;
  card_number: number;
  total_cards: number;
  topic: string;
  category: string;
  question: string;
  key_aspect: string;
  comparison: Record<string, any>;
  explanation: string;
  retention_stability: number;
};

export type SupabaseDrillQuestion = {
  id: string;
  profile_id: string;
  course: string;
  title: string;
  context: string;
  problem: string;
  capacity: string;
  weights: string;
  values: string;
  options: Record<string, any>[];
  selected_option_id?: string;
  verified_label: string;
  matrix: Record<string, any>;
  explanation: string;
};

export type SupabaseCgpaHistory = {
  id: string;
  profile_id: string;
  semester: string;
  gpa: number;
};

export type SupabaseRadarAttribute = {
  id: string;
  profile_id: string;
  axis: string;
  value: number;
  max_value: number;
  is_deficit?: boolean;
};
