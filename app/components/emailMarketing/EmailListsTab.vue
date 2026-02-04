<!-- emailMarketing/EmailListsTab.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search lists..."
        class="px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-sans"
      />
      <button
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-sans"
        @click="openCreateModal"
      >
        Create List
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="emailStore.listsLoading"
      class="flex items-center justify-center py-12"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"
      ></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredLists.length === 0 && !searchQuery"
      class="text-center py-12"
    >
      <div
        class="bg-blue-50 dark:bg-blue-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-10 h-10 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3
        class="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-subheading"
      >
        No lists yet
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4 font-sans">
        Create your first email list to organize your contacts
      </p>
      <button
        class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-sans"
        @click="openCreateModal"
      >
        Create List
      </button>
    </div>

    <!-- Lists Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="list in filteredLists"
        :key="list.id"
        class="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all duration-300 font-sans"
      >
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-subheading"
        >
          {{ list.name }}
        </h3>
        <p
          v-if="list.description"
          class="text-sm text-gray-600 dark:text-gray-400 mb-4 font-sans"
        >
          {{ list.description }}
        </p>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="font-sans">
            <p class="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ list.total_subscribers }}
            </p>
          </div>
          <div class="font-sans">
            <p class="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ list.active_subscribers }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="flex-1 px-3 py-2 text-sm text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-sans"
            @click="editList(list)"
          >
            Edit
          </button>
          <button
            class="px-3 py-2 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-sans"
            @click="deleteList(list)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- List Modal -->
    <ListModal
      v-if="showListModal"
      :list="selectedList"
      @close="closeListModal"
      @saved="handleListSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";
import ListModal from "./ListModal.vue";

const emailStore = useEmailMarketingStore();
const $toast = useToast();

const searchQuery = ref("");
const showListModal = ref(false);
const selectedList = ref(null);

const filteredLists = computed(() => {
  if (!searchQuery.value) return emailStore.lists;

  return emailStore.lists.filter(
    (list) =>
      list.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      list.description?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const openCreateModal = () => {
  selectedList.value = null;
  showListModal.value = true;
};

const editList = (list) => {
  selectedList.value = list;
  showListModal.value = true;
};

const closeListModal = () => {
  showListModal.value = false;
  selectedList.value = null;
};

const handleListSaved = () => {
  closeListModal();
  emailStore.fetchLists();
  $toast.success("List saved successfully");
};

const deleteList = async (list) => {
  if (!confirm(`Delete "${list.name}"? This will not delete the contacts.`))
    return;

  try {
    await emailStore.deleteList(list.id);
    $toast.success("List deleted");
  } catch (error) {
    $toast.error(error.response?.data?.message || "Failed to delete list");
  }
};
</script>
