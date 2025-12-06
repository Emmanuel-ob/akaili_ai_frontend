
<template>
       <div class="overflow-hidden">
    <div class="relative overflow-hidden h-screen w-full flex flex-col justify-center">

  <!-- Background image -->
  <div
    class="absolute inset-0 bg-cover bg-center"
    :style="{ backgroundImage: 'url(/products_hero.png)' }"
  ></div>

  <!-- Dark overlay for readability -->
  <div class="absolute inset-0 bg-black/60"></div>

  <!-- Hero content -->
  <div class="relative z-10 w-full px-6 py-12 md:px-20 md:py-24 flex items-center h-full">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-7  items-center w-full">

      <!-- Left Text Content -->
      <div class="text-white space-y-6" data-aos="fade-right">
        <NuxtImg src="/logo-footer.png" format="webp" class="w-50 mb-4" alt="Xeli AI Logo" />
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
          Xeli AI
        </h1>
        <p class="text-lg sm:text-xl max-w-lg">
          A complete AI platform to build, deploy, and manage intelligent chatbots for your business. 
          From analytics and team management to live monitoring and email campaigns, everything you need is in one place.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 mt-6">
          <NuxtLink
            to="/get-started"
            class="px-8 py-4 nav_primary_btn text-white rounded-lg font-medium shadow-lg transition hover:scale-105"
          >
            Get Started
          </NuxtLink>
         <!--  <a
            href="#demo"
            class="px-8 py-4 border border-purple-300 text-purple-400 rounded-lg font-medium hover:bg-purple-800/20 transition"
          >
            View Demo
          </a> -->
        </div>
      </div>

      <!-- Right Hero Image / Card -->
      <div class="flex justify-center md:justify-end" >
         <NuxtImg
          src="/product_hero.png" 
         format="webp" class="w-full max-w-lg h-auto rounded-3xl shadow-2xl"
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
    window.AOS.init({
      duration: 1000,
      once: true,
    })
  }
})
    
    </script>