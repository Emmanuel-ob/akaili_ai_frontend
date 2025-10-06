<template>
  <div 
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-md"
  >
    <div
      class="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl 
             w-[90%] md:w-[70%] max-w-6xl max-h-[90vh] overflow-y-auto p-6"
      :class="sizeClass"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
        <button class="text-gray-400 hover:text-gray-600 transition" @click="$emit('close')">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Slot for form content -->
      <slot />
    </div>
  </div>
</template>


<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

defineEmits(['close'])

const sizeClass = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-4xl',
    lg: 'max-w-3xl',
    xl: 'max-w-4xl'
  }
  return sizes[props.size] || sizes.md
})
</script>
