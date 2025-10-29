
<template>
       <div class="overflow-hidden">
     <div class="relative overflow-hidden bg-white pt-[30vh] sm:pt-[40vh] lg:pt-[5rem] h-screen w-full flex flex-col justify-center">
    <!-- purple glow -->
    <div
    aria-hidden="true"
    class="absolute -top-[-3rem] -left-[-9rem] w-[640px] h-[640px] rounded-full pointer-events-none
    filter blur-[80px] opacity-50
    bg-[radial-gradient(circle_at_20%_20%,_rgba(124,58,237,0.65)_0%,_rgba(167,139,250,0.32)_35%,_transparent_70%)]"
    data-aos="fade-up" 
    />

       <div class="relative z-10 w-full">
<div class="relative z-10 w-full ">
  <div class="grid grid-cols-1 md:grid-cols-2 items-center px-6 py-12 md:px-20 md:py-24 gap-12" >
    
    <!-- left text content -->
    <div>
        <NuxtImg src="/product_icon.png" format="webp" class="w-20 mb-6" alt="Wxeli ai Logo"  data-aos="zoom-in-right" />
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight" data-aos="zoom-in-right">
       Wxeli ai
        
      </h1>

      <p class="mt-5 text-base text-slate-600 max-w-lg" data-aos="fade-in-right" data-aos-delay="100">
       Empower your business with an AI chatbot that understands your data, responds instantly, and supports your customers—24/7, on any channel
      </p>

      <!-- buttons -->
      <div class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4" data-aos="flip-up" data-aos-delay="200">
        <NuxtLink
          to="/get-started"
          class="px-6 py-3 nav_primary_btn text-white rounded-md font-medium transition shadow-md"
        >
          Get Started
        </NuxtLink>

        <a
          href="#"
          class="px-6 py-3 border border-purple-300 text-purple-600 rounded-md font-medium hover:bg-purple-50 transition"
        >
          View Demo
        </a>
      </div>

      <!-- stats -->
      <ul class="mt-10 flex gap-9 ">
        <li class="flex flex-col items-center gap-1" data-aos="flip-left" data-aos-delay="200" >
            <div class=" font-bold text-slate-800 flex gap-2" >
               <NuxtImg src="/hero_brain.png" format="webp" class="w-5" alt="" /><span>99.9%</span>
            </div>
            <div class="text-xs font_color font-semibold">AI Accuracy</div>
        </li>
        <li class="flex flex-col items-center gap-1" data-aos="flip-left" data-aos-delay="250" >
            <div class=" font-bold text-slate-800 flex gap-2" >
               <NuxtImg src="/hero_faster.png" format="webp" class="w-5" alt="" /><span>10x</span>
            </div>
            <div class="text-xs font_color font-semibold">Faster Processing</div>
        </li>
        <li class="flex flex-col items-center gap-1" data-aos="flip-left" data-aos-delay="300" >
            <div class=" font-bold text-slate-800 flex gap-2" >
               <NuxtImg src="/hero_cpu.png" format="webp" class="w-5" alt="" /><span>1M+</span>
            </div>
            <div class="text-xs font_color font-semibold">AI Operations/Day</div>
        </li>
      </ul>
    </div>

    <!-- right image card -->
    <div class="h-full flex justify-center py-[5rem]" data-aos="zoom-in-left">
  <img src="/product_hero.png" alt="AI Hero" class="w-full h-full object-cover rounded-[40px]" />
    </div>-

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