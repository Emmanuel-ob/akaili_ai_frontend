// stores/databaseStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useDatabaseStore = defineStore('database', {
    state: () => ({
        connections: [],
        availableDatabases: [],
        loading: false,
        adding: false,
        updating: false,
        syncing: null,
        error: ''
    }),

    actions: {
        async fetchConnections() {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.loading = true
            try {
                const data = await $fetch(`${config.public.apiBase}/api/database`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                this.connections = data.connections || []
                return data
            } catch (error) {
                throw error.data || error
            } finally {
                this.loading = false
            }
        },

        async getAvailableDatabases(connectionData) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/database/get-databases`, {
                    method: 'POST',
                    body: connectionData,
                    headers: { Authorization: `Bearer ${token}` }
                })
                this.availableDatabases = data.databases || []
                return { success: true, databases: data.databases }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to fetch databases' }
            }
        },
        async getAvailableSchemas(connectionData) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/database/get-schemas`, {
                    method: 'POST',
                    body: connectionData,
                    headers: { Authorization: `Bearer ${token}` }
                })
                return { success: true, schemas: data.schemas }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to fetch schemas' }
            }
        },

        async addConnection(connectionData) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.adding = true
            this.error = ''
            try {
                const data = await $fetch(`${config.public.apiBase}/api/database`, {
                    method: 'POST',
                    body: connectionData,
                    headers: { Authorization: `Bearer ${token}` }
                })

                await this.fetchConnections()
                return { success: true, data }
            } catch (error) {
                this.error = error.data?.message || 'Failed to connect database'
                return { success: false, message: this.error }
            } finally {
                this.adding = false
            }
        },

        async updateSelectedTables(connectionId, selectedTables) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.updating = true
            try {
                const data = await $fetch(`${config.public.apiBase}/api/database/${connectionId}/tables`, {
                    method: 'PUT',
                    body: { selected_tables: selectedTables },
                    headers: { Authorization: `Bearer ${token}` }
                })

                await this.fetchConnections()
                return { success: true, data }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to update tables' }
            } finally {
                this.updating = false
            }
        },

        async syncConnection(connectionId, force = false) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.syncing = connectionId
            try {
                await $fetch(`${config.public.apiBase}/api/sync/${connectionId}`, {
                    method: 'POST',
                    body: { force },
                    headers: { Authorization: `Bearer ${token}` }
                })

                await this.fetchConnections()
                return { success: true }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Sync failed' }
            } finally {
                this.syncing = null
            }
        },

        async deleteConnection(connectionId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                await $fetch(`${config.public.apiBase}/api/database/${connectionId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                })

                await this.fetchConnections()
                return { success: true }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to delete connection' }
            }
        },

        clearError() {
            this.error = ''
        }
    },

    getters: {
        getConnectionById: (state) => (id) => {
            return state.connections.find(connection => connection._id === id)
        }
    }
})