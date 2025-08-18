-- Harmonized Fitness AI App Database Schema
-- Initial migration for user profiling and exercise matching

-- Users table - Core user information and profile
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK(age >= 18 AND age <= 80),
  gender TEXT NOT NULL CHECK(gender IN ('male', 'female', 'non_binary', 'prefer_not_to_say')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  lead_status TEXT DEFAULT 'new' CHECK(lead_status IN ('new', 'engaged', 'converted', 'churned'))
);

-- User fitness profiles - Detailed fitness assessment data
CREATE TABLE IF NOT EXISTS user_fitness_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  experience_level TEXT NOT NULL CHECK(experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  workout_duration TEXT NOT NULL CHECK(workout_duration IN ('15-30', '30-45', '45-60', '60+')),
  primary_goal TEXT NOT NULL CHECK(primary_goal IN ('weight_loss', 'muscle_building', 'strength_power', 'military_prep', 'glute_enhancement', 'level_up')),
  workout_environment TEXT NOT NULL CHECK(workout_environment IN ('time_constrained', 'equipment_limited', 'gym_access', 'home_focused')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Equipment availability - Track what equipment each user has access to
CREATE TABLE IF NOT EXISTS user_equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  equipment_type TEXT NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, equipment_type)
);

-- User injuries and limitations - Critical for AI safety screening
CREATE TABLE IF NOT EXISTS user_injuries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  injury_type TEXT NOT NULL,
  body_part TEXT NOT NULL,
  severity TEXT CHECK(severity IN ('minor', 'moderate', 'severe')),
  is_current BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Exercise database - Comprehensive exercise library
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK(category IN ('strength', 'cardio', 'flexibility', 'functional', 'sport_specific')),
  subcategory TEXT,
  primary_muscle_group TEXT NOT NULL,
  secondary_muscle_groups TEXT, -- JSON array of additional muscles
  equipment_required TEXT NOT NULL, -- JSON array of required equipment
  difficulty_level INTEGER NOT NULL CHECK(difficulty_level BETWEEN 1 AND 5),
  instructions TEXT NOT NULL,
  form_cues TEXT NOT NULL,
  safety_tips TEXT NOT NULL,
  video_url TEXT,
  image_url TEXT,
  contraindications TEXT, -- JSON array of injuries/conditions that exclude this exercise
  progressions TEXT, -- JSON array of easier variations
  regressions TEXT, -- JSON array of harder variations
  estimated_calories_per_minute INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Exercise tags for flexible categorization and filtering
CREATE TABLE IF NOT EXISTS exercise_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  UNIQUE(exercise_id, tag)
);

-- AI workout templates - Pre-designed workout structures for different goals
CREATE TABLE IF NOT EXISTS workout_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  goal_alignment TEXT NOT NULL, -- JSON array of goals this template serves
  duration_minutes INTEGER NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK(difficulty_level BETWEEN 1 AND 5),
  workout_structure TEXT NOT NULL, -- JSON defining warmup/main/cooldown blocks
  equipment_requirements TEXT NOT NULL, -- JSON array of required equipment types
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Generated workouts - Individual workout instances created by AI for users
CREATE TABLE IF NOT EXISTS generated_workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  template_id INTEGER,
  workout_date DATE NOT NULL,
  estimated_duration INTEGER NOT NULL,
  estimated_calories INTEGER,
  difficulty_score INTEGER,
  workout_data TEXT NOT NULL, -- JSON containing complete workout structure
  completion_status TEXT DEFAULT 'pending' CHECK(completion_status IN ('pending', 'started', 'completed', 'skipped')),
  user_feedback_rating INTEGER CHECK(user_feedback_rating BETWEEN 1 AND 5),
  user_feedback_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES workout_templates(id)
);

-- User progress tracking - Monitor user advancement and AI algorithm effectiveness
CREATE TABLE IF NOT EXISTS user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  workout_id INTEGER,
  metric_type TEXT NOT NULL, -- 'strength', 'endurance', 'flexibility', 'weight', etc.
  metric_value REAL NOT NULL,
  metric_unit TEXT NOT NULL,
  recorded_date DATE NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workout_id) REFERENCES generated_workouts(id)
);

-- Lead funnel tracking - Monitor conversion through 14-day program
CREATE TABLE IF NOT EXISTS lead_funnel_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  event_type TEXT NOT NULL, -- 'profile_created', 'workout_generated', 'workout_completed', 'email_opened', 'program_signup', etc.
  event_data TEXT, -- JSON containing event-specific data
  session_id TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_lead_status ON users(lead_status);

CREATE INDEX IF NOT EXISTS idx_user_fitness_profiles_user_id ON user_fitness_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_equipment_user_id ON user_equipment(user_id);
CREATE INDEX IF NOT EXISTS idx_user_injuries_user_id ON user_injuries(user_id);
CREATE INDEX IF NOT EXISTS idx_user_injuries_current ON user_injuries(is_current);

CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_primary_muscle ON exercises(primary_muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_exercises_active ON exercises(is_active);

CREATE INDEX IF NOT EXISTS idx_exercise_tags_tag ON exercise_tags(tag);
CREATE INDEX IF NOT EXISTS idx_exercise_tags_exercise_id ON exercise_tags(exercise_id);

CREATE INDEX IF NOT EXISTS idx_generated_workouts_user_id ON generated_workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_workouts_date ON generated_workouts(workout_date);
CREATE INDEX IF NOT EXISTS idx_generated_workouts_status ON generated_workouts(completion_status);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_date ON user_progress(recorded_date);
CREATE INDEX IF NOT EXISTS idx_user_progress_metric ON user_progress(metric_type);

CREATE INDEX IF NOT EXISTS idx_lead_funnel_user_id ON lead_funnel_events(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_funnel_event_type ON lead_funnel_events(event_type);
CREATE INDEX IF NOT EXISTS idx_lead_funnel_created_at ON lead_funnel_events(created_at);