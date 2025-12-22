<template>
  <section class="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
    <div class="max-w-6xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl transform transition-transform hover:scale-[1.01] duration-500">
      
      <div class="absolute inset-0 bg-gradient-to-br from-[#9E4CFF] to-[#4F46E5]"></div>

      <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-80 h-80 bg-purple-400 opacity-20 rounded-full blur-3xl"></div>

      <div class="relative z-10 px-6 py-16 md:py-24 text-center">
        <h3 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          {{ cta.heading }}
        </h3>
        
        <p class="mt-4 max-w-2xl mx-auto text-xl text-purple-100 font-medium">
          {{ cta.subheading }}
        </p>

        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/get-started">
            <button class="bg-white text-[#4F46E5] hover:bg-gray-50 px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl">
              Get Started Now
            </button>
          </NuxtLink>

          <NuxtLink to="/contact">
            <button class="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-colors">
              Talk to Sales
            </button>
          </NuxtLink>
        </div>
        
        <p class="mt-8 text-sm text-purple-200 opacity-80 font-medium tracking-wide uppercase">
          No credit card required · 14-day free trial
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { cta } from '~/utils/data.js'
</script>