<!-- app/components/emailMarketing/CampaignDetailsModal.vue -->
<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div
      class="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]"
    >
      <!-- Close -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>

      <!-- Header -->
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        {{ campaign.name }}
      </h2>
      <p class="text-gray-500 mb-4">{{ campaign.description }}</p>

      <!-- 🎯 Target Audience -->
      <div
        v-if="targetList"
        class="border border-gray-200 bg-gray-50 rounded-lg p-4 mb-6"
      >
        <h3 class="font-semibold text-gray-700 mb-2 flex items-center gap-2">
          🎯 Target Audience
        </h3>
        <div class="text-gray-600 text-sm space-y-2">
          <p>
            <span class="font-medium">List:</span>
            {{ targetList.list_name }} ({{ targetList.subscribers }} subscribers)
          </p>

          <!-- 🏷️ Multiple Tag Groups -->
          <div v-if="recipientsTagGroups && recipientsTagGroups.length">
            <span class="font-medium">Tag Groups:</span>
            <div class="flex flex-wrap gap-2 mt-1">
              <span
                v-for="tag in recipientsTagGroups"
                :key="tag"
                class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Fallback for single campaign.tag_group -->
          <div v-else-if="campaign.tag_group">
            <span class="font-medium">Tag Group:</span>
            <span
              class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
            >
              {{ campaign.tag_group }}
            </span>
          </div>

          <!-- Example contacts -->
          <p v-if="sampleContacts.length" class="text-xs text-gray-500 mt-1">
            Example contacts: {{ sampleContacts.join(', ') }}
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg text-center border-l-4 border-purple-500">
          <p class="text-lg font-semibold">{{ campaign.emailsSent }}</p>
          <p class="text-sm text-gray-500">Emails Sent</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg text-center border-l-4 border-green-500">
          <p class="text-lg font-semibold">{{ campaign.opens }}</p>
          <p class="text-sm text-gray-500">Opens</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg text-center border-l-4 border-blue-500">
          <p class="text-lg font-semibold">{{ campaign.clicks }}</p>
          <p class="text-sm text-gray-500">Clicks</p>
        </div>
      </div>

      <!-- Email Preview -->
      <div class="border rounded-lg p-4 mb-6 bg-gray-50">
        <h3 class="font-semibold text-gray-700 mb-2">Email Content</h3>
        <div
          class="prose prose-sm max-w-none bg-white p-4 border rounded-lg"
          v-html="campaign.content"
        ></div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 flex-wrap">
        <button
          @click="sendTestEmail"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Send Test Email
        </button>

        <button
          @click="editCampaign"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Edit Campaign
        </button>

        <button
          @click="toggleCampaign"
          :class="[
            'px-5 py-2 rounded-lg text-white transition',
            campaign.status === 'Active'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-[#9E4CFF] hover:bg-[#6C47B5]'
          ]"
        >
          {{
            campaign.status === 'Active'
              ? 'Stop Campaign'
              : 'Start Campaign'
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast()

const props = defineProps({
  campaign: Object,
  onChangeTab: Function
})

const emit = defineEmits(['close', 'update'])

const lists = ref([])
const targetList = ref(null)
const sampleContacts = ref([])
const recipientsTagGroups = ref([])

// 🧭 Load Lists and Find Target + tag_groups
onMounted(async () => {
  try {
    const res = await fetch('/data/lists.json')
    const data = await res.json()
    lists.value = Array.isArray(data) ? data : [data]

    targetList.value = lists.value.find(
      list => list.list_id === props.campaign.list_id
    )

    // Multiple tag groups if available
    if (props.campaign.recipients && props.campaign.recipients.tag_groups) {
      recipientsTagGroups.value = props.campaign.recipients.tag_groups
    }

    // Build sample contacts if single tag_group exists
    if (targetList.value && props.campaign.tag_group) {
      const filtered = targetList.value.data.filter(sub =>
        sub.tags.includes(props.campaign.tag_group)
      )
      sampleContacts.value = filtered
        .slice(0, 3)
        .map(s => s.first_name + ' ' + s.last_name)
    }
  } catch (err) {
    console.error('Error loading lists:', err)
  }
})

// ✅ Send test email — increment count and toast
function sendTestEmail() {
  const updated = {
    ...props.campaign,
    emailsSent: (props.campaign.emailsSent || 0) + 1
  }

  const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
  const index = campaigns.findIndex(c => c.name === props.campaign.name)
  if (index !== -1) campaigns[index] = updated
  localStorage.setItem('campaigns', JSON.stringify(campaigns))

  emit('update', updated)
  toast.success(`📧 Test email sent for "${props.campaign.name}"!`)
}

// ✅ Toggle campaign
function toggleCampaign() {
  let newStatus
  if (props.campaign.status === 'Active') {
    newStatus = 'Paused'
    toast.info(`⏸️ Campaign "${props.campaign.name}" paused.`)
  } else if (props.campaign.status === 'Paused') {
    newStatus = 'Active'
    toast.success(`▶️ Campaign "${props.campaign.name}" resumed.`)
  } else {
    newStatus = 'Active'
    toast.success(`🚀 Campaign "${props.campaign.name}" started!`)
  }

  const updated = { ...props.campaign, status: newStatus }

  const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
  const index = campaigns.findIndex(c => c.name === props.campaign.name)
  if (index !== -1) campaigns[index] = updated
  localStorage.setItem('campaigns', JSON.stringify(campaigns))

  emit('update', updated)
}

// ✅ Edit campaign
function editCampaign() {
  localStorage.setItem('editingCampaign', JSON.stringify(props.campaign))
  if (props.onChangeTab) props.onChangeTab('editor')
  emit('close')
}
</script>
