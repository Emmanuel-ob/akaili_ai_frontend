<template>
    <BaseModal :show="show" :title="modalTitle" size="large" @close="$emit('close')">
        <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span class="ml-3 text-gray-600">Loading content...</span>
        </div>

        <div v-else-if="content && content.length">
            <!-- Mode Toggle -->
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center space-x-2">
                    <button @click="editMode = false" :class="[
                        'px-3 py-1.5 text-sm rounded-md',
                        !editMode ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                    ]">
                        Preview
                    </button>
                    <button @click="editMode = true" :class="[
                        'px-3 py-1.5 text-sm rounded-md',
                        editMode ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                    ]">
                        Edit
                    </button>
                </div>

                <span class="text-sm text-gray-600">{{ content.length }} items</span>
            </div>

            <!-- Preview Mode -->
            <div v-if="!editMode" class="space-y-4 max-h-96 overflow-y-auto">
                <div v-for="(item, index) in content" :key="index"
                    class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div class="flex items-start justify-between mb-2">
                        <span class="text-xs font-medium text-gray-500">Item {{ index + 1 }}</span>
                        <button @click="deleteItem(index)" class="text-red-500 hover:text-red-700">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Q&A Format -->
                    <div v-if="item.metadata?.type === 'qa_pair'" class="space-y-2">
                        <div>
                            <span class="text-sm font-medium text-gray-700">Q:</span>
                            <p class="text-sm text-gray-900 mt-1">{{ item.metadata.question }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-700">A:</span>
                            <p class="text-sm text-gray-900 mt-1">{{ item.metadata.answer }}</p>
                        </div>
                    </div>

                    <!-- Generic Text -->
                    <div v-else>
                        <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ item.text }}</p>
                    </div>

                    <!-- Metadata -->
                    <div v-if="item.metadata" class="mt-3 pt-3 border-t border-gray-100">
                        <div class="flex flex-wrap gap-2">
                            <span v-for="(value, key) in getDisplayMetadata(item.metadata)" :key="key"
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                {{ key }}: {{ value }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Edit Mode -->
            <div v-else class="space-y-4 max-h-96 overflow-y-auto">
                <div v-for="(item, index) in editableContent" :key="index"
                    class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-start justify-between mb-3">
                        <span class="text-sm font-medium text-gray-700">Item {{ index + 1 }}</span>
                        <button @click="deleteItem(index)" class="text-red-500 hover:text-red-700">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <!-- Q&A Edit -->
                    <div v-if="item.metadata?.type === 'qa_pair'" class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Question</label>
                            <input v-model="item.metadata.question" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                            <textarea v-model="item.metadata.answer" rows="3"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500" />
                        </div>
                    </div>

                    <!-- Generic Text Edit -->
                    <div v-else>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea v-model="item.text" rows="4"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500" />
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button v-if="editMode && hasChanges" @click="resetChanges"
                    class="text-sm text-gray-600 hover:text-gray-800">
                    Reset Changes
                </button>
                <div v-else></div>

                <div class="flex space-x-3">
                    <button @click="$emit('close')"
                        class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancel
                    </button>
                    <button v-if="editMode" @click="saveChanges" :disabled="saving || !hasChanges"
                        class="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50">
                        {{ saving ? 'Saving...' : 'Save Changes' }}
                    </button>
                    <button v-else-if="faqSource?.status === 'completed' && !faqSource?.is_active"
                        @click="confirmAndEmbed" :disabled="embedding"
                        class="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50">
                        {{ embedding ? 'Embedding...' : 'Confirm & Embed' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500">
            No content available
        </div>
    </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    show: Boolean,
    faqSource: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'saved', 'embedded'])

const faqStore = useFAQStore()

const loading = ref(false)
const saving = ref(false)
const embedding = ref(false)
const editMode = ref(false)
const content = ref([])
const editableContent = ref([])
const originalContent = ref([])

const modalTitle = computed(() => {
    return props.faqSource?.source_name || 'FAQ Preview'
})

const hasChanges = computed(() => {
    return JSON.stringify(editableContent.value) !== JSON.stringify(originalContent.value)
})

watch(() => props.show, async (show) => {
    if (show && props.faqSource) {
        await loadContent()
    } else {
        // Reset when modal closes
        editMode.value = false
        content.value = []
        editableContent.value = []
        originalContent.value = []
    }
})

const loadContent = async () => {
    loading.value = true

    const result = await faqStore.previewFAQ(props.faqSource.id)

    if (result.success) {
        content.value = result.content
        editableContent.value = JSON.parse(JSON.stringify(result.content))
        originalContent.value = JSON.parse(JSON.stringify(result.content))
    }

    loading.value = false
}

const getDisplayMetadata = (metadata) => {
    const display = {}
    const excludeKeys = ['type', 'question', 'answer', 'source']

    Object.keys(metadata).forEach(key => {
        if (!excludeKeys.includes(key) && metadata[key]) {
            display[key] = metadata[key]
        }
    })

    return display
}

const deleteItem = (index) => {
    if (confirm('Are you sure you want to delete this item?')) {
        if (editMode.value) {
            editableContent.value.splice(index, 1)
        } else {
            content.value.splice(index, 1)
            editableContent.value.splice(index, 1)
            originalContent.value.splice(index, 1)
        }
    }
}

const resetChanges = () => {
    editableContent.value = JSON.parse(JSON.stringify(originalContent.value))
}

const saveChanges = async () => {
    saving.value = true

    // Sync text with metadata for Q&A pairs
    editableContent.value.forEach(item => {
        if (item.metadata?.type === 'qa_pair') {
            item.text = `Q: ${item.metadata.question}\nA: ${item.metadata.answer}`
        }
    })

    const result = await faqStore.updateContent(props.faqSource.id, editableContent.value)

    saving.value = false

    if (result.success) {
        content.value = JSON.parse(JSON.stringify(editableContent.value))
        originalContent.value = JSON.parse(JSON.stringify(editableContent.value))
        editMode.value = false
        emit('saved')
    }
}

const confirmAndEmbed = async () => {
    embedding.value = true

    const result = await faqStore.confirmAndEmbed(props.faqSource.id)

    embedding.value = false

    if (result.success) {
        emit('embedded', result.embedded_count)
        emit('close')
    }
}
</script>