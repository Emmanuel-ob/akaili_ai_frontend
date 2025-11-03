<template>
    <div class="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
        <!-- Chat Header -->
        <div class="bg-[#7F56D9] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
            <div>
                <h3 class="text-lg font-semibold">{{ chatbotName || 'AI Assistant' }}</h3>
                <p class="text-purple-100 text-sm">Test your chatbot here</p>
            </div>
            <button @click="resetChat" class="text-purple-100 hover:text-white text-sm underline">
                Reset Chat
            </button>
        </div>

        <!-- Messages Container -->
        <div ref="messagesContainer" class="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            <div v-if="messages.length === 0" class="text-center text-gray-500 mt-8">
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <p>👋 Hello! I'm your AI assistant. Ask me anything!</p>
                </div>
            </div>

            <div v-for="(message, index) in messages" :key="index" :class="[
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
            ]">
                <div :class="[
                    'max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm',
                    message.role === 'user'
                        ? 'bg-[#7F56D9] text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                ]">
                    <p class="whitespace-pre-wrap">{{ message.message }}</p>

                    <!-- Show sources for assistant messages -->
                    <div v-if="message.role === 'assistant' && message.sources && message.sources.length > 0"
                        class="mt-2 pt-2 border-t border-gray-200">
                        <p class="text-xs text-gray-500 mb-1">Sources:</p>
                        <div class="text-xs text-gray-600">
                            <div v-for="(source, idx) in message.sources.slice(0, 2)" :key="idx" class="truncate">
                                📄 {{ source.table || 'Knowledge Base' }} ({{ Math.round(source.confidence * 100) }}%)
                            </div>
                        </div>
                    </div>

                    <p class="text-xs mt-1 opacity-70">
                        {{ formatTime(message.timestamp) }}
                    </p>
                </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="isTyping" class="flex justify-start">
                <div class="bg-white text-gray-800 shadow-sm max-w-xs px-4 py-2 rounded-lg">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s">
                        </div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t border-gray-200">
            <div class="flex space-x-2">
                <input v-model="currentMessage" @keypress.enter="sendMessage" :disabled="isTyping" type="text"
                    placeholder="Type your message..."
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100" />
                <button @click="sendMessage" :disabled="!currentMessage.trim() || isTyping"
                    class="px-4 py-2 bg-[#7F56D9] text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    Send
                </button>
            </div>
        </div>

        <!-- Status -->
        <div v-if="error" class="px-4 pb-4">
            <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
    chatbotId: {
        type: String,
        required: true
    },
    chatbotName: {
        type: String,
        default: 'AI Assistant'
    }
})

// Reactive data
const messages = ref([])
const currentMessage = ref('')
const isTyping = ref(false)
const error = ref('')
const sessionId = ref('')
const messagesContainer = ref(null)

// Generate session ID
const generateSessionId = () => {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Format timestamp
const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Scroll to bottom
const scrollToBottom = async () => {
    await nextTick()
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

// Send message
const sendMessage = async () => {
    if (!currentMessage.value.trim() || isTyping.value) return

    const messageText = currentMessage.value.trim()
    currentMessage.value = ''
    error.value = ''

    // Add user message to chat
    messages.value.push({
        role: 'user',
        message: messageText,
        timestamp: new Date().toISOString()
    })

    scrollToBottom()
    isTyping.value = true

    try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        const payload = {
            message: messageText,
            chatbot_id: props.chatbotId,
            session_id: sessionId.value
        }

        const response = await $fetch(`${config.public.apiBase}/api/chat`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'application/json'
            },
            body: payload
        })

        if (response.success) {
            // Update session ID if new
            if (response.session_id) {
                sessionId.value = response.session_id
            }

            // Add assistant response
            messages.value.push({
                role: 'assistant',
                message: response.data.response.text,
                timestamp: new Date().toISOString(),
                sources: response.data.response.sources || [],
                metadata: response.data.response.metadata || {}
            })
        } else {
            throw new Error(response.message || 'Failed to send message')
        }

    } catch (err) {
        console.error('Chat error:', err)
        error.value = 'Failed to send message. Please try again.'

        // Add fallback message
        messages.value.push({
            role: 'assistant',
            message: "I'm sorry, I'm having trouble responding right now. Please try again.",
            timestamp: new Date().toISOString(),
            sources: [],
            metadata: { fallback: true }
        })
    } finally {
        isTyping.value = false
        scrollToBottom()
    }
}

// Reset chat
const resetChat = () => {
    messages.value = []
    sessionId.value = generateSessionId()
    error.value = ''
}

// Initialize
sessionId.value = generateSessionId()
</script>