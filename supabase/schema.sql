-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Operator profiles
create table operator_profiles (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text unique,
  handle text,
  role text not null,
  institution text,
  level integer default 1,
  xp integer default 0,
  xp_max integer default 1000,
  rank text,
  cgpa numeric default 0,
  target_cgpa numeric default 4.0,
  avatar_url text,
  target_exam text,
  focus_area text,
  is_zero_data boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subjects / taken courses
create table subjects (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references operator_profiles(id) on delete cascade,
  name text not null,
  code text not null,
  grade text not null,
  term text,
  credits integer default 3,
  area_of_expertise text,
  proficiency_percent integer default 75,
  memory_retention_percent integer default 70,
  key_strengths jsonb default '[]'::jsonb,
  cognitive_notes text,
  ai_insight jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tactical alerts
create table alerts (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references operator_profiles(id) on delete cascade,
  type text not null check (type in ('EXAM','DEADLINE','LAB','QUIZ','DRILL')),
  title text not null,
  subtitle text,
  course_code text,
  due_date text,
  hours_remaining numeric default 0,
  severity text not null check (severity in ('CRITICAL','URGENT','WARNING','INFO')),
  action_screen text,
  action_label text,
  dismissed boolean default false,
  acknowledged boolean default false,
  timestamp bigint default extract(epoch from now()) * 1000,
  source text check (source in ('SCHEDULE','SYSTEM','USER')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Schedule days
create table schedule_days (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references operator_profiles(id) on delete cascade,
  day_name text not null,
  date_number integer not null,
  is_today boolean default false,
  total_hours numeric default 0,
  completed_hours numeric default 0,
  lectures_count integer default 0,
  labs_count integer default 0,
  transit_mins integer default 0,
  free_window jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(profile_id, date_number)
);

-- Schedule items
create table schedule_items (
  id uuid default uuid_generate_v4() primary key,
  day_id uuid references schedule_days(id) on delete cascade,
  time text not null,
  title text not null,
  subtitle text,
  location text,
  badge text,
  badge_type text check (badge_type in ('active','upcoming','urgent')),
  attached_doc jsonb,
  preparation_note text,
  is_required boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Flashcards
create table flashcards (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references operator_profiles(id) on delete cascade,
  course text not null,
  card_number integer not null,
  total_cards integer default 32,
  topic text,
  category text,
  question text not null,
  key_aspect text,
  comparison jsonb not null,
  explanation text not null,
  retention_stability integer default 50,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Drill questions
create table drill_questions (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references operator_profiles(id) on delete cascade,
  course text not null,
  title text not null,
  context text,
  problem text not null,
  capacity text,
  weights text,
  values text,
  options jsonb not null,
  selected_option_id text,
  verified_label text,
  matrix jsonb,
  explanation text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CGPA history
create table cgpa_history (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references operator_profiles(id) on delete cascade,
  semester text not null,
  gpa numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Radar attributes
create table radar_attributes (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references operator_profiles(id) on delete cascade,
  axis text not null,
  value integer not null,
  max_value integer default 100,
  is_deficit boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(profile_id, axis)
);

-- Chat messages
create table chat_messages (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references operator_profiles(id) on delete cascade,
  sender text not null check (sender in ('user','ai-net')),
  timestamp text,
  text text not null,
  message_references text,
  breakdown jsonb,
  sequence jsonb,
  exam_tip text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Exam countdowns
create table exam_countdowns (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references operator_profiles(id) on delete cascade,
  title text not null,
  course text,
  subtitle text,
  location text,
  scope text,
  target_date text,
  readiness_percent integer default 0,
  streak_days integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table operator_profiles enable row level security;
alter table subjects enable row level security;
alter table alerts enable row level security;
alter table schedule_days enable row level security;
alter table schedule_items enable row level security;
alter table flashcards enable row level security;
alter table drill_questions enable row level security;
alter table cgpa_history enable row level security;
alter table radar_attributes enable row level security;
alter table chat_messages enable row level security;
alter table exam_countdowns enable row level security;

-- Public access policies for local development
create policy "Allow public read" on operator_profiles for select using (true);
create policy "Allow public insert" on operator_profiles for insert with check (true);
create policy "Allow public update" on operator_profiles for update using (true);
create policy "Allow public delete" on operator_profiles for delete using (true);

create policy "Allow public read" on subjects for select using (true);
create policy "Allow public insert" on subjects for insert with check (true);
create policy "Allow public update" on subjects for update using (true);
create policy "Allow public delete" on subjects for delete using (true);

create policy "Allow public read" on alerts for select using (true);
create policy "Allow public insert" on alerts for insert with check (true);
create policy "Allow public update" on alerts for update using (true);
create policy "Allow public delete" on alerts for delete using (true);

create policy "Allow public read" on schedule_days for select using (true);
create policy "Allow public insert" on schedule_days for insert with check (true);
create policy "Allow public update" on schedule_days for update using (true);
create policy "Allow public delete" on schedule_days for delete using (true);

create policy "Allow public read" on schedule_items for select using (true);
create policy "Allow public insert" on schedule_items for insert with check (true);
create policy "Allow public update" on schedule_items for update using (true);
create policy "Allow public delete" on schedule_items for delete using (true);

create policy "Allow public read" on flashcards for select using (true);
create policy "Allow public insert" on flashcards for insert with check (true);
create policy "Allow public update" on flashcards for update using (true);
create policy "Allow public delete" on flashcards for delete using (true);

create policy "Allow public read" on drill_questions for select using (true);
create policy "Allow public insert" on drill_questions for insert with check (true);
create policy "Allow public update" on drill_questions for update using (true);
create policy "Allow public delete" on drill_questions for delete using (true);

create policy "Allow public read" on cgpa_history for select using (true);
create policy "Allow public insert" on cgpa_history for insert with check (true);
create policy "Allow public update" on cgpa_history for update using (true);
create policy "Allow public delete" on cgpa_history for delete using (true);

create policy "Allow public read" on radar_attributes for select using (true);
create policy "Allow public insert" on radar_attributes for insert with check (true);
create policy "Allow public update" on radar_attributes for update using (true);
create policy "Allow public delete" on radar_attributes for delete using (true);

create policy "Allow public read" on chat_messages for select using (true);
create policy "Allow public insert" on chat_messages for insert with check (true);
create policy "Allow public update" on chat_messages for update using (true);
create policy "Allow public delete" on chat_messages for delete using (true);

create policy "Allow public read" on exam_countdowns for select using (true);
create policy "Allow public insert" on exam_countdowns for insert with check (true);
create policy "Allow public update" on exam_countdowns for update using (true);
create policy "Allow public delete" on exam_countdowns for delete using (true);
