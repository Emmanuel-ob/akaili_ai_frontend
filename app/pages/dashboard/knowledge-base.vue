<!-- pages/dashboard/knowledge-base.vue -->
<template>
    <div class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <!-- Header -->
        <header
            class="bg-white dark:bg-slate-900 px-4 sm:px-6 py-5 border-b border-gray-200 dark:border-slate-800 transition-all duration-500 ease-out"
            :class="isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'">
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
                        class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors cursor-pointer">
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
            <!-- No Chatbot Selected State -->
            <div v-if="!selectedChatbotId"
                class="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 transition-all duration-700 delay-100"
                :class="isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'">
                <div class="bg-gray-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <p class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Chatbot</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Choose a chatbot above to manage its knowledge base</p>
            </div>

            <!-- Content Area -->
            <div v-else>
                <!-- Stats Cards (Staggered Animation 1) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-100"
                     :class="isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
                    <StatCard title="Total Sources" :value="faqStore.faqSources.length" icon="folder" color="blue" />
                    <StatCard title="Active Sources" :value="activeSources" icon="check" color="green" />
                    <StatCard title="Total Items" :value="totalItems" icon="document" color="purple" />
                    <StatCard title="Embedded Items" :value="embeddedItems" icon="database" color="yellow" />
                </div>

                <!-- Action Tabs (Staggered Animation 2) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 transition-all duration-700 delay-200"
                     :class="isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
                    <div @click="handleTabClick('upload')" :class="[
                        'cursor-pointer rounded-xl border p-6 transition-all duration-200 flex items-center justify-between group',
                        activeTab === 'upload'
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10 ring-1 ring-purple-500'
                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-700'
                    ]">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Upload Documents</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">PDF, Word, Excel, CSV, TXT, JSON</p>
                        </div>
                        <div class="p-3 rounded-lg" :class="activeTab === 'upload' ? 'bg-white dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-slate-800'">
                             <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                    </div>

                    <div @click="handleTabClick('manual')" :class="[
                        'cursor-pointer rounded-xl border p-6 transition-all duration-200 flex items-center justify-between group',
                        activeTab === 'manual'
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10 ring-1 ring-purple-500'
                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-700'
                    ]">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Manual Q&A</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Create question-answer pairs</p>
                        </div>
                        <div class="p-3 rounded-lg" :class="activeTab === 'manual' ? 'bg-white dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-slate-800'">
                            <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Forms Container (Staggered Animation 3) -->
                <div class="transition-all duration-700 delay-300"
                     :class="isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
                    <transition name="fade" mode="out-in">
                        <div v-if="activeTab === 'upload'" key="upload" class="mb-8">
                            <FAQUpload 
                                :chatbot-id="selectedChatbotId" 
                                @uploaded="handleUploaded"
                                @processing="isProcessing = $event"
                                @reload="triggerReloadAnimation" 
                            />
                        </div>

                        <div v-else-if="activeTab === 'manual'" key="manual" class="mb-8">
                            <FAQManualEntry 
                                :chatbot-id="selectedChatbotId" 
                                :editing-source="editingFAQ" 
                                @saved="handleSaved"
                                @processing="isProcessing = $event" 
                                @cancel="handleCancelEdit" 
                            />
                        </div>
                    </transition>
                </div>

                <!-- FAQ Sources List (Staggered Animation 4) -->
                <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sm:p-6 transition-all duration-700 delay-500"
                     :class="isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                        <div class="flex items-center gap-3">
                             <h3 class="text-lg font-semibold text-gray-900 dark:text-white">FAQ Sources</h3>
                             <span class="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                                {{ faqStore.faqSources.length }}
                             </span>
                        </div>
                        
                        <!-- REFRESH BUTTON (Auto-clicks logic attached to isRefreshing) -->
                        <button @click="triggerReloadAnimation" :disabled="isRefreshing || faqStore.loading"
                            class="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50 transition-all"
                            title="Refresh List">
                            <svg class="w-5 h-5 transition-transform duration-700" 
                                 :class="{ 'animate-spin': isRefreshing || faqStore.loading }" 
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>

                    <FAQList 
                        :faq-sources="faqStore.faqSources" 
                        :loading="faqStore.loading && !isRefreshing" 
                        @preview="handlePreview"
                        @edit="handleEdit" 
                        @embed="handleEmbed" 
                        @reprocess="handleReprocess" 
                        @delete="handleDelete" 
                        @toggle-active="handleToggleActive"
                    />
                </div>
            </div>
        </main>

        <!-- Preview/Editor Modal -->
        <FAQPreviewEditor 
            :show="showPreviewModal" 
            :faq-source="selectedFAQ" 
            @close="closePreviewModal"
            @saved="handleContentSaved" 
            @embedded="handleEmbedded" 
        />

        <!-- Delete Confirmation Modal -->
        <BaseModal :show="showDeleteModal" title="Delete Source" size="sm" @close="closeDeleteModal">
            <template #body>
                <div class="text-center py-2" @keydown.enter.prevent="confirmDelete" tabindex="0" ref="deleteModalContainer">
                    <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 dark:bg-red-500/10 mb-6 transition-colors duration-300">
                        <svg class="h-8 w-8 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete FAQ Source?</h3>
                    <p class="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Are you sure you want to delete <strong class="text-gray-900 dark:text-white">{{ faqToDelete?.source_name }}</strong>? This action cannot be undone.
                    </p>
                    <p class="text-xs text-gray-400 dark:text-slate-500 mt-4">
                        Press <kbd class="px-2 py-1 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 font-sans text-[10px]">Enter</kbd> to confirm
                    </p>
                </div>
                <div class="mt-8 flex justify-end gap-3">
                    <button @click="closeDeleteModal"
                        class="px-5 py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none transition-colors font-medium">
                        Cancel
                    </button>
                    <button @click="confirmDelete"
                        ref="deleteConfirmBtn"
                        class="px-5 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-900 transition-colors font-medium">
                        Delete Source
                    </button>
                </div>
            </template>
        </BaseModal>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// Import default export to handle CommonJS module
