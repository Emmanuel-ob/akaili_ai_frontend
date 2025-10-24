<!-- app/components/emailMarketing/EmailCampaignList.vue -->
<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-700">Campaigns</h2>
    </div>

    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emails Sent</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opens</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="(campaign, index) in campaigns" 
          :key="index"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-6 py-4 text-sm text-gray-900">{{ campaign.name }}</td>

          <!-- Status badge -->
          <td class="px-6 py-4">
            <span
              :class="[
                'px-2 py-1 rounded text-xs font-medium',
                campaign.status === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : campaign.status === 'Paused'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-500'
              ]"
            >
              {{ campaign.status }}
            </span>
          </td>

          <td class="px-6 py-4 text-sm text-gray-600">{{ campaign.emailsSent }}</td>
          <td class="px-6 py-4 text-sm text-gray-600">{{ campaign.opens }}</td>
          <td class="px-6 py-4 text-sm text-gray-600">{{ campaign.clicks }}</td>
          <td class="px-6 py-4 text-sm text-gray-600">{{ campaign.conversion_rate }}%</td>
          <td class="px-6 py-4 text-sm text-gray-500">{{ campaign.createdAt }}</td>

          <td class="px-6 py-4 text-right space-x-3 flex justify-end items-center"> 
            <button 
              @click="viewCampaign(campaign)" 
              class="text-[#7F56D9] hover:underline text-sm"
            >
              View
            </button>

            <!-- Delete Button -->
            <button
              @click="confirmDelete(campaign)"
              class="text-red-500 hover:text-red-700 border-0 active:border-0 "
              title="Delete Campaign"
            >
              🗑️
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Campaign Details Modal -->
    <CampaignDetailsModal
      v-if="selectedCampaign"
      :show="!!selectedCampaign"
      :campaign="selectedCampaign"
      :onChangeTab="props.onChangeTab"
      @close="selectedCampaign = null"
      @update="updateCampaign"
    />

    <!-- Delete Confirmation Modal -->
    <EmailBaseModal
      v-if="deleteConfirm"
      :show="!!deleteConfirm"
      title="Confirm Deletion"
      size="sm"
      @close="deleteConfirm = null"
    >
      <template #body>
        <p class="text-gray-700 mb-6">
          Are you sure you want to delete the campaign 
          <span class="font-semibold">"{{ deleteConfirm.name }}"</span>?
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="deleteConfirm = null"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            @click="deleteCampaign(deleteConfirm)"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Yes, Delete
          </button>
        </div>
      </template>
    </EmailBaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { getMergedCampaignData } from '~/utils/dataUtils.js'
import CampaignDetailsModal from './CampaignDetailsModal.vue'
import EmailBaseModal from './EmailBaseModal.vue'

const props = defineProps({
  newCampaign: Object,
  onChangeTab: Function
})

const campaigns = ref([])
const selectedCampaign = ref(null)
const deleteConfirm = ref(null)

// Fetch campaigns
onMounted(async () => {
  const saved = localStorage.getItem('campaigns')
  if (saved) {
    campaigns.value = JSON.parse(saved)
  } else {
    campaigns.value = await getMergedCampaignData()
  }
})

// Watch for new campaigns being added
watch(
  () => props.newCampaign,
  (newVal) => {
    if (newVal) {
      campaigns.value.unshift({
        name: newVal.name,
        status: newVal.status || 'Draft',
        emailsSent: newVal.emailsSent || 0,
        createdAt: new Date().toLocaleDateString(),
        description: newVal.description || 'No description provided.',
        content: newVal.content || 'Email content not yet created.',
        opens: 0,
        clicks: 0,
        bounces: 0,
        conversion_rate: 0
      })
      localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
    }
  },
  { deep: true }
)

// Campaign actions
function viewCampaign(campaign) {
  selectedCampaign.value = campaign
}

function updateCampaign(updated) {
  campaigns.value = campaigns.value.map(c => 
    c.name === updated.name ? updated : c
  )
  localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
  selectedCampaign.value = null
}

function confirmDelete(campaign) {
  deleteConfirm.value = campaign
}

function deleteCampaign(campaign) {
  campaigns.value = campaigns.value.filter(c => c.name !== campaign.name)
  localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
  deleteConfirm.value = null
}

// 🧠 Keyboard support for delete confirmation
function handleKeydown(event) {
  if (!deleteConfirm.value) return

  if (event.key === 'Enter') {
    deleteCampaign(deleteConfirm.value)
  } else if (event.key === 'Escape') {
    deleteConfirm.value = null
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>
