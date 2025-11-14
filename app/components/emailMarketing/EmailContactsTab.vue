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
                            <div class="flex flex-wrap gap-1">
                                <span v-for="tag in contact.tags?.slice(0, 3)" :key="tag"
                                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    {{ tag }}
                                </span>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span :class="[
                                'px-2 py-1 text-xs font-medium rounded-full',
                                contact.status === 'active' ? 'bg-green-100 text-green-700' :
                                    contact.status === 'unsubscribed' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                            ]">
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
        // Download CSV
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
    // Load lists first
    if (emailStore.lists.length === 0) {
        await emailStore.fetchLists()
    }

    // Always fetch contacts on mount (no filter required)
    await emailStore.fetchContacts()
})
</script>