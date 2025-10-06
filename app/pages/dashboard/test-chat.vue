<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Test Your Chatbot</h1>
            <p class="text-gray-600 mt-2">
                Test your AI assistant here to see how it responds to questions based on your connected data.
            </p>
        </div>

        <!-- Chatbot Selection -->
        <div v-if="chatbotStore.loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F56D9]"></div>
            <span class="ml-2 text-gray-600">Loading chatbots...</span>
        </div>

        <div v-else-if="availableChatbots.length === 0" class="text-center py-12">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-lg mx-auto">
                <h3 class="text-lg font-medium text-yellow-800 mb-2">No Chatbots Found</h3>
                <p class="text-yellow-700 mb-4">
                    You need to create a chatbot first before you can test it.
                </p>
                <NuxtLink to="/dashboard/chatbot-setup"
                    class="inline-flex items-center px-4 py-2 bg-[#7F56D9] text-white rounded-lg hover:bg-purple-700">
                    Create Your First Chatbot
                </NuxtLink>
            </div>
        </div>

        <div v-else class="space-y-6">
            <!-- Chatbot Selector -->
            <div v-if="availableChatbots.length > 1" class="bg-white p-4 rounded-lg shadow-sm">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Select Chatbot to Test
                </label>
                <select v-model="selectedChatbotId"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option v-for="chatbot in availableChatbots" :key="chatbot.id" :value="chatbot.id">
                        {{ chatbot.name }} ({{ chatbot.type || 'general' }})
                    </option>
                </select>
            </div>

            <!-- Status Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <h4 class="font-medium text-gray-900">Chatbot Status</h4>
                    <p class="text-sm text-gray-600 mt-1">
                        {{ selectedChatbot?.is_active ? '✅ Active' : '⚠️ Inactive' }}
                    </p>
                </div>

                <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <h4 class="font-medium text-gray-900">Data Sources</h4>
                    <p class="text-sm text-gray-600 mt-1">
                        {{ connectedDatabases }} connected
                    </p>
                </div>

                <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <h4 class="font-medium text-gray-900">Model</h4>
                    <p class="text-sm text-gray-600 mt-1">
                        Hugging Face LLM
                    </p>
                </div>
            </div>

            <!-- Chat Interface -->
            <div v-if="selectedChatbotId">
                <ChatWidget :chatbot-id="selectedChatbotId"
                    :chatbot-name="selectedChatbot?.name || 'AI Assistant'" />
            </div>

            <!-- Help Section -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 class="text-lg font-medium text-blue-900 mb-2">💡 Testing Tips</h3>
                <ul class="text-sm text-blue-800 space-y-1">
                    <li>• Ask questions related to your connected database data</li>
                    <li>• Try follow-up questions to test conversation memory</li>
                    <li>• Check if sources are properly cited in responses</li>
                    <li>• Test edge cases like questions outside your data scope</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChatWidget from '~/components/chatbot-setup/ChatWidget.vue'

definePageMeta({
    layout: 'dashboard'
})

const chatbotStore = useChatbotStore()
const databaseStore = useDatabaseStore()

const selectedChatbotId = ref('')

// Computed properties
const availableChatbots = computed(() => chatbotStore.chatbots || [])

const selectedChatbot = computed(() => {
    return availableChatbots.value.find(bot => bot.id === selectedChatbotId.value)
})

const connectedDatabases = computed(() => {
    return databaseStore.connections?.filter(conn => conn.status === 'connected').length || 0
})

// Auto-select first chatbot
const autoSelectChatbot = () => {
    if (availableChatbots.value.length > 0 && !selectedChatbotId.value) {
        selectedChatbotId.value = availableChatbots.value[0].id
    }
}

// Initialize
onMounted(async () => {
    try {
        await Promise.all([
            chatbotStore.fetchChatbots(),
            databaseStore.fetchConnections()
        ])
        autoSelectChatbot()
    } catch (error) {
        console.error('Error loading data:', error)
    }
})
</script>