<template>
    <div class="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
        <!-- Chat Header -->
        <div class="bg-[#9E4CFF] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
            <div>
                <h3 class="text-lg font-semibold">{{ chatbotName || 'AI Assistant' }}</h3>
                <p class="text-purple-100 text-sm">
                    <span v-if="handoverStatus === 'requested'">⏳ Connecting you to an agent...</span>
                    <span v-else-if="handoverStatus === 'active'">✅ Chatting with {{ agentName || 'Agent' }}</span>
                    <span v-else>🤖 AI Assistant</span>
                </p>
            </div>
            <button @click="resetChat" class="text-purple-100 hover:text-white text-sm underline">
                Reset Chat
            </button>
        </div>

        <!-- Handover Status Banner -->
        <div v-if="handoverStatus === 'requested'" class="bg-yellow-50 border-b border-yellow-200 p-3">
            <div class="flex items-center text-yellow-800 text-sm">
                <div class="animate-spin mr-2 w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full">
                </div>
                <span>Finding an available agent. Please wait...</span>
            </div>
        </div>

        <div v-if="handoverStatus === 'rejected'" class="bg-red-50 border-b border-red-200 p-3">
            <p class="text-red-800 text-sm">
                ❌ All agents are currently busy. You can continue chatting with our AI assistant or try again later.
            </p>
        </div>

        <div v-if="handoverStatus === 'active'" class="bg-green-50 border-b border-green-200 p-3">
            <p class="text-green-800 text-sm flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Connected to {{ agentName || 'an agent' }}
            </p>
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
                        ? 'bg-[#9E4CFF] text-white'
                        : message.role === 'system'
                            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs italic'
                            : message.role === 'agent'
                                ? 'bg-green-50 text-gray-800 shadow-sm border-l-4 border-green-500'
                                : 'bg-white text-gray-800 shadow-sm'
                ]">
                    <p v-if="message.role === 'agent'" class="text-xs text-green-600 font-semibold mb-1">
                        {{ message.metadata?.agent_name || 'Agent' }}
                    </p>
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
            <!-- Handover Request Button -->
            <div v-if="!handoverStatus && !isHandoverRequested" class="mb-2">
                <button @click="requestHumanAgent"
                    class="w-full text-sm text-[#9E4CFF] hover:text-purple-700 font-medium py-2 border border-[#9E4CFF] rounded-lg hover:bg-purple-50 transition">
                    💬 Speak with a Human Agent
                </button>
            </div>

            <div class="flex space-x-2">
                <input v-model="currentMessage" @keypress.enter="sendMessage" :disabled="isTyping" type="text"
                    placeholder="Type your message..."
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100" />
                <button @click="sendMessage" :disabled="!currentMessage.trim() || isTyping"
                    class="px-4 py-2 bg-[#9E4CFF] text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
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
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue'

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
const conversationId = ref(null)

// Handover state
const handoverStatus = ref(null) // null, 'requested', 'active', 'rejected'
const isHandoverRequested = ref(false)
const agentName = ref(null)

// WebSocket setup
const { $echo } = useNuxtApp()
let conversationChannel = null

const isHandoverActive = computed(() => handoverStatus.value === 'active')

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

