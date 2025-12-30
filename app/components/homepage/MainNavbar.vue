<!-- components/homepage/MainNavbar.vue -->
<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { navLinks } from "../../utils/data"
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/authStore'
import ThemeToggle from "../ui/ThemeToggle.vue"

const authStore = useAuthStore()
const router = useRouter()
const navOpen = ref(false)
const profileMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)

const openNav = () => navOpen.value = true
const closeNav = () => navOpen.value = false

const toggleProfileMenu = () => profileMenuOpen.value = !profileMenuOpen.value

const handleLogout = async () => {
  await authStore.logout()
  profileMenuOpen.value = false
  router.push('/login')
}

const goToDashboard = () => {
  profileMenuOpen.value = false
  router.push('/dashboard')
}

// Close profile menu when clicking outside
const handleClickOutside = (event) => {
  const profileMenu = document.querySelector('[data-profile-menu]')
  if (profileMenu && !profileMenu.contains(event.target)) {
    profileMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <nav 
     class="transition-all duration-300 h-[9vh] md:h-[10vh] lg:h-[12vh] z-[100] fixed w-full 
           bg-white/90 backdrop-blur-md 
           dark:bg-slate-900/95 dark:border-slate-800 border-b border-transparent"
    role="navigation" 
    aria-label="Main navigation"
  >
    <div class="flex items-center h-full md:w-[95%] lg:w-[95%] justify-between sm:w-[80%] mx-[2rem]">
      <!-- LOGO -->
      <NuxtLink to="/" class="font-bold text-2xl sm:text-3xl" aria-label="Xeli AI Home">
        <NuxtImg width="100" height="80" src="/logo-small.png" format="webp" alt="Xeli AI Logo" loading="eager" />
      </NuxtLink>

      <!-- Desktop Nav -->
      <div class="hidden lg:flex items-center space-x-10">
        <NuxtLink v-for="link in navLinks" :key="link.id" :to="link.url"
          class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium gap-2 flex transition-all duration-200 rounded-md px-2 py-1"
          :aria-label="link.label">
          <p>{{ link.label }}</p>
          <p class="flex items-center" v-if="link.more">
            <ChevronDown class="w-4 h-4 ml-1" aria-hidden="true" />
          </p>
        </NuxtLink>
      </div>

      <!-- Buttons & Toggles -->
      <div class="flex items-center space-x-4">
        
        <!-- THEME TOGGLE (Desktop) -->
        <div class="hidden lg:block">
          <ThemeToggle />
        </div>

        <!-- Authenticated User Menu -->
        <div v-if="isAuthenticated" class="hidden lg:block relative" data-profile-menu>
          <button @click.stop="toggleProfileMenu"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="User menu" :aria-expanded="profileMenuOpen">
            <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
              <User class="w-5 h-5 text-purple-600" aria-hidden="true" />
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ user?.name || 'User' }}</span>
            <ChevronDown class="w-4 h-4 text-gray-600 dark:text-gray-400" :class="{ 'rotate-180': profileMenuOpen }" aria-hidden="true" />
          </button>

          <!-- Dropdown Menu -->
          <Transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-if="profileMenuOpen"
              class="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-100 dark:border-slate-700"
              role="menu" aria-orientation="vertical">
              <div class="p-2">
                <button @click="goToDashboard"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-slate-700 hover:text-purple-600 rounded-md transition-colors"
                  role="menuitem">
                  <LayoutDashboard class="w-4 h-4 mr-3" aria-hidden="true" />
                  Dashboard
                </button>
                <button @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  role="menuitem">
                  <LogOut class="w-4 h-4 mr-3" aria-hidden="true" />
                  Logout
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Get Started Button -->
        <NuxtLink v-else class="hidden lg:block" to="/get-started">
          <button
            class="px-8 py-3 nav_primary_btn text-white rounded-lg transition-transform hover:-translate-y-0.5 shadow-lg shadow-purple-500/20">
            Get Started
          </button>
        </NuxtLink>

        <!-- THEME TOGGLE (Mobile) -->
        <div class="lg:hidden">
          <ThemeToggle />
        </div>

        <!-- Burger menu (Mobile) -->
        <Menu class="w-8 h-8 cursor-pointer text-gray-800 dark:text-white lg:hidden" @click="openNav" role="button"
          aria-label="Open mobile menu" tabindex="0" />
      </div>
    </div>

    <!-- Overlay -->
    <div v-if="navOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm w-full h-screen z-[1002] transition-all duration-500"
      @click="closeNav" aria-hidden="true"></div>

    <!-- Mobile Nav Drawer -->
    <aside
      class="fixed top-0 left-0 h-screen w-[80%] sm:w-[60%] bg-[#9E4CFF] text-white flex flex-col z-[1050] shadow-2xl transition-transform duration-300"
      :class="navOpen ? 'translate-x-0' : '-translate-x-full'" role="dialog" aria-modal="true"
      aria-label="Mobile navigation">
      
      <!-- Close Button (Absolute to stay fixed while content scrolls) -->
      <div class="absolute top-6 right-6 z-20">
        <X @click="closeNav" class="w-8 h-8 cursor-pointer hover:rotate-90 transition-transform hover:opacity-80"
          role="button" aria-label="Close mobile menu" tabindex="0" />
      </div>

      <!-- Scrollable Content Container -->
      <!-- 'no-scrollbar' class added via style tag below -->
      <div class="flex-1 overflow-y-auto no-scrollbar flex flex-col px-10 py-20">
        
        <!-- Navigation Links -->
        <!-- Reduced text size: text-lg sm:text-2xl -->
        <div class="flex flex-col space-y-6">
          <NuxtLink v-for="link in navLinks" :key="link.id" :to="link.url"
            class="text-lg sm:text-2xl font-semibold border-b border-white/20 pb-2 hover:border-white transition-all w-fit"
            @click="closeNav">
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Action Buttons (Pushed down if there is space) -->
        <div class="mt-auto pt-10">
          <div v-if="isAuthenticated" class="space-y-4">
            <button @click="() => { goToDashboard(); closeNav(); }"
              class="flex w-full items-center text-base sm:text-lg bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors font-medium">
              <LayoutDashboard class="w-5 h-5 mr-3" aria-hidden="true" />
              Dashboard
            </button>
            <button @click="() => { handleLogout(); closeNav(); }"
              class="flex w-full items-center text-base sm:text-lg text-red-100 hover:bg-red-500/20 px-4 py-3 rounded-xl transition-colors font-medium">
              <LogOut class="w-5 h-5 mr-3" aria-hidden="true" />
              Logout
            </button>
          </div>
          
          <NuxtLink v-else to="/get-started" @click="closeNav" class="block">
            <!-- White button with Purple text for high contrast -->
            <button
              class="w-full px-8 py-3 bg-white text-[#9E4CFF] font-bold text-base sm:text-lg rounded-xl shadow-lg hover:bg-gray-50 transition-colors">
              Get Started
            </button>
          </NuxtLink>
        </div>
      </div>
    </aside>
  </nav>
</template>

<style scoped>
/* Utility to hide scrollbar but keep functionality */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>