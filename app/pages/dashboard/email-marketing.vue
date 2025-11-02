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
import { useToast } from 'vue-toastification'

const toast = useToast()
const activeTab = ref('campaigns')
const campaigns = ref([])

onMounted(async () => {
  await loadCampaigns()
  startCampaignWatcher()
})

/* -------------------------------
   Load Campaigns (Global Source)
--------------------------------*/
async function loadCampaigns() {
  const saved = localStorage.getItem('campaigns')
  if (saved) {
    campaigns.value = JSON.parse(saved)
  } else {
    campaigns.value = await getMergedCampaignData()
    localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
  }
}

/* -------------------------------
   Add New Campaign
--------------------------------*/
function addCampaign(campaign) {
  const newCampaign = {
    ...campaign,
    id: campaign.id || Date.now(),
    createdAt: new Date().toLocaleString(),
    emailsSent: 0,
    opens: 0,
    clicks: 0,
    bounces: 0,
    conversion_rate: 0,
    list_id: campaign.list_id || null,
    tag_group: campaign.tag_group || '',
    status: campaign.status || 'Draft'
  }

  campaigns.value.unshift(newCampaign)
  localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
  toast.success(`📧 Campaign "${newCampaign.name}" created.`)
}

/* -------------------------------
   Update Campaign
--------------------------------*/
function updateCampaign(updated) {
  const index = campaigns.value.findIndex(c => c.id === updated.id)
  if (index !== -1) {
    campaigns.value[index] = { ...campaigns.value[index], ...updated }
    localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
    toast.info(`✏️ Campaign "${updated.name}" updated.`)
  }
}

/* -------------------------------
   Delete Campaign
--------------------------------*/
function deleteCampaign(campaign) {
  campaigns.value = campaigns.value.filter(c => c.id !== campaign.id)
  localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
  toast.warning(`🗑️ Campaign "${campaign.name}" deleted.`)
}

/* -------------------------------
   Auto-Activate Scheduled Campaigns
--------------------------------*/
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

          toast.success(`🚀 Campaign "${campaign.name}" is now Active!`)
          if (campaign.tag_group) {
            console.log(
              `Targeting tag group: ${campaign.tag_group} from list ID: ${campaign.list_id}`
            )
          }
        }
      }
    })

    if (changed) {
      localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
    }
  }, 60 * 1000)
}

/* -------------------------------
   Auto Save on Change
--------------------------------*/
watch(campaigns, (newVal) => {
  localStorage.setItem('campaigns', JSON.stringify(newVal))
}, { deep: true })

/* -------------------------------
   Dynamic Tab Mapping
--------------------------------*/
const activeComponent = computed(() => ({
  campaigns: EmailCampaignsView,
  templates: EmailTemplatesView,
  editor: CampaignEditor,
  audience: EmailAudienceView,
  automation: EmailAutomation,
  analytics: EmailAnalyticsView
}[activeTab.value]))
</script>