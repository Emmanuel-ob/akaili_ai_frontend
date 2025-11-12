// stores/agentHandoverStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useAgentHandoverStore = defineStore('agentHandover', {
    state: () => ({
        pendingRequests: [],
        activeConversations: [],
        loading: false,
        selectedConversationId: null
    }),

    actions: {
        /**
         * Fetch pending handover requests
         */
        async fetchPendingRequests() {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const response = await $fetch(`${config.public.apiBase}/api/agent-handover/requests/pending`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (response.success) {
                    this.pendingRequests = response.requests || []
                }

                return response
            } catch (error) {
                console.error('Failed to fetch pending requests:', error)
                throw error
            }
        },

        /**
         * Fetch active conversations for current agent
         */
        async fetchActiveConversations() {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const response = await $fetch(`${config.public.apiBase}/api/agent-handover/conversations/active`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (response.success) {
                    this.activeConversations = response.conversations || []
                }

                return response
            } catch (error) {
                console.error('Failed to fetch active conversations:', error)
                throw error
            }
        },

        /**
         * Accept a handover request
         */
        async acceptHandover(requestId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.loading = true

            try {
                const response = await $fetch(`${config.public.apiBase}/api/agent-handover/requests/${requestId}/accept`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (response.success) {
                    // Remove from pending
                    this.pendingRequests = this.pendingRequests.filter(r => r.id !== requestId)

                    // Add to active conversations
                    if (response.conversation) {
                        this.activeConversations.unshift(response.conversation)
                        this.selectedConversationId = response.conversation.id
                    }
                }

                return response
            } catch (error) {
                console.error('Failed to accept handover:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        /**
         * Reject a handover request
         */
        async rejectHandover(requestId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const response = await $fetch(`${config.public.apiBase}/api/agent-handover/requests/${requestId}/reject`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (response.success) {
                    // Remove from pending
                    this.pendingRequests = this.pendingRequests.filter(r => r.id !== requestId)
                }

                return response
            } catch (error) {
                console.error('Failed to reject handover:', error)
                throw error
            }
        },

        /**
         * Send message as agent
         */
        async sendAgentMessage(conversationId, message) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const response = await $fetch(`${config.public.apiBase}/api/agent-handover/message`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: {
                        conversation_id: conversationId,
                        message: message
                    }
                })

                if (response.success) {
                    // Update local conversation
                    const conversation = this.activeConversations.find(c => c.id === conversationId)
                    if (conversation) {
                        conversation.messages = conversation.messages || []
                        conversation.messages.push(response.message)
                        conversation.last_activity = new Date().toISOString()
                    }
                }

                return response
            } catch (error) {
                console.error('Failed to send agent message:', error)
                throw error
            }
        },

        /**
         * End handover
         */
        async endHandover(conversationId, notes = null) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const response = await $fetch(`${config.public.apiBase}/api/agent-handover/conversations/${conversationId}/end`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: { notes }
                })

                if (response.success) {
                    // Remove from active conversations
                    this.activeConversations = this.activeConversations.filter(c => c.id !== conversationId)

                    if (this.selectedConversationId === conversationId) {
                        this.selectedConversationId = null
                    }
                }

                return response
            } catch (error) {
                console.error('Failed to end handover:', error)
                throw error
            }
        },

        /**
         * Handle incoming handover request from WebSocket
         */
        handleHandoverRequested(event) {
            console.log('📩 New handover request:', event)

            // Add to pending requests if not already there
            const exists = this.pendingRequests.find(r => r.handover_request_id === event.handover_request_id)
            if (!exists) {
                this.pendingRequests.unshift({
                    id: event.handover_request_id,
                    conversation_id: event.conversation_id,
                    session_id: event.session_id,
                    user_message: event.user_message,
                    user_metadata: event.user_metadata,
                    expires_at: event.expires_at,
                    timestamp: event.timestamp
                })
            }

            // Show browser notification if permitted
            this.showBrowserNotification('New Customer Request', event.user_message || 'A customer needs assistance')
        },

        /**
         * Handle handover accepted by another agent
         */
        handleHandoverAccepted(event) {
            console.log('✅ Handover accepted:', event)

            // Remove from pending requests
            this.pendingRequests = this.pendingRequests.filter(
                r => r.id !== event.handover_request_id
            )
        },

        /**
         * Handle handover rejected
         */
        handleHandoverRejected(event) {
            console.log('❌ Handover rejected:', event)

            if (event.all_rejected) {
                // Remove from pending if all agents rejected
                this.pendingRequests = this.pendingRequests.filter(
                    r => r.id !== event.handover_request_id
                )
            }
        },

        /**
         * Handle incoming customer message during active handover
         */
        handleCustomerMessage(event) {
            console.log('💬 Customer message:', event)

            const conversation = this.activeConversations.find(c => c.id === event.conversation_id)
            if (conversation) {
                conversation.messages = conversation.messages || []
                conversation.messages.push(event.message)
                conversation.last_activity = new Date().toISOString()
            }
        },

        /**
         * Show browser notification
         */
        showBrowserNotification(title, body) {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, {
                    body: body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: 'handover-request'
                })
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission()
            }
        },

        /**
         * Select conversation
         */
        selectConversation(conversationId) {
            this.selectedConversationId = conversationId
        }
    },

    getters: {
        pendingCount: (state) => state.pendingRequests.length,
        activeCount: (state) => state.activeConversations.length,
        selectedConversation: (state) => {
            return state.activeConversations.find(c => c.id === state.selectedConversationId)
        }
    }
})