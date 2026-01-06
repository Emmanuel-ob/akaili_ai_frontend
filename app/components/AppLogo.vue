<!-- components/AppLogo.vue -->
<template>
  <div class="flex items-center" :class="centerClass">
   <img src="/Logo.png" alt="logo" class="object-contain max-h-full" />
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  center: {
    type: Boolean,
    default: false
  }
})

const centerClass = computed(() => props.center ? 'justify-center' : '')

const sizeClasses = computed(() => {
  const sizes = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-sm',
      title: 'text-xl'
    },
    md: {
      container: 'w-12 h-12',
      text: 'text-lg',
      title: 'text-3xl'
    },
    lg: {
      container: 'w-16 h-16',
      text: 'text-2xl',
      title: 'text-4xl'
    }
  }
  return sizes[props.size]
})
</script>