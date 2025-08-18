// AI-Powered 14-Day Program Generator
// Creates personalized workout programs based on user assessment data

export class ProgramGenerator {
  constructor() {
    this.restDaySchedule = [4, 7, 11, 14]; // Strategic rest days
    this.progressionMultipliers = {
      beginner: { week1: 0.7, week2: 0.85 },
      intermediate: { week1: 0.8, week2: 0.95 },
      advanced: { week1: 0.9, week2: 1.0 },
      expert: { week1: 1.0, week2: 1.1 }
    };
  }

  // Main program generation function
  async generatePersonalized14DayProgram(userProfile, exercises) {
    const { fitness_profile, equipment, injuries } = userProfile;
    
    // Create the 14-day program structure
    const program = {
      user_profile: userProfile,
      program_overview: this.generateProgramOverview(fitness_profile),
      daily_plans: {},
      progression_notes: this.generateProgressionNotes(fitness_profile),
      nutrition_guidance: this.generateNutritionGuidance(fitness_profile),
      created_at: new Date().toISOString()
    };

    // Generate each day's plan
    for (let day = 1; day <= 14; day++) {
      if (this.restDaySchedule.includes(day)) {
        program.daily_plans[day] = this.generateRestDay(day, fitness_profile);
      } else {
        program.daily_plans[day] = await this.generateWorkoutDay(
          day, 
          fitness_profile, 
          equipment, 
          injuries, 
          exercises
        );
      }
    }

    return program;
  }

  // Generate program overview based on user goals
  generateProgramOverview(fitnessProfile) {
    const goalDescriptions = {
      weight_loss: "High-intensity fat-burning program designed to maximize calorie burn while preserving lean muscle mass.",
      muscle_building: "Progressive resistance training focused on hypertrophy and strength development across all major muscle groups.",
      strength_power: "Military-style strength and power development using functional movements and compound exercises.",
      military_tactical: "Combat-ready conditioning program emphasizing functional fitness, endurance, and mental toughness.",
      glute_enhancement: "Targeted lower body development with emphasis on glute activation, strength, and aesthetic enhancement.",
      next_level_performance: "Elite-level training protocol designed for advanced athletes seeking peak performance optimization."
    };

    const durationDescriptions = {
      "15-30": "Time-efficient, high-intensity sessions perfect for busy schedules.",
      "30-45": "Balanced workout duration allowing for comprehensive training with adequate recovery.",
      "45-60": "Extended sessions for thorough muscle development and skill refinement.",
      "60+": "In-depth training sessions for maximum adaptation and performance gains."
    };

    return {
      primary_goal: goalDescriptions[fitnessProfile.primary_goal],
      duration_focus: durationDescriptions[fitnessProfile.workout_duration],
      experience_level: `Designed for ${fitnessProfile.experience_level} level practitioners`,
      workout_environment: fitnessProfile.workout_environment,
      total_workouts: 10,
      rest_days: 4,
      progressive_overload: "Each week builds upon the previous with increased intensity and complexity"
    };
  }

  // Generate individual workout day
  async generateWorkoutDay(day, fitnessProfile, equipment, injuries, exercises) {
    const week = day <= 7 ? 1 : 2;
    const dayInWeek = week === 1 ? day : day - 7;
    const progressionMultiplier = this.progressionMultipliers[fitnessProfile.experience_level][`week${week}`];

    // Determine workout focus for the day
    const workoutFocus = this.determineWorkoutFocus(day, fitnessProfile.primary_goal);
    
    // Filter exercises based on user profile
    const availableExercises = this.filterExercisesByProfile(exercises, equipment, injuries, workoutFocus);
    
    // Select exercises for the day
    const selectedExercises = this.selectExercisesForDay(
      availableExercises, 
      fitnessProfile, 
      workoutFocus,
      progressionMultiplier
    );

    // Calculate workout duration
    const targetDuration = this.calculateTargetDuration(fitnessProfile.workout_duration);

    return {
      day_number: day,
      week: week,
      workout_focus: workoutFocus,
      estimated_duration: targetDuration,
      difficulty_level: Math.ceil(this.calculateDifficultyLevel(fitnessProfile, progressionMultiplier)),
      warmup: this.generateWarmup(workoutFocus),
      main_exercises: selectedExercises,
      cooldown: this.generateCooldown(workoutFocus),
      coaching_notes: this.generateCoachingNotes(day, fitnessProfile, workoutFocus),
      progression_from_previous: day > 1 ? this.generateProgressionNotes(day, progressionMultiplier) : null
    };
  }