// Request human agent
const requestHumanAgent = async () => {
    if (isHandoverRequested.value) return

    // Check if we have a conversation ID
    if (!conversationId.value) {
        error.value = 'Please send at least one message before requesting an agent'
        return
    }

    isHandoverRequested.value = true
    error.value = ''

    // Add user message
    messages.value.push({
        role: 'user',
        message: 'I would like to speak with a human agent',
        timestamp: new Date().toISOString()
    })

    scrollToBottom()
    isTyping.value = true

    try {
        const config = useRuntimeConfig()

        const response = await $fetch(`${config.public.apiBase}/api/handover/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                conversation_id: conversationId.value, // ✅ Now this is set!
                session_id: sessionId.value,
                chatbot_id: props.chatbotId,
                user_message: 'Customer requested human agent'
            }
        })

        if (response.success) {
            handoverStatus.value = 'requested'

            // Add system message
            messages.value.push({
                role: 'system',
                message: 'Connecting you with an agent. This may take a moment...',
                timestamp: new Date().toISOString()
            })

            // Setup WebSocket listener for this conversation
            if (conversationId.value) {
                setupConversationListener()
            }
        } else {
            throw new Error(response.message || 'Failed to request handover')
        }

    } catch (err) {
        console.error('Handover request error:', err)
        error.value = 'Failed to connect to an agent. Please try again.'
        isHandoverRequested.value = false
    } finally {
        isTyping.value = false
        scrollToBottom()
    }
}

// Setup WebSocket listener for conversation
const setupConversationListener = () => {
    if (!conversationId.value || conversationChannel) return

    conversationChannel = $echo.channel(`conversation.${conversationId.value}`)

    // Listen for handover accepted
    conversationChannel.listen('.handover.accepted', (event) => {
        console.log('Handover accepted:', event)
        handoverStatus.value = 'active'
        agentName.value = event.agent?.name || 'Agent'

        messages.value.push({
            role: 'system',
            message: `You are now connected with ${agentName.value}. They will assist you shortly.`,
            timestamp: new Date().toISOString()
        })

        scrollToBottom()
    })

    // Listen for handover rejected
    conversationChannel.listen('.handover.rejected', (event) => {
        console.log('Handover rejected:', event)

        if (event.all_rejected) {
            handoverStatus.value = 'rejected'
            messages.value.push({
                role: 'system',
                message: 'All agents are currently busy. You can continue chatting with our AI assistant.',
                timestamp: new Date().toISOString()
            })
        }

        scrollToBottom()
    })

    // Listen for agent messages
    conversationChannel.listen('.agent.message', (event) => {
        console.log('Agent message:', event)

        messages.value.push({
            role: 'agent',
            message: event.message.message,
            timestamp: event.message.timestamp,
            metadata: {
                agent_id: event.agent.id,
                agent_name: event.agent.name
            }
        })

        scrollToBottom()
    })
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

        // ✅ FIX: If handover is active AND user is authenticated, send as agent message
        if (isHandoverActive.value && authStore.token) {
            const response = await $fetch(`${config.public.apiBase}/api/agent-handover/message`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json'
                },
                body: {
                    conversation_id: conversationId.value,
                    message: messageText
                }
            })

            if (response.success) {
                // Message was sent successfully - don't add AI response
                isTyping.value = false
                scrollToBottom()
                return
            } else {
                throw new Error(response.message || 'Failed to send agent message')
            }
        }

        // Normal chat flow (not in handover, or widget user in handover)
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
            // ✅ Capture conversation_id from response
            if (response.conversation_id) {
                conversationId.value = response.conversation_id
                console.log('📝 Conversation ID set:', conversationId.value)
            }

            // Update session ID if new
            if (response.session_id) {
                sessionId.value = response.session_id
            }

            // Check if handover was requested by AI
            const handoverRequested = response.data?.response?.metadata?.handover_requested

            if (handoverRequested && !isHandoverRequested.value) {
                // Show AI message first
                messages.value.push({
                    role: 'assistant',
                    message: response.data.response.text,
                    timestamp: new Date().toISOString(),
                    sources: response.data.response.sources || []
                })

                // Auto-trigger handover request
                setTimeout(() => {
                    requestHumanAgent()
                }, 500)
            } else if (!isHandoverActive.value) {
                // Only add AI response if NOT in active handover
                messages.value.push({
                    role: 'assistant',
                    message: response.data.response.text,
                    timestamp: new Date().toISOString(),
                    sources: response.data.response.sources || [],
                    metadata: response.data.response.metadata || {}
                })
            }
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
    if (conversationChannel) {
        $echo.leave(`conversation.${conversationId.value}`)
        conversationChannel = null
    }

    messages.value = []
    sessionId.value = generateSessionId()
    conversationId.value = null
    error.value = ''
    handoverStatus.value = null
    isHandoverRequested.value = false
    agentName.value = null
}

// Cleanup on unmount
onUnmounted(() => {
    if (conversationChannel) {
        $echo.leave(`conversation.${conversationId.value}`)
    }
})

// Initialize
onMounted(() => {
    sessionId.value = generateSessionId()
})
</script>