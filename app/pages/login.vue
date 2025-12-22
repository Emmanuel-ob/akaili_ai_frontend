<template>
  <div class="min-h-screen pt-[30vh] sm:pt-[40vh] lg:pt-[6rem] bg-white flex items-center justify-center p-6">
    <main class="max-w-md w-full">
      <!-- Logo -->
      <header class="text-center mb-8">
        <NuxtLink
          class="flex items-center justify-center mb-4 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg"
          to="/" aria-label="Go to homepage">
          <AppLogo size="md" center />
        </NuxtLink>
        <h1 class="text-2xl font-semibold text-gray-800 mb-2">Welcome back</h1>
        <p class="text-gray-600">Sign in to your account</p>
      </header>

      <!-- Social Login -->
      <SocialAuthButtons class="mb-6" @social-auth="handleSocialAuth" />

      <!-- Divider -->
      <AuthDivider class="mb-6" />

      <!-- Login Form -->
      <form class="space-y-4" @submit.prevent="handleLogin" aria-label="Login form">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input id="email" v-model="form.email" type="email" required autocomplete="email"
            class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your email" aria-required="true">
        </div>

        <div>
  <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>

  <div class="relative">
    <input
      v-model="form.password"
      :type="showPassword ? 'text' : 'password'"
      required
      minlength="8"
      class="w-full px-3 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      placeholder="Create a password (min. 8 characters)"
    />

    <!-- Toggle Icon -->
    <button
      type="button"
      @click="showPassword = !showPassword"
      class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
    >
      <Eye v-if="!showPassword" class="w-5 h-5" />
      <EyeOff v-else class="w-5 h-5" />
    </button>
  </div>
</div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember" type="checkbox"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded">
            <label for="remember" class="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <NuxtLink to="/forgot-password"
            class="text-sm font-medium text-[#9E4CFF] hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded">
            Forgot password?
          </NuxtLink>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-[#9E4CFF] text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :aria-busy="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <!-- Success Message -->
      <div v-if="success" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm"
        role="alert" aria-live="polite">
        {{ success }}
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm" role="alert"
        aria-live="assertive">
        {{ error }}
        <div v-if="verificationExpired && expiredEmail" class="mt-2">
          <button @click="resendVerification" :disabled="resendLoading"
            class="text-sm font-medium text-red-700 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded">
            {{ resendLoading ? 'Sending...' : 'Resend verification email' }}
          </button>
        </div>
      </div>

      <!-- Sign Up Link -->
      <p class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?
        <NuxtLink to="/register"
          class="font-medium text-[#9E4CFF] hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded">
          Sign up
        </NuxtLink>
      </p>
    </main>
  </div>
</template>

<script setup>
import { Eye, EyeOff } from "lucide-vue-next";
definePageMeta({
  layout: 'empty',
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

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  verificationExpired.value = false

  try {
    const response = await authStore.login(form.value)

    const user = authStore.user

    if (!user) {
      throw new Error('User data not found after login')
    }

    console.log('Login successful:', user)

    // Determine where to redirect based on user state
    if (!user.onboarding_completed) {
      router.push('/dashboard/onboarding')
    } else if (!user.current_business_id) {
      router.push('/select-business')
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = err.message || 'Login failed'

    // Check if verification is needed
    if (err.needs_verification) {
      verificationExpired.value = true
      expiredEmail.value = form.value.email
    }
  } finally {
    loading.value = false
  }
}

const handleSocialAuth = async (provider) => {
  error.value = ''
  success.value = ''

  try {
    const result = await authStore.socialAuth(provider)

    const user = authStore.user

    if (!user) {
      throw new Error('User data not found after social auth')
    }

    console.log('Social auth successful:', user)

    // Redirect based on user state
    if (!user.onboarding_completed) {
      router.push('/dashboard/onboarding')
    } else if (!user.current_business_id) {
      router.push('/select-business')
    } else {
      router.push('/dashboard')
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

// Check for URL parameters (email verification, etc.)
onMounted(() => {
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