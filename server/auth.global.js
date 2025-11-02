// middleware/01.auth.global.js
export default defineNuxtRouteMiddleware(async (to, from) => {
    // Skip middleware for static assets
    if (to.path.startsWith('/_nuxt/') || to.path.startsWith('/api/')) {
        return
    }

    const authStore = useAuthStore()

    // Initialize auth from cookies (works on both server and client)
    authStore.initializeAuth()

    const isAuthenticated = authStore.isLoggedIn
    const user = authStore.user

    // Define route categories
    const publicRoutes = ['/', '/pricing', '/products', '/contact', '/testimonial']
    const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
    const protectedRoutes = ['/dashboard', '/select-business']

    const isPublicRoute = publicRoutes.includes(to.path)
    const isAuthRoute = authRoutes.includes(to.path) || to.path.startsWith('/auth/')
    const isProtectedRoute = to.path.startsWith('/dashboard') || to.path === '/select-business'

    // Allow public routes for everyone
    if (isPublicRoute) {
        return
    }

    // Handle auth routes (login, register, etc.)
    if (isAuthRoute) {
        if (isAuthenticated) {
            // User is logged in, redirect based on their state
            if (!user?.onboarding_completed) {
                return navigateTo('/dashboard/onboarding')
            } else if (!user?.current_business_id) {
                return navigateTo('/select-business')
            } else {
                return navigateTo('/dashboard')
            }
        }
        // Not authenticated, allow access to auth routes
        return
    }

    // Handle protected routes
    if (isProtectedRoute) {
        if (!isAuthenticated) {
            return navigateTo('/login')
        }

        // User is authenticated, check their state
        const isOnboardingRoute = to.path === '/dashboard/onboarding'
        const isBusinessSelector = to.path === '/select-business'

        // If onboarding is completed and trying to access onboarding
        if (user?.onboarding_completed && isOnboardingRoute) {
            return navigateTo('/dashboard')
        }

        // If onboarding is not completed and not on onboarding page
        if (!user?.onboarding_completed && !isOnboardingRoute) {
            return navigateTo('/dashboard/onboarding')
        }

        // If no business selected and not on selector or onboarding
        if (!user?.current_business_id && !isBusinessSelector && !isOnboardingRoute) {
            return navigateTo('/select-business')
        }

        // Allow access to the route
        return
    }
})