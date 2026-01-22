<template>
    <div class="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div class="max-w-2xl w-full">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold mb-2">Select a Business</h1>
                <p class="text-gray-400">Choose which business you want to work with</p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
            </div>

            <!-- Business Cards -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button v-for="business in businesses" :key="business.id" class="p-6 bg-gray-900 border border-gray-700 rounded-lg hover:border-purple-500 transition-all text-left group"
                    @click="selectBusiness(business.id)">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <h3 class="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                                {{ business.company_name }}
                            </h3>
                            <p class="text-sm text-gray-400">{{ business.industry }}</p>
                        </div>
                        <span v-if="business.is_owner" class="px-2 py-1 text-xs bg-purple-600 text-white rounded">
                            Owner
                        </span>
                    </div>

                    <div class="text-xs text-gray-500">
                        Joined {{ formatDate(business.joined_at) }}
                    </div>
                </button>
            </div>

            <!-- No Businesses -->
            <div v-if="!loading && businesses.length === 0" class="text-center py-12">
                <p class="text-gray-400 mb-4">You don't belong to any business yet</p>
                <button class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors" @click="navigateTo('/dashboard/onboarding')">
                    Create Your Business
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useBusinessStore } from '~/stores/businessStore'

definePageMeta({
    layout: 'empty',
    middleware: 'auth'
})

const businessStore = useBusinessStore()
const router = useRouter()

const loading = ref(true)
const businesses = computed(() => businessStore.businesses)

const selectBusiness = async (businessId) => {
    const result = await businessStore.switchBusiness(businessId)

    if (result.success) {
        // UPDATED: Check localStorage for pending plan
        const pendingPlan = localStorage.getItem('pendingPlan')

        if (pendingPlan) {
            // Clear it and go to checkout
            localStorage.removeItem('pendingPlan')
            await navigateTo({ path: '/checkout', query: { plan: pendingPlan } })
        } else {
            await navigateTo('/dashboard')
        }
    }
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    })
}

onMounted(async () => {
    await businessStore.fetchAllBusinesses()
    loading.value = false
})
</script>