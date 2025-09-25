<script setup>
import { ref } from "vue"
import { navLinks } from "../../utils/data"
import { Menu,  X, ChevronDown } from 'lucide-vue-next'

const navOpen = ref(false)

const openNav = () => {
  navOpen.value = true
}
const closeNav = () => {
  navOpen.value = false
}
</script>

<template>
  <div class="transition-all duration-200 h-[9vh] md:h-[10vh] lg:h-[12vh] z-[100] fixed w-full bg-white">
    <div class="flex items-center h-full md:w-[95%] lg:w-[95%] justify-between sm:w-[80%] mx-[2rem]">
      <!-- LOGO -->
      <NuxtLink to="/" class="font-bold text-2xl sm:text-3xl">
        <NuxtImg width="150px" src="/Logo.png" format="webp" alt="" />
      </NuxtLink>

      <!-- Desktop Nav -->
      <div class="hidden lg:flex items-center space-x-10">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.id"
          :to="link.url"
          class="hover:text-purple-400 hover:font-thin gap-2 flex transition-all duration-200"
        >
          <p>{{ link.label }}</p>
          <p class="flex items-center">
            <ChevronDown
              v-if="link.more"
              class="w-4 h-4 text-gray-600 ml-1"
            />
          </p>
        </NuxtLink>
      </div>

      <!-- Buttons -->
      <div class="flex items-center space-x-4">
        <!-- buy now button -->
        <NuxtLink class="hidden lg:block" to="/get-started">
          <button class=" px-11 py-4 nav_primary_btn text-white rounded-lg">
            Get Started
          </button>
        </NuxtLink>

        <!-- Burger menu (Mobile) -->
        <Menu 
        class="w-8 h-8 cursor-pointer text-gray-800 lg:hidden" 
          @click="openNav" 
        />
      </div>
    </div>

    <!-- Overlay -->
    <div 
      v-if="navOpen" 
      class="fixed inset-0 bg-black opacity-70 w-full h-screen z-[1002] transition-all duration-500"
      @click="closeNav"
    ></div>

    <!-- Mobile Nav Drawer -->
    <div
      class="fixed top-0 left-0 h-full w-[80%] sm:w-[60%] bg-[#7F56D9] text-white flex flex-col space-y-10 pt-20 pl-12 transform transition-transform duration-500 z-[1050]"
      :class="navOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Close Button -->
      <X 
        @click="closeNav" 
        class="absolute top-4 right-6 cursor-pointer w-6 h-6 sm:w-8 sm:h-8" 
      />

      <!-- Mobile Links -->
      <NuxtLink
        v-for="link in navLinks"
        :key="link.id"
        :to="link.url"
        class="text-xl sm:text-[30px] border-b border-white pb-1 hover:border-b-[3px] transition-all w-fit"
        @click="closeNav"
      >
        {{ link.label }}
      </NuxtLink>
       <NuxtLink to="/get-started">
          <button class=" px-11 py-4 bg-[#0b1020] hover:bg-purple-700 text-white rounded-lg">
            Get Started
          </button>
        </NuxtLink>
    </div>
  </div>
</template>
