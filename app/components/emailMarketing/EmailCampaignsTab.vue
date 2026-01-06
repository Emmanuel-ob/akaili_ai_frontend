<!-- EmailCampaignsTab.vue -->
<template>
    <div>
        <!-- Header Actions -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <!-- Filters -->
            <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input v-model="searchQuery" type="text" placeholder="Search campaigns..."
                    class="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors" />
                
                <select v-model="statusFilter"
                    class="w-full sm:w-40 px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sending">Sending</option>
                    <option value="sent">Sent</option>
                    <option value="paused">Paused</option>
                </select>
            </div>

            <!-- Action Button -->
            <button @click="createNewCampaign"
                class="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                New Campaign
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="emailStore.campaignsLoading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredCampaigns.length === 0 && !searchQuery && !statusFilter" class="text-center py-12">
            <div class="bg-purple-50 dark:bg-purple-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No campaigns yet</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Create your first email campaign to get started</p>
            <button @click="createNewCampaign"
                class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Create Campaign
            </button>
        </div>

        <!-- Campaigns List -->
        <div v-else class="space-y-4">
            <div v-for="campaign in filteredCampaigns" :key="campaign.id"
                class="bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600 transition-all p-4 sm:p-6 shadow-sm dark:shadow-none">
                <div class="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div class="flex-1 w-full">
                        <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">{{ campaign.name }}</h3>
                            <span :class="[
                                'px-2.5 py-0.5 rounded-full text-xs font-medium',
                                getStatusBadgeClass(campaign.status)
                            ]">
                                {{ formatStatus(campaign.status) }}
                            </span>
                            <span v-if="!campaign.is_complete"
                                class="px-2.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                                Incomplete
                            </span>
                        </div>

                        <p v-if="campaign.description" class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                            {{ campaign.description }}
                        </p>

                        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                                </svg>
                                <span class="truncate max-w-[150px]">{{ campaign.list_name || 'No list' }}</span>
                            </div>

                            <div v-if="campaign.send_date" class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{{ formatDate(campaign.send_date) }}</span>
                            </div>

                            <div v-if="campaign.stats" class="flex flex-wrap items-center gap-4">
                                <span>📤 {{ campaign.stats.sent || 0 }} sent</span>
                                <span>📬 {{ campaign.open_rate }}% opens</span>
                                <span>🖱️ {{ campaign.click_rate }}% clicks</span>
                            </div>
                        </div>

                        <!-- Warning for incomplete campaigns -->
                        <div v-if="!campaign.is_complete && campaign.missing_fields?.length"
                            class="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                            <p class="text-sm text-yellow-800 dark:text-yellow-300 font-medium mb-1">Missing required fields:</p>
                            <p class="text-sm text-yellow-700 dark:text-yellow-400">{{ campaign.missing_fields.join(', ') }}</p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 overflow-x-auto pb-1 md:pb-0">
                        <!-- Analytics -->
                        <button v-if="campaign.status === 'sent'" @click="viewAnalytics(campaign)"
                            class="px-3 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
                            title="View Analytics">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Analytics
                        </button>

                        <!-- Edit -->
                        <button v-if="campaign.can_edit" @click="editCampaign(campaign)"
                            class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-gray-200 dark:border-slate-700" title="Edit">
                            Edit
                        </button>

                        <!-- Pause -->
                        <button v-if="campaign.status === 'sending'" @click="pauseCampaign(campaign)"
                            :disabled="actionLoading[campaign.id]"
                            class="px-3 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg disabled:opacity-50 transition-colors border border-orange-200 dark:border-orange-800"
                            title="Pause">
                            <div v-if="actionLoading[campaign.id]"
                                class="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 dark:border-orange-400"></div>
                            <span v-else>Pause</span>
                        </button>

                        <!-- Resume -->
                        <button v-if="campaign.status === 'paused'" @click="resumeCampaign(campaign)"
                            :disabled="actionLoading[campaign.id]"
                            class="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-1 disabled:opacity-50 transition-colors whitespace-nowrap"
                            title="Resume Campaign">
                            <div v-if="actionLoading[campaign.id]"
                                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <template v-else>
                                Resume
                            </template>
                        </button>

                        <!-- Send -->
                        <button v-if="campaign.can_send" @click="sendCampaign(campaign)"
                            :disabled="actionLoading[campaign.id]"
                            class="px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg flex items-center gap-1 disabled:opacity-50 transition-colors whitespace-nowrap"
                            title="Send Now">
                            <div v-if="actionLoading[campaign.id]"
                                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <template v-else>
                                Send
                            </template>
                        </button>

                        <!-- Delete -->
                        <button v-if="campaign.can_edit" @click="deleteCampaign(campaign)"
                            :disabled="actionLoading[campaign.id]"
                            class="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 transition-colors border border-red-200 dark:border-red-900"
                            title="Delete">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals (Unchanged) -->
        <CampaignEditorModal v-if="showEditorModal" :campaign="selectedCampaign" @close="closeEditor"
            @saved="handleCampaignSaved" />
        <CampaignAnalyticsModal v-if="showAnalyticsModal" :campaign="selectedCampaign"
            @close="showAnalyticsModal = false" />
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import CampaignEditorModal from './CampaignEditorModal.vue'
import CampaignAnalyticsModal from './CampaignAnalyticsModal.vue'
import { useToast } from 'vue-toastification'

