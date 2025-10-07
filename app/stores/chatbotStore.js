import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useChatbotStore = defineStore('chatbot', {
    state: () => ({
        chatbots: [],
        currentChatbot: null,
        loading: false,
        saving: false
    }),

    actions: {
        async fetchChatbots() {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.loading = true
            try {
                const data = await $fetch(`${config.public.apiBase}/api/chatbots`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                this.chatbots = data.chatbots || []
                return data
            } catch (error) {
                throw error.data || error
            } finally {
                this.loading = false
            }
        },

        async createChatbot(chatbotData) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.saving = true
            try {
                const data = await $fetch(`${config.public.apiBase}/api/chatbots`, {
                    method: 'POST',
                    body: chatbotData,
                    headers: { Authorization: `Bearer ${token}` }
                })

                await this.fetchChatbots()
                return { success: true, data }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to create chatbot' }
            } finally {
                this.saving = false
            }
        },

        async updateChatbot(chatbotId, chatbotData) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.saving = true
            try {
                const data = await $fetch(`${config.public.apiBase}/api/chatbots/${chatbotId}`, {
                    method: 'PUT',
                    body: chatbotData,
                    headers: { Authorization: `Bearer ${token}` }
                })

                await this.fetchChatbots()
                return { success: true, data }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to update chatbot' }
            } finally {
                this.saving = false
            }
        },

        async deleteChatbot(chatbotId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                await $fetch(`${config.public.apiBase}/api/chatbots/${chatbotId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                })

                await this.fetchChatbots()
                return { success: true }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to delete chatbot' }
            }
        },

        async generateEmbedCode(chatbotId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/chatbots/${chatbotId}/embed-code`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                })

                return { success: true, data }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to generate embed code' }
            }
        },

        setCurrent(chatbot) {
            this.currentChatbot = chatbot
        }
    },

    getters: {
        getChatbotById: (state) => (id) => {
            return state.chatbots.find(chatbot => chatbot._id === id)
        }
    }
})