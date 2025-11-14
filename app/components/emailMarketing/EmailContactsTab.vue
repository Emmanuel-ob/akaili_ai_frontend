<template>
    <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
                <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="Search contacts..."
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <select v-model="listFilter" @change="handleFilterChange"
                    class="px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="">All Lists</option>
                    <option v-for="list in emailStore.lists" :key="list.id" :value="list.id">
                        {{ list.name }}
                    </option>
                </select>
                <select v-model="statusFilter" @change="handleFilterChange"
                    class="px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                    <option value="bounced">Bounced</option>
                </select>
            </div>
            <div class="flex items-center gap-2">
                <button @click="showHelp = !showHelp"
                    class="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
                    {{ showHelp ? 'Hide' : 'Show' }} Help
                </button>
                <button @click="showImportModal = true"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Import
                </button>
                <button @click="exportContacts" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Export
                </button>
                <button @click="openAddModal" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Add Contact
                </button>
            </div>
        </div>

        <!-- Help Section (Collapsible) -->
        <transition name="slide-down">
            <div v-if="showHelp" class="mb-6">
                <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
                    <div class="flex items-start gap-4">
                        <div class="p-3 bg-blue-100 rounded-lg">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">Custom Fields Guide</h3>

                            <div class="grid md:grid-cols-2 gap-4">
                                <!-- Manual Entry -->
                                <div class="bg-white rounded-lg p-4 shadow-sm">
                                    <h4 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <span class="text-2xl">✍️</span>
                                        Manual Entry
                                    </h4>
                                    <p class="text-sm text-gray-600 mb-2">
                                        Click "Add Contact" and use "Add Field" button to create custom fields like:
                                    </p>
                                    <div class="space-y-1 text-sm">
                                        <div class="flex items-center gap-2">
                                            <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                                            <span>Company → Acme Corp</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                                            <span>Job Title → CEO</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                                            <span>Industry → Technology</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- CSV Import -->
                                <div class="bg-white rounded-lg p-4 shadow-sm">
                                    <h4 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <span class="text-2xl">📊</span>
                                        CSV Import
                                    </h4>
                                    <p class="text-sm text-gray-600 mb-2">
                                        Extra columns automatically become custom fields:
                                    </p>
                                    <div class="bg-gray-50 rounded p-2 font-mono text-xs overflow-x-auto">
                                        <div class="text-gray-500">email, name, Company, Title</div>
                                        <div class="text-gray-700">john@ex.com, John, Acme, CEO</div>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-2">
                                        → Company and Title saved as custom fields ✓
                                    </p>
                                </div>

                                <!-- Email Personalization -->
                                <div class="bg-white rounded-lg p-4 shadow-sm">
                                    <h4 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <span class="text-2xl">💌</span>
                                        Email Usage
                                    </h4>
                                    <p class="text-sm text-gray-600 mb-2">
                                        Use custom fields in email templates:
                                    </p>
                                    @verbatim
                                    <div class="bg-purple-50 rounded p-2 text-sm">
                                        <code class="text-purple-700">Hi {{ first_name }}</code><br>
                                        <code class="text-purple-700">from {{ Company }}</code>
                                    </div>
                                    @endverbatim

                                </div>

                                <!-- Common Fields -->
                                <div class="bg-white rounded-lg p-4 shadow-sm">
                                    <h4 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <span class="text-2xl">💡</span>
                                        Popular Fields
                                    </h4>
                                    <div class="grid grid-cols-2 gap-1 text-sm text-gray-700">
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
        <div v-if="emailStore.contactsLoading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="emailStore.contacts.length === 0" class="text-center py-12">
            <div class="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No contacts yet</h3>
            <p class="text-gray-600 mb-4">Add your first contact or import from CSV</p>
            <div class="flex items-center justify-center gap-3">
                <button @click="showImportModal = true"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Import Contacts
                </button>
                <button @click="openAddModal" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Add Contact
                </button>
            </div>
        </div>

        <!-- Contacts Table -->
        <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            List
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Custom Fields
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tags
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="contact in emailStore.contacts" :key="contact.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <div>
                                <p class="font-medium text-gray-900">{{ contact.first_name }} {{ contact.last_name }}
                                </p>
                                <p class="text-sm text-gray-600">{{ contact.email }}</p>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">
                            {{ contact.list_name }}
                        </td>
                        <td class="px-6 py-4">
                            <div v-if="contact.custom_fields && Object.keys(contact.custom_fields).length > 0"
                                class="flex flex-wrap gap-1">
                                <span v-for="(value, key) in getDisplayCustomFields(contact.custom_fields)" :key="key"
                                    class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                                    :title="`${key}: ${value}`">
                                    {{ key }}
                                </span>
                                <span v-if="Object.keys(contact.custom_fields).length > 3"
                                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    +{{ Object.keys(contact.custom_fields).length - 3 }} more
                                </span>
                            </div>
                            <span v-else class="text-sm text-gray-400">No custom fields</span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex flex-wrap gap-1">
                                <span v-for="tag in contact.tags?.slice(0, 2)" :key="tag"
                                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    {{ tag }}
                                </span>
                                <span v-if="contact.tags?.length > 2"
                                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    +{{ contact.tags.length - 2 }}
                                </span>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span
                                :class="['px-2 py-1 text-xs font-medium rounded-full',contact.status === 'active' ? 'bg-green-100 text-green-700' : contact.status === 'unsubscribed' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700']">
                                {{ contact.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <button @click="editContact(contact)" class="text-purple-600 hover:text-purple-800">
                                    Edit
                                </button>
                                <button @click="deleteContact(contact)" class="text-red-600 hover:text-red-800">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="emailStore.contacts.length > 0" class="mt-4 flex items-center justify-between">
            <p class="text-sm text-gray-600">
                Showing {{ emailStore.contacts.length }} of {{ emailStore.contactsPagination.total }} contacts
            </p>
            <div class="flex items-center gap-2">
                <button @click="changePage(emailStore.contactsPagination.current_page - 1)"
                    :disabled="emailStore.contactsPagination.current_page === 1"
                    class="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                    Previous
                </button>
                <span class="text-sm text-gray-600">
                    Page {{ emailStore.contactsPagination.current_page }} of {{
                    emailStore.contactsPagination.last_page }}
                </span>
                <button @click="changePage(emailStore.contactsPagination.current_page + 1)"
                    :disabled="emailStore.contactsPagination.current_page === emailStore.contactsPagination.last_page"
                    class="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                    Next
                </button>
            </div>
        </div>

        <!-- Add/Edit Contact Modal -->
        <ContactModal v-if="showContactModal" :contact="selectedContact" @close="closeContactModal"
            @saved="handleContactSaved" />

        <!-- Import Modal -->
        <ImportContactsModal v-if="showImportModal" @close="showImportModal = false" @imported="handleImported" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { debounce } from 'lodash-es'
import ContactModal from './ContactModal.vue'
import ImportContactsModal from './ImportContactsModal.vue'

const emailStore = useEmailMarketingStore()
const $toast = useToast()

const searchQuery = ref('')
const listFilter = ref('')
const statusFilter = ref('')
const showImportModal = ref(false)
const showContactModal = ref(false)
const selectedContact = ref(null)
const showHelp = ref(false)

// Get first 3 custom fields for display
const getDisplayCustomFields = (customFields) => {
    if (!customFields) return {}
    const entries = Object.entries(customFields)
    return Object.fromEntries(entries.slice(0, 3))
}

// Debounced search
const handleSearch = debounce(() => {
    emailStore.setContactsFilter('search', searchQuery.value)
}, 500)

const handleFilterChange = () => {
    emailStore.setContactsFilter('list_id', listFilter.value)
    emailStore.setContactsFilter('status', statusFilter.value)
}

const changePage = (page) => {
    if (page < 1 || page > emailStore.contactsPagination.last_page) return
    emailStore.contactsPagination.current_page = page
    emailStore.fetchContacts()
}

const openAddModal = () => {
    selectedContact.value = null
    showContactModal.value = true
}

const editContact = (contact) => {
    selectedContact.value = contact
    showContactModal.value = true
}

const closeContactModal = () => {
    showContactModal.value = false
    selectedContact.value = null
}

const handleContactSaved = () => {
    closeContactModal()
    emailStore.fetchContacts()
    $toast.success('Contact saved successfully')
}

const deleteContact = async (contact) => {
    if (!confirm(`Delete ${contact.email}?`)) return

    try {
        await emailStore.deleteContact(contact.id)
        $toast.success('Contact deleted')
    } catch (error) {
        $toast.error('Failed to delete contact')
    }
}

const exportContacts = async () => {
    try {
        const data = await emailStore.exportContacts(listFilter.value)
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'contacts.json'
        a.click()
        $toast.success('Contacts exported')
    } catch (error) {
        $toast.error('Failed to export contacts')
    }
}

const handleImported = () => {
    showImportModal.value = false
    emailStore.fetchContacts()
    $toast.success('Contacts imported successfully')
}

onMounted(async () => {
    if (emailStore.lists.length === 0) {
        await emailStore.fetchLists()
    }
    await emailStore.fetchContacts()
})
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