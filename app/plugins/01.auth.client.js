// plugins/01.auth.client.js

// Centralized cookie configuration - must match authStore
const COOKIE_CONFIG = {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
}

export default defineNuxtPlugin(async (nuxtApp) => {
    const authStore = useAuthStore()
    const config = useRuntimeConfig()

    console.log('[AUTH PLUGIN] Initializing auth...')

    // Get token from cookie with consistent configuration
    const tokenCookie = useCookie('auth_token', COOKIE_CONFIG)
    const token = tokenCookie.value

    console.log('[AUTH PLUGIN] Token from cookie:', token ? 'exists' : 'missing')

    if (!token) {
        console.log('[AUTH PLUGIN] No token found, user not authenticated')
        return
    }

    console.log('[AUTH PLUGIN] Token found, fetching user data...')

    try {
        // Fetch user data with the token
        const response = await $fetch(`${config.public.apiBase}/api/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            // Add timeout to prevent hanging
            timeout: 5000
        })

        // Set auth state
        authStore.token = token
        authStore.user = response.user || response.data?.user
        authStore.isLoggedIn = true
        authStore.currentBusinessId = authStore.user?.current_business_id || null

        console.log('[AUTH PLUGIN] Auth initialized successfully:', {
            userId: authStore.user?.id,
            email: authStore.user?.email,
            businessId: authStore.currentBusinessId,
            onboardingCompleted: authStore.user?.onboarding_completed
        })
    } catch (error) {
        console.error('[AUTH PLUGIN] Failed to fetch user:', error)

        // CRITICAL: Only clear on 401 (invalid token)
        // Don't clear on network errors
        const isInvalidToken = error?.statusCode === 401 ||
            error?.response?.status === 401 ||
            error?.data?.statusCode === 401

        if (isInvalidToken) {
            console.log('[AUTH PLUGIN] Invalid token (401), clearing auth')
            authStore.clearAuth()
        } else {
            console.log('[AUTH PLUGIN] Network error, keeping token for retry')
            // Keep the token - it might work on next page load
            // But clear the auth state so UI shows logged out
            authStore.token = null
            authStore.user = null
            authStore.isLoggedIn = false
            authStore.currentBusinessId = null
        }
    }
})