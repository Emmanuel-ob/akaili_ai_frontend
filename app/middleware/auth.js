// middleware/auth.js
import { useAuthStore } from '~/stores/authStore'

export default function ({ redirect }) {
    const authStore = useAuthStore()

    // Initialize auth from localStorage
    authStore.initializeAuth()

    // If not authenticated, redirect to login
    if (!authStore.isLoggedIn) {
        return redirect('/dashboard/login')
    }
}