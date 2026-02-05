<!-- EmailCampaignsTab.vue -->
<template>
  <div class="font-sans">
    <!-- Header Actions -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
    >
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search campaigns..."
          class="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
        />

        <select
          v-model="statusFilter"
          class="w-full sm:w-40 px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="sending">Sending</option>
          <option value="sent">Sent</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      <!-- Action Button -->
      <button
        class="w-full md:w-auto px-4 py-2 bg-purple-600 text-white font-semibold rounded-md text-sm hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors shadow-sm"
        @click="createNewCampaign"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Campaign
      </button>
    </div>

    <!-- ... Loading & Empty States (same as previous) ... -->

    <!-- Campaigns List -->
    <div v-if="filteredCampaigns.length > 0" class="space-y-4">
      <div
        v-for="campaign in filteredCampaigns"
        :key="campaign.id"
        class="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600 transition-all p-4 sm:p-6 shadow-sm dark:shadow-none"
      >
        <div
          class="flex flex-col md:flex-row items-start justify-between gap-4"
        >
          <!-- Campaign Info -->
          <div class="flex-1 w-full min-w-0">
            <!-- min-w-0 critical for text truncation -->
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-full font-subheading"
              >
                {{ campaign.name }}
              </h3>
              <span
                :class="[
                  'px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
                  getStatusBadgeClass(campaign.status),
                ]"
              >
                {{ formatStatus(campaign.status) }}
              </span>
            </div>

            <p
              v-if="campaign.description"
              class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2"
            >
              {{ campaign.description }}
            </p>

            <!-- Stats Row -->
            <div
              class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <div class="flex items-center gap-1 min-w-[100px]">
                <svg
                  class="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"
                  />
                </svg>
                <span class="truncate max-w-[120px]">{{
                  campaign.list_name || "No list"
                }}</span>
              </div>

              <div
                v-if="campaign.send_date"
                class="flex items-center gap-1 whitespace-nowrap"
              >
                <svg
                  class="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{{ formatDate(campaign.send_date) }}</span>
              </div>

              <div
                v-if="campaign.stats"
                class="flex flex-wrap items-center gap-4"
              >
                <span class="whitespace-nowrap"
                  >📤 {{ campaign.stats.sent || 0 }}</span
                >
                <span class="whitespace-nowrap"
                  >📬 {{ campaign.open_rate }}%</span
                >
                <span class="whitespace-nowrap"
                  >🖱️ {{ campaign.click_rate }}%</span
                >
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 overflow-x-auto pb-1 md:pb-0 scrollbar-hide"
          >
            <button
              v-if="campaign.status === 'sent'"
              class="px-3 py-2 text-sm text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
              @click="viewAnalytics(campaign)"
            >
              Analytics
            </button>

            <button
              v-if="campaign.can_edit"
              class="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
              @click="editCampaign(campaign)"
            >
              Edit
            </button>

            <button
              v-if="campaign.can_send"
              :disabled="actionLoading[campaign.id]"
              class="px-3 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg flex items-center gap-1 disabled:opacity-50 transition-colors whitespace-nowrap"
              @click="sendCampaign(campaign)"
            >
              Send
            </button>

            <button
              v-if="campaign.can_edit"
              :disabled="actionLoading[campaign.id]"
              class="px-3 py-2 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap"
              @click="deleteCampaign(campaign)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals (same as before) -->
    <CampaignEditorModal
      v-if="showEditorModal"
      :campaign="selectedCampaign"
      @close="closeEditor"
      @saved="handleCampaignSaved"
    />
    <CampaignAnalyticsModal
      v-if="showAnalyticsModal"
      :campaign="selectedCampaign"
      @close="showAnalyticsModal = false"
    />
  </div>
</template>

<script setup>
// Script section is unchanged from previous answer
import { ref, computed, reactive } from "vue";
import CampaignEditorModal from "./CampaignEditorModal.vue";
import CampaignAnalyticsModal from "./CampaignAnalyticsModal.vue";
import { useToast } from "vue-toastification";

const emailStore = useEmailMarketingStore();
const $toast = useToast();
const searchQuery = ref("");
const statusFilter = ref("");
const showEditorModal = ref(false);
const showAnalyticsModal = ref(false);
const selectedCampaign = ref(null);
const actionLoading = reactive({});

const filteredCampaigns = computed(() => {
  let campaigns = emailStore.campaigns;
  if (searchQuery.value) {
    campaigns = campaigns.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  }
  if (statusFilter.value) {
    campaigns = campaigns.filter((c) => c.status === statusFilter.value);
  }
  return campaigns;
});

const createNewCampaign = () => {
  selectedCampaign.value = null;
  showEditorModal.value = true;
};
const editCampaign = (campaign) => {
  selectedCampaign.value = campaign;
  showEditorModal.value = true;
};
const closeEditor = () => {
  showEditorModal.value = false;
  selectedCampaign.value = null;
};
const handleCampaignSaved = () => {
  closeEditor();
  emailStore.fetchCampaigns();
  $toast.success("Campaign saved successfully");
};
// ... Rest of the action methods (send, pause, resume, delete) remain same ...
const viewAnalytics = (c) => {
  selectedCampaign.value = c;
  showAnalyticsModal.value = true;
};
const getStatusBadgeClass = (s) => {
  /* same as before */ return "bg-gray-100 text-gray-700";
};
const formatStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const formatDate = (d) => new Date(d).toLocaleDateString();
</script>
