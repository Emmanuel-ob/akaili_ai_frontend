<template>
  <section
    role="banner"
    class="relative overflow-hidden pt-20 md:pt-24 lg:pt-28 bg-white"
    aria-label="Hero section"
  >
    <!-- purple glow -->
    <div
      aria-hidden="true"
      class="absolute -top-12 -left-36 w-[28rem] h-[28rem] rounded-full pointer-events-none filter blur-3xl opacity-60"
      :class="['bg-[radial-gradient(circle_at_20%_20%,_rgba(124,58,237,0.65)_0%,_rgba(167,139,250,0.32)_35%,_transparent_70%)]']"
    />

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
      <div class="grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-12 py-12 md:py-20">
        <!-- Left Content -->
        <div class="md:col-span-7 lg:col-span-6"  data-aos="fade-right">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight" data-aos="fade-up">
            Empower Your Website
            <span class="block">with 24/7 Smart</span>
            <span class="inline-block mt-2" data-aos="fade-up" data-aos-delay="50" >
              <RotatingText
                :texts="['Customer-Support', 'Business-Assistant', 'Automation-Tools', 'Personal-Bot']"
                main-class-name="text-[#7F56D9] overflow-hidden rounded-lg inline-block"
                :stagger-from="'last'"
                :initial="{ y: '100%' }"
                :animate="{ y: 0 }"
                :exit="{ y: '-120%' }"
                :stagger-duration="0.01"
                split-level-class-name="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                :transition="{ type: 'spring', damping: 30, stiffness: 400 }"
                :rotation-interval="2000"
              />
            </span>
          </h1>

          <p class="mt-5 text-lg lg:text-xl text-slate-600 max-w-xl" data-aos="fade-right" data-aos-delay="100">
            Seamlessly integrate intelligent chatbots that connect to your databases, learn from
            your content, and provide instant customer support 24/7. No coding required.
          </p>

          <!-- CTA -->
          <div class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <NuxtLink to="/get-started" class="px-6 py-3 nav_primary_btn text-white rounded-md font-medium shadow-md">
              Get Started
            </NuxtLink>
            <a href="#demo" class="px-6 py-3 border border-purple-300 text-purple-600 rounded-md font-medium hover:bg-purple-50">
              View Demo
            </a>
          </div>

          <!-- Stats -->
          <ul class="mt-10 flex flex-wrap gap-6 mb-6">
            <li class="flex flex-col items-start sm:items-center gap-1" data-aos="flip-left" data-aos-delay="150">
              <div class="font-bold text-slate-800 flex items-center gap-2">
                <NuxtImg src="/hero_brain.png" format="webp" class="w-5 h-5" alt="brain" />
                <span class="text-xl">99.9%</span>
              </div>
              <div class="text-xs font-semibold text-slate-500">AI Accuracy</div>
            </li>

            <li class="flex flex-col items-start sm:items-center gap-1" data-aos="flip-left" data-aos-delay="150">
              <div class="font-bold text-slate-800 flex items-center gap-2">
                <NuxtImg src="/hero_faster.png" format="webp" class="w-5 h-5" alt="speed" />
                <span class="text-xl">10x</span>
              </div>
              <div class="text-xs font-semibold text-slate-500">Faster Processing</div>
            </li>

            <li class="flex flex-col items-start sm:items-center gap-1" data-aos="flip-left" data-aos-delay="150">
              <div class="font-bold text-slate-800 flex items-center gap-2">
                <NuxtImg src="/hero_cpu.png" format="webp" class="w-5 h-5" alt="cpu" />
                <span class="text-xl">1M+</span>
              </div>
              <div class="text-xs font-semibold text-slate-500">AI Operations/Day</div>
            </li>
          </ul>
        </div>

        <!-- Right Image / CardSwap (Only md+) -->
        <div ref="rightDiv" class="hidden md:col-span-5 lg:col-span-6 justify-center md:justify-end" >
          <CardSwap
          
             :card-distance="60"
            :vertical-distance="70" 
            :delay="5000"
            :skew-amount="6"
            easing="elastic"
            :pause-on-hover="false"
          >
            <template #card-0>
              <div class="flex flex-col h-full  border-b rounded-3xl">
                <div class="m-2 text-white flex items-center">
                  <i class="pi pi-circle-fill mr-2"></i>
                  <span>AUTOMATION TOOLS</span>
                </div>
                <div class="flex-1 relative">
                  <NuxtImg src="/hero-automation.png" format="webp" class="absolute inset-0 w-full h-full object-fill rounded-b-xl" />
                </div>
              </div>
            </template>

            <template #card-1>
              <div class="flex flex-col h-full border-b rounded-3xl ">
                <div class="m-2 text-white flex items-center">
                  <i class="pi pi-circle-fill mr-2"></i>
                  <span>PERSONAL BOT</span>
                </div>
                <div class="flex-1 relative">
                  <NuxtImg src="/hero-chat-integration.webp" format="webp" class="absolute inset-0 w-full h-full object-fill rounded-b-xl" />
                </div>
              </div>
            </template>

            <template #card-2>
              <div class="flex flex-col h-full border-b rounded-3xl ">
                <div class="m-2 text-white flex items-center">
                  <i class="pi pi-circle-fill mr-2"></i>
                  <span>BUSINESS ASSISTANT</span>
                </div>
                <div class="flex-1 relative">
                  <NuxtImg src="/hero-business.png" format="webp" class="absolute inset-0 w-full h-full object-fill rounded-b-xl" />
                </div>
              </div>
            </template>
          </CardSwap>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import RotatingText from './rotatingText.vue';
import CardSwap from './CardSwap.vue';
import { ref, onMounted } from 'vue';

const rightDiv = ref(null);

onMounted(() => {
  // Add md:flex once the component is mounted (client-side)
  if (rightDiv.value && rightDiv.value.classList) {
    rightDiv.value.classList.add('md:flex');
  }
});
</script>

<style scoped></style>
