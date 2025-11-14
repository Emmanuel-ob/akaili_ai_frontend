<script setup>
import { ref, computed } from "vue"
import { navLinks } from "../../utils/data"
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const navOpen = ref(false)
const profileMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)

const openNav = () => {
  navOpen.value = true
}

const closeNav = () => {
  navOpen.value = false
}

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value
}

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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav class="transition-all duration-200 h-[9vh] md:h-[10vh] lg:h-[12vh] z-[100] fixed w-full bg-white"
    role="navigation" aria-label="Main navigation">
    <div class="flex items-center h-full md:w-[95%] lg:w-[95%] justify-between sm:w-[80%] mx-[2rem]">
      <!-- LOGO -->
      <NuxtLink to="/" class="font-bold text-2xl sm:text-3xl" aria-label="Xeli AI Home">
        <NuxtImg width="100" height="80" src="/logo-small.png" format="webp" alt="Xeli AI Logo" loading="eager" />
      </NuxtLink>

      <!-- Desktop Nav -->
      <div class="hidden lg:flex items-center space-x-10">
        <NuxtLink v-for="link in navLinks" :key="link.id" :to="link.url"
          class="hover:text-purple-400 hover:font-thin gap-2 flex transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md px-2 py-1"
          :aria-label="link.label">
          <p>{{ link.label }}</p>
          <p class="flex items-center" v-if="link.more">
            <ChevronDown class="w-4 h-4 text-gray-600 ml-1" aria-hidden="true" />
          </p>
        </NuxtLink>
      </div>

      <!-- Buttons -->
      <div class="flex items-center space-x-4">
        <!-- Authenticated User Menu -->
        <div v-if="isAuthenticated" class="hidden lg:block relative" data-profile-menu>
          <button @click.stop="toggleProfileMenu"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            aria-label="User menu" :aria-expanded="profileMenuOpen">
            <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <User class="w-5 h-5 text-purple-600" aria-hidden="true" />
            </div>
            <span class="text-sm font-medium text-gray-700">{{ user?.name || 'User' }}</span>
            <ChevronDown class="w-4 h-4 text-gray-600" :class="{ 'rotate-180': profileMenuOpen }" aria-hidden="true" />
          </button>

          <!-- Dropdown Menu -->
          <Transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-if="profileMenuOpen"
              class="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              role="menu" aria-orientation="vertical">
              <div class="p-2">
                <button @click="goToDashboard"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  role="menuitem">
                  <LayoutDashboard class="w-4 h-4 mr-3" aria-hidden="true" />
                  Dashboard
                </button>
                <button @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  role="menuitem">
                  <LogOut class="w-4 h-4 mr-3" aria-hidden="true" />
                  Logout
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Get Started Button (for non-authenticated users) -->
        <NuxtLink v-else class="hidden lg:block" to="/get-started">
          <button
            class="px-11 py-4 nav_primary_btn text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors">
            Get Started
          </button>
        </NuxtLink>

        <!-- Burger menu (Mobile) -->
        <Menu class="w-8 h-8 cursor-pointer text-gray-800 lg:hidden focus:outline-none" @click="openNav" role="button"
          aria-label="Open mobile menu" tabindex="0" @keydown.enter="openNav" />
      </div>
    </div>

    <!-- Overlay -->
    <div v-if="navOpen" class="fixed inset-0 bg-black opacity-70 w-full h-screen z-[1002] transition-all duration-500"
      @click="closeNav" aria-hidden="true"></div>

    <!-- Mobile Nav Drawer -->
    <aside
      class="fixed top-0 left-0 h-full w-[80%] sm:w-[60%] bg-[#9E4CFF] text-white flex flex-col space-y-10 pt-20 pl-12 transform transition-transform duration-500 z-[1050]"
      :class="navOpen ? 'translate-x-0' : '-translate-x-full'" role="dialog" aria-modal="true"
      aria-label="Mobile navigation">
      <!-- Close Button -->
      <X @click="closeNav" class="absolute top-4 right-6 cursor-pointer w-6 h-6 sm:w-8 sm:h-8 focus:outline-none"
        role="button" aria-label="Close mobile menu" tabindex="0" @keydown.enter="closeNav" />

      <!-- Mobile Links -->
      <NuxtLink v-for="link in navLinks" :key="link.id" :to="link.url"
        class="text-xl sm:text-[30px] border-b border-white pb-1 hover:border-b-[3px] transition-all w-fit focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded"
        @click="closeNav">
        {{ link.label }}
      </NuxtLink>

      <!-- Mobile Auth Actions -->
      <div v-if="isAuthenticated" class="space-y-4">
        <button @click="() => { goToDashboard(); closeNav(); }"
          class="flex items-center text-lg hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white">
          <LayoutDashboard class="w-5 h-5 mr-3" aria-hidden="true" />
          Dashboard
        </button>
        <button @click="() => { handleLogout(); closeNav(); }"
          class="flex items-center text-lg text-red-200 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white">
          <LogOut class="w-5 h-5 mr-3" aria-hidden="true" />
          Logout
        </button>
      </div>
      <NuxtLink v-else to="/get-started" @click="closeNav">
        <button
          class="px-11 py-4 bg-[#0b1020] hover:bg-purple-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition-colors">
          Get Started
        </button>
      </NuxtLink>
    </aside>
  </nav>
</template>