const emailStore = useEmailMarketingStore()
const $toast = useToast()

const searchQuery = ref('')
const statusFilter = ref('')
const showEditorModal = ref(false)
const showAnalyticsModal = ref(false)
const selectedCampaign = ref(null)
const actionLoading = reactive({})

const filteredCampaigns = computed(() => {
    let campaigns = emailStore.campaigns

    if (searchQuery.value) {
        campaigns = campaigns.filter(c =>
            c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            c.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }

    if (statusFilter.value) {
        campaigns = campaigns.filter(c => c.status === statusFilter.value)
    }

    return campaigns
})

const createNewCampaign = () => {
    selectedCampaign.value = null
    showEditorModal.value = true
}

const editCampaign = (campaign) => {
    selectedCampaign.value = campaign
    showEditorModal.value = true
}

const closeEditor = () => {
    showEditorModal.value = false
    selectedCampaign.value = null
}

const handleCampaignSaved = () => {
    closeEditor()
    emailStore.fetchCampaigns()
    $toast.success('Campaign saved successfully')
}

const sendCampaign = async (campaign) => {
    if (!confirm(`Are you sure you want to send "${campaign.name}" now?`)) return
    actionLoading[campaign.id] = true
    try {
        await emailStore.sendCampaign(campaign.id)
        $toast.success(`Campaign "${campaign.name}" is being sent`)
        await emailStore.fetchCampaigns()
    } catch (error) {
        $toast.error(error?.response?.data?.message || 'Failed to send campaign')
    } finally {
        actionLoading[campaign.id] = false
    }
}

const pauseCampaign = async (campaign) => {
    if (!confirm(`Pause "${campaign.name}"?`)) return
    actionLoading[campaign.id] = true
    try {
        await emailStore.pauseCampaign(campaign.id)
        $toast.success('Campaign paused')
        await emailStore.fetchCampaigns()
    } catch (error) {
        $toast.error('Failed to pause campaign')
    } finally {
        actionLoading[campaign.id] = false
    }
}

const resumeCampaign = async (campaign) => {
    if (!confirm(`Resume sending "${campaign.name}"?`)) return
    actionLoading[campaign.id] = true
    try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        await $fetch(`${config.public.apiBase}/api/email/campaigns/${campaign.id}/resume`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authStore.token}`,
                'Content-Type': 'application/json'
            },
            body: { send_immediately: true }
        })
        $toast.success('Campaign resumed and sending')
        await emailStore.fetchCampaigns()
    } catch (error) {
        $toast.error('Failed to resume campaign')
    } finally {
        actionLoading[campaign.id] = false
    }
}

const deleteCampaign = async (campaign) => {
    if (!confirm(`Delete "${campaign.name}"? This cannot be undone.`)) return
    actionLoading[campaign.id] = true
    try {
        await emailStore.deleteCampaign(campaign.id)
        $toast.success('Campaign deleted')
    } catch (error) {
        $toast.error('Failed to delete campaign')
    } finally {
        delete actionLoading[campaign.id]
    }
}

const viewAnalytics = (campaign) => {
    selectedCampaign.value = campaign
    showAnalyticsModal.value = true
}

const getStatusBadgeClass = (status) => {
    const classes = {
        draft: 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300',
        scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        sending: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
        sent: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        paused: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
    }
    return classes[status] || 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
}

const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
}
</script>