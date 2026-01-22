<template>
  <!-- UPDATED: Increased top padding to pt-40 md:pt-52 -->
  <div class="min-h-screen  pt-25 md:pt-30 pb-12 bg-white dark:bg-slate-950 flex items-start justify-center p-6 transition-colors duration-300">
    <div class="max-w-md w-full">
      
      <!-- Logo Section -->
      <div class="text-center mb-8">
        <NuxtLink 
          class="inline-flex items-center justify-center mb-6 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg" 
          to="/"
        >
          <AppLogo class="h-32 md:h-44 w-auto transition-all duration-300" size="md" center />
        </NuxtLink>
        
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2 mt-2 transition-colors">Create your account</h2>
        <p class="text-gray-600 dark:text-gray-400 transition-colors">Start building your intelligent chatbot</p>
      </div>

      <!-- Social Login -->
      <SocialAuthButtons class="mb-6" @social-auth="handleSocialAuth" />

      <!-- Divider -->
      <AuthDivider class="mb-6" />

      <!-- Register Form -->
      <form class="space-y-4" @submit.prevent="handleRegister">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Full Name</label>
          <input v-model="form.name" type="text" required
            class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors
            bg-white border-gray-300 text-gray-900 placeholder-gray-400
            dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-gray-500"
            placeholder="Enter your full name">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Email</label>
          <input v-model="form.email" type="email" required
            class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors
            bg-white border-gray-300 text-gray-900 placeholder-gray-400
            dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-gray-500"
            placeholder="Enter your email">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Password</label>

          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="8"
              class="w-full px-3 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors
              bg-white border-gray-300 text-gray-900 placeholder-gray-400
              dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-gray-500"
              placeholder="Create a password (min. 8 characters)"
            />

            <!-- Toggle Icon -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-[#9E4CFF] text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <!-- Success/Error Messages -->
      <div v-if="success" class="mt-4 p-3 rounded-lg text-sm border transition-colors bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
        {{ success }}
      </div>

      <div v-if="error" class="mt-4 p-3 rounded-lg text-sm border transition-colors bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
        {{ error }}
      </div>

      <!-- Sign In Link -->
      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
        Already have an account?
        <NuxtLink to="/login" class="font-medium text-[#9E4CFF] hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { Eye, EyeOff } from "lucide-vue-next";

definePageMeta({
  layout: 'default',
  middleware: 'guest'
})

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)



const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await authStore.register(form.value)
    
    
    const pendingPlan = localStorage.getItem('pendingPlan')
    
    if (pendingPlan) {
      
      localStorage.removeItem('pendingPlan')
      
      
      if (pendingPlan === 'starter') {
        router.push('/dashboard/onboarding') 
      } else {
        
        router.push({ path: '/checkout', query: { plan: pendingPlan } })
      }
    } else {
        
        router.push('/dashboard/onboarding')
    }

  } catch (err) {
    error.value = err.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}

const handleSocialAuth = async (provider) => {
  try {
    await authStore.socialAuth(provider)
    const user = authStore.user

    if (!user.onboarding_completed) {
      router.push('/dashboard/onboarding')
    } else if (!user.current_business_id) {
      router.push('/select-business')
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = err.message || 'Social registration failed'
  }
}


</script>