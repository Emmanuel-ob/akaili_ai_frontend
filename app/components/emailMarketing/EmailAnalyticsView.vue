<template>
  <div class="p-8 bg-gradient-to-b from-[#F9FAFB] to-[#F3F0FF] min-h-screen">
    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
      <div>
        <h1 class="text-4xl font-extrabold text-[#7F56D9] tracking-tight">Email Marketing Analytics</h1>
        <p class="text-gray-500 mt-2">Performance overview for your latest campaigns</p>
      </div>
      <div class="flex gap-3 mt-4 sm:mt-0">
        <button class="bg-[#7F56D9] text-white px-5 py-2 rounded-xl hover:bg-[#6C47B5] transition">
          Download Report
        </button>
        <button class="border border-[#7F56D9] text-[#7F56D9] px-5 py-2 rounded-xl hover:bg-[#7F56D9]/10 transition">
          Refresh
        </button>
      </div>
    </div>

    <!-- KPI Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
      <div
        v-for="card in kpiCards"
        :key="card.title"
        class="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 transition-all duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ card.title }}</p>
            <p class="text-4xl font-bold text-gray-900 mt-2">{{ card.value }}</p>
            <p class="text-xs text-gray-400 mt-1">vs last week: {{ card.change }}</p>
          </div>
          <div class="bg-[#7F56D9]/10 p-3 rounded-xl">
            <component :is="card.icon" class="text-[#7F56D9]" size="26" stroke-width="2.2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Engagement Over Time -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          📈 Engagement Over Time
        </h3>
        <Chart
          :size="{ width: 550, height: 360 }"
          :data="engagement"
          :margin="{ left: 10, top: 20, right: 10, bottom: 20 }"
          :direction="'horizontal'"
          :axis="axis"
        >
          <template #layers>
            <Grid strokeDasharray="2,2" />
            <Line :dataKeys="['name', 'open']" :lineStyle="{ stroke: '#7F56D9', strokeWidth: 3 }" />
            <Line :dataKeys="['name', 'click']" :lineStyle="{ stroke: '#E45858', strokeWidth: 2.5 }" type="step" />
          </template>

          <template #widgets>
            <Tooltip
              borderColor="#7F56D9"
              :config="{
                name: { hide: true },
                open: { label: 'Open Rate', color: '#7F56D9' },
                click: { label: 'Click Rate', color: '#E45858' }
              }"
            />
          </template>
        </Chart>
      </div>

      <!-- Top Campaign Performance -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          🏆 Top Campaign Performance
        </h3>
        <Chart
          :size="{ width: 550, height: 360 }"
          :data="topCampaigns"
          :margin="{ left: 10, top: 20, right: 10, bottom: 20 }"
          :direction="'vertical'"
          :axis="axisBar"
        >
          <template #layers>
            <Grid strokeDasharray="2,2" />
            <Bar :dataKeys="['name', 'open']" :barStyle="{ fill: '#7F56D9', rx: 6 }" />
            <Bar :dataKeys="['name', 'click']" :barStyle="{ fill: '#E45858', rx: 6 }" />
          </template>

          <template #widgets>
            <Tooltip
              borderColor="#E45858"
              :config="{
                open: { label: 'Open Rate', color: '#7F56D9' },
                click: { label: 'Click Rate', color: '#E45858' }
              }"
            />
          </template>
        </Chart>
      </div>

      <!-- Subscriber Growth -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition lg:col-span-2">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          👥 Subscriber Growth Trend
        </h3>
        <Chart
          :size="{ width: 1150, height: 360 }"
          :data="subscribers"
          :margin="{ left: 10, top: 20, right: 10, bottom: 20 }"
          :direction="'horizontal'"
          :axis="axis"
        >
          <template #layers>
            <Grid strokeDasharray="2,2" />
            <Line :dataKeys="['name', 'subs']" :lineStyle="{ stroke: '#00BFA6', strokeWidth: 3 }" type="monotone" />
          </template>

          <template #widgets>
            <Tooltip borderColor="#00BFA6" />
          </template>
        </Chart>
      </div>

     <!-- 🥯 Device Distribution (Doughnut Chart) -->
