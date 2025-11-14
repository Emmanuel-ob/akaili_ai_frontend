// server/middleware/auth.ts
/**
 * Server-side Authentication Middleware
 * Runs BEFORE page hydration to prevent auth flicker
 */
export default defineEventHandler(async (event) => {
    const url = getRequestURL(event)
    const path = url.pathname

    // Skip API routes and static assets
    if (
        path.startsWith('/api') ||
        path.startsWith('/_nuxt') ||
        path.startsWith('/favicon') ||
        path.includes('.')
    ) {
        return
    }

    console.log("[SERVER AUTH] Checking path:", path)

    // Define protected routes (require authentication AND onboarding)
    const protectedRoutes = [
        '/dashboard',
        '/knowledge-base',
        '/conversations',
        '/settings'
    ]

    // Define auth-required routes (need auth but not necessarily onboarding)
    const authRequiredRoutes = [
        '/dashboard/onboarding',
        '/select-business'
    ]

    // Define guest-only routes (redirect authenticated users)
    const guestOnlyRoutes = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password'
    ]

    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isAuthRequiredRoute = authRequiredRoutes.some(route => path.startsWith(route))
    const isGuestOnlyRoute = guestOnlyRoutes.some(route => path.startsWith(route))

    // Get token from cookie
    const token = getCookie(event, 'auth_token')

    console.log("[SERVER AUTH] Token exists:", !!token)
    console.log("[SERVER AUTH] Route type:", {
        protected: isProtectedRoute,
        authRequired: isAuthRequiredRoute,
        guestOnly: isGuestOnlyRoute
    })

    // No token scenarios
    if (!token) {
        if (isProtectedRoute || isAuthRequiredRoute) {
            console.log("[SERVER AUTH] No token, redirecting to login")
            return sendRedirect(event, `/login?redirect=${encodeURIComponent(path)}`, 302)
        }
        return
    }

    // Token exists - verify it
    console.log("[SERVER AUTH] Verifying token...")
    try {
        const config = useRuntimeConfig()

        interface UserResponse {
            user: {
                id: string
                name: string
                email: string
                current_business_id?: string
                onboarding_completed?: boolean
            }
        }

        const response = await $fetch<UserResponse>(`${config.public.apiBase}/api/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            // CRITICAL: Add timeout and retry options
            timeout: 5000, // 5 second timeout
            retry: 1 // Retry once on failure
        })

        const user = response.user

        console.log("[SERVER AUTH] User verified:", {
            id: user.id,
            email: user.email,
            businessId: user.current_business_id,
            onboardingCompleted: user.onboarding_completed
        })

        // Store user in event context
        event.context.user = user
        event.context.authenticated = true

        // Handle guest-only routes for authenticated users
        if (isGuestOnlyRoute) {
            console.log("[SERVER AUTH] Authenticated user on guest route, redirecting...")

            // Redirect based on user state
            if (!user.onboarding_completed) {
                return sendRedirect(event, '/dashboard/onboarding', 302)
            }
            if (!user.current_business_id) {
                return sendRedirect(event, '/select-business', 302)
            }
            return sendRedirect(event, '/dashboard', 302)
        }

        // Handle protected routes - check onboarding and business
        if (isProtectedRoute) {
            if (!user.onboarding_completed) {
                console.log("[SERVER AUTH] Onboarding not completed, redirecting...")
                return sendRedirect(event, '/dashboard/onboarding', 302)
            }
            if (!user.current_business_id) {
                console.log("[SERVER AUTH] No business selected, redirecting...")
                return sendRedirect(event, '/select-business', 302)
            }
        }

        // Handle onboarding page when already completed
        if (path === '/dashboard/onboarding' && user.onboarding_completed) {
            console.log("[SERVER AUTH] Onboarding already completed, redirecting to dashboard")
            return sendRedirect(event, '/dashboard', 302)
        }

        // Handle business selector when already selected
        if (path === '/select-business' && user.current_business_id) {
            console.log("[SERVER AUTH] Business already selected, redirecting to dashboard")
            return sendRedirect(event, '/dashboard', 302)
        }

        console.log("[SERVER AUTH] Access granted")

    } catch (error: any) {
        console.error("[SERVER AUTH] Token verification failed:", error)

        // CRITICAL FIX: Only clear cookie on 401 Unauthorized
        // Don't clear on network errors, timeouts, or other issues
        const shouldClearToken = error?.statusCode === 401 ||
            error?.response?.status === 401 ||
            error?.data?.statusCode === 401

        if (shouldClearToken) {
            console.log("[SERVER AUTH] Invalid token (401), clearing cookie")
            // Clear cookie with proper options to match how it was set
            deleteCookie(event, 'auth_token', {
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            })
        } else {
            console.log("[SERVER AUTH] Network/server error, keeping token and allowing through")
            // Don't clear token on network errors - let client handle it
            // For protected routes, we'll let it fail gracefully on client side
        }

        // Redirect to login if trying to access protected routes AND token was invalid
        if (shouldClearToken && (isProtectedRoute || isAuthRequiredRoute)) {
            return sendRedirect(event, `/login?redirect=${encodeURIComponent(path)}`, 302)
        }

        // For network errors on protected routes, let it through
        // The client-side auth plugin will handle the actual verification
    }
})