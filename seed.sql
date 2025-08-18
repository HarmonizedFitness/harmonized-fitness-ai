-- Harmonized Fitness Exercise Database Seed Data
-- Comprehensive exercise library reflecting military precision and holistic wellness

-- Insert foundational strength exercises
INSERT OR IGNORE INTO exercises (name, category, subcategory, primary_muscle_group, secondary_muscle_groups, equipment_required, difficulty_level, instructions, form_cues, safety_tips, contraindications, progressions, regressions, estimated_calories_per_minute) VALUES 

-- BODYWEIGHT FOUNDATIONS
('Push-up', 'strength', 'upper_body', 'chest', '["shoulders", "triceps", "core"]', '["bodyweight"]', 2, 
'Start in plank position with hands slightly wider than shoulders. Lower chest to ground, then push back up to starting position.', 
'Keep core tight, straight line from head to heels, full range of motion', 
'Start with modified versions if needed, avoid if you have wrist pain', 
'["wrist_injury", "shoulder_impingement"]', 
'["wall_pushup", "incline_pushup", "knee_pushup"]', 
'["diamond_pushup", "archer_pushup", "one_arm_pushup"]', 8),

('Bodyweight Squat', 'strength', 'lower_body', 'quadriceps', '["glutes", "hamstrings", "calves", "core"]', '["bodyweight"]', 1, 
'Stand with feet shoulder-width apart. Lower hips back and down as if sitting in chair, then return to standing.', 
'Chest up, knees track over toes, weight in heels, full depth if mobility allows', 
'Start with assisted squats if needed, stop if knee pain occurs', 
'["knee_injury", "ankle_injury"]', 
'["assisted_squat", "box_squat", "partial_squat"]', 
'["jump_squat", "pistol_squat", "bulgarian_split_squat"]', 6),

('Plank', 'strength', 'core', 'core', '["shoulders", "glutes"]', '["bodyweight"]', 2, 
'Hold straight line from head to heels in push-up position. Maintain position for specified time.', 
'Engage core, neutral spine, breathe normally, no sagging hips', 
'Start with shorter holds, avoid if lower back pain persists', 
'["lower_back_injury", "shoulder_impingement"]', 
'["wall_plank", "incline_plank", "knee_plank"]', 
'["side_plank", "plank_to_pushup", "single_arm_plank"]', 5),

-- MILITARY-INSPIRED FUNCTIONAL MOVEMENTS
('Burpee', 'functional', 'full_body', 'full_body', '["chest", "shoulders", "legs", "core", "cardiovascular"]', '["bodyweight"]', 4, 
'From standing, squat down and place hands on ground. Jump feet back to plank, perform push-up, jump feet forward, then jump up with arms overhead.', 
'Maintain form throughout movement, land softly, modify as needed', 
'High intensity exercise - modify if experiencing joint pain or cardiovascular concerns', 
'["heart_condition", "knee_injury", "wrist_injury"]', 
'["step_back_burpee", "no_pushup_burpee", "no_jump_burpee"]', 
'["burpee_box_jump", "single_leg_burpee", "burpee_pullup"]', 12),

('Mountain Climber', 'cardio', 'full_body', 'core', '["shoulders", "legs", "cardiovascular"]', '["bodyweight"]', 3, 
'Start in plank position. Alternate bringing knees toward chest in running motion while maintaining plank.', 
'Keep hips level, core engaged, controlled movement', 
'Maintain proper plank form, modify speed if form breaks down', 
'["wrist_injury", "lower_back_injury"]', 
'["slow_mountain_climber", "incline_mountain_climber"]', 
'["cross_body_mountain_climber", "single_leg_mountain_climber"]', 10),

-- RESISTANCE BAND EXERCISES (Equipment-Limited Category)
('Resistance Band Rows', 'strength', 'upper_body', 'back', '["biceps", "rear_delts"]', '["resistance_bands"]', 2, 
'Anchor band at chest height. Pull handles toward chest, squeezing shoulder blades together.', 
'Chest up, shoulders down, control both pulling and releasing phases', 
'Use appropriate resistance level, check band for wear before use', 
'["shoulder_injury", "elbow_injury"]', 
'["seated_band_row", "single_arm_row"]', 
'["wide_grip_row", "high_row", "low_row"]', 6),

('Banded Squats', 'strength', 'lower_body', 'quadriceps', '["glutes", "hamstrings"]', '["resistance_bands"]', 2, 
'Place band around thighs or hold handles while performing squats. Band adds resistance throughout movement.', 
'Maintain squat form, fight against band resistance', 
'Choose appropriate band tension, maintain control', 
'["knee_injury"]', 
'["mini_band_squat", "assisted_band_squat"]', 
'["band_jump_squat", "single_leg_band_squat"]', 7),

