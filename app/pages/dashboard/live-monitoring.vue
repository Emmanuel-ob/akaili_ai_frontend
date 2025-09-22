<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-2xl font-semibold text-gray-900">Conversations</h1>
                <p class="mt-2 text-sm text-gray-700">
                    Monitor and manage all conversations from your chatbots
                </p>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white shadow rounded-lg p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Source</label>
                    <select v-model="filters.source" @change="fetchConversations"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">All Sources</option>
                        <option value="test">Test (Dashboard)</option>
                        <option value="widget">Widget (Customer)</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Chatbot</label>
                    <select v-model="filters.chatbot_id" @change="fetchConversations"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">All Chatbots</option>
                        <option v-for="chatbot in availableChatbots" :key="chatbot.id" :value="chatbot.id">
                            {{ chatbot.name }}
                        </option>
                    </select>
                </div>

                <div class="flex items-end">
                    <button @click="refreshConversations"
                        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Conversations" :value="totalConversations" icon="chat" color="blue" />
            <StatCard title="Widget Conversations" :value="widgetConversations" icon="globe" color="green" />
            <StatCard title="Test Conversations" :value="testConversations" icon="beaker" color="purple" />
        </div>

        <!-- Conversations List -->
        <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Recent Conversations</h3>
            </div>

            <div v-if="conversationStore.loading" class="p-6 text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p class="mt-2 text-sm text-gray-500">Loading conversations...</p>
            </div>

            <div v-else-if="conversations.length === 0" class="p-6 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.468L3 21l2.532-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No conversations</h3>
                <p class="mt-1 text-sm text-gray-500">No conversations found with the current filters.</p>
            </div>

            <div v-else class="divide-y divide-gray-200">
                <div v-for="conversation in conversations" :key="conversation._id"
                    class="p-6 hover:bg-gray-50 cursor-pointer" @click="viewConversation(conversation)">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-1 text-xs font-medium rounded-full"
                                    :class="getSourceBadgeClass(conversation.source)">
                                    {{ conversation.source === 'test' ? 'Test' : 'Customer' }}
                                </span>
                                <span class="text-sm font-medium text-gray-900">
                                    {{ conversation.chatbot?.name || 'Unknown Chatbot' }}
                                </span>
                            </div>

                            <div class="mt-1">
                                <p class="text-sm text-gray-600">
                                    {{ getLastMessage(conversation) }}
                                </p>
                            </div>

                            <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                <span>{{ formatDate(conversation.last_activity) }}</span>
                                <span>{{ conversation.messages?.length || 0 }} messages</span>
                                <span v-if="conversation.customer_data?.email">
                                    {{ conversation.customer_data.email }}
                                </span>
                            </div>
                        </div>

                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Conversation Detail Modal -->
        <ConversationDetailModal v-if="selectedConversation" :conversation="selectedConversation"
            @close="selectedConversation = null" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
    layout: 'dashboard'
})

const conversationStore = useConversationStore()
const chatbotStore = useChatbotStore()

const filters = ref({
    source: '',
    chatbot_id: ''
})

const selectedConversation = ref(null)

// Computed properties
const conversations = computed(() => conversationStore.conversations)
const availableChatbots = computed(() => chatbotStore.chatbots)

const totalConversations = computed(() => conversations.value.length)
const widgetConversations = computed(() =>
    conversations.value.filter(c => c.source === 'widget').length
)
const testConversations = computed(() =>
    conversations.value.filter(c => c.source === 'test').length
)

// Methods
const fetchConversations = async () => {
    try {
        await conversationStore.fetchConversations(filters.value)
    } catch (error) {
        console.error('Error fetching conversations:', error)
    }
}

const refreshConversations = () => {
    fetchConversations()
}

const viewConversation = (conversation) => {
    selectedConversation.value = conversation
}

const getSourceBadgeClass = (source) => {
    return source === 'test'
        ? 'bg-purple-100 text-purple-800'
        : 'bg-green-100 text-green-800'
}

const getLastMessage = (conversation) => {
    const messages = conversation.messages || []
    if (messages.length === 0) return 'No messages'

    const lastMessage = messages[messages.length - 1]
    return lastMessage.message.length > 60
        ? lastMessage.message.substring(0, 60) + '...'
        : lastMessage.message
}

const formatDate = (date) => {
    return new Date(date).toLocaleString()
}

// Initialize
onMounted(async () => {
    try {
        await Promise.all([
            chatbotStore.fetchChatbots(),
            fetchConversations()
        ])
    } catch (error) {
        console.error('Error loading data:', error)
    }
})
</script>