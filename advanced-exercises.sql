-- Advanced Training Concepts for Experienced Athletes
-- Supersets, Drop Sets, Partials, and Unique Military-Inspired Techniques

INSERT OR IGNORE INTO exercises (name, category, subcategory, primary_muscle_group, secondary_muscle_groups, equipment_required, difficulty_level, instructions, form_cues, safety_tips, contraindications, progressions, regressions, estimated_calories_per_minute) VALUES 

-- SUPERSET COMBINATIONS (Advanced Technique)
('Superset: Bench Press + Push-ups', 'strength', 'upper_body', 'chest', '["shoulders", "triceps", "core"]', '["barbell", "bench"]', 5, 
'Perform bench press for specified reps, immediately followed by bodyweight push-ups to failure with no rest between exercises.', 
'Maintain strict form on both exercises, push through fatigue, control breathing between transitions', 
'Advanced technique - ensure proper recovery between sets, stop if form completely breaks down', 
'["shoulder_impingement", "wrist_injury"]', 
'["regular_bench_press", "assisted_pushup_finish"]', 
'["weighted_pushup_finish", "decline_pushup_finish"]', 15),

('Superset: Pull-ups + Lat Pulldowns', 'strength', 'upper_body', 'back', '["biceps", "rear_delts", "core"]', '["pull_up_bar", "cable_machine"]', 5, 
'Complete pull-ups to failure, immediately move to lat pulldowns for specified reps without rest.', 
'Full range of motion on both exercises, squeeze lats at peak contraction, controlled negatives', 
'Elite technique requiring significant upper body strength and endurance', 
'["shoulder_injury", "elbow_injury"]', 
'["assisted_pullups", "band_assisted_transition"]', 
'["weighted_pullups", "single_arm_variations"]', 14),

-- DROP SET TECHNIQUES
('Drop Set: Dumbbell Shoulder Press', 'strength', 'upper_body', 'shoulders', '["triceps", "upper_chest", "core"]', '["dumbbells"]', 4, 
'Start with challenging weight for 8-10 reps, immediately reduce weight by 20-30% and continue to failure, drop again for final burnout set.', 
'Maintain strict overhead pressing form throughout all drops, no momentum or leg drive', 
'Intense technique - have spotter assist with weight changes, stop at technical failure', 
'["shoulder_impingement", "lower_back_injury"]', 
'["single_drop", "machine_assisted"]', 
'["triple_drop", "single_arm_drops"]', 12),

('Drop Set: Goblet Squats', 'strength', 'lower_body', 'quadriceps', '["glutes", "hamstrings", "core"]', '["dumbbells", "kettlebells"]', 4, 
'Perform goblet squats with heavy weight to failure, immediately grab lighter weight and continue, finish with bodyweight squats.', 
'Full depth squats, chest up, weight stays close to body, maintain tempo control', 
'Brutal leg finisher - ensure proper warm-up, stay hydrated', 
'["knee_injury", "ankle_injury"]', 
'["single_weight_goblet", "box_squats"]', 
'["jumping_finish", "single_leg_finish"]', 11),

-- PARTIAL RANGE MOVEMENTS (Strength-Power Development)
('Squat Partials (Top Half)', 'strength', 'lower_body', 'quadriceps', '["glutes", "hamstrings"]', '["barbell", "squat_rack"]', 5, 
'Set safety bars at mid-thigh height. Perform partial squats from standing to safety bars with heavy weight, focusing on lockout strength.', 
'Explosive concentric, controlled eccentric, full hip extension, maintain tight core throughout', 
'Advanced powerlifting technique - use safety bars, have spotter, work within strength limits', 
'["knee_injury", "lower_back_injury"]', 
'["box_squats", "full_range_squats"]', 
'["pause_partials", "band_assisted_partials"]', 9),

('Bench Press Partials (Lockout)', 'strength', 'upper_body', 'chest', '["shoulders", "triceps"]', '["barbell", "bench", "power_rack"]', 5, 
'Set safety bars 4-6 inches above chest. Press from safety position to lockout with overload weight, focusing on lockout strength.', 
'Explosive press from dead stop, full lockout, retracted shoulder blades, controlled reset to bars', 
'Elite strength technique - requires power rack setup, use spotter for safety', 
'["shoulder_impingement", "elbow_injury"]', 
'["full_range_bench", "incline_partials"]', 
'["pause_partials", "slingshot_partials"]', 10),

