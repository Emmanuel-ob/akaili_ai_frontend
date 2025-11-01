import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useConversationStore = defineStore('conversation', {
    state: () => ({
        conversations: [],
        loading: false,
        embedCode: '',
        widgetToken: '',
        testMode: 'default', // 'default', 'authenticated', 'anonymous'
        testCustomerData: {
            email: '',
            name: '',
            id: ''
        }
    }),

    actions: {
        async fetchConversations(filters = {}) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.loading = true
            try {
                const params = new URLSearchParams(filters)
                const data = await $fetch(`${config.public.apiBase}/api/conversation?${params}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                this.conversations = data.conversations.data || []
                return data
            } catch (error) {
                throw error.data || error
            } finally {
                this.loading = false
            }
        },

        async sendMessage(chatbotId, message, sessionId = null) {
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            try {
                const payload = {
                    chatbot_id: chatbotId,
                    message: message,
                    session_id: sessionId
                }

                // Add test mode if not default
                if (this.testMode !== 'default') {
                    payload.test_mode = this.testMode

                    if (this.testMode === 'authenticated' && this.testCustomerData.email) {
                        payload.test_customer_data = this.testCustomerData
                    }
                }

                const response = await $fetch(`${config.public.apiBase}/api/chat`, {
                    method: 'POST',
                    body: payload,
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                return response
            } catch (error) {
                throw error.data || error
            }
        }
    },

    getters: {
        testConversations: (state) => {
            return state.conversations.filter(conv => conv.source === 'test')
        },
        widgetConversations: (state) => {
            return state.conversations.filter(conv => conv.source === 'widget')
        }
    }
})