-- DUMBBELL EXERCISES (Home Gym Focus)
('Dumbbell Chest Press', 'strength', 'upper_body', 'chest', '["shoulders", "triceps"]', '["dumbbells"]', 3, 
'Lie on bench or floor with dumbbells. Press weights up from chest level to full arm extension.', 
'Control the weight, full range of motion, don''t arch back excessively', 
'Use spotter if available, start with lighter weight', 
'["shoulder_impingement", "wrist_injury"]', 
'["floor_press", "incline_press"]', 
'["single_arm_press", "alternating_press"]', 7),

('Dumbbell Deadlift', 'strength', 'lower_body', 'hamstrings', '["glutes", "lower_back", "traps"]', '["dumbbells"]', 3, 
'Hold dumbbells at sides. Hinge at hips, lower weights while keeping back straight, then return to standing.', 
'Chest up, shoulders back, weight in heels, neutral spine', 
'Start with lighter weight, focus on form before adding load', 
'["lower_back_injury"]', 
'["romanian_deadlift", "single_leg_deadlift"]', 
'["sumo_deadlift", "deficit_deadlift"]', 8),

-- YOGA AND FLEXIBILITY (Holistic Wellness)
('Downward Dog', 'flexibility', 'yoga', 'shoulders', '["hamstrings", "calves", "back"]', '["bodyweight"]', 2, 
'From hands and knees, tuck toes and lift hips up and back. Form inverted V shape with body.', 
'Straight arms, long spine, pedal feet to stretch calves', 
'Modify with bent knees if tight hamstrings, avoid if wrist pain', 
'["wrist_injury", "shoulder_impingement"]', 
'["downward_dog_on_forearms", "wall_downward_dog"]', 
'["one_leg_downward_dog", "downward_dog_pushup"]', 4),

('Warrior II', 'flexibility', 'yoga', 'legs', '["hips", "core", "shoulders"]', '["bodyweight"]', 2, 
'Step into wide stance, turn front foot forward, back foot parallel. Bend front knee over ankle, arms parallel to ground.', 
'Front knee over ankle, back leg straight, shoulders over hips', 'Hold only as long as comfortable, breathe deeply', 
'["knee_injury", "hip_injury"]', 
'["supported_warrior_II", "chair_warrior_II"]', 
'["warrior_III", "side_angle_pose"]', 3),

-- HIIT CARDIO EXERCISES
('Jumping Jacks', 'cardio', 'full_body', 'cardiovascular', '["legs", "shoulders"]', '["bodyweight"]', 2, 
'Jump feet apart while raising arms overhead, then jump feet together while lowering arms.', 
'Land softly, maintain rhythm, modify arm movement if needed', 
'Low impact modification available, avoid if joint pain', 
'["ankle_injury", "knee_injury"]', 
'["step_touch", "arm_only_jacks"]', 
'["star_jumps", "cross_country_jacks"]', 8),

('High Knees', 'cardio', 'lower_body', 'hip_flexors', '["quadriceps", "calves", "core"]', '["bodyweight"]', 3, 
'Run in place bringing knees up toward chest as high as possible.', 
'Pump arms, stay on balls of feet, maintain tall posture', 
'Modify height and speed as needed, land softly', 
'["knee_injury", "ankle_injury"]', 
'["marching_in_place", "low_knees"]', 
'["single_leg_high_knees", "high_knee_skips"]', 9);

-- Insert exercise tags for better categorization
INSERT OR IGNORE INTO exercise_tags (exercise_id, tag) VALUES 
(1, 'beginner_friendly'), (1, 'upper_body'), (1, 'no_equipment'),
(2, 'beginner_friendly'), (2, 'lower_body'), (2, 'functional'),
(3, 'core_strength'), (3, 'isometric'), (3, 'beginner_friendly'),
(4, 'high_intensity'), (4, 'military_style'), (4, 'full_body'),
(5, 'cardio'), (5, 'core_focused'), (5, 'dynamic'),
(6, 'upper_body'), (6, 'equipment_needed'), (6, 'back_focused'),
(7, 'lower_body'), (7, 'equipment_needed'), (7, 'glute_focused'),
(8, 'upper_body'), (8, 'equipment_needed'), (8, 'chest_focused'),
(9, 'lower_body'), (9, 'equipment_needed'), (9, 'posterior_chain'),
(10, 'flexibility'), (10, 'yoga'), (10, 'full_body_stretch'),
(11, 'flexibility'), (11, 'yoga'), (11, 'strength_flexibility'),
(12, 'cardio'), (12, 'beginner_friendly'), (12, 'full_body'),
(13, 'cardio'), (13, 'high_intensity'), (13, 'lower_body');

