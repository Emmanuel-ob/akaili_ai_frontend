<!-- pages/dashboard/email-marketing.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navbar Tabs -->
    <EmailNavbar :active-tab="activeTab" @change-tab="activeTab = $event" />

    <!-- Render the active tab component -->
     <div class="p-6">
    <component
  :is="activeComponent"
  v-bind="{
    onChangeTab: (tab) => activeTab = tab
  }"
/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import EmailNavbar from '~/components/emailMarketing/EmailNavbar.vue'

// Import each view (starting with Campaigns)
import EmailCampaignsView from '~/components/emailMarketing/EmailCampaignsView.vue'
import EmailTemplatesView from '~/components/emailMarketing/EmailTemplatesView.vue'
import EmailAudienceView from '~/components/emailMarketing/EmailAudienceView.vue'
import EmailAutomation from '~/components/emailMarketing/EmailAutomation.vue'
import EmailAnalyticsView from '~/components/emailMarketing/EmailAnalyticsView.vue'
import CampaignEditor from '~/components/emailMarketing/CampaignEditor.vue'

const activeTab = ref('campaigns')

const activeComponent = computed(() => {
  return {
    campaigns: EmailCampaignsView,
    templates: EmailTemplatesView,
    editor: CampaignEditor,  
    audience: EmailAudienceView,
    automation: EmailAutomation,
    analytics: EmailAnalyticsView
  }[activeTab.value]
})
</script>
