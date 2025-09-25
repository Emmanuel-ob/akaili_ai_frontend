<!-- page/login.vue -->
<template>
  <div class="min-h-screen pt-[30vh] sm:pt-[40vh] lg:pt-[6rem] bg-white flex items-center justify-center p-6">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">

          <AppLogo size="md" center />



        </div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Welcome back</h2>
        <p class="text-gray-600">Sign in to your account</p>
      </div>

      <!-- Social Login -->
      <SocialAuthButtons class="mb-6" @social-auth="handleSocialAuth" />
      <!-- Divider -->
      <AuthDivider class="mb-6" />

      <!-- Login Form -->
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" required
            class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your email">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="form.password" type="password" required
            class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your password">
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-[#7F56D9] text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {{ error }}
      </div>

      <!-- Sign Up Link -->
      <p class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?
        <NuxtLink to="/register" class="font-medium text-[#7F56D9] hover:text-purple-500">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>

definePageMeta({
  layout: 'empty'
})

const authStore = useAuthStore()
// const onboardingStore = useOnboardingStore()
const router = useRouter()
const route = useRoute()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await authStore.login(form.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}

const handleSocialAuth = async (provider) => {
  try {
    await authStore.socialAuth(provider)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Social login failed'
  }
}

// Check if already logged in and handle URL parameters
onMounted(() => {
  authStore.initializeAuth()

  if (authStore.isLoggedIn) {
    router.push('/dashboard')
    return
  }

  // Check for success/error messages in URL
  if (route.query.success) {
    success.value = decodeURIComponent(route.query.success)
  }

  if (route.query.error) {
    error.value = decodeURIComponent(route.query.error)
  }
})
</script>