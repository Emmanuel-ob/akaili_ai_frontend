<!-- components/chatbot-setup/ColorInput.vue -->
<template>
  <div class="">
    <!-- Label -->
    <label class="block text-base font-semibold mt-4 text-gray-900 dark:text-gray-200">Primary Colour</label>

    <div class="flex items-center mt-2 space-x-3">
      <!-- Color preview -->
      <div class="w-12 h-12 rounded-lg border border-gray-300 dark:border-slate-600 shadow cursor-pointer transition-colors"
        :style="{ backgroundColor: colorWithHash }" @click="$refs.colorPicker.click()">
      </div>

      <!-- Hidden color picker for better UX -->
      <input ref="colorPicker" type="color" :value="colorWithHash" @input="handleColorChange"
        class="w-0 h-0 opacity-0 absolute" />

      <!-- Text Input -->
      <div class="flex-1">
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-mono">#</span>
          <input :value="colorValueDisplay"
            class="w-full pl-8 pr-3 py-3 text-gray-600 dark:text-white bg-white dark:bg-slate-800 rounded-md border border-gray-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono transition-colors"
            type="text" placeholder="6366f1" maxlength="6" pattern="[0-9a-fA-F]{6}" @input="handleTextChange"
            @blur="validateColor" />
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter 6-digit hex color code (without #)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '#6366f1' },
})
const emit = defineEmits(['update:modelValue'])

const colorWithHash = computed(() => {
  let value = props.modelValue || '#6366f1'
  return value.startsWith('#') ? value : '#' + value
})

const colorValueDisplay = computed(() => {
  return colorWithHash.value.slice(1)
})

const handleColorChange = (event) => {
  const colorWithHash = event.target.value
  emit('update:modelValue', colorWithHash)
}

const handleTextChange = (event) => {
  let value = event.target.value
  value = value.replace('#', '')
  value = value.replace(/[^0-9a-fA-F]/g, '')
  value = value.slice(0, 6)
  emit('update:modelValue', '#' + value)
}

const validateColor = (event) => {
  let value = event.target.value
  value = value.replace('#', '').replace(/[^0-9a-fA-F]/g, '')
  if (!value || value.length !== 6) {
    value = '6366f1'
  }
  emit('update:modelValue', '#' + value)
}
</script>