<template>
    <div class="bg-white h-[100vh]">
        <!-- No Chatbot Warning -->
        <div v-if="!hasChatbot && !chatbotStore.loading" class="bg-yellow-50 border border-yellow-200 px-4 py-3 mb-4">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p class="text-yellow-800 text-sm">
                    <strong>No chatbot found.</strong> Create your first chatbot by filling out the form below and
                    clicking "Create Chatbot".
                </p>
            </div>
        </div>

        <!-- Chatbot Selector -->
        <div v-if="chatbotStore.chatbots.length > 1 && !chatbotStore.loading"
            class="bg-blue-50 border border-blue-200 px-4 py-3 mb-4">
            <label class="block text-sm font-medium text-blue-800 mb-2">
                Select Chatbot to Edit:
            </label>
            <select v-model="selectedChatbotId" @change="loadChatbotData"
                class="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="bot in chatbotStore.chatbots" :key="bot.id" :value="bot.id">
                    {{ bot.name }}
                </option>
            </select>
        </div>

        <header class="bg-white px-6 py-4">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-[#7F56D9] text-2xl font-bold">
                        {{ isEditing ? 'Edit Chatbot' : 'Create Chatbot' }}
                    </h1>
                    <p class="text-sm lg:text-base text-[#6B7280]">
                        {{ isEditing ? 'Update your AI chatbot settings' : 'Configure and customize your new AI chatbot'
                        }}
                    </p>
                </div>

                <div class="flex items-center space-x-4">
                    <button @click="saveChanges" :disabled="chatbotStore.saving || chatbotStore.loading"
                        class="px-5 py-4 nav_primary_btn text-sm lg:text-base text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ chatbotStore.saving ? 'Saving...' : (isEditing ? 'Update Chatbot' : 'Create Chatbot') }}
                    </button>
                </div>
            </div>
        </header>

        <div class="grid grid-cols-3 gap-1 text-center mx-4 mb-8 mt-5">
            <div v-for="tab in tabs" :key="tab.key"
                class="py-2 cursor-pointer transition-all duration-200 hover:bg-gray-100 rounded-xl"
                :class="activeTab === tab.key ? 'active_chatbot_setup' : ''" @click="activeTab = tab.key">
                {{ tab.label }}
            </div>
        </div>

        <main class="px-6">
            <!-- Loading State -->
            <div v-if="chatbotStore.loading" class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span class="ml-2 text-gray-600">Loading chatbot settings...</span>
            </div>

            <!-- Form Content -->
            <div v-else>
                <div v-if="activeTab === 'basic'">
                    <BasicChatbotSetup />
                </div>
                <div v-else-if="activeTab === 'appearance'">
                    <AppearanceChatbotSetup />
                </div>
                <div v-else-if="activeTab === 'behaviour'">
                    <BehaviourChatbotSetup />
                </div>
            </div>
        </main>
    </div>
</template>
<script setup>

import { ref, reactive, onMounted, computed } from 'vue'
import BasicChatbotSetup from '~/components/chatbot-setup/BasicChatbotSetup.vue'
import AppearanceChatbotSetup from '~/components/chatbot-setup/AppearanceChatbotSetup.vue'
import BehaviourChatbotSetup from '~/components/chatbot-setup/BehaviourChatbotSetup.vue'

const chatbotStore = useChatbotStore()
const activeTab = ref('basic')

const tabs = [
    { key: 'basic', label: 'Basic' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'behaviour', label: 'Behaviour' }
]

// Default form data
const defaultFormData = {
    name: 'Customer Support Assistant',
    description: 'A helpful assistant for support and inquiries',
    type: 'general',
    language: '',
    response_time: '',
    personality: '',
    primary_color: '2563eb',
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

// Check if user has a chatbot
const hasChatbot = computed(() => chatbotStore.chatbots.length > 0)
const currentChatbot = computed(() => {
    if (selectedChatbotId.value) {
        return chatbotStore.chatbots.find(bot => bot.id === selectedChatbotId.value)
    }
    return chatbotStore.chatbots[0] || null
})

// Load existing chatbot data
const loadChatbotData = () => {
    if (currentChatbot.value) {
        isEditing.value = true
        currentChatbotId.value = currentChatbot.value.id
        selectedChatbotId.value = currentChatbot.value.id
        console.log('Editing chatbot with ID:', currentChatbotId.value)

        // Reset form to defaults first
        Object.assign(formData, defaultFormData)

        // Populate form with existing data
        Object.keys(formData).forEach(key => {
            if (currentChatbot.value[key] !== undefined) {
                formData[key] = currentChatbot.value[key]
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
        // Refresh chatbots and reload data
        await chatbotStore.fetchChatbots()
        loadChatbotData()

        // Show success message (you can add your notification system here)
        console.log(isEditing.value ? 'Chatbot updated successfully' : 'Chatbot created successfully')
    } else {
        console.error(result.message)
        // Show error message
    }
}

onMounted(async () => {
    await chatbotStore.fetchChatbots()
    if (chatbotStore.chatbots.length > 0) {
        selectedChatbotId.value = chatbotStore.chatbots[0].id
    }
    loadChatbotData()
})

// Provide formData to child components
provide('formData', formData)
provide('isEditing', readonly(isEditing))
</script>
