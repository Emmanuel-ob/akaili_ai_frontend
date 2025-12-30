<!-- components/chatbot-setup/ChatWidget.vue -->
<template>
    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-none border border-gray-200 dark:border-slate-800 max-w-2xl mx-auto overflow-hidden transition-colors duration-300">
        
        <!-- Chat Header -->
        <div class="bg-[#9E4CFF] dark:bg-[#7C3AED] text-white px-6 py-4 flex justify-between items-center">
            <div>
                <h3 class="text-lg font-semibold">{{ chatbotName || 'AI Assistant' }}</h3>
                <p class="text-purple-100 text-sm">
                    <span v-if="handoverStatus === 'requested'">⏳ Connecting you to an agent...</span>
                    <span v-else-if="handoverStatus === 'active'">✅ Chatting with {{ agentName || 'Agent' }}</span>
                    <span v-else>🤖 AI Assistant</span>
                </p>
            </div>
            <button @click="resetChat" class="text-purple-100 hover:text-white text-sm underline transition-colors">
                Reset Chat
            </button>
        </div>

        <!-- Handover Status Banner -->
        <div v-if="handoverStatus === 'requested'" class="bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800/50 p-3">
            <div class="flex items-center text-yellow-800 dark:text-yellow-200 text-sm">
                <div class="animate-spin mr-2 w-4 h-4 border-2 border-yellow-600 dark:border-yellow-400 border-t-transparent rounded-full">
                </div>
                <span>Finding an available agent. Please wait...</span>
            </div>
        </div>

        <div v-if="handoverStatus === 'rejected'" class="bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800/50 p-3">
            <p class="text-red-800 dark:text-red-200 text-sm">
                ❌ All agents are currently busy. You can continue chatting with our AI assistant or try again later.
            </p>
        </div>

        <div v-if="handoverStatus === 'active'" class="bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800/50 p-3">
            <p class="text-green-800 dark:text-green-200 text-sm flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Connected to {{ agentName || 'an agent' }}
            </p>
        </div>

        <!-- Messages Container -->
        <div ref="messagesContainer" class="h-[500px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950">
            <!-- Welcome Empty State -->
            <div v-if="messages.length === 0" class="text-center text-gray-500 dark:text-gray-400 mt-12">
                <div class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 inline-block max-w-xs mx-auto">
                    <p class="text-lg">👋</p>
                    <p class="mt-2 font-medium">Hello! I'm your AI assistant.</p>
                    <p class="text-sm mt-1">Ask me anything about your data!</p>
                </div>
            </div>

            <!-- Messages List -->
            <div v-for="(message, index) in messages" :key="index" :class="[
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
            ]">
                <div :class="[
                    'max-w-[85%] lg:max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm',
                    message.role === 'user'
                        ? 'bg-[#9E4CFF] text-white rounded-br-none'
                        : message.role === 'system'
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800/50 text-xs italic mx-auto'
                            : message.role === 'agent'
                                ? 'bg-green-50 dark:bg-green-900/10 text-gray-800 dark:text-gray-200 border-l-4 border-green-500 rounded-bl-none'
                                : 'bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800 rounded-bl-none'
                ]">
                    <!-- Agent Name -->
                    <p v-if="message.role === 'agent'" class="text-xs text-green-600 dark:text-green-400 font-bold mb-1">
                        {{ message.metadata?.agent_name || 'Agent' }}
                    </p>
                    
                    <!-- Message Text -->
                    <p class="whitespace-pre-wrap leading-relaxed">{{ message.message }}</p>

                    <!-- Sources (AI only) -->
                    <div v-if="message.role === 'assistant' && message.sources && message.sources.length > 0"
                        class="mt-3 pt-2 border-t border-gray-100 dark:border-slate-700/50">
                        <p class="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Sources</p>
                        <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                            <div v-for="(source, idx) in message.sources.slice(0, 2)" :key="idx" class="truncate flex items-center">
                                <svg class="w-3 h-3 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                {{ source.table || 'Knowledge Base' }} ({{ Math.round(source.confidence * 100) }}%)
                            </div>
                        </div>
                    </div>

                    <!-- Timestamp -->
                    <p class="text-[10px] mt-2 text-right opacity-60">
                        {{ formatTime(message.timestamp) }}
                    </p>
                </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="isTyping" class="flex justify-start">
                <div class="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800 shadow-sm px-4 py-3 rounded-2xl rounded-bl-none">
                    <div class="flex space-x-1.5 items-center h-4">
                        <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <!-- Handover Request Button -->
            <div v-if="!handoverStatus && !isHandoverRequested" class="mb-3">
                <button @click="requestHumanAgent"
                    class="w-full text-xs sm:text-sm text-[#9E4CFF] dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium py-2 border border-[#9E4CFF] dark:border-purple-500/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
                    💬 Speak with a Human Agent
                </button>
            </div>

            <div class="flex space-x-2">
                <input v-model="currentMessage" @keypress.enter="sendMessage" :disabled="isTyping" type="text"
                    placeholder="Type your message..."
                    class="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 dark:disabled:bg-slate-800/50 transition-colors placeholder-gray-400 dark:placeholder-gray-500" />
                <button @click="sendMessage" :disabled="!currentMessage.trim() || isTyping"
                    class="px-5 py-3 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md">
                    Send
                </button>
            </div>
        </div>

        <!-- Status/Error -->
        <div v-if="error" class="px-4 pb-4 bg-white dark:bg-slate-900">
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script setup>
// ... (Script logic remains exactly same as original, only template classes changed)
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    chatbotId: {
        type: String,
        required: true
    },
    chatbotName: {
        type: String,
        default: 'AI Assistant'
    },
    testMode: String,
    testCustomerData: Object
})

