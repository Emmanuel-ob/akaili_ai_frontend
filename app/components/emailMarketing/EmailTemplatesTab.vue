<template>
    <div>
        <!-- Header Actions -->
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
                <input v-model="emailStore.filters.templates.search" @input="debouncedSearch" type="text"
                    placeholder="Search templates..."
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <select v-model="emailStore.filters.templates.category" @change="emailStore.fetchTemplates()"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">All Categories</option>
                    <option v-for="cat in emailStore.templateCategories" :key="cat" :value="cat">
                        {{ cat }}
                    </option>
                </select>
                <select v-model="emailStore.filters.templates.ownership" @change="emailStore.fetchTemplates()"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="all">All Templates</option>
                    <option value="my">My Templates</option>
                    <option value="global">Global Templates</option>
                </select>
            </div>
            <button @click="createTemplate"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                New Template
            </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-lg border border-gray-200 p-4">
                <p class="text-sm text-gray-600 mb-1">Total Templates</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalTemplatesCount }}</p>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 p-4">
                <p class="text-sm text-gray-600 mb-1">My Templates</p>
                <p class="text-2xl font-bold text-purple-600">{{ myTemplatesCount }}</p>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 p-4">
                <p class="text-sm text-gray-600 mb-1">Global Templates</p>
                <p class="text-2xl font-bold text-blue-600">{{ globalTemplatesCount }}</p>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="emailStore.templatesLoading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="emailStore.templates.length === 0" class="text-center py-12">
            <div class="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No templates yet</h3>
            <p class="text-gray-600 mb-4">Create your first email template</p>
            <button @click="createTemplate" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Create Template
            </button>
        </div>

        <!-- Templates Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="template in emailStore.templates" :key="template.id"
                class="border border-gray-200 rounded-lg overflow-hidden hover:border-purple-300 hover:shadow-lg transition-all group bg-white">
                <!-- Thumbnail with better fallback -->
                <div class="aspect-video bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
                    <!-- Try to show thumbnail -->
                    <img v-if="template.thumbnail" :src="template.thumbnail" :alt="template.name"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        @error="handleImageError" />

                    <!-- Show rendered preview from HTML if no thumbnail -->
                    <iframe v-else-if="template.html_content" :srcdoc="getPreviewHTML(template)"
                        class="w-full h-full pointer-events-none border-0 scale-50 origin-top-left"
                        style="width: 200%; height: 200%;" sandbox=""></iframe>

                    <!-- Fallback icon -->
                    <div v-else class="w-full h-full flex flex-col items-center justify-center">
                        <svg class="w-16 h-16 text-purple-300 mb-2" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p class="text-sm text-purple-400">{{ template.name }}</p>
                    </div>

                    <!-- Badges -->
                    <div class="absolute top-2 right-2 flex flex-col gap-1">
                        <span v-if="template.is_global" class="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                            Global
                        </span>
                        <span v-else class="px-2 py-1 bg-purple-500 text-white text-xs rounded">
                            My Template
                        </span>
                        <span v-if="template.status === 'draft'"
                            class="px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                            Draft
                        </span>
                    </div>
                </div>

                <!-- Info -->
                <div class="p-4">
                    <h3 class="font-semibold text-gray-900 mb-1">{{ template.name }}</h3>
                    <p v-if="template.description" class="text-sm text-gray-600 mb-2 line-clamp-2">
                        {{ template.description }}
                    </p>

                    <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span v-if="template.category">{{ template.category }}</span>
                        <span v-if="template.usage_count">{{ template.usage_count }} uses</span>
                    </div>

                    <!-- Tags -->
                    <div v-if="template.tags && template.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
                        <span v-for="tag in template.tags.slice(0, 3)" :key="tag"
                            class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {{ tag }}
                        </span>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-2">
                        <button @click="previewTemplate(template)" :disabled="actionLoading[template.id]"
                            class="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                            <span v-if="actionLoading[template.id]">Loading...</span>
                            <span v-else>Preview</span>
                        </button>

                        <template v-if="template.is_editable !== false && !template.is_global">
                            <button @click="editTemplate(template)"
                                class="px-3 py-2 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50"
                                title="Edit">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        </template>

                        <button @click="duplicateTemplate(template)" :disabled="actionLoading[template.id]"
                            class="px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                            title="Duplicate">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>

                        <button v-if="!template.is_global" @click="deleteTemplate(template)"
                            :disabled="actionLoading[template.id]"
                            class="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
                            title="Delete">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Fullscreen Template Editor -->
        <TemplateEditorFullscreen v-if="showEditorModal" :template="selectedTemplate" @close="closeEditor"
            @saved="handleTemplateSaved" />

        <!-- Preview Modal (Scrollable) -->
        <EmailPreviewModal v-if="showPreviewModal" :html-content="previewHtml" :subject="previewSubject"
            @close="closePreview" />

        <!-- Duplicate Name Modal -->
        <div v-if="showDuplicateModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg w-full max-w-md p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Duplicate Template</h3>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">New Template Name</label>
                    <input v-model="duplicateName" type="text" placeholder="Enter template name..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        @keyup.enter="confirmDuplicate" />
                </div>
                <div class="flex items-center justify-end gap-3">
                    <button @click="showDuplicateModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-900">
                        Cancel
                    </button>
                    <button @click="confirmDuplicate" :disabled="!duplicateName || duplicating" :class="[
                        'px-4 py-2 rounded-lg',
                        duplicateName && !duplicating
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ]">
                        {{ duplicating ? 'Duplicating...' : 'Duplicate' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { debounce } from 'lodash-es'
import TemplateEditorFullscreen from './TemplateEditorFullscreen.vue'
import EmailPreviewModal from './EmailPreviewModal.vue'
import { useToast } from 'vue-toastification'

const emailStore = useEmailMarketingStore()
const $toast = useToast()

const showEditorModal = ref(false)
const showPreviewModal = ref(false)
const showDuplicateModal = ref(false)
const selectedTemplate = ref(null)
const previewHtml = ref('')
const previewSubject = ref('')
const duplicateName = ref('')
const templateToDuplicate = ref(null)
const actionLoading = reactive({})
const duplicating = ref(false)

// Computed counts from actual displayed templates
const totalTemplatesCount = computed(() => emailStore.templates.length)
const myTemplatesCount = computed(() => emailStore.templates.filter(t => !t.is_global).length)
const globalTemplatesCount = computed(() => emailStore.templates.filter(t => t.is_global).length)

const debouncedSearch = debounce(() => {
    emailStore.fetchTemplates()
}, 500)

const getPreviewHTML = (template) => {
    // Return a scaled-down version of the HTML for preview
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { margin: 0; padding: 10px; transform-origin: top left; }
            </style>
        </head>
        <body>${template.html_content}</body>
        </html>
    `
}

const handleImageError = (event) => {
    event.target.style.display = 'none'
}

const createTemplate = () => {
    selectedTemplate.value = null
    showEditorModal.value = true
}

const editTemplate = (template) => {
    selectedTemplate.value = template
    showEditorModal.value = true
}

const closeEditor = () => {
    showEditorModal.value = false
    selectedTemplate.value = null
}

const handleTemplateSaved = () => {
    closeEditor()
    emailStore.fetchTemplates()
    $toast.success('Template saved successfully')
}

const previewTemplate = async (template) => {
    actionLoading[template.id] = true
    try {
        const data = await emailStore.previewTemplate(template.id)
        previewHtml.value = data.html_content
        previewSubject.value = data.subject
        showPreviewModal.value = true
    } catch (error) {
        $toast.error('Failed to load preview')
    } finally {
        actionLoading[template.id] = false
    }
}

const closePreview = () => {
    showPreviewModal.value = false
    previewHtml.value = ''
    previewSubject.value = ''
}

const duplicateTemplate = (template) => {
    templateToDuplicate.value = template
    duplicateName.value = `${template.name} (Copy)`
    showDuplicateModal.value = true
}

const confirmDuplicate = async () => {
    if (!duplicateName.value) return

    duplicating.value = true
    try {
        await emailStore.duplicateTemplate(templateToDuplicate.value.id, duplicateName.value)
        $toast.success('Template duplicated successfully')
        showDuplicateModal.value = false
        duplicateName.value = ''
        templateToDuplicate.value = null
    } catch (error) {
        $toast.error('Failed to duplicate template')
    } finally {
        duplicating.value = false
    }
}

const deleteTemplate = async (template) => {
    if (!confirm(`Delete "${template.name}"? This cannot be undone.`)) {
        return
    }

    actionLoading[template.id] = true
    try {
        await emailStore.deleteTemplate(template.id)
        $toast.success('Template deleted')
    } catch (error) {
        $toast.error(error.response?.data?.message || 'Failed to delete template')
    } finally {
        delete actionLoading[template.id]
    }
}
</script>