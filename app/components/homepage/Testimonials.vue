<template>
  <section >
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-8">
          <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent" style="background-image: linear-gradient(90deg,#9E4CFF, #ffffff);">
          Customer Testimonies
        </h2>
        <p class="main_subheader">Join thousands of satisfied customers who've transformed their customer support</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article 
        v-for="t in testimonialsList" :key="t.id" 
          data-aos="fade-up"
          :data-aos-delay="t.id * 80" 
          class="bg-white p-6 rounded-lg shadow-sm">
          <p class="text-lg mt-8 px-4 text-slate-500">“{{ t.quote }}”</p>

          <div class="mt-4 flex items-center gap-3">
            <img
              v-if="t.avatar"
              :src="t.avatar"
              :alt="t.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div class=" font-bold text-slate-800">{{ t.name }}</div>
              <div class="text-sm text-slate-500">{{ t.role }}</div>
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

<style scoped>
/* nothing extra */
</style>
