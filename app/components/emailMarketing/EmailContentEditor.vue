<template>
  <div>
    <label class="font-medium text-gray-700">Email Content</label>

    <!-- Tabs -->
    <div class="flex items-center gap-4 mt-2 border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeEditTab = tab"
        :class="[
          'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
          activeEditTab === tab
            ? 'border-[#7F56D9] text-[#7F56D9]'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-3">
      <!-- Content Tab -->
      <div v-if="activeEditTab === 'content'">
        <div
          class="border rounded-lg p-4 bg-white min-h-[300px]"
          contenteditable="true"
          @input="handleContentEdit"
          v-html="localContent"
        ></div>
      </div>

     <!-- Links Tab -->
<div v-else-if="activeEditTab === 'links'" class="border rounded-lg p-4 bg-white min-h-[300px] text-gray-700">
  <p class="mb-2 font-semibold">Links found in this email:</p>
  
  <div v-if="links.length">
    <div
      v-for="(link, index) in links"
      :key="index"
      class="flex gap-2 mb-2 items-center"
    >
      <input v-model="link.text" class="border rounded p-1 flex-1" />
      <input v-model="link.href" class="border rounded p-1 flex-1" />
      <button
        @click="updateLink(index, link.text, link.href)"
        class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >Update</button>
    </div>
  </div>
  <div v-else class="text-gray-500 mb-2">No links found yet.</div>

  <!-- Add new link -->
  <div class="mt-4 flex gap-2">
    <input v-model="newLinkText" placeholder="Link Text" class="border rounded p-1 flex-1" />
    <input v-model="newLinkHref" placeholder="https://example.com" class="border rounded p-1 flex-1" />
    <button @click="addLink(newLinkText, newLinkHref)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Add</button>
  </div>
</div>

      <!-- HTML Tab -->
      <div v-else-if="activeEditTab === 'html'">
        <textarea
          v-model="localContent"
          @input="saveDraft"
          rows="12"
          class="w-full border rounded-lg p-3 font-mono text-sm"
        ></textarea>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-xs text-gray-500">{{ statusMessage }}</span>

      <div class="flex gap-2">
        <button
          @click="discardDraft"
          class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
        >
          Discard Draft
        </button>
        <button
          @click="saveChanges"
          class="px-4 py-2 text-sm bg-[#7F56D9] text-white rounded-lg hover:bg-[#6C47B5]"
        >
          Save Changes
        </button>
      </div>
    </div>

    <!-- Notification (non-blocking) -->
    <transition name="fade">
      <div
        v-if="showNotification"
        class="fixed bottom-5 right-5 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg"
      >
        {{ notificationText }}
      </div>
    </transition>
  </div>
</template>

<script setup>

import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])

const tabs = ['content', 'links', 'html']
const activeEditTab = ref('content')
const localContent = ref(props.modelValue || '')
const statusMessage = ref('')
const showNotification = ref(false)
const notificationText = ref('')

let saveTimeout

// Parse links from HTML content
const links = computed(() => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(localContent.value, 'text/html')
  const anchorTags = Array.from(doc.querySelectorAll('a'))
  return anchorTags.map(a => ({ text: a.textContent, href: a.href }))
})

// --- UTILITIES ---
function showToast(msg) {
  notificationText.value = msg
  showNotification.value = true
  setTimeout(() => (showNotification.value = false), 2500)
}

// --- DRAFT HANDLING ---
function saveDraft() {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    localStorage.setItem('emailEditorDraft', localContent.value)
    statusMessage.value = 'Draft saved just now'
  }, 800)
}

function discardDraft() {
  localStorage.removeItem('emailEditorDraft')
  localContent.value = props.modelValue
  statusMessage.value = 'Draft discarded'
  showToast('Draft discarded.')
}

function saveChanges() {
  emit('update:modelValue', localContent.value)
  localStorage.removeItem('emailEditorDraft')
  statusMessage.value = 'All changes saved.'
  showToast('Changes saved successfully!')
}

function handleContentEdit(e) {
  localContent.value = e.target.innerHTML
  saveDraft()
}

// --- LINK EDITING ---
function updateLink(index, newText, newHref) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(localContent.value, 'text/html')
  const anchors = Array.from(doc.querySelectorAll('a'))

  if (anchors[index]) {
    anchors[index].textContent = newText
    anchors[index].href = newHref
    localContent.value = doc.body.innerHTML
    saveDraft()
    showToast('Link updated.')
  }
}

function addLink(text, href) {
  // Append at the end of content
  localContent.value += `<a href="${href}" target="_blank">${text}</a>`
  saveDraft()
  showToast('Link added.')
}

// --- INITIAL LOAD ---
onMounted(() => {
  const savedDraft = localStorage.getItem('emailEditorDraft')
  if (savedDraft && savedDraft !== props.modelValue) {
    showToast('Unsaved edits found. Load them?')
    setTimeout(() => {
      if (confirm('Load unsaved edits?')) {
        localContent.value = savedDraft
        statusMessage.value = 'Draft loaded from local storage.'
      } else {
        localStorage.removeItem('emailEditorDraft')
        statusMessage.value = 'Fresh start. Draft cleared.'
      }
    }, 1000)
  }
})

// --- SYNC PARENT VALUE ---
watch(() => props.modelValue, (newVal) => {
  if (newVal !== localContent.value) localContent.value = newVal
})

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
