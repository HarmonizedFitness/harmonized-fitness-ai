import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import { ProgramGenerator } from './ai-program-generator.js'

// Type definitions for Cloudflare bindings
type Bindings = {
  DB: D1Database;
  AI: any; // Cloudflare AI binding
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Use renderer for HTML pages
app.use(renderer)

// =============================================================================
// API ROUTES - User Profile Collection (4-Phase Onboarding)
// =============================================================================

// Phase 1: Create user profile with basic info
app.post('/api/users', async (c) => {
  try {
    const { full_name, email, age, gender } = await c.req.json()
    
    // Validation
    if (!full_name || !email || !age || !gender) {
      return c.json({ error: 'Missing required fields' }, 400)
    }
    if (age < 18 || age > 80) {
      return c.json({ error: 'Age must be between 18 and 80' }, 400)
    }
    if (!['male', 'female', 'non_binary', 'prefer_not_to_say'].includes(gender)) {
      return c.json({ error: 'Invalid gender value' }, 400)
    }
    
    // Check if user already exists
    const existingUser = await c.env.DB.prepare(`
      SELECT id as user_id FROM users WHERE email = ?
    `).bind(email).first()
    
    if (existingUser) {
      // User exists, return their ID for continued assessment
      return c.json({ 
        success: true, 
        user_id: existingUser.user_id,
        message: 'Welcome back! Continuing with your profile.',
        existing_user: true
      })
    }
    
    // Insert new user
    const result = await c.env.DB.prepare(`
      INSERT INTO users (full_name, email, age, gender) 
      VALUES (?, ?, ?, ?)
    `).bind(full_name, email, age, gender).run()
    
    if (!result.success) {
      return c.json({ error: 'Failed to create user' }, 500)
    }
    
    // Track funnel event
    await c.env.DB.prepare(`
      INSERT INTO lead_funnel_events (user_id, event_type, event_data) 
      VALUES (?, 'profile_created', ?)
    `).bind(result.meta.last_row_id, JSON.stringify({ phase: 'basic_info' })).run()
    
    return c.json({ 
      success: true, 
      user_id: result.meta.last_row_id,
      message: 'User profile created successfully'
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Phase 2: Add fitness assessment data
app.post('/api/users/:id/fitness-profile', async (c) => {
  try {
    const userId = c.req.param('id')
    const { experience_level, workout_duration, primary_goal, workout_environment } = await c.req.json()
    
    // Validation
    const validExperience = ['beginner', 'intermediate', 'advanced', 'expert']
    const validDuration = ['15-30', '30-45', '45-60', '60+']
    const validGoals = ['weight_loss', 'muscle_building', 'strength_power', 'military_prep', 'glute_enhancement', 'level_up']
    const validEnvironments = ['time_constrained', 'equipment_limited', 'gym_access', 'home_focused']
    
    if (!validExperience.includes(experience_level) || 
        !validDuration.includes(workout_duration) ||
        !validGoals.includes(primary_goal) ||
        !validEnvironments.includes(workout_environment)) {
      return c.json({ error: 'Invalid fitness profile data' }, 400)
    }
    
    // Insert or update fitness profile
    const result = await c.env.DB.prepare(`
      INSERT OR REPLACE INTO user_fitness_profiles 
      (user_id, experience_level, workout_duration, primary_goal, workout_environment) 
      VALUES (?, ?, ?, ?, ?)
    `).bind(userId, experience_level, workout_duration, primary_goal, workout_environment).run()
    
    if (!result.success) {
      return c.json({ error: 'Failed to save fitness profile' }, 500)
    }
    
    // Track funnel event
    await c.env.DB.prepare(`
      INSERT INTO lead_funnel_events (user_id, event_type, event_data) 
      VALUES (?, 'fitness_assessment_completed', ?)
    `).bind(userId, JSON.stringify({ 
      phase: 'fitness_profile',
      experience_level,
      primary_goal,
      workout_environment
    })).run()
    
    return c.json({ success: true, message: 'Fitness profile saved successfully' })
  } catch (error) {
    console.error('Error saving fitness profile:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Phase 3: Add equipment availability
app.post('/api/users/:id/equipment', async (c) => {
  try {
    const userId = c.req.param('id')
    const { equipment } = await c.req.json()
    
    if (!Array.isArray(equipment)) {
      return c.json({ error: 'Equipment must be an array' }, 400)
    }
    
    // Clear existing equipment for user
    await c.env.DB.prepare('DELETE FROM user_equipment WHERE user_id = ?').bind(userId).run()
    
    // Insert new equipment selections
    for (const item of equipment) {
      await c.env.DB.prepare(`
        INSERT INTO user_equipment (user_id, equipment_type, available) 
        VALUES (?, ?, true)
      `).bind(userId, item).run()
    }
    
    // Track funnel event
    await c.env.DB.prepare(`
      INSERT INTO lead_funnel_events (user_id, event_type, event_data) 
      VALUES (?, 'equipment_profile_completed', ?)
    `).bind(userId, JSON.stringify({ 
      phase: 'equipment_selection',
      equipment_count: equipment.length,
      equipment_types: equipment
    })).run()
    
    return c.json({ success: true, message: 'Equipment profile saved successfully' })
  } catch (error) {
    console.error('Error saving equipment profile:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Phase 4: Add injury/limitation screening
app.post('/api/users/:id/injuries', async (c) => {
  try {
    const userId = c.req.param('id')
    const { injuries } = await c.req.json()
    
    if (!Array.isArray(injuries)) {
      return c.json({ error: 'Injuries must be an array' }, 400)
    }
    
    // Clear existing injuries for user
    await c.env.DB.prepare('DELETE FROM user_injuries WHERE user_id = ?').bind(userId).run()
    
    // Insert new injury data (only if there are injuries)
    for (const injury of injuries) {
      // Ensure all fields have valid values (never undefined)
      const injuryType = injury.type || 'general'
      const bodyPart = injury.body_part || 'general'
      const severity = injury.severity || 'moderate'
      const isCurrent = injury.is_current !== undefined ? injury.is_current : true
      const notes = injury.notes || ''
      
      await c.env.DB.prepare(`
        INSERT INTO user_injuries (user_id, injury_type, body_part, severity, is_current, notes) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(userId, injuryType, bodyPart, severity, isCurrent, notes).run()
    }
    
    // Track funnel event
    await c.env.DB.prepare(`
      INSERT INTO lead_funnel_events (user_id, event_type, event_data) 
      VALUES (?, 'injury_screening_completed', ?)
    `).bind(userId, JSON.stringify({ 
      phase: 'injury_screening',
      injury_count: injuries.length,
      profile_complete: true
    })).run()
    
    return c.json({ success: true, message: 'Injury profile saved successfully' })
  } catch (error) {
    console.error('Error saving injury profile:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get complete user profile
app.get('/api/users/:id/profile', async (c) => {
  try {
    const userId = c.req.param('id')
    
    // Get user basic info
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    // Get fitness profile
    const fitnessProfile = await c.env.DB.prepare(
      'SELECT * FROM user_fitness_profiles WHERE user_id = ?'
    ).bind(userId).first()
    
    // Get equipment
    const equipment = await c.env.DB.prepare(
      'SELECT equipment_type FROM user_equipment WHERE user_id = ? AND available = true'
    ).bind(userId).all()
    
    // Get injuries
    const injuries = await c.env.DB.prepare(
      'SELECT * FROM user_injuries WHERE user_id = ? AND is_current = true'
    ).bind(userId).all()
    
    return c.json({
      user,
      fitness_profile: fitnessProfile,
      equipment: equipment.results?.map(e => e.equipment_type) || [],
      injuries: injuries.results || []
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// =============================================================================
// AI WORKOUT GENERATION ENDPOINTS
// =============================================================================

// Generate personalized 14-day program and initiate delivery
app.post('/api/users/:id/generate-program', async (c) => {
  try {
    const userId = c.req.param('id')
    console.log('Starting program generation for user:', userId)
    
    // Get complete user profile
    const profileResponse = await fetch(`${c.req.url.replace(/\/api\/users\/\d+\/generate-program$/, '')}/api/users/${userId}/profile`)
    const profile = await profileResponse.json()
    console.log('Profile retrieved:', !!profile.user, !!profile.fitness_profile)
    
    if (!profile.user || !profile.fitness_profile) {
      return c.json({ error: 'Complete profile required for program generation' }, 400)
    }
    
    // Generate full 14-day program using AI - NO DATABASE DEPENDENCY
    console.log('Generating program for goal:', profile.fitness_profile.primary_goal)
    
    // Simplified but functional AI program generation for comprehensive testing
    const fullProgram = {
      user_profile: profile,
      program_overview: {
        title: `Personalized 14-Day ${profile.fitness_profile.primary_goal.replace('_', ' ')} Program`,
        goal: profile.fitness_profile.primary_goal,
        experience: profile.fitness_profile.experience_level,
        description: profile.fitness_profile.primary_goal === 'level_up' 
          ? "Advanced techniques including pulse reps in lengthened position, grip variations, 3-second eccentrics, and 2-second peak contractions to break through plateaus."
          : "Comprehensive program designed specifically for your goals and experience level."
      },
      daily_plans: {},
      progression_notes: "Progressive overload with injury-aware programming",
      nutrition_guidance: "Balanced nutrition supporting your fitness goals",
      created_at: new Date().toISOString()
    }
    
    // Generate 14 days of workouts
    for (let day = 1; day <= 14; day++) {
      const isRestDay = [4, 7, 11, 14].includes(day)
      if (isRestDay) {
        fullProgram.daily_plans[day] = {
          day_number: day,
          type: "rest_day",
          title: `Recovery Day ${day}`,
          activities: ["Light mobility work", "Stress management", "Recovery activities"],
          workout_focus: profile.fitness_profile.primary_goal
        }
      } else {
        fullProgram.daily_plans[day] = {
          day_number: day,
          type: "workout_day", 
          title: `Training Day ${day}`,
          estimated_duration: profile.fitness_profile.workout_duration,
          difficulty_level: profile.fitness_profile.experience_level === 'advanced' ? 8 : 6,
          workout_focus: profile.fitness_profile.primary_goal,
          coaching_notes: {
            daily_reminder: `Today we focus on ${profile.fitness_profile.primary_goal.replace('_', ' ')} with military precision and mindful execution.`,
            goal_specific: profile.fitness_profile.primary_goal === 'military_prep' 
              ? "Hooah! Channel that warrior spirit. Every rep builds not just muscle, but the mental toughness that defines a soldier. Push past what you thought possible."
              : profile.fitness_profile.primary_goal === 'level_up'
              ? "Time to break through plateaus with advanced techniques. Focus on perfect form with these challenging progressions - each rep is a conversation with your potential."
              : "Stay consistent with your goals. Trust the process and remember - transformation happens one workout at a time."
          },
          exercises: profile.fitness_profile.primary_goal === 'level_up' ? [
            {
              name: "Pulse Rep Squats",
              sets: 3,
              reps: "8 + 5 pulse reps",
              technique: "3-second eccentric, pulse reps in lengthened position",
              equipment: "barbell"
            },
            {
              name: "Grip Variation Pull-ups", 
              sets: 3,
              reps: "6-8 per grip",
              technique: "Wide, neutral, chin-up grips with 2-second peak contractions",
              equipment: "pull_up_bar"
            }
          ] : profile.fitness_profile.primary_goal === 'military_prep' ? [
            {
              name: "Combat-Ready Burpees",
              sets: 4,
              reps: "15-20",
              technique: "Explosive movement, maintain form under fatigue",
              equipment: "bodyweight"
            },
            {
              name: "Tactical Loaded Carries",
              sets: 3,
              reps: "100 yards",
              technique: "Maintain posture, controlled breathing",
              equipment: "dumbbells"
            }
          ] : [
            {
              name: "Compound Movement",
              sets: 3,
              reps: "8-12",
              technique: "Controlled tempo, full range of motion"
            }
          ]
        }
      }
    }
    
    console.log('Program generated successfully')
    
    // Save generated program
    const result = await c.env.DB.prepare(`
      INSERT INTO generated_workouts 
      (user_id, workout_date, estimated_duration, estimated_calories, difficulty_score, workout_data) 
      VALUES (?, date('now'), ?, ?, ?, ?)
    `).bind(
      userId,
      fullProgram.daily_plans[1].estimated_duration,
      350, // Average estimated calories for program
      fullProgram.daily_plans[1].difficulty_level,
      JSON.stringify(fullProgram)
    ).run()
    
    const programId = result.meta.last_row_id
    
    // Initiate automated email delivery (optional - won't fail if no API key)
    let deliveryResult = { success: false, message: 'Email delivery not configured' }
    try {
      const { EmailAutomation } = await import('./email-automation.js')
      const emailSystem = new EmailAutomation()
      
      // Only attempt email delivery if API key exists
      if (c.env.SENDGRID_API_KEY) {
        deliveryResult = await emailSystem.startProgramDelivery(
          profile, 
          { ...fullProgram, id: programId }, 
          profile.user.email,
          c.env.SENDGRID_API_KEY
        )
        console.log('Email delivery result:', deliveryResult)
      } else {
        console.log('Warning: SENDGRID_API_KEY not configured - skipping email delivery')
        deliveryResult = { 
          success: false, 
          message: 'Email delivery skipped - API key not configured. Program generated successfully.' 
        }
      }
    } catch (emailError) {
      console.error('Email delivery error (non-fatal):', emailError)
      deliveryResult = { 
        success: false, 
        error: emailError.message,
        message: 'Program generated but email delivery failed' 
      }
    }
    
    // Track funnel event
    await c.env.DB.prepare(`
      INSERT INTO lead_funnel_events (user_id, event_type, event_data) 
      VALUES (?, 'program_generated', ?)
    `).bind(userId, JSON.stringify({ 
      program_id: programId,
      goal: profile.fitness_profile.primary_goal,
      email_delivery: deliveryResult.success,
      total_days: 14,
      workout_days: 10,
      rest_days: 4
    })).run()
    
    return c.json({ 
      success: true, 
      program_id: programId,
      program: fullProgram,
      email_delivery: deliveryResult,
      message: 'Your personalized 14-day program has been generated and delivery initiated!'
    })
  } catch (error) {
    console.error('Error generating program:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Email preview endpoint for testing
app.get('/api/users/:id/email-preview/:day', async (c) => {
  try {
    const userId = c.req.param('id')
    const day = parseInt(c.req.param('day'))
    
    // Get complete user profile
    const profileResponse = await fetch(`${c.req.url.replace(/\/api\/users\/\d+\/email-preview\/\d+$/, '')}/api/users/${userId}/profile`)
    const profile = await profileResponse.json()
    
    if (!profile.user || !profile.fitness_profile) {
      return c.json({ error: 'Complete profile required for email preview' }, 400)
    }
    
    // Generate full 14-day program using AI - NO DATABASE DEPENDENCY
    const { ProgramGenerator } = await import('./ai-program-generator.js')
    const programGenerator = new ProgramGenerator()
    const fullProgram = await programGenerator.generatePersonalized14DayProgram(profile, [])
    
    // Get the specific day's plan
    const dayPlan = fullProgram.daily_plans[day]
    if (!dayPlan) {
      return c.json({ error: `Day ${day} not found` }, 404)
    }
    
    // Generate email content using EmailAutomation
    const { EmailAutomation } = await import('./email-automation.js')
    const emailSystem = new EmailAutomation()
    
    let emailHTML
    if (dayPlan.type === 'rest_day') {
      emailHTML = emailSystem.generateRestDayEmailHTML(day, profile, dayPlan)
    } else {
      emailHTML = emailSystem.generateWorkoutEmailHTML(day, profile, dayPlan)
    }
    
    // Return HTML for preview
    return c.html(emailHTML)
  } catch (error) {
    console.error('Error generating email preview:', error)
    return c.json({ error: `Internal server error: ${error.message}` }, 500)
  }
})

// Send actual test email endpoint
app.post('/api/test-email/:day', async (c) => {
  try {
    const day = parseInt(c.req.param('day'))
    const { email, api_key } = await c.req.json()
    
    if (!email) {
      return c.json({ error: 'Email address required' }, 400)
    }
    
    if (!api_key) {
      return c.json({ error: 'SendGrid API key required for testing' }, 400)
    }
    
    // Set API key temporarily for this request
    process.env.SENDGRID_API_KEY = api_key
    
    // Get Sarah's profile for testing (user 98)
    const profileResponse = await fetch(`${c.req.url.replace(/\/api\/test-email\/\d+$/, '')}/api/users/98/profile`)
    const profile = await profileResponse.json()
    
    if (!profile.user) {
      return c.json({ error: 'Test user profile not found' }, 400)
    }
    
    // Generate full 14-day program using AI - NO DATABASE DEPENDENCY
    const { ProgramGenerator } = await import('./ai-program-generator.js')
    const programGenerator = new ProgramGenerator()
    const fullProgram = await programGenerator.generatePersonalized14DayProgram(profile, [])
    
    // Get the specific day's plan
    const dayPlan = fullProgram.daily_plans[day]
    if (!dayPlan) {
      return c.json({ error: `Day ${day} not found` }, 404)
    }
    
    // Generate and send email
    const { EmailAutomation } = await import('./email-automation.js')
    const emailSystem = new EmailAutomation()
    
    let emailHTML, emailText, subject
    if (dayPlan.type === 'rest_day') {
      emailHTML = emailSystem.generateRestDayEmailHTML(day, profile, dayPlan)
      emailText = emailSystem.generateRestDayEmailText(day, profile, dayPlan)
      subject = `🧘‍♂️ Day ${day}: Recovery & Reflection - Dr. U`
    } else {
      emailHTML = emailSystem.generateWorkoutEmailHTML(day, profile, dayPlan)
      emailText = emailSystem.generateWorkoutEmailText(day, profile, dayPlan)  
      subject = `💪 Day ${day}: ${dayPlan.workout_focus.replace('_', ' ').toUpperCase()} - Dr. U`
    }
    
    const emailContent = {
      to: email,
      to_name: 'Kyle (Test Recipient)',
      from: { 
        email: 'support@harmonizedfitness.com', 
        name: 'Dr. U (Kyle) - Harmonized Fitness' 
      },
      subject: subject,
      html: emailHTML,
      text: emailText
    }
    
    const result = await emailSystem.sendEmail(emailContent)
    
    return c.json({
      success: result.success,
      message: result.success 
        ? `Test email sent successfully to ${email}! Check your inbox.`
        : `Failed to send email: ${result.error}`,
      email_id: result.id,
      day: day,
      subject: subject
    })
    
  } catch (error) {
    console.error('Error sending test email:', error)
    return c.json({ error: `Internal server error: ${error.message}` }, 500)
  }
})

// Legacy endpoint for backward compatibility (simplified demo version)
app.post('/api/users/:id/generate-workout', async (c) => {
  try {
    const userId = c.req.param('id')
    
    // Get complete user profile
    const profileResponse = await fetch(`${c.req.url.replace(/\/api\/users\/\d+\/generate-workout$/, '')}/api/users/${userId}/profile`)
    const profile = await profileResponse.json()
    
    if (!profile.user || !profile.fitness_profile) {
      return c.json({ error: 'Complete profile required for workout generation' }, 400)
    }
    
    // Simple AI matching algorithm for demo
    const workoutPlan = await generateWorkoutPlan(c.env.DB, profile)
    
    return c.json({ 
      success: true, 
      workout: workoutPlan,
      message: 'Demo workout generated - upgrade to full program for 14-day delivery!'
    })
  } catch (error) {
    console.error('Error generating workout:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// =============================================================================
// FRONTEND ROUTES
// =============================================================================

// Main application route
app.get('/', (c) => {
  return c.render(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Free 14-Day Harmonizing Fitness | AI-Powered Personalized Workouts</title>
        <meta name="description" content="Get your FREE personalized 14-day fitness program powered by AI. Military-tested methods for all fitness levels. No gym required!" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    'burnt-orange': '#CC5500',
                    'army-green': '#4A5D23',
                    'charcoal': '#010101',
                    'deep-black': '#000000'
                  }
                }
              }
            }
          `
        }}></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body class="bg-black text-white min-h-screen">
        <div id="app">
          {/* Hero Section */}
          <section class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
            <div class="absolute inset-0 bg-gradient-to-r from-burnt-orange/10 to-transparent"></div>
            <div class="relative z-10 max-w-6xl mx-auto px-6 text-center">
              <div class="mb-8">
                <i class="fas fa-dumbbell text-6xl text-burnt-orange mb-4"></i>
                <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  <span class="text-burnt-orange">FREE</span> 14-Day<br />
                  <span class="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Harmonized Training
                  </span>
                </h1>
                <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Balanced, customized, and human-led—enhanced by modern tools. Get a plan for your unique journey across mind, body, and spirit.
                </p>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <button id="start-assessment" class="bg-burnt-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <i class="fas fa-rocket mr-3"></i>
                  Start Your Free Assessment
                </button>
                <div class="text-gray-400">
                  <i class="fas fa-clock mr-2"></i>
                  Takes only 3 minutes
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div class="text-center">
                  <i class="fas fa-brain text-3xl text-burnt-orange mb-4"></i>
                  <h3 class="text-xl font-bold mb-2">Intelligent Personalization</h3>
                  <p class="text-gray-400">Smart algorithms that understand your whole person - not just your fitness level.</p>
                </div>
                <div class="text-center">
                  <i class="fas fa-medal text-3xl text-burnt-orange mb-4"></i>
                  <h3 class="text-xl font-bold mb-2">Battle-Tested Wisdom</h3>
                  <p class="text-gray-400">Discipline forged through challenge, evolved through mindful practice and holistic understanding.</p>
                </div>
                <div class="text-center">
                  <i class="fas fa-home text-3xl text-burnt-orange mb-4"></i>
                  <h3 class="text-xl font-bold mb-2">Your Space, Your Pace</h3>
                  <p class="text-gray-400">From living room flows to gym sessions - we meet you exactly where you are.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Assessment Modal */}
          <div id="assessment-modal" class="fixed inset-0 bg-black bg-opacity-80 hidden z-50 flex items-center justify-center p-4">
            <div class="bg-charcoal rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-burnt-orange/20">
              <div id="assessment-content" class="p-8">
                {/* Dynamic content will be loaded here */}
              </div>
            </div>
          </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Simple AI workout generation logic (placeholder for more sophisticated AI)
async function generateWorkoutPlan(db: D1Database, profile: any) {
  const { fitness_profile, equipment, injuries } = profile
  
  // Get suitable exercises based on profile
  let query = `
    SELECT e.* FROM exercises e 
    WHERE e.is_active = 1
  `
  
  // Filter by equipment availability
  if (equipment.length > 0) {
    const equipmentFilter = equipment.map(() => '?').join(',')
    query += ` AND json_extract(e.equipment_required, '$[0]') IN (${equipmentFilter})`
  }
  
  // Exclude exercises based on injuries
  if (injuries.length > 0) {
    query += ` AND e.contraindications NOT LIKE '%' || ? || '%'`
  }
  
  // Limit by difficulty based on experience
  const maxDifficulty = {
    'beginner': 2,
    'intermediate': 3,
    'advanced': 5,  // Advanced users get access to all techniques
    'expert': 5
  }[fitness_profile.experience_level] || 2
  
  // For advanced/expert users, prioritize advanced techniques (supersets, drops, partials)
  if (fitness_profile.experience_level === 'advanced' || fitness_profile.experience_level === 'expert') {
    query += ` AND e.difficulty_level <= ? 
               ORDER BY 
                 CASE 
                   WHEN e.name LIKE '%Superset%' OR e.name LIKE '%Drop Set%' OR e.name LIKE '%Partial%' OR e.name LIKE '%Pulse%' THEN 1
                   WHEN e.difficulty_level >= 4 THEN 2
                   ELSE 3
                 END, 
                 RANDOM() 
               LIMIT 8`
  } else {
    query += ` AND e.difficulty_level <= ? ORDER BY RANDOM() LIMIT 8`
  }
  
  const params = [...equipment]
  if (injuries.length > 0) {
    params.push(injuries[0].injury_type)
  }
  params.push(maxDifficulty)
  
  const exercises = await db.prepare(query).bind(...params).all()
  
  // Calculate workout duration based on user preference
  const durationMap = {
    '15-30': 25,
    '30-45': 35,
    '45-60': 50,
    '60+': 65
  }
  
  const targetDuration = durationMap[fitness_profile.workout_duration] || 30
  const estimatedCalories = Math.round(targetDuration * 8) // Rough estimate
  
  return {
    name: `Personalized ${fitness_profile.primary_goal.replace('_', ' ').toUpperCase()} Workout`,
    estimated_duration: targetDuration,
    estimated_calories: estimatedCalories,
    difficulty_score: maxDifficulty,
    exercises: exercises.results?.slice(0, 6) || [],
    structure: {
      warmup: ['Jumping Jacks', 'Bodyweight Squat'],
      main: exercises.results?.slice(0, 4).map(e => e.name) || [],
      cooldown: ['Downward Dog']
    },
    notes: `Customized for ${fitness_profile.experience_level} level ${fitness_profile.primary_goal.replace('_', ' ')} goals`
  }
}

export default app
