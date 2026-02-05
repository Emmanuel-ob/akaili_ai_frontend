<!-- emailMarketing/EmailTemplatesTab.vue -->
<template>
  <div class="font-sans">
    <!-- Header Actions -->
    <div
      class="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 gap-4"
    >
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
        <input
          v-model="emailStore.filters.templates.search"
          type="text"
          placeholder="Search templates..."
          class="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-sans"
          @input="debouncedSearch"
        />

        <select
          v-model="emailStore.filters.templates.category"
          class="w-full sm:w-40 px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-sans"
          @change="emailStore.fetchTemplates()"
        >
          <option value="">All Categories</option>
          <option
            v-for="cat in emailStore.templateCategories"
            :key="cat"
            :value="cat"
          >
            {{ cat }}
          </option>
        </select>

        <select
          v-model="emailStore.filters.templates.ownership"
          class="w-full sm:w-40 px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-sans"
          @change="emailStore.fetchTemplates()"
        >
          <option value="all">All Templates</option>
          <option value="my">My Templates</option>
          <option value="global">Global Templates</option>
        </select>
      </div>

      <!-- Action Button -->
      <button
        class="w-full xl:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors shadow-sm font-sans"
        @click="createTemplate"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Template
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 font-sans">
      <div
        class="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-4 transition-colors"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Total Templates
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ totalTemplatesCount }}
        </p>
      </div>
      <div
        class="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-4 transition-colors"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
          My Templates
        </p>
        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {{ myTemplatesCount }}
        </p>
      </div>
      <div
        class="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-4 transition-colors"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Global Templates
        </p>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {{ globalTemplatesCount }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="emailStore.templatesLoading"
      class="flex items-center justify-center py-12"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"
      ></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="emailStore.templates.length === 0"
      class="text-center py-12"
    >
      <div
        class="bg-purple-50 dark:bg-purple-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-10 h-10 text-purple-600 dark:text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3
        class="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-subheading"
      >
        No templates yet
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Create your first email template
      </p>
      <button
        @click="createTemplate"
        class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Create Template
      </button>
    </div>

    <!-- Templates Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="template in emailStore.templates"
        :key="template.id"
        class="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all group bg-white dark:bg-slate-900"
      >
        <!-- Thumbnail -->
        <div
          class="aspect-video bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden"
        >
          <img
            v-if="template.thumbnail"
            :src="template.thumbnail"
            :alt="template.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            @error="handleImageError"
          />

          <iframe
            v-else-if="template.html_content"
            :srcdoc="getPreviewHTML(template)"
            class="w-full h-full pointer-events-none border-0 scale-50 origin-top-left bg-white"
            style="width: 200%; height: 200%"
            sandbox=""
          ></iframe>

          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center"
          >
            <svg
              class="w-16 h-16 text-purple-300 dark:text-purple-900/50 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p class="text-sm text-purple-400 dark:text-purple-500">
              {{ template.name }}
            </p>
          </div>

          <!-- Badges -->
          <div class="absolute top-2 right-2 flex flex-col gap-1">
            <span
              v-if="template.is_global"
              class="px-2 py-1 bg-blue-500 text-white text-xs rounded shadow-sm"
            >
              Global
            </span>
            <span
              v-else
              class="px-2 py-1 bg-purple-500 text-white text-xs rounded shadow-sm"
            >
              My Template
            </span>
            <span
              v-if="template.status === 'draft'"
              class="px-2 py-1 bg-yellow-500 text-white text-xs rounded shadow-sm"
            >
              Draft
            </span>
          </div>
        </div>

        <!-- Info -->
        <div class="p-4">
          <h3
            class="font-semibold text-gray-900 dark:text-white mb-1 truncate font-subheading"
          >
            {{ template.name }}
          </h3>
          <p
            v-if="template.description"
            class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2"
          >
            {{ template.description }}
          </p>

          <div
            class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3"
          >
            <span
              v-if="template.category"
              class="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded"
              >{{ template.category }}</span
            >
            <span v-if="template.usage_count"
              >{{ template.usage_count }} uses</span
            >
          </div>

          <!-- Tags -->
          <div
            v-if="template.tags && template.tags.length > 0"
            class="flex flex-wrap gap-1 mb-3"
          >
            <span
              v-for="tag in template.tags.slice(0, 3)"
              :key="tag"
              class="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs rounded border border-gray-200 dark:border-slate-700"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Actions -->
          <div
            class="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-800"
          >
            <button
              :disabled="actionLoading[template.id]"
              class="flex-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              @click="previewTemplate(template)"
            >
              <span v-if="actionLoading[template.id]">Loading...</span>
              <span v-else>Preview</span>
            </button>

            <template
              v-if="template.is_editable !== false && !template.is_global"
            >
              <button
                class="px-3 py-2 text-sm text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                title="Edit"
                @click="editTemplate(template)"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </template>

            <button
              :disabled="actionLoading[template.id]"
              class="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 transition-colors"
              title="Duplicate"
              @click="duplicateTemplate(template)"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>

            <button
              v-if="!template.is_global"
              :disabled="actionLoading[template.id]"
              class="px-3 py-2 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
              title="Delete"
              @click="deleteTemplate(template)"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals (Unchanged) -->
    <TemplateEditorFullscreen
      v-if="showEditorModal"
      :template="selectedTemplate"
      @close="closeEditor"
      @saved="handleTemplateSaved"
    />
    <EmailPreviewModal
      v-if="showPreviewModal"
      :html-content="previewHtml"
      :subject="previewSubject"
      @close="closePreview"
    />

    <!-- Duplicate Modal (Included for completeness) -->
    <div
      v-if="showDuplicateModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white dark:bg-slate-900 rounded-lg w-full max-w-md p-6 shadow-xl border border-gray-200 dark:border-slate-800"
      >
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-subheading"
        >
          Duplicate Template
        </h3>
        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-subheading"
            >New Template Name</label
          >
          <input
            v-model="duplicateName"
            type="text"
            placeholder="Enter template name..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            @keyup.enter="confirmDuplicate"
          />
        </div>
        <div class="flex items-center justify-end gap-3">
          <button
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            @click="showDuplicateModal = false"
          >
            Cancel
          </button>
          <button
            :disabled="!duplicateName || duplicating"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              duplicateName && !duplicating
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed',
            ]"
            @click="confirmDuplicate"
          >
            {{ duplicating ? "Duplicating..." : "Duplicate" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { debounce } from "lodash-es";
import TemplateEditorFullscreen from "./TemplateEditorFullscreen.vue";
import EmailPreviewModal from "./EmailPreviewModal.vue";
import { useToast } from "vue-toastification";

const emailStore = useEmailMarketingStore();
const $toast = useToast();

const showEditorModal = ref(false);
const showPreviewModal = ref(false);
const showDuplicateModal = ref(false);
const selectedTemplate = ref(null);
const previewHtml = ref("");
const previewSubject = ref("");
const duplicateName = ref("");
const templateToDuplicate = ref(null);
const actionLoading = reactive({});
const duplicating = ref(false);

const totalTemplatesCount = computed(() => emailStore.templates.length);
const myTemplatesCount = computed(
  () => emailStore.templates.filter((t) => !t.is_global).length,
);
const globalTemplatesCount = computed(
  () => emailStore.templates.filter((t) => t.is_global).length,
);

const debouncedSearch = debounce(() => {
  emailStore.fetchTemplates();
}, 500);

const getPreviewHTML = (template) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { margin: 0; padding: 10px; transform-origin: top left; background: white; }
            </style>
        </head>
        <body>${template.html_content}</body>
        </html>
    `;
};

const handleImageError = (event) => {
  event.target.style.display = "none";
};

const createTemplate = () => {
  selectedTemplate.value = null;
  showEditorModal.value = true;
};

const editTemplate = (template) => {
  selectedTemplate.value = template;
  showEditorModal.value = true;
};

const closeEditor = () => {
  showEditorModal.value = false;
  selectedTemplate.value = null;
};

const handleTemplateSaved = () => {
  closeEditor();
  emailStore.fetchTemplates();
  $toast.success("Template saved successfully");
};

const previewTemplate = async (template) => {
  actionLoading[template.id] = true;
  try {
    const data = await emailStore.previewTemplate(template.id);
    previewHtml.value = data.html_content;
    previewSubject.value = data.subject;
    showPreviewModal.value = true;
  } catch (error) {
    $toast.error("Failed to load preview");
  } finally {
    actionLoading[template.id] = false;
  }
};

const closePreview = () => {
  showPreviewModal.value = false;
  previewHtml.value = "";
  previewSubject.value = "";
};

const duplicateTemplate = (template) => {
  templateToDuplicate.value = template;
  duplicateName.value = `${template.name} (Copy)`;
  showDuplicateModal.value = true;
};

const confirmDuplicate = async () => {
  if (!duplicateName.value) return;

  duplicating.value = true;
  try {
    await emailStore.duplicateTemplate(
      templateToDuplicate.value.id,
      duplicateName.value,
    );
    $toast.success("Template duplicated successfully");
    showDuplicateModal.value = false;
    duplicateName.value = "";
    templateToDuplicate.value = null;
  } catch (error) {
    $toast.error("Failed to duplicate template");
  } finally {
    duplicating.value = false;
  }
};

const deleteTemplate = async (template) => {
  if (!confirm(`Delete "${template.name}"? This cannot be undone.`)) {
    return;
  }

  actionLoading[template.id] = true;
  try {
    await emailStore.deleteTemplate(template.id);
    $toast.success("Template deleted");
  } catch (error) {
    $toast.error(error.response?.data?.message || "Failed to delete template");
  } finally {
    delete actionLoading[template.id];
  }
};
</script>
