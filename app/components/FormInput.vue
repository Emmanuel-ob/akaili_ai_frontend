<!-- components/FormInput.vue -->
<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :class="inputClasses"
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    >
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'dark'].includes(value)
  }
})

defineEmits(['update:modelValue'])

const inputClasses = computed(() => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
  
  if (props.variant === 'dark') {
    return `${baseClasses} bg-gray-800 border-gray-600 text-white focus:border-transparent`
  }
  
  return `${baseClasses} border-gray-300 focus:border-transparent`
})
</script>