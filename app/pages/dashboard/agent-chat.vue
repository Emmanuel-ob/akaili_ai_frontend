<template>
  <div class="flex h-[calc(100vh-80px)] bg-gray-100/50">
    <!-- Chat List -->
    <ChatList
      :chats="chats"
      :selected-chat-id="selectedChatId"
      @select-chat="selectChat"
      @open-modal="showModal = true"
      :class="{ 
        'hidden sm:flex': selectedChatId, 
        'flex w-full': !selectedChatId 
      }"
      class="flex-col"
    />

    <!-- Chat Window -->
    <ChatWindow
      :chat="activeChat"
      :class="{ 
        'w-full': selectedChatId, 
        'hidden sm:flex flex-1': !selectedChatId 
      }"
      @send-message="handleSendMessage"
      @select-chat="selectChat"
    />

    <!-- Add New Client Modal -->
    <BaseModal :show="showModal" title="Add New Client" @close="showModal = false">
      <template #body>
        <div class="space-y-4">
          <input
            v-model="newClientName"
            type="text"
            placeholder="Enter client name"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
          <button
            @click="addClient"
            class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition w-full"
          >
            Add Client
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ChatList from '~/components/AgentChat/ChatList.vue'
import ChatWindow from '~/components/AgentChat/ChatWindow.vue'
import BaseModal from '~/components/BaseModal.vue'

definePageMeta({
  layout: 'dashboard'
})

const selectedChatId = ref(null)
const showModal = ref(false)
const newClientName = ref('')
const chats = ref([])
const isReady = ref(false)

// 🧠 Load chats only on client-side
onMounted(() => {
  const saved = localStorage.getItem('chats')
  if (saved) {
    chats.value = JSON.parse(saved)
  } else {
    chats.value = [
      {
        id: 1,
        userName: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Sending now. Please confirm receipt!',
        time: '10:47 AM',
        messages: [
          { sender: 'user', text: 'Hi there! I am interested in the new project proposals.', time: '10:43 AM' },
          { sender: 'agent', text: 'Sure, let’s do that! I have them ready for review.', time: '10:45 AM' },
          { sender: 'user', text: 'Great, could you send them over now?', time: '10:46 AM' },
          { sender: 'agent', text: 'Sending now. Please confirm receipt!', time: '10:47 AM' }
        ]
      },
      {
        id: 2,
        userName: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=2',
        lastMessage: 'I’ve attached the final report. Let me know if you need anything else.',
        time: 'Yesterday',
        messages: [
          { sender: 'user', text: 'How is the final report coming along?', time: '04:00 PM' },
          { sender: 'agent', text: 'It’s complete. I’ve attached the final report. Let me know if you need anything else.', time: '04:05 PM' }
        ]
      },
      {
        id: 3,
        userName: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/150?img=3',
        lastMessage: 'Got it, scheduling a follow-up for next Tuesday.',
        time: '1 day ago',
        messages: [
          { sender: 'agent', text: 'What is a good time for a brief catch-up?', time: '09:00 AM' },
          { sender: 'user', text: 'Tuesday afternoon works best for me.', time: '09:05 AM' },
          { sender: 'agent', text: 'Got it, scheduling a follow-up for next Tuesday.', time: '09:06 AM' }
        ]
      },
      {
        id: 4,
        userName: 'Markus Weber',
        avatar: 'https://i.pravatar.cc/150?img=4',
        lastMessage: 'Okay, I will process the refund immediately.',
        time: '1:30 PM',
        messages: [
          { sender: 'user', text: 'The last transaction failed. Can I get a refund?', time: '1:28 PM' },
          { sender: 'agent', text: 'I apologize for the inconvenience. Okay, I will process the refund immediately.', time: '1:30 PM' }
        ]
      },
      {
        id: 5,
        userName: 'Customer Support',
        avatar: 'https://i.pravatar.cc/150?img=5',
        lastMessage: 'Your ticket has been escalated. Expect a call soon.',
        time: '11:00 AM',
        messages: [
          { sender: 'user', text: 'My login details are not working.', time: '10:55 AM' },
          { sender: 'agent', text: 'I see. Your ticket has been escalated. Expect a call soon.', time: '11:00 AM' }
        ]
      },
      {
        id: 6,
        userName: 'David Lee',
        avatar: 'https://i.pravatar.cc/150?img=6',
        lastMessage: 'Hello! I need assistance with my account settings.',
        time: 'Just now',
        messages: [
          { sender: 'user', text: 'Hello! I need assistance with my account settings.', time: 'Just now' }
        ]
      }
    ]
  }

  // Persist chats when changed
  watch(chats, (val) => {
    localStorage.setItem('chats', JSON.stringify(val))
  }, { deep: true })

  isReady.value = true
})

// 🔹 Select chat
const selectChat = (id) => {
  selectedChatId.value = id
}

// 🔹 Active chat
const activeChat = computed(() =>
  chats.value.find(c => c.id === selectedChatId.value)
)

// 🔹 Add new client
function addClient() {
  if (!newClientName.value.trim()) return

  const newId = Date.now()
  const avatarNum = Math.floor(Math.random() * 70) + 1

  const newChat = {
    id: newId,
    userName: newClientName.value.trim(),
    avatar: `https://i.pravatar.cc/150?img=${avatarNum}`,
    lastMessage: '',
    time: '',
    messages: []
  }

  chats.value.unshift(newChat)
  selectedChatId.value = newId
  newClientName.value = ''
  showModal.value = false
}

// 🔹 Send message
function handleSendMessage({ chatId, message }) {
  const chat = chats.value.find(c => c.id === chatId)
  if (chat) {
    chat.messages.push(message)
    chat.lastMessage = message.text
    chat.time = message.time
  }
}
</script>

