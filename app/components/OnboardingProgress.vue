<!-- components/dashboard/onboardingProgress.vue -->
<template>
  <div class="flex items-center justify-center w-full max-w-full px-2" role="progressbar" :aria-valuenow="current" aria-valuemin="1" aria-valuemax="3">
    <template v-for="(step, index) in steps" :key="index">
      
      <!-- Step Item -->
      <div class="flex items-center group">
        <!-- Circle Indicator with Motion -->
        <Motion
          :initial="false"
          :animate="{ 
            scale: current === index + 1 ? 1.1 : 1,
            backgroundColor: current >= index + 1 ? '#9E4CFF' : 'var(--bg-inactive)'
          }"
          :transition="{ duration: 0.3 }"
          :class="[
            'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors duration-300 flex-shrink-0 relative z-10',
            current >= index + 1 ? 'text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 dark:text-gray-400 border-2 border-gray-200 dark:border-slate-800'
          ]"
          :style="{ '--bg-inactive': 'transparent' }"
        >
          <Check v-if="current > index + 1" class="w-5 h-5 stroke-[3]" />
          <span v-else>{{ index + 1 }}</span>
        </Motion>
        
        <!-- Step Label -->
        <span 
          :class="[
            'ml-2 text-[10px] sm:text-sm font-semibold transition-colors duration-500 whitespace-nowrap',
            current >= index + 1 ? 'text-[#9E4CFF] dark:text-purple-400' : 'text-gray-400 dark:text-gray-500',
            current === index + 1 ? 'block' : 'hidden md:block'
          ]"
        >
          {{ step.label }}
        </span>
      </div>
      
      <!-- Connector Line with Fill Animation -->
      <div 
        v-if="index < steps.length - 1"
        class="h-1 mx-2 sm:mx-4 w-6 sm:w-12 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden relative flex-shrink-0"
      >
        <!-- The Animated Fill -->
        <Motion
          :initial="{ width: '0%' }"
          :animate="{ width: current >= index + 2 ? '100%' : '0%' }"
          :transition="{ duration: 0.6, ease: 'circOut' }"
          class="absolute inset-y-0 left-0 bg-[#9E4CFF]"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next'
import { Motion } from 'motion-v'

defineProps({
  current: {
    type: Number,
    required: true
  }
})

const steps = [
  { label: 'Company Setup' },
  { label: 'Create Chatbot' },
  { label: 'Complete' }
]
</script>

<style scoped>
/* Ensure border-box sizing for the motion elements */
div {
  box-sizing: border-box;
}
</style>