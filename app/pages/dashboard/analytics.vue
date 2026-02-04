<!-- pages/analytics.vue -->
<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 p-4 md:p-8 overflow-x-hidden"
  >
    <!-- Background Decor -->
    <div
      class="absolute top-0 left-0 w-full h-64 md:h-96 bg-linear-to-b from-purple-50/50 to-transparent dark:from-purple-900/10 pointer-events-none"
    ></div>

    <div class="relative z-10 max-w-7xl mx-auto">
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-10"
      >
        <div>
          <div class="flex items-center gap-3 mb-1">
            <h1
              class="text-2xl md:text-3xl font-extrabold font-heading leading-tight text-[#9E4CFF]"
            >
              Analytics
            </h1>
            <span class="flex h-2.5 w-2.5 relative">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"
              ></span>
            </span>
          </div>
          <p
            class="text-sm md:text-base text-gray-500 dark:text-gray-400 font-sans"
          >
            Real-time performance insights.
          </p>
        </div>

        <!-- Filters (Scrollable on very small screens) -->
        <div
          class="flex items-center bg-white dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-800 rounded-xl p-1 shadow-sm overflow-x-auto no-scrollbar"
        >
          <button
            v-for="range in dateRanges"
            :key="range.val"
            class="flex-1 px-4 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap font-sans"
            :class="
              selectedRange === range.val
                ? 'bg-[#9E4CFF] text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
            "
            @click="selectedRange = range.val"
          >
            {{ range.label }}
          </button>
        </div>
      </div>

      <!-- 1. HERO KPI CARDS (Compact Grid) -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-10"
      >
        <div
          v-for="(stat, index) in kpiStats"
          :key="index"
          class="group relative bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-300"
        >
          <div
            class="absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            :class="stat.gradient"
          ></div>

          <div class="relative z-10 flex justify-between items-start mb-3">
            <div
              class="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              <component :is="stat.icon" class="w-5 h-5" />
            </div>
            <div
              class="flex items-center gap-1 text-[10px] md:text-xs font-bold px-2 py-1 rounded-full font-sans"
              :class="
                stat.trend > 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              "
            >
              <ArrowUpRight v-if="stat.trend > 0" class="w-3 h-3" />
              <ArrowDownRight v-else class="w-3 h-3" />
              {{ Math.abs(stat.trend) }}%
            </div>
          </div>

          <div class="relative z-10">
            <h3
              class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white font-subheading leading-tight"
            >
              {{ stat.value }}
            </h3>
            <p
              class="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 font-sans"
            >
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-10">
        <!-- 2. MAIN CHART (Engagement) -->
        <div
          class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-5 md:p-8 border border-gray-100 dark:border-slate-800 shadow-sm"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3
                class="text-lg md:text-xl font-bold text-gray-900 dark:text-white font-subheading leading-tight"
              >
                Traffic
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-sans">
                Daily interactions
              </p>
            </div>
            <div class="text-right">
              <p class="text-xl md:text-2xl font-bold text-[#9E4CFF] font-sans">
                {{ stats.totalConversations }}
              </p>
              <p class="text-[10px] md:text-xs text-gray-400 font-sans">
                Total this week
              </p>
            </div>
          </div>

          <!-- Optimized Height for Mobile (h-56) vs Desktop (h-72) -->
          <div
            class="h-56 md:h-72 w-full flex items-end justify-between gap-2 md:gap-4 relative z-10"
          >
            <div
              class="absolute inset-0 flex flex-col justify-between pointer-events-none"
            >
              <div
                v-for="i in 5"
                :key="i"
                class="w-full h-px bg-gray-100 dark:bg-slate-800/50 border-t border-dashed border-gray-200 dark:border-slate-800 last:border-0"
              ></div>
            </div>

            <div
              v-for="(day, index) in chartData"
              :key="index"
              class="relative w-full h-full flex flex-col justify-end group/bar"
            >
              <!-- Tooltip (Desktop Only) -->
              <div
                class="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/bar:opacity-100 transition-all bg-gray-900 text-white text-xs py-1 px-2 rounded z-20"
              >
                {{ day.value }}
              </div>

              <div
                class="w-full bg-purple-100 dark:bg-slate-800 rounded-t-lg overflow-hidden relative"
                :style="{ height: `${(day.value / maxChartValue) * 100}%` }"
              >
                <div
                  class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#9E4CFF] to-purple-400 h-0 transition-all duration-1000 ease-out group-hover/bar:h-full"
                  :style="{ height: '100%' }"
                ></div>
              </div>

              <span
                class="text-[10px] md:text-xs font-medium text-gray-400 mt-2 text-center font-sans"
                >{{ day.label }}</span
              >
            </div>
          </div>
        </div>

        <!-- 3. TOP TOPICS -->
        <div
          class="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-8 border border-gray-100 dark:border-slate-800 shadow-sm"
        >
          <h3
            class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-6 font-subheading leading-tight"
          >
            User Intent
          </h3>

          <div class="space-y-6">
            <div v-for="(topic, index) in topTopics" :key="index" class="group">
              <div class="flex justify-between items-end mb-1.5">
                <span
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate pr-4 font-sans"
                  >{{ topic.name }}</span
                >
                <span
                  class="text-sm font-bold text-gray-900 dark:text-white font-sans"
                  >{{ topic.percent }}%</span
                >
              </div>
              <div
                class="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden"
              >
                <div
                  class="h-full rounded-full transition-all duration-1000 ease-out"
                  :class="topic.color"
                  :style="{ width: topic.percent + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
            <button
              class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-sans"
            >
              View Full Report
            </button>
          </div>
        </div>
      </div>

      <!-- 4. KNOWLEDGE & RECENT (Stacked on mobile) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Knowledge Base Insights -->
        <div
          class="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
        >
          <div
            class="p-4 md:p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center"
          >
            <h3
              class="text-lg font-bold text-gray-900 dark:text-white font-subheading leading-tight"
            >
              Knowledge Impact
            </h3>
            <NuxtLink
              to="/dashboard/knowledge-base"
              class="text-xs md:text-sm font-semibold text-[#9E4CFF] hover:text-purple-700 font-sans"
              >Manage</NuxtLink
            >
          </div>
          <div class="p-2 md:p-4">
            <div
              v-for="(doc, idx) in topDocuments"
              :key="idx"
              class="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div class="flex items-center gap-3 overflow-hidden">
                <div
                  class="shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-xl font-sans"
                >
                  {{
                    doc.type === "pdf"
                      ? "📄"
                      : doc.type === "excel"
                        ? "📊"
                        : "📝"
                  }}
                </div>
                <div class="min-w-0">
                  <h4
                    class="font-bold text-gray-900 dark:text-white text-sm truncate font-subheading leading-tight"
                  >
                    {{ doc.name }}
                  </h4>
                  <p class="text-[10px] md:text-xs text-gray-500 font-sans">
                    {{ doc.citations }} citations
                  </p>
                </div>
              </div>
              <div class="text-right shrink-0 ml-2">
                <div
                  class="inline-flex items-center px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold font-sans"
                >
                  {{ doc.effectiveness }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Sessions -->
        <div
          class="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
        >
          <div
            class="p-4 md:p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center"
          >
            <h3
              class="text-lg font-bold text-gray-900 dark:text-white font-subheading leading-tight"
            >
              Recent Interactions
            </h3>
            <NuxtLink
              to="/dashboard/live-monitoring"
              class="text-xs md:text-sm font-semibold text-[#9E4CFF] hover:text-purple-700 font-sans"
              >Monitor</NuxtLink
            >
          </div>
          <div class="overflow-x-auto">
            <table
              class="w-full text-left border-collapse min-w-125 md:min-w-full"
            >
              <thead class="bg-gray-50/50 dark:bg-slate-800/20">
                <tr>
                  <th
                    class="px-4 md:px-6 py-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase font-subheading leading-tight"
                  >
                    User
                  </th>
                  <th
                    class="px-4 md:px-6 py-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase font-subheading leading-tight"
                  >
                    Status
                  </th>
                  <th
                    class="px-4 md:px-6 py-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase text-right font-subheading leading-tight"
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                <tr
                  v-for="session in recentSessions"
                  :key="session.id"
                  class="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors font-sans"
                >
                  <td class="px-4 md:px-6 py-4">
                    <div
                      class="font-semibold text-gray-900 dark:text-white text-sm font-sans"
                    >
                      {{ session.user }}
                    </div>
                    <div class="text-[10px] text-gray-400 mt-0.5">
                      {{ session.duration }}
                    </div>
                  </td>
                  <td class="px-4 md:px-6 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold border"
                      :class="statusStyles[session.status]"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        :class="statusDot[session.status]"
                      ></span>
                      {{ session.status }}
                    </span>
                  </td>
                  <td
                    class="px-4 md:px-6 py-4 text-right text-xs text-gray-500 dark:text-gray-400 font-medium"
                  >
                    {{ session.date }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-vue-next";

definePageMeta({ layout: "dashboard" });

// --- STATE & DATA ---
const selectedRange = ref("7d");
const dateRanges = [
  { label: "7D", val: "7d" },
  { label: "30D", val: "30d" },
  { label: "90D", val: "90d" },
];

const stats = ref({
  totalConversations: 1248,
  avgResponseTime: "1.2s",
  resolutionRate: 94.5,
  csatScore: 4.8,
});

const kpiStats = computed(() => [
  {
    label: "Total Conversations",
    value: stats.value.totalConversations,
    icon: MessageSquare,
    trend: 12.5,
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    label: "Avg. Response Time",
    value: stats.value.avgResponseTime,
    icon: Clock,
    trend: -5.2,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    label: "Resolution Rate",
    value: stats.value.resolutionRate + "%",
    icon: CheckCircle,
    trend: 2.1,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    label: "User Satisfaction",
    value: stats.value.csatScore,
    icon: Star,
    trend: 0,
    gradient: "from-yellow-400 to-orange-500",
  },
]);

const chartData = [
  { label: "Mon", value: 45 },
  { label: "Tue", value: 120 },
  { label: "Wed", value: 80 },
  { label: "Thu", value: 160 },
  { label: "Fri", value: 140 },
  { label: "Sat", value: 90 },
  { label: "Sun", value: 65 },
];
const maxChartValue = Math.max(...chartData.map((d) => d.value)) * 1.2;

const topTopics = [
  { name: "Pricing & Plans", count: 450, percent: 85, color: "bg-blue-500" },
  {
    name: "Technical Support",
    count: 210,
    percent: 60,
    color: "bg-purple-500",
  },
  { name: "Account Access", count: 180, percent: 45, color: "bg-orange-500" },
  { name: "Feature Request", count: 90, percent: 20, color: "bg-green-500" },
];

const topDocuments = [
  {
    name: "Product_Manual_v2.pdf",
    type: "pdf",
    citations: 342,
    effectiveness: 98,
  },
  {
    name: "Pricing_Tier_Sheet.xlsx",
    type: "excel",
    citations: 156,
    effectiveness: 92,
  },
  {
    name: "Return_Policy_2024.docx",
    type: "doc",
    citations: 89,
    effectiveness: 85,
  },
];

const recentSessions = [
  {
    id: 1,
    user: "visitor_x92",
    status: "Resolved",
    duration: "2m 15s",
    date: "Just now",
  },
  {
    id: 2,
    user: "john.doe@gmail.com",
    status: "Handover",
    duration: "5m 30s",
    date: "10m ago",
  },
  {
    id: 3,
    user: "visitor_p44",
    status: "Active",
    duration: "1m 05s",
    date: "15m ago",
  },
  {
    id: 4,
    user: "sarah_smith",
    status: "Resolved",
    duration: "3m 45s",
    date: "1h ago",
  },
];

const statusStyles = {
  Resolved:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  Handover:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  Active:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
};

const statusDot = {
  Resolved: "bg-green-500",
  Handover: "bg-orange-500",
  Active: "bg-blue-500 animate-pulse",
};
</script>

<style scoped>
/* Hide Scrollbar for horizontal scrolling containers on mobile */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
