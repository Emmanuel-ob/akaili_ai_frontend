<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 py-4 px-6" role="banner">
      <div class="max-w-4xl mx-auto flex justify-between items-center">
        <NuxtLink to="/" aria-label="Xeli AI Home">
          <NuxtImg src="/Logo.png" alt="Xeli AI Logo" width="120" height="32" loading="eager" />
        </NuxtLink>
        <button @click="handleLogout"
          class="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded px-3 py-1"
          aria-label="Logout">
          Logout
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 py-12 px-6" role="main">
      <div class="max-w-4xl mx-auto">
        <!-- Progress Indicator -->
        <div class="mb-12" role="region" aria-label="Onboarding progress">
          <OnboardingProgress :current="currentStepNumber" />
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12" role="status" aria-live="polite">
          <div class="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"
            aria-label="Loading"></div>
        </div>

        <!-- Step 1: Company Setup -->
        <div v-else-if="currentStep === 'business_setup'"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Setup Your Company</h2>

          <form @submit.prevent="handleCompanySetup" class="space-y-6">
            <FormInput v-model="companyForm.company_name" label="Company Name" placeholder="Enter your company name"
              required aria-required="true" />

            <FormInput v-model="companyForm.business_email" label="Business Email" type="email"
              placeholder="Enter business email" required aria-required="true" />

            <FormInput v-model="companyForm.business_phone" label="Business Phone" type="tel"
              placeholder="Enter phone number" required aria-required="true" />

            <FormInput v-model="companyForm.address" label="Business Address" placeholder="Enter business address"
              required aria-required="true" />

            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm" role="alert">
              {{ error }}
            </div>

            <button type="submit" :disabled="setupLoading"
              class="w-full bg-[#7F56D9] text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors">
              {{ setupLoading ? 'Setting up...' : 'Continue' }}
            </button>
          </form>
        </div>

        <!-- Step 2: Chatbot Creation -->
        <div v-else-if="currentStep === 'chatbot_creation'"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Create Your Chatbot</h2>

          <form @submit.prevent="handleChatbotCreation" class="space-y-6">
            <FormInput v-model="chatbotForm.name" label="Chatbot Name" placeholder="Enter chatbot name" required
              aria-required="true" />

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
              <textarea v-model="chatbotForm.welcome_message" rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter welcome message for your chatbot" required aria-required="true"></textarea>
            </div>

            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm" role="alert">
              {{ error }}
            </div>

            <div class="flex space-x-4">
              <button type="button" @click="goBack"
                class="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                Back
              </button>
              <button type="submit" :disabled="setupLoading"
                class="flex-1 bg-[#7F56D9] text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors">
                {{ setupLoading ? 'Creating...' : 'Complete Setup' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Completed State -->
        <div v-else-if="currentStep === 'completed'"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
          <p class="text-gray-600 mb-6">Your account is ready to use.</p>
          <button @click="finishOnboarding"
            class="bg-[#7F56D9] text-white py-3 px-8 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors">
            Go to Dashboard
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'empty',
  middleware: 'auth'
})

const authStore = useAuthStore()
const onboardingStore = useOnboardingStore()
const businessStore = useBusinessStore()
const chatbotStore = useChatbotStore()
const router = useRouter()

const loading = ref(true)
const setupLoading = ref(false)
const error = ref('')
const currentStep = ref('business_setup')

const companyForm = ref({
  company_name: '',
  business_email: '',
  business_phone: '',
  address: ''
})

const chatbotForm = ref({
  name: '',
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

// Computed
const currentStepNumber = computed(() => {
  if (currentStep.value === 'business_setup') return 1
  if (currentStep.value === 'chatbot_creation') return 2
  return 3
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleCompanySetup = async () => {
  setupLoading.value = true
  error.value = ''

  try {
    const result = await businessStore.createBusiness(companyForm.value)

    if (result.success) {
      await onboardingStore.getStatus()
      currentStep.value = 'chatbot_creation'
    } else {
      error.value = result.message || 'Failed to setup company'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred'
  } finally {
    setupLoading.value = false
  }
}

const handleChatbotCreation = async () => {
  setupLoading.value = true
  error.value = ''

  try {
    const result = await chatbotStore.createChatbot(chatbotForm.value)

    if (result.success) {
      await onboardingStore.getStatus()
      currentStep.value = 'completed'
    } else {
      error.value = result.message || 'Failed to create chatbot'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred'
  } finally {
    setupLoading.value = false
  }
}

// Rename to match template's "goBack" handler
const goBack = () => {
  if (currentStep.value === 'chatbot_creation') {
    currentStep.value = 'business_setup'
  }
}

// Single initialization lifecycle hook (async) to avoid nested onMounted calls
onMounted(async () => {
  try {
    // await authStore.initializeAuth()

    if (!authStore.isLoggedIn) {
      router.push('/login')
      return
    }

    const user = authStore.user

    // Set current step based on user's onboarding progress
    if (user && user.onboarding_step) {
      currentStep.value = user.onboarding_step
    }

    // Initialize onboarding status
    await onboardingStore.getStatus()

    // If user already has a business, skip to chatbot creation
    if (user && user.current_business_id && currentStep.value === 'business_setup') {
      currentStep.value = 'chatbot_creation'
    }
  } catch (err) {
    console.error('Failed to get onboarding status or initialize auth:', err)
    // If there's an error, redirect to login
    router.push('/login')
  } finally {
    loading.value = false
  }
})
</script>