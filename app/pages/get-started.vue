<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
    <div class="text-center max-w-lg">
      <AppLogo class="h-32 md:h-44 w-auto transition-all duration-300" size="md" center />
      
      <h2 class="text-3xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors">Welcome to Xeli ai</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed transition-colors">
        You're just a few steps away from creating your first intelligent chatbot. 
        Let's get you set up with everything you need to succeed.
      </p>
      
      <div class="space-y-4">
        <NuxtLink 
          to="/register" 
          class="block w-full bg-[#9E4CFF] text-white py-4 px-8 rounded-lg text-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
        >
          Get Started
        </NuxtLink>
        <NuxtLink 
          to="/login" 
          class="block w-full border-2 border-[#9E4CFF] text-[#9E4CFF] py-4 px-8 rounded-lg text-lg font-medium hover:bg-purple-100 dark:hover:bg-purple-900/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
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
  if (authStore.isLoggedIn) {
    const user = authStore.user
    if (!user.onboarding_completed) {
      router.push('/dashboard/onboarding')
    } else if (!user.current_business_id) {
      router.push('/select-business')
    } else {
      router.push('/dashboard')
    }
  }
})
</script>