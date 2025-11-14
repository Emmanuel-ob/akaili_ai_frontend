<template>
  <label class="inline-flex items-center cursor-pointer select-none">
    <!-- real checkbox (screen readers + keyboard) -->
    <input
      type="checkbox"
      class="sr-only"
      v-model="internalChecked"
    />

    <!-- track -->
    <span
      class="relative w-[70px] h-[32px] rounded-full transition-colors duration-300 ease-in-out"
      :class="internalChecked ? 'bg-[#9E4CFF]' : 'bg-[#cccccc]'"
      :style="trackStyle"
      aria-hidden="true"
    >
      <!-- knob -->
      <span
        class="absolute top-[4px] left-[4px] w-[24px] h-[24px] bg-white rounded-full
               transition-transform duration-300 ease-in-out"
        :style="knobStyle"
      ></span>
    </span>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

// local computed proxy so v-model from parent works reliably
const internalChecked = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

// track style: subtle inset to add depth and a gentle outer focus glow when checked
const trackStyle = computed(() => {
  return {
    boxShadow: internalChecked.value
      ? 'inset 0 -2px 6px rgba(0,0,0,0.06), 0 6px 18px rgba(127,86,217,0.08)'
      : 'inset 0 -1px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)'
  }
})

// knob style: translate and stronger colored shadow when ON for depth
const knobStyle = computed(() => {
  const translate = internalChecked.value ? 'translateX(39px)' : 'translateX(0)'
  const shadow = internalChecked.value
    ? '0 10px 25px rgba(127,86,217,0.20), 0 2px 6px rgba(0,0,0,0.12)'
    : '0 6px 18px rgba(0,0,0,0.12)'
  return {
    transform: translate,
    boxShadow: shadow
  }
})
</script>

<style scoped>
/* show a gentle focus halo when keyboard-focusing the checkbox */
input:focus + span {
  outline: none;
  box-shadow: 0 0 0 6px rgba(127,86,217,0.06);
}
</style>
