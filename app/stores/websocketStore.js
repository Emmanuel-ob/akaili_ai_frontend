// stores/websocketStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useWebSocketStore = defineStore('websocket', {
    state: () => ({
        connected: false,
        businessChannel: null,
        userChannel: null,
        eventHandlers: new Map(),
        notifications: [],
    }),

    actions: {
        /**
         * Initialize WebSocket connection
         */
        initialize() {
            const { $echo } = useNuxtApp()
            const authStore = useAuthStore()

            if (!authStore.user || !authStore.user.current_business_id) {
                console.warn('Cannot initialize WebSocket: No user or business')
                return false
            }

            if (this.connected) {
                console.log('WebSocket already connected')
                return true
            }

            try {
                const businessId = authStore.user.current_business_id
                const userId = authStore.user.id

                // Connect to channels
                this.businessChannel = $echo.channel(`business.${businessId}`)
                this.userChannel = $echo.channel(`user.${userId}`)

                // Set up global listeners
                this._setupGlobalListeners()

                this.connected = true
                console.log(`✅ WebSocket connected: business.${businessId}, user.${userId}`)
                return true
            } catch (error) {
                console.error('WebSocket initialization failed:', error)
                return false
            }
        },

        /**
         * Set up global event listeners
         */
        _setupGlobalListeners() {
            console.log('🎧 Setting up global WebSocket listeners...')

            // FAQ Processing Events
            this.businessChannel.listen('.faq.processing.completed', (event) => {
                this._handleEvent('faq.processing.completed', event)
            })

            this.businessChannel.listen('.faq.processing.failed', (event) => {
                this._handleEvent('faq.processing.failed', event)
            })

            this.businessChannel.listen('.faq.embedding.completed', (event) => {
                this._handleEvent('faq.embedding.completed', event)
            })

            this.businessChannel.listen('.faq.embedding.failed', (event) => {
                this._handleEvent('faq.embedding.failed', event)
            })

            this.businessChannel.listen('.faq.deletion.completed', (event) => {
                this._handleEvent('faq.deletion.completed', event)
            })

            this.businessChannel.listen('.job.progress.updated', (event) => {
                this._handleEvent('job.progress.updated', event)
            })

            // ✅ ADD: Agent Handover Events
            this.businessChannel.listen('.handover.requested', (event) => {
                console.log('🔔 [WebSocket] Handover Requested:', event)
                this._handleEvent('handover.requested', event)
            })

            this.businessChannel.listen('.handover.accepted', (event) => {
                console.log('✅ [WebSocket] Handover Accepted:', event)
                this._handleEvent('handover.accepted', event)
            })

            this.businessChannel.listen('.handover.rejected', (event) => {
                console.log('❌ [WebSocket] Handover Rejected:', event)
                this._handleEvent('handover.rejected', event)
            })

            // User channel listeners (if needed)
            this.userChannel.listen('.notification.new', (event) => {
                this._handleEvent('notification.new', event)
            })
        },

        /**
         * Handle incoming WebSocket events
         */
        _handleEvent(eventType, eventData) {
            console.log(`📡 WebSocket Event: ${eventType}`, eventData)

            // Store notification
            this.addNotification(eventType, eventData)

            // Call registered handlers
            const handlers = this.eventHandlers.get(eventType) || []

            if (handlers.length === 0) {
                console.warn(`⚠️ No handlers registered for event: ${eventType}`)
            }

            handlers.forEach(handlerObj => {
                try {
                    if (typeof handlerObj.handler === 'function') {
                        handlerObj.handler(eventData)
                    } else {
                        console.warn(`Invalid handler for ${eventType}:`, handlerObj)
                    }
                } catch (error) {
                    console.error(`Error in handler for ${eventType}:`, error)
                }
            })
        },

        /**
         * Register event handler
         */
        on(eventType, handler, componentId = 'default') {
            if (typeof handler !== 'function') {
                console.error('Handler must be a function', { eventType, handler })
                return () => { }
            }

            if (!this.eventHandlers.has(eventType)) {
                this.eventHandlers.set(eventType, [])
            }

            const handlerWithId = { handler, componentId }
            this.eventHandlers.get(eventType).push(handlerWithId)

            console.log(`✅ Registered handler for ${eventType} (component: ${componentId})`)

            return () => this.off(eventType, handler, componentId)
        },

        /**
         * Unregister event handler
         */
        off(eventType, handler, componentId = 'default') {
            if (!this.eventHandlers.has(eventType)) return

            const handlers = this.eventHandlers.get(eventType)
            const index = handlers.findIndex(
                h => h.handler === handler && h.componentId === componentId
            )

            if (index > -1) {
                handlers.splice(index, 1)
                console.log(`🔕 Unregistered handler for ${eventType} (component: ${componentId})`)
            }
        },

        /**
         * Unregister all handlers for a component
         */
        offAll(componentId) {
            let removedCount = 0
            this.eventHandlers.forEach((handlers, eventType) => {
                const initialLength = handlers.length
                const filtered = handlers.filter(h => h.componentId !== componentId)
                removedCount += (initialLength - filtered.length)
                this.eventHandlers.set(eventType, filtered)
            })

            if (removedCount > 0) {
                console.log(`🔕 Removed ${removedCount} handler(s) for component: ${componentId}`)
            }
        },

        /**
         * Add notification
         */
        addNotification(eventType, eventData) {
            const notification = {
                id: Date.now() + Math.random(),
                type: eventType,
                data: eventData,
                timestamp: new Date().toISOString(),
                read: false,
            }

            this.notifications.unshift(notification)

            if (this.notifications.length > 50) {
                this.notifications = this.notifications.slice(0, 50)
            }
        },

        /**
         * Mark notification as read
         */
        markAsRead(notificationId) {
            const notification = this.notifications.find(n => n.id === notificationId)
            if (notification) {
                notification.read = true
            }
        },

        /**
         * Clear all notifications
         */
        clearNotifications() {
            this.notifications = []
        },

        /**
         * Disconnect WebSocket
         */
        disconnect() {
            const { $echo } = useNuxtApp()

            if (this.businessChannel) {
                $echo.leave(this.businessChannel.name)
                this.businessChannel = null
            }

            if (this.userChannel) {
                $echo.leave(this.userChannel.name)
                this.userChannel = null
            }

            this.eventHandlers.clear()
            this.connected = false
            console.log('🔌 WebSocket disconnected')
        },

        /**
         * Reconnect
         */
        reconnect() {
            this.disconnect()
            return this.initialize()
        },
    },

    getters: {
        unreadNotifications: (state) => {
            return state.notifications.filter(n => !n.read)
        },

        notificationCount: (state) => {
            return state.notifications.filter(n => !n.read).length
        },

        isConnected: (state) => state.connected,
    },
})