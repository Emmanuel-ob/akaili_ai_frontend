<!-- components/homepage/MainNavbar.vue -->
<script setup>
import { ref, computed } from 'vue'
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/authStore'
import { useEcosystem } from '~/composables/useEcosystem'
import { useDropdown } from '~/composables/useDropdown'
import ThemeToggle from "../ui/ThemeToggle.vue"
import NavDropdown from './NavDropdown.vue'
import EcoLink from './EcoLink.vue'

const authStore = useAuthStore()
const router = useRouter()
const navOpen = ref(false)

const { products, loginProducts, menus } = useEcosystem()

const isAuthenticated = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)

// Products carry taglines; the other menus are plain link lists.
const productItems = products.map(p => ({
  label: p.name,
  to: p.href,
  external: p.external,
  tagline: p.tagline,
}))

// Every product you can log in to. The blog has loginHref: null, so it
// is absent here by construction.
const loginItems = loginProducts.map(p => ({
  label: p.name,
  to: p.loginHref,
  external: p.external,
}))

// Sibling products shown under the profile menu when signed in. This
// menu knows nothing about their sessions, only where they live.
const siblingItems = products.filter(p => p.external).map(p => ({
  label: p.name,
  to: p.href,
  external: true,
}))

// The mobile drawer's three accordion sections.
const drawerSections = [
  { key: 'products', label: 'Products', items: productItems },
  { key: 'business', label: 'Business', items: menus.business },
  { key: 'company', label: 'Company', items: menus.company },
]

const openNav = () => (navOpen.value = true)
const closeNav = () => (navOpen.value = false)

// Destructured into top-level consts on purpose. Vue's string template
// ref (ref="name") only binds to a top-level ref, so ref="profile.triggerRef"
// would silently never bind.
const {
  isOpen: profileOpen,
  toggle: toggleProfile,
  close: closeProfile,
  triggerRef: profileTriggerRef,
  panelRef: profilePanelRef,
} = useDropdown('profile')

const handleLogout = async () => {
  await authStore.logout()
  closeProfile()
  router.push('/login')
}

const goToDashboard = () => {
  closeProfile()
  router.push('/dashboard')
}

// Mobile accordion state.
const openSection = ref(null)
const toggleSection = (key) => (openSection.value = openSection.value === key ? null : key)

const drawerRef = ref(null)