-- Insert workout templates aligned with user goals
INSERT OR IGNORE INTO workout_templates (name, goal_alignment, duration_minutes, difficulty_level, workout_structure, equipment_requirements) VALUES 

('Beginner Total Body', '["weight_loss", "muscle_building"]', 30, 2, 
'{"warmup": ["Jumping Jacks", "Bodyweight Squat"], "main": ["Push-up", "Bodyweight Squat", "Plank", "Mountain Climber"], "cooldown": ["Downward Dog"]}', 
'["bodyweight"]'),

('Military-Style HIIT', '["weight_loss", "military_tactical", "next_level_performance"]', 45, 4, 
'{"warmup": ["High Knees", "Jumping Jacks"], "main": ["Burpee", "Mountain Climber", "Push-up", "Bodyweight Squat"], "cooldown": ["Downward Dog", "Warrior II"]}', 
'["bodyweight"]'),

('Glute-Focused Strength', '["glute_enhancement", "muscle_building"]', 35, 3, 
'{"warmup": ["Bodyweight Squat", "High Knees"], "main": ["Dumbbell Deadlift", "Banded Squats", "Bulgarian Split Squat"], "cooldown": ["Warrior II"]}', 
'["dumbbells", "resistance_bands"]'),

('Quick Morning Flow', '["weight_loss", "strength_power"]', 20, 2, 
'{"warmup": ["Downward Dog"], "main": ["Push-up", "Bodyweight Squat", "Plank"], "cooldown": ["Warrior II", "Downward Dog"]}', 
'["bodyweight"]'),

('Home Gym Power', '["strength_power", "muscle_building"]', 50, 3, 
'{"warmup": ["Jumping Jacks", "Bodyweight Squat"], "main": ["Dumbbell Chest Press", "Dumbbell Deadlift", "Resistance Band Rows", "Push-up"], "cooldown": ["Downward Dog", "Warrior II"]}', 
'["dumbbells", "resistance_bands"]');

-- Insert sample equipment types for user profiling
INSERT OR IGNORE INTO exercises (name, category, subcategory, primary_muscle_group, secondary_muscle_groups, equipment_required, difficulty_level, instructions, form_cues, safety_tips, contraindications, progressions, regressions, estimated_calories_per_minute) VALUES 

-- Additional exercises for comprehensive library
('Pull-up', 'strength', 'upper_body', 'back', '["biceps", "shoulders"]', '["pullup_bar"]', 4, 
'Hang from bar with palms facing away. Pull body up until chin clears bar, then lower with control.', 
'Full hang, chest to bar, control descent, engage core', 
'Use assistance if needed, progress gradually', 
'["shoulder_impingement", "elbow_injury"]', 
'["assisted_pullup", "negative_pullup", "inverted_row"]', 
'["weighted_pullup", "one_arm_pullup", "muscle_up"]', 10),

('Kettlebell Swing', 'functional', 'full_body', 'glutes', '["hamstrings", "core", "shoulders"]', '["kettlebells"]', 3, 
'Stand with feet shoulder-width apart, kettlebell between legs. Hinge at hips and swing kettlebell to shoulder height.', 
'Hip hinge movement, arms relaxed, power from hips', 
'Start with lighter weight, master hip hinge pattern first', 
'["lower_back_injury"]', 
'["two_hand_swing", "goblet_squat"]', 
'["single_arm_swing", "kettlebell_snatch"]', 12),

('Turkish Get-up', 'functional', 'full_body', 'core', '["shoulders", "hips", "stability"]', '["kettlebells"]', 5, 
'Complex movement from lying to standing while holding weight overhead. Reverse to return to start.', 
'Slow controlled movement, keep weight stable overhead, practice without weight first', 
'Master each position before adding weight, stop if any pain', 
'["shoulder_injury", "wrist_injury"]', 
'["bodyweight_getup", "partial_getup"]', 
'["heavy_getup", "double_getup"]', 8);

-- Add tags for new exercises
INSERT OR IGNORE INTO exercise_tags (exercise_id, tag) VALUES 
(14, 'advanced'), (14, 'upper_body'), (14, 'equipment_needed'),
(15, 'functional'), (15, 'posterior_chain'), (15, 'equipment_needed'),
(16, 'advanced'), (16, 'full_body'), (16, 'complex_movement');