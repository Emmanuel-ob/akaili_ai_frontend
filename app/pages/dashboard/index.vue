<template>
  <div>
   
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="Total Conversations" :value="stats.conversations" icon="chat" color="blue" />
      <StatCard title="Success Rate" :value="`${stats.successRate}%`" icon="check" color="green" />
      <StatCard title="Connected Databases" :value="stats.databases" icon="database" color="purple" />
    </div>

    
    <!-- Quick Actions -->
<div class="bg-white shadow rounded-lg mb-8">
  <div class="px-6 py-4 border-b border-gray-200">
    <h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
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
        to="/conversations"
        title="View Conversations"
        description="Monitor chat activity"
        icon="conversations"
      />
    </div>
  </div>
</div>

    <!-- Recent Activity -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div class="p-6">
        <div v-if="recentConnections.length" class="space-y-4">
          <div
           v-for="connection in recentConnections" :key="connection._id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                   stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
             
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ connection.name }}</h4>
                <p class="text-xs text-gray-500">{{ connection.type.toUpperCase() }} database connected</p>
              </div>
            </div>
            <span class="text-xs text-gray-500">
              {{ formatTime(connection.created_at) }}
            </span>
          </div>
        </div>

        <EmptyState 
          v-else 
          title="No activity yet"
          description="Start by connecting your first database to see activity here." 
          icon="document">
          <template #action>
            <NuxtLink 
            to="/dashboard/database"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
              <svg class="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Connect Database
            </NuxtLink>
          </template>
        </EmptyState>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatCard from '~/components/StatCard.vue'
import EmptyState from '~/components/EmptyState.vue'



definePageMeta({
  layout: 'dashboard'
})


const authStore = useAuthStore()
const config = useRuntimeConfig()

const stats = ref({
  conversations: 0,
  successRate: 0,
  databases: 0
})

const recentConnections = ref([])
const loading = ref(true)

const formatTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const created = new Date(date)
  const diffHours = Math.floor((now - created) / (1000 * 60 * 60))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

const fetchDashboardData = async () => {
  try {
    // Fetch database connections for stats and recent activity
    const connectionsResponse = await $fetch(`${config.public.apiBase}/api/database`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    const connections = connectionsResponse.connections || []

    stats.value.databases = connections.length

    // Show last 3 connections as recent activity
    recentConnections.value = connections
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)

    // Mock other stats for now
    stats.value.conversations = Math.floor(Math.random() * 1000) + 100
    stats.value.successRate = (Math.random() * 20 + 80).toFixed(1)

  } catch (err) {
    console.error('Failed to fetch dashboard data:', err)
  }
}

onMounted(async () => {
  console.log(authStore.token)
  if (!authStore.isLoggedIn) {
    return navigateTo('/dashboard/login')
  }

  loading.value = true
  await fetchDashboardData()
  loading.value = false
})
</script>