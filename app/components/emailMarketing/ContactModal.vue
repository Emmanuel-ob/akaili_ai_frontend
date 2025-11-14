<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-gray-900">
                    {{ isEditing ? 'Edit Contact' : 'Add Contact' }}
                </h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input v-model="formData.first_name" type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input v-model="formData.last_name" type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input v-model="formData.email" type="email"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email List *</label>
                    <select v-model="formData.list_id"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required>
                        <option value="">Select a list...</option>
                        <option v-for="list in emailStore.lists" :key="list.id" :value="list.id">
                            {{ list.name }}
                        </option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input v-model="formData.phone" type="tel"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <input v-model="formData.company_name" type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                    <input v-model="tagsInput" type="text" placeholder="e.g., vip, newsletter, customer"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select v-model="formData.status"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="active">Active</option>
                        <option value="unsubscribed">Unsubscribed</option>
                        <option value="bounced">Bounced</option>
                    </select>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button @click="$emit('close')" class="px-6 py-2 text-gray-600 hover:text-gray-900">
                    Cancel
                </button>
                <button @click="save" :disabled="!canSave" :class="[
                    'px-6 py-2 rounded-lg font-medium',
                    canSave
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]">
                    {{ isEditing ? 'Update' : 'Add' }} Contact
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
    contact: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'saved'])

const emailStore = useEmailMarketingStore()
const $toast = useToast()

const formData = ref({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    list_id: '',
    status: 'active',
    tags: []
})

const tagsInput = ref('')

const isEditing = computed(() => !!props.contact)
const canSave = computed(() => {
    return formData.value.first_name &&
        formData.value.email &&
        formData.value.list_id
})

const save = async () => {
    if (!canSave.value) return

    try {
        // Parse tags
        formData.value.tags = tagsInput.value
            .split(',')
            .map(t => t.trim())
            .filter(Boolean)

        if (isEditing.value) {
            await emailStore.updateContact(props.contact.id, formData.value)
        } else {
            await emailStore.createContact(formData.value)
        }

        emit('saved')
    } catch (error) {
        $toast.error(error.response?.data?.message || 'Failed to save contact')
    }
}

onMounted(() => {
    if (isEditing.value) {
        Object.assign(formData.value, props.contact)
        tagsInput.value = props.contact.tags?.join(', ') || ''
    }

    if (emailStore.lists.length === 0) {
        emailStore.fetchLists()
    }
})
</script>