<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-6">
    <div class="text-center max-w-lg">
      <AppLogo size="lg" center class="mb-8" />
      
      <h2 class="text-3xl font-semibold text-gray-800 mb-4">Welcome to Akili AI</h2>
      <p class="text-gray-600 mb-8 text-lg leading-relaxed">
        You're just a few steps away from creating your first intelligent chatbot. 
        Let's get you set up with everything you need to succeed.
      </p>
      
      <div class="space-y-4">
        <NuxtLink 
          to="/register" 
          class="block w-full bg-[#7F56D9] text-white py-4 px-8 rounded-lg text-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
        >
          Get Started
        </NuxtLink>
        <NuxtLink 
          to="/login" 
          class="block w-full border-2 border-[#7F56D9] text-[#7F56D9] py-4 px-8 rounded-lg text-lg font-medium hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
        >
          Sign In
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useAuthStore} from '~/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

// Check if already logged in
onMounted(() => {
  authStore.initializeAuth()
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  }
})
</script>