// stores/onboarding.js
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useOnboardingStore = defineStore('onboarding', {
    state: () => ({
        completed: false,
        currentStep: 'business_setup',
        requiredSteps: {
            business_setup: {
                completed: false,
                route: '/api/businesses',
                method: 'POST'
            },
            chatbot_creation: {
                completed: false,
                route: '/api/chatbots',
                method: 'POST'
            }
        },
        optionalSteps: {
            database_connection: {
                completed: false
            }
        },
        loading: false
    }),

    actions: {
        async getStatus() {
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            try {
                const response = await $fetch(`${config.public.apiBase}/api/onboarding`, {
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                const data = response.data

                // Update state from API response
                this.completed = data.completed || false
                this.currentStep = data.current_step || 'business_setup'

                if (data.required_steps) {
                    this.requiredSteps = data.required_steps
                }

                if (data.optional_steps) {
                    this.optionalSteps = data.optional_steps
                }

                return data
            } catch (error) {
                console.error('Failed to get onboarding status:', error)
                throw error
            }
        },

        async setupCompany(companyData) {
            // Use BusinessStore instead
            const businessStore = useBusinessStore()

            this.loading = true
            try {
                const result = await businessStore.createBusiness(companyData)

                if (result.success) {
                    await this.getStatus()
                }

                return result
            } catch (error) {
                return {
                    success: false,
                    message: error.message || 'Setup failed'
                }
            } finally {
                this.loading = false
            }
        },

        async createChatbot(chatbotData) {
            // Use ChatbotStore instead
            const chatbotStore = useChatbotStore()

            this.loading = true
            try {
                const result = await chatbotStore.createChatbot(chatbotData)

                if (result.success) {
                    await this.getStatus()
                }

                return result
            } catch (error) {
                return {
                    success: false,
                    message: error.message || 'Chatbot creation failed'
                }
            } finally {
                this.loading = false
            }
        },

        async completeOnboarding() {
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/onboarding/complete`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                this.completed = true

                // Update user in auth store
                authStore.user.onboarding_completed = true

                return { success: true, data }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to complete onboarding'
                }
            }
        }
    }
})