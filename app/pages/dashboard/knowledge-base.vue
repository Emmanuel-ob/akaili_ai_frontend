<!-- dashboard/knowledge-base.vue -->
<template>
    <div class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <!-- Header -->
        <header
            class="bg-white dark:bg-slate-900 px-4 sm:px-6 py-5 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-[#9E4CFF] text-2xl font-bold">Knowledge Base</h1>
                    <p class="text-sm lg:text-base text-gray-500 dark:text-gray-400 mt-1">
                        Manage your chatbot's FAQ sources and training data
                    </p>
                </div>

                <div class="w-full sm:w-auto">
                    <!-- Chatbot Selector -->
                    <select v-model="selectedChatbotId" @change="onChatbotChange"
                        class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                        <option value="">Select Chatbot</option>
                        <option v-for="bot in chatbotStore.chatbots" :key="bot.id" :value="bot.id">
                            {{ bot.name }}
                        </option>
                    </select>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="px-4 sm:px-6 py-6 sm:py-8">
            <!-- No Chatbot Selected -->
            <div v-if="!selectedChatbotId"
                class="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 transition-colors">
                <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p class="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Select a Chatbot</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Choose a chatbot to manage its knowledge base</p>
            </div>

            <!-- Main Content -->
            <div v-else>
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard title="Total Sources" :value="faqStore.faqSources.length" icon="folder" color="blue" />
                    <StatCard title="Active Sources" :value="activeSources" icon="check" color="green" />
                    <StatCard title="Total Items" :value="totalItems" icon="document" color="purple" />
                    <StatCard title="Embedded Items" :value="embeddedItems" icon="database" color="yellow" />
                </div>

                <!-- Action Tabs -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div @click="handleTabClick('upload')" :class="[
                        'cursor-pointer rounded-xl border-2 p-6 transition-all duration-200',
                        activeTab === 'upload'
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-700'
                    ]">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Upload Documents</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">PDF, Word, Excel, CSV, TXT,
                                    JSON</p>
                            </div>
                            <svg class="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                    </div>

                    <div @click="handleTabClick('manual')" :class="[
                        'cursor-pointer rounded-xl border-2 p-6 transition-all duration-200',
                        activeTab === 'manual'
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-700'
                    ]">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Manual Q&A</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Create question-answer pairs
                                </p>
                            </div>
                            <svg class="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Upload/Manual Entry Forms -->
                <div v-if="activeTab === 'upload'" class="mb-8">
                    <FAQUpload :chatbot-id="selectedChatbotId" @uploaded="handleUploaded"
                        @processing="isProcessing = $event" />
                </div>

                <div v-if="activeTab === 'manual'" class="mb-8">
                    <FAQManualEntry :chatbot-id="selectedChatbotId" :editing-source="editingFAQ" @saved="handleSaved"
                        @processing="isProcessing = $event" @cancel="handleCancelEdit" />
                </div>

                <!-- FAQ Sources List -->
                <div
                    class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sm:p-6 transition-colors duration-300">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">FAQ Sources</h3>
                        <button @click="refreshList" :disabled="faqStore.loading"
                            class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 transition-colors self-end sm:self-auto">
                            <svg class="w-5 h-5" :class="{ 'animate-spin': faqStore.loading }" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>

                    <FAQList :faq-sources="faqStore.faqSources" :loading="faqStore.loading" @preview="handlePreview"
                        @edit="handleEdit" @embed="handleEmbed" @reprocess="handleReprocess" @delete="handleDelete" />
                </div>
            </div>
        </main>

        <!-- Preview/Editor Modal -->
        <FAQPreviewEditor :show="showPreviewModal" :faq-source="selectedFAQ" @close="closePreviewModal"
            @saved="handleContentSaved" @embedded="handleEmbedded" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import FAQUpload from '~/components/faq/FAQUpload.vue'
import FAQManualEntry from '~/components/faq/FAQManualEntry.vue'
import FAQList from '~/components/faq/FAQList.vue'
import FAQPreviewEditor from '~/components/faq/FAQPreviewEditor.vue'
import StatCard from '~/components/StatCard.vue'
import ActionToast from '~/components/ActionToast.vue'

definePageMeta({
    layout: 'dashboard'
})

const faqStore = useFAQStore()
const chatbotStore = useChatbotStore()
const wsStore = useWebSocketStore()
const toast = useToast()

const COMPONENT_ID = 'knowledge-base-page'

const selectedChatbotId = ref('')
const activeTab = ref('upload')
const isProcessing = ref(false)
const showPreviewModal = ref(false)
const selectedFAQ = ref(null)
const editingFAQ = ref(null)

const activeSources = computed(() => {
    return faqStore.faqSources.filter(faq => faq.is_active).length
})

const totalItems = computed(() => {
    return faqStore.faqSources.reduce((sum, faq) => sum + (faq.total_items || 0), 0)
})

const embeddedItems = computed(() => {
    return faqStore.faqSources.reduce((sum, faq) => sum + (faq.embedded_items || 0), 0)
})

