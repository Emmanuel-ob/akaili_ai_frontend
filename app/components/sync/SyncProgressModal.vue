<template>
    <BaseModal :show="show" @close="handleClose" :closable="!isRunning" max-width="2xl">
        <template #header>
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <svg v-if="isRunning" class="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <svg v-else-if="syncStatus.status === 'DONE'" class="w-5 h-5 text-green-600 dark:text-green-400"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <svg v-else-if="syncStatus.status === 'FAILED'" class="w-5 h-5 text-red-600 dark:text-red-400"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ modalTitle }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ connection?.name || 'Unknown Connection' }}
                    </p>
                </div>
            </div>
        </template>

        <template #body>
            <div class="space-y-6">
                <!-- Main Progress Bar -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ syncStatus.message || 'Processing...' }}
                        </span>
                        <span class="text-sm font-bold" :class="progressColorClass">
                            {{ syncStatus.progress || 0 }}%
                        </span>
                    </div>

                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div class="h-3 rounded-full transition-all duration-300 ease-out" :class="progressBarClass"
                            :style="{ width: `${syncStatus.progress || 0}%` }"></div>
                    </div>
                </div>

                <!-- Current Table Info -->
                <div v-if="syncStatus.currentTable" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Current Table
                        </span>
                        <span class="text-xs font-medium text-blue-700 dark:text-blue-300">
                            {{ syncStatus.processedTables || 0 }} / {{ syncStatus.totalTables || 0 }}
                        </span>
                    </div>
                    <p class="text-base font-mono text-blue-800 dark:text-blue-200">
                        {{ syncStatus.currentTable }}
                    </p>
                </div>

                <!-- Statistics Grid -->
                <div class="grid grid-cols-3 gap-4">
                    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Tables</div>
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">
                            {{ syncStatus.totalTables || 0 }}
                        </div>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Processed</div>
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                            {{ syncStatus.processedTables || 0 }}
                        </div>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Records</div>
                        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {{ (syncStatus.recordsProcessed || 0).toLocaleString() }}
                        </div>
                    </div>
                </div>

                <!-- Error Display -->
                <div v-if="syncStatus.error"
                    class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <h4 class="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                                Sync Failed
                            </h4>
                            <p class="text-sm text-red-700 dark:text-red-300">
                                {{ syncStatus.error }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Success Message -->
                <div v-if="syncStatus.status === 'DONE'"
                    class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <h4 class="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                                Sync Completed Successfully!
                            </h4>
                            <p class="text-sm text-green-700 dark:text-green-300">
                                All data has been synchronized and is now available for your chatbot.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Status Timeline -->
                <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Sync Status
                    </h4>
                    <div class="space-y-2">
                        <div class="flex items-center text-sm">
                            <div :class="syncStatus.status !== 'IDLE' ? 'bg-green-500' : 'bg-gray-300'"
                                class="w-2 h-2 rounded-full mr-3"></div>
                            <span class="text-gray-600 dark:text-gray-400">Started</span>
                        </div>
                        <div class="flex items-center text-sm">
                            <div :class="syncStatus.progress > 0 ? 'bg-green-500' : 'bg-gray-300'"
                                class="w-2 h-2 rounded-full mr-3"></div>
                            <span class="text-gray-600 dark:text-gray-400">Processing</span>
                        </div>
                        <div class="flex items-center text-sm">
                            <div :class="syncStatus.status === 'DONE' ? 'bg-green-500' : 'bg-gray-300'"
                                class="w-2 h-2 rounded-full mr-3"></div>
                            <span class="text-gray-600 dark:text-gray-400">Completed</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex items-center justify-end space-x-3">
                <button v-if="syncStatus.status === 'DONE' || syncStatus.status === 'FAILED'" @click="handleClose"
                    class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                    Close
                </button>

                <button v-if="isRunning" @click="handleCancel"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                    Cancel Sync
                </button>
            </div>
        </template>
    </BaseModal>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useDatabaseStore } from '~/stores/databaseStore'
import { useWebSocketStore } from '~/stores/websocketStore'
import { useAuthStore } from '~/stores/authStore'

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    // ✅ Accept full connection object
    connection: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'sync-complete'])

const databaseStore = useDatabaseStore()
const websocketStore = useWebSocketStore()

// ✅ Get connection ID (support both _id and id)
const connectionId = computed(() => {
    if (!props.connection) return null
    return props.connection._id || props.connection.id
})

// ✅ Get real-time sync status from store (updated via WebSocket)
const syncStatus = computed(() => {
    if (!connectionId.value) {
        return {
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
    return databaseStore.getSyncStatusForConnection(connectionId.value)
})

const isRunning = computed(() => {
    return syncStatus.value.status === 'RUNNING' || syncStatus.value.status === 'PENDING'
})

const modalTitle = computed(() => {
    if (syncStatus.value.status === 'DONE') return 'Sync Complete'
    if (syncStatus.value.status === 'FAILED') return 'Sync Failed'
    if (isRunning.value) return 'Syncing Database'
    return 'Database Sync'
})

const progressColorClass = computed(() => {
    if (syncStatus.value.status === 'FAILED') return 'text-red-600 dark:text-red-400'
    if (syncStatus.value.status === 'DONE') return 'text-green-600 dark:text-green-400'
    return 'text-blue-600 dark:text-blue-400'
})

const progressBarClass = computed(() => {
    if (syncStatus.value.status === 'FAILED') return 'bg-red-600 dark:bg-red-500'
    if (syncStatus.value.status === 'DONE') return 'bg-green-600 dark:bg-green-500'
    return 'bg-blue-600 dark:bg-blue-500'
})

// ✅ Watch for sync completion
watch(() => syncStatus.value.status, (newStatus, oldStatus) => {
    console.log(`📊 [SyncProgressModal] Status changed: ${oldStatus} → ${newStatus}`)

    if (oldStatus === 'RUNNING' && newStatus === 'DONE') {
        console.log('✅ [SyncProgressModal] Sync completed!')
        emit('sync-complete', props.connection)
    }
})

const handleClose = () => {
    if (!isRunning.value) {
        emit('close')
    }
}

const handleCancel = async () => {
    if (!connectionId.value) return

    const config = useRuntimeConfig()
    const { token } = useAuthStore()

    try {
        await $fetch(`${config.public.apiBase}/api/sync/${connectionId.value}/cancel`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        })

        console.log('🛑 [SyncProgressModal] Sync cancelled')
        // WebSocket will handle the status update
    } catch (error) {
        console.error('Failed to cancel sync:', error)
    }
}

// ✅ Component-specific WebSocket handler
let unsubscribe = null

onMounted(() => {
    console.log('📡 [SyncProgressModal] Mounted for connection:', props.connection?.name)

    if (connectionId.value) {
        // Register component-specific handler
        unsubscribe = websocketStore.on(
            'sync.progress.updated',
            (event) => {
                if (event.connection_id === connectionId.value) {
                    console.log('📊 [SyncProgressModal] Received sync update:', {
                        status: event.status,
                        progress: event.progress,
                        currentTable: event.current_table
                    })
                }
            },
            'sync-progress-modal'
        )
    }
})

onUnmounted(() => {
    console.log('🔌 [SyncProgressModal] Unmounting, cleaning up handlers')

    // Cleanup component-specific handlers
    if (unsubscribe) {
        unsubscribe()
    }
    websocketStore.offAll('sync-progress-modal')
})
</script>