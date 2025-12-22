<template>
  <section>
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-8">
        <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent pb-2" 
            style="background-image: linear-gradient(90deg, #9E4CFF, #2563EB);">
          Customer Testimonies
        </h2>
      
        <p class="main_subheader text-gray-600 dark:text-gray-400 mt-4 text-lg">
          Join thousands of satisfied customers who've transformed their customer support
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article 
          v-for="t in testimonialsList" :key="t.id" 
          data-aos="fade-up"
          :data-aos-delay="t.id * 80" 
          class="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 p-6 rounded-lg shadow-sm transition-colors duration-300"
        >
        
          <p class="text-lg mt-8 px-4 text-slate-500 dark:text-gray-300 italic">“{{ t.quote }}”</p>

          <div class="mt-4 flex items-center gap-3">
            <img
              v-if="t.avatar"
              :src="t.avatar"
              :alt="t.name"
              class="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-slate-700"
            />
            <div>
            
              <div class="font-bold text-slate-800 dark:text-white">{{ t.name }}</div>
            
              <div class="text-sm text-slate-500 dark:text-gray-500">{{ t.role }}</div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { testimonials } from '~/utils/data.js'  
const testimonialsList = testimonials
</script>