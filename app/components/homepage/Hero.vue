<!-- components/homepage/Hero.vue -->
<template>
  <section
    ref="heroSection"
    class="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-32 transition-colors duration-300 bg-white dark:bg-slate-950"
    aria-label="Hero section"
  >
    
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Top Orb -->
      <div class="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full blur-[100px] transition-all duration-500 bg-purple-100/50 mix-blend-multiply dark:bg-purple-900/20 dark:mix-blend-screen"></div>
      
      <!-- Bottom Orb -->
      <div class="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[100px] transition-all duration-500 bg-blue-50/60 mix-blend-multiply dark:bg-blue-900/20 dark:mix-blend-screen"></div>

      <!-- Animated Circles -->
      <div
        v-for="(circle, index) in circles"
        :key="index"
        :ref="el => circle.el = el"
        class="absolute rounded-full blur-2xl transition-opacity duration-300 dark:opacity-30"
        :style="{
          width: circle.size + 'px',
          height: circle.size + 'px',
          backgroundColor: circle.color,
          opacity: circle.opacity,
          transform: `translate3d(${circle.x}px, ${circle.y}px, 0)`
        }"
      ></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-8">
        
        <!-- LEFT: Text Content -->
        <div class="lg:col-span-6 text-center lg:text-left pt-8">
          
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 transition-colors border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/30">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#9E4CFF]"></span>
            </span>
            <span class="text-xs font-semibold tracking-wide uppercase text-[#9E4CFF] dark:text-purple-300">
              New Version 2.0 Live
            </span>
          </div>

          <!-- Main Header (Updated Font Sizes: 3xl/4xl/5xl) -->
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1] transition-colors text-gray-900 dark:text-white">
            Empower Your Site
            <span class="block text-transparent bg-clip-text pb-2 bg-gradient-to-r from-[#9E4CFF] to-blue-600 dark:from-[#c084fc] dark:to-blue-400">
              with 24/7 Smart
            </span>
            <span class="inline-block mt-2 align-middle">
              <RotatingText
                 :texts="['Customer-Support', 'Sales-Assistant', 'Task-Automation', 'User-Engagement','Role-Based-Login']"
                main-class-name="px-3 py-1 rounded-xl inline-block text-3xl sm:text-4xl lg:text-5xl leading-[1.1] transition-colors text-[#9E4CFF] bg-purple-100 dark:text-purple-300 dark:bg-purple-900/50"
                :stagger-from="'last'"
                :initial="{ y: '100%' }"
                :animate="{ y: 0 }"
                :exit="{ y: '-120%' }"
                :transition="{ type: 'spring', damping: 20, stiffness: 300 }"
                :rotation-interval="3000"
              />
            </span>
          </h1>

          <p class="mt-8 text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium transition-colors text-gray-600 dark:text-gray-300">
            Seamlessly integrate intelligent chatbots that connect to your databases, learn from
            your content, and provide instant enterprise-grade support.
          </p>

          <!-- Buttons -->
          <div class="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
            <NuxtLink 
              to="/get-started" 
              class="w-full sm:w-auto px-10 py-5 nav_primary_btn text-white text-lg rounded-2xl font-bold shadow-xl shadow-purple-500/20 transition-all transform hover:-translate-y-1"
            >
              Start Free Trial
            </NuxtLink>
            
            <button class="w-full sm:w-auto px-10 py-5 text-lg border rounded-2xl font-medium shadow-sm transition-colors flex items-center justify-center gap-2 group bg-white text-slate-700 border-gray-200 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-200 dark:border-slate-700 dark:hover:bg-slate-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-gray-400 group-hover:text-[#9E4CFF] transition-colors">
                <path d="M5 3L19 12L5 21V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Watch Demo
            </button>
          </div>
          
          <!-- Social Proof -->
          <div class="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex -space-x-3">
               <div class="w-10 h-10 rounded-full bg-gray-200 border-2 border-white dark:border-slate-950"></div>
               <div class="w-10 h-10 rounded-full bg-gray-300 border-2 border-white dark:border-slate-950"></div>
               <div class="w-10 h-10 rounded-full bg-gray-400 border-2 border-white dark:border-slate-950"></div>
            </div>
            <p>Trusted by <span class="font-bold text-[#111827] dark:text-white">500+</span> companies</p>
          </div>
        </div>

        <!-- RIGHT: 3D Visual -->
        <div class="lg:col-span-6 relative z-20 mt-16 lg:mt-0">
           <HeroDashboard />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import RotatingText from './rotatingText.vue';
import HeroDashboard from './HeroDashboard.vue';
import { ref, onMounted, reactive } from 'vue';

const heroSection = ref(null);
const baseCircles = [{ color: '#E9D5FF', opacity: 0.6 }, { color: '#BFDBFE', opacity: 0.5 }, { color: '#FBCFE8', opacity: 0.4 }];
const circles = reactive([]);

const initCircles = () => {
  if (typeof window === 'undefined') return;
  const screenWidth = window.innerWidth;
  circles.length = 0; 
  const numCircles = screenWidth < 640 ? 3 : screenWidth < 1024 ? 5 : 6;
  for (let i = 0; i < numCircles; i++) {
    const base = baseCircles[i % baseCircles.length];
    const size = 150 + Math.random() * 250; 
    circles.push({ x: Math.random() * screenWidth, y: Math.random() * 600, dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3, size, color: base.color, opacity: base.opacity, el: null });
  }
};

function animateCircles() {
  if (!heroSection.value) return;
  const rect = heroSection.value.getBoundingClientRect();
  circles.forEach(c => {
    c.x += c.dx; c.y += c.dy;
    if (c.x <= -100 || c.x + c.size >= rect.width + 100) c.dx *= -1;
    if (c.y <= -100 || c.y + c.size >= rect.height + 100) c.dy *= -1;
    if (c.el) c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
  });
  requestAnimationFrame(animateCircles);
}

onMounted(() => { initCircles(); requestAnimationFrame(animateCircles); window.addEventListener('resize', initCircles); });
</script>

<style scoped>
.text-transparent {
  -webkit-text-fill-color: transparent;
}
</style>