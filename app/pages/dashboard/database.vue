<template>
  <div class="min-h-screen bg-white md:bg-gray-50 dark:bg-slate-950 transition-colors duration-300">

    <!-- Sticky Header -->
    <header
      class="bg-white dark:bg-slate-900 px-4 md:px-6 py-4 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300 sticky top-0 z-30">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-[#9E4CFF] text-xl md:text-2xl font-bold">Database</h1>
          <p class="text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
            Manage your chatbot's data sources
          </p>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Usage Meter (if feature is available) -->
          <UsageMeter v-if="subscription.hasFeature('database_integration') && databaseUsage" label="Databases"
            :used="databaseUsage.used" :limit="databaseUsage.limit" :compact="true" />

          <!-- Add Database Button -->
          <button :disabled="subscription.isLimitExceeded('databases')" :class="[
            'px-5 py-4 text-sm lg:text-base flex items-center gap-2 text-white rounded-lg transition-colors',
            subscription.isLimitExceeded('databases')
              ? 'bg-gray-400 cursor-not-allowed'
              : 'nav_primary_btn hover:bg-purple-700'
          ]" @click="handleAddDatabase">
            <Plus class="w-5 h-5" />
            <span v-if="!subscription.isLimitExceeded('databases')">Add Database</span>
            <span v-else>Limit Reached</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Feature Locked State -->
    <div v-if="!subscription.hasFeature('database_integration')" class="text-center py-12 px-6">
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <svg class="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Database Integration Locked
        </h3>
        <p class="text-gray-600 mb-6">
          Upgrade to Professional or Enterprise to connect your databases and unlock AI-powered data insights
        </p>
        <button @click="handleUpgrade"
          class="px-6 py-3 bg-[#9E4CFF] text-white rounded-lg hover:bg-purple-700 transition-colors">
          View Plans & Upgrade
        </button>
      </div>
    </div>

    <!-- Active State - Database List -->
    <div v-else class="space-y-4 px-6">
      <!-- Database Connections List -->
      <div v-if="databaseStore.connections.length > 0" class="space-y-4">
        <!-- ✅ Keep old event names for compatibility -->
        <DatabaseConnectionCard v-for="connection in databaseStore.connections" :key="connection._id || connection.id"
          :connection="connection" :syncing="databaseStore.syncing" @sync="syncConnection" @edit="editConnection"
          @delete="confirmDelete" @select-tables="selectTables" />
      </div>

      <!-- Empty State -->
      <EmptyState v-else-if="!databaseStore.loading" title="No databases connected"
        description="Get started by connecting your first database to enable AI-powered insights." icon="database"
        variant="card">
        <template #action>
          <button
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#9E4CFF] hover:bg-purple-700"
            @click="handleAddDatabase">
            Add Your First Database
          </button>
        </template>
      </EmptyState>

      <!-- Loading State -->
      <div v-else class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9E4CFF] mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading databases...</p>
      </div>
    </div>

    <!-- Add/Edit Database Modal -->
    <DatabaseModal :show="showDatabaseModal" :chatbots="chatbotStore.chatbots" :loading="databaseStore.adding"
      :error="databaseStore.error" :editing="!!selectedDatabase" :initial-data="selectedDatabase" @close="closeModal"
      @submit="addConnection" />

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
          <button
            class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
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

    <!-- ✅ Sync Progress Modal with WebSocket support -->
    <SyncProgressModal :show="showSyncProgress" :connection="syncingConnection" @close="closeSyncProgress"
      @sync-complete="handleSyncComplete" />

    <!-- Feature Locked Modal -->
    <FeatureLockedPrompt :show="showFeatureLockedModal" title="Upgrade to Use Database Integration"
      description="Connect your databases to enable AI-powered data analysis and intelligent querying."
      feature-name="database_integration" :current-plan="subscription.currentPlan?.plan_id"
      :required-plan="subscription.getRequiredPlan('database_integration')" :features="[
        'Connect multiple databases (Professional: 3, Enterprise: Unlimited)',
        'AI-powered natural language queries',
        'Real-time data synchronization',
        'Advanced analytics and reporting',
        'Secure encrypted connections'
      ]" @close="showFeatureLockedModal = false" @upgrade="navigateToPricing" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import { useSubscription } from '~/composables/useSubscription'
import { usePermissions } from '~/composables/usePermissions'
import { useDatabaseStore } from '~/stores/databaseStore'
import { useChatbotStore } from '~/stores/chatbotStore'
import BaseModal from '~/components/BaseModal.vue'
import SyncProgressModal from '~/components/sync/SyncProgressModal.vue'
import DatabaseModal from '~/components/DatabaseModal.vue'
import DatabaseConnectionCard from '~/components/DatabaseConnectionCard.vue'
import EmptyState from '~/components/EmptyState.vue'
import UsageMeter from '~/components/subscriptions/UsageMeter.vue'
import FeatureLockedPrompt from '~/components/subscriptions/FeatureLockedPrompt.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})

const router = useRouter()
const subscription = useSubscription()
const permissions = usePermissions()
const databaseStore = useDatabaseStore()
const chatbotStore = useChatbotStore()

