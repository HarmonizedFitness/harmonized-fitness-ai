// Harmonized Fitness AI Assessment App
// Interactive 4-phase onboarding system

class FitnessAssessment {
  constructor() {
    this.currentPhase = 1;
    this.userData = {};
    this.modal = document.getElementById('assessment-modal');
    this.content = document.getElementById('assessment-content');
    
    this.init();
  }
  
  init() {
    // Start assessment button
    document.getElementById('start-assessment')?.addEventListener('click', () => {
      this.startAssessment();
    });
    
    // Close modal on outside click
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
  }
  
  startAssessment() {
    this.currentPhase = 1;
    this.userData = {};
    this.showModal();
    this.renderPhase1();
  }
  
  showModal() {
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
  
  // =======================================================================
  // PHASE 1: Basic Information Collection
  // =======================================================================
  
  renderPhase1() {
    this.content.innerHTML = `
      <div class="text-center mb-8">
        <div class="flex justify-center items-center mb-4">
          <div class="w-8 h-8 bg-burnt-orange rounded-full flex items-center justify-center text-white font-bold mr-2">1</div>
          <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold mr-2">2</div>
          <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold mr-2">3</div>
          <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Let's Get Started</h2>
        <p class="text-gray-400">First, tell us a bit about yourself</p>
      </div>
      
      <form id="phase1-form" class="space-y-6">
        <div>
          <label class="block text-white font-semibold mb-2" for="full_name">
            <i class="fas fa-user mr-2 text-burnt-orange"></i>Full Name *
          </label>
          <input type="text" id="full_name" name="full_name" required 
                 class="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-burnt-orange focus:outline-none transition-colors">
        </div>
        
        <div>
          <label class="block text-white font-semibold mb-2" for="email">
            <i class="fas fa-envelope mr-2 text-burnt-orange"></i>Email Address *
          </label>
          <input type="email" id="email" name="email" required 
                 class="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-burnt-orange focus:outline-none transition-colors">
          <p class="text-sm text-gray-400 mt-1">We'll send your personalized workout plan here</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-white font-semibold mb-2" for="age">
              <i class="fas fa-calendar mr-2 text-burnt-orange"></i>Age *
            </label>
            <input type="number" id="age" name="age" min="18" max="80" required 
                   class="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-burnt-orange focus:outline-none transition-colors">
          </div>
          
          <div>
            <label class="block text-white font-semibold mb-2" for="gender">
              <i class="fas fa-venus-mars mr-2 text-burnt-orange"></i>Gender *
            </label>
            <select id="gender" name="gender" required 
                    class="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-burnt-orange focus:outline-none transition-colors">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non_binary">Non-binary</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-between pt-6">
          <button type="button" onclick="assessment.closeModal()" 
                  class="px-6 py-3 text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-times mr-2"></i>Cancel
          </button>
          <button type="submit" 
                  class="bg-burnt-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
            Continue <i class="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </form>
    `;
    
    // Handle form submission
    document.getElementById('phase1-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePhase1Submit(e.target);
    });
  }
  
  async handlePhase1Submit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Basic validation
    if (!data.full_name || !data.email || !data.age || !data.gender) {
      this.showError('Please fill in all required fields');
      return;
    }
    
    // DEMO MODE: Skip API call and proceed directly
    // When database is ready, replace this section with:
    // try {
    //   const response = await axios.post('/api/users', { full_name: data.full_name, email: data.email, age: parseInt(data.age), gender: data.gender });
    //   if (response.data.success) { this.userData = { ...data, user_id: response.data.user_id }; this.currentPhase = 2; this.renderPhase2(); }
    // } catch (error) { this.showError('Something went wrong. Please try again.'); }
    
    // For now: Store user data locally for demo purposes
    this.userData = { 
      ...data, 
      user_id: 'demo-' + Date.now(), // Generate a demo user ID
      age: parseInt(data.age)
    };
    
    // Show brief loading animation for realism
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    button.disabled = true;
    
