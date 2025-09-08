<!-- components/DatabaseConnectionCard.vue -->
<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900">{{ connection.name }}</h3>
          <p class="text-sm text-gray-500">
            {{ connection.type.toUpperCase() }} • {{ connection.connection_config?.host }}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <div class="text-right">
          <div class="flex items-center text-sm">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="connection.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ connection.status.toUpperCase() }}
            </span>
          </div>
          <p v-if="connection.last_sync" class="text-xs text-gray-500 mt-1">
            Last Sync: {{ formatLastSync(connection.last_sync) }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-2">
          <button
            v-if="connection.selected_tables?.length"
            :disabled="syncing === connection.id"
            class="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 border border-purple-200 rounded-md transition-colors disabled:opacity-50"
            @click="$emit('sync', connection.id)">
            {{ syncing === connection.id ? 'Syncing...' : 'Sync Now' }}
          </button>
          
          <button
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            @click="$emit('edit', connection)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          
          <button
          class="p-2 text-gray-400 hover:text-red-600 transition-colors"
            @click="$emit('delete', connection.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Available Tables -->
    <div v-if="connection.available_tables?.length" class="mt-4 pt-4 border-t border-gray-100">
      <h4 class="text-sm font-medium text-gray-900 mb-2">Available Tables</h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="table in connection.available_tables"
          :key="table"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="connection.selected_tables?.includes(table) ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'"
        >
          {{ table }}
        </span>
      </div>
      
      <button
        v-if="connection.available_tables.length > 0"
        class="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
        @click="$emit('selectTables', connection)"
      >
        {{ connection.selected_tables?.length ? 'Update' : 'Select' }} Tables
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  connection: {
    type: Object,
    required: true
  },
  syncing: {
    type: [String, Number, null],
    default: null
  }
})

defineEmits(['sync', 'edit', 'delete', 'selectTables'])

const formatLastSync = (date) => {
  if (!date) return 'Never'
  const now = new Date()
  const syncDate = new Date(date)
  const diffMinutes = Math.floor((now - syncDate) / (1000 * 60))
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} mins ago`
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`
  return `${Math.floor(diffMinutes / 1440)} days ago`
}
</script>