<div class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 lg:col-span-2">
  <h3 class="text-xl font-bold mb-4 text-gray-700">Device Distribution</h3>

  <div class="flex flex-col lg:flex-row items-center justify-center gap-8">
    <!-- Doughnut Chart -->
    <Chart
      :size="{ width: 350, height: 350 }"
      :data="deviceData"
      :margin="{ top: 20, right: 20, bottom: 20, left: 20 }"
    >
      <template #layers>
        <Pie
          :dataKeys="['name', 'value']"
          :innerRadius="90"
          :outerRadius="140"
          :pieStyle="{ stroke: '#fff', strokeWidth: 3 }"
          :colors="['#7F56D9', '#00BFA6', '#E45858']"
        />
      </template>

      <template #widgets>
        <Tooltip
          borderColor="#7F56D9"
          :config="{
            name: { label: 'Device' },
            value: { label: 'Usage %' }
          }"
        />
      </template>
    </Chart>

    <!-- Legend -->
    <div class="space-y-3">
      <div
        v-for="(item, index) in deviceData"
        :key="item.name"
        class="flex items-center gap-3"
      >
        <div
          class="w-4 h-4 rounded-full"
          :style="{ backgroundColor: ['#7F56D9', '#00BFA6', '#E45858'][index] }"
        ></div>
        <p class="text-gray-700 font-medium">
          {{ item.name }} — 
          <span class="text-gray-500 font-semibold">{{ item.value }}%</span>
        </p>
      </div>
    </div>
  </div>
</div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Chart, Grid, Line, Bar, Pie, Tooltip } from 'vue3-charts'
import { Send, MailOpen, MousePointer, XCircle, UserMinus } from 'lucide-vue-next'

/* KPI Summary Cards */
const kpiCards = [
  { title: 'Emails Sent', value: '45,200', change: '+12%', icon: Send },
  { title: 'Open Rate', value: '46.2%', change: '+2.3%', icon: MailOpen },
  { title: 'Click Rate', value: '21.8%', change: '+1.4%', icon: MousePointer },
  { title: 'Bounces', value: '183', change: '-0.8%', icon: XCircle },
  { title: 'Unsubscribes', value: '64', change: '+0.3%', icon: UserMinus }
]

/* Engagement Data */
const engagement = ref([
  { name: 'Oct 1', open: 38, click: 12 },
  { name: 'Oct 5', open: 45, click: 17 },
  { name: 'Oct 10', open: 48, click: 19 },
  { name: 'Oct 15', open: 51, click: 22 },
  { name: 'Oct 20', open: 47, click: 18 },
  { name: 'Oct 25', open: 54, click: 25 },
  { name: 'Oct 30', open: 59, click: 29 }
])

/* Campaign Performance */
const topCampaigns = ref([
  { name: 'Welcome Series', open: 58, click: 24 },
  { name: 'October Promo', open: 52, click: 19 },
  { name: 'Holiday Blast', open: 49, click: 23 },
  { name: 'Weekly Digest', open: 44, click: 16 },
  { name: 'Black Friday', open: 61, click: 29 }
])

/* Subscriber Growth */
const subscribers = ref([
  { name: 'Jul', subs: 1200 },
  { name: 'Aug', subs: 1900 },
  { name: 'Sep', subs: 2700 },
  { name: 'Oct', subs: 3200 },
  { name: 'Nov', subs: 4100 }
])

/* Device Distribution */
const deviceData = ref([
  { name: 'Desktop', value: 64 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 6 }
])

/* Axis Config */
const axis = ref({
  primary: { type: 'band' },
  secondary: { type: 'linear', domain: ['dataMin', 'dataMax + 10'] }
})

const axisBar = ref({
  primary: { type: 'band' },
  secondary: { type: 'linear', domain: ['dataMin', 'dataMax + 10'] }
})
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
