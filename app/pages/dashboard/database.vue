<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Database Connections
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Connect your databases to power AI-driven insights
      </p>
    </div>

    <!-- Usage Meter -->
    <div v-if="subscription.hasFeature('database_integration')" class="mb-6">
      <UsageMeter v-if="databaseUsage" label="Database Connections" :used="databaseUsage.used"
        :limit="databaseUsage.limit" @upgrade="handleUpgrade" />
    </div>

    <!-- Feature Locked State -->
    <div v-if="!subscription.hasFeature('database_integration')" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <svg class="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Database Integration Locked
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Upgrade to Professional or Enterprise to connect your databases
        </p>
        <button @click="handleUpgrade"
          class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          View Plans
        </button>
      </div>
    </div>

    <!-- Active State - Show Databases -->
    <div v-else>
      <!-- Add Database Button -->
      <div class="mb-6">
        <button @click="handleAddDatabase" :disabled="subscription.isLimitExceeded('databases')" :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          subscription.isLimitExceeded('databases')
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        ]">
          <span v-if="!subscription.isLimitExceeded('databases')">
            + Add Database
          </span>
          <span v-else>
            Limit Reached - Upgrade to Add More
          </span>
        </button>
      </div>

      <!-- Database List -->
      <div class="grid gap-4">
        <DatabaseConnectionCard v-for="db in databases" :key="db.id" :database="db" @edit="handleEdit"
          @delete="handleDelete" />
      </div>

      <!-- Empty State -->
      <EmptyState v-if="databases.length === 0" title="No databases connected"
        description="Add your first database to get started" @action="handleAddDatabase" />
    </div>

    <!-- Feature Locked Modal -->
    <FeatureLockedPrompt :show="showFeatureLockedModal" title="Upgrade to Use Database Integration"
      description="Connect your databases to enable AI-powered data analysis and intelligent querying."
      feature-name="database_integration" :current-plan="subscription.currentPlan?.plan_id"
      :required-plan="subscription.getRequiredPlan('database_integration')" :features="[
        'Connect up to 3 databases (Professional) or unlimited (Enterprise)',
        'AI-powered natural language queries',
        'Real-time data synchronization',
        'Advanced analytics and reporting'
      ]" @close="showFeatureLockedModal = false" @upgrade="navigateToPricing" />

    <!-- Database Modal -->
    <DatabaseModal v-if="showDatabaseModal" :database="selectedDatabase" @close="showDatabaseModal = false"
      @save="handleSaveDatabase" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSubscription } from '~/composables/useSubscription'
import { usePermissions } from '~/composables/usePermissions'
import { useDatabaseStore } from '~/stores/databaseStore'
import UsageMeter from '~/components/subscriptions/UsageMeter.vue'
import FeatureLockedPrompt from '~/components/subscriptions/FeatureLockedPrompt.vue'
import DatabaseModal from '~/components/DatabaseModal.vue'
import DatabaseConnectionCard from '~/components/DatabaseConnectionCard.vue'
import EmptyState from '~/components/EmptyState.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})

const router = useRouter()
const subscription = useSubscription()
const permissions = usePermissions()
const databaseStore = useDatabaseStore()

const showFeatureLockedModal = ref(false)
const showDatabaseModal = ref(false)
const selectedDatabase = ref(null)

// Computed
const databases = computed(() => databaseStore.connections || [])
const databaseUsage = computed(() => subscription.getUsage('databases'))

// Methods
const handleAddDatabase = async () => {
  // Check feature access
  const access = subscription.canPerformAction('database_integration', 'databases')

  if (!access.allowed) {
    if (access.reason === 'feature_locked') {
      showFeatureLockedModal.value = true
    } else if (access.reason === 'limit_exceeded') {
      // Show inline upgrade prompt
      const shouldUpgrade = confirm(
        `You've reached your database limit (${databaseUsage.value.limit}). Upgrade to add more?`
      )
      if (shouldUpgrade) {
        handleUpgrade()
      }
    }
    return
  }

  // Check role permission
  if (!permissions.canManageDatabases.value) {
    alert('You do not have permission to manage databases')
    return
  }

  // All checks passed - show modal
  selectedDatabase.value = null
  showDatabaseModal.value = true
}

const handleSaveDatabase = async (databaseData) => {
  try {
    if (selectedDatabase.value) {
      await databaseStore.updateConnection(selectedDatabase.value.id, databaseData)
    } else {
      await databaseStore.createConnection(databaseData)

      // Refresh usage after creation
      await subscription.fetchUsage()
    }

    showDatabaseModal.value = false
    selectedDatabase.value = null
  } catch (error) {
    // Handle error - backend will return 402 if limits exceeded
    if (error.statusCode === 402) {
      if (error.data?.error_code === 'FEATURE_LOCKED') {
        showFeatureLockedModal.value = true
      } else if (error.data?.error_code === 'LIMIT_EXCEEDED') {
        handleUpgrade()
      }
    }
  }
}

const handleEdit = (database) => {
  if (!permissions.canManageDatabases.value) {
    alert('You do not have permission to edit databases')
    return
  }

  selectedDatabase.value = database
  showDatabaseModal.value = true
}

const handleDelete = async (database) => {
  if (!permissions.canManageDatabases.value) {
    alert('You do not have permission to delete databases')
    return
  }

  if (confirm('Are you sure you want to delete this database connection?')) {
    await databaseStore.deleteConnection(database.id)

    // Refresh usage after deletion
    await subscription.fetchUsage()
  }
}

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

// Lifecycle
onMounted(async () => {
  // Fetch subscription data
  await subscription.fetchSubscription()

  // Only fetch databases if feature is unlocked
  if (subscription.hasFeature('database_integration')) {
    await databaseStore.fetchConnections()
  }
})
</script>