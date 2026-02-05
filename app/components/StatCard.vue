<!-- components/StatCard.vue -->
<template>
  <div
    class="bg-white dark:bg-slate-900 overflow-hidden shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 rounded-lg transition-all duration-300 hover:shadow-md font-subheading"
  >
    <div class="p-6">
      <div class="flex items-start justify-between">
        <!-- Icon -->
        <div class="shrink-0">
          <div
            :class="[
              'rounded-xl p-4 flex items-center justify-center transition-colors',
              colorClasses[color],
            ]"
          >
            <!-- Icons (Lucide) -->
            <component
              :is="iconMap[icon] || iconMap['default']"
              class="h-6 w-6"
            />
          </div>
        </div>

        <!-- Trend (Optional) -->
        <div
          v-if="trend !== undefined"
          class="flex items-center text-xs font-medium"
          :class="
            trend > 0
              ? 'text-green-600 dark:text-green-400'
              : trend < 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500'
          "
        >
          <!-- NOTE: Logic usually is green for good, red for bad. 
                  For response time, lower is better (green), so I handled that logic in parent props usually. 
                  Here simply: Up arrow if > 0 -->
          <span v-if="trend > 0">↑ {{ trend }}%</span>
          <span v-else-if="trend < 0">↓ {{ Math.abs(trend) }}%</span>
          <span v-else>-</span>
        </div>
      </div>

      <div class="mt-4 space-y-1">
        <dt
          class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate font-subheading"
        >
          {{ title }}
        </dt>
        <dd class="text-2xl font-bold text-gray-900 dark:text-white font-sans">
          {{ value }}
        </dd>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  MessageSquare,
  CheckCircle,
  Folder,
  FileText,
  Database,
  Globe,
  Beaker,
  Clock,
  Star,
  Activity,
} from "lucide-vue-next";

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: { type: String, default: "blue" },
  trend: Number, // New prop
});

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  green: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  purple:
    "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  yellow:
    "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
  orange:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
};

const iconMap = {
  database: Database,
  chat: MessageSquare,
  check: CheckCircle,
  folder: Folder,
  document: FileText,
  globe: Globe,
  beaker: Beaker,
  clock: Clock,
  star: Star,
  default: Activity,
};
</script>
