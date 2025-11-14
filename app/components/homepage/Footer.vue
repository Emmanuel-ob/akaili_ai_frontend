<template>
  <footer class="pt-16 pb-16 bg-[#111827] text-white">
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
      <!-- 1: logo + blurb + icons -->
      <div>
        <NuxtLink to="/" class="font-bold text-2xl sm:text-3xl" aria-label="Xeli AI Home">
        <NuxtImg width="100" height="80" src="/logo-footer.png" format="webp" alt="Xeli AI Logo" loading="eager" />
      </NuxtLink>

        <p class="mt-5 text-base font-semibold text-[#9CA3AF]">
          Intelligent chatbots that connect to your data and provide exceptional customer experiences
        </p>

        <div class="flex items-center space-x-4 mt-6"> <NuxtLink 
    to="#" 
    aria-label="facebook" 
    class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200"
  >
    <Facebook class="w-5 h-5 text-[#1877F2]" />
  </NuxtLink>

  <NuxtLink 
    to="#" 
    aria-label="instagram" 
    class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200"
  >
    <Instagram class="w-5 h-5 text-[#8A42FF]" />
  </NuxtLink>

  <NuxtLink 
    to="#" 
    aria-label="youtube" 
    class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200"
  >
    <Youtube class="w-5 h-5 text-red-600" />
  </NuxtLink>


         
        </div>
      </div>

      <!-- 2: Company links -->
      <div class="space-y-5">
        <h3 class=" text-white text-xl font-bold">Product</h3>
        <nav class="flex flex-col space-y-2 text-sm">
          <NuxtLink to="/features" class="text-[#9CA3AF] hover:text-gray-200">Features</NuxtLink>
          <NuxtLink to="/pricing" class="text-[#9CA3AF] hover:text-gray-200">Pricing</NuxtLink>
          <NuxtLink to="/interogations" class="text-[#9CA3AF] hover:text-gray-200">Interogations</NuxtLink>
          <NuxtLink to="/api" class="text-[#9CA3AF] hover:text-gray-200">API</NuxtLink>
          
        </nav>
      </div>

      <!-- 3: Support -->
      <div class="space-y-5">
        <h3 class=" text-white text-xl font-bold">Company</h3>
        <nav class="flex flex-col space-y-2 text-sm">
          <NuxtLink to="/about" class="text-[#9CA3AF] hover:text-gray-200">About</NuxtLink>
          <NuxtLink to="/blog" class="text-[#9CA3AF] hover:text-gray-200">Blog</NuxtLink>
          <NuxtLink to="/carrers" class="text-[#9CA3AF] hover:text-gray-200">Careers</NuxtLink>
          <NuxtLink to="/press" class="text-[#9CA3AF] hover:text-gray-200">Press</NuxtLink>
        </nav>
      </div>

      <!-- 4: Contact -->
      <div class="space-y-5">
        <h3 class=" text-white text-xl font-bold">Support</h3>
        <nav class="flex flex-col space-y-2 text-sm">
          <NuxtLink to="/help" class="text-[#9CA3AF] hover:text-gray-200">Help Center</NuxtLink>
          <NuxtLink to="/contact" class="text-[#9CA3AF] hover:text-gray-200">Contact</NuxtLink>
          <NuxtLink to="/privacy" class="text-[#9CA3AF] hover:text-gray-200">Privacy</NuxtLink>
          <NuxtLink to="/terms" class="text-[#9CA3AF] hover:text-gray-200">Terms</NuxtLink>
        </nav>
      </div>
    </div>

    <!-- bottom -->
    <div class="mt-8 w-95% mx-auto px-6 border-t border-white/10 pt-8 flex justify-center items-center  text-sm">
     <p class="md:w-auto text-center text-lg text-[#9CA3AF]">
  © {{ new Date().getFullYear() }} Xeli ai. All rights reserved.
</p>


     
    </div>
  </footer>
</template>

<script setup>
import { Facebook, Instagram, Youtube } from "lucide-vue-next";
</script>
