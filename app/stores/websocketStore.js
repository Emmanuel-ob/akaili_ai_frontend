// stores/websocketStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useWebSocketStore = defineStore('websocket', {
    state: () => ({
        connected: false,
        businessChannel: null,
        userChannel: null,
        eventHandlers: new Map(), // Store handlers by page/component
        notifications: [], // Store notifications for display
    }),

    actions: {
        /**
         * Initialize WebSocket connection - Call this on app mount or login
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
         * Set up global event listeners that persist across all pages
         */
        _setupGlobalListeners() {
            const channels = [this.businessChannel, this.userChannel]

            channels.forEach(channel => {
                // FAQ Processing Events
                channel.listen('.faq.processing.completed', (event) => {
                    this._handleEvent('faq.processing.completed', event)
                })

                channel.listen('.faq.processing.failed', (event) => {
                    this._handleEvent('faq.processing.failed', event)
                })

                channel.listen('.faq.embedding.completed', (event) => {
                    this._handleEvent('faq.embedding.completed', event)
                })

                channel.listen('.faq.embedding.failed', (event) => {
                    this._handleEvent('faq.embedding.failed', event)
                })

                channel.listen('.faq.deletion.completed', (event) => {
                    this._handleEvent('faq.deletion.completed', event)
                })

                channel.listen('.job.progress.updated', (event) => {
                    this._handleEvent('job.progress.updated', event)
                })

                // Add more global events as needed
                // channel.listen('.notification.new', (event) => {
                //     this._handleEvent('notification.new', event)
                // })
            })
        },

        /**
         * Handle incoming WebSocket events
         * FIXED: Now correctly calls handler.handler(eventData) instead of handler(eventData)
         */
        _handleEvent(eventType, eventData) {
            console.log(`📡 WebSocket Event: ${eventType}`, eventData)

            // Store notification for persistence
            this.addNotification(eventType, eventData)

            // Call registered handlers
            const handlers = this.eventHandlers.get(eventType) || []
            handlers.forEach(handlerObj => {
                try {
                    // FIX: Access the handler function from the handlerObj object
                    // Each handlerObj has structure: { handler: Function, componentId: String }
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
         * Register event handler for a specific component/page
         * Returns unsubscribe function
         */
        on(eventType, handler, componentId = 'default') {
            if (typeof handler !== 'function') {
                console.error('Handler must be a function', { eventType, handler })
                return () => { } // Return no-op unsubscribe
            }

            if (!this.eventHandlers.has(eventType)) {
                this.eventHandlers.set(eventType, [])
            }

            const handlerWithId = { handler, componentId }
            this.eventHandlers.get(eventType).push(handlerWithId)

            console.log(`✅ Registered handler for ${eventType} (component: ${componentId})`)

            // Return unsubscribe function
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
         * Unregister all handlers for a component (call in onUnmounted)
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
         * Add notification to store (for future notification center)
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

            // Keep only last 50 notifications
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
         * Reconnect (useful after business switch)
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