    <!-- app/components/EmailCampaignsView.vue -->
    
  
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Email Marketing</h1>
        <p class="text-sm text-gray-500 mt-1">Create and manage your email campaigns</p>
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
    <EmailStats />

    <!-- Campaign List -->
    <div class="mt-6">
      <EmailCampaignList :new-campaign="newCampaign" />
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
    import { ref } from 'vue'
    import EmailStats from '~/components/emailMarketing/EmailStats.vue'
    import EmailCampaignList from '~/components/emailMarketing/EmailCampaignList.vue'
    import CreateCampaignModal from '~/components/emailMarketing/CreateCampaignModal.vue'

    const showCreateCampaign = ref(false)
    const newCampaign = ref(null)
    const emit = defineEmits(['change-tab'])

// Accept the callback function from parent
const props = defineProps({
  onChangeTab: Function
})

function handleNewCampaign(campaign) {
  newCampaign.value = campaign
  showCreateCampaign.value = false
}

// This replaces your old emit call
function goToTemplates() {
  if (props.onChangeTab) props.onChangeTab('templates')
}
    </script>