import { useToast } from "vue-toastification/dist/index.mjs" 
import FAQUpload from '~/components/faq/FAQUpload.vue'
import FAQManualEntry from '~/components/faq/FAQManualEntry.vue'
import FAQList from '~/components/faq/FAQList.vue'
import FAQPreviewEditor from '~/components/faq/FAQPreviewEditor.vue'
import StatCard from '~/components/StatCard.vue'
import ActionToast from '~/components/ActionToast.vue'
import BaseModal from '~/components/BaseModal.vue'

definePageMeta({
    layout: 'dashboard'
})

const faqStore = useFAQStore()
const chatbotStore = useChatbotStore()
const wsStore = useWebSocketStore()
const toast = useToast()

const COMPONENT_ID = 'knowledge-base-page'

// State
const selectedChatbotId = ref('')
const activeTab = ref('upload')
const isProcessing = ref(false)
const showPreviewModal = ref(false)
const selectedFAQ = ref(null)
const editingFAQ = ref(null)
const isRefreshing = ref(false)
const isPageLoaded = ref(false) // Controls entry animations

// Delete Modal State
const showDeleteModal = ref(false)
const faqToDelete = ref(null)
const deleteConfirmBtn = ref(null)
const deleteModalContainer = ref(null)

// Computed
const activeSources = computed(() => faqStore.faqSources.filter(faq => faq.is_active).length)
const totalItems = computed(() => faqStore.faqSources.reduce((sum, faq) => sum + (faq.total_items || 0), 0))
const embeddedItems = computed(() => faqStore.faqSources.reduce((sum, faq) => sum + (faq.embedded_items || 0), 0))

// --- GLOBAL RELOAD LOGIC ---
const triggerReloadAnimation = async () => {
    // This makes the SVG spin
    isRefreshing.value = true
    try {
        await faqStore.fetchFAQSources(selectedChatbotId.value)
    } catch (error) {
        console.error('Reload failed:', error)
    } finally {
        // Keep spinner for at least 600ms for visual feedback
        setTimeout(() => {
            isRefreshing.value = false
        }, 600)
    }
}

const onChatbotChange = async () => {
    if (selectedChatbotId.value) {
        await triggerReloadAnimation()
        editingFAQ.value = null
    }
}

// WebSocket Listeners
const setupEventListeners = () => {
    wsStore.on('faq.processing.completed', handleProcessingCompleted, COMPONENT_ID)
    wsStore.on('faq.processing.failed', handleProcessingFailed, COMPONENT_ID)
    wsStore.on('faq.embedding.completed', handleEmbeddingCompleted, COMPONENT_ID)
    wsStore.on('faq.embedding.failed', handleEmbeddingFailed, COMPONENT_ID)
    wsStore.on('faq.deletion.completed', handleDeletionCompleted, COMPONENT_ID)
    wsStore.on('job.progress.updated', handleProgressUpdated, COMPONENT_ID)
}

const handleProcessingCompleted = async (event) => {
    triggerReloadAnimation()
    toast.success({
        component: ActionToast,
        props: { type: 'success', title: 'Processing Complete', message: event.message, actionLabel: 'Review', onAction: () => { const faq = faqStore.faqSources.find(f => f.id === event.faq_source.id); if (faq) handlePreview(faq) } }
    }, { timeout: 8000 })
}

const handleProcessingFailed = async (event) => {
    triggerReloadAnimation()
    toast.error({
        component: ActionToast,
        props: { type: 'error', title: 'Processing Failed', message: event.message, actionLabel: 'Retry', onAction: async () => { const faq = faqStore.faqSources.find(f => f.id === event.faq_source.id); if (faq) await faqStore.reprocess(faq.id) } }
    }, { timeout: 10000 })
}

