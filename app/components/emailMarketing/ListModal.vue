<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-gray-900">
                    {{ isEditing ? 'Edit List' : 'Create List' }}
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
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">List Name *</label>
                    <input v-model="formData.name" type="text" placeholder="e.g., Newsletter Subscribers"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea v-model="formData.description" rows="3" placeholder="Brief description of this list..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-blue-900 mb-2">💡 Tip</h4>
                    <p class="text-sm text-blue-700">
                        Lists help you organize contacts into groups for targeted campaigns. You can add contacts to
                        this list after creating it.
                    </p>
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
                    {{ isEditing ? 'Update' : 'Create' }} List
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
    list: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'saved'])

const emailStore = useEmailMarketingStore()
const $toast = useToast()

const formData = ref({
    name: '',
    description: ''
})

const isEditing = computed(() => !!props.list)
const canSave = computed(() => formData.value.name.trim().length > 0)

const save = async () => {
    if (!canSave.value) return

    try {
        if (isEditing.value) {
            await emailStore.updateList(props.list.id, formData.value)
        } else {
            await emailStore.createList(formData.value)
        }

        emit('saved')
    } catch (error) {
        $toast.error(error.response?.data?.message || 'Failed to save list')
    }
}

onMounted(() => {
    if (isEditing.value) {
        Object.assign(formData.value, props.list)
    }
})
</script>