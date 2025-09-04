  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    priceText: { type: String, default: 'Free' },
    priceSuffix: { type: String, default: '' },
    features: { type: Array, default: () => [] },
    cta: { type: String, default: 'Get Started' },
    featured: { type: Boolean, default: false }
  })
  
  const idTitle = computed(() => 'plan-' + props.title.toLowerCase().replace(/\s+/g, '-'))
  </script>

<template>
  <article
    :class="[
      'relative rounded-2xl p-6 md:p-10 flex flex-col h-full transition-all',
      featured
        ? 'text-white z-40 overflow-visible shadow-xl'
        : 'bg-white text-slate-900 z-10 overflow-hidden'
    ]"
    role="region"
    :aria-labelledby="idTitle"
  >
    <!-- Ribbon -->
    <div
      v-if="featured"
      class="absolute left-1/2 -translate-x-1/2 -top-3 pointer-events-none z-50"
    >  
      <span
        class="inline-block px-4 py-1 rounded-full bg-yellow-400 text-xs font-semibold text-slate-800 shadow-sm"
      >  
        Most Popular
      </span>    
    </div>
    
   <!-- Decorative gradient background for featured (below content) -->
<div
  v-if="featured"
  aria-hidden
  class="absolute inset-0 rounded-2xl pointer-events-none z-0"
  :style="{
    background:
      'linear-gradient(135deg, rgba(37,99,235,0.96) 0%, rgba(124,58,237,0.95) 100%)',
    boxShadow: '0 24px 80px -28px rgba(124,58,237,0.32)'
  }"    
></div>


    <!-- Content sits above background -->
    <div class="relative z-20 flex flex-col h-full">
      <header class="mb-4">
        <h3 :id="idTitle" class="text-2xl md:text-3xl font-extrabold">
          {{ title }}  
        </h3>
        <p v-if="subtitle" :class="featured ? 'text-slate-200' : 'text-slate-500' " class="mt-1 text-sm">
          {{ subtitle }}
        </p>  
      </header>  

      <div class="flex items-baseline gap-3 mb-6">
        <div class="text-3xl md:text-4xl font-extrabold leading-none">
          <span v-if="priceText" class="inline-block">{{ priceText }}</span>
          <span v-if="priceSuffix" class="text-sm font-medium opacity-80 ml-1">{{ priceSuffix }}</span>
        </div>  
      </div>  

      <ul class="flex-1 space-y-3 text-sm mb-6">
        <li
          v-for="(f, i) in features"
          :key="i"
          class="flex gap-3 items-start pl-[1rem] "
        >  
        

          <span :class="featured ? 'text-slate-100' : 'text-slate-700' " class="text-sm leading-tight">
            {{ f }}
          </span>  
        </li>  
      </ul>  

      <div class="mt-4">
        <button
          :class="[
            'w-full px-4 py-3 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2',
            featured
              ? 'bg-white text-[rgb(124,58,237)] hover:opacity-95 focus:ring-white'
              : 'bg-slate-900 text-white hover:opacity-95 focus:ring-[rgba(124,58,237,0.45)]'
          ]"      
        >
          {{ cta }}
        </button>  
      </div>  
    </div>  
  </article>    
</template>
