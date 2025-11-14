<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">{{ campaign.name }}</h2>
                    <p class="text-sm text-gray-600 mt-1">Campaign Analytics</p>
                </div>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6">
                <!-- Loading State -->
                <div v-if="loading" class="flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>

                <div v-else>
                    <!-- Overview Stats -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                            <div class="flex items-center justify-between mb-2">
                                <p class="text-sm text-blue-600 font-medium">Total Sent</p>
                                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <p class="text-3xl font-bold text-blue-900">{{ stats.sent }}</p>
                        </div>

                        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                            <div class="flex items-center justify-between mb-2">
                                <p class="text-sm text-green-600 font-medium">Opened</p>
                                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <p class="text-3xl font-bold text-green-900">{{ stats.opened }}</p>
                            <p class="text-sm text-green-700 mt-1">{{ rates.open_rate }}% open rate</p>
                        </div>

                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                            <div class="flex items-center justify-between mb-2">
                                <p class="text-sm text-purple-600 font-medium">Clicked</p>
                                <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <p class="text-3xl font-bold text-purple-900">{{ stats.clicked }}</p>
                            <p class="text-sm text-purple-700 mt-1">{{ rates.click_rate }}% click rate</p>
                        </div>

                        <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
                            <div class="flex items-center justify-between mb-2">
                                <p class="text-sm text-orange-600 font-medium">Bounced</p>
                                <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <p class="text-3xl font-bold text-orange-900">{{ stats.bounced }}</p>
                            <p class="text-sm text-orange-700 mt-1">{{ rates.bounce_rate }}% bounce rate</p>
                        </div>
                    </div>

                    <!-- Additional Stats Row -->
                    <div class="grid grid-cols-3 gap-4 mb-8">
                        <div class="bg-white rounded-lg border border-gray-200 p-4">
                            <p class="text-sm text-gray-600 mb-1">Unsubscribed</p>
                            <p class="text-2xl font-bold text-gray-900">{{ stats.unsubscribed || 0 }}</p>
                        </div>
                        <div class="bg-white rounded-lg border border-gray-200 p-4">
                            <p class="text-sm text-gray-600 mb-1">Complained</p>
                            <p class="text-2xl font-bold text-gray-900">{{ stats.complained || 0 }}</p>
                        </div>
                        <div class="bg-white rounded-lg border border-gray-200 p-4">
                            <p class="text-sm text-gray-600 mb-1">Failed</p>
                            <p class="text-2xl font-bold text-gray-900">{{ stats.failed || 0 }}</p>
                        </div>
                    </div>

                    <!-- Charts Section -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <!-- Engagement Pie Chart -->
                        <div class="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Engagement Breakdown</h3>
                            <div class="relative" style="height: 250px;">
                                <canvas ref="engagementChart"></canvas>
                            </div>
                        </div>

                        <!-- Status Bar Chart -->
                        <div class="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Email Status</h3>
                            <div class="relative" style="height: 250px;">
                                <canvas ref="statusChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity Timeline -->
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

                        <div v-if="timeline && timeline.length > 0" class="space-y-4 max-h-96 overflow-y-auto">
                            <div v-for="event in timeline" :key="event.id"
                                class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div :class="[
                                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                                    getEventColor(event.event_type)
                                ]">
                                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path v-if="event.event_type === 'opened'" fill-rule="evenodd"
                                            d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path v-else-if="event.event_type === 'clicked'" fill-rule="evenodd"
                                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
                                        <path v-else
                                            d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900">{{ event.email }}</p>
                                    <p class="text-sm text-gray-600">{{ formatEventType(event.event_type) }}</p>
                                    <p v-if="event.link_url" class="text-sm text-blue-600 truncate mt-1">{{
                                        event.link_url }}</p>
                                    <p class="text-xs text-gray-500 mt-1">{{ formatTimestamp(event.timestamp) }}</p>
                                </div>
                            </div>
                        </div>

                        <div v-else class="text-center py-8 text-gray-500">
                            No activity yet
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
    campaign: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close'])

const emailStore = useEmailMarketingStore()
const loading = ref(true)
const analytics = ref(null)
const engagementChart = ref(null)
const statusChart = ref(null)

const stats = computed(() => analytics.value?.stats || props.campaign.stats || {})
const rates = computed(() => analytics.value?.rates || {
    open_rate: props.campaign.open_rate || 0,
    click_rate: props.campaign.click_rate || 0,
    bounce_rate: props.campaign.bounce_rate || 0
})
const timeline = computed(() => analytics.value?.timeline || [])

const getEventColor = (eventType) => {
    const colors = {
        opened: 'bg-green-500',
        clicked: 'bg-purple-500',
        bounced: 'bg-orange-500',
        complained: 'bg-red-500',
        unsubscribed: 'bg-yellow-500',
        sent: 'bg-blue-500'
    }
    return colors[eventType] || 'bg-gray-500'
}

const formatEventType = (type) => {
    const labels = {
        opened: 'Opened email',
        clicked: 'Clicked link',
        bounced: 'Email bounced',
        complained: 'Marked as spam',
        unsubscribed: 'Unsubscribed',
        sent: 'Email sent'
    }
    return labels[type] || type
}

const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const createCharts = () => {
    // Engagement Pie Chart
    if (engagementChart.value) {
        const ctx = engagementChart.value.getContext('2d')
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Opened', 'Clicked', 'Not Opened'],
                datasets: [{
                    data: [
                        stats.value.opened || 0,
                        stats.value.clicked || 0,
                        (stats.value.sent || 0) - (stats.value.opened || 0)
                    ],
                    backgroundColor: ['#10b981', '#8b5cf6', '#d1d5db'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        })
    }

    // Status Bar Chart
    if (statusChart.value) {
        const ctx = statusChart.value.getContext('2d')
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Delivered', 'Bounced', 'Failed', 'Unsubscribed'],
                datasets: [{
                    data: [
                        stats.value.delivered || 0,
                        stats.value.bounced || 0,
                        stats.value.failed || 0,
                        stats.value.unsubscribed || 0
                    ],
                    backgroundColor: ['#3b82f6', '#f97316', '#ef4444', '#eab308'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    }
}

onMounted(async () => {
    try {
        analytics.value = await emailStore.fetchCampaignAnalytics(props.campaign.id)

        // Wait for DOM to update, then create charts
        await nextTick()

        // Load Chart.js if not already loaded
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
            script.onload = () => createCharts()
            document.head.appendChild(script)
        } else {
            createCharts()
        }
    } catch (error) {
        console.error('Error loading analytics:', error)
    } finally {
        loading.value = false
    }
})
</script>