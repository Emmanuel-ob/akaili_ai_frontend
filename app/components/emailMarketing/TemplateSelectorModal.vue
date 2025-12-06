<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-5xl max-height-[85vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-gray-900">Choose Email Template</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Filters -->
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center gap-4">
                    <input v-model="searchQuery" type="text" placeholder="Search templates..."
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />

                    <select v-model="categoryFilter"
                        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">All Categories</option>
                        <option v-for="category in emailStore.templateCategories" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>

                    <select v-model="ownershipFilter"
                        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="all">All Templates</option>
                        <option value="my">My Templates</option>
                        <option value="global">Global Templates</option>
                    </select>
                </div>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6">
                <!-- Loading -->
                <div v-if="emailStore.templatesLoading" class="flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>

                <!-- Empty State -->
                <div v-else-if="filteredTemplates.length === 0" class="text-center py-12">
                    <div class="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                    <p class="text-gray-600">Try adjusting your filters</p>
                </div>

                <!-- Templates Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Blank Template -->
                    <div @click="selectBlank"
                        class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                        <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <p class="font-medium text-gray-900">Start from Scratch</p>
                        <p class="text-sm text-gray-600 text-center mt-1">Build your own template</p>
                    </div>

                    <!-- Template Cards -->
                    <div v-for="template in filteredTemplates" :key="template.id" @click="selectTemplate(template)"
                        class="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all group">

                        <!-- Thumbnail -->
                        <div class="aspect-video bg-gray-100 relative overflow-hidden">
                            <img v-if="template.thumbnail" :src="template.thumbnail" :alt="template.name"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <!-- Badges -->
                            <div class="absolute top-2 right-2 flex gap-2">
                                <span v-if="template.is_global"
                                    class="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                                    Global
                                </span>
                                <span v-else class="px-2 py-1 bg-purple-500 text-white text-xs rounded">
                                    My Template
                                </span>
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900 mb-1">{{ template.name }}</h3>
                            <p v-if="template.description" class="text-sm text-gray-600 mb-2 line-clamp-2">
                                {{ template.description }}
                            </p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span v-if="template.category">{{ template.category }}</span>
                                <span v-if="template.usage_count">{{ template.usage_count }} uses</span>
                            </div>

                            <!-- Tags -->
                            <div v-if="template.tags && template.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                                <span v-for="tag in template.tags.slice(0, 3)" :key="tag"
                                    class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                    {{ tag }}
                                </span>
                            </div>
                        </div>

                        <!-- Hover Actions -->
                        <div class="px-4 pb-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button @click.stop="openPreview(template)"
                                class="flex-1 px-3 py-1.5 text-sm border border-purple-600 text-purple-600 rounded hover:bg-purple-50">
                                Preview
                            </button>
                            <button @click.stop="selectTemplate(template)"
                                class="flex-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
                                Use Template
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Preview Modal -->
        <EmailPreviewModal v-if="showPreview && previewItem" :html-content="previewHtml" :subject="previewItem.subject"
            @close="closePreview" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EmailPreviewModal from './EmailPreviewModal.vue'
import { useToast } from 'vue-toastification'

const emit = defineEmits(['select', 'close'])
const emailStore = useEmailMarketingStore()
const $toast = useToast()

const searchQuery = ref('')
const categoryFilter = ref('')
const ownershipFilter = ref('all')

const showPreview = ref(false)
const previewItem = ref(null)
const previewHtml = ref('')

const filteredTemplates = computed(() => {
    let templates = emailStore.templates

    if (searchQuery.value) {
        templates = templates.filter(t =>
            t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }

    if (categoryFilter.value) {
        templates = templates.filter(t => t.category === categoryFilter.value)
    }

    if (ownershipFilter.value === 'my') {
        templates = templates.filter(t => !t.is_global)
    } else if (ownershipFilter.value === 'global') {
        templates = templates.filter(t => t.is_global)
    }

    return templates
})

const selectBlank = () => {
    emit('select', { id: null, name: 'Blank Template', unlayer_design: {} })
}

const selectTemplate = (template) => {
    emit('select', template)
}

const openPreview = async (template) => {
    try {
        const data = await emailStore.previewTemplate(template.id)
        previewHtml.value = data.html_content
        previewItem.value = template
        showPreview.value = true
    } catch (error) {
        $toast.error('Failed to load template preview')
    }
}

const closePreview = () => {
    showPreview.value = false
    previewItem.value = null
    previewHtml.value = ''
}

onMounted(async () => {
    if (emailStore.templates.length === 0) {
        await emailStore.fetchTemplates()
    }
    if (emailStore.templateCategories.length === 0) {
        await emailStore.fetchTemplateCategories()
    }
})
</script>
