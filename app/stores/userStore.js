// stores/userStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useUserStore = defineStore('user', {
    state: () => ({
        loading: false
    }),

    actions: {
        async fetchProfile() {
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            this.loading = true
            try {
                const response = await $fetch(`${config.public.apiBase}/api/profile`, {
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                // Update user in auth store
                authStore.user = response.data.user

                return { success: true, data: response.data }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to fetch profile'
                }
            } finally {
                this.loading = false
            }
        },

        async updateProfile(profileData) {
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            this.loading = true
            try {
                const response = await $fetch(`${config.public.apiBase}/api/profile`, {
                    method: 'PUT',
                    body: profileData,
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                // Update user in auth store
                authStore.user = response.data.user

                return { success: true, data: response.data }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to update profile',
                    errors: error.data?.errors
                }
            } finally {
                this.loading = false
            }
        },

        async updatePassword(passwordData) {
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            this.loading = true
            try {
                const response = await $fetch(`${config.public.apiBase}/api/profile/password`, {
                    method: 'PUT',
                    body: passwordData,
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                return { success: true, message: response.message }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to update password',
                    errors: error.data?.errors
                }
            } finally {
                this.loading = false
            }
        }
    }
})