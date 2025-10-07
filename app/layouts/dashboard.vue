<!-- layouts/dashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-50 ">
    <!-- Sidebar -->
    <div
      class="lg:w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full hidden lg:grid place-content-between  ">
      <div class="">
        <!-- Logo -->
        <NuxtLink to="/" class="p-6 ">
          <div class="flex items-center px-5">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center">
              <NuxtImg src="/dashboard_layout_logo.png" alt="dashboard logo" class="w-5 h-5" />
            </div>
            <span class="ml-3 text-xl font-bold text-gray-900">Akili AI</span>
          </div>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="mt-6 px-3">
          <div class="space-y-1">
            <NuxtLink to="/dashboard"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path === '/dashboard' ? 'bg-purple-50 text-[#7F56D9]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z"></path>
              </svg>
              Dashboard
            </NuxtLink>

            <NuxtLink to="/dashboard/chatbot-setup"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path === '/dashboard/chatbot-setup' ? 'bg-purple-50 text-[#7F56D9]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                </path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Chatbot Setup
            </NuxtLink>

            <NuxtLink to="/dashboard/database"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path === '/dashboard/database' ? 'bg-purple-50 text-[#7F56D9]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4">
                </path>
              </svg>
              Database
            </NuxtLink>

            <NuxtLink to="/dashboard/live-monitoring"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path === '/live-monitoring' ? 'bg-purple-50 text-[#7F56D9]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                </path>
              </svg>
              Conversations
            </NuxtLink>

            <NuxtLink to="/analytics"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path === '/analytics' ? 'bg-purple-50 text-[#7F56D9]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                </path>
              </svg>
              Analytics
            </NuxtLink>


            <NuxtLink to="/dashboard/test-chat"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path === '/dashboard/test-chat' ? 'bg-purple-50 text-[#7F56D9]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                </path>
              </svg>
              Test Chat
            </NuxtLink>
          </div>
        </nav>

      </div>


      <!-- User Menu -->
      <div class="flex items-center space-x-4 px-3 py-7">
        <div class="text-sm text-gray-600">
          Welcome back 👋<br>
          <span class="font-medium">{{ authStore.user?.name || 'User' }}</span>
        </div>
        <button @click="handleLogout"
          class="text-sm text-gray-500 hover:text-gray-700 focus:outline-none px-3 py-1 rounded hover:bg-gray-50">
          Logout
        </button>
      </div>

    </div>

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64">
      <!-- Header -->

      <slot />
    </div>
  </div>


</template>

<script setup>


const authStore = useAuthStore()
const router = useRouter()
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Ensure user is authenticated
onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
  }
})


</script>