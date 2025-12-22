<!-- components/homepage/ProductSuite.vue -->
<template>

  <section class="relative py-20 bg-gray-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">

    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:bg-purple-900/20 dark:mix-blend-screen"></div>
    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-blue-900/20 dark:mix-blend-screen"></div>

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>

          <h2 
            class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent pb-2"
            style="background-image: linear-gradient(90deg, #9E4CFF, #2563EB);"
          >
            Product Suite
          </h2>

          <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-xl text-lg transition-colors">
            Pick the tools you need. Mix and match. All AI-powered.
          </p>
        </div>


        <div class="flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
          <button class="px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-900 shadow-sm dark:bg-slate-800 dark:text-white transition-colors">All</button>
          <button class="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-800">Support</button>
          <button class="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-800">Automation</button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        <article v-for="p in products" :key="p.id" 
           class="product-card group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800" 
           :style="{ '--accent': p.color }" 
           data-aos="fade-up">
           
          <div class="flex items-start gap-4">

            <div class="icon-wrap shadow-md group-hover:scale-110 transition-transform duration-300 dark:bg-slate-800">
              <img v-if="p.image" :src="`/${p.image}`" :alt="p.title" class="w-full h-full object-cover rounded-xl" />
              <div v-else class="w-full h-full bg-purple-100 dark:bg-purple-900/30 rounded-xl"></div>
            </div>
            
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap">

                <h3 class="text-lg font-bold text-gray-900 dark:text-white transition-colors">{{ p.title }}</h3>
                

                <span class="micro-label bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300">{{ p.category }}</span>
              </div>
              

              <p class="mt-2 text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors">{{ p.description }}</p>
            </div>
          </div>
          
          <hr class="my-5 border-gray-100 dark:border-slate-800 transition-colors" />
          
          <ul class="space-y-3">
            <li v-for="(f, idx) in p.features.slice(0,4)" :key="idx" class="flex items-start gap-3">

              <span class="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[10px] font-bold border border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50">✓</span>
              <p class="text-sm text-gray-600 dark:text-gray-300 transition-colors">{{ f }}</p>
            </li>
          </ul>
          
          <div class="mt-6 flex items-center justify-between pt-4">
            <NuxtLink to="/get-started" class="card-cta">Try it free</NuxtLink>
            <div class="text-xs text-gray-400 font-medium">Avg setup: <strong class="text-gray-900 dark:text-white transition-colors">2 min</strong></div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { productsuite } from '~/utils/data.js'
const products = productsuite.map((p, i) => ({ ...p, color: p.color || (['#9E4CFF','#0EA5E9','#EC4899'][i % 3]), category: p.category || ['Automation','Support','Insight'][i % 3]}))
</script>

<style scoped>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 7s infinite; }
.animation-delay-2000 { animation-delay: 2s; }

.product-card { 
  border-radius: 1rem; 
  padding: 1.5rem; 
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
  position: relative; 
  z-index: 10; 
}
.product-card:hover { 
  transform: translateY(-8px); 
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); 
  border-color: var(--accent); 
}
/* Dark mode hover shadow adjustment */
:global(.dark) .product-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); 
}

.icon-wrap { width: 52px; height: 52px; border-radius: 12px; overflow: hidden; }
.micro-label { padding: 2px 8px; border-radius: 9999px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
.card-cta { color: var(--accent); font-weight: 600; font-size: 0.9rem; display: inline-flex; align-items: center; transition: opacity 0.2s; }
.card-cta:hover { opacity: 0.8; text-decoration: underline; }
</style>