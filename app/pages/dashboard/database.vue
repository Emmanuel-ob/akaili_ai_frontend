<!-- pages/dashboard/database.vue -->
<template>
  <div>
    <header
      class="bg-white dark:bg-slate-900 px-4 sm:px-6 py-5 border-b border-gray-200 dark:border-slate-800 transition-all duration-500 ease-out"
    >
      <div class="flex justify-between items-center">
        <div>
          <h1
            class="text-[#9E4CFF] text-2xl md:text-3xl font-bold font-heading leading-tight"
          >
            Database Connections
          </h1>
          <p class="text-sm lg:text-base text-[#6B7280] font-sans">
            Manage your chatbot's data sources and connections
          </p>
        </div>

        <div class="flex items-center space-x-4">
          <button
            class="px-4 py-2 nav_primary_btn text-sm lg:text-base flex items-center gap-2 text-white rounded-lg transition-colors font-sans"
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
          :syncing="databaseStore.syncing === connection.id"
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
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#9E4CFF] hover:bg-purple-700 font-sans"
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
          class="flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer font-sans"
        >
          <input
            v-model="selectedTables"
            type="checkbox"
            :value="table"
            class="mr-3 text-[#9E4CFF] focus:ring-purple-500"
          />
          <span class="text-sm text-gray-900">{{ table }}</span>
        </label>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <button
          class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-sans"
          @click="showTableModal = false"
        >
          Cancel
        </button>
        <button
          :disabled="databaseStore.updating"
          class="px-4 py-2 text-sm text-white bg-[#9E4CFF] hover:bg-purple-700 rounded-md disabled:opacity-50 font-sans"
          @click="updateTables"
        >
          {{ databaseStore.updating ? "Updating..." : "Update Tables" }}
        </button>
      </div>
    </BaseModal>

    <!-- Sync Progress Modal -->
    <SyncProgressModal
      :show="showSyncProgress"
      :connection-id="syncingConnectionId"
      @close="closeSyncProgress"
      @retry="retrySyncConnection"
      @cancel="cancelSyncConnection"
    />
  </div>
</template>

<script setup>
import { Plus } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import BaseModal from "~/components/BaseModal.vue";
import SyncProgressModal from "~/components/sync/SyncProgressModal.vue";

definePageMeta({
  layout: "dashboard",
});

// Stores
const databaseStore = useDatabaseStore();
const chatbotStore = useChatbotStore();

// Modal states
const showAddModal = ref(false);
const showTableModal = ref(false);
const selectedConnection = ref(null);
const selectedTables = ref([]);
const showSyncProgress = ref(false);
const syncingConnectionId = ref(null);

// Helper functions
const formatLastSync = (date) => {
  if (!date) return "Never";
  const now = new Date();
  const syncDate = new Date(date);
  const diffMinutes = Math.floor((now - syncDate) / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
  return `${Math.floor(diffMinutes / 1440)} days ago`;
};

// Actions
const addConnection = async (formData) => {
  const result = await databaseStore.addConnection(formData);
  if (result.success) {
    closeModal();
  }
};

const selectTables = (connection) => {
  selectedConnection.value = connection;
  selectedTables.value = [...(connection.selected_tables || [])];
  showTableModal.value = true;
};

const updateTables = async () => {
  if (!selectedConnection.value) return;

  const result = await databaseStore.updateSelectedTables(
    selectedConnection.value.id,
    selectedTables.value,
  );
  if (result.success) {
    showTableModal.value = false;
  }
};

const syncConnection = async (connectionId) => {
  try {
    // Set the syncing connection and show progress modal
    syncingConnectionId.value = connectionId;
    showSyncProgress.value = true;

    // Start the sync
    const result = await databaseStore.syncConnection(connectionId);

    if (!result.success) {
      // If sync failed to start, close the modal and show error
      showSyncProgress.value = false;
      // You might want to show a toast or alert here
      console.error("Failed to start sync:", result.message);
    }
  } catch (error) {
    showSyncProgress.value = false;
    console.error("Sync error:", error);
  }
};

const closeSyncProgress = () => {
  showSyncProgress.value = false;
  syncingConnectionId.value = null;
  // Refresh connections to get latest status
  databaseStore.fetchConnections();
};

const retrySyncConnection = async () => {
  if (syncingConnectionId.value) {
    // Close current modal and restart sync
    showSyncProgress.value = false;
    await syncConnection(syncingConnectionId.value);
  }
};

const cancelSyncConnection = () => {
  // The cancel logic is handled in the modal component
  // Just refresh connections after cancel
  databaseStore.fetchConnections();
};

const deleteConnection = async (connectionId) => {
  if (!confirm("Are you sure you want to delete this database connection?"))
    return;
  await databaseStore.deleteConnection(connectionId);
};

const editConnection = (connection) => {
  console.log("Edit connection:", connection);
};

const closeModal = () => {
  showAddModal.value = false;
  databaseStore.clearError();
};

onMounted(async () => {
  await Promise.all([
    databaseStore.fetchConnections(),
    chatbotStore.fetchChatbots(),
  ]);
});
</script>
