<template>
  <div class="w-full md:w-[350px] lg:w-1/3 bg-white flex flex-col shadow-lg md:shadow-none border-r border-gray-200">
    <!-- Header -->
    <div class="p-4 border-b border-gray-100 flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800">Chats</h2>
      <button
        @click="$emit('open-modal')"
        class="bg-[#7F56D9] hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition"
      >
        + New
      </button>
    </div>

    <!-- Search -->
    <div class="p-3 border-b border-gray-200">
      <div class="relative">
        <Search class="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        <input
          v-model="search"
          type="text"
          placeholder="Search user..."
          class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:outline-none text-sm"
        />
      </div>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto p-2">
      <div
        v-for="chat in filteredChats"
        :key="chat.id"
        @click="$emit('select-chat', chat.id)"
        class="flex items-center justify-between p-3 cursor-pointer transition duration-150 rounded-xl mx-1 my-1 hover:scale-[1.01] transition-transform ease-out"
        :class="selectedChatId === chat.id ? 'bg-purple-100 shadow-sm' : 'hover:bg-purple-50/50'"
      >
        <div class="flex items-center space-x-3">
          <img
            :src="chat.avatar"
            alt="User Avatar"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 class="text-sm font-semibold text-gray-900">{{ chat.userName }}</h3>
            <p class="text-xs text-gray-500 truncate max-w-[150px]">
              {{ chat.lastMessage }}
            </p>
          </div>
        </div>
        <span class="text-[10px] text-gray-400">{{ chat.time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next'
import { ref, computed } from 'vue'

const props = defineProps({
  chats: Array,
  selectedChatId: Number
})

const search = ref('')

const filteredChats = computed(() =>
  search.value
    ? props.chats.filter(c =>
        c.userName.toLowerCase().includes(search.value.toLowerCase())
      )
    : props.chats
)
</script>
