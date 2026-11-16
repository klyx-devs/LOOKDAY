/*
# LOOKDAY complete schema

1. New Tables
- `profiles` — public profile data for each user (id = auth.users.id), display_name, avatar_url, onboarding_completed.
- `style_dna_results` — one result per user: archetype, color_palette, style_keywords, full answers (jsonb).
- `favorites` — items the user saved from any module (item_type, item_id, title, image_url, payload jsonb).
- `outfits` — saved outfits from Outfit Creator (name, item_ids, cover_label, payload jsonb).
- `care_tasks` — user's care plan tasks (category, title, frequency, weekdays boolean[7] as jsonb, done log via care_task_completions).
- `care_task_completions` — one row per completed care task per date.
- `challenge_progress` — one row per completed challenge day (day number, completed_at, note).
- `user_settings` — per-user settings (notifications, theme accent, email updates).

2. Security
- RLS enabled on every table; all policies owner-scoped via auth.uid().
- Grants: SELECT/INSERT/UPDATE/DELETE to authenticated only (app requires sign-in).
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  style_dna_completed boolean NOT NULL DEFAULT false,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS style_dna_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  archetype text NOT NULL,
  color_palette text NOT NULL,
  style_keywords text[] NOT NULL DEFAULT '{}',
  answers jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_key text NOT NULL,
  title text NOT NULL,
  subtitle text DEFAULT '',
  image_url text,
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_type, item_key)
);

CREATE TABLE IF NOT EXISTS outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  occasion text DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS care_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'general',
  title text NOT NULL,
  description text DEFAULT '',
  frequency text NOT NULL DEFAULT 'daily',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS care_task_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES care_tasks(id) ON DELETE CASCADE,
  completed_on date NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE (task_id, completed_on)
);

CREATE TABLE IF NOT EXISTS challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  day integer NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  note text DEFAULT '',
  UNIQUE (user_id, day)
);

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  notify_email boolean NOT NULL DEFAULT true,
  notify_push boolean NOT NULL DEFAULT false,
  weekly_summary boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS style_dna_results_user_idx ON style_dna_results (user_id);
CREATE INDEX IF NOT EXISTS favorites_user_idx ON favorites (user_id);
CREATE INDEX IF NOT EXISTS outfits_user_idx ON outfits (user_id);
CREATE INDEX IF NOT EXISTS care_tasks_user_idx ON care_tasks (user_id);
CREATE INDEX IF NOT EXISTS challenge_progress_user_idx ON challenge_progress (user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_dna_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON profiles, style_dna_results, favorites, outfits, care_tasks, care_task_completions, challenge_progress, user_settings TO authenticated;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "style_dna_select_own" ON style_dna_results;
CREATE POLICY "style_dna_select_own" ON style_dna_results FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "style_dna_insert_own" ON style_dna_results;
CREATE POLICY "style_dna_insert_own" ON style_dna_results FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "style_dna_update_own" ON style_dna_results;
CREATE POLICY "style_dna_update_own" ON style_dna_results FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "style_dna_delete_own" ON style_dna_results;
CREATE POLICY "style_dna_delete_own" ON style_dna_results FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_select_own" ON favorites;
CREATE POLICY "favorites_select_own" ON favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_insert_own" ON favorites;
CREATE POLICY "favorites_insert_own" ON favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_delete_own" ON favorites;
CREATE POLICY "favorites_delete_own" ON favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "outfits_select_own" ON outfits;
CREATE POLICY "outfits_select_own" ON outfits FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "outfits_insert_own" ON outfits;
CREATE POLICY "outfits_insert_own" ON outfits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "outfits_update_own" ON outfits;
CREATE POLICY "outfits_update_own" ON outfits FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "outfits_delete_own" ON outfits;
CREATE POLICY "outfits_delete_own" ON outfits FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "care_tasks_select_own" ON care_tasks;
CREATE POLICY "care_tasks_select_own" ON care_tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "care_tasks_insert_own" ON care_tasks;
CREATE POLICY "care_tasks_insert_own" ON care_tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "care_tasks_update_own" ON care_tasks;
CREATE POLICY "care_tasks_update_own" ON care_tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "care_tasks_delete_own" ON care_tasks;
CREATE POLICY "care_tasks_delete_own" ON care_tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "care_completions_select_own" ON care_task_completions;
CREATE POLICY "care_completions_select_own" ON care_task_completions FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "care_completions_insert_own" ON care_task_completions;
CREATE POLICY "care_completions_insert_own" ON care_task_completions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "care_completions_delete_own" ON care_task_completions;
CREATE POLICY "care_completions_delete_own" ON care_task_completions FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "challenge_select_own" ON challenge_progress;
CREATE POLICY "challenge_select_own" ON challenge_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "challenge_insert_own" ON challenge_progress;
CREATE POLICY "challenge_insert_own" ON challenge_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "challenge_delete_own" ON challenge_progress;
CREATE POLICY "challenge_delete_own" ON challenge_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "settings_select_own" ON user_settings;
CREATE POLICY "settings_select_own" ON user_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "settings_insert_own" ON user_settings;
CREATE POLICY "settings_insert_own" ON user_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "settings_update_own" ON user_settings;
CREATE POLICY "settings_update_own" ON user_settings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
