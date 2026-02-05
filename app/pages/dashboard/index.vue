<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300"
  >
    <!-- Header -->
    <header
      class="bg-white dark:bg-slate-900 px-6 py-5 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1
            class="text-[#9E4CFF] text-2xl lg:text-3xl font-bold font-heading leading-tight"
          >
            Dashboard Overview
          </h1>
          <p
            class="text-sm lg:text-base text-gray-500 dark:text-gray-400 mt-1 font-sans font-light"
          >
            Monitor your chatbot performance and engagement
          </p>
        </div>

        <!-- Button -->
        <div class="flex items-center space-x-4">
          <button
            class="p-2 text-sm nav_primary_btn font-sans lg:text-base flex items-center gap-2 text-white rounded-md shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-500"
          >
            <Plus class="w-5 h-5" />
            <span>Add Chatbot</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="p-6 max-w-[1600px] mx-auto">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Conversations"
          :value="stats.conversations"
          icon="chat"
          color="blue"
        />
        <StatCard
          title="Success Rate"
          :value="`${stats.successRate}%`"
          icon="check"
          color="green"
        />
        <StatCard
          title="Connected Databases"
          :value="stats.databases"
          icon="database"
          color="purple"
        />
      </div>

      <!-- Quick Actions -->
      <div
        class="bg-white dark:bg-slate-900 shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 rounded-lg mb-8 transition-colors duration-300"
      >
        <div class="px-6 py-5 border-b border-gray-200 dark:border-slate-800">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white font-heading">
            Quick Actions
          </h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              to="/dashboard/database"
              title="Connect Database"
              description="Add your data sources"
              icon="database"
            />
            <QuickActionCard
              to="/chatbot-setup"
              title="Setup Chatbot"
              description="Configure your AI assistant"
              icon="settings"
            />
            <QuickActionCard
              to="/live-monitoring"
              title="View Conversations"
              description="Monitor chat activity"
              icon="conversations"
            />
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div
        class="bg-white dark:bg-slate-900 shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 rounded-lg transition-colors duration-300"
      >
        <div class="px-6 py-5 border-b border-gray-200 dark:border-slate-800">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white font-heading">
            Recent Activity
          </h3>
        </div>
        <div class="p-6 font-sans">
          <div v-if="recentConnections.length" class="space-y-4">
            <div
              v-for="connection in recentConnections"
              :key="connection._id"
              class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-xl transition-colors duration-300"
            >
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center mr-4"
                >
                  <svg
                    class="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
                <div>
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{ connection.name }}
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ connection.type.toUpperCase() }} database connected
                  </p>
                </div>
              </div>
              <span
                class="text-xs text-gray-400 dark:text-gray-500 font-medium"
              >
                {{ formatTime(connection.created_at) }}
              </span>
            </div>
          </div>

          <EmptyState
            v-else
            title="No activity yet"
            description="Start by connecting your first database to see activity here."
            icon="document"
          >
            <template #action>
              <NuxtLink
                to="/dashboard/database"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[#9E4CFF] hover:bg-purple-700 transition-colors"
              >
                <svg
                  class="mr-2 -ml-1 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Connect Database
              </NuxtLink>
            </template>
          </EmptyState>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import StatCard from "~/components/StatCard.vue";
import EmptyState from "~/components/EmptyState.vue";
import { Plus } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const authStore = useAuthStore();
const config = useRuntimeConfig();

const stats = ref({
  conversations: 0,
  successRate: 0,
  databases: 0,
});

const recentConnections = ref([]);
const loading = ref(true);

const formatTime = (date) => {
  if (!date) return "";
  const now = new Date();
  const created = new Date(date);
  const diffHours = Math.floor((now - created) / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

const fetchDashboardData = async () => {
  try {
    const connectionsResponse = await $fetch(
      `${config.public.apiBase}/api/database`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    const connections = connectionsResponse.connections || [];

    stats.value.databases = connections.length;

    recentConnections.value = connections
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);

    stats.value.conversations = Math.floor(Math.random() * 1000) + 100;
    stats.value.successRate = (Math.random() * 20 + 80).toFixed(1);
  } catch (err) {
    console.error("Failed to fetch dashboard data:", err);
  }
};

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    return navigateTo("/login");
  }

  loading.value = true;
  await fetchDashboardData();
  loading.value = false;
});
</script>
