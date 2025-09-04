<!-- pages/dashboard/database.vue -->
<template>
  <div>
    <header class="bg-white px-6 py-4">
                <div class="flex justify-between items-center">
                  <div>
                        <h1 class="text-[#7F56D9] text-2xl font-bold">
                            Dashboard Overview
                        </h1>
                        <p class="text-sm lg:text-base text-[#6B7280] ">
                            Monitor your chatbot performance and engagement
                        </p>
                  </div>
        
                  <!-- Add Database Button -->
                  <div class="flex items-center space-x-4">
                        <button  
                        class=" px-5 py-4 nav_primary_btn text-sm lg: text-base flex items-center gap-2  text-white rounded-lg transition-colors"
                        @click="showAddModal = true"
                        >
                            <Plus class="w-5 h-5" />
                           <span>Add Database</span>
                        </button>
                  </div>
                </div>
              </header>

    <!-- Database Connections List -->
    <div class="space-y-4">
      <div
        v-for="connection in connections"
        :key="connection.id"
        class="bg-white rounded-lg border border-gray-200 p-6"
      >
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
                  {{ connection.status === 'connected' ? 'Connected' : 'Disconnected' }}
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
                class="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 border border-purple-200 rounded-md transition-colors disabled:opacity-50"
                :disabled="syncing === connection.id"
                @click="syncConnection(connection.id)"
              >
                {{ syncing === connection.id ? 'Syncing...' : 'Sync Now' }}
              </button>
              
              <button
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                @click="editConnection(connection)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              
              <button
              class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                @click="deleteConnection(connection.id)"
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
            @click="selectTables(connection)"
          >
            {{ connection.selected_tables?.length ? 'Update' : 'Select' }} Tables
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <EmptyState
  v-if="!connections.length && !loading"
  title="No databases connected"
  description="Get started by connecting your first database."
  icon="database"
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
  :chatbots="chatbots"
  :loading="adding"
  :error="error"
  @close="closeModal"
  @submit="addConnection"
/>

    <!-- Table Selection Modal -->
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
    :disabled="updating"
    class="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50"
      @click="updateTables"
    >
      {{ updating ? 'Updating...' : 'Update Tables' }}
    </button>
  </div>
</BaseModal>
  </div>
</template>

<script setup>
import BaseModal from '~/components/BaseModal.vue'

definePageMeta({
  layout: 'dashboard'
})

const authStore = useAuthStore()
const config = useRuntimeConfig()

const connections = ref([])
const chatbots = ref([])
const loading = ref(true)
const adding = ref(false)
const updating = ref(false)
const syncing = ref(null)
const error = ref('')

const showAddModal = ref(false)
const showTableModal = ref(false)
const selectedConnection = ref(null)
const selectedTables = ref([])

const form = ref({
  name: '',
  type: '',
  chatbot_id: '',
  host: '',
  port: '',
  database: '',
  username: '',
  password: ''
})



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

const fetchConnections = async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}/api/database`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
      connections.value = data.connections || []
    console.log(connections.value)
  } catch (err) {
    console.error('Failed to fetch connections:', err)
  }
}

const fetchChatbots = async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}/api/chatbots`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
      chatbots.value = data.chatbots || []
    // console.log(chatbots.value)
  } catch (err) {
    console.error('Failed to fetch chatbots:', err)
    // For now, create a mock chatbot if none exist
    chatbots.value = []
  }
}

const addConnection = async (formData) => {
  adding.value = true
  error.value = ''

  try {
    await $fetch(`${config.public.apiBase}/api/database`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    })
    
    closeModal()
    await fetchConnections()
  } catch (err) {
    error.value = err.data?.message || 'Failed to connect database'
  } finally {
    adding.value = false
  }
}
const selectTables = (connection) => {
  selectedConnection.value = connection
  selectedTables.value = [...(connection.selected_tables || [])]
  showTableModal.value = true
}

const updateTables = async () => {
  if (!selectedConnection.value) return

    updating.value = true
    console.log(selectedConnection.value.id);
  try {
    await $fetch(`${config.public.apiBase}/api/database/${selectedConnection.value.id}/tables`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { selected_tables: selectedTables.value }
    })
    
    showTableModal.value = false
    await fetchConnections()
  } catch (err) {
    error.value = err.data?.message || 'Failed to update tables'
  } finally {
    updating.value = false
  }
}

const syncConnection = async (connectionId) => {
  syncing.value = connectionId
  try {
    await $fetch(`${config.public.apiBase}/api/database/${connectionId}/sync`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await fetchConnections()
  } catch (err) {
    console.error('Sync failed:', err)
  } finally {
    syncing.value = null
  }
}

const deleteConnection = async (connectionId) => {
  if (!confirm('Are you sure you want to delete this database connection?')) return

  try {
    await $fetch(`${config.public.apiBase}/api/database/${connectionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await fetchConnections()
  } catch (err) {
    console.error('Delete failed:', err)
  }
}

const editConnection = (connection) => {
  // TODO: Implement edit functionality
  console.log('Edit connection:', connection)
}

const closeModal = () => {
  showAddModal.value = false
  form.value = {
    name: '',
    type: '',
    chatbot_id: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: ''
  }
  error.value = ''
}

// Watch form.type to set default port
watch(() => form.value.type, (newType) => {
  if (newType && !form.value.port) {
    const ports = { mysql: '3306', postgresql: '5432', mongodb: '27017' }
    form.value.port = ports[newType] || ''
  }
})

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchConnections(), fetchChatbots()])
  loading.value = false
})
</script>