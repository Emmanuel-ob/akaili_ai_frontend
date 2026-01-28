<!-- pages/dashboard/database.vue -->
<template>
  <div class="min-h-screen bg-white md:bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
    
    <!-- Sticky Header -->
    <header class="bg-white dark:bg-slate-900 px-4 md:px-6 py-4 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300 sticky top-0 z-30">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-[#9E4CFF] text-xl md:text-2xl font-bold">Database</h1>
          <p class="text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
            Manage your chatbot's data sources
          </p>
        </div>

        <div class="flex items-center space-x-4">
          <button
            class="px-4 py-2 md:px-5 md:py-3 nav_primary_btn text-sm font-medium flex items-center gap-2 text-white rounded-lg md:rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all transform hover:-translate-y-0.5"
            @click="showAddModal = true">
            <Plus class="w-5 h-5" />
            <span class="hidden sm:inline">Add Database</span>
            <span class="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <!-- Removed padding on mobile (p-0) to allow full-width list items -->
    <main class="p-0 md:p-6 pb-20">
        
        <!-- Database Connections List -->
        <div v-if="databaseStore.connections.length > 0" class="flex flex-col space-y-0 md:space-y-4">
          <DatabaseConnectionCard 
              v-for="connection in databaseStore.connections" 
              :key="connection._id"
              :connection="connection" 
              :syncing="databaseStore.syncing === connection.id" 
              @sync="syncConnection"
              @edit="editConnection" 
              @delete="deleteConnection" 
              @select-tables="selectTables" 
          />
        </div>

        <!-- Empty State -->
        <!-- Responsive Container: Transparent/No-border on mobile, Card on Desktop -->
        <div v-else-if="!databaseStore.loading" class="p-4 md:p-0">
            <EmptyState 
                title="No databases connected"
                description="Get started by connecting your first database." 
                icon="database" 
                variant="card"
                class="border-0 md:border shadow-none md:shadow-sm bg-transparent md:bg-white md:dark:bg-slate-900"
            >
              <template #action>
                <button
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[#9E4CFF] hover:bg-purple-700 transition-colors"
                  @click="showAddModal = true">
                  Add Database
                </button>
              </template>
            </EmptyState>
        </div>

        <!-- Loading State -->
        <div v-else class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9E4CFF]"></div>
        </div>
    </main>

    <!-- Add Database Modal -->
    <DatabaseModal :show="showAddModal" :chatbots="chatbotStore.chatbots" :loading="databaseStore.adding"
      :error="databaseStore.error" @close="closeModal" @submit="addConnection" />

    <!-- Table Selection Modal -->
    <BaseModal :show="showTableModal" title="Select Tables" @close="showTableModal = false">
      <template #body>
          <div class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
            <label v-for="table in selectedConnection?.available_tables" :key="table"
              class="flex items-center p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors bg-white dark:bg-slate-900">
              <input v-model="selectedTables" type="checkbox" :value="table"
                class="mr-3 h-4 w-4 text-[#9E4CFF] focus:ring-purple-500 border-gray-300 dark:border-slate-600 rounded">
              <span class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ table }}</span>
            </label>
          </div>

          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-100 dark:border-slate-800 mt-4">
            <button class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              @click="showTableModal = false">
              Cancel
            </button>
            <button :disabled="databaseStore.updating"
              class="px-4 py-2 text-sm text-white bg-[#9E4CFF] hover:bg-purple-700 rounded-lg shadow-md disabled:opacity-50 transition-all"
              @click="updateTables">
              {{ databaseStore.updating ? 'Updating...' : 'Update Tables' }}
            </button>
          </div>
      </template>
    </BaseModal>

    <!-- Sync Progress Modal -->
    <SyncProgressModal :show="showSyncProgress" :connection-id="syncingConnectionId" @close="closeSyncProgress"
      @retry="retrySyncConnection" @cancel="cancelSyncConnection" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import BaseModal from '~/components/BaseModal.vue'
import SyncProgressModal from '~/components/sync/SyncProgressModal.vue'
import DatabaseConnectionCard from '~/components/DatabaseConnectionCard.vue'
import DatabaseModal from '~/components/DatabaseModal.vue'
import EmptyState from '~/components/EmptyState.vue'

definePageMeta({
  layout: 'dashboard'
})

// Stores
const databaseStore = useDatabaseStore()
const chatbotStore = useChatbotStore()

// Modal states
const showAddModal = ref(false)
const showTableModal = ref(false)
const selectedConnection = ref(null)
const selectedTables = ref([])
const showSyncProgress = ref(false)
const syncingConnectionId = ref(null)

// Actions
const addConnection = async (formData) => {
  const result = await databaseStore.addConnection(formData)
  if (result.success) {
    closeModal()
  }
}

const selectTables = (connection) => {
  selectedConnection.value = connection
  selectedTables.value = [...(connection.selected_tables || [])]
  showTableModal.value = true
}

const updateTables = async () => {
  if (!selectedConnection.value) return

  const result = await databaseStore.updateSelectedTables(selectedConnection.value.id, selectedTables.value)
  if (result.success) {
    showTableModal.value = false
  }
}

const syncConnection = async (connectionId) => {
  try {
    syncingConnectionId.value = connectionId
    showSyncProgress.value = true

    const result = await databaseStore.syncConnection(connectionId)

    if (!result.success) {
      showSyncProgress.value = false
      console.error('Failed to start sync:', result.message)
    }
  } catch (error) {
    showSyncProgress.value = false
    console.error('Sync error:', error)
  }
}

const closeSyncProgress = () => {
  showSyncProgress.value = false
  syncingConnectionId.value = null
  databaseStore.fetchConnections()
}

const retrySyncConnection = async () => {
  if (syncingConnectionId.value) {
    showSyncProgress.value = false
    await syncConnection(syncingConnectionId.value)
  }
}

const cancelSyncConnection = () => {
  databaseStore.fetchConnections()
}

const deleteConnection = async (connectionId) => {
  if (!confirm('Are you sure you want to delete this database connection?')) return
  await databaseStore.deleteConnection(connectionId)
}

const editConnection = (connection) => {
  console.log('Edit connection:', connection)
}

const closeModal = () => {
  showAddModal.value = false
  databaseStore.clearError()
}

onMounted(async () => {
  await Promise.all([
    databaseStore.fetchConnections(),
    chatbotStore.fetchChatbots()
  ])
})
</script>