  // Determine workout focus based on day and goals
  determineWorkoutFocus(day, primaryGoal) {
    const focusPatterns = {
      weight_loss: ['full_body_hiit', 'cardio_strength', 'metabolic', 'full_body_circuit'],
      muscle_building: ['upper_body', 'lower_body', 'push', 'pull'],
      strength_power: ['compound_strength', 'power_development', 'functional_strength', 'core_stability'],
      military_tactical: ['combat_conditioning', 'functional_fitness', 'endurance_strength', 'agility_power'],
      glute_enhancement: ['lower_body_focus', 'glute_activation', 'posterior_chain', 'functional_lower'],
      next_level_performance: ['sport_specific', 'power_endurance', 'advanced_strength', 'performance_conditioning']
    };

    const pattern = focusPatterns[primaryGoal];
    const cycleIndex = ((day - 1) % pattern.length);
    return pattern[cycleIndex];
  }

  // Filter exercises based on user equipment and injuries
  filterExercisesByProfile(exercises, equipment, injuries, workoutFocus) {
    const injuryTypes = injuries.map(injury => injury.injury_type || injury.type);
    
    return exercises.filter(exercise => {
      // Check equipment availability
      const requiredEquipment = JSON.parse(exercise.equipment_required || '["bodyweight"]');
      const hasEquipment = requiredEquipment.some(req => equipment.includes(req));
      
      // Check injury contraindications
      const contraindications = exercise.contraindications || '';
      const hasContraindication = injuryTypes.some(injury => 
        contraindications.toLowerCase().includes(injury.toLowerCase())
      );
      
      // Check workout focus alignment
      const exerciseTags = exercise.category + ' ' + (exercise.subcategory || '');
      const focusMatch = this.doesExerciseMatchFocus(exerciseTags, workoutFocus);
      
      return hasEquipment && !hasContraindication && focusMatch;
    });
  }

  // Check if exercise matches workout focus
  doesExerciseMatchFocus(exerciseTags, workoutFocus) {
    const focusKeywords = {
      full_body_hiit: ['strength', 'cardio', 'functional'],
      upper_body: ['strength', 'upper'],
      lower_body: ['strength', 'lower'],
      cardio_strength: ['cardio', 'strength'],
      metabolic: ['cardio', 'functional'],
      combat_conditioning: ['functional', 'strength'],
      glute_activation: ['strength', 'lower'],
      // Add more mappings as needed
    };

    const keywords = focusKeywords[workoutFocus] || ['strength', 'functional'];
    return keywords.some(keyword => exerciseTags.toLowerCase().includes(keyword));
  }

  // Select specific exercises for the day
  selectExercisesForDay(availableExercises, fitnessProfile, workoutFocus, progressionMultiplier) {
    const targetExerciseCount = this.getTargetExerciseCount(fitnessProfile.workout_duration);
    
    // Prioritize exercises by goal alignment and difficulty
    const prioritizedExercises = availableExercises
      .map(exercise => ({
        ...exercise,
        priority_score: this.calculateExercisePriority(exercise, fitnessProfile, workoutFocus)
      }))
      .sort((a, b) => b.priority_score - a.priority_score);

    // Select top exercises and calculate sets/reps
    const selectedExercises = prioritizedExercises
      .slice(0, targetExerciseCount)
      .map((exercise, index) => ({
        exercise_name: exercise.name,
        exercise_id: exercise.id,
        order: index + 1,
        primary_muscle_group: exercise.primary_muscle_group,
        secondary_muscles: exercise.secondary_muscle_groups,
        instructions: exercise.instructions,
        form_cues: exercise.form_cues,
        safety_tips: exercise.safety_tips,
        ...this.calculateSetsReps(exercise, fitnessProfile, progressionMultiplier),
        estimated_calories: Math.round(exercise.estimated_calories_per_minute * 3), // Assume 3 min per exercise
        difficulty_rating: exercise.difficulty_level,
        equipment_needed: exercise.equipment_required,
        modifications: this.generateModifications(exercise, fitnessProfile)
      }));

    return selectedExercises;
  }

