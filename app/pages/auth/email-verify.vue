<!-- pages/auth/email-verify.vue -->
<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-6">
    <div class="max-w-md w-full text-center">
      <!-- Logo -->
  <AppLogo size="md" center class="mb-8" />

      <!-- Processing State -->
      <div v-if="processing" class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4" />
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Verifying your email...</h2>
        <p class="text-gray-600">Please wait while we confirm your email address.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="text-center">
        <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Email Verified!</h2>
        <p class="text-gray-600 mb-6">Your email has been successfully verified. You'll be redirected to complete your setup.</p>
        <div class="text-sm text-gray-500">Redirecting in {{ countdown }} seconds...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center">
        <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink 
          to="/login" 
          class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const processing = ref(true)
const success = ref(false)
const error = ref('')
const countdown = ref(3)

// Handle email verification
onMounted(async () => {
  const token = route.query.token
  const email = route.query.email

  if (!token || !email) {
    processing.value = false
    error.value = 'Invalid verification link. Please check your email for the correct link.'
    return
  }

  try {
    // Call verification API
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBase}/api/auth/verify-email`, {
      method: 'GET',
      query: { token, email }
    })

    processing.value = false
    success.value = true

    // Start countdown and redirect
    const countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownInterval)
        router.push('/onboarding')
      }
    }, 1000)

  } catch (err) {
    processing.value = false
    error.value = err.data?.message || 'Verification failed. Please try again or contact support.'
  }
})
</script>