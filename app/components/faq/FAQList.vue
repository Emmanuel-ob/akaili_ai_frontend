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
                        <span :class="['px-2 py-0.5 text-xs font-medium rounded-full shrink-0', getStatusColor(faq.status)]">
                            {{ faq.status.toUpperCase() }}
                        </span>

                        <!-- Active Badge -->
                        <span v-if="faq.is_active"
                            class="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 shrink-0">
                            ACTIVE
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

            <!-- Error Message -->
            <div v-if="faq.status === 'failed' && faq.error_message"
                class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p class="text-sm text-red-600 dark:text-red-400">{{ faq.error_message }}</p>
            </div>

            <!-- Actions Footer -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-800 gap-4">
                <!-- Priority Slider -->
                <div class="flex items-center space-x-3 w-full sm:w-auto">
                    <label class="text-sm text-gray-600 dark:text-gray-400">Priority:</label>
                    <input :value="faq.priority" @change="updatePriority(faq.id, $event.target.value)" type="range"
                        min="1" max="10" class="flex-1 sm:w-24 accent-purple-600" :disabled="faq.status === 'processing'" />
                    <span class="text-sm font-medium text-gray-900 dark:text-white w-6 text-center">{{ faq.priority }}</span>
                </div>

                <!-- Buttons Container (Wrap on mobile) -->
                <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
                    <!-- Edit Button -->
                    <button v-if="faq.source_type === 'manual_qa' && faq.status !== 'processing'"
                        @click="$emit('edit', faq)"
                        class="flex-1 sm:flex-none px-3 py-1.5 text-sm text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-700 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 whitespace-nowrap">
                        Edit Q&A
                    </button>

                    <!-- Preview Button -->
                    <button v-if="faq.status === 'completed'" @click="$emit('preview', faq)"
                        class="flex-1 sm:flex-none px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 whitespace-nowrap">
                        Preview
                    </button>

                    <!-- Embed Button -->
                    <button v-if="faq.status === 'completed' && faq.embedded_items === 0" @click="$emit('embed', faq)"
                        class="flex-1 sm:flex-none px-3 py-1.5 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md whitespace-nowrap">
                        Embed Now
                    </button>

                    <!-- Reprocess Button -->
                    <button v-if="faq.embedded_items > 0 && faq.status !== 'processing'"
                        @click="$emit('reprocess', faq)"
                        class="flex-1 sm:flex-none px-3 py-1.5 text-sm text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 whitespace-nowrap">
                        Reprocess
                    </button>

                    <!-- Toggle Active -->
                    <button v-if="faq.embedded_items > 0 && faq.status !== 'processing'" @click="toggleActive(faq.id)"
                        :class="[
                            'flex-1 sm:flex-none px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap',
                            faq.is_active
                                ? 'text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                : 'text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                        ]">
                        {{ faq.is_active ? 'Deactivate' : 'Activate' }}
                    </button>

                    <!-- Delete Button -->
                    <button @click="$emit('delete', faq)" :disabled="faq.status === 'processing'"
                        class="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
    faqSources: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
})

const emit = defineEmits(['preview', 'edit', 'embed', 'reprocess', 'delete', 'toggle-active'])
const faqStore = useFAQStore()

const getStatusColor = (status) => {
    const colors = {
        pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
        completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        failed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
    }
    return colors[status] || 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-300'
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