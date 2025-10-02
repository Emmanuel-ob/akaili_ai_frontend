import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useConversationStore = defineStore('conversation', {
    state: () => ({
        conversations: [],
        loading: false,
        embedCode: '',
        widgetToken: ''
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

        async generateEmbedCode(chatbotId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/chatbots/${chatbotId}/embed-code`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (data.success) {
                    this.embedCode = data.embed_code
                    this.widgetToken = data.widget_token
                    return data
                } else {
                    throw new Error(data.message)
                }
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
