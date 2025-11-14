<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
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
                <!-- Basic Fields Section -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Basic Information
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                First Name *
                            </label>
                            <input v-model="formData.first_name" type="text" placeholder="John"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input v-model="formData.last_name" type="text" placeholder="Doe"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <input v-model="formData.email" type="email" placeholder="john@example.com"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input v-model="formData.phone" type="tel" placeholder="+1 234 567 8900"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                    </div>

                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email List *</label>
                        <select v-model="formData.list_id" @change="loadAvailableFields"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required>
                            <option value="">Select a list...</option>
                            <option v-for="list in emailStore.lists" :key="list.id" :value="list.id">
                                {{ list.name }}
                            </option>
                        </select>
                    </div>

                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input v-model="tagsInput" type="text" placeholder="e.g., vip, newsletter, customer"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <div v-if="parsedTags.length > 0" class="flex flex-wrap gap-2 mt-2">
                            <span v-for="tag in parsedTags" :key="tag"
                                class="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                                {{ tag }}
                            </span>
                        </div>
                    </div>

                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select v-model="formData.status"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="active">Active</option>
                            <option value="unsubscribed">Unsubscribed</option>
                            <option value="bounced">Bounced</option>
                        </select>
                    </div>
                </div>

                <!-- Custom Fields Section -->
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            Custom Fields
                        </h3>
                        <button @click="addCustomField" type="button"
                            class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            Add Field
                        </button>
                    </div>

                    <!-- Show available fields from list -->
                    <div v-if="availableCustomFields.length > 0" class="mb-4 p-4 bg-blue-50 rounded-lg">
                        <p class="text-sm text-blue-900 font-medium mb-2">
                            💡 Available fields in this list:
                        </p>
                        <div class="flex flex-wrap gap-2">
                            <button v-for="field in availableCustomFields" :key="field" @click="quickAddField(field)"
                                type="button"
                                class="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors">
                                + {{ field }}
                            </button>
                        </div>
                    </div>

                    <!-- Custom fields list -->
                    <div v-if="customFieldsList.length > 0" class="space-y-3">
                        <div v-for="(field, index) in customFieldsList" :key="index"
                            class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div class="flex-1 grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 mb-1">
                                        Field Name
                                    </label>
                                    <input v-model="field.key" type="text" placeholder="e.g., Company"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 mb-1">
                                        Value
                                    </label>
                                    <input v-model="field.value" type="text" placeholder="e.g., Acme Corp"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                            </div>
                            <button @click="removeCustomField(index)" type="button"
                                class="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Remove field">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Empty state -->
                    <div v-else class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <p class="text-gray-600 text-sm mb-2">No custom fields added yet</p>
                        <p class="text-gray-500 text-xs">
                            Add custom fields like Company, Job Title, Industry, etc.
                        </p>
                    </div>
                </div>

                <!-- Info box -->
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div class="flex gap-3">
                        <svg class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        @verbatim
                        <div class="flex-1">
                            <h4 class="text-sm font-medium text-purple-900 mb-1">About Custom Fields</h4>

                            <p class="text-sm text-purple-700">
                                Custom fields allow you to store any additional information about contacts.
                                You can add fields like Company, Job Title, Industry, Location, etc.
                                These fields can be used in email personalization with
                                <code class="bg-purple-100 px-1 rounded">{{ field_name }}</code>
                            </p>
                        </div>
                        @endverbatim

                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button @click="$emit('close')" class="px-6 py-2 text-gray-600 hover:text-gray-900">
                    Cancel
                </button>
                <button @click="save" :disabled="!canSave || saving" :class="[
                    'px-6 py-2 rounded-lg font-medium',
                    canSave && !saving
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]">
                    {{ saving ? 'Saving...' : (isEditing ? 'Update Contact' : 'Add Contact') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
    list_id: '',
    status: 'active',
    tags: [],
    custom_fields: {}
})

const tagsInput = ref('')
const customFieldsList = ref([]) // Array of {key: '', value: ''} objects
const availableCustomFields = ref([])
const saving = ref(false)

const isEditing = computed(() => !!props.contact)

const canSave = computed(() => {
    return formData.value.first_name &&
        formData.value.email &&
        formData.value.list_id
})

const parsedTags = computed(() => {
    if (!tagsInput.value) return []
    return tagsInput.value
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
})

// Load available custom fields from other contacts in the same list
const loadAvailableFields = async () => {
    if (!formData.value.list_id) {
        availableCustomFields.value = []
        return
    }

    try {
        await emailStore.fetchCustomFields(formData.value.list_id)

        // Filter out fields already in use
        const usedKeys = customFieldsList.value.map(f => f.key.toLowerCase())
        availableCustomFields.value = emailStore.customFields.filter(
            field => !usedKeys.includes(field.toLowerCase())
        )
    } catch (error) {
        console.error('Error loading custom fields:', error)
    }
}

// Add a new empty custom field
const addCustomField = () => {
    customFieldsList.value.push({
        key: '',
        value: ''
    })
}

// Quick add from available fields
const quickAddField = (fieldName) => {
    customFieldsList.value.push({
        key: fieldName,
        value: ''
    })

    // Remove from available list
    availableCustomFields.value = availableCustomFields.value.filter(
        f => f !== fieldName
    )
}

// Remove a custom field
const removeCustomField = (index) => {
    const removedField = customFieldsList.value[index]
    customFieldsList.value.splice(index, 1)

    // Add back to available if it was from the list
    if (removedField.key && emailStore.customFields.includes(removedField.key)) {
        availableCustomFields.value.push(removedField.key)
        availableCustomFields.value.sort()
    }
}

// Convert customFieldsList array to custom_fields object
const buildCustomFieldsObject = () => {
    const obj = {}
    customFieldsList.value.forEach(field => {
        if (field.key && field.value) {
            obj[field.key] = field.value
        }
    })
    return obj
}

// Convert custom_fields object to customFieldsList array
const loadCustomFieldsToList = (customFields) => {
    if (!customFields || typeof customFields !== 'object') return

    customFieldsList.value = Object.entries(customFields).map(([key, value]) => ({
        key,
        value
    }))
}

const save = async () => {
    if (!canSave.value) return

    saving.value = true

    try {
        // Parse tags
        formData.value.tags = parsedTags.value

        // Build custom fields object from list
        formData.value.custom_fields = buildCustomFieldsObject()

        if (isEditing.value) {
            await emailStore.updateContact(props.contact.id, formData.value)
        } else {
            await emailStore.createContact(formData.value)
        }

        emit('saved')
    } catch (error) {
        $toast.error(error.response?.data?.message || 'Failed to save contact')
    } finally {
        saving.value = false
    }
}

// Watch list change to reload available fields
watch(() => formData.value.list_id, () => {
    loadAvailableFields()
})

onMounted(async () => {
    if (isEditing.value) {
        Object.assign(formData.value, props.contact)
        tagsInput.value = props.contact.tags?.join(', ') || ''

        // Load custom fields to the list
        loadCustomFieldsToList(props.contact.custom_fields)

        // Load available fields for this list
        if (formData.value.list_id) {
            await loadAvailableFields()
        }
    }

    if (emailStore.lists.length === 0) {
        await emailStore.fetchLists()
    }
})
</script>