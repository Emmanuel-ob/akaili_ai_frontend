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
import { computed } from 'vue'

const props = defineProps({
  campaigns: Array
})

const stats = computed(() => {
  const total = props.campaigns?.length || 0
  const active = props.campaigns?.filter(c => c.status === 'Active').length || 0
  const sent = props.campaigns?.reduce((acc, c) => acc + (c.emailsSent || 0), 0)
  return { total, active, sent }
})
</script>
