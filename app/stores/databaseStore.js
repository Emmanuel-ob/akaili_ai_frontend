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
        syncing: null, // Keep for backward compatibility
        error: '',
        // ✅ NEW: WebSocket sync status tracking
        syncStatus: new Map(), // Map<connectionId, syncData>
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

                // ✅ Initialize sync status for each connection
                this.connections.forEach(conn => {
                    // Use MongoDB _id for consistency with backend
                    const connId = conn._id || conn.id
                    if (!this.syncStatus.has(connId)) {
                        this.syncStatus.set(connId, {
                            status: conn.status === 'syncing' ? 'RUNNING' : 'IDLE',
                            progress: 0,
                            currentTable: null,
                            message: null,
                            error: null,
                            totalTables: 0,
                            processedTables: 0,
                            recordsProcessed: 0,
                        })
                    }
                })

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
                const response = await $fetch(`${config.public.apiBase}/api/sync/${connectionId}`, {
                    method: 'POST',
                    body: { force },
                    headers: { Authorization: `Bearer ${token}` }
                })

                // ✅ Initialize sync status (WebSocket will update it)
                this.syncStatus.set(connectionId, {
                    status: 'PENDING',
                    progress: 0,
                    currentTable: null,
                    message: 'Initiating sync...',
                    error: null,
                    totalTables: 0,
                    processedTables: 0,
                    recordsProcessed: 0,
                })

                // Don't clear syncing immediately - let WebSocket handle it
                return { success: true }
            } catch (error) {
                this.syncing = null
                return { success: false, message: error.data?.message || 'Sync failed' }
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

                // ✅ Clean up sync status
                this.syncStatus.delete(connectionId)

                await this.fetchConnections()
                return { success: true }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to delete connection' }
            }
        },

        // ✅ NEW: Handle real-time sync progress from WebSocket
        handleSyncProgress(event) {
            const {
                connection_id,
                sync_run_id,
                status,
                progress,
                current_table,
                message,
                error,
                total_tables,
                processed_tables,
                records_processed
            } = event

            console.log('📊 [DatabaseStore] Handling sync progress:', {
                connection_id,
                status,
                progress,
                current_table
            })

            // Update sync status
            this.syncStatus.set(connection_id, {
                status,
                progress: progress || 0,
                currentTable: current_table,
                message,
                error,
                totalTables: total_tables || 0,
                processedTables: processed_tables || 0,
                recordsProcessed: records_processed || 0,
            })

            // Update connection status in the list
            const connection = this.connections.find(c => (c._id || c.id) === connection_id)
            if (connection) {
                connection.status = this.mapSyncStatus(status)
            }

            // Clear syncing state when done or failed
            if (status === 'DONE' || status === 'FAILED' || status === 'CANCELLED') {
                setTimeout(() => {
                    if (this.syncing === connection_id) {
                        this.syncing = null
                    }
                }, 2000)
            }
        },

        // ✅ NEW: Map sync run status to connection status
        mapSyncStatus(syncStatus) {
            const statusMap = {
                'PENDING': 'syncing',
                'RUNNING': 'syncing',
                'DONE': 'connected',
                'FAILED': 'connected',
                'CANCELLED': 'connected'
            }
            return statusMap[syncStatus] || 'connected'
        },

        // ✅ NEW: Get sync status for a connection
        getSyncStatusForConnection(connectionId) {
            return this.syncStatus.get(connectionId) || {
                status: 'IDLE',
                progress: 0,
                currentTable: null,
                message: null,
                error: null,
                totalTables: 0,
                processedTables: 0,
                recordsProcessed: 0,
            }
        },

        // ✅ NEW: Check if a connection is currently syncing
        isConnectionSyncing(connectionId) {
            const status = this.getSyncStatusForConnection(connectionId)
            return status.status === 'RUNNING' || status.status === 'PENDING'
        },

        clearError() {
            this.error = ''
        }
    },

    getters: {
        getConnectionById: (state) => (id) => {
            // Support both _id (MongoDB) and id formats
            return state.connections.find(connection =>
                connection._id === id || connection.id === id
            )
        },

        // ✅ NEW: Get connections with their real-time sync status
        connectionsWithSyncStatus: (state) => {
            return state.connections.map(conn => {
                const connId = conn._id || conn.id
                return {
                    ...conn,
                    syncStatus: state.syncStatus.get(connId) || {
                        status: 'IDLE',
                        progress: 0,
                        currentTable: null,
                        message: null,
                        error: null,
                        totalTables: 0,
                        processedTables: 0,
                        recordsProcessed: 0,
                    }
                }
            })
        },

        // ✅ NEW: Check if any sync is in progress
        hasSyncInProgress: (state) => {
            return Array.from(state.syncStatus.values()).some(
                status => status.status === 'RUNNING' || status.status === 'PENDING'
            )
        }
    }
})