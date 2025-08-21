<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Skip Option Header -->
    <div class="absolute top-4 right-4">
      <button 
      class="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
        @click="goToDashboard"
      >
        Skip Setup
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"/>
        <p class="text-gray-400">Loading...</p>
      </div>
    </div>

    <!-- Company Setup Step -->
    <div v-else-if="currentStep === 'company_setup'" class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-center mb-8">
        <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
          <span class="text-white font-bold text-sm">A</span>
        </div>
        <h1 class="text-xl font-semibold text-purple-400">Company Setup</h1>
      </div>

      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold mb-2">Tell us about your company</h2>
        <p class="text-gray-400">We'll personalize your experience based on your business</p>
      </div>

      <!-- Progress Steps -->
      <OnboardingProgress :current="1" />

      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <!-- Company Information -->
        <div class="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Company Information</h3>
          <p class="text-gray-400 text-sm mb-6">Basic details about your organization</p>
          
          <div class="space-y-4">
            <div>
             
             <FormInput
  v-model="companyForm.company_name"
  label="Company Name"
  placeholder="Enter your company name"
  variant="dark"
  required
/>
            </div>
            
            <div>
              
              <FormSelect
  v-model="companyForm.industry"
  label="Industry"
  placeholder="Select your industry"
  variant="dark"
  :options="industryOptions"
  required
/>
              
            </div>
          </div>
        </div>

        <!-- Plan Selection -->
        <div class="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Choose Your Plan</h3>
          <p class="text-gray-400 text-sm mb-6">Start with our free plan and upgrade anytime</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
              <input 
                v-model="companyForm.plan" 
                type="radio" 
                value="free" 
                class="text-purple-600"
              >
              <div class="ml-3">
                <div class="font-medium">Free Plan</div>
                <div class="text-sm text-gray-400">Perfect for getting started</div>
              </div>
            </label>
            
            <label class="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
              <input 
                v-model="companyForm.plan" 
                type="radio" 
                value="starter" 
                class="text-purple-600"
              >
              <div class="ml-3">
                <div class="font-medium">Starter Plan</div>
                <div class="text-sm text-gray-400">For growing businesses</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="max-w-md mx-auto mt-6">
        <div class="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>
      </div>

      <div class="flex justify-center mt-8">
        <button 
        class="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :disabled="isSubmitting || !companyForm.company_name || !companyForm.industry"
          @click="handleCompanySetup" 
        >
          {{ isSubmitting ? 'Setting up...' : 'Continue' }}
        </button>
      </div>
    </div>

    <!-- Create Chatbot Step -->
    <div v-else-if="currentStep === 'create_chatbot'" class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-center mb-8">
        <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
          <span class="text-white font-bold text-sm">A</span>
        </div>
        <h1 class="text-xl font-semibold text-purple-400">Create Your Chatbot</h1>
      </div>

      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold mb-2">Set up your AI assistant</h2>
        <p class="text-gray-400">Configure your chatbot's personality and purpose</p>
      </div>

      <OnboardingProgress :current="2" />

      <div class="max-w-4xl mx-auto mt-12">
        <div class="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Chatbot Configuration</h3>
          <p class="text-gray-400 text-sm mb-6">Give your AI assistant an identity</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
             
              <FormInput
    v-model="chatbotForm.name"
    label="Chatbot Name"
    placeholder="e.g., Support Assistant"
    variant="dark"
    required
  />
            </div>
            
            <div>
              
              <FormSelect
    v-model="chatbotForm.type"
    label="Chatbot Type"
    variant="dark"
    :options="chatbotTypeOptions"
  />
            </div>
          </div>
          
          <div class="mt-4">
            <label class="block text-sm font-medium mb-2">Description</label>
            <textarea 
              v-model="chatbotForm.description" 
              class="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
              placeholder="Describe what your chatbot will help with..."
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-6">
          <div class="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>
        </div>

        <div class="flex justify-between mt-8">
          <button 
          class="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            @click="goToDashboard" 
          >
            Skip for Now
          </button>
          <button 
          class="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="isSubmitting || !chatbotForm.name"
            @click="handleChatbotCreation" 
          >
            {{ isSubmitting ? 'Creating...' : 'Create Chatbot' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Completion Step -->
    <div v-else-if="currentStep === 'completed'" class="container mx-auto px-4 py-8">
      <div class="text-center">
        <OnboardingProgress :current="3" />
        
        <div class="mt-12 max-w-2xl mx-auto">
          <div class="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          
          <h1 class="text-3xl font-bold mb-4">Welcome to Akili AI!</h1>
          <p class="text-gray-400 text-lg mb-8">
            Your account is set up and ready to go. Let's start building your intelligent chatbot.
          </p>
          
          <button 
          class="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-lg"
            @click="goToDashboard"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>


// Redirect if not authenticated
const authStore = useAuthStore()
const router = useRouter()

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Retail' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'other', label: 'Other' }
]


const chatbotTypeOptions = [
  { value: 'general', label: 'General Assistant' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'sales', label: 'Sales Support' },
  { value: 'support', label: 'Technical Support' }
]

onMounted(() => {
  authStore.initializeAuth()
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
})

const onboardingStore = useOnboardingStore()

const currentStep = computed(() => onboardingStore.currentStep)
console.log(currentStep.value)
const loading = ref(true)
const isSubmitting = ref(false)
const error = ref('')

const companyForm = reactive({
  company_name: '',
  industry: '',
  plan: 'free'
})

const chatbotForm = reactive({
  name: '',
  description: '',
  type: 'general'
})

const handleCompanySetup = async () => {
  if (!companyForm.company_name || !companyForm.industry) {
    error.value = 'Please fill in all required fields'
    return
  }

  isSubmitting.value = true
  error.value = ''
  
  const result = await onboardingStore.setupCompany(companyForm)
  isSubmitting.value = false
  
  if (!result.success) {
    error.value = result.message || 'Setup failed. Please try again.'
  }
}

const handleChatbotCreation = async () => {
  if (!chatbotForm.name) {
    error.value = 'Please enter a chatbot name'
    return
  }

  isSubmitting.value = true
  error.value = ''
  
  const result = await onboardingStore.createChatbot(chatbotForm)
  isSubmitting.value = false
  
  if (!result.success) {
    error.value = result.message || 'Chatbot creation failed. Please try again.'
  }
}

const goToDashboard = async () => {
  await navigateTo('/dashboard')
}

// Initialize onboarding status
onMounted(async () => {
  try {
    await onboardingStore.getStatus()
  } catch (err) {
    console.error('Failed to get onboarding status:', err)
    // If there's an error, redirect to login
    router.push('/login')
  } finally {
    loading.value = false
  }
})
</script>

<!-- <style scoped>
/* Custom radio button styling */
input[type="radio"] {
  @apply w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 focus:ring-purple-500 focus:ring-2;
}
</style> -->