// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isLoggedIn: false
    }),

    actions: {
        async register(userData) {
            const config = useRuntimeConfig()
            try {
                return await $fetch(`${config.public.apiBase}/api/register`, {
                    method: 'POST',
                    body: userData
                })
            } catch (error) {
                throw error.data || error
            }
        },

        async login(credentials) {
            const config = useRuntimeConfig()
            try {
                const data = await $fetch(`${config.public.apiBase}/api/login`, {
                    method: 'POST',
                    body: credentials
                })
                this.setAuth(data.token, data.user)
                return data
            } catch (error) {
                throw error.data || error
            }
        },

        async socialAuth(provider) {
            const config = useRuntimeConfig()
            try {
                const data = await $fetch(`${config.public.apiBase}/api/auth/${provider}`)
                // Open in popup or redirect
                const popup = window.open(data.url, 'social-auth', 'width=600,height=600')

                // Listen for the callback
                return new Promise((resolve, reject) => {
                    const checkClosed = setInterval(() => {
                        if (popup.closed) {
                            clearInterval(checkClosed)
                            reject(new Error('Authentication cancelled'))
                        }
                    }, 1000)

                    // Listen for message from popup
                    const handleMessage = (event) => {
                        if (event.origin !== window.location.origin) return

                        if (event.data.type === 'social-auth-success') {
                            clearInterval(checkClosed)
                            window.removeEventListener('message', handleMessage)
                            popup.close()

                            this.setAuth(event.data.token, event.data.user)
                            resolve({
                                ...event.data,
                                isNewUser: !event.data.user.business_id, // Determine if user needs onboarding
                                verified: event.data.verified
                            })
                        } else if (event.data.type === 'social-auth-error') {
                            clearInterval(checkClosed)
                            window.removeEventListener('message', handleMessage)
                            popup.close()
                            reject(new Error(event.data.message))
                        }
                    }

                    window.addEventListener('message', handleMessage)
                })
            } catch (error) {
                throw error.data || error
            }
        }   ,

        setAuth(token, user) {
            this.token = token
            this.user = user
            this.isLoggedIn = true

            // Use cookies for SSR compatibility
            const tokenCookie = useCookie('auth_token', {
                httpOnly: false,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })
            const userCookie = useCookie('user', {
                httpOnly: false,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7
            })

            tokenCookie.value = token
            userCookie.value = user
        },

        async logout() {
            const config = useRuntimeConfig()

            try {
                await $fetch(`${config.public.apiBase}/api/logout`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${this.token}` }
                })
            } catch (error) {
                console.log(error)
                // Continue with logout even if API call fails
            }

            this.user = null
            this.token = null
            this.isLoggedIn = false

            const tokenCookie = useCookie('auth_token')
            const userCookie = useCookie('user')
            tokenCookie.value = null
            userCookie.value = null
        },

        clearAuth() {
            this.user = null
            this.token = null
            this.isLoggedIn = false

            const tokenCookie = useCookie('auth_token')
            const userCookie = useCookie('user')
            tokenCookie.value = null
            userCookie.value = null
        },

        initializeAuth() {
            const tokenCookie = useCookie('auth_token')
            const userCookie = useCookie('user')

            if (tokenCookie.value && userCookie.value) {
                this.token = tokenCookie.value
                this.user = userCookie.value
                this.isLoggedIn = true
            }
        }
    }
})