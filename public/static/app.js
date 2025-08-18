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
        <h2 class="text-3xl font-bold text-white mb-2">Begin Your Journey</h2>
        <p class="text-gray-400">Let's discover your unique path to harmony</p>
      </div>
      
      <form id="phase1-form" class="space-y-6">
        <div>
          <label class="block text-white font-semibold mb-2" for="full_name">
            <i class="fas fa-user mr-2 text-burnt-orange"></i>Full Name *
          </label>
          <input type="text" id="full_name" name="full_name" required 
                 class="w-full p-4 bg-charcoal border border-gray-700 rounded-lg text-white focus:border-burnt-orange focus:outline-none transition-colors">
        </div>
        
        <div>
          <label class="block text-white font-semibold mb-2" for="email">
            <i class="fas fa-envelope mr-2 text-burnt-orange"></i>Email Address *
          </label>
          <input type="email" id="email" name="email" required 
                 class="w-full p-4 bg-charcoal border border-gray-700 rounded-lg text-white focus:border-burnt-orange focus:outline-none transition-colors">
          <p class="text-sm text-gray-400 mt-1">Your harmonized fitness plan will arrive here</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-white font-semibold mb-2" for="age">
              <i class="fas fa-calendar mr-2 text-burnt-orange"></i>Age *
            </label>
            <input type="number" id="age" name="age" min="18" max="80" required 
                   class="w-full p-4 bg-charcoal border border-gray-700 rounded-lg text-white focus:border-burnt-orange focus:outline-none transition-colors">
          </div>
          
          <div>
            <label class="block text-white font-semibold mb-2" for="gender">
              <i class="fas fa-venus-mars mr-2 text-burnt-orange"></i>Gender *
            </label>
            <select id="gender" name="gender" required 
                    class="w-full p-4 bg-charcoal border border-gray-600 rounded-lg text-white focus:border-burnt-orange focus:outline-none transition-colors">
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
    
    // Show loading state
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating Profile...';
    button.disabled = true;
    
    try {
      const response = await axios.post('/api/users', { 
        full_name: data.full_name, 
        email: data.email, 
        age: parseInt(data.age), 
        gender: data.gender 
      });
      
      if (response.data.success) {
        this.userData = { 
          ...data, 
          user_id: response.data.user_id,
          age: parseInt(data.age)
        };
        this.currentPhase = 2;
        this.renderPhase2();
      } else {
        this.showError('Failed to create profile. Please try again.');
      }
    } catch (error) {
      console.error('Phase 1 API Error:', error);
      this.showError('Connection error. Please check your internet and try again.');
    } finally {
      button.innerHTML = originalText;
      button.disabled = false;
    }
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
        <h2 class="text-3xl font-bold text-white mb-2">Your Fitness Story</h2>
        <p class="text-gray-400">Share where you are so we can design where you're going</p>
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
                <div class="text-sm text-gray-400">Starting fresh or returning to movement</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="experience_level" value="intermediate" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1">Intermediate</div>
                <div class="text-sm text-gray-400">Consistent practice, ready to grow</div>
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label class="cursor-pointer">
              <input type="radio" name="primary_goal" value="weight_loss" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-fire mr-2"></i>Weight Loss</div>
                <div class="text-sm text-gray-400">Transform your relationship with your body</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="primary_goal" value="muscle_building" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-dumbbell mr-2"></i>Muscle Building</div>
                <div class="text-sm text-gray-400">Build power with intention and purpose</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="primary_goal" value="strength_power" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-bolt mr-2"></i>Strength/Power</div>
                <div class="text-sm text-gray-400">Unlock your body's true potential</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="primary_goal" value="military_prep" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-shield-alt mr-2 text-army-green"></i>Military Prep</div>
                <div class="text-sm text-gray-400">Combat-ready fitness and mental toughness</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="primary_goal" value="glute_enhancement" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-heart mr-2"></i>Glute Enhancement</div>
                <div class="text-sm text-gray-400">Build strength, power, and confidence from the foundation up</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="primary_goal" value="level_up" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-level-up-alt mr-2"></i>Level Up</div>
                <div class="text-sm text-gray-400">Advanced techniques to break through plateaus</div>
              </div>
            </label>
          </div>
        </div>
        
        <div>
          <label class="block text-white font-semibold mb-4">
            <i class="fas fa-clock mr-2 text-burnt-orange"></i>How long can you dedicate to each session?
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label class="cursor-pointer">
              <input type="radio" name="workout_duration" value="15-30" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option text-center">
                <div class="font-bold text-white">15-30 min</div>
                <div class="text-xs text-gray-400">Quick & focused</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="workout_duration" value="30-45" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option text-center">
                <div class="font-bold text-white">30-45 min</div>
                <div class="text-xs text-gray-400">Balanced sessions</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="workout_duration" value="45-60" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option text-center">
                <div class="font-bold text-white">45-60 min</div>
                <div class="text-xs text-gray-400">Deep training</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="workout_duration" value="60+" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option text-center">
                <div class="font-bold text-white">60+ min</div>
                <div class="text-xs text-gray-400">Elite sessions</div>
              </div>
            </label>
          </div>
        </div>
        
        <div>
          <label class="block text-white font-semibold mb-4">
            <i class="fas fa-location-arrow mr-2 text-burnt-orange"></i>Where will you primarily train?
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="cursor-pointer">
              <input type="radio" name="workout_environment" value="home_focused" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-home mr-2"></i>Home & Natural Spaces</div>
                <div class="text-sm text-gray-400">Living room, backyard, local park</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="workout_environment" value="gym_access" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-dumbbell mr-2"></i>Full Gym Access</div>
                <div class="text-sm text-gray-400">Complete equipment and space</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="workout_environment" value="equipment_limited" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-tools mr-2"></i>Minimal Equipment</div>
                <div class="text-sm text-gray-400">Bands, light weights, bodyweight</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="workout_environment" value="time_constrained" class="sr-only">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="font-bold text-white mb-1"><i class="fas fa-bolt mr-2"></i>Time-Efficient Focus</div>
                <div class="text-sm text-gray-400">Maximum results, minimal time</div>
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
            Generate My Program! <i class="fas fa-magic ml-2"></i>
          </button>
        </div>
      </form>
    `;
    
    this.setupRadioButtons();
    
    // Handle form submission
    document.getElementById('phase2-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePhase2Submit(e.target);
    });
  }
  
  // =======================================================================
  // PHASE 2 FORM SUBMISSION - Real API Call
  // =======================================================================
  
  async handlePhase2Submit(form) {
    const formData = new FormData(form);
    const data = {
      experience_level: formData.get('experience_level'),
      primary_goal: formData.get('primary_goal'),
      workout_duration: formData.get('workout_duration'),
      workout_environment: formData.get('workout_environment')
    };
    
    // Validation
    if (!data.experience_level || !data.primary_goal || !data.workout_duration || !data.workout_environment) {
      this.showError('Please complete all fields to continue');
      return;
    }
    
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving Profile...';
    button.disabled = true;
    
    try {
      // Save fitness profile
      const response = await axios.post(`/api/users/${this.userData.user_id}/fitness-profile`, data);
      
      if (response.data.success) {
        // Add fitness profile to userData
        this.userData.fitness_profile = data;
        this.currentPhase = 3;
        this.renderPhase3();
      } else {
        this.showError('Failed to save fitness profile. Please try again.');
      }
    } catch (error) {
      console.error('Phase 2 API Error:', error);
      this.showError('Connection error. Please check your internet and try again.');
    } finally {
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }
  
  // =======================================================================
  // PHASE 3: Training Environment & Equipment Selection
  // =======================================================================
  
  renderPhase3() {
    this.content.innerHTML = `
      <div class="text-center mb-8">
        <div class="flex justify-center items-center mb-4">
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">✓</div>
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">✓</div>
          <div class="w-8 h-8 bg-burnt-orange rounded-full flex items-center justify-center text-white font-bold mr-2">3</div>
          <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Let's Dial In Your Training Environment</h2>
        <p class="text-gray-400">The right tools make all the difference - let's see what we're working with</p>
      </div>
      
      <form id="phase3-form" class="space-y-8">
        <div>
          <label class="block text-white font-semibold mb-4">
            <i class="fas fa-location-arrow mr-2 text-burnt-orange"></i>Where will you primarily train?
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <label class="cursor-pointer">
              <input type="radio" name="training_location" value="gym" class="sr-only" onchange="assessment.toggleEquipmentSection('gym')">
              <div class="p-6 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="text-center">
                  <i class="fas fa-dumbbell text-3xl text-burnt-orange mb-3"></i>
                  <div class="font-bold text-white mb-2">Full Gym Access</div>
                  <div class="text-sm text-gray-400">Complete equipment and space - let's unleash your potential</div>
                </div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="training_location" value="home" class="sr-only" onchange="assessment.toggleEquipmentSection('home')">
              <div class="p-6 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option">
                <div class="text-center">
                  <i class="fas fa-home text-3xl text-burnt-orange mb-3"></i>
                  <div class="font-bold text-white mb-2">Home Training</div>
                  <div class="text-sm text-gray-400">Your personal space - we'll make it work perfectly</div>
                </div>
              </div>
            </label>
          </div>
        </div>
        
        <div id="equipment-section" class="hidden">
          <div class="bg-charcoal/50 rounded-lg p-6 border border-burnt-orange/20">
            <label class="block text-white font-semibold mb-4">
              <i class="fas fa-tools mr-2 text-burnt-orange"></i>What equipment do you have access to?
            </label>
            <p class="text-gray-400 text-sm mb-4">Check all that apply - don't worry if you only have a few items, we'll design around what you've got</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label class="cursor-pointer">
                <input type="checkbox" name="equipment" value="dumbbells" class="sr-only">
                <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors checkbox-option text-center">
                  <i class="fas fa-dumbbell text-2xl text-burnt-orange mb-2"></i>
                  <div class="text-white font-medium">Dumbbells</div>
                </div>
              </label>
              
              <label class="cursor-pointer">
                <input type="checkbox" name="equipment" value="kettlebells" class="sr-only">
                <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors checkbox-option text-center">
                  <i class="fas fa-weight-hanging text-2xl text-burnt-orange mb-2"></i>
                  <div class="text-white font-medium">Kettlebells</div>
                </div>
              </label>
              
              <label class="cursor-pointer">
                <input type="checkbox" name="equipment" value="barbells" class="sr-only">
                <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors checkbox-option text-center">
                  <i class="fas fa-minus text-2xl text-burnt-orange mb-2"></i>
                  <div class="text-white font-medium">Barbells</div>
                </div>
              </label>
              
              <label class="cursor-pointer">
                <input type="checkbox" name="equipment" value="squat_rack" class="sr-only">
                <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors checkbox-option text-center">
                  <i class="fas fa-square text-2xl text-burnt-orange mb-2"></i>
                  <div class="text-white font-medium">Squat Rack</div>
                </div>
              </label>
              
              <label class="cursor-pointer">
                <input type="checkbox" name="equipment" value="workout_bench" class="sr-only">
                <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors checkbox-option text-center">
                  <i class="fas fa-couch text-2xl text-burnt-orange mb-2"></i>
                  <div class="text-white font-medium">Workout Bench</div>
                </div>
              </label>
              
              <label class="cursor-pointer">
                <input type="checkbox" name="equipment" value="resistance_bands" class="sr-only">
                <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors checkbox-option text-center">
                  <i class="fas fa-link text-2xl text-burnt-orange mb-2"></i>
                  <div class="text-white font-medium">Resistance Bands</div>
                </div>
              </label>
              
              <label class="cursor-pointer">
                <input type="checkbox" name="equipment" value="trx_suspension" class="sr-only">
                <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors checkbox-option text-center">
                  <i class="fas fa-anchor text-2xl text-burnt-orange mb-2"></i>
                  <div class="text-white font-medium">TRX/Suspension</div>
                </div>
              </label>
              
              <label class="cursor-pointer">
                <input type="checkbox" name="equipment" value="bodyweight_only" class="sr-only">
                <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors checkbox-option text-center">
                  <i class="fas fa-user text-2xl text-burnt-orange mb-2"></i>
                  <div class="text-white font-medium">None (Bodyweight)</div>
                </div>
              </label>
            </div>
            
            <div class="mt-4 p-3 bg-burnt-orange/10 rounded-lg border border-burnt-orange/30">
              <p class="text-sm text-gray-300">
                <i class="fas fa-lightbulb text-burnt-orange mr-2"></i>
                <strong>Pro Tip:</strong> Even with minimal equipment, we can create incredible transformations. Some of my most effective programs use just bodyweight and bands.
              </p>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between pt-6">
          <button type="button" onclick="assessment.renderPhase2()" 
                  class="px-6 py-3 text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>Back
          </button>
          <button type="submit" 
                  class="bg-burnt-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
            Continue <i class="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </form>
    `;
    
    this.setupRadioButtons();
    this.setupCheckboxes();
    
    // Handle form submission
    document.getElementById('phase3-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePhase3Submit(e.target);
    });
  }
  
  // Toggle equipment section based on training location
  toggleEquipmentSection(location) {
    const equipmentSection = document.getElementById('equipment-section');
    if (location === 'home') {
      equipmentSection.classList.remove('hidden');
    } else {
      equipmentSection.classList.add('hidden');
    }
  }
  
  // Handle Phase 3 form submission
  async handlePhase3Submit(form) {
    const formData = new FormData(form);
    const trainingLocation = formData.get('training_location');
    
    if (!trainingLocation) {
      this.showError('Please select where you\'ll be training');
      return;
    }
    
    let equipment = [];
    
    if (trainingLocation === 'gym') {
      // Gym users get access to all equipment
      equipment = ['dumbbells', 'barbells', 'kettlebells', 'squat_rack', 'workout_bench', 'cable_machine', 'pull_up_bar'];
    } else {
      // Home users: get selected equipment
      equipment = formData.getAll('equipment');
      if (equipment.length === 0) {
        this.showError('Please select at least one equipment option, or choose "None (Bodyweight)"');
        return;
      }
    }
    
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving Setup...';
    button.disabled = true;
    
    try {
      const response = await axios.post(`/api/users/${this.userData.user_id}/equipment`, {
        equipment: equipment
      });
      
      if (response.data.success) {
        this.userData.equipment = equipment;
        this.userData.training_location = trainingLocation;
        this.currentPhase = 4;
        this.renderPhase4();
      } else {
        this.showError('Failed to save equipment setup. Please try again.');
      }
    } catch (error) {
      console.error('Phase 3 API Error:', error);
      this.showError('Connection error. Please check your internet and try again.');
    } finally {
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }
  
  // =======================================================================
  // PHASE 4: Injury Considerations with Dr. U Tone
  // =======================================================================
  
  renderPhase4() {
    this.content.innerHTML = `
      <div class="text-center mb-8">
        <div class="flex justify-center items-center mb-4">
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">✓</div>
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">✓</div>
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">✓</div>
          <div class="w-8 h-8 bg-burnt-orange rounded-full flex items-center justify-center text-white font-bold">4</div>
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Let's Keep You Safe & Strong</h2>
        <p class="text-gray-400">Any injury considerations? Don't worry - we'll work around anything</p>
      </div>
      
      <form id="phase4-form" class="space-y-8">
        <div class="bg-charcoal/50 rounded-lg p-6 border border-burnt-orange/20">
          <label class="block text-white font-semibold mb-4">
            <i class="fas fa-shield-alt mr-2 text-burnt-orange"></i>Any current or past injuries we should be mindful of?
          </label>
          
          <div class="mb-6">
            <label class="cursor-pointer flex items-start">
              <input type="radio" name="has_injuries" value="none" class="sr-only" onchange="assessment.toggleInjuryDetails('none')">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option w-full">
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-3"></i>
                  <div>
                    <div class="font-bold text-white">No injuries or limitations</div>
                    <div class="text-sm text-gray-400">Ready to train without restrictions</div>
                  </div>
                </div>
              </div>
            </label>
          </div>
          
          <div class="mb-6">
            <label class="cursor-pointer flex items-start">
              <input type="radio" name="has_injuries" value="minor" class="sr-only" onchange="assessment.toggleInjuryDetails('minor')">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option w-full">
                <div class="flex items-center">
                  <i class="fas fa-exclamation-triangle text-yellow-500 mr-3"></i>
                  <div>
                    <div class="font-bold text-white">Minor considerations</div>
                    <div class="text-sm text-gray-400">Some things to be mindful of, but nothing major</div>
                  </div>
                </div>
              </div>
            </label>
          </div>
          
          <div class="mb-6">
            <label class="cursor-pointer flex items-start">
              <input type="radio" name="has_injuries" value="significant" class="sr-only" onchange="assessment.toggleInjuryDetails('significant')">
              <div class="p-4 border-2 border-gray-600 rounded-lg hover:border-burnt-orange transition-colors radio-option w-full">
                <div class="flex items-center">
                  <i class="fas fa-band-aid text-red-500 mr-3"></i>
                  <div>
                    <div class="font-bold text-white">Significant injury history</div>
                    <div class="text-sm text-gray-400">Let's work smart around any limitations</div>
                  </div>
                </div>
              </div>
            </label>
          </div>
          
          <div id="injury-details" class="hidden mt-6">
            <label class="block text-white font-medium mb-3">
              Brief description of injuries or areas of concern:
            </label>
            <textarea name="injury_details" 
                      class="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-burnt-orange focus:outline-none transition-colors"
                      rows="3"
                      placeholder="e.g., 'Previous knee surgery on left leg, occasional lower back stiffness...'"></textarea>
            
            <div class="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
              <p class="text-sm text-gray-300">
                <i class="fas fa-user-md text-blue-400 mr-2"></i>
                <strong>My approach:</strong> I've worked with everyone from elite athletes to people recovering from major surgeries. 
                We'll modify movements intelligently while still challenging you appropriately. Your limitations don't define your potential.
              </p>
            </div>
          </div>
        </div>
        
        <div class="bg-burnt-orange/10 rounded-lg p-6 border border-burnt-orange/30">
          <h4 class="text-white font-bold mb-3">
            <i class="fas fa-heart text-burnt-orange mr-2"></i>My Philosophy on Training with Injuries
          </h4>
          <div class="space-y-3 text-sm text-gray-300">
            <p>After my own career-ending injury as an Airborne Ranger, I learned that our bodies are incredibly adaptable. The key is working <em>with</em> your body, not against it.</p>
            <p>We'll use modifications as opportunities to discover new movement patterns and build resilience in different ways. Sometimes our greatest limitations become our greatest teachers.</p>
            <p><strong>Remember:</strong> This is just for awareness - I'm not tiptoeing around anything. We're going to train smart and train hard.</p>
          </div>
        </div>
        
        <div class="flex justify-between pt-6">
          <button type="button" onclick="assessment.renderPhase3()" 
                  class="px-6 py-3 text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>Back
          </button>
          <button type="submit" 
                  class="bg-gradient-to-r from-burnt-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Generate My Program! <i class="fas fa-magic ml-2"></i>
          </button>
        </div>
      </form>
    `;
    
    this.setupRadioButtons();
    
    // Handle form submission
    document.getElementById('phase4-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePhase4Submit(e.target);
    });
  }
  
  // Toggle injury details section
  toggleInjuryDetails(injuryLevel) {
    const detailsSection = document.getElementById('injury-details');
    if (injuryLevel === 'minor' || injuryLevel === 'significant') {
      detailsSection.classList.remove('hidden');
    } else {
      detailsSection.classList.add('hidden');
    }
  }
  
  // Handle Phase 4 form submission
  async handlePhase4Submit(form) {
    const formData = new FormData(form);
    const hasInjuries = formData.get('has_injuries');
    
    if (!hasInjuries) {
      this.showError('Please let us know about any injury considerations');
      return;
    }
    
    let injuries = [];
    if (hasInjuries !== 'none') {
      const injuryDetails = formData.get('injury_details') || '';
      if (hasInjuries !== 'none' && !injuryDetails.trim()) {
        this.showError('Please provide a brief description of your injuries or concerns');
        return;
      }
      
      injuries = [{
        severity: hasInjuries,
        description: injuryDetails.trim(),
        injury_type: 'general' // We'll keep it simple for now
      }];
    }
    
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Finalizing Profile...';
    button.disabled = true;
    
    try {
      const response = await axios.post(`/api/users/${this.userData.user_id}/injuries`, {
        injuries: injuries
      });
      
      if (response.data.success) {
        this.userData.injuries = injuries;
        this.startProgramGeneration();
      } else {
        this.showError('Failed to save injury information. Please try again.');
      }
    } catch (error) {
      console.error('Phase 4 API Error:', error);
      this.showError('Connection error. Please check your internet and try again.');
    } finally {
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }
  
  // =======================================================================
  // AI PROGRAM GENERATION - Real API Call
  // =======================================================================
  
  async startProgramGeneration() {
    // Show loading state
    this.content.innerHTML = `
      <div class="text-center py-16">
        <div class="mb-8">
          <i class="fas fa-cog fa-spin text-6xl text-burnt-orange mb-4"></i>
          <h2 class="text-3xl font-bold text-white mb-4">AI is Creating Your Complete 14-Day Program</h2>
          <p class="text-gray-400 text-lg">Analyzing your profile and generating personalized workouts...</p>
          <div class="mt-4 text-sm text-gray-500 space-y-1">
            <div>✓ Processing fitness goals and experience level</div>
            <div>✓ Matching exercises to available equipment</div>
            <div>✓ Creating progressive 10-workout plan</div>
            <div>✓ Scheduling 4 strategic rest days</div>
            <div>✓ Preparing automated email delivery</div>
          </div>
        </div>
        <div class="max-w-md mx-auto">
          <div class="bg-charcoal rounded-full h-2 mb-4">
            <div class="bg-burnt-orange h-2 rounded-full" id="progress-bar" style="width: 10%"></div>
          </div>
          <p class="text-sm text-gray-500" id="progress-text">Initializing AI program generator...</p>
        </div>
      </div>
    `;
    
    // Animate progress bar
    this.animateProgress();
    
    try {
      // Generate full 14-day program with email delivery
      // (Equipment and injuries already saved in previous phases)
      const response = await axios.post(`/api/users/${this.userData.user_id}/generate-program`);
      
      if (response.data.success) {
        setTimeout(() => {
          this.showProgramSuccess(response.data.program);
        }, 3000);
      } else {
        this.showError('Failed to generate program. Please try again.');
      }
    } catch (error) {
      console.error('Program Generation Error:', error);
      this.showError('Failed to create your program. Please try again.');
    }
  }

  animateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const stages = [
      { width: 20, text: 'Analyzing user profile...' },
      { width: 40, text: 'Selecting optimal exercises...' },
      { width: 60, text: 'Creating 14-day progression...' },
      { width: 80, text: 'Generating nutrition guidance...' },
      { width: 95, text: 'Preparing email delivery system...' },
      { width: 100, text: 'Program complete!' }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        progressBar.style.width = stages[currentStage].width + '%';
        progressText.textContent = stages[currentStage].text;
        currentStage++;
      } else {
        clearInterval(interval);
      }
    }, 800);
  }
  
  showProgramSuccess(program) {
    this.content.innerHTML = `
      <div class="text-center mb-8">
        <div class="mb-6">
          <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
          <h2 class="text-4xl font-bold text-white mb-4">🎉 Your Program is Ready!</h2>
          <p class="text-gray-400 text-lg">Your personalized 14-day program has been created and delivery has started!</p>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-green-900/20 to-burnt-orange/20 rounded-lg p-6 mb-8">
        <h3 class="text-2xl font-bold text-white mb-4">📧 Email Delivery Started!</h3>
        <div class="bg-black/20 rounded-lg p-4 mb-4">
          <p class="text-white mb-2"><strong>✅ Day 1 workout sent to:</strong> ${this.userData.email}</p>
          <p class="text-gray-400 text-sm">Check your inbox (and spam folder) in the next few minutes</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
          <div>
            <i class="fas fa-calendar text-2xl text-green-500 mb-2"></i>
            <div class="text-white font-bold">14 Days</div>
            <div class="text-gray-400 text-sm">Complete Program</div>
          </div>
          <div>
            <i class="fas fa-clock text-2xl text-green-500 mb-2"></i>
            <div class="text-white font-bold">6:00 AM</div>
            <div class="text-gray-400 text-sm">Daily Delivery</div>
          </div>
          <div>
            <i class="fas fa-dumbbell text-2xl text-green-500 mb-2"></i>
            <div class="text-white font-bold">Advanced</div>
            <div class="text-gray-400 text-sm">Techniques Included</div>
          </div>
        </div>
        
        <div class="bg-black/20 rounded-lg p-4">
          <h4 class="text-white font-bold mb-3">🎯 Your Personalized Program Includes:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>✓ ${this.userData.fitness_profile?.experience_level || 'Advanced'} level techniques</div>
            <div>✓ ${this.userData.fitness_profile?.workout_duration || '60+'} minute sessions</div>
            <div>✓ ${this.userData.fitness_profile?.primary_goal?.replace('_', ' ') || 'Strength & Power'} focused</div>
            <div>✓ ${this.userData.fitness_profile?.workout_environment?.replace('_', ' ') || 'Full gym access'}</div>
            <div>✓ Supersets & Drop Sets (Advanced users)</div>
            <div>✓ Military-inspired functional movements</div>
          </div>
        </div>
      </div>
      
      <div class="bg-charcoal rounded-lg p-6 mb-8">
        <h4 class="text-xl font-bold text-white mb-4">📋 What's Next?</h4>
        <ul class="space-y-3 text-gray-300">
          <li><i class="fas fa-envelope text-green-500 mr-3"></i><strong>Check your email</strong> - Day 1 workout is waiting for you</li>
          <li><i class="fas fa-clock text-blue-500 mr-3"></i><strong>Daily delivery at 6 AM</strong> - New workouts arrive automatically</li>
          <li><i class="fas fa-phone text-burnt-orange mr-3"></i><strong>Personal check-in</strong> - Kyle will reach out after Day 3</li>
          <li><i class="fas fa-users text-purple-500 mr-3"></i><strong>Community access</strong> - Join our private veteran fitness group</li>
        </ul>
      </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-6 mb-8">
        <h4 class="text-xl font-bold text-white mb-3"><i class="fas fa-gift text-green-400 mr-2"></i>Your AI-Powered 14-Day Program Includes:</h4>
        <ul class="text-gray-300 space-y-2">
          <li><i class="fas fa-check text-green-400 mr-2"></i>10 personalized workout plans (based on YOUR assessment)</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>4 strategic rest days with recovery activities</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>Automated daily email delivery (6 AM sharp!)</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>Progressive difficulty based on your experience level</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>Equipment-specific exercises (no wasted time)</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>Injury-safe modifications and alternatives</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>Military-grade nutrition guidance</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>Personal check-in from Kyle after Day 3</li>
          <li><i class="fas fa-check text-green-400 mr-2"></i>Private military fitness community access</li>
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
  
  setupCheckboxes() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const option = checkbox.closest('label').querySelector('.checkbox-option');
        if (checkbox.checked) {
          option.classList.add('selected', 'border-burnt-orange');
          option.classList.remove('border-gray-600');
        } else {
          option.classList.remove('selected', 'border-burnt-orange');
          option.classList.add('border-gray-600');
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

  // Handle program claim button - close modal and show next steps
  claimProgram() {
    console.log('Claiming program - closing modal and showing next steps');
    
    // Close the modal
    document.getElementById('program-modal').classList.add('hidden');
    
    // Show a success message or redirect to next step
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-600 text-white p-6 rounded-lg shadow-lg z-50 max-w-md';
    successMessage.innerHTML = `
      <div class="flex items-start">
        <i class="fas fa-check-circle text-2xl mr-3 mt-1"></i>
        <div>
          <h4 class="font-bold mb-2">Program Claimed Successfully! 🎉</h4>
          <p class="text-sm mb-3">Your personalized 14-day program has been activated and will be delivered to your email daily at 6 AM.</p>
          <p class="text-xs">Check your email for Day 1 workout - it should arrive within the next few minutes!</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Remove success message after 8 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 8000);
  }
}

// Initialize the assessment when DOM is ready
let assessment;
document.addEventListener('DOMContentLoaded', () => {
  assessment = new FitnessAssessment();
});