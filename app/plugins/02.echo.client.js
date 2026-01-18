// app/plugins/echo.client.js
import { defineNuxtPlugin } from '#app'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
    if (process.client) {
        window.Pusher = Pusher
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        const echo = new Echo({
            broadcaster: 'reverb',
            key: config.public.reverbAppKey,
            wsHost: config.public.reverbHost || 'localhost',
            wsPort: Number(config.public.reverbPort || 8080),
            wssPort: Number(config.public.reverbPort || 8080),
            forceTLS: config.public.reverbScheme === 'https',
            enabledTransports: ['ws', 'wss'],
            disableStats: true,


            // Add auth configuration for private channels
            authEndpoint: `${config.public.apiBase}/api/broadcasting/auth`,
            auth: {
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                    'Accept': 'application/json',
                }
            }
        })

        console.log('[Echo Plugin] Initialized with auth support')

        // Cleanup function
        const cleanup = () => {
            echo.disconnect()
            console.log('[Echo Plugin] Disconnected')
        }

        // Handle page unload
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', cleanup)
        }

        return {
            provide: {
                echo,
                cleanup
            }
        }
    }
})