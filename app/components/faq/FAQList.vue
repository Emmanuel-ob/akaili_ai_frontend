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
            class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sm:p-6 hover:shadow-md transition-shadow overflow-hidden">

            <!-- Header Section -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-3 sm:gap-0">
                <div class="flex-1 min-w-0">
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
                    </div>
                </div>

                <div class="flex sm:block shrink-0">
                    <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        Priority: {{ faq.priority }}
                    </span>
                </div>
            </div>

            <!-- Error Message -->
            <div v-if="faq.status === 'failed' && faq.error_message"
                class="mb-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-lg">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p class="text-sm font-bold text-red-800 dark:text-red-300">Action Failed</p>
                        <p class="text-xs text-red-700 dark:text-red-400 mt-1">{{ faq.error_message }}</p>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</label>
                        <input :value="faq.priority" @change="updatePriority(faq.id, $event.target.value)" type="range"
                            min="1" max="10" class="w-20 sm:w-24 accent-purple-600" />
                        <span class="text-sm font-bold text-gray-900 dark:text-white">{{ faq.priority }}</span>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <button v-if="faq.source_type === 'manual_qa' && faq.status !== 'processing' && faq.status !== 'pending'" @click="$emit('edit', faq)"
                        class="px-3 py-1.5 text-sm font-medium text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                        Edit
                    </button>

                    <button v-if="faq.status === 'completed'" @click="$emit('preview', faq)"
                        class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        Preview
                    </button>

                    <button v-if="faq.status === 'completed' && faq.embedded_items === 0" @click="$emit('embed', faq)"
                        class="px-3 py-1.5 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm">
                        Embed Now
                    </button>

                    <button v-if="faq.embedded_items > 0 && faq.status !== 'processing' && faq.status !== 'pending'" @click="$emit('reprocess', faq)"
                        class="px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                        Reprocess
                    </button>

                    <button v-if="faq.embedded_items > 0" @click="toggleActive(faq.id)" :class="[
                        'px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors',
                        faq.is_active
                            ? 'text-amber-700 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/50 hover:bg-amber-100'
                            : 'text-green-700 border-green-200 bg-green-50 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/50 hover:bg-green-100'
                    ]">
                        {{ faq.is_active ? 'Deactivate' : 'Activate' }}
                    </button>

                    <button @click="$emit('delete', faq)" 
                        class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
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
const props = defineProps({
    faqSources: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
})

const emit = defineEmits(['preview', 'edit', 'embed', 'reprocess', 'delete', 'toggle-active'])
const faqStore = useFAQStore()

const getStatusColor = (status) => {
    const colors = {
        pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
    const labels = { 
        pending: 'Processing', 
        processing: 'Processing', 
        completed: 'Ready', 
        failed: 'Error' 
    }
    return labels[status] || status
}

const getSourceTypeLabel = (type) => {
    const labels = { manual_qa: 'Manual Q&A', pdf: 'PDF', docx: 'Word', excel: 'Excel', csv: 'CSV', txt: 'Text', json: 'JSON' }
    return labels[type] || type
}

const updatePriority = async (faqId, newPriority) => {
    await faqStore.updatePriority(faqId, parseInt(newPriority))
}

const toggleActive = async (faqId) => {
    emit('toggle-active', faqId)
}
</script>