<template>
    <div class="space-y-4">
        <!-- Empty State -->
        <div v-if="!faqSources.length && !loading"
            class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-lg font-medium text-gray-700 mb-2">No FAQ sources yet</p>
            <p class="text-sm text-gray-500">Upload documents or create manual Q&A pairs to get started</p>
        </div>

        <!-- FAQ Source Cards -->
        <div v-for="faq in faqSources" :key="faq.id"
            class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">

            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <div class="flex items-center space-x-3">
                        <h3 class="text-lg font-semibold text-gray-900">{{ faq.source_name }}</h3>

                        <!-- Status Badge -->
                        <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusColor(faq.status)]">
                            {{ faq.status.toUpperCase() }}
                        </span>

                        <!-- Active Badge -->
                        <span v-if="faq.is_active"
                            class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            ACTIVE
                        </span>
                    </div>

                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {{ getSourceTypeLabel(faq.source_type) }}
                        </span>
                        <span v-if="faq.file_name">{{ faq.file_name }}</span>
                        <span>{{ faq.total_items || 0 }} items</span>
                        <span v-if="faq.embedded_items">{{ faq.embedded_items }} embedded</span>
                    </div>
                </div>

                <!-- Priority Badge -->
                <div class="ml-4">
                    <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Priority: {{ faq.priority }}
                    </span>
                </div>
            </div>

            <!-- Progress Bar (if processing or pending) -->
            <div v-if="faq.status === 'processing' || faq.status === 'pending'" class="mb-4">
                <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>{{ faq.status === 'pending' ? 'Queued...' : 'Processing...' }}</span>
                    <span>{{ getProgressPercentage(faq) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: getProgressPercentage(faq) + '%' }">
                        <div v-if="faq.status === 'processing'"
                            class="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
                    </div>
                </div>
            </div>

            <!-- Error Message -->
            <div v-if="faq.status === 'failed' && faq.error_message"
                class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p class="text-sm text-red-600">{{ faq.error_message }}</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div class="flex items-center space-x-2">
                    <!-- Priority Slider -->
                    <div class="flex items-center space-x-2">
                        <label class="text-sm text-gray-600">Priority:</label>
                        <input :value="faq.priority" @change="updatePriority(faq.id, $event.target.value)" type="range"
                            min="1" max="10" class="w-24" :disabled="faq.status === 'processing'" />
                        <span class="text-sm font-medium text-gray-900 w-6">{{ faq.priority }}</span>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <!-- Edit Button (manual_qa only) -->
                    <button v-if="faq.source_type === 'manual_qa' && faq.status !== 'processing'"
                        @click="$emit('edit', faq)"
                        class="px-3 py-1.5 text-sm text-purple-700 border border-purple-300 rounded-md hover:bg-purple-50">
                        Edit Q&A
                    </button>

                    <!-- Preview Button -->
                    <button v-if="faq.status === 'completed'" @click="$emit('preview', faq)"
                        class="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                        Preview
                    </button>

                    <!-- Embed Button (if not embedded) -->
                    <button v-if="faq.status === 'completed' && faq.embedded_items === 0" @click="$emit('embed', faq)"
                        class="px-3 py-1.5 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md">
                        Embed Now
                    </button>

                    <!-- Reprocess Button -->
                    <button v-if="faq.embedded_items > 0 && faq.status !== 'processing'"
                        @click="$emit('reprocess', faq)"
                        class="px-3 py-1.5 text-sm text-purple-600 border border-purple-200 rounded-md hover:bg-purple-50">
                        Reprocess
                    </button>

                    <!-- Toggle Active -->
                    <button v-if="faq.embedded_items > 0 && faq.status !== 'processing'" @click="toggleActive(faq.id)"
                        :class="[
                            'px-3 py-1.5 text-sm rounded-md transition-colors',
                            faq.is_active
                                ? 'text-yellow-700 border border-yellow-300 hover:bg-yellow-50'
                                : 'text-green-700 border border-green-300 hover:bg-green-50'
                        ]">
                        {{ faq.is_active ? 'Deactivate' : 'Activate' }}
                    </button>

                    <!-- Delete Button -->
                    <button @click="$emit('delete', faq)" :disabled="faq.status === 'processing'"
                        class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
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
import { computed } from 'vue'

const props = defineProps({
    faqSources: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['preview', 'edit', 'embed', 'reprocess', 'delete'])

const faqStore = useFAQStore()

const getStatusColor = (status) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
}

const getSourceTypeLabel = (type) => {
    const labels = {
        manual_qa: 'Manual Q&A',
        pdf: 'PDF Document',
        docx: 'Word Document',
        excel: 'Excel File',
        csv: 'CSV File',
        txt: 'Text File',
        json: 'JSON File'
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
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}

.animate-shimmer {
    animation: shimmer 2s infinite;
}
</style>