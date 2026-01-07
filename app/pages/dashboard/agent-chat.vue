<!-- dashboard/agent-chat.vue -->
<template>
  <div class="flex h-[calc(100vh-80px)] bg-gray-100 dark:bg-slate-950 transition-colors duration-300">
    <!-- Sidebar: Tabs + List -->
    <div class="w-full md:w-[350px] lg:w-1/3 bg-white dark:bg-slate-900 flex flex-col shadow-lg md:shadow-none border-r border-gray-200 dark:border-slate-800">
      <!-- Header -->
      <div class="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Agent Dashboard</h2>
        <div class="flex items-center space-x-2">
          <!-- WebSocket Status Indicator -->
          <div class="flex items-center space-x-1">
            <div :class="[
              'w-2 h-2 rounded-full',
              websocketStore.isConnected ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ websocketStore.isConnected ? 'Connected' : 'Disconnected' }}
            </span>
          </div>
          <button @click="refreshAll" class="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition" title="Refresh">
            <RefreshCcw :class="{ 'animate-spin': loading }" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
          class="flex-1 px-4 py-3 text-sm font-medium transition relative" :class="[
            activeTab === tab.key
              ? 'text-[#9E4CFF] border-b-2 border-[#9E4CFF] bg-white dark:bg-slate-900'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
          ]">
          {{ tab.label }}
          <span v-if="tab.badge && tab.badgeCount > 0"
            class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
            {{ tab.badgeCount }}
          </span>
        </button>
      </div>

      <!-- Tab Content: Requests -->
      <div v-if="activeTab === 'requests'" class="flex-1 overflow-y-auto p-2 bg-gray-50 dark:bg-slate-950">
        <div v-if="handoverStore.pendingRequests.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <Inbox class="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
          <p>No pending requests</p>
          <p class="text-xs mt-2">Waiting for customers...</p>
        </div>

        <div v-for="request in handoverStore.pendingRequests" :key="request.id"
          class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 mb-2 hover:shadow-md transition animate-slideIn">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800 dark:text-white">New Request</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(request.timestamp) }}</p>
            </div>
            <span class="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-300 rounded">Pending</span>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{{ request.user_message || 'Customer needs assistance' }}
          </p>

          <div class="flex space-x-2">
            <button @click="acceptRequest(request.id)" :disabled="handoverStore.loading"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition disabled:opacity-50">
              Accept
            </button>
            <button @click="rejectRequest(request.id)" :disabled="handoverStore.loading"
              class="flex-1 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded text-sm font-medium transition disabled:opacity-50">
              Pass
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content: Active Chats -->
      <div v-if="activeTab === 'active'" class="flex-1 overflow-y-auto p-2 bg-gray-50 dark:bg-slate-950">
        <div v-if="handoverStore.activeConversations.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <MessageCircle class="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
          <p>No active conversations</p>
        </div>

        <div v-for="conversation in handoverStore.activeConversations" :key="conversation.id"
          @click="selectConversation(conversation.id)"
          class="flex items-center p-3 cursor-pointer transition rounded-lg mx-1 my-1"
          :class="selectedConversationId === conversation.id 
            ? 'bg-purple-100 dark:bg-purple-900/30 shadow-sm border border-purple-200 dark:border-purple-800' 
            : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/10'">
          <div
            class="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-200 font-semibold mr-3">
            {{ getInitials(conversation.id) }}
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Customer {{ conversation.session_id.slice(-6) }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Active conversation</p>
          </div>
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </div>
      </div>

      <!-- Tab Content: History -->
      <div v-if="activeTab === 'history'" class="flex-1 overflow-y-auto p-2 bg-gray-50 dark:bg-slate-950">
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">
          <Clock class="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
          <p>History coming soon</p>
        </div>
      </div>
    </div>

    <!-- Chat Window -->
    <div class="flex-1 flex flex-col bg-white dark:bg-slate-900 md:bg-gray-50 dark:md:bg-slate-950 h-full">
      <div v-if="selectedConversation" class="flex flex-col h-full bg-white dark:bg-slate-900 rounded-none md:rounded-tl-2xl shadow-xl overflow-hidden border-l border-gray-200 dark:border-slate-800">
        <!-- Header -->
        <div class="p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button @click="selectedConversationId = null" class="sm:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ChevronLeft class="w-6 h-6" />
            </button>
            <div
              class="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-200 font-semibold">
              {{ getInitials(selectedConversation.id) }}
            </div>
            <div>
              <h2 class="text-base font-semibold text-gray-800 dark:text-white">Customer {{ selectedConversation.session_id.slice(-6) }}
              </h2>
              <p class="text-xs text-green-500 font-medium flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                Live Chat
              </p>
            </div>
          </div>

          <button @click="confirmEndHandover"
            class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition">
            End Chat
          </button>
        </div>

        <!-- Messages -->
        <div ref="messageContainer"
          class="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50 dark:bg-slate-950">
          <div v-for="(msg, index) in selectedConversation.messages" :key="index" :class="[
            'flex',
            msg.role === 'agent' ? 'justify-end' : 'justify-start'
          ]">
            <div :class="[
              'max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm shadow-sm',
              msg.role === 'agent'
                ? 'bg-[#9E4CFF] text-white'
                : msg.role === 'system'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800/50 text-xs text-center mx-auto'
                  : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-700'
            ]">
              <p class="whitespace-pre-wrap">{{ msg.message }}</p>
              <span class="block text-[10px] opacity-70 mt-1 text-right">
                {{ formatTime(msg.timestamp) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-3 md:p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex items-center space-x-3">
          <input v-model="newMessage" placeholder="Type your message..." @keyup.enter="sendMessage"
            class="flex-1 border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E4CFF] focus:border-[#9E4CFF] transition placeholder-gray-400 dark:placeholder-gray-500" />
          <button @click="sendMessage" :disabled="!newMessage.trim()"
            class="p-3 bg-[#9E4CFF] text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
            <Send class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Placeholder for no conversation selected -->
      <div v-else class="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-base">
        <div class="text-center">
          <MessageSquare class="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p class="text-lg font-medium">Select a conversation to start chatting</p>
          <p class="text-sm mt-2">Pick from the active list on the left</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Script section remains identical
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Send, ChevronLeft, MessageSquare, RefreshCcw, Inbox, MessageCircle, Clock } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

definePageMeta({
  layout: 'dashboard'
})

const handoverStore = useAgentHandoverStore()
const websocketStore = useWebSocketStore()
const toast = useToast()
const { $echo } = useNuxtApp()

const activeTab = ref('requests')
const selectedConversationId = ref(null)
const newMessage = ref('')
const loading = ref(false)
const messageContainer = ref(null)
let conversationChannel = null

const tabs = computed(() => [
  { key: 'requests', label: 'Requests', badge: true, badgeCount: handoverStore.pendingCount },
  { key: 'active', label: 'Active', badge: true, badgeCount: handoverStore.activeCount },
  { key: 'history', label: 'History', badge: false }
])

const selectedConversation = computed(() => handoverStore.selectedConversation)

onMounted(async () => {
  if (!websocketStore.isConnected) {
    await websocketStore.initialize()
  }
  await new Promise(resolve => setTimeout(resolve, 500))
  setupWebSocketListeners()
  await refreshAll()
  requestNotificationPermission()
})

onUnmounted(() => {
  websocketStore.offAll('agent-chat-page')
  if (conversationChannel) {
    $echo.leave(`conversation.${conversationChannel}`)
    conversationChannel = null
  }
})

const subscribeToConversation = (conversationId) => {
  if (conversationChannel) {
    $echo.leave(`conversation.${conversationChannel}`)
    conversationChannel = null
  }
  if (!conversationId) return
  conversationChannel = conversationId
  const channel = $echo.channel(`conversation.${conversationId}`)
  channel.listen('.agent.message', (event) => {
    const conversation = handoverStore.activeConversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.messages = conversation.messages || []
      conversation.messages.push(event.message)
      conversation.last_activity = new Date().toISOString()
    }
    scrollToBottom()
  })
}

