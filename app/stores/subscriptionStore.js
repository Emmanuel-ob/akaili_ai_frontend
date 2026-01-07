// stores/subscriptionStore.js
import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    currentPlan: {
      id: 'starter',
      name: 'Starter',
      price: '$0.00',
      status: 'active', 
      billingCycle: 'monthly',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      limits: {
        conversations: { used: 0, total: 1000 },
        chatbots: { used: 0, total: 1 }
      }
    },
    loading: false
  }),

  actions: {
    // 1. Fetch: Check LocalStorage first, otherwise use default
    async fetchSubscription() {
      this.loading = true
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      if (import.meta.client) {
        const stored = localStorage.getItem('xeli_subscription')
        if (stored) {
          this.currentPlan = JSON.parse(stored)
        }
      }
      
      this.loading = false
    },

    // 2. Upgrade: Called by Checkout Page
    async upgradeSubscription(planId) {
      this.loading = true
      
      // Define plan details (Mock Database)
      const plans = {
        starter: { 
            name: 'Starter', price: '$0.00', 
            limits: { conversations: { used: 0, total: 1000 }, chatbots: { used: 0, total: 1 } } 
        },
        professional: { 
            name: 'Professional', price: '$99.00', 
            limits: { conversations: { used: 0, total: 10000 }, chatbots: { used: 0, total: 5 } } 
        },
        enterprise: { 
            name: 'Enterprise', price: '$299.00', 
            limits: { conversations: { used: 0, total: 999999 }, chatbots: { used: 0, total: 999 } } 
        }
      }

      // Update State
      const newPlan = plans[planId] || plans.starter
      
      this.currentPlan = {
        ...this.currentPlan,
        id: planId,
        name: newPlan.name,
        price: newPlan.price,
        status: 'active',
        limits: newPlan.limits,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }

      // Save to LocalStorage (Persist the change)
      if (import.meta.client) {
        localStorage.setItem('xeli_subscription', JSON.stringify(this.currentPlan))
      }

      this.loading = false
      return true
    },

    // 3. Change Plan (From Settings)
    async changePlan(planId) {
      return this.upgradeSubscription(planId) // Reuse the upgrade logic
    },

    // 4. Cancel
    async cancelSubscription(reason) {
      this.loading = true
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      this.currentPlan.status = 'canceled'
      
      if (import.meta.client) {
        localStorage.setItem('xeli_subscription', JSON.stringify(this.currentPlan))
      }
      
      this.loading = false
      return true
    },
    
    // 5. Reactivate
    async reactivateSubscription() {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.currentPlan.status = 'active'
        
        if (import.meta.client) {
            localStorage.setItem('xeli_subscription', JSON.stringify(this.currentPlan))
        }
        
        this.loading = false
    }
  }
})