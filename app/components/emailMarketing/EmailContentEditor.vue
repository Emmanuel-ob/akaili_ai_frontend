<template>
  <div class="p-4 bg-gray-50 rounded-lg">
    <label class="font-bold text-lg text-gray-800 block mb-3">The Email Content Editor</label>

    <!-- Tabs -->
    <div class="flex flex-col sm:flex-row border-b border-gray-300">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="whichTabIsActive = tab"
        :class="[
          'px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors duration-200',
          whichTabIsActive === tab
            ? 'bg-white text-[#6C47B5] border-t-2 border-x-2 border-b-0 border-[#7F56D9]'
            : 'text-gray-600 hover:bg-gray-100'
        ]"
      >
        {{ tab.toUpperCase() }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-0 border border-t-0 border-gray-300 rounded-b-lg p-5 bg-white min-h-[350px] shadow-inner">
      
      <!-- CONTENT Tab -->
      <div v-show="whichTabIsActive === 'content'">
        <div
          ref="editableDiv"
          class="min-h-[300px] outline-none p-2 border border-dashed border-gray-200 rounded-md"
          contenteditable="true"
          @input="updateContentData"
        ></div>
      </div>

      <!-- LINKS Tab -->
      <div v-show="whichTabIsActive === 'links'" class="text-gray-700">
        <p class="mb-4 text-md font-semibold text-[#7F56D9]">Links You Can Edit:</p>

        <div v-if="foundLinks.length">
          <div
            v-for="(link, idx) in foundLinks"
            :key="idx"
            class="flex flex-col sm:flex-row gap-2 mb-4 p-3 bg-gray-50 rounded-lg border"
          >
            <input v-model="link.text" class="border rounded-md p-2 flex-1 text-sm bg-white" placeholder="Link Text" />
            <input v-model="link.href" class="border rounded-md p-2 flex-1 text-sm bg-white" placeholder="Link URL" />
            <button
              @click="fixTheLink(idx, link.text, link.href)"
              class="px-4 py-2 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 transition-colors self-end sm:self-center"
            >
              Fix It!
            </button>
          </div>
        </div>
        <div v-else class="text-gray-500 mb-4 p-4 border rounded-lg bg-yellow-50">
          No links found! Go write some links.
        </div>

        <!-- Add new link section -->
        <div class="mt-8 border-t pt-5 border-gray-200">
          <p class="mb-3 font-bold text-gray-700">Add a New Link:</p>
          <div class="flex flex-col sm:flex-row gap-3">
            <input v-model="newText" placeholder="Link Text" class="border rounded-lg p-2 flex-1" />
            <input v-model="newHref" placeholder="http://mylink.com" class="border rounded-lg p-2 flex-1" />
            <button 
              @click="putInTheLink(newText, newHref)" 
              class="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Add Link Now
            </button>
          </div>
        </div>
      </div>

      <!-- HTML Tab -->
      <div v-show="whichTabIsActive === 'html'">
        <textarea
          v-model="currentHtmlCopy"
          @input="saveDraftAnyway"
          rows="15"
          class="w-full border border-gray-400 rounded-lg p-3 font-mono text-sm resize-none focus:border-[#7F56D9] focus:ring-[#7F56D9]"
        ></textarea>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="flex justify-between items-center mt-6 p-3 bg-gray-100 rounded-lg border border-gray-200">
      <span class="text-xs text-gray-500 font-medium">{{ messageDisplay }}</span>

      <div class="flex gap-3">
        <button
          @click="resetTheContent"
          class="px-5 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium"
        >
          Reset To Last Save
        </button>
        <button
          @click="tryToSaveChanges"
          class="px-5 py-2 text-sm bg-[#6C47B5] text-white rounded-lg hover:bg-[#7F56D9] transition-colors shadow-md font-medium"
        >
          Finalize Changes
        </button>
      </div>
    </div>

    <!-- Simple Notification -->
    <transition name="fade">
      <div
        v-if="showPopup"
        class="fixed bottom-6 right-6 bg-gray-800 text-white text-sm px-5 py-3 rounded-xl shadow-2xl z-50 font-semibold"
      >
        {{ popupText }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineExpose, watch } from 'vue'

// Props & Emits
const props = defineProps({
  mainEmailStuff: String,
  campaignId: [String, Number]
})
const emit = defineEmits(['sendNewEmailHtml'])

// State
const tabs = ['content', 'links', 'html']
const whichTabIsActive = ref('content')
const currentHtmlCopy = ref(props.mainEmailStuff || '')
const editableDiv = ref(null)
const messageDisplay = ref('')
const showPopup = ref(false)
const popupText = ref('')
const newText = ref('')
const newHref = ref('')
let timerForDraft = null

// --- Computed: extract links
const foundLinks = computed(() => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(currentHtmlCopy.value, 'text/html')
  const anchors = Array.from(doc.querySelectorAll('a'))
  return anchors.map(a => ({ text: a.textContent, href: a.getAttribute('href') }))
})