  // Calculate sets and reps based on user profile and progression
  calculateSetsReps(exercise, fitnessProfile, progressionMultiplier) {
    const baseReps = {
      beginner: { strength: 8, cardio: 20, flexibility: 30 },
      intermediate: { strength: 10, cardio: 25, flexibility: 45 },
      advanced: { strength: 12, cardio: 30, flexibility: 60 },
      expert: { strength: 15, cardio: 35, flexibility: 90 }
    };

    const baseSets = {
      beginner: 2,
      intermediate: 3,
      advanced: 3,
      expert: 4
    };

    const category = exercise.category || 'strength';
    const baseRepCount = baseReps[fitnessProfile.experience_level][category] || baseReps[fitnessProfile.experience_level].strength;
    const baseSetCount = baseSets[fitnessProfile.experience_level];

    // Apply progression multiplier
    const adjustedReps = Math.round(baseRepCount * progressionMultiplier);
    const adjustedSets = Math.max(1, Math.round(baseSetCount * progressionMultiplier));

    // Goal-specific adjustments
    const goalAdjustments = {
      weight_loss: { reps: 1.2, sets: 1.1, rest: 30 },
      muscle_building: { reps: 1.0, sets: 1.2, rest: 60 },
      strength_power: { reps: 0.8, sets: 1.3, rest: 90 },
      military_tactical: { reps: 1.1, sets: 1.1, rest: 45 },
      glute_enhancement: { reps: 1.1, sets: 1.0, rest: 45 },
      next_level_performance: { reps: 1.3, sets: 1.2, rest: 75 }
    };

    const adjustment = goalAdjustments[fitnessProfile.primary_goal] || goalAdjustments.muscle_building;

    return {
      sets: Math.round(adjustedSets * adjustment.sets),
      reps: category === 'flexibility' ? `${adjustedReps} seconds` : Math.round(adjustedReps * adjustment.reps),
      rest_seconds: adjustment.rest,
      tempo_notes: this.generateTempoNotes(fitnessProfile.primary_goal, category),
      intensity_level: Math.ceil(progressionMultiplier * 5) // 1-5 scale
    };
  }

  // Generate rest day activities
  generateRestDay(day, fitnessProfile) {
    const restActivities = {
      4: {
        title: "Active Recovery & Mobility",
        focus: "Light movement and flexibility",
        activities: [
          "10-15 minute gentle walk",
          "Full body stretching routine (15 min)",
          "Deep breathing exercises (5 min)",
          "Hydration focus: Extra 16oz water"
        ]
      },
      7: {
        title: "Week 1 Recovery & Assessment",
        focus: "Rest, recover, and reflect on progress",
        activities: [
          "Complete rest from structured exercise",
          "Gentle yoga or meditation (20 min)",
          "Nutrition planning for Week 2",
          "Progress photos and measurements",
          "Journal about energy levels and mood"
        ]
      },
      11: {
        title: "Mid-Week Recovery Boost",
        focus: "Prepare for final push",
        activities: [
          "Light activity: leisurely bike ride or walk",
          "Foam rolling or self-massage (15 min)",
          "Meal prep for remaining days",
          "Extra sleep: aim for 8+ hours"
        ]
      },
      14: {
        title: "Program Completion & Planning",
        focus: "Celebrate achievements and plan next steps",
        activities: [
          "Final progress assessment",
          "Celebrate your commitment and progress!",
          "Plan your next fitness goals",
          "Schedule consultation with Kyle for continued guidance"
        ]
      }
    };

    return {
      day_number: day,
      type: "rest_day",
      ...restActivities[day],
      coaching_notes: this.generateRestDayCoaching(day, fitnessProfile),
      nutrition_focus: this.generateRestDayNutrition(day)
    };
  }

  // Generate warmup routine
  generateWarmup(workoutFocus) {
    const warmupRoutines = {
      full_body_hiit: [
        "Jumping jacks - 30 seconds",
        "Arm circles - 20 forward, 20 backward", 
        "Leg swings - 10 each direction",
        "Bodyweight squats - 10 reps",
        "High knees - 20 seconds"
      ],
      upper_body: [
        "Arm circles - 20 forward, 20 backward",
        "Shoulder rolls - 10 forward, 10 backward",
        "Cat-cow stretches - 10 reps",
        "Wall push-ups - 10 reps",
        "Torso twists - 10 each side"
      ],
      lower_body: [
        "Leg swings - 10 forward/back, 10 side to side each leg",
        "Bodyweight squats - 10 reps",
        "Lunges - 5 each leg",
        "Calf raises - 15 reps",
        "Hip circles - 10 each direction"
      ]
    };

    return {
      duration_minutes: 5,
      exercises: warmupRoutines[workoutFocus] || warmupRoutines.full_body_hiit,
      notes: "Prepare your body for the workout ahead. Focus on controlled movements and gradual intensity increase."
    };
  }

