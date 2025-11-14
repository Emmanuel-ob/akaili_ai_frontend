<!-- components/EmailNavbar.vue -->
<template>
  <nav class="bg-white border-b border-gray-200 px-6 py-3 flex gap-6">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      :class="[
        'text-sm font-medium transition-colors pb-2',
        activeTab === tab.key
          ? 'text-[#9E4CFF] border-b-2 border-[#9E4CFF]'
          : 'text-gray-500 hover:text-gray-700'
      ]"
      @click="$emit('change-tab', tab.key)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<script setup>
const props = defineProps({
  activeTab: String
})

const tabs = [
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'templates', label: 'Templates' },
  { key: 'editor', label: 'Editor' }, 
  { key: 'audience', label: 'Audience' },
  { key: 'automation', label: 'Automation' },
  { key: 'analytics', label: 'Analytics' }
]
</script>
