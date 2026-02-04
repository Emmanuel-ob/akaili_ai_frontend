<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans"
  >
    <div
      class="bg-white dark:bg-slate-900 rounded-xl w-full max-w-md p-6 shadow-2xl border border-gray-100 dark:border-slate-800"
    >
      <div class="text-center mb-6">
        <div
          class="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3
          class="text-xl font-bold text-gray-900 dark:text-white font-subheading leading-tight"
        >
          We're sorry to see you go
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          Please tell us why you are canceling so we can improve.
        </p>
      </div>

      <div class="space-y-3 mb-6">
        <label
          v-for="option in reasons"
          :key="option"
          class="flex items-center gap-3 p-3 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition"
        >
          <input
            type="radio"
            v-model="selectedReason"
            :value="option"
            class="text-red-500 focus:ring-red-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{{
            option
          }}</span>
        </label>
      </div>

      <div class="flex gap-3">
        <button
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition text-sm"
          @click="$emit('close')"
        >
          Keep Subscription
        </button>
        <button
          :disabled="!selectedReason || loading"
          class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition text-sm"
          @click="confirmCancel"
        >
          {{ loading ? "Canceling..." : "Confirm Cancel" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useSubscriptionStore } from "~/stores/subscriptionStore";

const emit = defineEmits(["close", "canceled"]);
const subscriptionStore = useSubscriptionStore();

const reasons = [
  "Too expensive",
  "Missing features",
  "Found a better alternative",
  "No longer need it",
  "Other",
];

const selectedReason = ref(null);
const loading = ref(false);

const confirmCancel = async () => {
  loading.value = true;
  await subscriptionStore.cancelSubscription(selectedReason.value);
  loading.value = false;
  emit("canceled");
};
</script>