  // Generate cooldown routine
  generateCooldown(workoutFocus) {
    const cooldownRoutines = {
      default: [
        "Deep breathing - 1 minute",
        "Forward fold stretch - 30 seconds",
        "Downward dog - 30 seconds", 
        "Child's pose - 45 seconds",
        "Gentle spinal twist - 30 seconds each side"
      ]
    };

    return {
      duration_minutes: 5,
      exercises: cooldownRoutines.default,
      notes: "Allow your body to gradually return to resting state. Focus on deep breathing and gentle stretching."
    };
  }

  // Helper methods
  calculateTargetDuration(workoutDuration) {
    const durations = {
      "15-30": 25,
      "30-45": 37,
      "45-60": 52,
      "60+": 75
    };
    return durations[workoutDuration] || 30;
  }

  getTargetExerciseCount(workoutDuration) {
    const counts = {
      "15-30": 4,
      "30-45": 6,
      "45-60": 8,
      "60+": 10
    };
    return counts[workoutDuration] || 5;
  }

  calculateExercisePriority(exercise, fitnessProfile, workoutFocus) {
    let score = 0;
    
    // Goal alignment
    const goalKeywords = {
      weight_loss: ['cardio', 'functional', 'hiit'],
      muscle_building: ['strength', 'hypertrophy'],
      strength_power: ['strength', 'power'],
      military_tactical: ['functional', 'compound'],
      glute_enhancement: ['lower', 'glute', 'posterior'],
      next_level_performance: ['advanced', 'complex']
    };

    const keywords = goalKeywords[fitnessProfile.primary_goal] || [];
    const exerciseText = (exercise.category + ' ' + exercise.subcategory + ' ' + exercise.name).toLowerCase();
    keywords.forEach(keyword => {
      if (exerciseText.includes(keyword)) score += 10;
    });

    // Difficulty appropriateness
    const targetDifficulty = {
      beginner: 2,
      intermediate: 3,
      advanced: 4,
      expert: 5
    }[fitnessProfile.experience_level] || 3;

    const difficultyMatch = 5 - Math.abs(exercise.difficulty_level - targetDifficulty);
    score += difficultyMatch * 5;

    return score;
  }

  calculateDifficultyLevel(fitnessProfile, progressionMultiplier) {
    const baseDifficulty = {
      beginner: 2,
      intermediate: 3, 
      advanced: 4,
      expert: 5
    }[fitnessProfile.experience_level] || 3;

    return baseDifficulty * progressionMultiplier;
  }

  generateTempoNotes(primaryGoal, category) {
    const tempos = {
      weight_loss: "Fast, explosive movements with minimal rest",
      muscle_building: "Controlled 2-1-2 tempo (2 sec down, 1 sec pause, 2 sec up)",
      strength_power: "Explosive concentric, controlled eccentric", 
      military_tactical: "Variable tempo based on tactical requirements",
      glute_enhancement: "Slow, controlled with focus on muscle activation",
      next_level_performance: "Sport-specific tempo patterns"
    };

    return tempos[primaryGoal] || "Controlled movement with focus on form";
  }

  generateModifications(exercise, fitnessProfile) {
    const modifications = {
      easier: [],
      harder: []
    };

    // Add experience-based modifications
    if (fitnessProfile.experience_level === 'beginner') {
      modifications.easier.push("Reduce range of motion", "Use assisted version", "Decrease tempo");
    }

    if (fitnessProfile.experience_level === 'expert') {
      modifications.harder.push("Add pause at bottom", "Increase tempo", "Add resistance");
    }

    return modifications;
  }

  generateCoachingNotes(day, fitnessProfile, workoutFocus) {
    const weeklyMessages = {
      1: "Welcome to your transformation! Focus on learning proper form and listening to your body.",
      2: "You're building momentum! Push yourself while maintaining excellent technique.",
      8: "Week 2 begins - time to elevate your intensity and see what you're truly capable of!",
      10: "Final week push! Your body is adapting and getting stronger every day."
    };

    const goalSpecificNotes = {
      weight_loss: "Remember: consistency burns fat, intensity builds muscle. Stay hydrated!",
      muscle_building: "Focus on progressive overload. Each rep should be challenging but controlled.",
      strength_power: "Power comes from perfect technique. Master the movement, then add intensity.",
      military_tactical: "Train like your mission depends on it. Mental toughness builds physical strength.",
      glute_enhancement: "Mind-muscle connection is key. Feel every rep in your glutes.",
      next_level_performance: "Elite performance requires elite effort. Leave nothing in reserve."
    };

    return {
      weekly_message: weeklyMessages[day] || "Stay focused on your goals and trust the process.",
      goal_specific: goalSpecificNotes[fitnessProfile.primary_goal],
      daily_reminder: `Day ${day} - You're ${Math.round((day/14) * 100)}% complete with your transformation!`
    };
  }

