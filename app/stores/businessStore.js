// stores/businessStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useBusinessStore = defineStore('business', {
    state: () => ({
        business: null,
        businesses: [],
        currentBusinessId: null,
        loading: false
    }),

    actions: {
        async fetchBusiness() {
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            this.loading = true
            try {
                const response = await $fetch(`${config.public.apiBase}/api/businesses`, {
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                this.business = response.data.business
                return { success: true, data: response.data }
            } catch (error) {
                console.error('Failed to fetch business:', error)
                return {
                    success: false,
                    message: error.data?.message || 'Failed to fetch business'
                }
            } finally {
                this.loading = false
            }
        },

        async createBusiness(businessData) {
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            this.loading = true
            try {
                const response = await $fetch(`${config.public.apiBase}/api/businesses`, {
                    method: 'POST',
                    body: businessData,
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                this.business = response.data.business

                // Update user in auth store
                authStore.user.current_business_id = response.data.business.id
                authStore.user.onboarding_step = 'chatbot_creation'

                return { success: true, data: response.data }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to create business',
                    errors: error.data?.errors
                }
            } finally {
                this.loading = false
            }
        },

        async updateBusiness(id, businessData) {
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            this.loading = true
            try {
                const response = await $fetch(`${config.public.apiBase}/api/businesses/${id}`, {
                    method: 'PUT',
                    body: businessData,
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                this.business = response.data.business
                return { success: true, data: response.data }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to update business',
                    errors: error.data?.errors
                }
            } finally {
                this.loading = false
            }
        },

        // Fetch all businesses user belongs to
        async fetchAllBusinesses() {
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            this.loading = true
            try {
                const response = await $fetch(`${config.public.apiBase}/api/businesses/list`, {
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                this.businesses = response.data.businesses
                this.currentBusinessId = response.data.current_business_id
                return { success: true, data: response.data }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to fetch businesses'
                }
            } finally {
                this.loading = false
            }
        },

        // Switch to different business
        async switchBusiness(businessId) {
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            this.loading = true
            try {
                const response = await $fetch(`${config.public.apiBase}/api/businesses/switch/${businessId}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                this.currentBusinessId = businessId

                // Update current business in state
                const selectedBusiness = this.businesses.find(b => b.id === businessId)
                if (selectedBusiness) {
                    this.business = selectedBusiness
                }

                // Update user's current business in auth store
                authStore.user.current_business_id = businessId

                return { success: true, data: response.data }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to switch business'
                }
            } finally {
                this.loading = false
            }
        },
    }
})