// Modal states
const showDatabaseModal = ref(false)
const showTableModal = ref(false)
const showSyncProgress = ref(false)
const showFeatureLockedModal = ref(false)
const selectedConnection = ref(null)
const selectedDatabase = ref(null)
const selectedTables = ref([])
const syncingConnection = ref(null)

// Computed
const databaseUsage = computed(() => subscription.getUsage('databases'))

// Add Database Handler
const handleAddDatabase = async () => {
  console.log('Add Database clicked')

  if (!subscription.hasFeature('database_integration')) {
    console.log('Feature locked - showing modal')
    showFeatureLockedModal.value = true
    return
  }

  if (subscription.isLimitExceeded('databases')) {
    console.log('Limit exceeded - prompting upgrade')
    const shouldUpgrade = confirm(
      `You've reached your database limit (${databaseUsage.value.limit}). Upgrade to add more databases?`
    )
    if (shouldUpgrade) {
      handleUpgrade()
    }
    return
  }

  if (!permissions.canManageDatabases.value) {
    console.log('Permission denied')
    alert('You do not have permission to manage databases')
    return
  }

  console.log('Opening database modal')
  selectedDatabase.value = null
  showDatabaseModal.value = true
}

// Add/Update Connection
const addConnection = async (formData) => {
  try {
    let result

    if (selectedDatabase.value) {
      result = await databaseStore.updateConnection(selectedDatabase.value._id || selectedDatabase.value.id, formData)
    } else {
      result = await databaseStore.addConnection(formData)
      await subscription.fetchUsage()
    }

    if (result.success) {
      closeModal()
    }
  } catch (error) {
    console.error('Error saving database:', error)

    if (error.statusCode === 402) {
      if (error.data?.error_code === 'FEATURE_LOCKED') {
        closeModal()
        showFeatureLockedModal.value = true
      } else if (error.data?.error_code === 'LIMIT_EXCEEDED') {
        closeModal()
        handleUpgrade()
      }
    }
  }
}

// Table Selection
const selectTables = (connection) => {
  selectedConnection.value = connection
  selectedTables.value = [...(connection.selected_tables || [])]
  showTableModal.value = true
}

const updateTables = async () => {
  if (!selectedConnection.value) return

  const connId = selectedConnection.value._id || selectedConnection.value.id
  const result = await databaseStore.updateSelectedTables(connId, selectedTables.value)
  if (result.success) {
    showTableModal.value = false
  }
}

// ✅ Sync Operations with WebSocket
const syncConnection = async (connectionId) => {
  console.log('🔄 Starting sync for connection:', connectionId)

  try {
    const connection = databaseStore.getConnectionById(connectionId)
    if (!connection) {
      console.error('Connection not found:', connectionId)
      return
    }

    // Set syncing connection and show progress modal
    syncingConnection.value = connection
    showSyncProgress.value = true

    // Start the sync (WebSocket will handle progress updates)
    const result = await databaseStore.syncConnection(connectionId)

    if (!result.success) {
      showSyncProgress.value = false
      syncingConnection.value = null
      console.error('Failed to start sync:', result.message)
      alert(`Failed to start sync: ${result.message}`)
    }
  } catch (error) {
    showSyncProgress.value = false
    syncingConnection.value = null
    console.error('Sync error:', error)
    alert('An error occurred while starting the sync')
  }
}

const closeSyncProgress = () => {
  showSyncProgress.value = false
  syncingConnection.value = null
  databaseStore.fetchConnections()
}

const handleSyncComplete = async (connection) => {
  console.log('✅ Sync completed for:', connection.name)
  await databaseStore.fetchConnections()
}

// Edit/Delete Operations
const editConnection = (connectionId) => {
  console.log('📝 Editing connection:', connectionId)

  if (!permissions.canManageDatabases.value) {
    alert('You do not have permission to edit databases')
    return
  }

  const connection = databaseStore.getConnectionById(connectionId)
  if (connection) {
    selectedDatabase.value = connection
    showDatabaseModal.value = true
  }
}

const confirmDelete = async (connectionId) => {
  console.log('🗑️ Delete requested for:', connectionId)

  if (!permissions.canManageDatabases.value) {
    alert('You do not have permission to delete databases')
    return
  }

  const connection = databaseStore.getConnectionById(connectionId)
  if (!connection) return

  if (!confirm(`Are you sure you want to delete "${connection.name}"? This action cannot be undone.`)) {
    return
  }

  const result = await databaseStore.deleteConnection(connectionId)

  if (result.success) {
    await subscription.fetchUsage()
  } else {
    alert(`Failed to delete connection: ${result.message}`)
  }
}

// Upgrade Handlers
const handleUpgrade = () => {
  subscription.navigateToUpgrade('database_integration', 'limit_reached')
}

const navigateToPricing = () => {
  router.push({
    path: '/pricing',
    query: {
      feature: 'database_integration',
      requiredPlan: subscription.getRequiredPlan('database_integration')
    }
  })
  showFeatureLockedModal.value = false
}

// Modal Management
const closeModal = () => {
  showDatabaseModal.value = false
  selectedDatabase.value = null
  databaseStore.clearError()
}

// Lifecycle
onMounted(async () => {
  console.log('📦 Database page mounted')

  await subscription.fetchSubscription()
  await chatbotStore.fetchChatbots()

  if (subscription.hasFeature('database_integration')) {
    await databaseStore.fetchConnections()
  }
})
</script>