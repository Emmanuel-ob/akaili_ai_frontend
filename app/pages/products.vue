<!-- pages/products.vue -->
<template>

  <div class="overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
    <div class="relative overflow-hidden w-full"> 
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: 'url(/products_hero.png)' }"
      ></div>

    
      <div class="absolute inset-0 bg-black/60 dark:bg-black/80 transition-colors duration-300"></div>

      <div class="relative z-10 w-full px-6 py-20 md:px-12 lg:px-20 md:py-32"> 
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center w-full max-w-7xl mx-auto">
          <div class="text-white space-y-6" data-aos="fade-right">
            <NuxtImg src="/logo-footer.png" format="webp" class="w-24 h-auto mb-4" alt="Xeli AI Logo" /> 
            
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Xeli AI
            </h1>
            
          
            <p class="text-lg sm:text-xl max-w-lg opacity-90 text-gray-100 dark:text-gray-300">
              A complete AI platform to build, deploy, and manage intelligent chatbots for your business. 
              From analytics and team management to live monitoring and email campaigns, everything you need is in one place.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <NuxtLink
                to="/get-started"
                class="px-8 py-4 nav_primary_btn text-white rounded-lg font-medium shadow-xl transition hover:scale-105 transform text-center"
              >
                Get Started
              </NuxtLink>
            </div>
          </div>

          <div class="flex justify-center md:justify-end mt-12 md:mt-0"> 
              <NuxtImg
              src="/product_hero.png" 
              format="webp" 
              class="w-full max-w-md lg:max-w-lg h-auto rounded-3xl shadow-2xl transition duration-500 hover:scale-[1.02]"
              alt="AI Hero" />
          </div>

        </div>
      </div>
    </div>

    <Features />
    <CtaBanner />
  </div>
</template>

<script setup> 
import Features from '../components/homepage/Features.vue'
import CtaBanner from '../components/homepage/CtaBanner.vue'
import { onMounted } from 'vue'

onMounted(() => {
  if (window.AOS) {
    window.AOS.init({ duration: 1000, once: true })
  }
})
</script>