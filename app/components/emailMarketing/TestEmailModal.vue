<!-- TestEmailModal.vue -->
<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans"
  >
    <div class="bg-white rounded-lg w-full max-w-md p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 font-subheading">
        Send Test Email
      </h3>

      <div class="space-y-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-2 font-subheading"
            >Email Address</label
          >
          <input
            v-model="testEmail"
            type="email"
            placeholder="your@email.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            @keyup.enter="send"
          />
        </div>

        <p class="text-sm text-gray-600">
          A test email will be sent with sample data for merge tags.
        </p>
      </div>

      <div class="flex items-center justify-end gap-3 mt-6">
        <button
          class="px-4 py-2 text-gray-600 hover:text-gray-900"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          :disabled="!isValidEmail"
          :class="[
            'px-4 py-2 rounded-lg',
            isValidEmail
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
          @click="send"
        >
          Send Test
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["send", "close"]);

const testEmail = ref("");

const isValidEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail.value);
});

const send = () => {
  if (isValidEmail.value) {
    emit("send", testEmail.value);
  }
};
</script>
