<template>
  <div class="flex-1 flex flex-col bg-white md:bg-gray-100 h-full">
    <div v-if="chat" class="flex flex-col h-full">
      <!-- Header -->
      <div class="p-4 bg-white border-b border-gray-200 shadow-md flex items-center space-x-3">
        <button @click="$emit('select-chat', null)" class="sm:hidden text-gray-500 hover:text-gray-700">
          <ChevronLeft class="w-6 h-6" />
        </button>
        <img
          :src="chat.avatar"
          alt="Avatar"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 class="text-base font-semibold text-gray-800">{{ chat.userName }}</h2>
          <p class="text-xs text-green-500 font-medium">Online</p>
        </div>
      </div>

      <!-- Messages -->
      <div
        ref="messageContainer"
        class="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50 md:rounded-tr-2xl md:rounded-br-2xl"
      >
        <MessageBubble
          v-for="(msg, index) in chat.messages"
          :key="index"
          :sender="msg.sender"
          :text="msg.text"
          :time="msg.time"
        />
      </div>

      <!-- Input -->
      <div class="p-3 md:p-4 bg-white border-t border-gray-200 shadow-inner flex items-center space-x-3">
        <input
          v-model="newMessage"
          placeholder="Type a message..."
          @keyup.enter="handleSend"
          class="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9] transition"
        />
        <button
          @click="handleSend"
          class="p-3 bg-[#7F56D9] text-white rounded-xl hover:bg-purple-700 transition"
        >
          <Send class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Placeholder for no chat selected -->
    <div
      v-else
      class="flex-1 flex items-center justify-center text-gray-400 text-base"
    >
      <div class="text-center">
        <MessageSquare class="w-8 h-8 mx-auto mb-2" />
        Select a chat to start messaging
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { Send, ChevronLeft, MessageSquare } from 'lucide-vue-next'
import MessageBubble from './MessageBubble.vue'

const props = defineProps({
  chat: Object
})

const emit = defineEmits(['select-chat', 'send-message'])

const newMessage = ref('')
const messageContainer = ref(null)

function handleSend() {
  if (!newMessage.value.trim() || !props.chat) return

  const now = new Date()
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // Emit to parent (no mutation)
  emit('send-message', {
    chatId: props.chat.id,
    message: {
      sender: 'agent',
      text: newMessage.value.trim(),
      time: timeString
    }
  })

  newMessage.value = ''

  nextTick(() => {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  })
}

// Auto-scroll when new messages arrive
watch(
  () => props.chat?.messages?.length,
  () => {
    nextTick(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    })
  }
)
</script>