-- PULSE TECHNIQUES (Time Under Tension)
('Pulse Squats', 'strength', 'lower_body', 'quadriceps', '["glutes", "hamstrings", "core"]', '["bodyweight", "dumbbells"]', 3, 
'Descend to bottom squat position, perform 3-5 small pulses (2-3 inch range), then return to standing. Repeat for specified reps.', 
'Stay in squat position throughout pulses, maintain tension, breathe through the burn, full extension between reps', 
'Intense time under tension technique - start with bodyweight, add load gradually', 
'["knee_injury", "ankle_injury"]', 
'["regular_squats", "wall_sits"]', 
'["weighted_pulses", "single_leg_pulses"]', 8),

('Pulse Push-ups', 'strength', 'upper_body', 'chest', '["shoulders", "triceps", "core"]', '["bodyweight"]', 4, 
'Lower to bottom push-up position, perform 3-4 small pulses, then press to full lockout. Maintain tension throughout.', 
'Stay low throughout pulse phase, maintain plank position, controlled breathing, full extension at top', 
'Advanced bodyweight technique - build up to full range first', 
'["wrist_injury", "shoulder_impingement"]', 
'["knee_pushups", "incline_pushups"]', 
'["weighted_pulses", "single_arm_pulses"]', 10),

-- UNIQUE MILITARY-INSPIRED CONCEPTS
('Ranger Diamond Push-ups', 'strength', 'upper_body', 'triceps', '["chest", "shoulders", "core"]', '["bodyweight"]', 4, 
'Hands in diamond position, perform push-up with focus on tricep engagement. Army Ranger standard technique.', 
'Hands form diamond under chest, elbows track close to body, full range of motion, maintain rigid plank', 
'Military standard exercise - build up finger and wrist strength gradually', 
'["wrist_injury", "elbow_injury"]', 
'["regular_pushups", "close_grip_pushups"]', 
'["weighted_diamond", "archer_diamond"]', 9),

('Combat Conditioning Crawl', 'functional', 'full_body', 'core', '["shoulders", "legs", "cardiovascular"]', '["bodyweight"]', 4, 
'Low crawl position, alternate reaching forward with opposite arm/leg while staying low. Military combat movement pattern.', 
'Stay low, controlled movements, engage entire core, breathe rhythmically', 
'Military functional movement - start slow, build coordination first', 
'["shoulder_injury", "wrist_injury"]', 
'["bear_crawl", "plank_holds"]', 
'["weighted_crawl", "speed_crawl"]', 12),

('Overhead Carry Complex', 'functional', 'full_body', 'shoulders', '["core", "legs", "grip"]', '["dumbbells", "kettlebells"]', 5, 
'Hold weight overhead in lockout position, walk for distance while maintaining perfect posture and breathing.', 
'Perfect overhead lockout, active shoulders, rigid core, controlled breathing, smooth gait', 
'Functional strength and stability - start with lighter weight, focus on form', 
'["shoulder_impingement", "lower_back_injury"]', 
'["farmer_carries", "front_rack_carries"]', 
'["single_arm_overhead", "bottoms_up_carry"]', 8),

-- ADVANCED PLYOMETRIC/POWER MOVEMENTS
('Depth Jump to Box Jump', 'power', 'lower_body', 'legs', '["glutes", "calves", "core"]', '["box", "platform"]', 5, 
'Step off 12-18 inch box, immediately upon landing perform maximal box jump. Focus on minimal ground contact time.', 
'Soft landing from depth, immediate reactive jump, full hip extension, land softly on box', 
'Advanced plyometric - requires significant strength base, progress gradually', 
'["knee_injury", "ankle_injury", "achilles_injury"]', 
'["box_jumps", "depth_jumps_separate"]', 
'["weighted_depth_jumps", "single_leg_variations"]', 15),

('Clapping Push-up Complex', 'power', 'upper_body', 'chest', '["shoulders", "triceps", "core"]', '["bodyweight"]', 5, 
'Explosive push-up with hand clap at top, land softly and immediately descend for next rep. Focus on speed and power.', 
'Explosive concentric, quick hand clap, soft landing, maintain perfect form throughout', 
'Advanced plyometric upper body - requires significant pushing strength base', 
'["wrist_injury", "shoulder_impingement"]', 
'["explosive_pushups", "incline_clapping"]', 
'["double_clap", "behind_back_clap"]', 12);