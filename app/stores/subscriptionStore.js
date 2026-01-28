// stores/subscriptionStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    currentPlan: null,
    usage: null,
    invoices: [],
    paymentMethods: [],
    loading: false,
    error: null
  }),

  getters: {
    isOnFreePlan: (state) => state.currentPlan?.plan_id === 'starter',

    isActive: (state) => state.currentPlan?.status === 'active' || state.currentPlan?.status === 'trialing',

    onTrial: (state) => state.currentPlan?.on_trial === true,

    isCanceled: (state) => state.currentPlan?.cancel_at_period_end === true,

    daysRemaining: (state) => state.currentPlan?.days_remaining || 0,

    hasActiveSubscription: (state) => {
      return state.currentPlan && (
        state.currentPlan.status === 'active' ||
        state.currentPlan.status === 'trialing'
      )
    }
  },

  actions: {
    /**
     * Fetch current subscription details
     */
    async fetchSubscription() {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      this.loading = true
      this.error = null

      try {
        const response = await $fetch(`${config.public.apiBase}/api/subscription`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })

        if (response.success) {
          this.currentPlan = response.data.subscription
          this.usage = response.data.usage
        }
      } catch (error) {
        this.error = error.data?.message || 'Failed to fetch subscription'
        console.error('Fetch subscription error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch usage statistics
     */
    async fetchUsage() {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      try {
        const response = await $fetch(`${config.public.apiBase}/api/subscription/usage`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })

        if (response.success) {
          this.usage = response.data.usage
        }
      } catch (error) {
        console.error('Fetch usage error:', error)
      }
    },

    /**
     * Change subscription plan (upgrade/downgrade)
     */
    // subscriptionStore.js - changePlan method
    async changePlan(payload) {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      this.loading = true
      this.error = null

      try {
        const response = await $fetch(`${config.public.apiBase}/api/subscription/change-plan`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authStore.token}` },
          body: payload
        })

        if (response.success) {
          await this.fetchSubscription()
          return { success: true, data: response.data }
        }
      } catch (error) {
        // Don't throw on 402 - let modal handle checkout redirect
        if (error.status === 402 || error.statusCode === 402) {
          return {
            success: false,
            requiresCheckout: true,
            data: error.data?.data || {}
          }
        }

        this.error = error.data?.message || 'Failed to change plan'
        throw error
      } finally {
        this.loading = false
      }
    },
    /**
     * Cancel subscription at period end
     */
    async cancelSubscription(reason, detailedFeedback = null) {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      this.loading = true
      this.error = null

      try {
        const response = await $fetch(`${config.public.apiBase}/api/subscription/cancel`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authStore.token}` },
          body: { reason, detailed_feedback: detailedFeedback }
        })

        if (response.success) {
          await this.fetchSubscription()
          return { success: true, data: response.data }
        }
      } catch (error) {
        this.error = error.data?.message || 'Failed to cancel subscription'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Resume canceled subscription
     */
    async resumeSubscription() {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      this.loading = true
      this.error = null

      try {
        const response = await $fetch(`${config.public.apiBase}/api/subscription/resume`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authStore.token}` }
        })

        if (response.success) {
          await this.fetchSubscription()
          return { success: true }
        }
      } catch (error) {
        this.error = error.data?.message || 'Failed to resume subscription'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch invoices
     */
    async fetchInvoices() {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      try {
        const response = await $fetch(`${config.public.apiBase}/api/billing/invoices`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })

        if (response.success) {
          this.invoices = response.data.invoices
        }
      } catch (error) {
        console.error('Fetch invoices error:', error)
      }
    },

    /**
     * Fetch payment methods
     */
    async fetchPaymentMethods() {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      try {
        const response = await $fetch(`${config.public.apiBase}/api/billing/payment-methods`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })

        if (response.success) {
          this.paymentMethods = response.data.payment_methods
        }
      } catch (error) {
        console.error('Fetch payment methods error:', error)
      }
    },

    /**
     * Get usage percentage for a limit type
     */
    getUsagePercentage(limitType) {
      if (!this.usage || !this.usage[limitType]) return 0

      const data = this.usage[limitType]
      return data.percentage || 0
    },

    /**
     * Check if limit is exceeded
     */
    isLimitExceeded(limitType) {
      if (!this.usage || !this.usage[limitType]) return false

      const data = this.usage[limitType]

      // Check for unlimited
      if (data.limit === 999999 || data.limit === -1) return false

      return data.used >= data.limit
    },

    /**
     * Get remaining quota
     */
    getRemainingQuota(limitType) {
      if (!this.usage || !this.usage[limitType]) return 0

      const data = this.usage[limitType]
      return data.remaining
    },

    /**
     * Clear store
     */
    clearStore() {
      this.currentPlan = null
      this.usage = null
      this.invoices = []
      this.paymentMethods = []
      this.loading = false
      this.error = null
    }
  }
})