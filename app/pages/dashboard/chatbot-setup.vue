<!-- dashboard/chatbot-setup.vue -->
<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        
        <!-- No Chatbot Warning -->
        <div v-if="!hasChatbot && !chatbotStore.loading" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 px-4 md:px-6 py-4 mb-6 mx-4 md:mx-6 mt-6 rounded-lg">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p class="text-yellow-800 dark:text-yellow-200 text-sm">
                    <strong>No chatbot found.</strong> Create your first chatbot by filling out the form below and
                    clicking "Create Chatbot".
                </p>
            </div>
        </div>

        <!-- Chatbot Selector -->
        <div v-if="chatbotStore.chatbots.length > 1 && !chatbotStore.loading"
            class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 px-4 md:px-6 py-4 mb-6 mx-4 md:mx-6 mt-6 rounded-lg">
            <label class="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Select Chatbot to Edit:
            </label>
            <select v-model="selectedChatbotId" @change="loadChatbotData"
                class="w-full px-4 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors">
                <option v-for="bot in chatbotStore.chatbots" :key="bot.id" :value="bot.id">
                    {{ bot.name }}
                </option>
            </select>
        </div>

        <header class="bg-white dark:bg-slate-900 px-4 md:px-6 py-5 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300 sticky top-0 z-20">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-[#9E4CFF] text-xl md:text-2xl font-bold">
                        {{ isEditing ? 'Edit Chatbot' : 'Create Chatbot' }}
                    </h1>
                    <p class="text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400 mt-1">
                        {{ isEditing ? 'Update your AI chatbot settings' : 'Configure and customize your new AI chatbot' }}
                    </p>
                </div>

                <div class="flex items-center space-x-4 w-full sm:w-auto">
                    <button @click="saveChanges" :disabled="chatbotStore.saving || chatbotStore.loading"
                        class="flex-1 sm:flex-none px-6 py-3 nav_primary_btn text-sm lg:text-base text-white rounded-xl shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-purple-500/30 font-medium">
                        {{ chatbotStore.saving ? 'Saving...' : (isEditing ? 'Update Chatbot' : 'Create Chatbot') }}
                    </button>
                </div>
            </div>
        </header>

        <!-- Tabs -->
        <div class="sticky top-[80px] z-10 bg-white dark:bg-slate-950 pb-2 pt-2 px-4 md:px-6 border-b border-gray-100 dark:border-slate-800/50 md:static md:border-0 md:p-0 md:bg-transparent md:mx-6 md:mb-8 md:mt-8">
             <div class="grid grid-cols-3 gap-2 text-center bg-gray-100 dark:bg-slate-900 p-1.5 rounded-xl border border-gray-200 dark:border-slate-800">
                <div v-for="tab in tabs" :key="tab.key"
                    class="py-2.5 cursor-pointer transition-all duration-200 rounded-lg text-xs md:text-sm font-medium"
                    :class="activeTab === tab.key 
                        ? 'bg-white dark:bg-slate-800 text-[#9E4CFF] shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800/50'" 
                    @click="activeTab = tab.key">
                    {{ tab.label }}
                </div>
            </div>
        </div>

        <main class="px-0 md:px-6 pb-20">
            <!-- Loading State -->
            <div v-if="chatbotStore.loading" class="flex flex-col items-center justify-center py-20">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9E4CFF]"></div>
                <span class="mt-4 text-gray-500 dark:text-gray-400 font-medium">Loading chatbot settings...</span>
            </div>

            <!-- Form Content -->
            <!-- Mobile: No Border, No Radius, No Shadow. Desktop: Borders, Radius, Shadow -->
            <div v-else class="bg-transparent md:bg-white md:dark:bg-slate-900 border-0 md:border md:border-gray-200 md:dark:border-slate-800 rounded-none md:rounded-2xl shadow-none md:shadow-sm overflow-hidden transition-colors duration-300">
                <div class="p-4 md:p-8">
                    <keep-alive>
                        <div v-if="activeTab === 'basic'">
                            <BasicChatbotSetup />
                        </div>
                        <div v-else-if="activeTab === 'appearance'">
                            <AppearanceChatbotSetup />
                        </div>
                        <div v-else-if="activeTab === 'behaviour'">
                            <BehaviourChatbotSetup />
                        </div>
                    </keep-alive>
                </div>
            </div>

            <!-- Embed Code Generator -->
            <div v-if="selectedChatbot" class="mt-8 px-4 md:px-0">
                <div v-if="!selectedChatbot.is_active" class="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 rounded-xl p-4 mb-6">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                                Chatbot Not Active
                            </h3>
                            <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-300/80 leading-relaxed">
                                Your chatbot needs to be activated before the widget will work on your website.
                                You can still generate and prepare your embed code, but activate the chatbot in settings to
                                make it live.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-transparent md:bg-white md:dark:bg-slate-900 rounded-none md:rounded-2xl border-0 md:border md:border-gray-200 md:dark:border-slate-800 shadow-none md:shadow-sm p-0 md:p-8">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Integration</h3>
                    <EmbedCodeGenerator :chatbot-id="selectedChatbot.id"
                        :chatbot-name="selectedChatbot.name || 'AI Assistant'" />
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>

