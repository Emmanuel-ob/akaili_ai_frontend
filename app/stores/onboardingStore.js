// stores/onboarding.js
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useOnboardingStore = defineStore('onboarding', {
    state: () => ({
        status: {
            company_setup: false,
            chatbot_created: false,
            data_connected: false,
            deployed: false
        },
        currentStep: 'company_setup',
        loading: false
    }),

    actions: {
        async getStatus() {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/onboarding/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                this.status = data.status
                this.currentStep = data.current_step
                return data
            } catch (error) {
                throw error.data || error
            }
        },

        async setupCompany(companyData) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.loading = true
            try {
                const data = await $fetch(`${config.public.apiBase}/api/onboarding/company-setup`, {
                    method: 'POST',
                    body: companyData,
                    headers: { Authorization: `Bearer ${token}` }
                })

                // Refresh status after successful setup
                await this.getStatus()
                return { success: true, data }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Setup failed' }
            } finally {
                this.loading = false
            }
        },

        async createChatbot(chatbotData) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.loading = true
            try {
                const data = await $fetch(`${config.public.apiBase}/api/onboarding/create-chatbot`, {
                    method: 'POST',
                    body: chatbotData,
                    headers: { Authorization: `Bearer ${token}` }
                })

                // Refresh status after successful creation
                await this.getStatus()
                return { success: true, data }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Chatbot creation failed' }
            } finally {
                this.loading = false
            }
        }
    }
})