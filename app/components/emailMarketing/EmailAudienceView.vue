<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Audience Management</h1>
        <p class="text-sm text-gray-500 mt-1">
          Manage your email lists, contacts, and segmentation
        </p>
      </div>

      <!-- Dynamic Add/Import Button -->
      <button
        @click="showImportModal = true"
        class="bg-[#7F56D9] text-white px-5 py-2 rounded-lg shadow hover:bg-[#6C47B5] flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ activeSubTab === 'Contacts' ? 'Import / Add Contacts' : 'Import / Add Lists' }}
      </button>
    </div>

    <!-- Sub-Tabs -->
    <div class="flex gap-6 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeSubTab = tab"
        :class="[
          'pb-2 border-b-2 font-medium transition',
          activeSubTab === tab
            ? 'border-[#7F56D9] text-[#7F56D9]'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- SubTab Content -->
    <div v-if="activeSubTab === 'Contacts'">
      <ContactsTab :contacts="allContacts" />
    </div>

    <div v-else-if="activeSubTab === 'Lists'">
      <ListsTab :lists="lists" />
    </div>

    <!-- Import / Add Modal -->
    <transition name="fade">
      <div
        v-if="showImportModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">
          <!-- Close -->
          <button
            @click="showImportModal = false"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>

          <!-- Title -->
          <h2 class="text-lg font-bold mb-4 text-gray-800">
            {{ activeSubTab === 'Contacts' ? 'Manage Contacts' : 'Manage Lists' }}
          </h2>

          <!-- Mini Tabs (Import | Add Manually) -->
          <div class="flex gap-4 mb-4 border-b pb-2">
            <button
              v-for="t in modalTabs"
              :key="t"
              @click="activeModalTab = t"
              :class="[ 'text-sm font-medium',
                activeModalTab === t
                  ? 'text-[#7F56D9] border-b-2 border-[#7F56D9]'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              {{ t }}
            </button>
          </div>

          <!-- 🔹 IMPORT TAB -->
          <div v-if="activeModalTab === 'Import'">
            <p class="text-gray-500 mb-3">
              Upload a CSV, Excel, or JSON file to import
              {{ activeSubTab === 'Contacts' ? 'contacts' : 'lists' }}.
            </p>

            <select
              v-model="selectedListId"
              class="border rounded-lg w-full p-2 mb-3"
            >
              <option disabled value="">-- Select List to Add Contacts --</option>
              <option
                v-for="l in lists"
                :key="l.list_id"
                :value="l.list_id"
              >
                {{ l.list_name }} ({{ l.subscribers }} subs)
              </option>
            </select>

            <input
              type="file"
              accept=".csv,.xlsx,.json"
              @change="handleFileUpload"
              class="border rounded-lg w-full p-2 mb-4"
            />
          </div>

          <!-- 🧍 ADD MANUALLY TAB -->
          <div v-else>
            <!-- Add Contact -->
            <div v-if="activeSubTab === 'Contacts'">
              <form @submit.prevent="addContact">
                <input
                  v-model="newContact.first_name"
                  type="text"
                  placeholder="First Name"
                  class="border rounded-lg w-full p-2 mb-3"
                  required
                />
                <input
                  v-model="newContact.last_name"
                  type="text"
                  placeholder="Last Name"
                  class="border rounded-lg w-full p-2 mb-3"
                />
                <input
                  v-model="newContact.email"
                  type="email"
                  placeholder="Email Address"
                  class="border rounded-lg w-full p-2 mb-3"
                  required
                />

                <!-- ✅ Tag Selector + Creator -->
                <div class="mb-3">
                  <label class="text-sm font-medium text-gray-700 mb-1 block">Tags</label>

                  <div
                    class="border rounded-lg p-2 flex flex-wrap gap-2 bg-gray-50 mb-2"
                    @click="$refs.tagInput.focus()"
                  >
                    <span
                      v-for="(tag, index) in newContact.tags"
                      :key="index"
                      class="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
                    >
                      {{ tag }}
                      <button
                        type="button"
                        @click="removeTag(index)"
                        class="text-purple-600 hover:text-purple-800"
                      >
                        ✕
                      </button>
                    </span>

                    <input
                      ref="tagInput"
                      v-model="newTag"
                      @keydown.enter.prevent="addTag"
                      placeholder="Type new tag & press Enter..."
                      class="flex-1 bg-transparent border-none outline-none text-sm"
                    />
                  </div>

                  <select
                    v-if="availableTags.length"
                    v-model="selectedTag"
                    @change="selectExistingTag"
                    class="border rounded-lg p-2 w-full text-sm text-gray-700 bg-white"
                  >
                    <option value="">Select existing tag...</option>
                    <option v-for="tag in availableTags" :key="tag" :value="tag">
                      {{ tag }}
                    </option>
                  </select>
                </div>

                <select
                  v-model="newContact.status"
                  class="border rounded-lg w-full p-2 mb-3"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>

                <button
                  type="submit"
                  class="w-full bg-[#7F56D9] text-white py-2 rounded-lg hover:bg-[#6C47B5]"
                >
                  Add Contact
                </button>
              </form>
            </div>

            <!-- Add List -->
            <div v-else>
              <form @submit.prevent="addList">
                <input
                  v-model="newList.list_name"
                  type="text"
                  placeholder="List Name"
                  class="border rounded-lg w-full p-2 mb-3"
                  required
                />
                <input
                  v-model.number="newList.subscribers"
                  type="number"
                  placeholder="Number of Subscribers"
                  class="border rounded-lg w-full p-2 mb-3"
                />

                <button
                  type="submit"
                  class="w-full bg-[#7F56D9] text-white py-2 rounded-lg hover:bg-[#6C47B5]"
                >
                  Create List
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import ContactsTab from './ContactsTab.vue'
import ListsTab from './ListsTab.vue'

