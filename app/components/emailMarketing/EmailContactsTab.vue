<!-- email-marketing/EmailContactsTab.vue -->
<template>
  <div>
    <!-- Header -->
    <div
      class="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 gap-4"
    >
      <div
        class="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto"
      >
        <input
          v-model="searchQuery"
          class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-sans"
          placeholder="Search contacts..."
          type="text"
          @input="handleSearch"
        />

        <select
          v-model="listFilter"
          class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-sans"
          @change="handleFilterChange"
        >
          <option value="">All Lists</option>
          <option
            v-for="list in emailStore.lists"
            :key="list.id"
            :value="list.id"
          >
            {{ list.name }}
          </option>
        </select>

        <select
          v-model="statusFilter"
          class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-sans"
          @change="handleFilterChange"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="bounced">Bounced</option>
        </select>
      </div>

      <div class="flex flex-wrap items-center gap-2 w-full xl:w-auto">
        <button
          class="px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-sans"
          @click="showHelp = !showHelp"
        >
          {{ showHelp ? "Hide" : "Show" }} Help
        </button>
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-sans"
          @click="showImportModal = true"
        >
          Import
        </button>
        <button
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-sans"
          @click="exportContacts"
        >
          Export
        </button>
        <button
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-sans"
          @click="openAddModal"
        >
          Add Contact
        </button>
      </div>
    </div>

    <!-- Help Section (Collapsible) -->
    <transition name="slide-down">
      <div v-if="showHelp" class="mb-6">
        <div
          class="bg-linear-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-700 p-6"
        >
          <div class="flex items-start gap-4">
            <div class="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="flex-1">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-subheading"
              >
                Custom Fields Guide
              </h3>

              <div class="grid md:grid-cols-2 gap-4">
                <!-- Manual Entry -->
                <div
                  class="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700"
                >
                  <h4
                    class="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2 font-subheading"
                  >
                    <span class="text-2xl">✍️</span>
                    Manual Entry
                  </h4>
                  <p
                    class="text-sm text-gray-600 dark:text-gray-400 mb-2 font-sans"
                  >
                    Click "Add Contact" and use "Add Field" button to create
                    custom fields like:
                  </p>
                  <div
                    class="space-y-1 text-sm text-gray-700 dark:text-gray-300 font-sans"
                  >
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Company → Acme Corp</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Job Title → CEO</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Industry → Technology</span>
                    </div>
                  </div>
                </div>

                <!-- CSV Import -->
                <div
                  class="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700"
                >
                  <h4
                    class="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2 font-subheading"
                  >
                    <span class="text-2xl">📊</span>
                    CSV Import
                  </h4>
                  <p
                    class="text-sm text-gray-600 dark:text-gray-400 mb-2 font-sans"
                  >
                    Extra columns automatically become custom fields:
                  </p>
                  <div
                    class="bg-gray-50 dark:bg-slate-800 rounded p-2 font-mono text-xs overflow-x-auto border border-gray-200 dark:border-slate-700"
                  >
                    <div class="text-gray-500 dark:text-gray-400">
                      email, name, Company, Title
                    </div>
                    <div class="text-gray-700 dark:text-gray-300">
                      john@ex.com, John, Acme, CEO
                    </div>
                  </div>
                  <p
                    class="text-xs text-gray-500 dark:text-gray-400 mt-2 font-sans"
                  >
                    → Company and Title saved as custom fields ✓
                  </p>
                </div>

                <!-- Email Personalization -->
                <div
                  class="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700"
                >
                  <h4
                    class="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2 font-subheading"
                  >
                    <span class="text-2xl">💌</span>
                    Email Usage
                  </h4>
                  <p
                    class="text-sm text-gray-600 dark:text-gray-400 mb-2 font-sans"
                  >
                    Use custom fields in email templates:
                  </p>
                  <div
                    class="bg-purple-50 dark:bg-slate-800 rounded p-2 text-sm border border-purple-100 dark:border-slate-700 font-sans"
                  >
                    <code class="text-purple-700 dark:text-purple-400"
                      >Hi {{ first_name }}</code
                    ><br />
                    <code class="text-purple-700 dark:text-purple-400"
                      >from {{ Company }}</code
                    >
                  </div>
                </div>

                <!-- Common Fields -->
                <div
                  class="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700"
                >
                  <h4
                    class="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2 font-subheading"
                  >
                    <span class="text-2xl">💡</span>
                    Popular Fields
                  </h4>
                  <div
                    class="grid grid-cols-2 gap-1 text-sm text-gray-700 dark:text-gray-300 font-sans"
                  >
                    <div>• Company</div>
                    <div>• Job Title</div>
                    <div>• Industry</div>
                    <div>• Location</div>
                    <div>• Website</div>
                    <div>• Lead Source</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Loading State -->
    <div
      v-if="emailStore.contactsLoading"
      class="flex items-center justify-center py-12"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"
      ></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="emailStore.contacts.length === 0" class="text-center py-12">
      <div
        class="bg-gray-100 dark:bg-slate-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-10 h-10 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h3
        class="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-subheading"
      >
        No contacts yet
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4 font-sans">
        Add your first contact or import from CSV
      </p>
      <div class="flex items-center justify-center gap-3">
        <button
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-sans"
          @click="showImportModal = true"
        >
          Import Contacts
        </button>
        <button
          class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-sans"
          @click="openAddModal"
        >
          Add Contact
        </button>
      </div>
    </div>

    <!-- Contacts Table -->
    <div
      v-else
      class="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 overflow-x-auto"
    >
      <table class="w-full">
        <thead
          class="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 font-subheading"
        >
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Contact
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              List
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Custom Fields
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Tags
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-slate-800 font-sans">
          <tr
            v-for="contact in emailStore.contacts"
            :key="contact.id"
            class="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors font-sans"
          >
            <td class="px-6 py-4">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ contact.first_name }} {{ contact.last_name }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ contact.email }}
                </p>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
              {{ contact.list_name }}
            </td>
            <td class="px-6 py-4">
              <div
                v-if="
                  contact.custom_fields &&
                  Object.keys(contact.custom_fields).length > 0
                "
                class="flex flex-wrap gap-1"
              >
                <span
                  v-for="(value, key) in getDisplayCustomFields(
                    contact.custom_fields,
                  )"
                  :key="key"
                  class="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                  :title="`${key}: ${value}`"
                >
                  {{ key }}
                </span>
                <span
                  v-if="Object.keys(contact.custom_fields).length > 3"
                  class="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                >
                  +{{ Object.keys(contact.custom_fields).length - 3 }} more
                </span>
              </div>
              <span v-else class="text-sm text-gray-400 dark:text-gray-500"
                >No custom fields</span
              >
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in contact.tags?.slice(0, 2)"
                  :key="tag"
                  class="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                >
                  {{ tag }}
                </span>
                <span
                  v-if="contact.tags?.length > 2"
                  class="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                >
                  +{{ contact.tags.length - 2 }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  contact.status === 'active'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : contact.status === 'unsubscribed'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
                ]"
              >
                {{ contact.status }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <button
                  @click="editContact(contact)"
                  class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="deleteContact(contact)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="emailStore.contacts.length > 0"
      class="mt-4 flex items-center justify-between"
    >
      <p class="text-sm text-gray-600 dark:text-gray-400 font-sans">
        Showing {{ emailStore.contacts.length }} of
        {{ emailStore.contactsPagination.total }} contacts
      </p>
      <div class="flex items-center gap-2">
        <button
          :disabled="emailStore.contactsPagination.current_page === 1"
          class="px-3 py-1 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-sans"
          @click="changePage(emailStore.contactsPagination.current_page - 1)"
        >
          Previous
        </button>
        <span class="text-sm text-gray-600 dark:text-gray-400 font-sans">
          Page {{ emailStore.contactsPagination.current_page }} of
          {{ emailStore.contactsPagination.last_page }}
        </span>
        <button
          :disabled="
            emailStore.contactsPagination.current_page ===
            emailStore.contactsPagination.last_page
          "
          class="px-3 py-1 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-sans"
          @click="changePage(emailStore.contactsPagination.current_page + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Add/Edit Contact Modal -->
    <ContactModal
      v-if="showContactModal"
      :contact="selectedContact"
      @close="closeContactModal"
      @saved="handleContactSaved"
    />

    <!-- Import Modal -->
    <ImportContactsModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @imported="handleImported"
    />
  </div>
</template>

<script setup>
// ... (Logic remains identical to original)
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { debounce } from "lodash-es";
import ContactModal from "./ContactModal.vue";
import ImportContactsModal from "./ImportContactsModal.vue";

const emailStore = useEmailMarketingStore();
const $toast = useToast();

const searchQuery = ref("");
const listFilter = ref("");
const statusFilter = ref("");
const showImportModal = ref(false);
const showContactModal = ref(false);
const selectedContact = ref(null);
const showHelp = ref(false);

const getDisplayCustomFields = (customFields) => {
  if (!customFields) return {};
  const entries = Object.entries(customFields);
  return Object.fromEntries(entries.slice(0, 3));
};

const handleSearch = debounce(() => {
  emailStore.setContactsFilter("search", searchQuery.value);
}, 500);

const handleFilterChange = () => {
  emailStore.setContactsFilter("list_id", listFilter.value);
  emailStore.setContactsFilter("status", statusFilter.value);
};

const changePage = (page) => {
  if (page < 1 || page > emailStore.contactsPagination.last_page) return;
  emailStore.contactsPagination.current_page = page;
  emailStore.fetchContacts();
};

const openAddModal = () => {
  selectedContact.value = null;
  showContactModal.value = true;
};

const editContact = (contact) => {
  selectedContact.value = contact;
  showContactModal.value = true;
};

const closeContactModal = () => {
  showContactModal.value = false;
  selectedContact.value = null;
};

const handleContactSaved = () => {
  closeContactModal();
  emailStore.fetchContacts();
  $toast.success("Contact saved successfully");
};

const deleteContact = async (contact) => {
  if (!confirm(`Delete ${contact.email}?`)) return;

  try {
    await emailStore.deleteContact(contact.id);
    $toast.success("Contact deleted");
  } catch (error) {
    $toast.error("Failed to delete contact");
  }
};

const exportContacts = async () => {
  try {
    const data = await emailStore.exportContacts(listFilter.value);
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.json";
    a.click();
    $toast.success("Contacts exported");
  } catch (error) {
    $toast.error("Failed to export contacts");
  }
};

const handleImported = () => {
  showImportModal.value = false;
  emailStore.fetchContacts();
  $toast.success("Contacts imported successfully");
};

onMounted(async () => {
  if (emailStore.lists.length === 0) {
    await emailStore.fetchLists();
  }
  await emailStore.fetchContacts();
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