definePageMeta({
    'layout': 'dashboard'
})

import { ref, reactive, onMounted, computed, provide, readonly } from 'vue' // Added missing imports
import BasicChatbotSetup from '~/components/chatbot-setup/BasicChatbotSetup.vue'
import AppearanceChatbotSetup from '~/components/chatbot-setup/AppearanceChatbotSetup.vue'
import BehaviourChatbotSetup from '~/components/chatbot-setup/BehaviourChatbotSetup.vue'
import EmbedCodeGenerator from '~/components/chatbot-setup/EmbedCodeGenerator.vue'

const chatbotStore = useChatbotStore()
const activeTab = ref('basic')

const tabs = [
    { key: 'basic', label: 'Basic' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'behaviour', label: 'Behaviour' }
]

const defaultFormData = {
    name: 'Customer Support Assistant',
    description: 'A helpful assistant for support and inquiries',
    type: 'general',
    language: '',
    response_time: '',
    personality: '',
    primary_color: '#2563eb',
    widget_position: '',
    avatar_style: '',
    welcome_message: '',
    widget_size: '',
    fallback_message: "I'm sorry, I didn't understand that. Could you please rephrase?",
    max_conversation_length: 50,
    enable_typing_indicator: false,
    collect_user_feedback: false,
    handoff_to_human: false,
    is_active: true
}

const formData = reactive({ ...defaultFormData })
const isEditing = ref(false)
const currentChatbotId = ref(null)
const selectedChatbotId = ref(null)

const hasChatbot = computed(() => chatbotStore.chatbots.length > 0)

const selectedChatbot = computed(() => {
    if (selectedChatbotId.value) {
        return chatbotStore.chatbots.find(bot => bot.id === selectedChatbotId.value)
    }
    return chatbotStore.chatbots[0] || null
})

const loadChatbotData = () => {
    const chatbot = selectedChatbot.value

    if (chatbot) {
        isEditing.value = true
        currentChatbotId.value = chatbot.id

        Object.assign(formData, defaultFormData)

        Object.keys(formData).forEach(key => {
            if (chatbot[key] !== undefined) {
                formData[key] = chatbot[key]
            }
        })
    }
}

const saveChanges = async () => {
    let result

    if (isEditing.value && currentChatbotId.value) {
        result = await chatbotStore.updateChatbot(currentChatbotId.value, formData)
    } else {
        result = await chatbotStore.createChatbot(formData)
    }

    if (result.success) {
        await chatbotStore.fetchChatbots()

        if (!isEditing.value && result.data) {
            selectedChatbotId.value = result.data.id
        }

        loadChatbotData()
    }
}

onMounted(async () => {
    await chatbotStore.fetchChatbots()

    if (chatbotStore.chatbots.length > 0) {
        selectedChatbotId.value = chatbotStore.chatbots[0].id
        loadChatbotData()
    }
})

provide('formData', formData)
provide('isEditing', readonly(isEditing))
</script>