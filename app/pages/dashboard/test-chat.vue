<!-- dashboard/test-chat.vue -->
<template>
    <div class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 p-6">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Test Your Chatbot</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
                Test your AI assistant here to see how it responds to questions based on your connected data.
            </p>
        </div>

        <!-- Chatbot Selection -->
        <div v-if="chatbotStore.loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9E4CFF]"></div>
            <span class="ml-2 text-gray-600 dark:text-gray-400">Loading chatbots...</span>
        </div>

        <div v-else-if="availableChatbots.length === 0" class="text-center py-12">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-lg mx-auto">
                <h3 class="text-lg font-medium text-yellow-800 mb-2">No Chatbots Found</h3>
                <p class="text-yellow-700 mb-4">
                    You need to create a chatbot first before you can test it here.
                </p>
                <NuxtLink to="/dashboard/chatbot-setup"
                    class="inline-flex items-center px-4 py-2 bg-[#9E4CFF] text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Create Your First Chatbot
                </NuxtLink>
            </div>
        </div>

        <div v-else class="space-y-6 max-w-5xl mx-auto">
            <!-- Controls Container -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Chatbot Selector -->
                <div class="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Chatbot to Test
                    </label>
                    <select v-model="selectedChatbotId"
                        class="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                        <option v-for="chatbot in availableChatbots" :key="chatbot.id" :value="chatbot.id">
                            {{ chatbot.name }} ({{ chatbot.type || 'general' }})
                        </option>
                    </select>
                </div>

                <!-- Test Mode Selector -->
                <div class="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Test Mode
                    </label>
                    <select v-model="testMode"
                        class="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                        <option value="default">Default (Authenticated as You)</option>
                        <option value="authenticated">Simulate Authenticated Customer</option>
                        <option value="anonymous">Simulate Anonymous User</option>
                    </select>

                    <!-- Customer Data Inputs (for Authenticated Mode) -->
                    <div v-if="testMode === 'authenticated'" class="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Customer ID</label>
                            <input v-model="testCustomerData.id" type="text" placeholder="e.g., cust_123"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Customer Name</label>
                            <input v-model="testCustomerData.name" type="text" placeholder="e.g., John Doe"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Customer Email</label>
                            <input v-model="testCustomerData.email" type="email" placeholder="e.g., john@example.com"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Status Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 border-l-4 border-l-blue-500">
                    <h4 class="font-semibold text-gray-900 dark:text-white">Chatbot Status</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {{ selectedChatbot?.is_active ? '✅ Active' : '⚠️ Inactive' }}
                    </p>
                </div>

                <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 border-l-4 border-l-green-500">
                    <h4 class="font-semibold text-gray-900 dark:text-white">Data Sources</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {{ connectedDatabases }} connected
                    </p>
                </div>

                <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 border-l-4 border-l-purple-500">
                    <h4 class="font-semibold text-gray-900 dark:text-white">Model</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Hugging Face LLM
                    </p>
                </div>
            </div>

            <!-- Chat Interface -->
            <div v-if="selectedChatbotId" class="mt-8">
                <ChatWidget :chatbot-id="selectedChatbotId" :chatbot-name="selectedChatbot?.name || 'AI Assistant'"
                    :test-mode="testMode"
                    :test-customer-data="testMode === 'authenticated' ? testCustomerData : null" />
            </div>

            <!-- Help Section -->
            <div class="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-6 mt-8">
                <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">💡 Testing Tips</h3>
                <ul class="text-sm text-blue-800 dark:text-blue-400 space-y-2">
                    <li>• Ask questions related to your connected database data</li>
                    <li>• Try follow-up questions to test conversation memory</li>
                    <li>• Check if sources are properly cited in responses</li>
                    <li>• Test edge cases like questions outside your data scope</li>
                    <li>• Switch test modes to simulate different user scenarios (e.g., authenticated vs. anonymous)</li>
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
const testMode = ref('default')
const testCustomerData = ref({ id: '', name: '', email: '' })

const availableChatbots = computed(() => chatbotStore.chatbots || [])

const selectedChatbot = computed(() => {
    return availableChatbots.value.find(bot => bot.id === selectedChatbotId.value)
})

const connectedDatabases = computed(() => {
    return databaseStore.connections?.filter(conn => conn.status === 'connected').length || 0
})

const autoSelectChatbot = () => {
    if (availableChatbots.value.length > 0 && !selectedChatbotId.value) {
        selectedChatbotId.value = availableChatbots.value[0].id
    }
}

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