<template>
  <div class="p-3 sm:p-4 lg:p-6">
    <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
      Choose an AI-Powered Template
    </h1>

    <!-- Search & Category Filters -->
    <div class="flex flex-col sm:flex-row mb-4 sm:mb-6 sm:space-x-4 space-y-3 sm:space-y-0">
      <input 
        v-model="searchTerm" 
        type="text" 
        placeholder="Search templates by name, subject, or content..." 
        class="p-2 text-sm sm:text-base border border-gray-300 rounded-md w-full shadow-sm focus:ring-[#9E4CFF] focus:border-[#9E4CFF]"
      />

      <select 
        v-model="selectedCategory" 
        class="p-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:ring-[#9E4CFF] focus:border-[#9E4CFF]"
      >
        <option value="">All Categories</option>
        <option v-for="tag in uniqueTags" :key="tag" :value="tag" class="capitalize">
          {{ tag }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 text-lg py-12 text-center">
      Loading AI templates...
    </div>

    <!-- No templates -->
    <div v-else-if="filteredTemplates.length === 0" class="text-center py-12 text-gray-500">
      <p class="text-xl">No templates found matching your criteria. 😔</p>
      <button @click="searchTerm=''; selectedCategory=''" class="mt-4 text-[#9E4CFF] hover:underline">
        Clear Search/Filters
      </button>
    </div>

    <!-- Template Grid -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
    >
      <div
        v-for="t in filteredTemplates"
        :key="t.id"
        class="bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100
               flex flex-col justify-between hover:border-[#9E4CFF] transition duration-300"
      >
        <!-- HTML Preview -->
        <div class="relative mb-3 sm:mb-4">
          <div class="preview-wrapper border border-gray-200 rounded-lg overflow-hidden">

            <div
              class="email-preview relative overflow-hidden 
                     h-[260px] sm:h-[400px] w-full border border-gray-200
                     rounded-lg shadow-sm bg-white
                     scale-[0.60] sm:scale-75 origin-top-left"
              v-html="t.html_content"
            ></div>

          </div>

          <!-- Tags -->
          <div class="absolute top-2 left-2 flex flex-wrap gap-1">
            <span
              v-for="tag in t.tags"
              :key="tag"
              class="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Template Info -->
        <div class="flex-grow">
          <h3
            class="font-bold text-sm sm:text-lg mb-1 text-gray-900 truncate"
            :title="t.name"
          >
            {{ t.name.replace('Template ' + t.id + ' - ', '') }}
          </h3>

          <p
            class="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 h-10"
          >
            {{ t.preview_text }}
          </p>
        </div>

        <!-- Actions -->
        <div class="mt-3 sm:mt-4 flex justify-between items-center space-x-2">
          <button
            @click="proceedToEditor(t)"
            class="flex-1 text-xs sm:text-sm text-white bg-[#9E4CFF] hover:bg-[#6c48c4]
                   px-3 sm:px-4 py-2 rounded-lg font-medium transition duration-200"
          >
            Use Template
          </button>

          <button
            @click="openPreview(t)"
            class="px-2 sm:px-3 py-2 text-xs sm:text-sm text-[#9E4CFF]
                   border border-[#9E4CFF] hover:bg-[#F2F4F7] rounded-lg"
          >
            Preview
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal (unchanged) -->
    <EmailBaseModal
      v-if="previewTemplate"
      :show="!!previewTemplate"
      title="Template Preview"
      size="lg"
      @close="previewTemplate=null"
    >
      <template #body>
        <div class="mb-4 text-sm text-gray-800 border-b pb-3">
          <p class="font-semibold text-lg">{{ previewTemplate.subject }}</p>
          <p class="text-gray-600">
            <span class="font-medium">Preview Text:</span> {{ previewTemplate.preview_text }}
          </p>
        </div>
        <div class="p-4 border rounded-lg bg-gray-50 overflow-y-auto max-h-[70vh]">
          <div v-html="previewTemplate.html_content" class="email-preview"></div>
        </div>
      </template>
    </EmailBaseModal>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import EmailBaseModal from '@/components/emailMarketing/EmailBaseModal.vue'

const templates = ref([])
const loading = ref(true)
const previewTemplate = ref(null)
const searchTerm = ref('')
const selectedCategory = ref('')

// Accept callback prop
const props = defineProps({
  onChangeTab: Function
})

// Filter templates
const filteredTemplates = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  const category = selectedCategory.value
  return templates.value.filter(t => {
    const matchesSearch =
      !term ||
      t.name.toLowerCase().includes(term) ||
      t.subject.toLowerCase().includes(term) ||
      t.preview_text.toLowerCase().includes(term)
    const matchesCategory = !category || t.tags.includes(category)
    return matchesSearch && matchesCategory
  })
})

// Unique tags
const uniqueTags = computed(() => {
  const tags = new Set()
  templates.value.forEach(t => t.tags.forEach(tag => tags.add(tag)))
  return Array.from(tags).sort()
})

// Load templates
onMounted(async () => {
  const res = await fetch('/data/templates.json')
  templates.value = await res.json()
  loading.value = false
})

// Preview
function openPreview(t) {
  previewTemplate.value = t
}

// Proceed to editor
function proceedToEditor(t) {
  const campaignData = {
    id: Date.now(),
    name: `${t.name.split(' - ')[1]} Campaign`,
    description: '',
    status: 'Draft',
    createdAt: new Date().toISOString(),
    send_date: null,
    emailsSent: 0,
    template_id: t.id,
    list_id: 1,
    from_name: 'Akili AI',
    from_email: 'no-reply@akeliai.com',
    subject: t.subject,
    content: t.html_content,
    opens: 0,
    clicks: 0,
    bounces: 0,
    conversion_rate: 0
  }

  localStorage.setItem('editingCampaign', JSON.stringify(campaignData))
  props.onChangeTab('editor')
}
</script>

<style scoped>
.preview-wrapper {
  background: #f9fafb;
  height: 10rem;
  overflow-y: auto;
  border-radius: 0.5rem;
}

/* Scale down email preview content safely */
.email-preview {
  transform-origin: top left;
  scale: 0.75;
  width: 133%;
  pointer-events: none; /* Prevent accidental interaction */
}

.email-preview h1 {
  font-size: 1.5em;
  margin-top: 1em;
}
.email-preview p {
  margin-bottom: 1em;
}
</style>
