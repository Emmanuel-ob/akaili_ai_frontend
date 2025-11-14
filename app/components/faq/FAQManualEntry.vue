<template>
    <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
                {{ editingSource ? 'Edit Q&A Pairs' : 'Manual Q&A Entry' }}
            </h3>
            <span class="text-sm text-gray-500">{{ qaPairs.length }} pairs</span>
        </div>

        <!-- Source Name -->
        <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
                Source Name <span class="text-red-500">*</span>
            </label>
            <input v-model="sourceName" type="text" placeholder="e.g., General FAQs, Pricing Questions"
                :disabled="!!editingSource"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
        </div>

        <!-- Priority Slider -->
        <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
                Priority (1-10)
            </label>
            <div class="flex items-center space-x-4">
                <input v-model.number="priority" type="range" min="1" max="10" class="flex-1" />
                <span class="text-sm font-medium text-gray-900 w-8">{{ priority }}</span>
            </div>
        </div>

        <!-- Q&A Pairs -->
        <div class="space-y-4 mb-4">
            <div v-for="(pair, index) in qaPairs" :key="index" class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-start justify-between mb-3">
                    <span class="text-sm font-medium text-gray-700">Pair {{ index + 1 }}</span>
                    <button v-if="qaPairs.length > 1" @click="removePair(index)"
                        class="text-red-500 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                <div class="space-y-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Question <span class="text-red-500">*</span>
                        </label>
                        <input v-model="pair.question" type="text" placeholder="What is your question?"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Answer <span class="text-red-500">*</span>
                        </label>
                        <textarea v-model="pair.answer" rows="3" placeholder="Provide a clear answer..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Add More Button -->
        <button type="button" @click="addPair"
            class="w-full py-2 text-sm text-purple-600 border border-purple-200 rounded-md hover:bg-purple-50 transition-colors">
            + Add Another Q&A Pair
        </button>

        <!-- Error Display -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="handleCancel"
                class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                {{ editingSource ? 'Cancel' : 'Reset' }}
            </button>
            <button type="button" @click="handleSubmit" :disabled="!canSubmit || saving"
                class="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                {{ saving ? 'Saving...' : (editingSource ? 'Update Q&A Pairs' : 'Save Q&A Pairs') }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    chatbotId: {
        type: String,
        required: true
    },
    editingSource: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['saved', 'processing', 'cancel'])

const faqStore = useFAQStore()

const sourceName = ref('')
const priority = ref(5)
const qaPairs = ref([
    { question: '', answer: '' }
])
const saving = ref(false)
const error = ref('')

// Declare resetForm before using it
const resetForm = () => {
    sourceName.value = ''
    priority.value = 5
    qaPairs.value = [{ question: '', answer: '' }]
    error.value = ''
}

const addPair = () => {
    qaPairs.value.push({ question: '', answer: '' })
}

const removePair = (index) => {
    if (qaPairs.value.length > 1) {
        qaPairs.value.splice(index, 1)
    }
}

const canSubmit = computed(() => {
    if (!props.editingSource && !sourceName.value) return false

    return qaPairs.value.every(pair =>
        pair.question.trim() && pair.answer.trim()
    )
})

// Watch for editing source changes
watch(() => props.editingSource, (source) => {
    if (source) {
        sourceName.value = source.source_name
        priority.value = source.priority

        // FIXED: Handle different data formats
        if (source.processed_content && source.processed_content.length > 0) {
            qaPairs.value = source.processed_content.map(item => {
                // Check if it's the new format with metadata
                if (item.metadata && item.metadata.type === 'qa_pair') {
                    return {
                        question: item.metadata.question || '',
                        answer: item.metadata.answer || ''
                    }
                }
                // Check if it's the old format with question/answer directly
                else if (item.question && item.answer) {
                    return {
                        question: item.question || '',
                        answer: item.answer || ''
                    }
                }
                // Fallback: try to parse from text field
                else if (item.text) {
                    const lines = item.text.split('\n')
                    let question = ''
                    let answer = ''

                    lines.forEach(line => {
                        if (line.startsWith('Q:')) {
                            question = line.substring(2).trim()
                        } else if (line.startsWith('A:')) {
                            answer = line.substring(2).trim()
                        }
                    })

                    return { question, answer }
                }
                // Final fallback
                return { question: '', answer: '' }
            })
        }
    } else {
        resetForm()
    }
}, { immediate: true })

const handleCancel = () => {
    if (props.editingSource) {
        emit('cancel')
    } else {
        resetForm()
    }
}

const handleSubmit = async () => {
    if (!canSubmit.value) return

    saving.value = true
    error.value = ''
    emit('processing', true)

    let result

    if (props.editingSource) {
        // Update existing source - format content properly
        const formattedContent = qaPairs.value.map(qa => ({
            text: `Q: ${qa.question}\nA: ${qa.answer}`,
            metadata: {
                type: 'qa_pair',
                question: qa.question,
                answer: qa.answer,
                source: 'manual_qa'
            }
        }))

        result = await faqStore.updateContent(props.editingSource.id, formattedContent)

        // Also update priority if changed
        if (priority.value !== props.editingSource.priority) {
            await faqStore.updatePriority(props.editingSource.id, priority.value)
        }
    } else {
        // Create new source - backend will format it properly
        result = await faqStore.createManualQA(
            props.chatbotId,
            sourceName.value,
            qaPairs.value, // Send simple {question, answer} format
            priority.value
        )
    }

    saving.value = false
    emit('processing', false)

    if (result.success) {
        emit('saved', result.data)
        if (!props.editingSource) {
            resetForm()
        }
    } else {
        error.value = result.message
    }
}
</script>