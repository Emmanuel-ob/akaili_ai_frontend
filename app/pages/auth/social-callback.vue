<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        aria-label="Loading"></div>
      <p class="text-gray-600" role="status" aria-live="polite">{{ statusMessage }}</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'empty',
  middleware: []
})

const route = useRoute()
const authStore = useAuthStore()
const statusMessage = ref('Processing authentication...')

onMounted(async () => {
  try {
    const token = route.query.token
    const userParam = route.query.user
    const verified = route.query.verified === 'true'

    if (!token || !userParam) {
      statusMessage.value = 'Invalid authentication data'

      if (window.opener) {
        window.opener.postMessage({
          type: 'social-auth-error',
          message: 'Invalid authentication data'
        }, window.location.origin)
        window.close()
      } else {
        setTimeout(() => {
          navigateTo('/login?error=' + encodeURIComponent('Invalid authentication data'))
        }, 2000)
      }
      return
    }

    // Parse user data
    let user
    try {
      user = JSON.parse(decodeURIComponent(userParam))
    } catch (parseError) {
      console.error('Failed to parse user data:', parseError)
      throw new Error('Invalid user data format')
    }

    if (!user || !user.id || !user.email) {
      throw new Error('Incomplete user data')
    }

    statusMessage.value = 'Setting up your account...'

    // Set auth in store
    authStore.setAuth(token, user)

    if (!authStore.isLoggedIn || !authStore.user) {
      throw new Error('Failed to set authentication')
    }

    statusMessage.value = 'Redirecting...'

    // If in popup, send success message to opener
    if (window.opener) {
      window.opener.postMessage({
        type: 'social-auth-success',
        token: token,
        user: user,
        verified: verified
      }, window.location.origin)

      setTimeout(() => {
        window.close()
      }, 500)
    } else {
      // UPDATED: If not in popup, check localStorage for plan
      await nextTick()

      const pendingPlan = localStorage.getItem('pendingPlan')

      if (pendingPlan) {
        if (!user.onboarding_completed) {
          // Keep in localStorage for after onboarding
          navigateTo('/dashboard/onboarding')
        } else if (!user.current_business_id) {
          // Keep in localStorage for after business selection
          navigateTo('/select-business')
        } else {
          // Clear and go to checkout
          localStorage.removeItem('pendingPlan')
          navigateTo({ path: '/checkout', query: { plan: pendingPlan } })
        }
      } else {
        // Normal flow without pending plan
        if (!user.onboarding_completed) {
          navigateTo('/dashboard/onboarding')
        } else if (!user.current_business_id) {
          navigateTo('/select-business')
        } else {
          navigateTo('/dashboard')
        }
      }
    }
  } catch (error) {
    console.error('Social auth callback error:', error)
    statusMessage.value = 'Authentication failed'

    if (window.opener) {
      window.opener.postMessage({
        type: 'social-auth-error',
        message: error.message || 'Authentication failed'
      }, window.location.origin)

      setTimeout(() => {
        window.close()
      }, 2000)
    } else {
      setTimeout(() => {
        navigateTo('/login?error=' + encodeURIComponent(error.message || 'Authentication failed'))
      }, 2000)
    }
  }
})
</script>