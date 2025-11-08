<template>
  <div class="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#F9FAFB] to-[#F3F0FF] min-h-screen">
    
    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-10">
      <div>
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#7F56D9] tracking-tight">
          Email Marketing Analytics
        </h1>
        <p class="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
          Performance overview for your campaigns
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
        <button 
          @click="downloadReport"
          class="bg-[#7F56D9] text-white px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base
                 hover:bg-[#6C47B5] transition w-full sm:w-auto"
        >
          Download Report
        </button>

        <button 
          @click="loadAnalytics"
          class="border border-[#7F56D9] text-[#7F56D9] px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base
                 hover:bg-[#7F56D9]/10 transition w-full sm:w-auto"
        >
          Refresh
        </button>
      </div>
    </div>

    <!-- KPI Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12">
      <div
        v-for="card in kpiCards"
        :key="card.title"
        class="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-4 sm:p-6 transition-all duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-xs sm:text-sm font-medium text-gray-500">{{ card.title }}</p>
            <p class="text-2xl sm:text-4xl font-bold text-gray-900 mt-1 sm:mt-2">{{ card.value }}</p>
            <p class="text-[10px] sm:text-xs text-gray-400 mt-1">{{ card.subtext }}</p>
          </div>
          <div class="bg-[#7F56D9]/10 p-2 sm:p-3 rounded-xl">
            <component :is="card.icon" class="text-[#7F56D9]" size="22" sm:size="26" stroke-width="2.2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      
      <!-- Engagement Over Time -->
      <div class="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-x-auto">
        <h3 class="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
          📈 Engagement Over Time
        </h3>
        <div class="min-w-[500px]">
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
                  open: { label: 'Open Rate', color: '#7F56D9' },
                  click: { label: 'Click Rate', color: '#E45858' }
                }"
              />
            </template>
          </Chart>
        </div>
      </div>

      <!-- Top Campaign Performance -->
      <div class="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-x-auto">
        <h3 class="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
          🏆 Top Campaign Performance
        </h3>
        <div class="min-w-[500px]">
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
      </div>

      <!-- Subscriber Growth -->
      <div class="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-x-auto lg:col-span-2">
        <h3 class="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
          👥 Subscriber Growth Trend
        </h3>
        <div class="min-w-[500px]">
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
      </div>

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { Chart, Grid, Line, Bar, Tooltip } from 'vue3-charts'
import { Send, MailOpen, MousePointer, XCircle, UserMinus } from 'lucide-vue-next'

const campaigns = ref([])

/* KPI Cards */
const kpiCards = ref([
  { title: 'Emails Sent', value: '—', subtext: '', icon: Send },
  { title: 'Open Rate', value: '—', subtext: '', icon: MailOpen },
  { title: 'Click Rate', value: '—', subtext: '', icon: MousePointer },
  { title: 'Bounces', value: '—', subtext: '', icon: XCircle },
  { title: 'Unsubscribes', value: '—', subtext: '', icon: UserMinus }
])

/* Chart Data */
const engagement = ref([])
const topCampaigns = ref([])
const subscribers = ref([])

const axis = ref({
  primary: { type: 'band' },
  secondary: { type: 'linear', domain: ['dataMin', 'dataMax + 10'] }
})

const axisBar = ref({
  primary: { type: 'band' },
  secondary: { type: 'linear', domain: ['dataMin', 'dataMax + 10'] }
})

onMounted(() => {
  loadAnalytics()
})

function loadAnalytics() {
  const stored = JSON.parse(localStorage.getItem('campaigns') || '[]')
  campaigns.value = stored

  if (!stored.length) {
    console.warn('No campaign data found in localStorage')
    return
  }

  // KPI Calculations
  const totalSent = stored.reduce((sum, c) => sum + (Number(c.emailsSent) || 0), 0)
  const totalOpens = stored.reduce((sum, c) => sum + (Number(c.opens) || 0), 0)
  const totalClicks = stored.reduce((sum, c) => sum + (Number(c.clicks) || 0), 0)
  const totalBounces = stored.reduce((sum, c) => sum + (Number(c.bounces) || 0), 0)

  const avgOpenRate = ((totalOpens / totalSent) * 100 || 0).toFixed(1)
  const avgClickRate = ((totalClicks / totalSent) * 100 || 0).toFixed(1)

  kpiCards.value = [
    { title: 'Emails Sent', value: totalSent.toLocaleString(), subtext: 'All campaigns', icon: Send },
    { title: 'Open Rate', value: `${avgOpenRate}%`, subtext: 'Average per campaign', icon: MailOpen },
    { title: 'Click Rate', value: `${avgClickRate}%`, subtext: 'Average per campaign', icon: MousePointer },
    { title: 'Bounces', value: totalBounces.toLocaleString(), subtext: 'Across all sends', icon: XCircle },
    { title: 'Unsubscribes', value: '0', subtext: 'No data available', icon: UserMinus }
  ]

  // Engagement Chart
 engagement.value = stored
  .slice()
  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  .map(c => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + "…" : c.name,
    open: Number(((c.opens / c.emailsSent) * 100).toFixed(1)) || 0,
    click: Number(((c.clicks / c.emailsSent) * 100).toFixed(1)) || 0
  }))


  /* Top Campaigns */
topCampaigns.value = stored
  .map(c => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + "…" : c.name,
    open: Number(((c.opens / c.emailsSent) * 100).toFixed(1)) || 0,
    click: Number(((c.clicks / c.emailsSent) * 100).toFixed(1)) || 0
  }))
  .sort((a, b) => b.open - a.open)
  .slice(0, 5)

  /* Subscribers growth */
subscribers.value = stored.map(c => ({
  name: c.name.length > 20 ? c.name.slice(0, 20) + "…" : c.name,
  subs: c.recipients?.recipients_count || 0
}))
}

function downloadReport() {
  const dataStr = JSON.stringify(campaigns.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'email_analytics_report.json'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
