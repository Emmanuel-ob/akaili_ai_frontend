// middleware/auth.js
import { useAuthStore } from '~/stores/authStore'
import { useBusinessStore } from '~/stores/businessStore'

export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only run on client side
    if (process.server) return

    const authStore = useAuthStore()
    const businessStore = useBusinessStore()

    // Initialize auth from cookies
    // authStore.initializeAuth()

    // If not authenticated, redirect to login
    if (!authStore.isLoggedIn) {
        return navigateTo('/login')
    }

    const user = authStore.user

    // Allow access to business selector
    if (to.path === '/select-business') {
        return
    }

    // PHASE 9: Check if user has selected a business
    if (!user.current_business_id) {
        try {
            // Fetch user's businesses
            const result = await businessStore.fetchAllBusinesses()

            if (!result.success) {
                // If fetch fails, redirect to business selection
                return navigateTo('/select-business')
            }

            const businesses = businessStore.businesses
            console.log('User businesses:', businesses.length)

            // If user has no businesses, they need onboarding
            if (businesses.length === 0) {
                if (to.path !== '/dashboard/onboarding') {
                    return navigateTo('/dashboard/onboarding')
                }
                return
            }

            // If user has exactly one business, auto-select it
            if (businesses.length === 1) {
                await businessStore.switchBusiness(businesses[0].id)
                // User object is now updated with current_business_id
            }

            // If user has multiple businesses, show selector
            if (businesses.length > 1 && to.path !== '/select-business') {
                return navigateTo('/select-business')
            }
        } catch (error) {
            console.error('Failed to fetch businesses:', error)
            return navigateTo('/select-business')
        }
    }

    // Allow access to onboarding page
    if (to.path === '/dashboard/onboarding') {
        return
    }

    // Check onboarding completion
    if (!user.onboarding_completed) {
        // User needs to complete onboarding
        if (to.path !== '/dashboard/onboarding') {
            return navigateTo('/dashboard/onboarding')
        }
        return
    }

    // If onboarding is completed and user tries to access onboarding, redirect to dashboard
    if (user.onboarding_completed && to.path === '/dashboard/onboarding') {
        return navigateTo('/dashboard')
    }
})