const handleEmbeddingCompleted = async (event) => {
    triggerReloadAnimation()
    toast.success(event.message, { timeout: 5000 })
}

const handleEmbeddingFailed = async (event) => {
    triggerReloadAnimation()
    toast.error({
        component: ActionToast,
        props: { type: 'error', title: 'Embedding Failed', message: event.message, actionLabel: 'Retry', onAction: async () => { const faq = faqStore.faqSources.find(f => f.id === event.faq_source.id); if (faq) await faqStore.confirmAndEmbed(faq.id) } }
    }, { timeout: 10000 })
}

const handleDeletionCompleted = async (event) => {
    triggerReloadAnimation()
    toast.success(event.message, { timeout: 3000 })
}

const handleProgressUpdated = (event) => {
    const faq = faqStore.faqSources.find(f => f.id === event.faq_source_id)
    if (faq) {
        faq.progress = event.progress
    }
}

// Button Actions
const handleTabClick = (tab) => {
    activeTab.value = tab
    if (tab !== 'manual') editingFAQ.value = null
}

const handleUploaded = () => {
    // 1. Immediate Visual Feedback
    toast.success("File Queued. It may take 30s - 1min to process.")
    triggerReloadAnimation()

    // 2. Set Timer to reload automatically at 30 seconds
    setTimeout(() => {
        console.log("30s timeout reached, refreshing list...")
        triggerReloadAnimation()
    }, 30000)
}

const handleSaved = () => {
    selectedFAQ.value = null 
    showPreviewModal.value = false
    editingFAQ.value = null
    triggerReloadAnimation()
    toast.success('Manual Q&A saved successfully!')
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
        triggerReloadAnimation()
    }
}

const handleReprocess = async (faqSource) => {
    if (confirm('This will delete existing embeddings and recreate them. Continue?')) {
        const result = await faqStore.reprocess(faqSource.id)
        if (result && result.success) {
            toast.info('Reprocessing job started...', { timeout: 3000 })
            triggerReloadAnimation()
        }
    }
}

const handleToggleActive = async (faqSource) => {
    // Immediate Reload animation + Toast
    try {
        await faqStore.toggleActive(faqSource.id)
        // Check new status (store should have updated it, or we toggle visually)
        const statusText = !faqSource.is_active ? 'Activated' : 'Deactivated'
        toast.success(`Source ${statusText} successfully`)
        triggerReloadAnimation()
    } catch (error) {
        toast.error('Failed to toggle status')
    }
}

// ----- DELETE LOGIC (Optimistic + Enter Key) -----
const handleDelete = (faqSource) => {
    faqToDelete.value = faqSource
    showDeleteModal.value = true
    
    // Focus the modal container so keydown works
    nextTick(() => {
        if (deleteModalContainer.value) {
            deleteModalContainer.value.focus()
        }
    })
    
    // Add global listener as backup
    window.addEventListener('keydown', handleEnterKey)
}

const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        confirmDelete()
    }
    if (e.key === 'Escape') {
        closeDeleteModal()
    }
}

const closeDeleteModal = () => {
    showDeleteModal.value = false
    faqToDelete.value = null
    window.removeEventListener('keydown', handleEnterKey)
}

const confirmDelete = async () => {
    if (!faqToDelete.value) return
    const id = faqToDelete.value.id

    // 1. Close Modal Immediately (Optimistic UI)
    closeDeleteModal()

    // 2. Perform Delete
    const result = await faqStore.deleteFAQ(id)
    
    // 3. Trigger Reload WITH DELAY
    if (result && result.success) {
        toast.info('Deletion job started...')
        // Wait 6 seconds before refreshing, as requested
        setTimeout(() => {
            triggerReloadAnimation()
        }, 10000)
    } else {
        toast.error('Failed to delete source')
        triggerReloadAnimation() 
    }
}
// ----------------------------------------------

const closePreviewModal = () => {
    showPreviewModal.value = false
    selectedFAQ.value = null
}

const handleContentSaved = () => {
    triggerReloadAnimation()
    toast.success('Content updated')
}

const handleEmbedded = () => {
    triggerReloadAnimation()
}

// Lifecycle
onMounted(async () => {
    // Wait slightly to trigger page entry animation
    setTimeout(() => {
        isPageLoaded.value = true
    }, 100)

    await chatbotStore.fetchChatbots()
    if (chatbotStore.chatbots.length > 0) {
        selectedChatbotId.value = chatbotStore.chatbots[0].id
        await onChatbotChange()
    }
    setupEventListeners()
})

onUnmounted(() => {
    wsStore.offAll(COMPONENT_ID)
    window.removeEventListener('keydown', handleEnterKey)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>