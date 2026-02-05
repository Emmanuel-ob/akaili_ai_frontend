<!-- components/BaseModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[60] flex items-end md:items-center justify-center sm:p-4"
  >
    <!-- Backdrop with subtle blur -->
    <div
      class="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Modal Container (Liquid Glass Effect) -->
    <div
      class="relative w-full md:w-auto md:min-w-[500px] md:max-w-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-white/10 md:rounded-2xl rounded-t-2xl shadow-2xl transform transition-all flex flex-col max-h-[90vh] overflow-hidden"
      :class="[sizeClass]"
    >
      <!-- Header -->
      <div
        class="flex justify-between items-center p-5 md:p-6 border-b border-gray-200/50 dark:border-white/5 shrink-0"
      >
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
      <div
        class="p-5 md:p-6 overflow-y-auto custom-scrollbar text-sm text-gray-600 dark:text-gray-300"
      >
        <div class="text-gray-600 dark:text-slate-300 font-sans">
          <slot name="body">
            <slot />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: "" },
  size: { type: String, default: "md" },
});

defineEmits(["close"]);

const sizeClass = computed(() => {
  const sizes = {
    sm: "md:max-w-md",
    md: "md:max-w-2xl",
    lg: "md:max-w-4xl",
    xl: "md:max-w-6xl",
  };
  return sizes[props.size] || sizes.md;
});

const handleEscape = (e) => {
  if (e.key === "Escape" && props.show) emit("close");
};
onMounted(() => document.addEventListener("keydown", handleEscape));
onUnmounted(() => document.removeEventListener("keydown", handleEscape));
</script>

<style scoped>
/* Sleek Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db; /* gray-300 */
  border-radius: 9999px;
}
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb,
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155; /* slate-700 */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af; /* gray-400 */
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #475569; /* slate-600 */
}
</style>

