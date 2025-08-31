<template>
  <div class="relative overflow-hidden bg-white pt-[30vh] sm:pt-[40vh] lg:pt-[5rem] h-screen w-full flex flex-col justify-center">
    <!-- purple glow -->
    <div
      aria-hidden="true"
      class="absolute -top-[-3rem] -left-[-9rem] w-[640px] h-[640px] rounded-full pointer-events-none
             filter blur-[80px] opacity-50
             bg-[radial-gradient(circle_at_20%_20%,_rgba(124,58,237,0.65)_0%,_rgba(167,139,250,0.32)_35%,_transparent_70%)]"
    />

       <div class="relative z-10 w-full">
<div class="relative z-10 w-full ">
  <div class="grid grid-cols-1 md:grid-cols-2 items-center px-6 py-12 md:px-20 md:py-24 gap-12">
    
    <!-- left text content -->
    <div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
        Empower Your Website
        <span class="block">with 24/7 Smart</span>
        <span class="block text-[#7F56D9]">Customer Support</span>
      </h1>

      <p class="mt-5 text-base text-slate-600 max-w-lg">
        Seamlessly integrate intelligent chatbots that connect to your databases, learn from your content, 
        and provide instant customer support 24/7. No coding required.
      </p>

      <!-- buttons -->
      <div class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
        <li class="flex flex-col items-center gap-1">
            <div class=" font-bold text-slate-800 flex gap-2" >
               <NuxtImg src="/hero_brain.png" format="webp" class="w-5" alt="" /><span>99.9%</span>
            </div>
            <div class="text-xs font_color font-semibold">AI Accuracy</div>
        </li>
        <li class="flex flex-col items-center gap-1">
            <div class=" font-bold text-slate-800 flex gap-2" >
               <NuxtImg src="/hero_faster.png" format="webp" class="w-5" alt="" /><span>10x</span>
            </div>
            <div class="text-xs font_color font-semibold">Faster Processing</div>
        </li>
        <li class="flex flex-col items-center gap-1">
            <div class=" font-bold text-slate-800 flex gap-2" >
               <NuxtImg src="/hero_cpu.png" format="webp" class="w-5" alt="" /><span>1M+</span>
            </div>
            <div class="text-xs font_color font-semibold">AI Operations/Day</div>
        </li>
      </ul>
    </div>

    <!-- right image card -->
    <div class="h-full flex justify-center py-[5rem] ">
        <div class="rounded-[40px] overflow-hidden shadow-[0_0_40px_10px_rgba(126,34,206,0.4)]">
  <img src="/hero-ai.png" alt="AI Hero" class="w-full h-full object-cover rounded-[40px]" />
</div>
    </div>-

  </div>
</div>

</div>


  </div>
</template>

<script setup>
// No JS needed for static content
</script>
