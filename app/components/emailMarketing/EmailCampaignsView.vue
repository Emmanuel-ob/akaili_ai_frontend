<!-- app/components/emailMarketing/EmailCampaignsView.vue -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Email Marketing</h1>
        <p class="text-sm text-gray-500 mt-1">
          Create and manage your email campaigns
        </p>
      </div>
        <button
        @click="goToTemplates"
        class="bg-[#7F56D9] text-white px-5 py-2 rounded-lg shadow hover:bg-[#6C47B5] flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Campaign
      </button>
    </div>

    <!-- Campaign Stats -->
    <EmailStats :campaigns="campaigns" />

    <!-- Campaign List -->
    <div class="mt-6">
      <EmailCampaignList
        :campaigns="campaigns"
        :onChangeTab="props.onChangeTab"
      />
    </div>

    <!-- Modal -->
    <CreateCampaignModal
      v-if="showCreateCampaign"
      :show="showCreateCampaign"
      @create="handleNewCampaign"
      @close="showCreateCampaign = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import EmailStats from '~/components/emailMarketing/EmailStats.vue'
import EmailCampaignList from '~/components/emailMarketing/EmailCampaignList.vue'
import CreateCampaignModal from '~/components/emailMarketing/CreateCampaignModal.vue'
import { getMergedCampaignData } from '~/utils/dataUtils.js'

const props = defineProps({
  campaigns: Array,
  onChangeTab: Function,
  onAddCampaign: Function
})

const showCreateCampaign = ref(false)
const campaigns = ref([])
let schedulerInterval = null



    const emit = defineEmits(['change-tab'])


// This replaces your old emit call
function goToTemplates() {
  if (props.onChangeTab) props.onChangeTab('templates')
}

// ✅ Load campaigns from localStorage or defaults
onMounted(async () => {
  const saved = localStorage.getItem('campaigns')
  if (saved) {
    campaigns.value = JSON.parse(saved)
  } else {
    campaigns.value = await getMergedCampaignData()
  }

  // Run immediately and then every minute
  checkAndActivateCampaigns()
  schedulerInterval = setInterval(checkAndActivateCampaigns, 60000)
})

onBeforeUnmount(() => {
  if (schedulerInterval) clearInterval(schedulerInterval)
})

// 🔹 Save campaigns helper
function saveCampaigns() {
  localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
}

// 🔹 Watcher function for scheduled campaigns
function checkAndActivateCampaigns() {
  const now = new Date()

  campaigns.value.forEach(campaign => {
    if (campaign.status === 'Scheduled' && campaign.send_date) {
      const sendTime = new Date(campaign.send_date)

      // Check if scheduled time has passed
      if (sendTime <= now) {
        campaign.status = 'Active'
        campaign.emailsSent = (campaign.emailsSent || 0) + 1
      }
    }
  })

  saveCampaigns()
}

// 🔹 When a new campaign is created
function handleNewCampaign(campaign) {
  campaigns.value.unshift({
    ...campaign,
    createdAt: new Date().toLocaleString(),
    emailsSent: 0,
    opens: 0,
    clicks: 0,
    bounces: 0,
    conversion_rate: 0,
    status: campaign.status || 'Draft'
  })

  props.onAddCampaign(campaign)
  saveCampaigns()
  showCreateCampaign.value = false
}
</script>
