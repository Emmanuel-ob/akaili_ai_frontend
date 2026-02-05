<!-- components/faq/FAQUpload.vue -->
<template>
  <div
    class="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-300"
  >
    <h3
      class="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-subheading"
    >
      Upload Documents
    </h3>

    <!-- UPLOAD PROGRESS BAR -->
    <div
      v-if="uploading"
      class="mb-4 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-lg"
    >
      <div class="flex items-center justify-between mb-2">
        <span
          class="text-sm font-medium text-purple-900 dark:text-purple-200 font-sans"
        >
          {{ uploadPercentage === 100 ? "Finishing up..." : "Uploading..." }}
        </span>
        <span
          class="text-xs text-purple-700 dark:text-purple-300 font-bold font-sans"
          >{{ uploadPercentage }}%</span
        >
      </div>
      <div class="w-full bg-purple-200 dark:bg-slate-700 rounded-full h-2">
        <div
          class="bg-purple-600 h-2 rounded-full transition-all duration-200 ease-out"
          :style="{ width: uploadPercentage + '%' }"
        />
      </div>
    </div>

    <!-- Drag & Drop Area -->
    <div
      v-else
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
        isDragging
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
          : 'border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-600',
      ]"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden font-sans"
        accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt,.json"
        @change="handleFileSelect"
      />

      <div v-if="!selectedFile">
        <svg
          class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 font-sans">
          Drag and drop your file here, or
        </p>
        <button
          type="button"
          class="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium font-sans"
          @click="$refs.fileInput.click()"
        >
          Browse files
        </button>
        <p class="mt-4 text-xs text-gray-500 dark:text-gray-400 font-sans">
          Supported: PDF, Word, Excel, CSV, TXT, JSON (Max 10MB)
        </p>
      </div>

      <!-- Selected File Preview -->
      <div
        v-else
        class="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-4 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <svg
            class="w-8 h-8 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <div class="text-left">
            <p
              class="text-sm font-medium text-gray-900 dark:text-white font-sans"
            >
              {{ selectedFile.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-sans">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
        </div>
        <button
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-sans"
          @click="clearFile"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Form Fields -->
    <div v-if="selectedFile" class="mt-6 space-y-4">
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-subheading"
        >
          Source Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="sourceName"
          type="text"
          placeholder="e.g., Product FAQs, Support Documentation"
          :disabled="uploading"
          class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 dark:disabled:bg-slate-700/50 font-sans text-sm"
          required
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-subheading"
        >
          Priority (1-10)
        </label>
        <div class="flex items-center space-x-4">
          <input
            v-model.number="priority"
            type="range"
            min="1"
            max="10"
            :disabled="uploading"
            class="flex-1 accent-purple-600 font-sans text-sm"
          />
          <span class="text-sm font-medium text-gray-900 dark:text-white w-8 font-sans">{{
            priority
          }}</span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-sans">
          Higher priority sources are searched first
        </p>
      </div>

      <!-- Error Display -->
      <div
        v-if="error"
        class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
      >
        <p class="text-sm text-red-600 dark:text-red-400 font-subheading">{{ error }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          :disabled="uploading"
          class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 font-sans"
          @click="clearFile"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="!sourceName || uploading"
          class="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-sans"
          @click="handleUpload"
        >
          <span v-if="uploading">Uploading...</span>
          <span v-else>Upload & Process</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/authStore";
import { useToast } from "vue-toastification/dist/index.mjs";

const props = defineProps({
  chatbotId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["uploaded", "processing", "reload"]);

const authStore = useAuthStore();
const config = useRuntimeConfig();
const toast = useToast();

const fileInput = ref(null);
const selectedFile = ref(null);
const sourceName = ref("");
const priority = ref(5);
const isDragging = ref(false);
const uploading = ref(false);
const error = ref("");

// UPLOAD PROGRESS
const uploadPercentage = ref(0);

const handleDrop = (e) => {
  isDragging.value = false;
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    validateAndSetFile(files[0]);
  }
};

const handleFileSelect = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    validateAndSetFile(files[0]);
  }
};

const validateAndSetFile = (file) => {
  error.value = "";
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    error.value = "File size must be less than 10MB";
    return;
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
    "text/plain",
    "application/json",
  ];

  if (!allowedTypes.includes(file.type)) {
    error.value =
      "Unsupported file type. Please upload PDF, Word, Excel, CSV, TXT, or JSON.";
    return;
  }

  selectedFile.value = file;

  if (!sourceName.value) {
    sourceName.value = file.name.replace(/\.[^/.]+$/, "");
  }
};

const clearFile = () => {
  selectedFile.value = null;
  sourceName.value = "";
  priority.value = 5;
  error.value = "";
  uploadPercentage.value = 0;

  if (fileInput.value) {
    fileInput.value.value = "";
  }

  uploading.value = false;
};

const uploadFileWithTracking = (file, chatbotId, sourceName, priority) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatbot_id", chatbotId);
    formData.append("source_name", sourceName);
    formData.append("priority", priority);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${config.public.apiBase}/api/faq/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${authStore.token}`);
    xhr.setRequestHeader("Accept", "application/json");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        uploadPercentage.value = pct > 99 ? 99 : pct;
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        uploadPercentage.value = 100;
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error("Invalid response format"));
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          reject(new Error(response.message || "Upload failed"));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));

    xhr.send(formData);
  });
};

const handleUpload = async () => {
  if (!selectedFile.value || !sourceName.value) return;

  uploading.value = true;
  error.value = "";
  uploadPercentage.value = 0;

  try {
    const result = await uploadFileWithTracking(
      selectedFile.value,
      props.chatbotId,
      sourceName.value,
      priority.value,
    );

    // Give user a brief moment to see "100%"
    setTimeout(() => {
      if (result.success) {
        const payload = result.data || result;

        // Show Success Message
        toast.success("Uploaded! Processing in background.");

        // Trigger Reload in Parent
        emit("reload");

        // Reset Form
        clearFile();
      } else {
        error.value = result.message || "Unknown error";
        uploading.value = false;
      }
    }, 500);
  } catch (err) {
    uploading.value = false;
    error.value = err.message;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
</script>
