<!-- components/DatabaseConnectionCard.vue -->
<template>
  <div
class="
    bg-white dark:bg-slate-900 
    border-b border-gray-100 dark:border-slate-800 
    md:border md:border-gray-200 md:dark:border-slate-800 
    md:rounded-xl md:shadow-sm md:hover:shadow-md 
    p-4 md:p-6 
    transition-all duration-300
  ">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      
      <!-- Icon & Title -->
      <div class="flex items-center">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 shrink-0 transition-colors">
          <svg class="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
          </svg>
        </div>
        <div>
          <h3 class="text-base md:text-lg font-bold text-gray-900 dark:text-white">{{ connection.name }}</h3>
          <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-mono mt-0.5">
            {{ connection.type.toUpperCase() }} • {{ connection.connection_config?.host }}
          </p>
        </div>
      </div>

      <!-- Status & Actions -->
      <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 mt-2 sm:mt-0">
        <div class="text-left sm:text-right">
          <div class="flex items-center sm:justify-end text-sm">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold border"
              :class="statusClasses"
            >
              <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="statusDotClass"></span>
              {{ statusText }}
            </span>
          </div>
          <p v-if="connection.last_sync" class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-1">
            Synced: {{ formatLastSync(connection.last_sync) }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-1 md:gap-2">
          <!-- ✅ Sync/Progress Button -->
          <button
            v-if="connection.selected_tables?.length > 0"
            @click="handleSyncClick"
            :disabled="loading"
            :class="syncButtonClasses"
            class="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 md:gap-2 border"
          >
            <svg v-if="isSyncing" class="animate-spin h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="hidden sm:inline">{{ syncButtonText }}</span>
          </button>

          <!-- Edit Button -->
          <button
            @click="$emit('edit', connectionId)"
            class="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition-colors border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            Edit
          </button>

          <!-- Delete Button -->
          <button
            @click="$emit('delete', connectionId)"
            :disabled="isSyncing"
            class="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition-colors border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Del
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ Progress Bar (shown when syncing with WebSocket data) -->
    <div v-if="isSyncing && syncStatus.progress > 0" class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
          {{ syncStatus.message || 'Syncing...' }}
        </span>
        <span class="text-xs font-medium text-blue-600 dark:text-blue-400">
          {{ syncStatus.progress }}%
        </span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${syncStatus.progress}%` }"></div>
      </div>
      <div v-if="syncStatus.currentTable" class="mt-1 text-xs text-gray-600 dark:text-gray-400">
        Processing: <span class="font-medium">{{ syncStatus.currentTable }}</span>
        <span v-if="syncStatus.processedTables && syncStatus.totalTables">
          ({{ syncStatus.processedTables }}/{{ syncStatus.totalTables }})
        </span>
      </div>
    </div>

    <!-- Details -->
    <div class="mt-4 space-y-2 text-xs md:text-sm">
      <div class="flex items-center justify-between">
        <span class="text-gray-500 dark:text-gray-400">Database:</span>
        <span class="font-mono font-semibold text-gray-900 dark:text-white">{{ connection.connection_config?.database || connection.connection_config?.db_name || 'N/A' }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-gray-500 dark:text-gray-400">Tables:</span>
        <button 
          @click="$emit('selectTables', connection)" 
          class="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
        >
          {{ connection.selected_tables?.length || 0 }} selected
        </button>
      </div>
      
      <div class="flex flex-wrap gap-2">
        <span
          v-for="table in connection.available_tables.slice(0, 4)"
          :key="table"
          class="inline-flex items-center px-2 py-1 rounded-md text-[10px] md:text-xs font-medium border transition-colors"
          :class="connection.selected_tables?.includes(table) 
            ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800' 
            : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700'"
        >
          {{ table }}
        </span>
        <span v-if="connection.available_tables.length > 4" class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 self-center">
            +{{ connection.available_tables.length - 4 }} more
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDatabaseStore } from '~/stores/databaseStore'

const props = defineProps({
  connection: {
    type: Object,
    required: true
  },
  syncing: {
    type: [String, Boolean, null],
    default: null
  }
})

const emit = defineEmits(['sync', 'edit', 'delete', 'selectTables'])

const databaseStore = useDatabaseStore()
const loading = computed(() => false)

// ✅ Support both _id (MongoDB) and id
const connectionId = computed(() => props.connection._id || props.connection.id)

// ✅ Get real-time sync status from store (WebSocket updates)
const syncStatus = computed(() => {
  return databaseStore.getSyncStatusForConnection(connectionId.value)
})

// ✅ Check if syncing (supports both polling prop and WebSocket store)
const isSyncing = computed(() => {
  // Check WebSocket store first
  const storeSync = databaseStore.isConnectionSyncing(connectionId.value)
  // Fallback to polling prop
  const pollingSync = props.syncing === connectionId.value || props.connection.status === 'syncing'
  return storeSync || pollingSync
})

// ✅ Status text and classes
const statusText = computed(() => {
  if (isSyncing.value) {
    return syncStatus.value.status === 'PENDING' ? 'PENDING' : 'SYNCING'
  }
  return props.connection.status?.toUpperCase() || 'UNKNOWN'
})

const statusClasses = computed(() => {
  if (isSyncing.value) {
    return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
  }
  return props.connection.status === 'connected'
    ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
    : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
})

const statusDotClass = computed(() => {
  if (isSyncing.value) return 'bg-blue-500'
  return props.connection.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
})

// ✅ Sync button text and classes
const syncButtonText = computed(() => {
  if (isSyncing.value) {
    return syncStatus.value.progress > 0 ? `${syncStatus.value.progress}%` : 'Syncing...'
  }
  return 'Sync'
})

const syncButtonClasses = computed(() => {
  if (isSyncing.value) {
    return 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
  }
  return 'bg-green-600 text-white border-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
})

// ✅ Handle sync button click
const handleSyncClick = () => {
  emit('sync', connectionId.value)
}

// ✅ Format last sync time
const formatLastSync = (date) => {
  if (!date) return 'Never'
  
  const now = new Date()
  const syncDate = new Date(date)
  const diffMs = now - syncDate
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
</script>