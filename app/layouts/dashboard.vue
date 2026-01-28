<!-- layouts/dashboard.vue -->
<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300"
  >
    <div
      class="lg:w-72 bg-white dark:bg-slate-900 shadow-sm border-r border-gray-200 dark:border-slate-800 fixed h-full hidden lg:flex flex-col justify-between transition-colors duration-300"
    >
      <div class="flex flex-col h-full">
        <div
          class="h-20 flex justify-center items-center border-b border-gray-50 dark:border-slate-800/50"
        >
          <NuxtLink
            to="/"
            class="flex justify-center items-center w-full px-6"
            aria-label="Xeli AI Home"
          >
            <!-- Added object-contain and explicit dimensions to prevent squishing -->
            <NuxtImg
              src="/Logo.png"
              format="webp"
              alt="Xeli AI Logo"
              class="h-30 w-auto object-contain"
              loading="eager"
        <!-- LOGO (Fixed constraints) -->
        <div class="h-20 flex justify-center items-center border-b border-gray-50 dark:border-slate-800/50">
          <NuxtLink to="/" class="flex justify-center items-center w-full px-6" aria-label="Xeli AI Home">
            <NuxtImg 
                src="/Logo.png" 
                format="webp" 
                alt="Xeli AI Logo" 
                class="h-30 w-auto object-contain" 
                loading="eager" 
            />
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav
          class="mt-6 px-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar font-subheading"
        >
          <!-- Dashboard -->
          <NuxtLink
            to="/dashboard"
            class="flex items-center px-4 gap-2 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="
              $route.path === '/dashboard'
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <LayoutDashboard class="text-black dark:text-white" :size="20" />
            Dashboard
          </NuxtLink>

          <!-- Chatbot Setup -->
          <NuxtLink
            to="/dashboard/chatbot-setup"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="
              $route.path.startsWith('/dashboard/chatbot-setup')
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <Settings2 class="text-black dark:text-white" :size="20" />
            Chatbot Setup
          </NuxtLink>

          <!-- Knowledge Base -->
          <NuxtLink
            to="/dashboard/knowledge-base"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="
              $route.path.startsWith('/dashboard/knowledge-base')
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <BookOpenText class="text-black dark:text-white" :size="20" />
            Knowledge Base
          </NuxtLink>

          <!-- Database -->
          <NuxtLink
            to="/dashboard/database"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="
              $route.path === '/dashboard/database'
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <Database class="text-black dark:text-white" :size="20" />
            Database
          </NuxtLink>

          <!-- Conversations -->
          <NuxtLink
            to="/dashboard/live-monitoring"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="
              $route.path.startsWith('/dashboard/live-monitoring')
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <MessagesSquare class="text-black dark:text-white" :size="20" />
          <NuxtLink to="/dashboard/live-monitoring"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="$route.path.startsWith('/dashboard/live-monitoring')
              ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'">
            <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.906-1.468L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
              </path>
            </svg>
            Conversations
          </NuxtLink>

          <!-- Analytics -->
          <NuxtLink
            to="/dashboard/analytics"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="
              $route.path.startsWith('/dashboard/analytics')
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <ChartNoAxesCombined
              class="text-black dark:text-white"
              :size="20"
            />
            Analytics
          </NuxtLink>

          <!-- Test Chat -->
          <NuxtLink
            to="/dashboard/test-chat"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="
              $route.path.startsWith('/dashboard/test-chat')
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <MessageSquareText class="text-black dark:text-white" :size="20" />
            Test Chat
          </NuxtLink>

          <!-- Team Members -->
          <NuxtLink
            to="/dashboard/team-members"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="
              $route.path.startsWith('/dashboard/team-members')
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <Users class="text-black dark:text-white" :size="20" />
            Team Members
          </NuxtLink>

          <!-- Email Marketing -->
          <NuxtLink
            to="/dashboard/email-marketing"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="
              $route.path.startsWith('/dashboard/email-marketing')
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <Mails class="text-black dark:text-white" :size="20" />
            Email Marketing
          </NuxtLink>

          <!-- Agent Chat -->
          <NuxtLink
            to="/dashboard/agent-chat"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="
              $route.path.startsWith('/dashboard/agent-chat')
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <BotMessageSquare class="text-black dark:text-white" :size="20" />
            Agent Chat
          </NuxtLink>

          <!-- Settings -->
          <NuxtLink
            to="/dashboard/settings"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="
              $route.path.startsWith('/dashboard/settings')
                ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <Cog class="text-black dark:text-white" :size="20" />
            Settings
          </NuxtLink>
        </nav>
      </div>

      <!-- User Menu -->
      <div
        class="flex items-center justify-between space-x-2 px-6 py-4 border-t border-gray-200 dark:border-slate-800 font-heading"
      >
        <div class="flex items-center gap-2 overflow-hidden">
          <div
            class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold"
          >
            {{ authStore.user?.name?.charAt(0).toUpperCase() || "U" }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 truncate">
            <span
              class="font-medium text-gray-900 dark:text-gray-200 block truncate max-w-25"
              >{{ authStore.user?.name || "User" }}</span
            >
          </div>
            <!-- Profile Picture with Fallback -->
           <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold shrink-0 overflow-hidden border border-gray-200 dark:border-slate-700">
              <img v-if="authStore.user?.avatar" 
                  :src="authStore.user.avatar" 
                  :key="authStore.user.avatar" 
                  class="w-full h-full object-cover" 
                  alt="Avatar" />
              <span v-else>{{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}</span>
          </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 truncate">
                <span class="font-medium text-gray-900 dark:text-gray-200 block truncate max-w-[100px]">{{ authStore.user?.name || 'User' }}</span>
            </div>
        </div>

        <div class="flex items-center gap-1">
          <!-- Desktop Theme Toggle -->
          <ThemeToggle />
          <button
            class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Logout"
            @click="handleLogout"
          >
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="mobileSidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
      @click="closeSidebar"
    />

    <!-- Mobile Sidebar (Width remains standard for mobile) -->
    <aside
      v-if="mobileSidebarOpen"
      class="fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl p-4 lg:hidden flex flex-col transition-colors duration-300"
    >
    <!-- Mobile Sidebar -->
    <aside v-if="mobileSidebarOpen"
      class="fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl p-4 lg:hidden flex flex-col transition-colors duration-300">
      
      <div class="flex justify-between items-center mb-6 px-2">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
        <button
          class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
          @click="closeSidebar"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <div
        class="h-full flex flex-col justify-between overflow-y-auto custom-scrollbar pb-6"
      >
        <div>
          <!-- Navigation (Mobile) - Uses same links but adjusted padding -->
          <nav class="space-y-4 font-subheading">
            <!-- ... (Copying all links from desktop but keeping them here for mobile structure) ... -->
            <!-- For brevity, using the same NuxtLinks as above but ensuring they are inside the mobile container -->

            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
              :class="
                $route.path === '/dashboard'
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              "
            >
              <LayoutDashboard class="text-black dark:text-white" :size="20" />
              Dashboard
            </NuxtLink>

            <!-- ... (Repeat other links: Chatbot Setup, KB, Database, Live Monitoring, Analytics, Test Chat, Team, Email, Agent, Settings) ... -->
            <!-- You should copy the exact NuxtLinks from the desktop section above into here -->

            <NuxtLink
              to="/dashboard/chatbot-setup"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
              :class="
                $route.path.startsWith('/dashboard/chatbot-setup')
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              "
            >
              <Settings2 class="text-black dark:text-white" :size="20" />
              Chatbot Setup
            </NuxtLink>

            <NuxtLink
              to="/dashboard/knowledge-base"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
              :class="
                $route.path.startsWith('/dashboard/knowledge-base')
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              "
            >
              <BookOpenText class="text-black dark:text-white" :size="20" />
              Knowledge Base
            </NuxtLink>

            <NuxtLink
              to="/dashboard/database"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
              :class="
                $route.path === '/dashboard/database'
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              "
            >
              <Database class="text-black dark:text-white" :size="20" />
              Database
            </NuxtLink>

            <NuxtLink
              to="/dashboard/live-monitoring"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
              :class="
                $route.path.startsWith('/dashboard/live-monitoring')
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              "
            >
              <MessagesSquare class="text-black dark:text-white" :size="20" />
              Conversations
            </NuxtLink>

            <NuxtLink
              to="/dashboard/analytics"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
              :class="
                $route.path.startsWith('/dashboard/analytics')
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              "
            >
              <ChartNoAxesCombined
                class="text-black dark:text-white"
                :size="20"
              />
              Analytics
            </NuxtLink>

            <NuxtLink
              to="/dashboard/test-chat"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
              :class="
                $route.path.startsWith('/dashboard/test-chat')
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              "
            >
              <MessageSquareText
                class="text-black dark:text-white"
                :size="20"
              />
              Test Chat
            </NuxtLink>

            <NuxtLink
              to="/dashboard/team-members"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
              :class="
                $route.path.startsWith('/dashboard/team-members')
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              "
            >
              <Users class="text-black dark:text-white" :size="20" />
              Team Members
            </NuxtLink>

            <NuxtLink
              to="/dashboard/email-marketing"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
              :class="
                $route.path.startsWith('/dashboard/email-marketing')
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              "
            >
              <Mails class="text-black dark:text-white" :size="20" />
              Email Marketing
            </NuxtLink>

            <NuxtLink
              to="/dashboard/agent-chat"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
              :class="
                $route.path.startsWith('/dashboard/agent-chat')
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              "
            >
              <BotMessageSquare class="text-black dark:text-white" :size="20" />
              Agent Chat
            </NuxtLink>

            <NuxtLink
              to="/dashboard/settings"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
              :class="
                $route.path.startsWith('/dashboard/settings')
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              "
            >
              <!-- <Icon name="lucide:settings" class="w-5 h-5 mr-3" /> -->

              <Cog class="text-black dark:text-white" :size="20" />
              Settings
            </NuxtLink>
          </nav>
          <!-- Navigation (Mobile) -->
           <nav class="space-y-1">
             <!-- Links repeated for mobile -->
             <NuxtLink to="/dashboard" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200" :class="$route.path === '/dashboard' ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z"></path></svg>
                Dashboard
             </NuxtLink>
             
              <NuxtLink to="/dashboard/chatbot-setup" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl" :class="$route.path.startsWith('/dashboard/chatbot-setup') ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Chatbot Setup
              </NuxtLink>

              <NuxtLink to="/dashboard/knowledge-base" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl" :class="$route.path.startsWith('/dashboard/knowledge-base') ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                Knowledge Base
              </NuxtLink>

              <NuxtLink to="/dashboard/database" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl" :class="$route.path === '/dashboard/database' ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                Database
              </NuxtLink>

              <NuxtLink to="/dashboard/live-monitoring" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl" :class="$route.path.startsWith('/dashboard/live-monitoring') ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.906-1.468L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                Conversations
              </NuxtLink>

              <NuxtLink to="/dashboard/analytics" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl" :class="$route.path.startsWith('/dashboard/analytics') ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Analytics
              </NuxtLink>
              
              <NuxtLink to="/dashboard/test-chat" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl" :class="$route.path.startsWith('/dashboard/test-chat') ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                Test Chat
              </NuxtLink>

              <NuxtLink to="/dashboard/team-members" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl" :class="$route.path.startsWith('/dashboard/team-members') ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-9a4 4 0 11-8 0 4 4 0 018 0zm8 4a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                Team Members
              </NuxtLink>

              <NuxtLink to="/dashboard/email-marketing" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl" :class="$route.path.startsWith('/dashboard/email-marketing') ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l9 6 9-6M3 8v8a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9 6 9-6" /></svg>
                Email Marketing
              </NuxtLink>

              <NuxtLink to="/dashboard/agent-chat" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl" :class="$route.path.startsWith('/dashboard/agent-chat') ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" /></svg>
                Agent Chat
              </NuxtLink>

              <NuxtLink to="/dashboard/settings" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl" :class="$route.path.startsWith('/dashboard/settings') ? 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <Icon name="lucide:settings" class="w-5 h-5 mr-3" />
                Settings
              </NuxtLink>
           </nav>
        </div>

        <div
          class="flex items-center justify-between px-2 pt-6 border-t border-gray-100 dark:border-slate-800 font-subheading"
        >
          <div class="flex items-center gap-3">
            <ThemeToggle />
            <div
              class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate"
            >
              {{ authStore.user?.name || "User" }}
            </div>
          </div>
          <button
            class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 bg-gray-50 dark:bg-slate-800 rounded-lg"
            @click="handleLogout"
          >
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area (Adjusted margin for wider sidebar) -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-72 pt-16 lg:pt-0">
       <slot />
    </div>

    <!-- Floating Hamburger FAB -->
    <button
      class="lg:hidden fixed right-4 bottom-[5%] z-50 bg-[rgba(158,76,255,0.8)] text-white rounded-full p-4 shadow-lg hover:bg-[#6C47B5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9E4CFF] transition-transform active:scale-95"
      @click="toggleSidebar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/authStore";
import {
  LayoutDashboard,
  LogOut,
  Cog,
  BookOpenText,
  Database,
  MessageSquareText,
  ChartNoAxesCombined,
  Users,
  Mails,
  MessagesSquare,
  Settings2,
  BotMessageSquare,
} from "lucide-vue-next";
import ThemeToggle from "~/components/ui/ThemeToggle.vue";

const authStore = useAuthStore();
const router = useRouter();
const mobileSidebarOpen = ref(false);

const toggleSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value;
};
const closeSidebar = () => {
  mobileSidebarOpen.value = false;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push("/login");
  }
});
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}
.dark .custom-scrollbar {
  scrollbar-color: #334155 transparent;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #475569;
}
</style>
