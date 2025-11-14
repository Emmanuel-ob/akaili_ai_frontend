<!-- components/dashboard/onboardingProgress.vue -->
<template>
  <div class="flex items-center justify-center space-x-4">
    <div class="flex items-center">
      <div 
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
          current >= 1 ? 'bg-[#9E4CFF] text-white' : 'bg-gray-600 text-gray-300'
        ]"
      >
        1
      </div>
      <span :class="['ml-2 text-sm', current >= 1 ? 'text-purple-400' : 'text-gray-400']">
        Company Setup
      </span>
    </div>
    
    <div :class="['w-12 h-0.5', current >= 2 ? 'bg-[#9E4CFF]' : 'bg-gray-600']"/>
    
    <div class="flex items-center">
      <div 
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
          current >= 2 ? 'bg-[#9E4CFF] text-white' : 'bg-gray-600 text-gray-300'
        ]"
      >
        2
      </div>
      <span :class="['ml-2 text-sm', current >= 2 ? 'text-purple-400' : 'text-gray-400']">
        Create Chatbot
      </span>
    </div>
    
    <div :class="['w-12 h-0.5', current >= 3 ? 'bg-[#9E4CFF]' : 'bg-gray-600']"/>
    
    <div class="flex items-center">
      <div 
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
          current >= 3 ? 'bg-[#9E4CFF] text-white' : 'bg-gray-600 text-gray-300'
        ]"
      >
        3
      </div>
      <span :class="['ml-2 text-sm', current >= 3 ? 'text-purple-400' : 'text-gray-400']">
        Complete
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  current: {
    type: Number,
    required: true
  }
})
</script>