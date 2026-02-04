<!-- dashboard/email-marketing.vue -->
<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 font-sans"
  >
    <!-- Header -->
    <div
      class="bg-white dark:bg-slate-900 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-800 transition-all duration-500 ease-out"
    >
      <h1
        class="text-2xl sm:text-3xl font-bold text-[#9E4CFF] font-heading leading-tight"
      >
        Email Marketing
      </h1>
      <p
        class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 font-sans"
      >
        Create, manage, and analyze your email campaigns
      </p>
    </div>

    <div class="p-4 sm:p-6">
      <!-- Quick Stats - FIXED RESPONSIVE GRID -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8"
      >
        <div
          class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 p-6 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="font-sans">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total Lists
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ emailStore.lists.length }}
              </p>
            </div>
            <div class="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <svg
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 p-6 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="font-sans">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total Contacts
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ totalContacts }}
              </p>
            </div>
            <div class="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <svg
                class="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 p-6 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="font-sans">
              <p class="text-sm text-gray-600 dark:text-gray-400">Templates</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ emailStore.templateStats.my_templates }}
              </p>
        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 mb-6 transition-colors overflow-hidden">
            <div class="border-b border-gray-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
                <nav class="flex -mb-px min-w-max">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                        'px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                        activeTab === tab.id
                            ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-slate-600'
                    ]">
                        {{ tab.label }}
                    </button>
                </nav>
            </div>
            <div class="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <svg
                class="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 p-6 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="font-sans">
              <p class="text-sm text-gray-600 dark:text-gray-400">Campaigns</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ emailStore.campaigns.length }}
              </p>
            </div>
            <div class="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <svg
                class="w-6 h-6 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs - FIXED SCROLLING ON MOBILE -->
      <div
        class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 mb-6 transition-colors overflow-hidden"
      >
        <div
          class="border-b border-gray-200 dark:border-slate-800 overflow-x-auto scrollbar-hide"
        >
          <nav class="flex -mb-px min-w-max">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrapfont-sans',
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-slate-600',
              ]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-4 sm:p-6">
          <!-- Lists Tab -->
          <div v-if="activeTab === 'lists'">
            <EmailListsTab />
          </div>

          <!-- Contacts Tab -->
          <div v-if="activeTab === 'contacts'">
            <EmailContactsTab />
          </div>

          <!-- Templates Tab -->
          <div v-if="activeTab === 'templates'">
            <EmailTemplatesTab />
          </div>

          <!-- Campaigns Tab -->
          <div v-if="activeTab === 'campaigns'">
            <EmailCampaignsTab />
          </div>
        </div>
      </div>

      <!-- Real-time Notifications -->
      <teleport to="body">
        <div
          v-if="notifications.length > 0"
          class="fixed bottom-4 right-4 space-y-2 z-50 px-4 w-full max-w-sm ml-auto"
        >
          <transition-group name="slide-fade">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border-l-4 border-purple-600 dark:border-purple-500 transform transition-all duration-300 hover:scale-102"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  <svg
                    v-if="notification.type === 'success'"
                    class="w-6 h-6 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-6 h-6 text-blue-500 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-white truncate"
                  >
                    {{ notification.title }}
                  </p>
                  <p
                    class="text-sm text-gray-600 dark:text-gray-300 mt-1 break-words"
                  >
                    {{ notification.message }}
                  </p>
                </div>
                <button
                  @click="removeNotification(notification.id)"
                  class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </transition-group>
        </div>
      </teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import EmailListsTab from "~/components/emailMarketing/EmailListsTab.vue";
import EmailContactsTab from "~/components/emailMarketing/EmailContactsTab.vue";
import EmailTemplatesTab from "~/components/emailMarketing/EmailTemplatesTab.vue";
import EmailCampaignsTab from "~/components/emailMarketing/EmailCampaignsTab.vue";
import { useToast } from "vue-toastification/dist/index.mjs";

definePageMeta({
  layout: "dashboard",
});

const emailStore = useEmailMarketingStore();
const websocketStore = useWebSocketStore();
const $toast = useToast();

const activeTab = ref("campaigns");
const notifications = ref([]);

const tabs = [
  { id: "campaigns", label: "Campaigns" },
  { id: "templates", label: "Templates" },
  { id: "contacts", label: "Contacts" },
  { id: "lists", label: "Lists" },
];

const totalContacts = computed(() => {
  return emailStore.lists.reduce(
    (sum, list) => sum + (list.total_subscribers || 0),
    0,
  );
});

// WebSocket Event Handlers
let unsubscribeEmailStats = null;
let unsubscribeCampaignSending = null;
let unsubscribeCampaignSent = null;

const setupWebSocketListeners = () => {
  unsubscribeEmailStats = websocketStore.on(
    "email.stats.updated",
    (data) => {
      addNotification({
        type: "info",
        title: "Email Stats Updated",
        message: `Campaign "${data.name}" has ${data.opened} opens and ${data.clicked} clicks`,
      });
    },
    "email-marketing-dashboard",
  );

  unsubscribeCampaignSending = websocketStore.on(
    "email.campaign.sending",
    (data) => {
      $toast.info(
        `Campaign "${data.name}" is now sending to ${data.total_recipients} recipients`,
      );
      addNotification({
        type: "info",
        title: "Campaign Sending",
        message: `"${data.name}" is being sent...`,
      });
    },
    "email-marketing-dashboard",
  );

  unsubscribeCampaignSent = websocketStore.on(
    "email.campaign.sent",
    (data) => {
      $toast.success(`Campaign "${data.name}" has been sent successfully!`);
      addNotification({
        type: "success",
        title: "Campaign Completed",
        message: `"${data.name}" sent with ${data.open_rate}% open rate`,
      });
    },
    "email-marketing-dashboard",
  );
};

const addNotification = (notification) => {
  const id = Date.now() + Math.random();
  notifications.value.push({ id, ...notification });

  setTimeout(() => {
    removeNotification(id);
  }, 10000);
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

onMounted(async () => {
  try {
    // Initialize WebSocket
    if (!websocketStore.connected) {
      websocketStore.initialize();
    }
    setupWebSocketListeners();

    // Load initial data
    await Promise.all([
      emailStore.fetchLists(),
      emailStore.fetchTemplates(),
      emailStore.fetchCampaigns(),
      emailStore.fetchTemplateCategories(),
      emailStore.fetchTemplateTags(),
    ]);
  } catch (error) {
    console.error("Error loading email marketing data:", error);
    $toast.error("Failed to load email marketing data");
  }
});

onUnmounted(() => {
  if (unsubscribeEmailStats) unsubscribeEmailStats();
  if (unsubscribeCampaignSending) unsubscribeCampaignSending();
  if (unsubscribeCampaignSent) unsubscribeCampaignSent();

  websocketStore.offAll("email-marketing-dashboard");
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
