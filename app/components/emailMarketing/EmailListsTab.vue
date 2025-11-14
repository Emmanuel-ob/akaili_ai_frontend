<template>
    <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <input v-model="searchQuery" type="text" placeholder="Search lists..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <button @click="openCreateModal" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Create List
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="emailStore.listsLoading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredLists.length === 0 && !searchQuery" class="text-center py-12">
            <div class="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No lists yet</h3>
            <p class="text-gray-600 mb-4">Create your first email list to organize your contacts</p>
            <button @click="openCreateModal" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Create List
            </button>
        </div>

        <!-- Lists Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="list in filteredLists" :key="list.id"
                class="bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition-all">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ list.name }}</h3>
                <p v-if="list.description" class="text-sm text-gray-600 mb-4">{{ list.description }}</p>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-600">Total</p>
                        <p class="text-2xl font-bold text-gray-900">{{ list.total_subscribers }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Active</p>
                        <p class="text-2xl font-bold text-green-600">{{ list.active_subscribers }}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button @click="editList(list)"
                        class="flex-1 px-3 py-2 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50">
                        Edit
                    </button>
                    <button @click="deleteList(list)"
                        class="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50">
                        Delete
                    </button>
                </div>
            </div>
        </div>

        <!-- List Modal -->
        <ListModal v-if="showListModal" :list="selectedList" @close="closeListModal" @saved="handleListSaved" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import ListModal from './ListModal.vue'

const emailStore = useEmailMarketingStore()
const $toast = useToast()

const searchQuery = ref('')
const showListModal = ref(false)
const selectedList = ref(null)

const filteredLists = computed(() => {
    if (!searchQuery.value) return emailStore.lists

    return emailStore.lists.filter(list =>
        list.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        list.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const openCreateModal = () => {
    selectedList.value = null
    showListModal.value = true
}

const editList = (list) => {
    selectedList.value = list
    showListModal.value = true
}

const closeListModal = () => {
    showListModal.value = false
    selectedList.value = null
}

const handleListSaved = () => {
    closeListModal()
    emailStore.fetchLists()
    $toast.success('List saved successfully')
}

const deleteList = async (list) => {
    if (!confirm(`Delete "${list.name}"? This will not delete the contacts.`)) return

    try {
        await emailStore.deleteList(list.id)
        $toast.success('List deleted')
    } catch (error) {
        $toast.error(error.response?.data?.message || 'Failed to delete list')
    }
}
</script>