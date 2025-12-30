<template>
  <article
    :class="[
      'relative rounded-2xl p-6 md:p-10 flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1',
      featured
        ? 'text-white z-40 overflow-visible shadow-2xl shadow-purple-900/20'
        : 'bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-slate-900 dark:text-white z-10 overflow-hidden shadow-sm hover:shadow-lg'
    ]"
    role="region"
    :aria-labelledby="idTitle"
    data-aos="fade-up"
    :data-aos-delay="featured ? '0' : '100' "
  >
    <!-- Ribbon -->
    <div
      v-if="featured"
      class="absolute left-1/2 -translate-x-1/2 -top-3 pointer-events-none z-50"
    >  
      <span class="inline-block px-4 py-1 rounded-full bg-[#FFD700] text-xs font-bold text-slate-900 shadow-sm uppercase tracking-wider">  
        Most Popular
      </span>    
    </div>
    
    <!-- Featured Background -->
    <div
      v-if="featured"
      aria-hidden
      class="absolute inset-0 rounded-2xl pointer-events-none z-0"
      :style="{
        background: 'linear-gradient(135deg, #9E4CFF 0%, #7C3AED 100%)',
      }"    
    ></div>

    <!-- Content -->
    <div class="relative z-20 flex flex-col h-full">
      <header class="mb-4">
        <h3 :id="idTitle" class="text-2xl md:text-3xl font-extrabold tracking-tight">
          {{ title }}  
        </h3>
        <p 
          :class="featured ? 'text-purple-100' : 'text-slate-500 dark:text-slate-400'" 
          class="mt-2 text-sm font-medium transition-colors"
        >
          {{ subtitle }}
        </p>  
      </header>  

      <div class="flex items-baseline gap-1 mb-8">
        <div class="text-4xl md:text-5xl font-extrabold leading-none tracking-tight">
          <span v-if="priceText" class="inline-block">{{ priceText }}</span>
        </div>
        <span v-if="priceSuffix" :class="featured ? 'text-purple-100' : 'text-slate-500 dark:text-gray-400'" class="text-lg font-medium opacity-80">{{ priceSuffix }}</span>  
      </div>  

      <div class="w-full h-px mb-6" :class="featured ? 'bg-purple-400/30' : 'bg-gray-100 dark:bg-slate-800'"></div>

      <ul class="flex-1 space-y-4 text-sm mb-8">
        <li
          v-for="(f, i) in features"
          :key="i"
          class="flex gap-3 items-start"
        >  
          <!-- Checkmark Icon -->
          <svg :class="featured ? 'text-white' : 'text-[#9E4CFF]'" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span 
            :class="featured ? 'text-white' : 'text-slate-700 dark:text-slate-300'" 
            class="text-sm font-medium leading-tight transition-colors"
          >
            {{ f }}
          </span>  
        </li>  
      </ul>  

      <div class="mt-auto">
        <button
          @click="$emit('select-plan', planId)"
          :class="[
            'w-full px-6 py-4 rounded-xl font-bold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
            featured
              ? 'bg-white text-[#9E4CFF] hover:bg-gray-50 focus:ring-white shadow-lg'
              : 'bg-[#111827] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 focus:ring-purple-500 shadow-md hover:shadow-lg'
          ]"      
        >
          {{ cta }}
        </button>  
      </div>  
    </div>  
  </article>    
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  planId: { type: String, required: true }, // Added for logic
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  priceText: { type: String, default: 'Free' },
  priceSuffix: { type: String, default: '' },
  features: { type: Array, default: () => [] },
  cta: { type: String, default: 'Get Started' },
  featured: { type: Boolean, default: false }
})

defineEmits(['select-plan'])

const idTitle = computed(() => 'plan-' + props.title.toLowerCase().replace(/\s+/g, '-'))
</script>