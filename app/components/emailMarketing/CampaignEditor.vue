<!-- app/components/emailMarketing/CampaignEditor.vue -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-4 text-gray-800">Campaign Editor</h1>

    <form @submit.prevent="saveCampaign" class="space-y-4">
      <div>
        <label class="font-medium text-gray-700">Campaign Name</label>
        <input v-model="form.name" class="w-full border rounded-lg p-2" required />
      </div>

      <div>
        <label class="font-medium text-gray-700">Description (Optional)</label>
        <textarea v-model="form.description" class="w-full border rounded-lg p-2"></textarea>
      </div>

      <div>
        <label class="font-medium text-gray-700">Email Subject</label>
        <input v-model="form.subject" class="w-full border rounded-lg p-2" required />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="font-medium text-gray-700">From Name</label>
          <input v-model="form.from_name" class="w-full border rounded-lg p-2" />
        </div>
        <div>
          <label class="font-medium text-gray-700">From Email</label>
          <input v-model="form.from_email" class="w-full border rounded-lg p-2" />
        </div>
      </div>

      <!-- Email Editor -->
      <EmailContentEditor
        v-model="form.content"
        :campaign-id="form.id"
        ref="emailEditor"
      />

      <div>
        <label class="font-medium text-gray-700">Schedule Send Date</label>
        <input
          type="datetime-local"
          v-model="form.send_date"
          class="w-full border rounded-lg p-2"
        />
      </div>

      <div class="pt-6 flex justify-end gap-3">
        <button
          type="button"
          @click="cancel"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-[#7F56D9] text-white rounded-lg hover:bg-[#6C47B5]"
        >
          Save / Schedule
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EmailContentEditor from './EmailContentEditor.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const emit = defineEmits(['updateTab'])
const emailEditor = ref(null)

function generateTempId() {
  return `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

const form = ref({
  id: null,
  name: '',
  description: '',
  subject: '',
  content: '<h2>Write your email here...</h2><p>Customize me!</p>',
  from_name: 'Akili AI',
  from_email: 'no-reply@akiliai.com',
  send_date: ''
})

// Load the campaign currently being edited
onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('editingCampaign'))
  if (saved) Object.assign(form.value, saved)

  // Generate temporary ID for new campaigns so they can have drafts
  if (!form.value.id) form.value.id = generateTempId()
})

// Save campaign and clear draft
function saveCampaign() {
  const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')

  const existingIndex = campaigns.findIndex(c => c.id === form.value.id)
  const campaignData = {
    ...form.value,
    id: form.value.id || Date.now(),
    status: form.value.send_date ? 'Scheduled' : 'Draft',
    emailsSent: form.value.emailsSent || 0,
    opens: form.value.opens || 0,
    clicks: form.value.clicks || 0,
    bounces: form.value.bounces || 0,
    conversion_rate: form.value.conversion_rate || 0,
    createdAt: form.value.createdAt || formatDate()
  }

  if (existingIndex >= 0) {
    campaigns[existingIndex] = campaignData
  } else {
    campaigns.unshift(campaignData)
  }

  localStorage.setItem('campaigns', JSON.stringify(campaigns))
  localStorage.removeItem('editingCampaign')

  // Clear draft for editor
  if (emailEditor.value?.clearDraft) emailEditor.value.clearDraft()

  toast.success('Campaign saved successfully.')
  emit('updateTab', 'campaigns')
}

function formatDate(date = new Date()) {
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function cancel() {
  localStorage.removeItem('editingCampaign')

  if (emailEditor.value?.clearDraft) emailEditor.value.clearDraft()

  toast.warning('Editing canceled. Draft cleared.')
  emit('updateTab', 'campaigns')
}
</script>