  generateRestDayCoaching(day, fitnessProfile) {
    const messages = {
      4: "Recovery is where the magic happens. Your muscles are rebuilding stronger right now.",
      7: "Week 1 complete! You've shown up for yourself every day. That's what champions do.",
      11: "The final push is ahead. Use today to prepare mentally and physically for the home stretch.",
      14: "You did it! You committed to 14 days and followed through. This is just the beginning."
    };

    return messages[day] || "Rest is not a reward for work done, it's a requirement for work to come.";
  }

  generateRestDayNutrition(day) {
    const nutritionFocus = {
      4: "Focus on anti-inflammatory foods: berries, leafy greens, fatty fish, and plenty of water.",
      7: "Reflect on your nutrition wins this week. Plan healthy meals for the week ahead.",
      11: "Prioritize protein today to support muscle recovery. Aim for 20-30g at each meal.",
      14: "Celebrate with a nutritious meal that makes you feel energized and proud of your progress."
    };

    return nutritionFocus[day] || "Listen to your hunger cues and nourish your body with whole foods.";
  }

  generateProgressionNotes(day, progressionMultiplier) {
    return {
      intensity_increase: `${Math.round((progressionMultiplier - 1) * 100)}% intensity increase from baseline`,
      focus_areas: "Building upon previous sessions with increased challenge",
      adaptation_notes: "Your body is adapting - embrace the progressive challenge"
    };
  }

  generateNutritionGuidance(fitnessProfile) {
    const nutritionPlans = {
      weight_loss: {
        overview: "Caloric deficit with high protein, moderate carbs, and healthy fats",
        daily_structure: "3 meals + 1 snack, focus on whole foods and portion control",
        macro_targets: "Protein: 1g per lb bodyweight, Carbs: 0.8g per lb, Fat: 0.3g per lb",
        timing: "Eat protein within 30 minutes post-workout",
        hydration: "Half your bodyweight in ounces of water daily"
      },
      muscle_building: {
        overview: "Caloric surplus with emphasis on protein and nutrient timing",
        daily_structure: "3 main meals + 2-3 snacks, never skip post-workout nutrition",
        macro_targets: "Protein: 1.2g per lb bodyweight, Carbs: 1.5g per lb, Fat: 0.4g per lb", 
        timing: "Protein and carbs within 45 minutes post-workout",
        hydration: "Half your bodyweight in ounces + 16oz per hour of training"
      },
      strength_power: {
        overview: "Balanced nutrition supporting intense training and recovery",
        daily_structure: "Strategic carb timing around workouts, consistent protein",
        macro_targets: "Protein: 1g per lb bodyweight, Carbs: 1.2g per lb, Fat: 0.4g per lb",
        timing: "Carbs 1-2 hours pre-workout, protein immediately post-workout",
        hydration: "Consistent intake throughout day, extra during training sessions"
      },
      military_tactical: {
        overview: "Field-ready nutrition focusing on sustained energy and mental clarity",
        daily_structure: "Consistent meal timing, portable nutrition options",
        macro_targets: "Balanced macros with emphasis on sustained energy",
        timing: "Never train on empty stomach, refuel within 60 minutes post-training",
        hydration: "Aggressive hydration protocol - clear urine is the goal"
      },
      glute_enhancement: {
        overview: "Muscle-building nutrition with foods supporting lower body development",
        daily_structure: "Regular protein intake, complex carbs for energy",
        macro_targets: "Higher protein focus with adequate carbs for training fuel",
        timing: "Pre-workout carbs, post-workout protein for muscle synthesis",
        hydration: "Optimal hydration supports muscle fullness and definition"
      },
      next_level_performance: {
        overview: "Precision nutrition for elite performance and recovery optimization",
        daily_structure: "Periodized nutrition matching training phases",
        macro_targets: "Customized based on training blocks and performance goals",
        timing: "Strategic nutrient timing for performance and recovery",
        hydration: "Performance-based hydration with electrolyte consideration"
      }
    };

    return nutritionPlans[fitnessProfile.primary_goal] || nutritionPlans.muscle_building;
  }
}