const tabs = ['Contacts', 'Lists']
const modalTabs = ['Import', 'Add Manually']
const activeSubTab = ref('Contacts')
const activeModalTab = ref('Import')
const showImportModal = ref(false)

const lists = ref([])
const selectedListId = ref('')

// ✅ Available tags list
const availableTags = ref(['subscriber', 'new-user', 'vip', 'inactive'])
const selectedTag = ref('')
const newTag = ref('')

// 🔹 Load lists
onMounted(async () => {
  const local = localStorage.getItem('lists')
  if (local) {
    lists.value = JSON.parse(local)
  } else {
    const res = await fetch('/data/lists.json')
    const data = await res.json()
    lists.value = Array.isArray(data) ? data : [data]
    localStorage.setItem('lists', JSON.stringify(lists.value))
  }
})

// 🔹 Combine contacts
const allContacts = computed(() => {
  if (!Array.isArray(lists.value)) return []
  return lists.value.flatMap(l =>
    (l.data || []).map(contact => ({
      ...contact,
      list_name: l.list_name
    }))
  )
})

// 🧍 Add contact
const newContact = ref({
  first_name: '',
  last_name: '',
  email: '',
  status: 'active',
  tags: []
})

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !newContact.value.tags.includes(tag)) {
    newContact.value.tags.push(tag)
    if (!availableTags.value.includes(tag)) availableTags.value.push(tag)
  }
  newTag.value = ''
}

function selectExistingTag() {
  if (selectedTag.value && !newContact.value.tags.includes(selectedTag.value)) {
    newContact.value.tags.push(selectedTag.value)
  }
  selectedTag.value = ''
}

function removeTag(index) {
  newContact.value.tags.splice(index, 1)
}

function addContact() {
  if (!newContact.value.email) return

  if (lists.value.length === 0) {
    lists.value.push({
      list_id: Date.now(),
      list_name: 'Main List',
      subscribers: 0,
      data: []
    })
  }

  lists.value[0].data.unshift({
    ...newContact.value,
    id: Date.now(),
    last_activity: new Date().toISOString()
  })
  lists.value[0].subscribers++
  localStorage.setItem('lists', JSON.stringify(lists.value))
  showImportModal.value = false
  newContact.value = { first_name: '', last_name: '', email: '', status: 'active', tags: [] }
}

// 📋 Add list
const newList = ref({ list_name: '', subscribers: 0 })
function addList() {
  lists.value.push({
    list_id: Date.now(),
    list_name: newList.value.list_name,
    subscribers: newList.value.subscribers,
    data: []
  })
  localStorage.setItem('lists', JSON.stringify(lists.value))
  showImportModal.value = false
  newList.value = { list_name: '', subscribers: 0 }
}

// 📂 Import CSV/XLSX/JSON
async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  const ext = file.name.split('.').pop().toLowerCase()
  let parsedContacts = []

  try {
    if (ext === 'csv') {
      const result = await new Promise((resolve, reject) => {
        Papa.parse(file, { header: true, skipEmptyLines: true, complete: resolve, error: reject })
      })
      parsedContacts = result.data
    } else if (ext === 'xlsx') {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      parsedContacts = XLSX.utils.sheet_to_json(sheet)
    } else if (ext === 'json') {
      const text = await file.text()
      parsedContacts = JSON.parse(text)
    }

    const normalized = parsedContacts.map((c, i) => ({
      id: Date.now() + i,
      first_name: c.first_name || c.FirstName || '',
      last_name: c.last_name || c.LastName || '',
      email: c.email || c.Email || '',
      status: c.status || 'active',
      tags: c.tags ? (Array.isArray(c.tags) ? c.tags : [c.tags]) : [],
      last_activity: new Date().toISOString()
    }))

    const list = lists.value.find(l => l.list_id === selectedListId.value) || lists.value[0]
    list.data.push(...normalized)
    list.subscribers += normalized.length
    localStorage.setItem('lists', JSON.stringify(lists.value))
    alert(`✅ Imported ${normalized.length} contacts successfully!`)
    showImportModal.value = false
  } catch (err) {
    console.error('❌ Import failed:', err)
    alert('Failed to import contacts. Check your file format.')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