// --- Utils
function showPopupMessage(msg) {
  popupText.value = msg
  showPopup.value = true
  setTimeout(() => (showPopup.value = false), 2500)
}

// --- Draft handling
function saveDraftAnyway() {
  clearTimeout(timerForDraft)
  timerForDraft = setTimeout(() => {
    if (currentHtmlCopy.value !== props.mainEmailStuff) {
      localStorage.setItem('emailEditorDraft', currentHtmlCopy.value)
      messageDisplay.value = 'Draft auto-saved.'
    }
  }, 900)
}

function forgetMyDrafts() {
  localStorage.removeItem('emailEditorDraft')
  messageDisplay.value = 'Drafts cleared.'
}

function resetTheContent() {
  currentHtmlCopy.value = props.mainEmailStuff
  if (editableDiv.value) editableDiv.value.innerHTML = currentHtmlCopy.value
  forgetMyDrafts()
  showPopupMessage('Content reset to last save!')
}

function tryToSaveChanges() {
  emit('sendNewEmailHtml', currentHtmlCopy.value)
  forgetMyDrafts()
  messageDisplay.value = 'Changes finalized.'
  showPopupMessage('Saved! Sent to parent.')
}

// --- Handle typing in contenteditable
function updateContentData(e) {
  currentHtmlCopy.value = e.target.innerHTML
  saveDraftAnyway()
}

// --- Link management
function fixTheLink(index, newText, newHref) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(currentHtmlCopy.value, 'text/html')
  const anchors = Array.from(doc.querySelectorAll('a'))
  if (anchors[index]) {
    anchors[index].textContent = newText
    anchors[index].setAttribute('href', newHref)
    currentHtmlCopy.value = doc.body.innerHTML
    if (editableDiv.value) editableDiv.value.innerHTML = currentHtmlCopy.value
    saveDraftAnyway()
    showPopupMessage('Link updated!')
  }
}

function putInTheLink(text, href) {
  if (!text || !href) return showPopupMessage('Enter both text and URL.')
  currentHtmlCopy.value += ` <a href="${href}" target="_blank">${text}</a>`
  if (editableDiv.value) editableDiv.value.innerHTML = currentHtmlCopy.value
  saveDraftAnyway()
  showPopupMessage('New link added!')
  newText.value = ''
  newHref.value = ''
}

// --- Lifecycle
onMounted(() => {
  if (editableDiv.value) editableDiv.value.innerHTML = currentHtmlCopy.value

  const savedDraft = localStorage.getItem('emailEditorDraft')
  if (savedDraft && savedDraft !== props.mainEmailStuff) {
    currentHtmlCopy.value = savedDraft
    editableDiv.value.innerHTML = savedDraft
    messageDisplay.value = 'Loaded saved draft.'
    showPopupMessage('Loaded old draft automatically.')
  }
})

// --- Watchers
watch(() => whichTabIsActive.value, (tab) => {
  if (tab === 'content' && editableDiv.value) {
    editableDiv.value.innerHTML = currentHtmlCopy.value
  }
})

watch(() => props.mainEmailStuff, (newValue) => {
  if (newValue !== currentHtmlCopy.value) {
    currentHtmlCopy.value = newValue
    if (editableDiv.value) editableDiv.value.innerHTML = newValue
    messageDisplay.value = 'Loaded new content from parent'
    showPopupMessage('Template loaded from parent!')
  }
})

defineExpose({
  forgetMyDrafts,
  tryToSaveChanges,
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
