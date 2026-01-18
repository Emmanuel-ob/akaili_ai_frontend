<!-- components/faq/FAQList.vue -->
<template>
    <div class="space-y-4">
        <!-- Empty State -->
        <div v-if="!faqSources.length && !loading"
            class="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700">
            <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">No FAQ sources yet</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Upload documents or create manual Q&A pairs to get started</p>
        </div>

        <!-- FAQ Source Cards -->
        <div v-for="faq in faqSources" :key="faq.id"
            class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sm:p-6 hover:shadow-md transition-shadow">

            <!-- Header Section -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3 sm:gap-0">
                <div class="flex-1 min-w-0"> <!-- min-w-0 forces truncation inside flex items -->
                    <div class="flex flex-wrap items-center gap-2 mb-2">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-full">
                            {{ faq.source_name }}
                        </h3>

                        <!-- Status Badge -->
                        <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusColor(faq.status)]">
                            {{ getStatusLabel(faq.status) }}
                        </span>

                        <!-- Active Badge -->
                        <span v-if="faq.is_active"
                            class="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 shrink-0">
                            ACTIVE
                        </span>

                        <!-- ✅ NEW: Processing indicator -->
                        <span v-if="isProcessing(faq.id)"
                            class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            <svg class="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Processing
                        </span>
                    </div>

                    <!-- Meta Data -->
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {{ getSourceTypeLabel(faq.source_type) }}
                        </span>
                        <span v-if="faq.file_name" class="truncate max-w-[150px] sm:max-w-[200px]" :title="faq.file_name">
                            {{ faq.file_name }}
                        </span>
                        <span class="whitespace-nowrap">{{ faq.total_items || 0 }} items</span>
                        <span v-if="faq.embedded_items" class="whitespace-nowrap">{{ faq.embedded_items }} embedded</span>
                    </div>
                </div>

                <!-- Priority Badge (Right on desktop, inline block on mobile) -->
                <div class="flex sm:block shrink-0">
                    <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        Priority: {{ faq.priority }}
                    </span>
                </div>
            </div>

            <!-- Progress Bar -->
            <div v-if="faq.status === 'processing' || faq.status === 'pending'" class="mb-4">
                <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>{{ faq.status === 'pending' ? 'Queued...' : 'Processing...' }}</span>
                    <span>{{ getProgressPercentage(faq) }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div class="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: getProgressPercentage(faq) + '%' }">
                        <div v-if="faq.status === 'processing'"
                            class="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-30 animate-shimmer" />
                    </div>
                </div>
            </div>

            <!-- ✅ IMPROVED: Error Message with Action-Specific Retry -->
            <div v-if="faq.status === 'failed' && faq.error_message"
                class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p class="text-sm font-medium text-red-800">
                                {{ getFailureTitle(faq.last_failed_action) }}
                            </p>
                        </div>
                        <p class="text-xs text-red-600 ml-7">{{ faq.error_message }}</p>
                    </div>
                    <button @click="handleRetryAction(faq)" :disabled="isProcessing(faq.id)" :class="[
                        'ml-3 px-3 py-1.5 text-xs font-medium rounded transition-colors',
                        isProcessing(faq.id)
                            ? 'bg-red-200 text-red-400 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                    ]">
                        <span v-if="isProcessing(faq.id)" class="inline-flex items-center">
                            <svg class="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Retrying...
                        </span>
                        <span v-else>{{ getRetryButtonLabel(faq.last_failed_action) }}</span>
                    </button>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div class="flex items-center space-x-2">
                    <!-- Priority Slider -->
                    <div class="flex items-center space-x-2">
                        <label class="text-sm text-gray-600">Priority:</label>
                        <input :value="faq.priority" @change="updatePriority(faq.id, $event.target.value)" type="range"
                            min="1" max="10" class="w-24" :disabled="isProcessing(faq.id)" />
                        <span class="text-sm font-medium text-gray-900 w-6">{{ faq.priority }}</span>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <!-- Edit Button (manual_qa only) -->
                    <button v-if="faq.source_type === 'manual_qa' && !isProcessing(faq.id)" @click="$emit('edit', faq)"
                        class="px-3 py-1.5 text-sm text-purple-700 border border-purple-300 rounded-md hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Edit Q&A
                    </button>

                    <!-- Preview Button -->
                    <button v-if="faq.status === 'completed' && !isProcessing(faq.id)" @click="$emit('preview', faq)"
                        class="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                        Preview
                    </button>

                    <!-- ✅ FIXED: Embed Button with loading state -->
                    <button v-if="faq.status === 'completed' && faq.embedded_items === 0" @click="$emit('embed', faq)"
                        :disabled="isProcessing(faq.id)" :class="[
                            'px-3 py-1.5 text-sm text-white rounded-md transition-colors',
                            isProcessing(faq.id)
                                ? 'bg-purple-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700'
                        ]">
                        <span v-if="isProcessing(faq.id)" class="inline-flex items-center">
                            <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Embedding...
                        </span>
                        <span v-else>Embed Now</span>
                    </button>

                    <!-- ✅ FIXED: Reprocess Button with loading state -->
                    <button v-if="faq.embedded_items > 0 && faq.status !== 'processing'"
                        @click="$emit('reprocess', faq)" :disabled="isProcessing(faq.id)" :class="[
                            'px-3 py-1.5 text-sm rounded-md border transition-colors',
                            isProcessing(faq.id)
                                ? 'text-purple-400 border-purple-200 cursor-not-allowed'
                                : 'text-purple-600 border-purple-200 hover:bg-purple-50'
                        ]">
                        <span v-if="isProcessing(faq.id)" class="inline-flex items-center">
                            <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Reprocessing...
                        </span>
                        <span v-else>Reprocess</span>
                    </button>

                    <!-- Toggle Active -->
                    <button v-if="faq.embedded_items > 0 && !isProcessing(faq.id)" @click="toggleActive(faq.id)" :class="[
                        'px-3 py-1.5 text-sm rounded-md transition-colors',
                        faq.is_active
                            ? 'text-yellow-700 border border-yellow-300 hover:bg-yellow-50'
                            : 'text-green-700 border border-green-300 hover:bg-green-50'
                    ]">
                        {{ faq.is_active ? 'Deactivate' : 'Activate' }}
                    </button>

                    <!-- ✅ FIXED: Delete Button with loading state -->
                    <button @click="$emit('delete', faq)" :disabled="isProcessing(faq.id)" :class="[
                        'p-2 rounded-md transition-colors',
                        isProcessing(faq.id)
                            ? 'text-red-300 cursor-not-allowed'
                            : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                    ]">
                        <svg v-if="!isProcessing(faq.id)" class="w-5 h-5" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// No changes to logic, just template updates