// aria-modal is a promise to keyboard users. Without a trap, focus walks
// straight out of the drawer into the page behind it.
//
// The drawer is hidden by a CSS transform, so its contents are still
// visually removed but the :inert binding on the <aside> below now
// honours the aria-modal promise: while closed, the browser excludes the
// drawer from the tab order and the accessibility tree on its own. This
// guard is kept as a redundant safety net (older engines without inert
// support, or any future change that drops the binding) so the wrap
// logic below never fires on a closed, invisible drawer and traps focus
// inside it before the user ever opens it.
const onDrawerKeydown = (event) => {
  if (!navOpen.value) return
  if (event.key === 'Escape') { closeNav(); return }
  if (event.key !== 'Tab') return

  const focusables = drawerRef.value?.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  if (!focusables?.length) return

  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
</script>

<template>
   <nav
     class="transition-all duration-300 h-16 md:h-20 z-[100] fixed top-0 inset-x-0
         bg-white/90 backdrop-blur-md
         dark:bg-slate-900/95 dark:border-slate-800 border-b border-transparent

         "
  role="navigation"
  aria-label="Main navigation"
  >
    <div class="flex items-center h-full md:w-[95%] lg:w-[95%] justify-between sm:w-[80%] mx-[2rem]">
      <!-- LOGO -->
      <NuxtLink to="/" class="font-bold text-2xl sm:text-3xl" aria-label="Xeli AI Home">
        <NuxtImg width="100" height="80" src="/logo-small.png" format="webp" alt="Xeli AI Logo" loading="eager" />
      </NuxtLink>

      <!-- Desktop Nav -->
      <div data-desktop-nav class="hidden lg:flex items-center space-x-6">
        <NavDropdown id="products" label="Products" :items="productItems" />
        <NavDropdown id="business" label="Business" :items="menus.business" />
        <NavDropdown id="company" label="Company" :items="menus.company" />
        <NuxtLink
          to="/pricing"
          class="px-2 py-1 rounded-md font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
        >
          Pricing
        </NuxtLink>
      </div>

      <!-- Buttons & Toggles -->
      <div class="flex items-center space-x-4">

        <!-- THEME TOGGLE (Desktop) -->
        <div class="hidden lg:block">
          <ThemeToggle />
        </div>

        <!-- Authenticated User Menu -->
        <div v-if="isAuthenticated" class="hidden lg:block relative">
          <button @click.stop="toggleProfile" ref="profileTriggerRef"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="User menu" aria-haspopup="menu" :aria-expanded="profileOpen ? 'true' : 'false'">
            <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
              <User class="w-5 h-5 text-purple-600" aria-hidden="true" />
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ user?.name || 'User' }}</span>
            <ChevronDown class="w-4 h-4 text-gray-600 dark:text-gray-400" :class="{ 'rotate-180': profileOpen }" aria-hidden="true" />
          </button>

          <!-- Dropdown Menu -->
          <Transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-if="profileOpen" ref="profilePanelRef"
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
                <div class="my-2 border-t border-gray-100 dark:border-slate-700"></div>
                <p class="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  More from XeliAI
                </p>
                <EcoLink
                  v-for="item in siblingItems"
                  :key="item.label"
                  :item="item"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-slate-700 hover:text-purple-600 rounded-md transition-colors"
                  role="menuitem"
                  @click="closeProfile"
                >
                  {{ item.label }}
                </EcoLink>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Log in menu + primary CTA -->
        <div v-else class="hidden lg:flex items-center gap-3">
          <NavDropdown id="login" label="Log in" :items="loginItems" align="end" />
          <NuxtLink to="/get-started">
            <button
              class="px-8 py-3 nav_primary_btn text-white rounded-lg transition-transform hover:-translate-y-0.5 shadow-lg shadow-purple-500/20"
            >
              Get Started
            </button>
          </NuxtLink>
        </div>

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
      ref="drawerRef"
      :inert="!navOpen"
      class="fixed top-0 left-0 h-screen w-[80%] sm:w-[60%] bg-[#9E4CFF] text-white flex flex-col z-[1050] shadow-2xl transition-transform duration-300"
      :class="navOpen ? 'translate-x-0' : '-translate-x-full'" role="dialog" aria-modal="true"
      aria-label="Mobile navigation" @keydown="onDrawerKeydown">

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
        <div class="flex flex-col space-y-2">
          <div v-for="section in drawerSections" :key="section.key" class="border-b border-white/20 pb-2">
            <button
              type="button"
              data-drawer-section
              class="w-full flex items-center justify-between text-lg sm:text-2xl font-semibold py-2"
              :aria-expanded="openSection === section.key ? 'true' : 'false'"
              :aria-controls="`drawer-panel-${section.key}`"
              @click="toggleSection(section.key)"
            >
              {{ section.label }}
              <ChevronDown
                class="w-5 h-5 transition-transform"
                :class="{ 'rotate-180': openSection === section.key }"
                aria-hidden="true"
              />
            </button>
            <div
              v-show="openSection === section.key"
              :id="`drawer-panel-${section.key}`"
              class="flex flex-col space-y-3 pb-3 pl-2"
            >
              <EcoLink
                v-for="item in section.items"
                :key="item.label"
                :item="item"
                class="text-base text-white/80 hover:text-white transition-colors"
                @click="closeNav"
              >
                {{ item.label }}
              </EcoLink>
            </div>
          </div>

          <NuxtLink
            to="/pricing"
            class="text-lg sm:text-2xl font-semibold border-b border-white/20 py-2 hover:border-white transition-all"
            @click="closeNav"
          >
            Pricing
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

          <div v-else>
            <div data-drawer-logins class="mb-4 space-y-2">
              <p class="text-xs font-semibold uppercase tracking-wide text-white/60">Log in to</p>
              <EcoLink
                v-for="item in loginItems"
                :key="item.label"
                :item="item"
                class="block text-base text-white/90 hover:text-white transition-colors"
                @click="closeNav"
              >
                {{ item.label }}
              </EcoLink>
            </div>

            <NuxtLink to="/get-started" class="block" @click="closeNav">
              <!-- White button with Purple text for high contrast -->
              <button
                class="w-full px-8 py-3 bg-white text-[#9E4CFF] font-bold text-base sm:text-lg rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
              >
                Get Started
              </button>
            </NuxtLink>
          </div>
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
