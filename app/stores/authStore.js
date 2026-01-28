// stores/authStore.js
import { defineStore } from 'pinia'

// Centralized cookie configuration
const COOKIE_CONFIG = {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isLoggedIn: false,
        currentBusinessId: null,
    }),

    getters: {
        isAuthenticated: (state) => state.isLoggedIn && !!state.token && !!state.user,
        userName: (state) => state.user?.name || '',
        userEmail: (state) => state.user?.email || '',
        needsOnboarding: (state) => state.user && !state.user.onboarding_completed,
        needsBusinessSelection: (state) => state.user && !state.user.current_business_id,
    },

    actions: {
        async register(userData) {
            const config = useRuntimeConfig()
            try {
                const data = await $fetch(`${config.public.apiBase}/api/register`, {
                    method: 'POST',
                    body: userData,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })

                // Don't set auth since user needs to verify email first
                return {
                    success: true,
                    message: data.message,
                    email: data.data.email
                }
            } catch (error) {
                console.error('[AUTH STORE] Registration error:', error)

                // UPDATED: Extract and format validation errors
                let formattedErrors = {}
                if (error.data?.errors) {
                    // Laravel returns errors as { field: [array of messages] }
                    // Convert to { field: 'first message' }
                    Object.keys(error.data.errors).forEach(field => {
                        const messages = error.data.errors[field]
                        formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages
                    })
                }

                return {
                    success: false,
                    error: error.data?.message || error.message || 'Registration failed',
                    errors: formattedErrors // Include field-specific errors
                }
            }
        },

        async login(credentials) {
            const config = useRuntimeConfig()
            try {
                const response = await $fetch(`${config.public.apiBase}/api/login`, {
                    method: 'POST',
                    body: credentials,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })

                const userData = response.data?.user || response.user
                const token = response.token

                if (!userData || !token) {
                    throw new Error('Invalid response format from server')
                }

                this.setAuth(token, userData)

                console.log('[AUTH STORE] Login successful:', {
                    userId: userData.id,
                    email: userData.email,
                    businessId: userData.current_business_id
                })

                return { success: true, data: response }
            } catch (error) {
                console.error('[AUTH STORE] Login error:', error)

                // UPDATED: Pass through needs_verification flag and email
                return {
                    success: false,
                    error: error.data?.message || error.message || 'Login failed',
                    needs_verification: error.data?.needs_verification || false,
                    email: error.data?.email || null
                }
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
                                success: true,
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
                console.error('[AUTH STORE] Social auth error:', error)
                return {
                    success: false,
                    error: error.data?.message || error.message || 'Social authentication failed'
                }
            }
        },

        setAuth(token, user) {
            console.log('[AUTH STORE] Setting auth with token:', token ? 'exists' : 'missing')

            this.token = token
            this.user = user
            this.isLoggedIn = true
            this.currentBusinessId = user?.current_business_id || null

            // Set cookie with consistent configuration
            this.setTokenCookie(token)

            console.log('[AUTH STORE] Auth state updated:', {
                userId: user?.id,
                email: user?.email,
                businessId: this.currentBusinessId,
                onboardingCompleted: user?.onboarding_completed
            })
        },

        setTokenCookie(token) {
            // Use consistent cookie configuration
            const tokenCookie = useCookie('auth_token', COOKIE_CONFIG)
            tokenCookie.value = token
            console.log('[AUTH STORE] Cookie set with config:', COOKIE_CONFIG)
        },

        async logout() {
            const config = useRuntimeConfig()

            if (this.token) {
                try {
                    await $fetch(`${config.public.apiBase}/api/logout`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                            'Accept': 'application/json'
                        }
                    })
                    console.log('[AUTH STORE] Logout API call successful')
                } catch (error) {
                    console.error('[AUTH STORE] Logout API error:', error)
                }
            }

            this.clearAuth()

            // Navigate to login
            await navigateTo('/login')
        },

        clearAuth() {
            console.log('[AUTH STORE] Clearing auth state')

            this.user = null
            this.token = null
            this.isLoggedIn = false
            this.currentBusinessId = null

            // Clear cookie with same configuration
            const tokenCookie = useCookie('auth_token', COOKIE_CONFIG)
            tokenCookie.value = null
        },

        // Update user data (used after profile updates)
        updateUser(userData) {
            this.user = { ...this.user, ...userData }
            this.currentBusinessId = userData.current_business_id || this.currentBusinessId

            console.log('[AUTH STORE] User data updated:', {
                userId: this.user?.id,
                businessId: this.currentBusinessId
            })
        },

        // Switch business (update current_business_id)
        switchBusiness(businessId) {
            if (this.user) {
                this.user.current_business_id = businessId
                this.currentBusinessId = businessId

                console.log('[AUTH STORE] Business switched:', businessId)
            }
        },
         updateLocalAvatar(base64Image) {
                if (this.user) {
                this.user.avatar = base64Image;
                // Store it in localStorage with a key unique to this user if possible
                localStorage.setItem(`user_avatar_${this.user.id || 'default'}`, base64Image);
                }
            },

            // Call this inside your fetchUser or onMounted to restore the saved image
            loadLocalAvatar() {
                const savedAvatar = localStorage.getItem(`user_avatar_${this.user?.id || 'default'}`);
                if (savedAvatar && this.user) {
                this.user.avatar = savedAvatar;
                }
            }

        
    }
})