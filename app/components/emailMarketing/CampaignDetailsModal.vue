<!-- CampaignDetailsModal.vue -->
<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]">
      <!-- Close -->
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
        ✕
      </button>

      <!-- Header -->
      <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ campaign.name }}</h2>
      <p class="text-gray-500 mb-4">{{ campaign.description }}</p>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg text-center">
          <p class="text-lg font-semibold">{{ campaign.emailsSent }}</p>
          <p class="text-sm text-gray-500">Emails Sent</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg text-center">
          <p class="text-lg font-semibold">{{ campaign.opens }}</p>
          <p class="text-sm text-gray-500">Opens</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg text-center">
          <p class="text-lg font-semibold">{{ campaign.clicks }}</p>
          <p class="text-sm text-gray-500">Clicks</p>
        </div>
      </div>

      <!-- Email Preview -->
      <div class="border rounded-lg p-4 mb-6 bg-gray-50">
        <h3 class="font-semibold text-gray-700 mb-2">Email Content</h3>
        <p class="text-sm text-gray-600 whitespace-pre-line">{{ campaign.content }}</p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <button
          @click="sendTestEmail"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Send Test Email
        </button>

        <!-- Dynamic Campaign Button -->
        <button
          @click="toggleCampaign"
          :class="[
            'px-5 py-2 rounded-lg text-white transition',
            campaign.status === 'Active'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-[#7F56D9] hover:bg-[#6C47B5]'
          ]"
        >
          {{ campaign.status === 'Active' ? 'Stop Campaign' : 'Start Campaign' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  campaign: Object,
})

const emit = defineEmits(['close', 'update'])

function sendTestEmail() {
  alert(`📧 Test email sent for "${props.campaign.name}"`)
}

function toggleCampaign() {
  let newStatus

  if (props.campaign.status === 'Active') {
    newStatus = 'Paused'
    alert(`⏸️ Campaign "${props.campaign.name}" paused.`)
  } else if (props.campaign.status === 'Paused') {
    newStatus = 'Active'
    alert(`▶️ Campaign "${props.campaign.name}" resumed.`)
  } else {
    newStatus = 'Active'
    alert(`🚀 Campaign "${props.campaign.name}" started!`)
  }

  emit('update', { ...props.campaign, status: newStatus })
}
</script>
