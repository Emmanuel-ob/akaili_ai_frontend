<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'

const authStore = useAuthStore()
const wsStore = useWebSocketStore()

// Log when app mounts for debugging
onMounted(() => {
  console.log('[APP.VUE] App mounted')
  console.log('[APP.VUE] Auth state:', {
    token: !!authStore.token,
    user: !!authStore.user,
    isAuthenticated: authStore.isLoggedIn,
    businessId: authStore.currentBusinessId
  })

  // Initialize WebSocket if already authenticated (from plugin)
  if (authStore.isLoggedIn && authStore.user) {
    console.log('[APP.VUE] User authenticated on mount, initializing WebSocket...')
    wsStore.initialize()
  }
})

// Watch for authentication changes (login/logout)
watch(
  () => authStore.isLoggedIn,
  (isLoggedIn) => {
    console.log('[APP.VUE] Auth state changed:', isLoggedIn)

    if (isLoggedIn && authStore.user) {
      console.log('[APP.VUE] User logged in, initializing WebSocket...')
      wsStore.initialize()
    } else {
      console.log('[APP.VUE] User logged out, disconnecting WebSocket...')
      wsStore.disconnect()
    }
  }
)

// Watch for business changes (business switch)
watch(
  () => authStore.currentBusinessId,
  (newBusinessId, oldBusinessId) => {
    if (newBusinessId && oldBusinessId && newBusinessId !== oldBusinessId) {
      console.log('[APP.VUE] Business switched:', { from: oldBusinessId, to: newBusinessId })
      console.log('[APP.VUE] Reconnecting WebSocket...')
      wsStore.reconnect()
    }
  }
)
</script>