<!-- pages/dashboard/database.vue -->
<template>
  <div>
    <header class="bg-white px-6 py-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-[#7F56D9] text-2xl font-bold">Database Connections</h1>
          <p class="text-sm lg:text-base text-[#6B7280]">
            Manage your chatbot's data sources and connections
          </p>
        </div>
        
        <div class="flex items-center space-x-4">
          <button  
            class="px-5 py-4 nav_primary_btn text-sm lg:text-base flex items-center gap-2 text-white rounded-lg transition-colors"
            @click="showAddModal = true"
          >
            <Plus class="w-5 h-5" />
            <span>Add Database</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Database Connections List -->
    <div class="space-y-4 px-6">
      <!-- Database Connections List -->
<div class="space-y-4 px-6">
  <DatabaseConnectionCard
    v-for="connection in databaseStore.connections"
    :key="connection._id"
    :connection="connection"
    :syncing="databaseStore.syncing"
    @sync="syncConnection"
    @edit="editConnection"
    @delete="deleteConnection"
    @select-tables="selectTables"
  />
</div>
      <!-- Empty State -->
      <EmptyState
  v-if="!databaseStore.connections.length && !databaseStore.loading"
  title="No databases connected"
  description="Get started by connecting your first database."
  icon="database"
  variant="card"
>
  <template #action>
    <button
      class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
      @click="showAddModal = true"
    >
      Add Database
    </button>
  </template>
</EmptyState>
    </div>

    <!-- Add Database Modal -->
    <DatabaseModal
      :show="showAddModal"
      :chatbots="chatbotStore.chatbots"
      :loading="databaseStore.adding"
      :error="databaseStore.error"
      @close="closeModal"
      @submit="addConnection"
    />

    <!-- Table Selection Modal -->
    <BaseModal
      :show="showTableModal"
      title="Select Tables"
      @close="showTableModal = false"
    >
      <div class="space-y-2 max-h-60 overflow-y-auto">
        <label
          v-for="table in selectedConnection?.available_tables"
          :key="table"
          class="flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
        >
          <input
            v-model="selectedTables"
            type="checkbox"
            :value="table"
            class="mr-3 text-purple-600 focus:ring-purple-500"
          >
          <span class="text-sm text-gray-900">{{ table }}</span>
        </label>
      </div>
      
      <div class="flex justify-end space-x-3 pt-4">
        <button
          class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          @click="showTableModal = false"
        >
          Cancel
        </button>
        <button
          :disabled="databaseStore.updating"
          class="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50"
          @click="updateTables"
        >
          {{ databaseStore.updating ? 'Updating...' : 'Update Tables' }}
        </button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseModal from '~/components/BaseModal.vue'

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

// Helper functions
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
  
  const result = await databaseStore.updateSelectedTables(selectedConnection.value._id, selectedTables.value)
  if (result.success) {
    showTableModal.value = false
  }
}

const syncConnection = async (connectionId) => {
  await databaseStore.syncConnection(connectionId)
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