const messages = ref([])
const currentMessage = ref('')
const isTyping = ref(false)
const error = ref('')
const sessionId = ref('')
const messagesContainer = ref(null)
const conversationId = ref(null)
const handoverStatus = ref(null)
const isHandoverRequested = ref(false)
const agentName = ref(null)

const { $echo } = useNuxtApp()
let conversationChannel = null

const isHandoverActive = computed(() => handoverStatus.value === 'active')

const generateSessionId = () => {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = async () => {
    await nextTick()
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

const requestHumanAgent = async () => {
    if (isHandoverRequested.value) return
    if (!conversationId.value) {
        error.value = 'Please send at least one message before requesting an agent'
        return
    }

    isHandoverRequested.value = true
    error.value = ''

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
                conversation_id: conversationId.value,
                session_id: sessionId.value,
                chatbot_id: props.chatbotId,
                user_message: 'Customer requested human agent'
            }
        })

        if (response.success) {
            handoverStatus.value = 'requested'
            messages.value.push({
                role: 'system',
                message: 'Connecting you with an agent. This may take a moment...',
                timestamp: new Date().toISOString()
            })
            if (conversationId.value) setupConversationListener()
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

const setupConversationListener = () => {
    if (!conversationId.value || conversationChannel) return
    conversationChannel = $echo.channel(`conversation.${conversationId.value}`)

    conversationChannel.listen('.handover.accepted', (event) => {
        handoverStatus.value = 'active'
        agentName.value = event.agent?.name || 'Agent'
        messages.value.push({
            role: 'system',
            message: `You are now connected with ${agentName.value}. They will assist you shortly.`,
            timestamp: new Date().toISOString()
        })
        scrollToBottom()
    })

    conversationChannel.listen('.handover.rejected', (event) => {
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

    conversationChannel.listen('.agent.message', (event) => {
        messages.value.push({
            role: 'agent',
            message: event.message.message,
            timestamp: event.message.timestamp,
            metadata: { agent_id: event.agent.id, agent_name: event.agent.name }
        })
        scrollToBottom()
    })
}

const sendMessage = async () => {
    if (!currentMessage.value.trim() || isTyping.value) return
    const messageText = currentMessage.value.trim()
    currentMessage.value = ''
    error.value = ''

    messages.value.push({ role: 'user', message: messageText, timestamp: new Date().toISOString() })
    scrollToBottom()
    isTyping.value = true

    try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        if (isHandoverActive.value && authStore.token) {
            const response = await $fetch(`${config.public.apiBase}/api/agent-handover/message`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' },
                body: { conversation_id: conversationId.value, message: messageText }
            })
            if (response.success) {
                isTyping.value = false
                scrollToBottom()
                return
            }
            throw new Error(response.message || 'Failed to send agent message')
        }

        const payload = {
            message: messageText,
            chatbot_id: props.chatbotId,
            session_id: sessionId.value
        }

        const response = await $fetch(`${config.public.apiBase}/api/chat`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' },
            body: payload
        })

        if (response.success) {
            if (response.conversation_id) conversationId.value = response.conversation_id
            if (response.session_id) sessionId.value = response.session_id

            const handoverRequested = response.data?.response?.metadata?.handover_requested

            if (handoverRequested && !isHandoverRequested.value) {
                messages.value.push({
                    role: 'assistant',
                    message: response.data.response.text,
                    timestamp: new Date().toISOString(),
                    sources: response.data.response.sources || []
                })
                setTimeout(() => requestHumanAgent(), 500)
            } else if (!isHandoverActive.value) {
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

onUnmounted(() => {
    if (conversationChannel && conversationId.value) {
        $echo.leave(`conversation.${conversationId.value}`)
    }
})

onMounted(() => {
    sessionId.value = generateSessionId()
})
</script>