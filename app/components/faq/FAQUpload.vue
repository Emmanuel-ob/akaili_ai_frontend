<!-- components/faq/FAQUpload.vue -->
<template>
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Documents</h3>

        <!-- Real-time Progress Display -->
        <div v-if="currentJobProgress" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-blue-900 dark:text-blue-200">Processing File...</span>
                <span class="text-xs text-blue-600 dark:text-blue-400">{{ currentJobProgress.percentage || 0 }}%</span>
            </div>
            <div class="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
                <div class="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                    :style="{ width: (currentJobProgress.percentage || 0) + '%' }" />
            </div>
            <p class="text-xs text-blue-600 dark:text-blue-400 mt-2">{{ formatStep(currentJobProgress.step) }}</p>
        </div>

        <!-- Drag & Drop Area -->
        <div @drop.prevent="handleDrop" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
            :class="[
                'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                isDragging 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-600',
                uploading ? 'opacity-50 cursor-not-allowed' : ''
            ]">
            <input ref="fileInput" type="file" class="hidden" accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt,.json"
                @change="handleFileSelect" :disabled="uploading" />

            <div v-if="!selectedFile">
                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Drag and drop your file here, or</p>
                <button type="button" @click="$refs.fileInput.click()" :disabled="uploading"
                    class="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium disabled:opacity-50">
                    Browse files
                </button>
                <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Supported: PDF, Word, Excel, CSV, TXT, JSON (Max 10MB)
                </p>
            </div>

            <!-- Selected File Preview -->
            <div v-else class="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                <div class="flex items-center space-x-3">
                    <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div class="text-left">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedFile.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(selectedFile.size) }}</p>
                    </div>
                </div>
                <button @click="clearFile" :disabled="uploading" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Form Fields -->
        <div v-if="selectedFile" class="mt-6 space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Source Name <span class="text-red-500">*</span>
                </label>
                <input v-model="sourceName" type="text" placeholder="e.g., Product FAQs, Support Documentation"
                    :disabled="uploading"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 dark:disabled:bg-slate-700/50"
                    required />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Priority (1-10)
                </label>
                <div class="flex items-center space-x-4">
                    <input v-model.number="priority" type="range" min="1" max="10" :disabled="uploading"
                        class="flex-1" />
                    <span class="text-sm font-medium text-gray-900 dark:text-white w-8">{{ priority }}</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Higher priority sources are searched first
                </p>
            </div>

            <!-- Error Display -->
            <div v-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3">
                <button type="button" @click="clearFile" :disabled="uploading"
                    class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50">
                    Cancel
                </button>
                <button type="button" @click="handleUpload" :disabled="!sourceName || uploading"
                    class="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ uploading ? 'Uploading...' : 'Upload & Process' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
// ... (Script remains same as original)
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    chatbotId: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['uploaded', 'processing'])

const faqStore = useFAQStore()
const wsStore = useWebSocketStore()

const COMPONENT_ID = 'faq-upload-component'

const fileInput = ref(null)
const selectedFile = ref(null)
const sourceName = ref('')
const priority = ref(5)
const isDragging = ref(false)
const uploading = ref(false)
const error = ref('')
const currentJobProgress = ref(null)
const currentJobId = ref(null)
const currentFaqId = ref(null)

const handleDrop = (e) => {
    isDragging.value = false
    const files = e.dataTransfer.files
    if (files.length > 0) {
        validateAndSetFile(files[0])
    }
}

const handleFileSelect = (e) => {
    const files = e.target.files
    if (files.length > 0) {
        validateAndSetFile(files[0])
    }
}

const validateAndSetFile = (file) => {
    error.value = ''

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
        error.value = 'File size must be less than 10MB'
        return
    }

    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'text/plain',
        'application/json'
    ]

    if (!allowedTypes.includes(file.type)) {
        error.value = 'Unsupported file type. Please upload PDF, Word, Excel, CSV, TXT, or JSON.'
        return
    }

    selectedFile.value = file

    if (!sourceName.value) {
        sourceName.value = file.name.replace(/\.[^/.]+$/, '')
    }
}

const clearFile = () => {
    selectedFile.value = null
    sourceName.value = ''
    priority.value = 5
    error.value = ''
    currentJobProgress.value = null
    currentJobId.value = null
    currentFaqId.value = null

    if (fileInput.value) {
        fileInput.value.value = ''
    }

    uploading.value = false
}

const setupEventListeners = () => {
    wsStore.on('job.progress.updated', (event) => {
        if (event.job_id === currentJobId.value) {
            currentJobProgress.value = event.progress
        }
    }, COMPONENT_ID)

    wsStore.on('faq.processing.completed', (event) => {
        if (event.faq_source.id === currentFaqId.value) {
            clearFile()
            emit('uploaded', event.faq_source)
            emit('processing', false)
        }
    }, COMPONENT_ID)

    wsStore.on('faq.processing.failed', (event) => {
        if (event.faq_source.id === currentFaqId.value) {
            uploading.value = false
            error.value = event.error
            currentJobProgress.value = null
            emit('processing', false)
        }
    }, COMPONENT_ID)
}

const handleUpload = async () => {
    if (!selectedFile.value || !sourceName.value) return

    uploading.value = true
    error.value = ''
    emit('processing', true)

    const result = await faqStore.uploadFile(
        props.chatbotId,
        sourceName.value,
        selectedFile.value,
        priority.value
    )

    if (result.success) {
        currentJobId.value = result.data.job_id
        currentFaqId.value = result.data.id
    } else {
        uploading.value = false
        emit('processing', false)
        error.value = result.message
    }
}

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatStep = (step) => {
    if (!step) return 'Processing...'
    return step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

onMounted(() => {
    setupEventListeners()
})

onUnmounted(() => {
    wsStore.offAll(COMPONENT_ID)
})
</script>