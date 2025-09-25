<!-- pages/auth/social-callback.vue -->
<template>
  <div class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"/>
      <p class="mt-4 text-gray-600">Completing authentication...</p>
    </div>
  </div>
</template>

<script setup>
// This page handles the social auth callback
onMounted(async () => {
  const route = useRoute()
  
  // Check if we have auth data in the URL or handle the callback
  if (route.query.token && route.query.user) {
    // Send data to parent window (popup opener)
    if (window.opener) {
      window.opener.postMessage({
        type: 'social-auth-success',
        token: route.query.token,
        user: JSON.parse(decodeURIComponent(route.query.user)),
        verified: route.query.verified === 'true'
      }, window.location.origin)
      window.close()
    } else {
      // Not in popup, redirect normally
      const authStore = useAuthStore()
      const user = JSON.parse(decodeURIComponent(route.query.user))
     await  authStore.setAuth(route.query.token, user)
      
      // If this is email verification, go to onboarding
      if (route.query.verified === 'true') {
        navigateTo('/dashboard/onboarding')
      } else {
        // For social auth, check if user needs onboarding
        if (!user.business_id) {
          navigateTo('/dashboard/onboarding')
        } else {
          navigateTo('/dashboard')
        }
      }
    }
  } else if (route.query.error) {
    if (window.opener) {
      window.opener.postMessage({
        type: 'social-auth-error',
        message: route.query.error
      }, window.location.origin)
      window.close()
    } else {
      navigateTo('/login?error=' + encodeURIComponent(route.query.error))
    }
  } else {
    // No valid callback data
    if (window.opener) {
      window.opener.postMessage({
        type: 'social-auth-error',
        message: 'Authentication failed'
      }, window.location.origin)
      window.close()
    } else {
      navigateTo('/login?error=auth_failed')
    }
  }
})
</script>