import { computed } from 'vue'

const props = defineProps({
    faqSources: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    processingJobs: {
        type: Set,
        default: () => new Set()
    }
})

const emit = defineEmits(['preview', 'edit', 'embed', 'reprocess', 'delete', 'toggle-active'])
const faqStore = useFAQStore()

// ✅ NEW: Check if FAQ is currently processing
const isProcessing = (faqId) => {
    return props.processingJobs.has(faqId)
}

const getStatusColor = (status) => {
    const colors = {
        pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
        completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        failed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
    }
    return colors[status] || 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-300'
}

// ✅ FIXED: User-friendly status labels
const getStatusLabel = (status) => {
    const labels = {
        pending: 'Queued',
        processing: 'Processing',
        completed: 'Ready',
        failed: 'Failed'
    }
    return labels[status] || status
}

const getSourceTypeLabel = (type) => {
    const labels = {
        manual_qa: 'Manual Q&A', pdf: 'PDF Document', docx: 'Word Document',
        excel: 'Excel File', csv: 'CSV File', txt: 'Text File', json: 'JSON File'
    }
    return labels[type] || type
}

const getProgressPercentage = (faq) => {
    if (faq.total_items === 0) return 0
    if (faq.status === 'pending') return 0
    return Math.round((faq.embedded_items / faq.total_items) * 100)
}

const updatePriority = async (faqId, newPriority) => {
    await faqStore.updatePriority(faqId, parseInt(newPriority))
}

const toggleActive = async (faqId) => {
    await faqStore.toggleActive(faqId)
}

// ✅ NEW: Get user-friendly failure titles
const getFailureTitle = (action) => {
    const titles = {
        'process': 'Document Processing Failed',
        'embed': 'Activation Failed',
        'delete': 'Deletion Failed',
        'reprocess': 'Reprocessing Failed'
    }
    return titles[action] || 'Action Failed'
}

// ✅ NEW: Get action-specific retry button labels
const getRetryButtonLabel = (action) => {
    const labels = {
        'process': 'Retry Processing',
        'embed': 'Retry Activation',
        'delete': 'Retry Deletion',
        'reprocess': 'Retry'
    }
    return labels[action] || 'Retry'
}

// ✅ NEW: Handle retry based on failed action
const handleRetryAction = (faq) => {
    switch (faq.last_failed_action) {
        case 'process':
            emit('retry', faq) // Reprocess from scratch
            break
        case 'embed':
            emit('embed', faq) // Retry embedding
            break
        case 'delete':
            emit('delete', faq) // Retry deletion
            break
        case 'reprocess':
            emit('reprocess', faq) // Retry reprocessing
            break
        default:
            emit('retry', faq)
    }
}
</script>

<style scoped>
@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}
.animate-shimmer {
    animation: shimmer 2s infinite;
}
</style>