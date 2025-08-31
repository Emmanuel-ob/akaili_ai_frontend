<!-- pages/register.vue -->
<template>
  <div class="min-h-screen pt-[30vh] sm:pt-[40vh] lg:pt-[6rem] bg-white flex items-center justify-center p-6">
    <div class="max-w-md w-full">
      <!-- Logo -->

<div class="text-center mb-8">
  <AppLogo size="md" center />
  <h2 class="text-2xl font-semibold text-gray-800 mb-2 mt-4">Create your account</h2>
  <p class="text-gray-600">Start building your intelligent chatbot</p>
</div>
     

      <!-- Social Login -->

<SocialAuthButtons class="mb-6" @social-auth="handleSocialAuth"  />

      <!-- Divider -->

<AuthDivider class="mb-6" />

      <!-- Register Form -->
      <form class="space-y-4" @submit.prevent="handleRegister" >
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your full name"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your email"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="8"
            class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Create a password (min. 8 characters)"
          >
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <!-- Success/Error Messages -->
      <div v-if="success" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
        {{ success }}
      </div>

      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {{ error }}
      </div>

      <!-- Sign In Link -->
      <p class="mt-6 text-center text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/login" class="font-medium text-purple-600 hover:text-purple-500">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
// const onboardingStore = useOnboardingStore()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await authStore.register(form.value)
    success.value = 'Account created successfully! Please check your email to verify your account.'
    form.value = { name: '', email: '', password: '' }
  } catch (err) {
    error.value = err.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}

const handleSocialAuth = async (provider) => {
  try {
    const result = await authStore.socialAuth(provider)
    
    // If user is new (no business_id), go to onboarding
    // If user exists, go to dashboard
    if (result.isNewUser) {
      router.push('/dashboard/onboarding')
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = err.message || 'Social registration failed'
  }
}

// Check if already logged in
onMounted(() => {
  authStore.initializeAuth()
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  }
})
</script>