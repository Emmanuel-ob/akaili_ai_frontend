<!-- app/components/emailMarketing/CampaignEditor.vue -->
<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-extrabold mb-6 text-gray-800">Email Editor</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Column 1: Settings -->
      <div class="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg space-y-5 border border-gray-200">
        <h2 class="text-xl font-bold text-[#9E4CFF] mb-4">The Campaign Facts</h2>

        <form @submit.prevent="doTheSaving" class="space-y-4">
          <!-- Campaign Name -->
          <div>
            <label class="font-semibold text-gray-700 block mb-1">Name of the Campaign</label>
            <input v-model="emailData.name" class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-[#9E4CFF] focus:border-[#9E4CFF]" required />
          </div>

          <!-- Subject -->
          <div>
            <label class="font-semibold text-gray-700 block mb-1">Subject Line (IMPORTANT)</label>
            <input v-model="emailData.subject" class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-[#9E4CFF] focus:border-[#9E4CFF]" required />
          </div>

          <!-- From -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-semibold text-gray-700 block mb-1">Your Name</label>
              <input v-model="emailData.from_name" class="w-full border border-gray-300 rounded-lg p-3 text-sm" />
            </div>
            <div>
              <label class="font-semibold text-gray-700 block mb-1">Your Email</label>
              <input type="email" v-model="emailData.from_email" class="w-full border border-gray-300 rounded-lg p-3 text-sm" />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="font-semibold text-gray-700 block mb-1">Description (Just for you)</label>
            <textarea v-model="emailData.description" class="w-full border border-gray-300 rounded-lg p-3 text-sm"></textarea>
          </div>

          <!-- Send Date -->
          <div>
            <label class="font-semibold text-gray-700 block mb-1">When to send it?</label>
            <input type="datetime-local" v-model="emailData.send_date" class="w-full border border-gray-300 rounded-lg p-3 text-sm" />
          </div>

          <!-- Audience Selection -->
          <div class="mt-6 border-t pt-6 space-y-5">
            <h3 class="text-lg font-bold text-gray-800">Target Audience</h3>

            <!-- Choose List -->
            <div>
              <label class="font-semibold text-gray-700 block mb-1">Select List</label>
              <select v-model="selectedListId" class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-[#9E4CFF] focus:border-[#9E4CFF] bg-white">
                <option value="">-- choose list --</option>
                <option v-for="l in lists" :key="l.list_id" :value="l.list_id">
                  {{ l.list_name }} ({{ l.subscribers }} subs)
                </option>
              </select>
              <p v-if="selectedList" class="text-xs text-gray-500 mt-2">
                List has <strong>{{ selectedList.subscribers }}</strong> subscribers.
              </p>
            </div>

            <!-- Tag Groups -->
            <div>
              <label class="font-semibold text-gray-700 block mb-1">
                Filter by Tags <span class="text-xs text-gray-500 ml-1">({{ selectedTags.length }} selected)</span>
              </label>
              <div class="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto shadow-inner">
                <!-- All subscribers -->
                <label class="flex items-center gap-2 text-sm mb-2 font-medium border-b pb-1">
                  <input type="checkbox" :value="ALL_TAG" v-model="selectedTags" class="text-[#9E4CFF] focus:ring-[#9E4CFF] rounded" /> 
                  <span>All subscribers ({{ selectedList?.subscribers ?? '—' }})</span>
                </label>

                <!-- Individual Tags -->
                <div v-if="availableTags.length" class="mt-2">
                  <label v-for="tag in availableTags" :key="tag" class="flex items-center gap-2 text-sm mb-1.5 cursor-pointer hover:text-[#9E4CFF]">
                    <input type="checkbox" :value="tag" v-model="selectedTags" class="text-[#9E4CFF] focus:ring-[#9E4CFF] rounded" />
                    <span class="capitalize">{{ tag }}</span>
                  </label>
                </div>
                <div v-else class="text-xs text-gray-400 py-2">No tags available in this list.</div>
              </div>
            </div>

            <!-- Recipients Preview -->
            <div>
              <label class="font-semibold text-gray-700 block mb-1">
                  Recipients Preview <span class="text-xs text-gray-500 ml-1">({{ recipientsCount }} total)</span>
              </label>
              <div class="border border-gray-300 rounded-lg bg-white max-h-48 overflow-y-auto shadow-sm p-3">
                <div v-if="recipientsCount === 0" class="text-gray-500 py-4 text-center text-sm">
                  Select a list and tags to see recipients.
                </div>
                <ul v-else class="space-y-2">
                  <li v-for="r in recipientPreview" :key="r.id" class="p-2 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div class="flex flex-col">
                      <div class="flex justify-between items-start">
                        <div class="font-medium text-gray-800 text-sm truncate pr-2">{{ r.first_name }} {{ r.last_name }}</div>
                        <div class="text-xs text-gray-400 flex-shrink-0 ml-2 mt-0.5">{{ formatDate(r.last_activity) }}</div>
                      </div>
                      <div class="text-xs text-gray-500 truncate mt-0.5">{{ r.email }}</div>
                    </div>
                  </li>
                </ul>
                <div v-if="recipientsCount > recipientPreview.length" class="text-xs text-gray-400 mt-2 text-center pt-2 border-t border-gray-100">
                  ...and {{ recipientsCount - recipientPreview.length }} more not shown in preview
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Column 2: Email Editor -->
      <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Write the Actual Email Here</h2>

        <EmailContentEditor
          :main-email-stuff="emailData.content"
          @sendNewEmailHtml="updateContentFromChild"
          :campaign-id="emailData.id"
          ref="childRef"
        />

        <div class="pt-6 flex justify-end gap-3 border-t mt-6">
          <button type="button" @click="goBackHome" class="px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
            Cancel and Forget
          </button>
          <button type="button" @click="doTheSaving" class="px-5 py-3 bg-[#9E4CFF] text-white font-medium rounded-xl hover:bg-[#6C47B5] transition-colors shadow-md">
            Slam that Save/Schedule Button
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import EmailContentEditor from './EmailContentEditor.vue'
import { useToast } from 'vue-toastification'

const props = defineProps({ onChangeTab: Function })
const emit = defineEmits(['updateTab'])
const toast = useToast()
const childRef = ref(null)
const ALL_TAG = '__all__'

// Campaign form
const emailData = ref({
  id: null,
  name: '',
  description: '',
  subject: '',
  content: '<h1>Write your really cool email here!</h1><p>I hope this works...</p>',
  from_name: 'Friendly Bot',
  from_email: 'hello@robot.com',
  send_date: ''
})

// Audience lists
const lists = ref([])
const selectedListId = ref('')
const selectedTags = ref([])

// Helpers
function makeUpAnId() {
  return `ID-Number-${Date.now()}-${Math.floor(Math.random() * 99999)}`
}

// Fetch lists.json on mount
onMounted(async () => {
  try {
    const savedEdit = JSON.parse(localStorage.getItem('editingCampaign'))
    if (savedEdit) {
      Object.assign(emailData.value, savedEdit)
      if (savedEdit.list_id) selectedListId.value = savedEdit.list_id
      if (savedEdit.tag_groups) {
        selectedTags.value = Array.isArray(savedEdit.tag_groups) ? savedEdit.tag_groups.slice() : [savedEdit.tag_groups]
      }
    }

    const res = await fetch('/data/lists.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const jsonData = await res.json()
    lists.value = Array.isArray(jsonData) ? jsonData : [jsonData]

    if (!selectedListId.value && lists.value.length > 0) selectedListId.value = lists.value[0].list_id
  } catch (err) {
    console.error('Failed to load lists.json', err)
    toast.error('Error loading audience list data.')
  }

  if (!emailData.value.id) emailData.value.id = makeUpAnId()
})

// Computed: selected list
const selectedList = computed(() => lists.value.find(l => String(l.list_id) === String(selectedListId.value)) || null)

// Available tags
const availableTags = computed(() => {
  if (!selectedList.value?.data) return []
  const set = new Set()
  selectedList.value.data.forEach(c => Array.isArray(c.tags) && c.tags.forEach(t => set.add(t)))
  return Array.from(set).sort()
})

// Recipients
const recipients = computed(() => {
  if (!selectedList.value?.data) return []
  if (selectedTags.value.includes(ALL_TAG) || selectedTags.value.length === 0) return selectedList.value.data.slice()
  return selectedList.value.data.filter(c => selectedTags.value.some(tag => c.tags.includes(tag)))
})
const recipientsCount = computed(() => recipients.value.length)
const recipientPreview = computed(() => recipients.value.slice(0, 10))

// Editor callback
function updateContentFromChild(newHtml) {
  emailData.value.content = newHtml
}

// Save campaign
function doTheSaving() {
  if (!selectedListId.value) { toast.error('Please select a mailing list first.'); return }
  if (recipientsCount.value === 0) { toast.error('No recipients. Adjust tags.'); return }

  const campaignsList = JSON.parse(localStorage.getItem('campaigns') || '[]')
  const existingIndex = campaignsList.findIndex(c => String(c.id) === String(emailData.value.id))

  const recipientsMeta = {
    list_id: selectedList.value?.list_id ?? null,
    list_name: selectedList.value?.list_name ?? null,
    tag_groups: selectedTags.value.slice(),
    recipients_count: recipientsCount.value
  }

  const finalCampaignData = {
    ...emailData.value,
    status: emailData.value.send_date ? 'Scheduled' : 'Draft',
    emailsSent: emailData.value.emailsSent || 0,
    opens: emailData.value.opens || 0,
    clicks: emailData.value.clicks || 0,
    bounces: emailData.value.bounces || 0,
    conversion_rate: emailData.value.conversion_rate || 0,
    createdAt: emailData.value.createdAt || getTodayNice(),
    recipients: recipientsMeta
  }

  if (existingIndex >= 0) campaignsList[existingIndex] = finalCampaignData
  else campaignsList.unshift(finalCampaignData)

  localStorage.setItem('campaigns', JSON.stringify(campaignsList))
  localStorage.removeItem('editingCampaign')
  if (childRef.value?.forgetMyDrafts) childRef.value.forgetMyDrafts()

  toast.success(existingIndex >= 0 ? 'Updated! Everything is good.' : 'New campaign saved!')
  if (props.onChangeTab) props.onChangeTab('campaigns')
  else emit('updateTab', 'campaigns')
}

// Cancel
function goBackHome() {
  localStorage.removeItem('editingCampaign')
  if (childRef.value?.forgetMyDrafts) childRef.value.forgetMyDrafts()
  toast.warning('Abort! Mission canceled. Drafts wiped.')
  if (props.onChangeTab) props.onChangeTab('campaigns')
  else emit('updateTab', 'campaigns')
}

// Helpers
function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
function getTodayNice(date = new Date()) {
  return date.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
input[type="checkbox"] {
  height: 1.1em;
  width: 1.1em;
}
</style>
