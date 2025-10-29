// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isLoggedIn: false,
        currentBusinessId: null,
    }),

    actions: {
        async register(userData) {
            const config = useRuntimeConfig()
            try {
                const data = await $fetch(`${config.public.apiBase}/api/register`, {
                    method: 'POST',
                    body: userData
                })

                // Set auth and mark as needing onboarding
                this.setAuth(data.token, {
                    ...data.user,
                    onboarding_completed: false
                })

                return data
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

                const popup = window.open(data.data.url, 'social-auth', 'width=600,height=600')

                return new Promise((resolve, reject) => {
                    const checkClosed = setInterval(() => {
                        if (popup.closed) {
                            clearInterval(checkClosed)
                            reject(new Error('Authentication cancelled'))
                        }
                    }, 1000)

                    const handleMessage = (event) => {
                        if (event.origin !== window.location.origin) return

                        if (event.data.type === 'social-auth-success') {
                            clearInterval(checkClosed)
                            window.removeEventListener('message', handleMessage)
                            popup.close()

                            this.setAuth(event.data.token, event.data.user)
                            resolve({
                                ...event.data,
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
        },

        setAuth(token, user) {
            this.token = token
            this.user = user
            this.isLoggedIn = true
            this.currentBusinessId = user?.current_business_id || null

            const tokenCookie = useCookie('auth_token', {
                httpOnly: false,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7
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
                console.log('Logout error:', error)
            }

            this.clearAuth()
        },

        clearAuth() {
            this.user = null
            this.token = null
            this.isLoggedIn = false
            this.currentBusinessId = null

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
                this.currentBusinessId = userCookie.value?.current_business_id || null
            }
        },

        // Helper to check if user needs onboarding
        needsOnboarding() {
            return this.user && !this.user.onboarding_completed
        }
    }
})