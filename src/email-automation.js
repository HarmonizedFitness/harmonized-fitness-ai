// Email Automation System for 14-Day Program Delivery
// Handles automated email sequences and program delivery

export class EmailAutomation {
  constructor(emailService = 'sendgrid') { // Using SendGrid for email delivery
    this.emailService = emailService;
    this.fromEmail = 'support@harmonizedfitness.com';
    this.fromName = 'Dr. U (Kyle) - Harmonized Fitness';
  }

  // Main function to start the 14-day email sequence
  async startProgramDelivery(userProfile, program, emailAddress, apiKey = null) {
    this.apiKey = apiKey; // Store API key for use in email sending
    try {
      // Send immediate welcome email with Day 1
      await this.sendWelcomeEmail(userProfile, program, emailAddress);
      
      // Schedule all remaining emails
      await this.scheduleAllProgramEmails(userProfile, program, emailAddress);
      
      // Track program start in database
      await this.trackProgramStart(userProfile.user?.id || userProfile.user_id, program.id);
      
      return { success: true, message: 'Program delivery initiated successfully' };
    } catch (error) {
      console.error('Email automation error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send immediate welcome email with Day 1 workout
  async sendWelcomeEmail(userProfile, program, emailAddress) {
    try {
      const day1Workout = program.daily_plans[1];
      
      if (!day1Workout) {
        console.error('❌ Welcome email failed: Missing day1Workout in program.daily_plans');
        return { success: false, error: 'Missing day 1 workout data' };
      }
      
      console.log('📧 Generating welcome email for:', emailAddress);
      console.log('📧 User:', userProfile.user?.full_name || 'Unknown');
      console.log('📧 Goal:', userProfile.fitness_profile?.primary_goal || 'Unknown');
      
      const emailContent = {
        to: emailAddress,
        from: { email: this.fromEmail, name: this.fromName },
        subject: "🚀 Your Personalized 14-Day Harmonized Fitness Program is Here!",
        html: this.generateWelcomeEmailHTML(userProfile, program, day1Workout),
        text: this.generateWelcomeEmailText(userProfile, program, day1Workout)
      };

      const result = await this.sendEmail(emailContent);
      
      if (result.success) {
        console.log('✅ Welcome email sent successfully:', result.id);
      } else {
        console.error('❌ Welcome email failed:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Welcome email exception:', error);
      return { success: false, error: error.message };
    }
  }

  // Schedule all program emails (Days 2-14)
  async scheduleAllProgramEmails(userProfile, program, emailAddress) {
    const schedulePromises = [];

    for (let day = 2; day <= 14; day++) {
      // Compute 1:00 AM America/New_York in UTC seconds (~05:00 UTC during EDT)
      const sendAt = this.computeOneAmEasternUnix(day);

      const emailContent = this.generateDailyEmail(day, userProfile, program, emailAddress);
      
      // Use SendGrid native scheduling so emails actually queue now
      schedulePromises.push(
        this.sendEmail(emailContent, null, sendAt)
      );
    }

    return await Promise.all(schedulePromises);
  }

  // Generate daily email content
  generateDailyEmail(day, userProfile, program, emailAddress) {
    const dayPlan = program.daily_plans[day];
    const isRestDay = [4, 7, 11, 14].includes(day);
    
    const subject = isRestDay 
      ? `Day ${day}: Recovery & Reflection 🧘‍♂️`
      : `Day ${day}: ${dayPlan.workout_focus.replace('_', ' ').toUpperCase()} 💪`;

    return {
      to: emailAddress,
      from: { email: this.fromEmail, name: this.fromName },
      subject,
      html: isRestDay 
        ? this.generateRestDayEmailHTML(day, userProfile, dayPlan)
        : this.generateWorkoutEmailHTML(day, userProfile, dayPlan),
      text: isRestDay
        ? this.generateRestDayEmailText(day, userProfile, dayPlan)
        : this.generateWorkoutEmailText(day, userProfile, dayPlan)
    };
  }

  // Generate welcome email HTML
  generateWelcomeEmailHTML(userProfile, program, day1Workout) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Your Harmonized Fitness Journey</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #000; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #CC5500 0%, #A04400 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .workout-card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #CC5500; }
        .exercise { background: white; border-radius: 6px; padding: 15px; margin: 10px 0; border: 1px solid #e9ecef; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
        .button { background: #CC5500; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; }
        .progress-bar { background: #e9ecef; height: 8px; border-radius: 4px; margin: 15px 0; }
        .progress-fill { background: #CC5500; height: 100%; border-radius: 4px; width: 7%; }
        .coaching-note { background: #e8f4f8; border-left: 4px solid #17a2b8; padding: 15px; margin: 15px 0; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Welcome to Harmonized Fitness!</h1>
          <p>Your Personalized 14-Day Military-Inspired Transformation</p>
        </div>
        
        <div class="content">
          <h2>Mission Briefing, ${userProfile.user.full_name}!</h2>
          
          <p>Outstanding! You've taken the first step toward your fitness transformation. As a former Army Ranger, I know what it takes to build both physical and mental strength, and I'm here to guide you every step of the way.</p>
          
          <div class="coaching-note">
            <strong>Your Personal Mission:</strong> ${program.program_overview.primary_goal}
          </div>
          
          <h3>📊 Your Program Overview</h3>
          <ul>
            <li><strong>Duration:</strong> 14 days (10 workouts + 4 strategic rest days)</li>
            <li><strong>Experience Level:</strong> ${userProfile.fitness_profile.experience_level}</li>
            <li><strong>Workout Duration:</strong> ${userProfile.fitness_profile.workout_duration} minutes</li>
            <li><strong>Primary Goal:</strong> ${userProfile.fitness_profile.primary_goal.replace('_', ' ')}</li>
          </ul>
          
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <p style="text-align: center; font-size: 14px; color: #666;">Day 1 of 14 - Let's Begin! 🎯</p>
          
          <div class="workout-card">
            <h3>🔥 Day 1: ${day1Workout.workout_focus.replace('_', ' ').toUpperCase()}</h3>
            <p><strong>Estimated Duration:</strong> ${day1Workout.estimated_duration} minutes</p>
            <p><strong>Difficulty Level:</strong> ${'★'.repeat(day1Workout.difficulty_level)}${'☆'.repeat(5-day1Workout.difficulty_level)}</p>
            
            <h4>🏃 Warmup (${day1Workout.warmup.duration_minutes} minutes)</h4>
            <ul>
              ${day1Workout.warmup.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
            </ul>
            
            <h4>💪 Main Exercises</h4>
            ${day1Workout.main_exercises.map((exercise, index) => `
              <div class="exercise">
                <h5>${index + 1}. ${exercise.exercise_name}</h5>
                <p><strong>Sets:</strong> ${exercise.sets} | <strong>Reps:</strong> ${exercise.reps} | <strong>Rest:</strong> ${exercise.rest_seconds}s</p>
                <p><strong>Focus:</strong> ${exercise.primary_muscle_group}</p>
                <p><strong>Instructions:</strong> ${exercise.instructions || `Train ${exercise.reps} reps for ${exercise.sets} sets. Last set to near-failure (RIR 1–2). ${exercise.tempo_notes} Rest ${exercise.rest_seconds}s.`}</p>
                <p><strong>Form Cues:</strong> ${exercise.form_cues || 'Move like a pro: identical reps first to last. Own the last 2 inches each direction.'}</p>
              </div>
            `).join('')}
            
            <h4>🧘 Cooldown (${day1Workout.cooldown.duration_minutes} minutes)</h4>
            <ul>
              ${day1Workout.cooldown.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
            </ul>
          </div>
          
          <div class="coaching-note">
            <strong>Kai's Coaching Note:</strong> ${day1Workout.coaching_notes.weekly_message}
          </div>
          
          <h3>🍎 Nutrition Guidance</h3>
          <p><strong>Overview:</strong> ${program.nutrition_guidance.overview}</p>
          <p><strong>Daily Structure:</strong> ${program.nutrition_guidance.daily_structure}</p>
          <p><strong>Hydration Goal:</strong> ${program.nutrition_guidance.hydration}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://harmonizedfitness.com/community" class="button">Join Our Private Community 🤝</a>
          </div>
          
          <h3>📱 Quick Links</h3>
          <ul>
            <li><a href="mailto:kyle@harmonizedfitness.com">Email Kyle Directly</a></li>
            <li><a href="https://harmonizedfitness.com/progress">Track Your Progress</a></li>
            <li><a href="https://harmonizedfitness.com/modifications">Exercise Modifications</a></li>
          </ul>
        </div>
        
        <div class="footer">
          <p><strong>Remember:</strong> I'll be checking in with you personally after Day 3. You've got this!</p>
          <p>Semper Fi,<br><strong>Kyle "Kai" - Former Army Ranger</strong><br>Harmonized Fitness</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Generate workout day email HTML
  generateWorkoutEmailHTML(day, userProfile, dayPlan) {
    const progressPercent = Math.round((day / 14) * 100);
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Day ${day} - ${dayPlan.workout_focus.replace('_', ' ').toUpperCase()}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #000; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #CC5500 0%, #A04400 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .workout-card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #CC5500; }
        .exercise { background: white; border-radius: 6px; padding: 15px; margin: 10px 0; border: 1px solid #e9ecef; }
        .progress-bar { background: #e9ecef; height: 8px; border-radius: 4px; margin: 15px 0; }
        .progress-fill { background: #CC5500; height: 100%; border-radius: 4px; width: ${progressPercent}%; }
        .coaching-note { background: #e8f4f8; border-left: 4px solid #17a2b8; padding: 15px; margin: 15px 0; font-style: italic; }
        .button { background: #CC5500; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Day ${day} - Ready to Dominate! 💪</h1>
          <p>${dayPlan.workout_focus.replace('_', ' ').toUpperCase()} Focus</p>
        </div>
        
        <div class="content">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <p style="text-align: center; font-size: 14px; color: #666;">Day ${day} of 14 - ${progressPercent}% Complete! 🎯</p>
          
          <div class="coaching-note">
            <strong>Today's Mission:</strong> ${dayPlan.coaching_notes.daily_reminder}
          </div>
          
          <div class="workout-card">
            <h3>🔥 Today's Workout</h3>
            <p><strong>Duration:</strong> ${dayPlan.estimated_duration} minutes</p>
            <p><strong>Difficulty:</strong> ${'★'.repeat(dayPlan.difficulty_level)}${'☆'.repeat(5-dayPlan.difficulty_level)}</p>
            ${dayPlan.progression_from_previous ? `<p><strong>Progression:</strong> ${dayPlan.progression_from_previous.focus_areas}</p>` : ''}
            
            <h4>🏃 Warmup (${dayPlan.warmup.duration_minutes} minutes)</h4>
            <ul>
              ${dayPlan.warmup.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
            </ul>
            
            <h4>💪 Main Exercises</h4>
            ${dayPlan.main_exercises.map((exercise, index) => `
              <div class="exercise">
                <h5>${index + 1}. ${exercise.exercise_name}</h5>
                <p><strong>Sets:</strong> ${exercise.sets} | <strong>Reps:</strong> ${exercise.reps} | <strong>Rest:</strong> ${exercise.rest_seconds}s</p>
                <p><strong>Target:</strong> ${exercise.primary_muscle_group}</p>
                <p><strong>Intensity:</strong> ${'🔥'.repeat(exercise.intensity_level)}</p>
                <p><strong>Key Points:</strong> ${exercise.form_cues}</p>
                ${exercise.modifications.easier.length > 0 ? `<p><strong>Make it easier:</strong> ${exercise.modifications.easier.join(', ')}</p>` : ''}
                ${exercise.modifications.harder.length > 0 ? `<p><strong>Make it harder:</strong> ${exercise.modifications.harder.join(', ')}</p>` : ''}
              </div>
            `).join('')}
            
            <h4>🧘 Cooldown (${dayPlan.cooldown.duration_minutes} minutes)</h4>
            <ul>
              ${dayPlan.cooldown.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
            </ul>
          </div>
          
          <div class="coaching-note">
            <strong>Kai's Coaching:</strong> ${dayPlan.coaching_notes.goal_specific}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:kyle@harmonizedfitness.com?subject=Day ${day} Check-in" class="button">Message Kyle 💬</a>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Generate rest day email HTML
  generateRestDayEmailHTML(day, userProfile, dayPlan) {
    const progressPercent = Math.round((day / 14) * 100);
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Day ${day} - Recovery Day</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #000; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .rest-card { background: #f0f9ff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10B981; }
        .progress-bar { background: #e9ecef; height: 8px; border-radius: 4px; margin: 15px 0; }
        .progress-fill { background: #10B981; height: 100%; border-radius: 4px; width: ${progressPercent}%; }
        .coaching-note { background: #fef3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Day ${day} - Recovery & Reflection 🧘‍♂️</h1>
          <p>${dayPlan.title}</p>
        </div>
        
        <div class="content">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <p style="text-align: center; font-size: 14px; color: #666;">Day ${day} of 14 - ${progressPercent}% Complete! 🎯</p>
          
          <div class="coaching-note">
            <strong>Recovery Wisdom:</strong> ${dayPlan.coaching_notes || 'Rest is not a reward for work done, it\'s a requirement for work to come.'}
          </div>
          
          <div class="rest-card">
            <h3>🌱 Today's Recovery Focus</h3>
            <p><strong>Focus:</strong> ${dayPlan.focus}</p>
            
            <h4>Today's Activities:</h4>
            <ul>
              ${dayPlan.activities.map(activity => `<li>${activity}</li>`).join('')}
            </ul>
            
            <h4>🍎 Nutrition Focus</h4>
            <p>${dayPlan.nutrition_focus}</p>
          </div>
          
          <div class="coaching-note">
            <strong>Remember:</strong> Recovery days are when your body rebuilds stronger. Embrace the process!
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Text versions for email clients that don't support HTML
  generateWelcomeEmailText(userProfile, program, day1Workout) {
    return `
Welcome to Harmonized Fitness, ${userProfile.user.full_name}!

Your Personalized 14-Day Military-Inspired Transformation Program

Mission Briefing:
${program.program_overview.primary_goal}

Program Overview:
- Duration: 14 days (10 workouts + 4 strategic rest days)
- Experience Level: ${userProfile.fitness_profile.experience_level}
- Workout Duration: ${userProfile.fitness_profile.workout_duration} minutes
- Primary Goal: ${userProfile.fitness_profile.primary_goal.replace('_', ' ')}

Day 1 Workout: ${day1Workout.workout_focus.replace('_', ' ').toUpperCase()}
Duration: ${day1Workout.estimated_duration} minutes
Difficulty: ${day1Workout.difficulty_level}/5 stars

[Detailed workout content follows...]

Nutrition Guidance:
${program.nutrition_guidance.overview}

Remember: I'll be checking in with you personally after Day 3. You've got this!

Semper Fi,
Kyle "Kai" - Former Army Ranger
Harmonized Fitness
    `;
  }

  generateWorkoutEmailText(day, userProfile, dayPlan) {
    return `
Day ${day} - ${dayPlan.workout_focus.replace('_', ' ').toUpperCase()} Focus

Progress: Day ${day} of 14 (${Math.round((day / 14) * 100)}% Complete!)

Today's Mission: ${dayPlan.coaching_notes.daily_reminder}

Workout Details:
- Duration: ${dayPlan.estimated_duration} minutes  
- Difficulty: ${dayPlan.difficulty_level}/5 stars

[Detailed workout content follows...]

Kai's Coaching: ${dayPlan.coaching_notes.goal_specific}

Questions? Reply to this email - I read every message personally.

Kyle "Kai"
Harmonized Fitness
    `;
  }

  generateRestDayEmailText(day, userProfile, dayPlan) {
    return `
Day ${day} - Recovery & Reflection

${dayPlan.title}

Progress: Day ${day} of 14 (${Math.round((day / 14) * 100)}% Complete!)

Today's Focus: ${dayPlan.focus}

Recovery Activities:
${dayPlan.activities.map(activity => `- ${activity}`).join('\n')}

Nutrition Focus: ${dayPlan.nutrition_focus}

Recovery Wisdom: ${dayPlan.coaching_notes || 'Rest is not a reward for work done, it\'s a requirement for work to come.'}

Kyle "Kai"
Harmonized Fitness
    `;
  }

  // Send email using SendGrid API
  async sendEmail(emailContent, apiKey = null, sendAt = null) {
    try {
      console.log('Sending email via SendGrid:', emailContent.subject, 'to', emailContent.to);
      
      // Use provided API key or fallback to stored instance key
      const sendGridApiKey = apiKey || this.apiKey;
      
      if (!sendGridApiKey) {
        console.error('❌ No SendGrid API key provided');
        return { success: false, error: 'SendGrid API key required' };
      }
      
      const sendGridPayload = {
        personalizations: [
          {
            to: [{ email: emailContent.to, name: emailContent.to_name || '' }],
            subject: emailContent.subject,
            ...(sendAt ? { send_at: sendAt } : {})
          }
        ],
        from: {
          email: emailContent.from.email || this.fromEmail,
          name: emailContent.from.name || this.fromName
        },
        content: [
          {
            type: 'text/plain', 
            value: emailContent.text || this.stripHtmlTags(emailContent.html)
          },
          {
            type: 'text/html',
            value: emailContent.html
          }
        ]
      };

      // Also set top-level send_at for redundancy (applies to all personalizations)
      if (sendAt) {
        sendGridPayload.send_at = sendAt;
      }

      console.log('SendGrid payload from:', sendGridPayload.from.email);
      console.log('SendGrid payload to:', sendGridPayload.personalizations[0].to[0].email);

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendGridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendGridPayload)
      });

      console.log('SendGrid response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ SendGrid error:', response.status, errorData);
        return { success: false, error: `SendGrid API error: ${response.status} - ${errorData}` };
      }

      const messageId = response.headers.get('X-Message-Id') || 'unknown';
      console.log('✅ Email sent successfully via SendGrid, ID:', messageId);
      
      return { success: true, id: messageId };
    } catch (error) {
      console.error('❌ SendGrid integration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper function to strip HTML tags for plain text version
  stripHtmlTags(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Compute a UNIX timestamp for 1:00 AM Eastern on Day N relative to today
  computeOneAmEasternUnix(day) {
    // Day 1 is today; for scheduling we use Day N at 1 AM Eastern
    const target = new Date();
    target.setUTCDate(target.getUTCDate() + (day - 1));
    // 1 AM America/New_York ~= 05:00 UTC during EDT; to avoid timezone libraries, schedule at 05:00 UTC
    target.setUTCHours(5, 0, 0, 0);
    return Math.floor(target.getTime() / 1000);
  }

  // Schedule email for future delivery (kept for logging/analytics if needed)
  async scheduleEmail(emailContent, deliveryDate, userId, day) {
    console.log(`Scheduling email (legacy log) for Day ${day} on ${deliveryDate.toISOString()}`);
    return {
      success: true,
      scheduled_id: `schedule-${userId}-${day}`,
      delivery_date: deliveryDate
    };
  }

  // Track program start for analytics
  async trackProgramStart(userId, programId) {
    // Track in database for analytics and follow-up
    console.log(`Program started for user ${userId}, program ${programId}`);
    return { success: true };
  }
}