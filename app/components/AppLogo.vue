<!-- components/AppLogo.vue -->
<template>
  <div class="flex items-center" :class="centerClass">
    <div class="bg-purple-600 rounded-full flex items-center justify-center" :class="sizeClasses.container">
      <span class="text-white font-bold" :class="sizeClasses.text">A</span>
    </div>
    <h1 class="ml-3 font-bold text-purple-600" :class="sizeClasses.title">Akili AI</h1>
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