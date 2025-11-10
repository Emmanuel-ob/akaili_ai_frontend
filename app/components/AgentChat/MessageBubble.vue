<template>
  <div
    :class="[
      'max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm',
      sender === 'agent'
        ? 'ml-auto bg-[#7F56D9] text-white rounded-br-none'
        : 'mr-auto bg-white text-gray-800 border rounded-bl-none'
    ]"
  >
    <p>{{ text }}</p>
    <span class="block text-[10px] text-gray-400 mt-1 text-right">
      {{ time }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  sender: String,
  text: String,
  time: String
})
</script>
