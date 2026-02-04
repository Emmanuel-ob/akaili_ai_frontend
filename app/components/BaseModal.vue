<!-- components/BaseModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm transition-opacity"
  >
    <!-- Modal Container -->
    <div
      class="relative w-[90%] md:w-[70%] max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl transform transition-all"
      :class="[
        sizeClass,
        'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700',
      ]"
    >
      <!-- Header -->
      <div class="flex justify-between items-start mb-6">
        <div class="flex-1">
          <slot name="header">
            <h3
              class="text-xl font-bold text-gray-900 dark:text-white font-subheading"
            >
              {{ title }}
            </h3>
          </slot>
        </div>
        <button
          class="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-white transition-colors ml-4 font-sans text-sm"
          @click="$emit('close')"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="text-gray-600 dark:text-slate-300 font-sans">
        <slot name="body">
          <slot />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
});

defineEmits(["close"]);

const sizeClass = computed(() => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };
  return sizes[props.size] || sizes.md;
});
</script>
