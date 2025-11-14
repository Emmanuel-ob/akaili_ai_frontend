<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-gray-900">Import Contacts</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Select Email List *</label>
                    <select v-model="selectedList"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required>
                        <option value="">Choose a list...</option>
                        <option v-for="list in emailStore.lists" :key="list.id" :value="list.id">
                            {{ list.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                        @click="$refs.fileInput.click()" @dragover.prevent @drop.prevent="handleDrop">
                        <input ref="fileInput" type="file" accept=".csv" @change="handleFileSelect" class="hidden" />

                        <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>

                        <p v-if="!selectedFile" class="text-gray-600 mb-2">
                            Click to upload or drag and drop
                        </p>
                        <p v-else class="text-purple-600 font-medium mb-2">
                            {{ selectedFile.name }}
                        </p>
                        <p class="text-sm text-gray-500">CSV file only</p>
                    </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-blue-900 mb-2">CSV Format Requirements:</h4>
                    <ul class="text-sm text-blue-700 space-y-1 list-disc list-inside">
                        <li>First row should contain headers</li>
                        <li>Required columns: <code class="bg-blue-100 px-1 rounded">first_name</code>, <code
                                class="bg-blue-100 px-1 rounded">email</code></li>
                        <li>Optional columns: <code class="bg-blue-100 px-1 rounded">last_name</code>, <code
                                class="bg-blue-100 px-1 rounded">phone</code>, <code
                                class="bg-blue-100 px-1 rounded">company_name</code></li>
                        <li>Tags can be added as comma-separated values in a <code
                                class="bg-blue-100 px-1 rounded">tags</code> column</li>
                    </ul>
                </div>

                <div v-if="importing" class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                        <span class="text-sm text-gray-700">Importing contacts...</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-purple-600 h-2 rounded-full transition-all" :style="{ width: progress + '%' }">
                        </div>
                    </div>
                </div>

                <div v-if="importResult" :class="[
                    'rounded-lg p-4',
                    importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                ]">
                    <p :class="[
                        'font-medium mb-2',
                        importResult.success ? 'text-green-900' : 'text-red-900'
                    ]">
                        {{ importResult.message }}
                    </p>
                    <div v-if="importResult.stats" class="text-sm space-y-1"
                        :class="importResult.success ? 'text-green-700' : 'text-red-700'">
                        <p>Total processed: {{ importResult.stats.total }}</p>
                        <p>Successful: {{ importResult.stats.success }}</p>
                        <p v-if="importResult.stats.failed > 0">Failed: {{ importResult.stats.failed }}</p>
                        <p v-if="importResult.stats.duplicates > 0">Duplicates skipped: {{
                            importResult.stats.duplicates }}</p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button @click="$emit('close')" class="px-6 py-2 text-gray-600 hover:text-gray-900">
                    Cancel
                </button>
                <button @click="importContacts" :disabled="!canImport || importing" :class="[
                    'px-6 py-2 rounded-lg font-medium',
                    canImport && !importing
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]">
                    {{ importing ? 'Importing...' : 'Import Contacts' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

const emit = defineEmits(['close', 'imported'])

const emailStore = useEmailMarketingStore()
const $toast = useToast()

const selectedList = ref('')
const selectedFile = ref(null)
const importing = ref(false)
const progress = ref(0)
const importResult = ref(null)

const canImport = computed(() => {
    return selectedList.value && selectedFile.value
})

const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
        selectedFile.value = file
        importResult.value = null
    } else {
        $toast.error('Please select a valid CSV file')
    }
}

const handleDrop = (event) => {
    const file = event.dataTransfer.files[0]
    if (file && file.type === 'text/csv') {
        selectedFile.value = file
        importResult.value = null
    } else {
        $toast.error('Please drop a valid CSV file')
    }
}

const importContacts = async () => {
    if (!canImport.value) return

    importing.value = true
    progress.value = 0
    importResult.value = null

    try {
        // Simulate progress
        const progressInterval = setInterval(() => {
            if (progress.value < 90) {
                progress.value += 10
            }
        }, 200)

        const result = await emailStore.importContacts(selectedFile.value, selectedList.value)

        clearInterval(progressInterval)
        progress.value = 100

        importResult.value = {
            success: true,
            message: 'Contacts imported successfully!',
            stats: result
        }

        setTimeout(() => {
            emit('imported')
        }, 1500)

    } catch (error) {
        importResult.value = {
            success: false,
            message: error.response?.data?.message || 'Import failed'
        }
        $toast.error('Failed to import contacts')
    } finally {
        importing.value = false
    }
}
</script>