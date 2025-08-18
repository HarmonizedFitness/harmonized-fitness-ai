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

  // Generate program overview based on user goals - Dr. U's authentic voice
  generateProgramOverview(fitnessProfile) {
    const goalDescriptions = {
      weight_loss: "Let's strip away what's not serving you and reveal the strength that's been there all along. This isn't about punishment - it's about finding harmony between effort and recovery while your body transforms from the inside out.",
      muscle_building: "Time to build more than muscle - we're building confidence, resilience, and that unshakeable strength that comes from mastering the little things. Every rep is a conversation with your potential.",
      strength_power: "Drawing from my military background, we'll develop functional power that translates to real life. This isn't gym strength - this is the kind of strength that serves you when it matters most.",
      military_prep: "Hooah! Let's tap into that warrior spirit and build combat-ready fitness. Mental toughness isn't just trained - it's forged through consistent action and pushing past what you thought possible.",
      glute_enhancement: "Strong glutes are the foundation of everything - power, stability, confidence. We're not just building a better backside; we're creating a stronger, more balanced you from the ground up.",
      level_up: "You feel stuck, but you're not. You're ready for the details that separate good from extraordinary. We're diving deep into pulse reps, grip variations, lengthened positions, and those 'little things' that unlock breakthrough performance."
    };

    const durationDescriptions = {
      "15-30": "Short and sweet doesn't mean easy. We're maximizing every minute because I know your time is precious. Quality over quantity, always.",
      "30-45": "The sweet spot for most of us. Enough time to warm up properly, work hard, and cool down mindfully. This is where consistency meets results.",
      "45-60": "Now we're cooking! Extended sessions allow us to really dial in technique, explore different movement patterns, and build that deep, lasting strength.",
      "60+": "You're all in, and I respect that. These longer sessions are where we separate the committed from the curious. Expect breakthroughs."
    };

    return {
      primary_goal: goalDescriptions[fitnessProfile.primary_goal],
      duration_focus: durationDescriptions[fitnessProfile.workout_duration],
      experience_level: `Designed specifically for where you are right now - ${fitnessProfile.experience_level} level. We meet you where you are, then take you where you want to go.`,
      workout_environment: fitnessProfile.workout_environment,
      total_workouts: 10,
      rest_days: 4,
      progressive_overload: "Growth happens in the space between comfort and chaos. Each week, we're gently pushing that boundary while listening to what your body is telling us."
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
      military_prep: ['combat_conditioning', 'functional_fitness', 'endurance_strength', 'agility_power'],
      glute_enhancement: ['lower_body_focus', 'glute_activation', 'posterior_chain', 'functional_lower'],
      level_up: ['advanced_techniques', 'plateau_breaker', 'detail_mastery', 'performance_refinement']
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
        dr_u_instructions: this.generateDrUInstructions(exercise, fitnessProfile),
        form_focus: this.generateFormFocus(exercise.name, fitnessProfile.experience_level),
        estimated_calories: Math.round(exercise.estimated_calories_per_minute * 3), // Assume 3 min per exercise
        difficulty_rating: exercise.difficulty_level,
        equipment_needed: exercise.equipment_required,
        modifications: this.generateModifications(exercise, fitnessProfile)
      }));

    return selectedExercises;
  }

  // Calculate sets and reps with Dr. U's philosophy - Listen to your body
  calculateSetsReps(exercise, fitnessProfile, progressionMultiplier) {
    // Dr. U's sweet spot rep ranges - where the magic happens
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
      military_prep: { reps: 1.1, sets: 1.1, rest: 45 },
      glute_enhancement: { reps: 1.1, sets: 1.0, rest: 45 },
      level_up: { reps: 0.9, sets: 1.4, rest: 90 } // Lower reps, more sets for advanced techniques
    };

    const adjustment = goalAdjustments[fitnessProfile.primary_goal] || goalAdjustments.muscle_building;

    const finalSets = Math.round(adjustedSets * adjustment.sets);
    const finalReps = category === 'flexibility' ? `${adjustedReps} seconds` : Math.round(adjustedReps * adjustment.reps);
    
    return {
      sets: finalSets,
      reps: finalReps,
      rest_seconds: adjustment.rest,
      tempo_notes: this.generateDrUTempoNotes(fitnessProfile.primary_goal, category, finalReps),
      intensity_level: Math.ceil(progressionMultiplier * 5), // 1-5 scale
      coaching_cue: this.generateRepSpecificCue(finalSets, finalReps, exercise.name)
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
      notes: "This isn't just preparation - it's meditation in motion. Feel each movement, notice what your body is telling you today. A proper warmup prevents injury and optimizes performance. Start slow, finish strong.",
      dr_u_mindset: "Use these first few minutes to connect with your body and set your intention for today's training. What are you training FOR, not just WHAT are you training?"
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
      notes: "This is sacred time. You just asked your body to do hard things, and it delivered. Honor that with intentional recovery. Breathe deeply, stretch mindfully, and acknowledge what you just accomplished.",
      dr_u_reflection: "Take a moment to recognize that you showed up today. In a world that makes a thousand excuses, you chose action. That's not small - that's everything."
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

  generateDrUTempoNotes(primaryGoal, category, reps) {
    const tempos = {
      weight_loss: "Move with purpose - controlled descent, explosive up. That eccentric phase is where the magic happens for fat burning.",
      muscle_building: "This is where we build strength from the inside out. 2 seconds down (feel that stretch), pause briefly, then power up. Your muscles are strongest when lengthening - use it!",
      strength_power: "Explosive concentric, but CONTROL that eccentric. Power without control is just chaos. Master the descent, dominate the ascent.", 
      military_prep: "Adapt your tempo to the mission. Sometimes slow and controlled, sometimes explosive. Train like your life depends on it.",
      glute_enhancement: "Slow and deliberate - we're waking up those glutes! Feel every inch of the movement. Mind-muscle connection isn't just a phrase, it's your secret weapon.",
      level_up: "Here's where we separate amateur from elite: 3-second eccentrics in lengthened position, 1-second pause, then explosive up. Try pulse reps at the bottom range - 5 pulses, then full rep. Switch your grip every set to hit different angles. That extra squeeze at the top? Hold it for 2 seconds. These details unlock breakthrough performance."
    };

    const baseNote = tempos[primaryGoal] || "Listen to your body and move with intention. Form first, intensity second.";
    const repAdvice = reps >= 12 ? " Remember: those last 2-3 reps are where transformation lives." : " Quality over quantity - make every rep count.";
    
    return baseNote + repAdvice;
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
      1: "Here we go! Today is about showing up authentically and honoring where you are right now. Perfect form beats perfect reps every single time.",
      2: "Yesterday you showed up. Today you show up again. This is how transformation actually happens - one choice at a time.",
      3: "Your body is already adapting. Those little aches? That's growth knocking. Listen to what it's telling you.",
      5: "We're building something bigger than just physical strength here. We're building the habit of keeping promises to yourself.",
      6: "Almost at your first rest day! You've earned it through consistent action. Recovery is where the magic actually happens.",
      8: "Week 2, here we go! Your body knows what's coming now. Time to play in that space between comfort and chaos.",
      9: "The honeymoon phase is over. This is where we separate the committed from the curious. Which one are you?",
      10: "Halfway point! Your future self is already thanking you for not giving up when it got uncomfortable.",
      12: "The final push begins. Your body is capable of so much more than your mind believes. Prove it to yourself.",
      13: "One more workout day. You've already proven you can do hard things. Now finish what you started."
    };

    const goalSpecificNotes = {
      weight_loss: "Fat loss happens in the kitchen, strength happens in the gym, but transformation happens in your mind. Stay the course.",
      muscle_building: "Every time you challenge a muscle, you're having a conversation with your potential. Make it a good conversation.",
      strength_power: "True power isn't just about moving weight - it's about moving through life with confidence and capability.",
      military_prep: "Embrace the suck. Channel that military discipline - you've been through harder than this. This is maintenance, not survival.",
      glute_enhancement: "Strong glutes equal strong everything. We're building your foundation from the ground up. Feel that power.",
      level_up: "Today we dive into the details that separate good from extraordinary. Focus on: 3-second eccentrics, 5 pulse reps in lengthened position, grip variations each set, 2-second pauses at peak contraction. These aren't just techniques - they're breakthrough protocols."
    };

    const dailyWisdom = [
      "Harmony comes from the inside out. Trust the process.",
      "Small hinges swing big doors. Master the little things.",
      "Your body is keeping score. Make sure it's a winning score.",
      "Discomfort is temporary. Regret is forever. Choose wisely.",
      "You're not just training muscles, you're training resilience.",
      "Progress isn't linear. Show up anyway.",
      "Your biggest competition is who you were yesterday.",
      "Strength isn't just physical - it's mental, emotional, spiritual.",
      "The magic happens when you keep going after you want to quit.",
      "You're already stronger than you think. Now prove it.",
      "Consistency beats perfection every single time.",
      "Listen to your body - it's smarter than you think.",
      "Every rep is a vote for the person you're becoming.",
      "Champions are made in the moments no one is watching."
    ];

    return {
      weekly_message: weeklyMessages[day] || "Trust your journey. Every step forward matters.",
      goal_specific: goalSpecificNotes[fitnessProfile.primary_goal],
      daily_reminder: `Day ${day} - You're ${Math.round((day/14) * 100)}% complete with this program, but 100% committed to your transformation!`,
      dr_u_wisdom: dailyWisdom[(day - 1) % dailyWisdom.length]
    };
  }

  generateRestDayCoaching(day, fitnessProfile) {
    const messages = {
      4: "This is where the real work happens - not in the gym, but in the recovery. Your muscles are literally rebuilding themselves stronger right now. Honor this process.",
      7: "Week 1 in the books! You showed up when you didn't feel like it, you pushed when it got uncomfortable, and you trusted the process. That's not just fitness - that's character.",
      11: "Deep breath. The final push is coming, but today we prepare. Mental, physical, emotional preparation. Use this rest day to visualize finishing strong.",
      14: "You did it! But more importantly, you proved to yourself that you can commit to something and follow through. This isn't the end - this is your new beginning. What's next?"
    };

    const baseMessage = messages[day] || "Rest isn't earned - it's required. Your body grows during recovery, not during training.";
    const universalWisdom = " Remember: harmony comes from balancing effort with recovery. Today, choose recovery with the same intention you choose effort.";
    
    return baseMessage + universalWisdom;
  }

  generateRestDayNutrition(day) {
    const nutritionFocus = {
      4: "Today, think anti-inflammatory: berries, leafy greens, fatty fish, and lots of water. Your body is rebuilding - give it premium fuel, not regular.",
      7: "Pause and reflect on your nutrition wins this week. What worked? What didn't? Plan your meals for week 2 like you're planning for success, because you are.",
      11: "Protein is your recovery ally today. Aim for 20-30g at each meal. Your muscles are hungry for the building blocks they need to come back stronger.",
      14: "Celebrate with intention! Choose a meal that makes you feel energized and proud. You've earned this moment - make it count."
    };

    const baseGuidance = nutritionFocus[day] || "Listen to your hunger cues and nourish your body with whole foods.";
    const drUWisdom = " Food is information for your body. What message are you sending today?";
    
    return baseGuidance + drUWisdom;
  }

  generateProgressionNotes(day, progressionMultiplier) {
    return {
      intensity_increase: `${Math.round((progressionMultiplier - 1) * 100)}% intensity increase from baseline`,
      focus_areas: "Building upon previous sessions with increased challenge",
      adaptation_notes: "Your body is adapting - embrace the progressive challenge"
    };
  }

  generateDrUInstructions(exercise, fitnessProfile) {
    const baseInstruction = exercise.instructions || "Perform this exercise with focus and control.";
    const experienceModifier = {
      beginner: "Take your time learning this movement. Perfect practice makes perfect - sloppy practice makes sloppy.",
      intermediate: "You've got the basics down. Now let's refine the details that separate good from great.",
      advanced: "Time to master the nuances. Feel for those subtle adjustments that maximize effectiveness.",
      expert: "You know what you're doing. Trust your body, challenge your limits, and lead by example."
    };
    
    return `${baseInstruction} ${experienceModifier[fitnessProfile.experience_level]} Remember: we're not just moving weight, we're building resilience.`;
  }

  generateFormFocus(exerciseName, experienceLevel) {
    const formCues = {
      beginner: "Foundation first - nail the basics before adding intensity. Your future self will thank you.",
      intermediate: "Dial in those details. Small adjustments yield big results.",
      advanced: "Feel the movement from the inside out. Your body knows more than you think.",
      expert: "Make it look effortless while making it devastatingly effective."
    };
    
    return `${formCues[experienceLevel]} Focus on playing in that tension zone where challenge meets control.`;
  }

  generateRepSpecificCue(sets, reps, exerciseName) {
    const repCount = typeof reps === 'string' ? parseInt(reps) : reps;
    
    if (repCount <= 6) {
      return "Low reps, high focus. Every single rep should look identical. This is where strength is forged.";
    } else if (repCount <= 12) {
      return "The sweet spot for most of us. Aim for 10-12 quality reps, but listen to your body - it knows when to push and when to pause.";
    } else {
      return "Higher reps mean playing in the tension zone longer. Embrace the discomfort - that's where transformation lives.";
    }
  }

  generateNutritionGuidance(fitnessProfile) {
    const nutritionPlans = {
      weight_loss: {
        overview: "Food is fuel, not the enemy. We're creating a sustainable approach that honors your body's needs while achieving your goals.",
        daily_structure: "3 solid meals + 1 smart snack. Quality over quantity, always. Eat like you give a damn about your future self.",
        macro_targets: "Protein: 1g per lb (your muscle's best friend), Carbs: 0.8g per lb (strategic fuel), Fat: 0.3g per lb (hormonal harmony)",
        timing: "Feed those muscles within 30 minutes post-workout. They're hungry for growth.",
        hydration: "Half your bodyweight in ounces daily. Hydration is the foundation of everything else working properly."
      },
      muscle_building: {
        overview: "Building muscle isn't just about lifting heavy - it's about feeding your potential. Every meal is an opportunity to support your goals.",
        daily_structure: "3 main meals + 2-3 strategic snacks. Never leave your muscles guessing when the next fuel delivery is coming.",
        macro_targets: "Protein: 1.2g per lb (non-negotiable), Carbs: 1.5g per lb (your energy foundation), Fat: 0.4g per lb (hormonal optimization)",
        timing: "Protein and carbs within 45 minutes post-workout. This is when the magic happens.",
        hydration: "Half your bodyweight in ounces + 16oz per hour of training. Your muscles are 70% water - honor that."
      },
      strength_power: {
        overview: "Power demands precision nutrition. Every meal should serve your strength goals with military efficiency.",
        daily_structure: "Strategic carb timing around workouts, consistent protein delivery. Fuel like a tactician.",
        macro_targets: "Protein: 1g per lb (strength foundation), Carbs: 1.2g per lb (power fuel), Fat: 0.4g per lb (recovery support)",
        timing: "Carbs 1-2 hours pre-workout for sustained energy, protein immediately post for adaptation.",
        hydration: "Consistent intake throughout the day. Dehydration kills performance before you even realize it."
      },
      military_tactical: {
        overview: "Field-ready nutrition that can adapt to any situation. Mental clarity and sustained energy are mission-critical.",
        daily_structure: "Consistent meal timing when possible, portable options when necessary. Always be prepared.",
        macro_targets: "Balanced macros with emphasis on sustained energy and mental clarity. Mission first.",
        timing: "Never train on an empty stomach, refuel within 60 minutes post-training. Your body is your primary weapon.",
        hydration: "Aggressive hydration protocol - clear urine is the goal. Dehydration compromises everything."
      },
      glute_enhancement: {
        overview: "Strong glutes require strategic nutrition. We're building power from the ground up.",
        daily_structure: "Regular protein intake with complex carbs for training fuel. Feed the foundation.",
        macro_targets: "Higher protein focus with adequate carbs for intense lower body training.",
        timing: "Pre-workout carbs for energy, post-workout protein for growth. Simple but effective.",
        hydration: "Optimal hydration supports muscle fullness and definition. Water is your secret weapon."
      },
      next_level_performance: {
        overview: "Elite performance demands elite nutrition precision. Every choice either serves your goals or sabotages them.",
        daily_structure: "Periodized nutrition that adapts to your training phases. Precision meets performance.",
        macro_targets: "Customized based on your specific training blocks and performance demands.",
        timing: "Strategic nutrient timing optimized for performance and recovery. Every detail matters.",
        hydration: "Performance-based hydration with electrolyte optimization. Your edge might be in the details."
      }
    };

    return nutritionPlans[fitnessProfile.primary_goal] || nutritionPlans.muscle_building;
  }
}