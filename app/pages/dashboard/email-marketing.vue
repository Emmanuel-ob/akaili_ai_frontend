<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navbar Tabs -->
    <EmailNavbar :active-tab="activeTab" @change-tab="activeTab = $event" />

    <!-- Dynamic Tab Component -->
    <div class="p-6">
      <component
        :is="activeComponent"
        :campaigns="campaigns"
        :onChangeTab="(tab) => activeTab = tab"
        :onAddCampaign="addCampaign"
        :onUpdateCampaign="updateCampaign"
        :onDeleteCampaign="deleteCampaign"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import EmailNavbar from '~/components/emailMarketing/EmailNavbar.vue'

// Components
import EmailCampaignsView from '~/components/emailMarketing/EmailCampaignsView.vue'
import EmailTemplatesView from '~/components/emailMarketing/EmailTemplatesView.vue'
import EmailAudienceView from '~/components/emailMarketing/EmailAudienceView.vue'
import EmailAutomation from '~/components/emailMarketing/EmailAutomation.vue'
import EmailAnalyticsView from '~/components/emailMarketing/EmailAnalyticsView.vue'
import CampaignEditor from '~/components/emailMarketing/CampaignEditor.vue'
import { getMergedCampaignData } from '~/utils/dataUtils.js'

const activeTab = ref('campaigns')
const campaigns = ref([])

onMounted(async () => {
  await loadCampaigns()
  startCampaignWatcher()
})

// 🔹 Load from localStorage or fallback
async function loadCampaigns() {
  const saved = localStorage.getItem('campaigns')
  if (saved) {
    campaigns.value = JSON.parse(saved)
  } else {
    campaigns.value = await getMergedCampaignData()
    localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
  }
}

// 🔹 Add new campaign (used by modal)
function addCampaign(campaign) {
  const newCampaign = {
    ...campaign,
    id: Date.now(),
    createdAt: new Date().toLocaleDateString(),
    emailsSent: 0,
    opens: 0,
    clicks: 0,
    bounces: 0,
    conversion_rate: 0,
    status: campaign.status || 'Draft'
  }

  campaigns.value.unshift(newCampaign)
  localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
}

// 🔹 Update campaign (used by details modal or editor)
function updateCampaign(updated) {
  const index = campaigns.value.findIndex(c => c.id === updated.id)
  if (index !== -1) {
    campaigns.value[index] = { ...campaigns.value[index], ...updated }
    localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
  }
}

// 🔹 Delete campaign
function deleteCampaign(campaign) {
  campaigns.value = campaigns.value.filter(c => c.id !== campaign.id)
  localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
}

// 🔹 Auto-activate scheduled campaigns
function startCampaignWatcher() {
  setInterval(() => {
    const now = new Date()
    let changed = false

    campaigns.value.forEach(campaign => {
      if (campaign.send_date && campaign.status === 'Scheduled') {
        const sendTime = new Date(campaign.send_date)
        if (sendTime <= now) {
          campaign.status = 'Active'
          campaign.emailsSent = (campaign.emailsSent || 0) + 1
          changed = true
        }
      }
    })

    if (changed) {
      localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
    }
  }, 60 * 1000)
}

// 🔹 Auto-persist on any manual change
watch(campaigns, (newVal) => {
  localStorage.setItem('campaigns', JSON.stringify(newVal))
}, { deep: true })

// 🔹 Map active tab
const activeComponent = computed(() => ({
  campaigns: EmailCampaignsView,
  templates: EmailTemplatesView,
  editor: CampaignEditor,
  audience: EmailAudienceView,
  automation: EmailAutomation,
  analytics: EmailAnalyticsView
}[activeTab.value]))
</script>
