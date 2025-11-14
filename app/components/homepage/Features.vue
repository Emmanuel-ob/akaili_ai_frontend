<script setup>
import { features } from '~/utils/data.js'

const featuresList = features


</script>

<template>
  <section class="relative overflow-hidden bg-[#111827] py-16" >
    <!-- subtle gradient overlay + decorative SVG particles -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0" style="background: linear-gradient(180deg, rgba(127,86,217,0.06), rgba(17,24,39,0.22)); mix-blend-mode: overlay;"></div>

      <!-- decorative blurred radial spots -->
      <svg class="absolute -left-20 top-8 w-[600px] h-[600px] opacity-30" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g1" cx="0.5" cy="0.5">
            <stop offset="0%" stop-color="#9E4CFF" stop-opacity="0.45" />
            <stop offset="100%" stop-color="#9E4CFF" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="url(#g1)" />
      </svg>

      <svg class="absolute right-0 -bottom-24 w-[700px] h-[700px] opacity-20" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g2" cx="0.5" cy="0.5">
            <stop offset="0%" stop-color="#9E4CFF" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#9E4CFF" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="700" height="700" fill="url(#g2)" />
      </svg>
    </div>

    <div class="relative max-w-7xl mx-auto px-6">
      <div class="text-center mb-12">
        <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent" style="background-image: linear-gradient(90deg,#9E4CFF, #ffffff);">
          Powerful Features
        </h2>
        <p class="mt-3 text-lg text-gray-300">Everything you need to create intelligent, responsive chatbots</p>
      </div>
1
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(f, idx) in featuresList"
          :key="f.id"
          class="feature-card transform transition-all duration-400 hover:-translate-y-2 rounded-2xl p-6 shadow-md"
          :data-aos="'zoom-in-up'"
          :data-aos-delay="idx * 80"
        >
          <div class="flex gap-4 items-start">
            <!-- icon circle -->
            <div class="icon-wrap flex-none w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
              <!-- Use NuxtImg if you have SVG/PNG icons, otherwise swap for inline SVG -->
              <NuxtImg :src="`/feature_${f.icon}.png`" format="webp" class="w-7 h-7" alt="" />
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="text-white text-lg font-semibold leading-snug">{{ f.title }}</h3>
              <p class="mt-2 text-sm text-gray-300 leading-relaxed">{{ f.description }}</p>
            </div>
          </div>

          <!-- small badges or CTA area -->
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="badge text-xs font-medium">AI-powered</span>
              <span v-if="f.popular" class="badge-primary text-xs font-medium">Popular</span>
            </div>
            <button class="text-xs font-medium px-3 py-1 text-white rounded-full bg-white/6 hover:bg-white/12 transition">Learn more</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Card base styling */
.feature-card{
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.04);
  backdrop-filter: blur(6px);
}

/* Icon circle gradient and glow */
.icon-wrap{
  background: white;
  box-shadow: 0 8px 28px rgba(127,86,217,0.14);
}

/* badges */
.badge{
  background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
  color: #cbd5e1;
  padding: 6px 10px;
  border-radius: 9999px;
}

.badge-primary{
  background: linear-gradient(90deg, rgba(127,86,217,0.18), rgba(127,86,217,0.08));
  color: #f8fafc;
  padding: 6px 10px;
  border-radius: 9999px;
}

/* hover glow effect (thin gradient ring) */
.feature-card:hover{
  box-shadow: 0 10px 30px rgba(2,6,23,0.6), 0 0 30px rgba(127,86,217,0.12);
  border-color: rgba(127,86,217,0.25);
}

/* responsive tweaks */
@media (min-width: 1024px){
  .feature-card{ padding: 28px; }
}
</style>
