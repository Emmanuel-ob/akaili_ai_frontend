<template>
    <div class="relative">
        <button @click="isOpen = !isOpen"
            class="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
            <div class="flex-1 text-left">
                <div class="text-sm font-medium text-white">
                    {{ currentBusiness?.company_name || 'Select Business' }}
                </div>
                <div v-if="currentBusiness?.is_owner" class="text-xs text-gray-400">
                    Owner
                </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': isOpen }" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <!-- Dropdown -->
        <div v-if="isOpen"
            class="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
            <div class="p-2 space-y-1">
                <button v-for="business in businesses" :key="business.id" @click="selectBusiness(business.id)"
                    class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 transition-colors" :class="{
                        'bg-purple-900/30 border border-purple-700': business.id === currentBusinessId
                    }">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-medium text-white">
                                {{ business.company_name }}
                            </div>
                            <div class="text-xs text-gray-400">
                                {{ business.industry }}
                            </div>
                        </div>
                        <div v-if="business.is_owner" class="text-xs px-2 py-1 bg-purple-600 text-white rounded">
                            Owner
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <!-- Overlay -->
        <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40" />
    </div>
</template>

<script setup>
import { useBusinessStore } from '~/stores/businessStore'

const businessStore = useBusinessStore()
const isOpen = ref(false)

const businesses = computed(() => businessStore.businesses)
const currentBusinessId = computed(() => businessStore.currentBusinessId)
const currentBusiness = computed(() =>
    businesses.value.find(b => b.id === currentBusinessId.value)
)

const selectBusiness = async (businessId) => {
    if (businessId === currentBusinessId.value) {
        isOpen.value = false
        return
    }

    const result = await businessStore.switchBusiness(businessId)

    if (result.success) {
        isOpen.value = false
        // Reload page to refresh all data with new business context
        window.location.reload()
    }
}

// Load businesses on mount
onMounted(async () => {
    await businessStore.fetchAllBusinesses()
})
</script>