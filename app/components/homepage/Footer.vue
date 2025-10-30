<template>
  <footer class="pt-16 pb-16 bg-[#111827] text-white">
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
      <!-- 1: logo + blurb + icons -->
      <div>
        <div class="text-3xl font-bold">
            <h3 class=" text-white text-xl font-bold">Xeli ai</h3>
        </div>

        <p class="mt-5 text-base font-semibold text-[#9CA3AF]">
          Intelligent chatbots that connect to your data and provide exceptional customer experiences
        </p>

        <div class="flex items-center space-x-4 mt-6">
          <NuxtLink to="#" aria-label="facebook" class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            <NuxtImg :custom="true" src="facebook-footer-icon.png" format="webp" v-slot="{ src, imgAttrs }">
              <img :src="src" v-bind="imgAttrs" alt="facebook" class="w-full h-full object-contain" />
            </NuxtImg>
          </NuxtLink>

          <NuxtLink to="#" aria-label="instagram" class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            <NuxtImg :custom="true" src="instagram-footer-icon.png" format="webp" v-slot="{ src, imgAttrs }">
              <img :src="src" v-bind="imgAttrs" alt="instagram" class="w-full h-full object-contain" />
            </NuxtImg>
          </NuxtLink>

          <NuxtLink to="#" aria-label="youtube" class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            <NuxtImg :custom="true" src="youtube-footer-icon.png" format="webp" v-slot="{ src, imgAttrs }">
              <img :src="src" v-bind="imgAttrs" alt="youtube" class="w-full h-full object-contain" />
            </NuxtImg>
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
      <p class=" md:w-auto text-center text-lg text-[#9CA3AF]">© 2024 Xeli ai. All rights reserved.</p>

     
    </div>
  </footer>
</template>

<script setup>
// No JS required here.
// Notes:
// - Place images in `public/` root: e.g. public/logo.png, public/facebook-footer-icon.png, etc.
// - Nuxt auto-serves files from /public at the app root: src="logo.png" -> /logo.png
// - Using :custom="true" + v-slot ensures the class is applied to the actual <img> element.
</script>
