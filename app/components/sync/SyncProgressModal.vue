<template>
    <BaseModal :show="show" :title="modalTitle" @close="handleClose">
        <div class="space-y-6">
            <!-- Progress Header -->
            <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 relative">
                    <div v-if="status === 'running'"
                        class="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin">
                    </div>
                    <div v-else-if="status === 'completed'"
                        class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
                            </path>
                        </svg>
                    </div>
                    <div v-else-if="status === 'failed'"
                        class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                </div>

                <h3 class="text-lg font-medium text-gray-900">
                    {{ statusTitle }}
                </h3>

                <p class="text-sm text-gray-500 mt-1">
                    {{ progress.message || 'Preparing sync...' }}
                </p>
            </div>

            <!-- Progress Bar -->
            <div class="space-y-2">
                <div class="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{{ Math.round(progress.percentage || 0) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="h-2 rounded-full transition-all duration-300 ease-out" :class="progressBarClass"
                        :style="{ width: `${progress.percentage || 0}%` }">
                    </div>
                </div>
            </div>

            <!-- Current Activity -->
            <div v-if="progress.current_table" class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-900">Current Table</p>
                        <p class="text-sm text-gray-600">{{ progress.current_table }}</p>
                    </div>
                    <div v-if="progress.table_progress" class="text-right">
                        <p class="text-sm font-medium text-gray-900">Tables</p>
                        <p class="text-sm text-gray-600">{{ progress.table_progress }}</p>
                    </div>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 rounded-lg p-3">
                    <p class="text-xs font-medium text-blue-600 uppercase tracking-wide">Processed</p>
                    <p class="text-lg font-semibold text-blue-900">{{ stats.changed || 0 }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs font-medium text-gray-600 uppercase tracking-wide">Skipped</p>
                    <p class="text-lg font-semibold text-gray-900">{{ stats.skipped || 0 }}</p>
                </div>
                <div class="bg-green-50 rounded-lg p-3">
                    <p class="text-xs font-medium text-green-600 uppercase tracking-wide">Batches</p>
                    <p class="text-lg font-semibold text-green-900">{{ stats.batches || 0 }}</p>
                </div>
                <div class="bg-red-50 rounded-lg p-3">
                    <p class="text-xs font-medium text-red-600 uppercase tracking-wide">Failed</p>
                    <p class="text-lg font-semibold text-red-900">{{ stats.failed || 0 }}</p>
                </div>
            </div>

            <!-- Error Details -->
            <div v-if="status === 'failed' && errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-red-800 mb-2">Error Details</h4>
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>

            <!-- Failed Items -->
            <div v-if="failedItems && failedItems.length > 0" class="space-y-2">
                <button @click="showFailedItems = !showFailedItems"
                    class="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900">
                    <span>Failed Items ({{ failedItems.length }})</span>
                    <svg class="w-4 h-4 transform transition-transform" :class="{ 'rotate-180': showFailedItems }"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <div v-if="showFailedItems" class="bg-red-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <div v-for="(item, index) in failedItems.slice(0, 10)" :key="index" class="text-xs mb-2 last:mb-0">
                        <p class="font-medium text-red-800">{{ item.doc_id }}</p>
                        <p class="text-red-600">{{ item.stage }}: {{ item.error }}</p>
                    </div>
                    <p v-if="failedItems.length > 10" class="text-xs text-red-600 mt-2">
                        And {{ failedItems.length - 10 }} more...
                    </p>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center pt-4">
                <div>
                    <button v-if="status === 'running'" @click="cancelSync"
                        class="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50">
                        Cancel Sync
                    </button>
                </div>

                <div class="flex space-x-3">
                    <button v-if="status === 'completed' || status === 'failed'" @click="$emit('close')"
                        class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                        Close
                    </button>

                    <button v-if="status === 'failed'" @click="retrySync"
                        class="px-4 py-2 text-sm text-white bg-[#7F56D9] hover:bg-purple-700 rounded-md">
                        Retry Sync
                    </button>
                </div>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
    show: Boolean,
    connectionId: [String, Number],
    syncRunId: [String, Number]
})

const emit = defineEmits(['close', 'retry', 'cancel'])

// State
const status = ref('running') // running, completed, failed, cancelled
const progress = ref({
    percentage: 0,
    message: '',
    current_table: null,
    table_progress: null
})
const stats = ref({
    changed: 0,
    skipped: 0,
    batches: 0,
    failed: 0
})
const errorMessage = ref('')
const failedItems = ref([])
const showFailedItems = ref(false)
const config = useRuntimeConfig()
const authStore = useAuthStore()
let progressInterval = null

// Computed
const modalTitle = computed(() => {
    switch (status.value) {
        case 'running': return 'Syncing Database'
        case 'completed': return 'Sync Completed'
        case 'failed': return 'Sync Failed'
        case 'cancelled': return 'Sync Cancelled'
        default: return 'Database Sync'
    }
})

const statusTitle = computed(() => {
    switch (status.value) {
        case 'running': return 'Sync in Progress'
        case 'completed': return 'Successfully Completed'
        case 'failed': return 'Sync Failed'
        case 'cancelled': return 'Sync Cancelled'
        default: return 'Processing'
    }
})

const progressBarClass = computed(() => {
    switch (status.value) {
        case 'completed': return 'bg-green-500'
        case 'failed': return 'bg-red-500'
        case 'cancelled': return 'bg-gray-500'
        default: return 'bg-purple-500'
    }
})

// Methods
// In SyncProgressModal.vue - Fix the startProgressTracking method
const startProgressTracking = async () => {
    if (!props.connectionId) return

 

    // Start polling for progress
    progressInterval = setInterval(async () => {
        try {
            const response = await $fetch(`${config.public.apiBase}/api/sync/${props.connectionId}/status`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            })

            if (response.success && response.sync_run) {
                const syncRun = response.sync_run

                // Update progress
                progress.value = syncRun.progress || progress.value
                stats.value = syncRun.counts || stats.value

                // Update status
                if (syncRun.status === 'DONE') {
                    status.value = 'completed'
                    clearInterval(progressInterval)
                } else if (syncRun.status === 'FAILED') {
                    status.value = 'failed'
                    errorMessage.value = syncRun.error || 'Unknown error occurred'
                    failedItems.value = syncRun.failed_items || []
                    clearInterval(progressInterval)
                } else if (syncRun.status === 'CANCELLED') {
                    status.value = 'cancelled'
                    clearInterval(progressInterval)
                }
            }
        } catch (error) {
            console.error('Failed to fetch sync status:', error)
        }
    }, 2000) // Increased to 2 seconds to reduce server load
}

const cancelSync = async () => {
    try {
        await $fetch(`${config.public.apiBase}/api/sync/${props.connectionId}/cancel`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`
            }
        })
        emit('cancel')
    } catch (error) {
        console.error('Failed to cancel sync:', error)
    }
}

const retrySync = () => {
    emit('retry')
}

const handleClose = () => {
    if (progressInterval) {
        clearInterval(progressInterval)
    }
    emit('close')
}

// Watchers
watch(() => props.show, (show) => {
    if (show) {
        status.value = 'running'
        progress.value = { percentage: 0, message: '', current_table: null }
        stats.value = { changed: 0, skipped: 0, batches: 0, failed: 0 }
        errorMessage.value = ''
        failedItems.value = []
        startProgressTracking()
    } else {
        if (progressInterval) {
            clearInterval(progressInterval)
        }
    }
})

onUnmounted(() => {
    if (progressInterval) {
        clearInterval(progressInterval)
    }
})
</script>