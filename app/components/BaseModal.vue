<!-- components/BaseModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border shadow-lg rounded-md bg-white" :class="sizeClass">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
        <button class="text-gray-400 hover:text-gray-600" @click="$emit('close')" >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
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
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-1/2',
    xl: 'w-2/3'
  }
  return sizes[props.size] || sizes.md
})
</script>