function setupWebSocketListeners() {
  websocketStore.on('handover.requested', (event) => {
    handoverStore.handleHandoverRequested(event)
    toast.info('New customer request received!')
    playNotificationSound()
  }, 'agent-chat-page')

  websocketStore.on('handover.accepted', (event) => {
    handoverStore.handleHandoverAccepted(event)
  }, 'agent-chat-page')

  websocketStore.on('handover.rejected', (event) => {
    handoverStore.handleHandoverRejected(event)
  }, 'agent-chat-page')
}

function playNotificationSound() {
  try {
    const audio = new Audio('/notification.mp3')
    audio.play().catch(e => console.log('Could not play sound:', e))
  } catch (e) {
    console.log('Notification sound not available')
  }
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

async function refreshAll() {
  loading.value = true
  try {
    await Promise.all([
      handoverStore.fetchPendingRequests(),
      handoverStore.fetchActiveConversations()
    ])
  } catch (error) {
    console.error('Failed to refresh data:', error)
    toast.error('Failed to refresh data')
  } finally {
    loading.value = false
  }
}

async function acceptRequest(requestId) {
  try {
    await handoverStore.acceptHandover(requestId)
    toast.success('Request accepted! Chat started.')
    activeTab.value = 'active'
  } catch (error) {
    console.error('Failed to accept handover:', error)
    toast.error('Failed to accept request')
  }
}

async function rejectRequest(requestId) {
  try {
    await handoverStore.rejectHandover(requestId)
    toast.info('Request passed to other agents')
  } catch (error) {
    console.error('Failed to reject handover:', error)
    toast.error('Failed to reject request')
  }
}

function selectConversation(conversationId) {
  selectedConversationId.value = conversationId
  handoverStore.selectConversation(conversationId)
  subscribeToConversation(conversationId)
  nextTick(() => scrollToBottom())
}

async function sendMessage() {
  if (!newMessage.value.trim() || !selectedConversationId.value) return
  const messageText = newMessage.value.trim()
  newMessage.value = ''
  try {
    await handoverStore.sendAgentMessage(selectedConversationId.value, messageText)
    scrollToBottom()
  } catch (error) {
    console.error('Failed to send message:', error)
    toast.error('Failed to send message')
    newMessage.value = messageText
  }
}

function confirmEndHandover() {
  if (confirm('Are you sure you want to end this conversation? The customer will be returned to the AI assistant.')) {
    endHandover()
  }
}

async function endHandover() {
  if (!selectedConversationId.value) return
  try {
    await handoverStore.endHandover(selectedConversationId.value)
    toast.success('Conversation ended')
    if (conversationChannel) {
      $echo.leave(`conversation.${conversationChannel}`)
      conversationChannel = null
    }
    selectedConversationId.value = null
  } catch (error) {
    console.error('Failed to end conversation:', error)
    toast.error('Failed to end conversation')
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

watch(
  () => selectedConversation.value?.messages?.length,
  () => {
    scrollToBottom()
  }
)

watch(
  () => selectedConversationId.value,
  (newId, oldId) => {
    if (newId !== oldId) {
      subscribeToConversation(newId)
    }
  }
)

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getInitials(id) {
  if (!id) return 'C'
  return id.slice(0, 2).toUpperCase()
}
</script>

<style scoped>
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}
</style>