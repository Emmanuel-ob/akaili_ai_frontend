  <!-- layouts/dashboard.vue -->
 <!-- layouts/dashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
    
    <!-- Desktop Sidebar -->
    <div
      class="lg:w-64 bg-white dark:bg-slate-900 shadow-sm border-r border-gray-200 dark:border-slate-800 fixed h-full hidden lg:flex flex-col justify-between transition-colors duration-300">
      
      <div class="flex flex-col h-full">
        <!-- LOGO -->
        <div class="py-6 flex justify-center items-center">
          <NuxtLink to="/" class="font-bold text-2xl w-full flex justify-center items-center sm:text-3xl" aria-label="Xeli AI Home">
            <NuxtImg width="150" height="150" src="/logo-small.png" format="webp" alt="Xeli AI Logo" loading="eager" />
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="mt-2 px-3 space-y-1 flex-1 overflow-y-auto">
          
          <!-- Dashboard -->
          <NuxtLink to="/dashboard"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
            :class="$route.path === '/dashboard' 
              ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z"></path>
            </svg>
            Dashboard
          </NuxtLink>

          <!-- Chatbot Setup -->
          <NuxtLink to="/dashboard/chatbot-setup"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
            :class="$route.path === '/dashboard/chatbot-setup' 
              ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
              </path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Chatbot Setup
          </NuxtLink>

          <!-- Knowledge Base -->
          <NuxtLink to="/dashboard/knowledge-base"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
            :class="$route.path === '/dashboard/knowledge-base' 
              ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4">
              </path>
            </svg>
            Knowledge-base
          </NuxtLink>

          <!-- Conversations -->
          <NuxtLink to="/dashboard/live-monitoring"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
            :class="$route.path === '/live-monitoring' 
              ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
              </path>
            </svg>
            Conversations
          </NuxtLink>

          <!-- Analytics -->
          <NuxtLink to="/analytics"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
            :class="$route.path === '/analytics' 
              ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
              </path>
            </svg>
            Analytics
          </NuxtLink>

          <!-- Test Chat -->
          <NuxtLink to="/dashboard/test-chat"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
            :class="$route.path === '/dashboard/test-chat' 
              ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
              </path>
            </svg>
            Test Chat
          </NuxtLink>

          <!-- Team Members -->
          <NuxtLink to="/dashboard/team-members"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
            :class="$route.path === '/dashboard/team-members'
              ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-9a4 4 0 11-8 0 4 4 0 018 0zm8 4a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Team Members
          </NuxtLink>

          <!-- Email Marketing -->
          <NuxtLink to="/dashboard/email-marketing"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
            :class="$route.path === '/dashboard/email-marketing'
              ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l9 6 9-6M3 8v8a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9 6 9-6" />
            </svg>
            Email Marketing
          </NuxtLink>

          <!-- Agent Chat -->
          <NuxtLink to="/dashboard/agent-chat"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
            :class="$route.path === '/dashboard/agent-chat'
              ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
            </svg>
            Agent Chat
          </NuxtLink>

          <!-- Settings -->
          <NuxtLink to="/dashboard/settings"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
            :class="$route.path === '/dashboard/settings'
              ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
            <Icon name="lucide:settings" class="w-5 h-5 mr-3" />
            Settings
          </NuxtLink>
        </nav>
      </div>

      <!-- User Menu -->
      <div class="flex items-center space-x-4 px-6 py-4 border-t border-gray-200 dark:border-slate-800">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Welcome back 👋<br>
          <span class="font-medium text-gray-900 dark:text-gray-200">{{ authStore.user?.name || 'User' }}</span>
        </div>
        <button @click="handleLogout"
          class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none px-3 py-1 rounded hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
          Logout
        </button>
      </div>
    </div>


    <!-- Mobile Sidebar Overlay -->
    <div v-if="mobileSidebarOpen" 
         class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
         @click="closeSidebar"></div>

    <!-- Mobile Sidebar -->
    <aside v-if="mobileSidebarOpen" 
           class="fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 shadow-2xl p-3 lg:hidden flex flex-col transition-colors duration-300">
      
      <div class="flex justify-between items-center mb-6 px-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
        <button @click="closeSidebar" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          ✕
        </button>
      </div>

      <div class="h-full flex flex-col justify-between overflow-y-auto pb-6">
        <div>
           <!-- LOGO -->
           <NuxtLink to="/" class="font-bold text-2xl w-full flex justify-center items-center sm:text-3xl mb-4" aria-label="Xeli AI Home">
             <NuxtImg width="100" height="100" src="/logo-small.png" format="webp" alt="Xeli AI Logo" loading="eager" />
           </NuxtLink>

          <!-- Navigation (Mobile) -->
          <nav class="mt-2 px-3 space-y-1">
             <!-- Dashboard -->
             <NuxtLink to="/dashboard"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="$route.path === '/dashboard' 
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z"></path>
              </svg>
              Dashboard
            </NuxtLink>

            <!-- Chatbot Setup -->
            <NuxtLink to="/dashboard/chatbot-setup"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="$route.path === '/dashboard/chatbot-setup' 
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                </path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Chatbot Setup
            </NuxtLink>

            <!-- Knowledge Base -->
            <NuxtLink to="/dashboard/knowledge-base"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="$route.path === '/dashboard/knowledge-base' 
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4">
                </path>
              </svg>
              Knowledge-base
            </NuxtLink>

            <!-- Conversations -->
            <NuxtLink to="/dashboard/live-monitoring"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="$route.path === '/live-monitoring' 
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                </path>
              </svg>
              Conversations
            </NuxtLink>

            <!-- Analytics -->
            <NuxtLink to="/analytics"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="$route.path === '/analytics' 
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                </path>
              </svg>
              Analytics
            </NuxtLink>

            <!-- Test Chat -->
            <NuxtLink to="/dashboard/test-chat"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="$route.path === '/dashboard/test-chat' 
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                </path>
              </svg>
              Test Chat
            </NuxtLink>

            <!-- Team Members -->
            <NuxtLink to="/dashboard/team-members"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200" 
              :class="$route.path === '/dashboard/team-members'
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-9a4 4 0 11-8 0 4 4 0 018 0zm8 4a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              Team Members
            </NuxtLink>

            <!-- Email Marketing -->
            <NuxtLink to="/dashboard/email-marketing"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="$route.path === '/dashboard/email-marketing'
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l9 6 9-6M3 8v8a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9 6 9-6" />
              </svg>
              Email Marketing
            </NuxtLink>
              
            <!-- Agent Chat -->
            <NuxtLink to="/dashboard/agent-chat"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="$route.path === '/dashboard/agent-chat'
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
              </svg>
              Agent Chat
            </NuxtLink>

            <!-- Settings -->
            <NuxtLink to="/dashboard/settings"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="$route.path === '/dashboard/settings'
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
              <Icon name="lucide:settings" class="w-5 h-5 mr-3" />
              Settings
            </NuxtLink>
          </nav>
        </div>


        <!-- User Menu (Mobile) -->
        <div class="flex items-center space-x-4 px-3 py-7 border-t border-gray-200 dark:border-slate-800">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Welcome back 👋<br>
            <span class="font-medium text-gray-900 dark:text-gray-200">{{ authStore.user?.name || 'User' }}</span>
          </div>
          <button @click="handleLogout"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none px-3 py-1 rounded hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            Logout
          </button>
        </div>

      </div>

    </aside>

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64">
      <slot />
    </div>


    <!-- Floating Hamburger FAB -->
    <button @click="toggleSidebar"
      class="lg:hidden fixed left-4 bottom-[20%] z-50 bg-[#9E4CFF] text-white rounded-full p-4 shadow-lg hover:bg-[#6C47B5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9E4CFF] transition-transform active:scale-95">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()       
const mobileSidebarOpen = ref(false)

const toggleSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}
const closeSidebar = () => {
  mobileSidebarOpen.value = false
}
 const handleLogout = async () => {
    await authStore.logout()
    router.push('/login')
  }

  onMounted(() => {
    if (!authStore.isLoggedIn) {
      router.push('/login')
    }
  })
</script>
