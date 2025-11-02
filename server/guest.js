// middleware/guest.js
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    // Initialize auth from cookies (runs on both server and client)
    authStore.initializeAuth()

    // If user is already logged in, redirect to appropriate page
    if (authStore.isLoggedIn) {
        const user = authStore.user

        // If onboarding not completed, go to onboarding
        if (!user?.onboarding_completed) {
            return navigateTo('/dashboard/onboarding')
        }

        // If no business selected, go to business selector
        if (!user?.current_business_id) {
            return navigateTo('/select-business')
        }

        // Otherwise, go to dashboard
        return navigateTo('/dashboard')
    }
})