const onChatbotChange = async () => {
    if (selectedChatbotId.value) {
        await faqStore.fetchFAQSources(selectedChatbotId.value)
        editingFAQ.value = null
    }
}

const setupEventListeners = () => {
    // Register event handlers for this page
    wsStore.on('faq.processing.completed', handleProcessingCompleted, COMPONENT_ID)
    wsStore.on('faq.processing.failed', handleProcessingFailed, COMPONENT_ID)
    wsStore.on('faq.embedding.completed', handleEmbeddingCompleted, COMPONENT_ID)
    wsStore.on('faq.embedding.failed', handleEmbeddingFailed, COMPONENT_ID)
    wsStore.on('faq.deletion.completed', handleDeletionCompleted, COMPONENT_ID)
    wsStore.on('job.progress.updated', handleProgressUpdated, COMPONENT_ID)
}

const handleProcessingCompleted = async (event) => {
    await refreshList()

    // Show toast with action button
    toast.success({
        component: ActionToast,
        props: {
            type: 'success',
            title: 'Processing Complete',
            message: event.message,
            actionLabel: 'Review Now',
            onAction: () => {
                const faq = faqStore.faqSources.find(f => f.id === event.faq_source.id)
                if (faq) handlePreview(faq)
            }
        }
    }, { timeout: 8000 })
}

const handleProcessingFailed = async (event) => {
    await refreshList()

    toast.error({
        component: ActionToast,
        props: {
            type: 'error',
            title: 'Processing Failed',
            message: event.message,
            actionLabel: 'Retry',
            onAction: async () => {
                const faq = faqStore.faqSources.find(f => f.id === event.faq_source.id)
                if (faq) await faqStore.reprocess(faq.id)
            }
        }
    }, { timeout: 10000 })
}

const handleEmbeddingCompleted = async (event) => {
    await refreshList()
    toast.success(event.message, { timeout: 5000 })
}

const handleEmbeddingFailed = async (event) => {
    await refreshList()

    toast.error({
        component: ActionToast,
        props: {
            type: 'error',
            title: 'Embedding Failed',
            message: event.message,
            actionLabel: 'Retry',
            onAction: async () => {
                const faq = faqStore.faqSources.find(f => f.id === event.faq_source.id)
                if (faq) await faqStore.confirmAndEmbed(faq.id)
            }
        }
    }, { timeout: 10000 })
}

const handleDeletionCompleted = async (event) => {
    await refreshList()
    toast.success(event.message, { timeout: 3000 })
}

const handleProgressUpdated = (event) => {
    const faq = faqStore.faqSources.find(f => f.id === event.faq_source_id)
    if (faq) {
        faq.progress = event.progress
    }
}

const refreshList = async () => {
    if (selectedChatbotId.value) {
        await faqStore.fetchFAQSources(selectedChatbotId.value)
    }
}

const handleTabClick = (tab) => {
    activeTab.value = tab
    if (tab !== 'manual') {
        editingFAQ.value = null
    }
}

const handleUploaded = async (faqSource) => {
    await refreshList()
}

const handleSaved = async (faqSource) => {
    selectedFAQ.value = faqSource
    showPreviewModal.value = true
    await refreshList()
    editingFAQ.value = null
}

const handlePreview = (faqSource) => {
    selectedFAQ.value = faqSource
    showPreviewModal.value = true
}

const handleEdit = (faqSource) => {
    editingFAQ.value = faqSource
    activeTab.value = 'manual'
}

const handleCancelEdit = () => {
    editingFAQ.value = null
    activeTab.value = 'upload'
}

const handleEmbed = async (faqSource) => {
    const result = await faqStore.confirmAndEmbed(faqSource.id)
    if (result && result.success) {
        toast.info('Embedding job started...', { timeout: 3000 })
    }
}

const handleReprocess = async (faqSource) => {
    if (confirm('This will delete existing embeddings and recreate them. Continue?')) {
        const result = await faqStore.reprocess(faqSource.id)
        if (result && result.success) {
            toast.info('Reprocessing job started...', { timeout: 3000 })
        }
    }
}

const handleDelete = async (faqSource) => {
    if (confirm('Are you sure you want to delete this FAQ source? This action cannot be undone.')) {
        const result = await faqStore.deleteFAQ(faqSource.id)
        if (result && result.success) {
            toast.info('Deletion job started...', { timeout: 3000 })
        }
    }
}

const closePreviewModal = () => {
    showPreviewModal.value = false
    selectedFAQ.value = null
}

const handleContentSaved = async () => {
    await refreshList()
}

const handleEmbedded = async (count) => {
    await refreshList()
}

onMounted(async () => {
    await chatbotStore.fetchChatbots()

    if (chatbotStore.chatbots.length > 0) {
        selectedChatbotId.value = chatbotStore.chatbots[0].id
        await onChatbotChange()
    }

    // Set up event listeners
    setupEventListeners()
})

onUnmounted(() => {
    // Clean up event listeners for this component
    wsStore.offAll(COMPONENT_ID)
})
</script>