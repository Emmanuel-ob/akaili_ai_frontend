<script setup>
import { Moon, Sun } from 'lucide-vue-next'
const colorMode = useColorMode()

const toggleTheme = () => {
  // If we are currently dark, force light. Otherwise force dark.
  if (colorMode.value === 'dark') {
    colorMode.preference = 'light'
  } else {
    colorMode.preference = 'dark'
  }
}
</script>

<template>
  <button 
    @click="toggleTheme" 
    class="relative group p-2 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-hidden"
    :class="colorMode.value === 'dark' ? 'bg-slate-800 text-yellow-400' : 'bg-purple-50 text-purple-600'"
  >
    <!-- Background hover effect -->
    <span class="absolute inset-0 w-full h-full bg-current opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></span>

    <div class="relative w-6 h-6 flex items-center justify-center">
      <Sun 
        class="w-6 h-6 absolute transform transition-all duration-500" 
        :class="colorMode.value === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'"
      />
      <Moon 
        class="w-6 h-6 absolute transform transition-all duration-500" 
        :class="colorMode.value === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'"
      />
    </div>
  </button>
</template>