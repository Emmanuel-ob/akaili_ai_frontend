<!-- dashboard/onboarding.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 py-4 px-6 transition-colors duration-300" role="banner">
      <div class="max-w-4xl mx-auto flex justify-between items-center">
        <NuxtLink to="/" aria-label="Xeli AI Home">
          <NuxtImg src="/Logo.png" alt="Xeli AI Logo" width="120" height="32" loading="eager" />
        </NuxtLink>
        <button @click="handleLogout"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded px-3 py-1 transition-colors"
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
          class="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-8 transition-colors duration-300">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Setup Your Company</h2>

          <form @submit.prevent="handleCompanySetup" class="space-y-6">
            <!-- Company Name -->
            <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Company Name</label>
               <input v-model="companyForm.company_name" type="text" required placeholder="Enter your company name"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500"
               />
            </div>

            <!-- Business Email -->
            <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Business Email</label>
               <input v-model="companyForm.business_email" type="email" required placeholder="Enter business email"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500"
               />
            </div>

            <!-- Business Phone -->
            <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Business Phone</label>
               <input v-model="companyForm.business_phone" type="tel" required placeholder="Enter phone number"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500"
               />
            </div>

            <!-- Business Address -->
            <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Business Address</label>
               <input v-model="companyForm.address" type="text" required placeholder="Enter business address"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500"
               />
            </div>

            <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm" role="alert">
              {{ error }}
            </div>

            <button type="submit" :disabled="setupLoading"
              class="w-full bg-[#9E4CFF] text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors">
              {{ setupLoading ? 'Setting up...' : 'Continue' }}
            </button>
          </form>
        </div>

        <!-- Step 2: Chatbot Creation -->
        <div v-else-if="currentStep === 'chatbot_creation'"
          class="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-8 transition-colors duration-300">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Your Chatbot</h2>

          <form @submit.prevent="handleChatbotCreation" class="space-y-6">
            <!-- Chatbot Name -->
            <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Chatbot Name</label>
               <input v-model="chatbotForm.name" type="text" required placeholder="Enter chatbot name"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500"
               />
            </div>

            <!-- Welcome Message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Welcome Message</label>
              <textarea v-model="chatbotForm.welcome_message" rows="4"
                class="w-full rounded-lg p-3 outline-none resize-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500"
                placeholder="Enter welcome message for your chatbot" required aria-required="true"></textarea>
            </div>

            <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm" role="alert">
              {{ error }}
            </div>

            <div class="flex space-x-4">
              <button type="button" @click="goBack"
                class="flex-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors">
                Back
              </button>
              <button type="submit" :disabled="setupLoading"
                class="flex-1 bg-[#9E4CFF] text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors">
                {{ setupLoading ? 'Creating...' : 'Complete Setup' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Completed State -->
        <div v-else-if="currentStep === 'completed'"
          class="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-8 text-center transition-colors duration-300">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Setup Complete!</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Your account is ready to use.</p>
          <button @click="finishOnboarding"
            class="bg-[#9E4CFF] text-white py-3 px-8 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors">
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
      const onb = await onboardingStore.completeOnboarding();
      console.log('Onboarding completion result:', onb);
      await onboardingStore.getStatus()
      if (!onb.success) {
        error.value = onb.message || 'Failed to complete onboarding'
        setupLoading.value = false
        return
      }

      
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

const goBack = () => {
  if (currentStep.value === 'chatbot_creation') {
    currentStep.value = 'business_setup'
  }
}

const finishOnboarding = () => {
  // UPDATED: Check localStorage for pending plan
  const pendingPlan = localStorage.getItem('pendingPlan')

  if (pendingPlan) {
    // Clear it and go to checkout
    localStorage.removeItem('pendingPlan')
    router.push({ path: '/checkout', query: { plan: pendingPlan } })
  } else {
    router.push('/dashboard')
  }
}

// Single initialization lifecycle hook (async)
onMounted(async () => {
  try {
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
    router.push('/login')
  } finally {
    loading.value = false
  }
})
</script>