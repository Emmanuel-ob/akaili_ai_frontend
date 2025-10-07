<template>
  <div class="">
    <!-- Label -->
    <label class="block text-base font-semibold mt-4">Primary Colour</label>

    <div class="flex items-center mt-2 space-x-3">
      <!-- Color preview -->
      <div class="w-12 h-12 rounded-lg border border-gray-300 shadow cursor-pointer"
        :style="{ backgroundColor: colorWithHash }" @click="$refs.colorPicker.click()">
      </div>

      <!-- Hidden color picker for better UX -->
      <input ref="colorPicker" type="color" :value="colorWithHash" @input="handleColorChange"
        class="w-0 h-0 opacity-0 absolute" />

      <!-- Text Input -->
      <div class="flex-1">
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-mono">#</span>
          <input :value="colorValueDisplay"
            class="w-full pl-8 pr-3 py-3 text-gray-600 rounded-md border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
            type="text" placeholder="6366f1" maxlength="6" pattern="[0-9a-fA-F]{6}" @input="handleTextChange"
            @blur="validateColor" />
        </div>
        <p class="text-xs text-gray-500 mt-1">Enter 6-digit hex color code (without #)</p>
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

// Computed property for color with # (this is what we store in DB)
const colorWithHash = computed(() => {
  let value = props.modelValue || '#6366f1'
  // Ensure it starts with #
  return value.startsWith('#') ? value : '#' + value
})

// Computed property for display in text input (without #)
const colorValueDisplay = computed(() => {
  return colorWithHash.value.slice(1) // Remove the # for display
})

// Handle color picker change
const handleColorChange = (event) => {
  const colorWithHash = event.target.value // This already includes #
  emit('update:modelValue', colorWithHash)
}

// Handle text input change
const handleTextChange = (event) => {
  let value = event.target.value
  // Remove any # that user might type
  value = value.replace('#', '')
  // Only allow hex characters
  value = value.replace(/[^0-9a-fA-F]/g, '')
  // Limit to 6 characters
  value = value.slice(0, 6)

  // Emit with # prefix
  emit('update:modelValue', '#' + value)
}

// Validate color on blur
const validateColor = (event) => {
  let value = event.target.value
  // Remove # and non-hex chars
  value = value.replace('#', '').replace(/[^0-9a-fA-F]/g, '')

  // If empty or invalid, use default
  if (!value || value.length !== 6) {
    value = '6366f1'
  }

  // Emit with # prefix
  emit('update:modelValue', '#' + value)
}
</script>