    setTimeout(() => {
      this.currentPhase = 2;
      this.renderPhase2();
    }, 800); // Brief delay for better UX
  }
  
  // =======================================================================
  // PHASE 2: Fitness Assessment - SIMPLIFIED FOR DEMO
  // =======================================================================
  
  renderPhase2() {
    this.content.innerHTML = `
      <div class="text-center mb-8">
        <div class="flex justify-center items-center mb-4">
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">✓</div>
          <div class="w-8 h-8 bg-burnt-orange rounded-full flex items-center justify-center text-white font-bold mr-2">2</div>
          <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold mr-2">3</div>
          <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Fitness Assessment</h2>
        <p class="text-gray-400">Help us understand your current fitness level and goals</p>
      </div>
      
      <form id="phase2-form" class="space-y-8">
        <div>
          <label class="block text-white font-semibold mb-4">
            <i class="fas fa-trophy mr-2 text-burnt-orange"></i>What's your experience level?
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="cursor-pointer">
              <input type="radio" name="experience_level" value="beginner" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1">Beginner</div>
                <div class="text-sm text-gray-400">New to fitness or returning after a break</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="experience_level" value="intermediate" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1">Intermediate</div>
                <div class="text-sm text-gray-400">Regular exercise for 6+ months</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="experience_level" value="advanced" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1">Advanced</div>
                <div class="text-sm text-gray-400">Consistent training for 2+ years</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="experience_level" value="expert" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1">Expert</div>
                <div class="text-sm text-gray-400">Athlete or fitness professional level</div>
              </div>
            </label>
          </div>
        </div>
        
        <div>
          <label class="block text-white font-semibold mb-4">
            <i class="fas fa-bullseye mr-2 text-burnt-orange"></i>What's your primary fitness goal?
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="cursor-pointer">
              <input type="radio" name="primary_goal" value="weight_loss" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-fire mr-2"></i>Weight Loss & Fat Burning</div>
                <div class="text-sm text-gray-400">Burn calories and lean out</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="primary_goal" value="muscle_building" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-dumbbell mr-2"></i>Muscle Building</div>
                <div class="text-sm text-gray-400">Build lean muscle mass</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="primary_goal" value="strength_power" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-bolt mr-2"></i>Strength & Power</div>
                <div class="text-sm text-gray-400">Increase functional strength</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="primary_goal" value="military_tactical" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-medal mr-2"></i>Military/Tactical Prep</div>
                <div class="text-sm text-gray-400">Combat-ready conditioning</div>
              </div>
            </label>
          </div>
        </div>
        
        <div class="flex justify-between pt-6">
          <button type="button" onclick="assessment.renderPhase1()" 
                  class="px-6 py-3 text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>Back
          </button>
          <button type="submit" 
                  class="bg-burnt-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
            Generate My Workout! <i class="fas fa-magic ml-2"></i>
          </button>
        </div>
      </form>
    `;
    
    this.setupRadioButtons();
    
    // Handle form submission
    document.getElementById('phase2-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.generateDemoWorkout();
    });
  }
  
  // =======================================================================
  // DEMO WORKOUT GENERATION (No database required)
  // =======================================================================
  
  generateDemoWorkout() {
    // Show loading state
    this.content.innerHTML = `
      <div class="text-center py-16">
        <div class="mb-8">
          <i class="fas fa-cog fa-spin text-6xl text-burnt-orange mb-4"></i>
          <h2 class="text-3xl font-bold text-white mb-4">Generating Your Personalized Workout</h2>
          <p class="text-gray-400 text-lg">Our AI is analyzing your profile and creating the perfect fitness plan...</p>
        </div>
        <div class="max-w-md mx-auto">
          <div class="bg-gray-800 rounded-full h-2 mb-4">
            <div class="bg-burnt-orange h-2 rounded-full animate-pulse" style="width: 85%"></div>
          </div>
          <p class="text-sm text-gray-500">Matching exercises to your goals and equipment...</p>
        </div>
      </div>
    `;
    
    // Simulate processing time
    setTimeout(() => {
      this.showDemoWorkout();
    }, 3000);
  }
  
  showDemoWorkout() {
    this.content.innerHTML = `
      <div class="text-center mb-8">
        <div class="mb-6">
          <i class="fas fa-trophy text-6xl text-burnt-orange mb-4"></i>
          <h2 class="text-4xl font-bold text-white mb-4">Your Personalized Workout is Ready!</h2>
          <p class="text-gray-400 text-lg">Based on your profile, here's your custom fitness plan</p>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-burnt-orange/20 to-orange-900/20 rounded-lg p-6 mb-8">
        <h3 class="text-2xl font-bold text-white mb-4">Military-Style HIIT Workout</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <i class="fas fa-clock text-2xl text-burnt-orange mb-2"></i>
            <div class="text-white font-bold">30 minutes</div>
            <div class="text-gray-400 text-sm">Duration</div>
          </div>
          <div>
            <i class="fas fa-fire text-2xl text-burnt-orange mb-2"></i>
            <div class="text-white font-bold">~350 calories</div>
            <div class="text-gray-400 text-sm">Estimated burn</div>
          </div>
          <div>
            <i class="fas fa-star text-2xl text-burnt-orange mb-2"></i>
            <div class="text-white font-bold">★★★☆☆</div>
            <div class="text-gray-400 text-sm">Difficulty</div>
          </div>
        </div>
      </div>
      
      <div class="space-y-6 mb-8">
        <div>
          <h4 class="text-xl font-bold text-white mb-3"><i class="fas fa-play text-burnt-orange mr-2"></i>Warm-up (5 minutes)</h4>
          <div class="bg-gray-800 rounded-lg p-4">
            <ul class="text-gray-300 space-y-1">
              <li>• Jumping Jacks - 30 seconds</li>
              <li>• Bodyweight Squats - 30 seconds</li>
              <li>• Arm Circles - 30 seconds</li>
              <li>• High Knees - 30 seconds</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h4 class="text-xl font-bold text-white mb-3"><i class="fas fa-dumbbell text-burnt-orange mr-2"></i>Main Workout (20 minutes)</h4>
          <div class="space-y-3">
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h5 class="font-bold text-white mb-2">1. Push-ups</h5>
                  <p class="text-gray-400 text-sm mb-2">3 sets x 10-15 reps</p>
                  <div class="flex items-center text-sm text-gray-500">
                    <span class="mr-4"><i class="fas fa-target mr-1"></i>Chest, Shoulders, Triceps</span>
                    <span><i class="fas fa-fire mr-1"></i>High intensity</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h5 class="font-bold text-white mb-2">2. Burpees</h5>
                  <p class="text-gray-400 text-sm mb-2">3 sets x 8-12 reps</p>
                  <div class="flex items-center text-sm text-gray-500">
                    <span class="mr-4"><i class="fas fa-target mr-1"></i>Full Body</span>
                    <span><i class="fas fa-fire mr-1"></i>Max intensity</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h5 class="font-bold text-white mb-2">3. Mountain Climbers</h5>
                  <p class="text-gray-400 text-sm mb-2">3 sets x 30 seconds</p>
                  <div class="flex items-center text-sm text-gray-500">
                    <span class="mr-4"><i class="fas fa-target mr-1"></i>Core, Cardio</span>
                    <span><i class="fas fa-fire mr-1"></i>High intensity</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h5 class="font-bold text-white mb-2">4. Plank Hold</h5>
                  <p class="text-gray-400 text-sm mb-2">3 sets x 30-60 seconds</p>
                  <div class="flex items-center text-sm text-gray-500">
                    <span class="mr-4"><i class="fas fa-target mr-1"></i>Core Strength</span>
                    <span><i class="fas fa-fire mr-1"></i>Moderate intensity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="text-xl font-bold text-white mb-3"><i class="fas fa-heart text-burnt-orange mr-2"></i>Cool-down (5 minutes)</h4>
          <div class="bg-gray-800 rounded-lg p-4">
            <ul class="text-gray-300 space-y-1">
              <li>• Deep breathing exercises</li>
              <li>• Downward Dog stretch</li>
              <li>• Forward fold stretch</li>
              <li>• Child's pose</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-6 mb-8">
        <h4 class="text-xl font-bold text-white mb-3"><i class="fas fa-gift text-green-400 mr-2"></i>Your FREE 14-Day Program Includes:</h4>
        <ul class="text-gray-300 space-y-2">
          <li><i class="fas fa-check text-green-400 mr-2"></i>14 progressive workout plans</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>Detailed exercise instructions & videos</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>Nutrition guidance from military nutrition experts</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>Progress tracking tools</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>Direct access to Kyle (Kai) for questions</li>
        </ul>
      </div>
      
      <div class="text-center">
        <button id="claim-program" 
                class="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-4">
          <i class="fas fa-download mr-3"></i>
          Claim Your FREE 14-Day Program
        </button>
        <p class="text-gray-400 text-sm">Program will be sent to ${this.userData.email}</p>
        
        <div class="mt-8 pt-8 border-t border-gray-700">
          <button onclick="assessment.closeModal()" 
                  class="text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-times mr-2"></i>Close
          </button>
        </div>
      </div>
    `;
    
    // Handle program claim
    document.getElementById('claim-program').addEventListener('click', () => {
      this.claimProgram();
    });
  }
  
  claimProgram() {
    // Show success message
    this.content.innerHTML = `
      <div class="text-center py-16">
        <i class="fas fa-check-circle text-8xl text-green-500 mb-6"></i>
        <h2 class="text-4xl font-bold text-white mb-4">Welcome to Harmonized Fitness!</h2>
        <p class="text-xl text-gray-300 mb-8">Your FREE 14-day program is on its way to <strong>${this.userData.email}</strong></p>
        
        <div class="bg-gradient-to-r from-burnt-orange/20 to-orange-900/20 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
          <h3 class="text-xl font-bold text-white mb-4">What happens next?</h3>
          <ul class="text-gray-300 space-y-3 text-left">
            <li><i class="fas fa-envelope text-burnt-orange mr-3"></i>Check your email for your complete program (arriving in 2-3 minutes)</li>
            <li><i class="fas fa-calendar text-burnt-orange mr-3"></i>Start Day 1 tomorrow morning for best results</li>
            <li><i class="fas fa-phone text-burnt-orange mr-3"></i>Kyle will personally check in with you after Day 3</li>
            <li><i class="fas fa-star text-burnt-orange mr-3"></i>Bonus: Access to our private military fitness community</li>
          </ul>
        </div>
        
        <div class="space-y-4">
          <button onclick="window.open('https://harmonizedfitness.com', '_blank')" 
                  class="bg-burnt-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mr-4">
            <i class="fas fa-external-link-alt mr-2"></i>Visit HarmonizedFitness.com
          </button>
          <button onclick="assessment.closeModal()" 
                  class="border border-gray-600 hover:border-white text-gray-400 hover:text-white font-bold py-3 px-8 rounded-lg transition-all duration-300">
            <i class="fas fa-times mr-2"></i>Close
          </button>
        </div>
      </div>
    `;
  }
  
  // =======================================================================
  // UI HELPER FUNCTIONS
  // =======================================================================
  
  setupRadioButtons() {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        // Remove selected class from all options with same name
        document.querySelectorAll(`input[name="${radio.name}"]`).forEach(r => {
          r.closest('label').querySelector('.radio-option').classList.remove('selected', 'border-burnt-orange');
          r.closest('label').querySelector('.radio-option').classList.add('border-gray-600');
        });
        
        // Add selected class to chosen option
        if (radio.checked) {
          radio.closest('label').querySelector('.radio-option').classList.add('selected', 'border-burnt-orange');
          radio.closest('label').querySelector('.radio-option').classList.remove('border-gray-600');
        }
      });
    });
  }
  
  showError(message) {
    // Simple error display
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-600 text-white p-4 rounded-lg mb-4';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>${message}`;
    
    this.content.insertBefore(errorDiv, this.content.firstChild);
    
    // Remove error after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
}

// Initialize the assessment when DOM is ready
let assessment;
document.addEventListener('DOMContentLoaded', () => {
  assessment = new FitnessAssessment();
});