<!-- EmailPreviewModal.vue -->
<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                    <h2 class="text-xl font-bold text-gray-900">Email Preview</h2>
                    <p v-if="subject" class="text-sm text-gray-600 mt-1">Subject: {{ subject }}</p>
                </div>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Device Selector -->
            <div class="flex items-center justify-center gap-2 p-4 border-b border-gray-200 bg-gray-50">
                <button @click="device = 'desktop'" :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    device === 'desktop'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                ]">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Desktop
                </button>
                <button @click="device = 'mobile'" :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    device === 'mobile'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                ]">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Mobile
                </button>
            </div>

            <!-- Preview Body -->
            <div class="flex-1 overflow-y-auto p-6 bg-gray-100 flex items-start justify-center">
                <div :class="[
                    'bg-white shadow-lg',
                    device === 'mobile' ? 'w-full max-w-sm' : 'w-full'
                ]">
                    <div v-html="htmlContent" class="email-preview"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    htmlContent: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        default: ''
    }
})

defineEmits(['close'])

const device = ref('desktop')
</script>

<style scoped>
.email-preview {
    min-height: 400px;
}

.email-preview :deep(img) {
    max-width: 100%;
    height: auto;
}

.email-preview :deep(table) {
    border-collapse: collapse;
    width: 100%;
}
</style>