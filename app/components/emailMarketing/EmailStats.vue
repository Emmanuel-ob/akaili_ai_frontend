<!-- components/emailMarketing/EmailStats.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <p class="text-sm text-gray-500">Total Campaigns</p>
      <p class="text-2xl font-bold text-gray-800">{{ stats.total }}</p>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <p class="text-sm text-gray-500">Active Campaigns</p>
      <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <p class="text-sm text-gray-500">Emails Sent</p>
      <p class="text-2xl font-bold text-blue-600">{{ stats.sent }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({ total: 0, active: 0, sent: 0 })

onMounted(async () => {
   const response = await fetch("/data/campaigns.json");
  const data = await response.json(); 


  stats.value.total = data.length
  stats.value.active = data.filter(c => c.status === 'sent').length
  stats.value.sent = data.reduce((acc, c) => acc + c.emailsSent, 0)
})
</script>