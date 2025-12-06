<template>
 <section
    ref="heroSection"
    role="banner"
    class="relative overflow-hidden pt-20 md:pt-24 lg:pt-28"
    aria-label="Hero section"
    :style="{ backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f7f7ff 50%, #ffffff 100%)' }"
  >
   <div
    v-for="(circle, index) in circles"
    :key="index"
    :ref="el => circle.el = el"
    class="absolute rounded-full blur-3xl"
    :style="{
      width: circle.size + 'px',
      height: circle.size + 'px',
      backgroundColor: circle.color,
      opacity: circle.opacity,
      top: circle.y + 'px',
      left: circle.x + 'px'
    }"
  ></div>


  <!-- Section content -->
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-12 py-12 md:py-20">
      <!-- Left Content -->
      <div class="md:col-span-7 lg:col-span-6" >
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
          Empower Your Website
          <span class="block">with 24/7 Smart</span>
          <span class="inline-block mt-2" >
            <RotatingText
              :texts="['Customer-Support', 'Business-Assistant', 'Automation-Tools', 'Personal-Bot']"
              main-class-name="text-[#9E4CFF] overflow-hidden rounded-lg inline-block"
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

        <p class="mt-5 text-lg lg:text-xl text-slate-600 max-w-xl" >
          Seamlessly integrate intelligent chatbots that connect to your databases, learn from
          your content, and provide instant customer support 24/7. No coding required.
        </p>

        <!-- CTA -->
        <div class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <NuxtLink to="/get-started" class="px-6 py-3 nav_primary_btn text-white rounded-md font-medium shadow-md">
            Get Started
          </NuxtLink>
        </div>
      </div>

      <!-- Right Image / CardSwap -->
      <div ref="rightDiv" class="hidden md:col-span-5 lg:col-span-6 justify-center md:justify-end">
        <HalfHeroSlider
          :sections="[
            { title: 'AUTOMATION TOOLS', image: '/hero-automation.png' },
            { title: 'PERSONAL BOT', image: '/hero-chat-integration.webp' },
            { title: 'BUSINESS ASSISTANT', image: '/hero-business.png' },
            { title:'EMAIL SUPPORT', image: '/hero-email.png' }
          ]"
          autodelay="2500"
          parallaxstrength="20"
          container-class="w-full h-[80vh] md:h-[70vh]"
        />
      </div>
    </div>
  </div>

  </section>
</template>

<script setup>
import RotatingText from './rotatingText.vue';
import CardSwap from './CardSwap.vue';
import HalfHeroSlider from './HalfHeroSlider.vue';
import { ref, onMounted, reactive } from 'vue';

const rightDiv = ref(null);





const heroSection = ref(null);

// Base configuration for circles
const baseCircles = [
  { color: '#9E4CFF', opacity: 0.4 },
  { color: '#0b1020', opacity: 0.25 },
  { color: '#A066FF', opacity: 0.35 },
];

// Reactive array of circles
const circles = reactive([]);

// Function to initialize circles based on screen width
const initCircles = () => {
  const screenWidth = window.innerWidth;

  circles.length = 0; // clear existing circles

  // Determine number of circles: e.g., 4 for small, 6 for medium, 8 for large screens
  const numCircles = screenWidth < 640 ? 4 : screenWidth < 1024 ? 6 : 8;

  for (let i = 0; i < numCircles; i++) {
    const base = baseCircles[i % baseCircles.length];
    const size = screenWidth < 640
      ? 100 + Math.random() * 50
      : screenWidth < 1024
      ? 150 + Math.random() * 100
      : 200 + Math.random() * 150;

    circles.push({
      x: Math.random() * screenWidth,
      y: Math.random() * 500, // initial Y (we can adjust after mount)
      dx: (Math.random() - 0.5) * 4, // velocity
      dy: (Math.random() - 0.5) * 4,
      size,
      color: base.color,
      opacity: base.opacity,
      el: null,
    });
  }
};

// Animation loop
function animateCircles() {
  if (!heroSection.value) return;
  const rect = heroSection.value.getBoundingClientRect();

  circles.forEach(c => {
    c.x += c.dx;
    c.y += c.dy;

    if (c.x <= 0 || c.x + c.size >= rect.width) c.dx *= -1;
    if (c.y <= 0 || c.y + c.size >= rect.height) c.dy *= -1;

    if (c.el) {
      c.el.style.left = c.x + 'px';
      c.el.style.top = c.y + 'px';
    }
  });

  requestAnimationFrame(animateCircles);
}

onMounted(() => {
  initCircles();
  requestAnimationFrame(animateCircles);

  // Optional: update circles if screen resizes
  window.addEventListener('resize', () => {
    initCircles();
  });
});


onMounted(() => {
  // Add md:flex once the component is mounted (client-side)
  if (rightDiv.value && rightDiv.value.classList) {
    rightDiv.value.classList.add('md:flex');
  }
});


</script>

<style>
@keyframes floatSlow {
  0%, 100% { transform: translateY(0) translateX(0) translateZ(0); }
  50% { transform: translateY(-20px)  translateX(10px) translateZ(0);
  width: 300%; }
}

@keyframes floatFast {
  0%, 100% { transform: translateY(0) translateX(0) translateZ(0); }
  50% { transform: translateY(15px) translateX(-15px) translateZ(0); }
}



.blur-3xl {
  filter: blur(3rem);
  border-radius: 50%;
  position: absolute;
}

.animate-floatSlow {
  animation: floatSlow 12s ease-in-out infinite;
  will-change: transform;
}

.animate-floatFast {
  animation: floatFast 8s ease-in-out infinite;
  will-change: transform;
}
</style>