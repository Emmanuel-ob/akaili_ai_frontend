<!-- components/homepage/Features.vue -->
<template>

  <section class="relative overflow-hidden bg-white dark:bg-slate-950 py-24 transition-colors duration-300">
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

      <div class="absolute -left-[10%] top-0 w-[50%] h-[50%] bg-purple-100/60 blur-[120px] rounded-full mix-blend-multiply dark:bg-purple-900/20 dark:mix-blend-screen transition-all duration-500"></div>
      <div class="absolute -right-[10%] bottom-0 w-[50%] h-[50%] bg-blue-50/60 blur-[120px] rounded-full mix-blend-multiply dark:bg-blue-900/20 dark:mix-blend-screen transition-all duration-500"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-16">

        <h2 
          class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent pb-2"
          style="background-image: linear-gradient(90deg, #9E4CFF, #2563EB);"
        >
          Powerful Features
        </h2>
        

        <p class="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto transition-colors">
          Everything you need to create intelligent, responsive chatbots without writing a single line of code.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div v-for="(f, idx) in featuresList" :key="f.id" class="feature-card group bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800" :data-aos="'fade-up'" :data-aos-delay="idx * 50">
          <div class="flex gap-5 items-start">

            <div class="icon-wrap flex-none w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 group-hover:bg-purple-100 transition-colors duration-300 dark:bg-slate-800 dark:border-slate-700 dark:group-hover:bg-slate-700">
              <div class="icon w-6 h-6 text-purple-600 dark:text-purple-400" v-html="f.icon"></div>
            </div>
            
            <div class="flex-1 min-w-0">

              <h3 class="text-gray-900 dark:text-white text-lg font-bold leading-snug group-hover:text-[#9E4CFF] dark:group-hover:text-purple-400 transition-colors duration-300">{{ f.title }}</h3>
              

              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">{{ f.description }}</p>
            </div>
          </div>
          
          <div class="mt-5 pt-5 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
            <div class="flex items-center gap-2">
              <span v-if="f.popular" class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wide border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">Popular</span>
            </div>
            <NuxtLink to="/get-started" class="text-xs font-semibold text-[#9E4CFF] dark:text-purple-400 flex items-center gap-1 group/link">
              Learn more <span class="group-hover/link:translate-x-1 transition-transform">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { features } from '~/utils/data.js'
const featuresList = features
</script>

<style scoped>
/* Updated card styles to handle dark mode via CSS variables or Tailwind classes directly in template above */
.feature-card { 
  /* background & border handled in template via tailwind classes */
  border-width: 1px; 
  border-radius: 1.25rem; 
  padding: 1.75rem; 
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); 
  transition: all 0.3s ease; 
}
.feature-card:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); 
  border-color: #d8b4fe; 
}
/* Ensure dark mode hover border is visible but subtle */
:global(.dark) .feature-card:hover {
  border-color: #9333ea; /* Purple 600 */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); 
}
:deep(svg) { width: 100%; height: 100%; }
</style>