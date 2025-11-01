<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <AppLogo size="lg" center class="mb-4" />
        <h1 class="text-3xl font-bold text-gray-900">Welcome to Xeli ai</h1>
        <p class="mt-2 text-gray-600">Let's set up your account in a few simple steps</p>
      </div>

      <!-- Progress Indicator -->
      <OnboardingProgress :current="currentStepNumber" class="mb-12" />

      <!-- Step 1: Business Setup -->
      <div v-if="currentStep === 'business_setup'" class="bg-white rounded-lg shadow p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Company Information</h2>

        <form @submit.prevent="handleBusinessSubmit" class="space-y-6">
          <FormInput v-model="businessForm.company_name" label="Company Name" placeholder="Enter your company name"
            required />

          <FormInput v-model="businessForm.industry" label="Industry"
            placeholder="e.g., E-commerce, Healthcare, Finance" required />

          <FormSelect v-model="businessForm.company_size" label="Company Size" :options="companySizeOptions" />

          <FormInput v-model="businessForm.website_url" label="Website URL" type="url"
            placeholder="https://example.com" />

          <FormInput v-model="businessForm.location" label="Location" placeholder="City, Country" />

          <div class="flex justify-end space-x-4">
            <button type="submit" :disabled="businessLoading"
              class="px-6 py-3 bg-[#7F56D9] text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {{ businessLoading ? 'Saving...' : 'Continue' }}
            </button>
          </div>
        </form>

        <div v-if="businessError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {{ businessError }}
        </div>
      </div>

      <!-- Step 2: Chatbot Creation -->
      <div v-if="currentStep === 'chatbot_creation'" class="bg-white rounded-lg shadow p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Create Your Chatbot</h2>

        <form @submit.prevent="handleChatbotSubmit" class="space-y-6">
          <FormInput v-model="chatbotForm.name" label="Chatbot Name" placeholder="e.g., Customer Support Bot"
            required />

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="chatbotForm.description" rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe what your chatbot will do" />
          </div>

          <FormSelect v-model="chatbotForm.type" label="Chatbot Type" :options="chatbotTypeOptions" />

          <FormInput v-model="chatbotForm.welcome_message" label="Welcome Message"
            placeholder="Hello! How can I help you today?" />

          <div class="flex justify-between">
            <button type="button" @click="goToPreviousStep"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Back
            </button>

            <button type="submit" :disabled="chatbotLoading"
              class="px-6 py-3 bg-[#7F56D9] text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {{ chatbotLoading ? 'Creating...' : 'Complete Setup' }}
            </button>
          </div>
        </form>

        <div v-if="chatbotError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {{ chatbotError }}
        </div>
      </div>

      <!-- Success State -->
      <div v-if="onboardingComplete" class="bg-white rounded-lg shadow p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">All Set!</h2>
        <p class="text-gray-600 mb-6">Your account is ready. Redirecting to dashboard...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'empty',
  middleware: 'auth'
})

const authStore = useAuthStore()
const businessStore = useBusinessStore()
const chatbotStore = useChatbotStore()
const router = useRouter()

// State
const currentStep = ref('business_setup')
const businessLoading = ref(false)
const chatbotLoading = ref(false)
const businessError = ref('')
const chatbotError = ref('')
const onboardingComplete = ref(false)

// Forms
const businessForm = ref({
  company_name: '',
  industry: '',
  company_size: '',
  website_url: '',
  location: ''
})

const chatbotForm = ref({
  name: '',
  description: '',
  type: 'general',
  welcome_message: 'Hello! How can I help you today?'
})

// Options
const companySizeOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' }
]

const chatbotTypeOptions = [
  { value: 'general', label: 'General Purpose' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Technical Support' }
]

onMounted(() => {
  authStore.initializeAuth()
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
// Computed
const currentStepNumber = computed(() => {
  if (currentStep.value === 'business_setup') return 1
  if (currentStep.value === 'chatbot_creation') return 2
  return 3
})

// Methods
const handleBusinessSubmit = async () => {
  businessLoading.value = true
  businessError.value = ''

  try {
    const result = await businessStore.createBusiness(businessForm.value)

    if (result.success) {
      // Update user state
      authStore.user.current_business_id = result.data.business.id
      authStore.user.onboarding_step = 'chatbot_creation'

      // Move to next step
      currentStep.value = 'chatbot_creation'
    } else {
      businessError.value = result.message || 'Failed to create business'
    }
  } catch (error) {
    businessError.value = error.message || 'An error occurred'
  } finally {
    businessLoading.value = false
  }
}

const handleChatbotSubmit = async () => {
  chatbotLoading.value = true
  chatbotError.value = ''

  try {
    // Create chatbot
    const result = await chatbotStore.createChatbot(chatbotForm.value)

    if (result.success) {
      // Call the onboarding complete endpoint
      const onboardingStore = useOnboardingStore()
      const completeResult = await onboardingStore.completeOnboarding()

      if (completeResult.success) {
        // Mark onboarding as complete
        onboardingComplete.value = true

        // Update user (already updated in store, but ensure it's synced)
        authStore.user.onboarding_completed = true
        authStore.user.onboarding_step = null

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        chatbotError.value = completeResult.message || 'Failed to complete onboarding'
      }
    } else {
      chatbotError.value = result.message || 'Failed to create chatbot'
    }
  } catch (error) {
    chatbotError.value = error.message || 'An error occurred'
  } finally {
    chatbotLoading.value = false
  }
}

const goToPreviousStep = () => {
  if (currentStep.value === 'chatbot_creation') {
    currentStep.value = 'business_setup'
  }
}

// Initialize
onMounted(() => {
  const user = authStore.user

  // Set current step based on user's onboarding progress
  if (user.onboarding_step) {
    currentStep.value = user.onboarding_step
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
  // If user already has a business, skip to chatbot creation
  if (user.current_business_id && currentStep.value === 'business_setup') {
    currentStep.value = 'chatbot_creation'
  }
})
</script>