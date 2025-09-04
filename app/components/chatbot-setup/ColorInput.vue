<script setup>
const props = defineProps({
  modelValue: { type: String, default: '2563eb' },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="">
    <!-- Label -->
    <label class="block text-base font-semibold mt-4">Primary Colour</label>



    <div class="flex items-center mt-2 space-x-3">
    <!-- Color preview -->
    <div
      class="w-15 h-13 rounded-lg border border-gray-300 shadow"
      :style="{ backgroundColor: `#${props.modelValue}` }"
    >
</div>
    <!-- Input -->
    <input
      :value="props.modelValue"
      class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                    focus:outline-none focus:border-gray-300"
      type="text"
      placeholder="2563eb"
      maxlength="6"
      @input="emit('update:modelValue', $event.target.value)"
    />
    </div>  
  </div>
</template>
