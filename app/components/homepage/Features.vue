          <script setup>
          import { features } from '~/utils/data.js'
          
          const featuresList = features
         
          </script>
          
         
<template>
  <section class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-8">
        <h2 class="main_header">Powerful Features</h2>
        <p class="main_subheader">Everything you need to create intelligent, responsive chatbots</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="f in featuresList"
          :key="f.id"
          class="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div class="flex flex-col items-start gap-4">
                 <NuxtImg :src="`/feature_${f.icon}.png`" format="webp" class="w-10" alt="" />
            <div>
              <h3 class="text-xl font-bold font_color">{{ f.title }}</h3>
              <p class="mt-2 text-lg text-slate-500">{{ f.description }}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

