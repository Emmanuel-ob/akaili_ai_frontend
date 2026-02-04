<!-- app.vue -->
<template>
  <div>
    <NuxtLoadingIndicator color="#9E4CFF" :height="3" :duration="2000" :throttle="0" /> 
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- ✅ Global Upgrade Modal - Shown automatically on subscription errors -->
    <GlobalUpgradeModal
      :show="$subscriptionInterceptor.showUpgradeModal.value"
      :context="$subscriptionInterceptor.upgradeContext.value"
      @close="$subscriptionInterceptor.closeUpgradeModal"
      @upgrade="$subscriptionInterceptor.navigateToUpgrade"
    />
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import GlobalUpgradeModal from '~/components/subscriptions/GlobalUpgradeModal.vue'

const authStore = useAuthStore()
const wsStore = useWebSocketStore()
const subscriptionStore = useSubscriptionStore()

// Log when app mounts
onMounted(async () => {
  console.log('[APP.VUE] App mounted')
  console.log('[APP.VUE] Auth state:', {
    token: !!authStore.token,
    user: !!authStore.user,
    isAuthenticated: authStore.isLoggedIn,
    businessId: authStore.currentBusinessId
  })

  // Initialize WebSocket if authenticated
  if (authStore.isLoggedIn && authStore.user) {
    console.log('[APP.VUE] User authenticated, initializing WebSocket...')
    wsStore.initialize()

    // ✅ Fetch subscription on app mount
    await subscriptionStore.fetchSubscription()
  }
})

// Watch for authentication changes
watch(
  () => authStore.isLoggedIn,
  async (isLoggedIn) => {
    console.log('[APP.VUE] Auth state changed:', isLoggedIn)

    if (isLoggedIn && authStore.user) {
      console.log('[APP.VUE] User logged in, initializing WebSocket...')
      wsStore.initialize()

      // ✅ Fetch subscription on login
      await subscriptionStore.fetchSubscription()
    } else {
      console.log('[APP.VUE] User logged out, disconnecting WebSocket...')
      wsStore.disconnect()

      // ✅ Clear subscription on logout
      subscriptionStore.clearStore()
    }
  }
)

// Watch for business changes
watch(
  () => authStore.currentBusinessId,
  async (newBusinessId, oldBusinessId) => {
    if (newBusinessId && oldBusinessId && newBusinessId !== oldBusinessId) {
      console.log('[APP.VUE] Business switched:', { from: oldBusinessId, to: newBusinessId })
      console.log('[APP.VUE] Reconnecting WebSocket...')
      wsStore.reconnect()

      // ✅ Refresh subscription for new business
      await subscriptionStore.fetchSubscription()
    }
  }
)
</script>

<style>
/* Global Page & Layout Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.5rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s ease-out;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(0.5rem);
}
</style>