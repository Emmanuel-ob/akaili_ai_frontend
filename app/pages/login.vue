<template>
  
  <div class="min-h-screen pt-25 md:pt-30 pb-12 bg-white dark:bg-slate-950 flex items-start justify-center p-6 transition-colors duration-300">
    <main class="max-w-md w-full">

      <header class="text-center mb-8">
        <NuxtLink
          class="inline-flex items-center justify-center mb-6 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg"
          to="/" aria-label="Go to homepage">

          <AppLogo class="h-32 md:h-44 w-auto transition-all duration-300" size="md" center />
        </NuxtLink>

        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors">Welcome back</h1>
        <p class="text-gray-600 dark:text-gray-400 transition-colors">Sign in to your account</p>
      </header>

      <!-- Social Login -->
      <SocialAuthButtons class="mb-6" @social-auth="handleSocialAuth" />

      <!-- Divider -->
      <AuthDivider class="mb-6" />

      <!-- Login Form -->
      <form class="space-y-4" @submit.prevent="handleLogin" aria-label="Login form">
        <div>
          <label for="email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Email</label>
          <input id="email" v-model="form.email" type="email" required autocomplete="email" class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors
            bg-white border-gray-300 text-gray-900 placeholder-gray-400
            dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-gray-500"
            placeholder="Enter your email" aria-required="true">
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Password</label>

          <div class="relative">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required minlength="8" class="w-full px-3 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors
              bg-white border-gray-300 text-gray-900 placeholder-gray-400
              dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-gray-500"
              placeholder="Enter your password" />

            <button type="button" @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember" type="checkbox"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded">
            <label for="remember" class="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors">
              Remember me
            </label>
          </div>
          <NuxtLink to="/forgot-password"
            class="text-sm font-medium text-[#9E4CFF] hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded transition-colors">
            Forgot password?
          </NuxtLink>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-[#9E4CFF] text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :aria-busy="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <!-- Messages -->
      <div v-if="success" class="mt-4 p-3 rounded-lg text-sm border transition-colors
        bg-green-50 border-green-200 text-green-600
        dark:bg-green-900/20 dark:border-green-800 dark:text-green-400" role="alert" aria-live="polite">
        {{ success }}
      </div>

      <div v-if="error" class="mt-4 p-3 rounded-lg text-sm border transition-colors
        bg-red-50 border-red-200 text-red-600
        dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" role="alert" aria-live="assertive">
        {{ error }}
        <div v-if="verificationExpired && expiredEmail" class="mt-2">
          <button @click="resendVerification" :disabled="resendLoading" class="text-sm font-medium underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded
            text-red-700 hover:text-red-800
            dark:text-red-400 dark:hover:text-red-300">
            {{ resendLoading ? 'Sending...' : 'Resend verification email' }}
          </button>
        </div>
      </div>

      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
        Don't have an account?
        <NuxtLink :to="planLink"
          class="font-medium text-[#9E4CFF] hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded transition-colors">
          Sign up
        </NuxtLink>
      </p>
    </main>
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
const route = useRoute()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const verificationExpired = ref(false)
const expiredEmail = ref('')
const resendLoading = ref(false)
const showPassword = ref(false)

// UPDATED: Include plan in sign up link if present
const planLink = computed(() => {
  const plan = route.query.plan || localStorage.getItem('pendingPlan')
  return plan ? `/register?plan=${plan}` : '/register'
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  verificationExpired.value = false

  try {
    const response = await authStore.login(form.value)

    if (!response.success) {
      throw response
    }

    const user = authStore.user

    if (!user) {
      throw new Error('User data not found after login')
    }

    // UPDATED: Check URL first, then localStorage
    const pendingPlan = route.query.plan || localStorage.getItem('pendingPlan')

    if (pendingPlan) {
      if (!user.onboarding_completed) {
        // Keep in localStorage for after onboarding
        router.push('/dashboard/onboarding')
      } else if (!user.current_business_id) {
        // Keep in localStorage for after business selection
        router.push('/select-business')
      } else {
        // Clear and go to checkout
        localStorage.removeItem('pendingPlan')
        router.push({ path: '/checkout', query: { plan: pendingPlan } })
      }
    } else {
      // Normal login flow
      if (!user.onboarding_completed) {
        router.push('/dashboard/onboarding')
      } else if (!user.current_business_id) {
        router.push('/select-business')
      } else {
        router.push('/dashboard')
      }
    }
  } catch (err) {
    error.value = err.error || err.message || 'Login failed'

    if (err.needs_verification) {
      verificationExpired.value = true
      expiredEmail.value = err.email || form.value.email
    }
  } finally {
    loading.value = false
  }
}

const handleSocialAuth = async (provider) => {
  error.value = ''
  success.value = ''

  try {
    // UPDATED: Store plan in localStorage before social auth
    const planFromUrl = route.query.plan
    if (planFromUrl) {
      localStorage.setItem('pendingPlan', planFromUrl)
    }

    const result = await authStore.socialAuth(provider)
    const user = authStore.user

    // Check for pending plan from URL or localStorage
    const pendingPlan = route.query.plan || localStorage.getItem('pendingPlan')

    if (pendingPlan) {
      if (!user.onboarding_completed) {
        // Keep in localStorage for after onboarding
        router.push('/dashboard/onboarding')
      } else if (!user.current_business_id) {
        // Keep in localStorage for after business selection
        router.push('/select-business')
      } else {
        // Clear and go to checkout
        localStorage.removeItem('pendingPlan')
        router.push({ path: '/checkout', query: { plan: pendingPlan } })
      }
    } else {
      if (!user.onboarding_completed) {
        router.push('/dashboard/onboarding')
      } else if (!user.current_business_id) {
        router.push('/select-business')
      } else {
        router.push('/dashboard')
      }
    }
  } catch (err) {
    error.value = err.message || 'Social login failed'
  }
}

const resendVerification = async () => {
  resendLoading.value = true
  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBase}/api/auth/resend-verification`, {
      method: 'POST',
      body: { email: expiredEmail.value }
    })
    success.value = 'Verification email sent! Please check your inbox.'
    error.value = ''
    verificationExpired.value = false
  } catch (err) {
    error.value = err.data?.message || 'Failed to resend verification'
  } finally {
    resendLoading.value = false
  }
}

// UPDATED: Store plan in localStorage on mount if present in URL
onMounted(() => {
  if (route.query.plan) {
    localStorage.setItem('pendingPlan', route.query.plan)
  }

  // Handle registration success
  if (route.query.registered === 'true') {
    const email = route.query.email
    if (email) {
      success.value = `Registration successful! We've sent a verification email to ${email}. Please check your inbox and verify your email before logging in.`
      form.value.email = email
    }
  }

  if (route.query.success) {
    success.value = decodeURIComponent(route.query.success)
  }

  if (route.query.error) {
    error.value = decodeURIComponent(route.query.error)
    if (route.query.expired === 'true' && route.query.email) {
      verificationExpired.value = true
      expiredEmail.value = decodeURIComponent(route.query.email)
    }
  }
})
</script>