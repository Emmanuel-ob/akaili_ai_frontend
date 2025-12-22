<!-- components/homepage/LiquidHeroSlider -->
<template>
  <div :class="['relative overflow-hidden rounded-3xl', containerClass]" ref="root">
    
    <svg class="absolute w-0 h-0" aria-hidden="true">
      <defs>
        <filter :id="filterId" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence 
            :id="turbId" 
            type="fractalNoise" 
            baseFrequency="0.01" 
            numOctaves="3" 
            seed="1" 
          />
          <feDisplacementMap 
            :id="dispId" 
            in="SourceGraphic" 
            scale="0" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>

        <mask :id="maskId">
          <circle :cx="maskX" :cy="maskY" :r="maskRadius" fill="white" />
        </mask>
      </defs>
    </svg>

    <div
      v-for="(section, index) in sections"
      :key="index"
      class="absolute inset-0 w-full h-full slide-item"
      ref="slideRefs"
    >
      <img 
        :src="section.image" 
        class="w-full h-full object-cover block" 
        alt=""
        :style="parallaxStyle(index)"
      />
      <div class="absolute bottom-10 left-10 z-20 max-w-lg">
  <h2 class="text-white text-4xl font-bold drop-shadow-lg 
             bg-black/20              backdrop-blur-sm         px-4 py-2 rounded-lg"> 
    {{ section.title }}
  </h2>
</div>
    </div>

    <div class="absolute bottom-8 right-8 z-30 flex gap-4">
      <button @click="forcePrev" class="w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white backdrop-blur rounded-full transition-colors border border-white/20">
        ←
      </button>
      <button @click="forceNext" class="w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white backdrop-blur rounded-full transition-colors border border-white/20">
        →
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  sections: { type: Array, required: true },
  autodelay: { type: [Number, String], default: 5000 },
  parallaxstrength: { type: [Number, String], default: 20 },
  containerClass: { type: String, default: 'w-full h-[80vh] md:h-[70vh]' },
  // NEW PROPS for automatic duration calculation:
  transitionDuration: { type: [Number, String], default: 1.5 }, // Total duration of the liquid effect in seconds
  maxRipple: { type: [Number, String], default: 100 } // Max displacement scale for the melt
});

// --- UNIQUE IDS ---
const uid = Math.random().toString(36).substr(2, 9);
const filterId = `liquid-filter-${uid}`;
const turbId = `liquid-turb-${uid}`;
const dispId = `liquid-disp-${uid}`;
const maskId = `liquid-mask-${uid}`;

// --- STATE ---
const root = ref(null);
const slideRefs = ref([]);
const currentIndex = ref(0);

// SVG Animatable Values
const maskRadius = ref(2000);
const maskX = ref(500);
const maskY = ref(500);

// Logic
let gsap = null;
let tl = null;
let timer = null;
let isAnimating = false;

// Compute Transition Duration
const T = computed(() => Number(props.transitionDuration));
const RIPPLE_MAX = computed(() => Number(props.maxRipple));
const PARALLAX_MAX = computed(() => Number(props.parallaxstrength));


// --- TRANSITION LOGIC ---
const runTransition = async (nextIndex) => {
  if (isAnimating || nextIndex === currentIndex.value) return;
  isAnimating = true;

  clearTimeout(timer);

  if (!gsap) {
    const mod = await import('gsap');
    gsap = mod.gsap;
  }

  const slides = slideRefs.value;
  const outgoing = slides[currentIndex.value];
  const incoming = slides[nextIndex];

  // 1. SETUP LAYERS 
  gsap.set(slides, { zIndex: 0, opacity: 0 });
  
  gsap.set(outgoing, { 
    zIndex: 2, 
    opacity: 1,
    filter: `url(#${filterId})`,
    mask: `url(#${maskId})`
  });
  
  gsap.set(incoming, { 
    zIndex: 1, 
    opacity: 1, 
    y: PARALLAX_MAX.value, // Start pushed down by parallax strength
    scale: 1.05 
  });

  // Center the mask
  if (root.value) {
    const rect = root.value.getBoundingClientRect();
    maskX.value = rect.width / 2;
    maskY.value = rect.height / 2;
    maskRadius.value = Math.max(rect.width, rect.height) * 1.5;
  }

  const turbEl = document.getElementById(turbId);
  const dispEl = document.getElementById(dispId);

  // 2. ANIMATION TIMELINE - ALL DURATIONS ARE NOW BASED ON T.value
  if (tl) tl.kill();
  tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onComplete: () => {
      // CLEANUP
      gsap.set(outgoing, { mask: 'none', filter: 'none', opacity: 0 });
      gsap.set(incoming, { zIndex: 2, y: 0, scale: 1 });
      currentIndex.value = nextIndex;
      isAnimating = false;
      scheduleNext();
    }
  });

  // A. MELT (Distort Top Image) - Total duration T
  tl.to(turbEl, { attr: { baseFrequency: 0.04 }, duration: T.value }, 0);
  tl.to(dispEl, { attr: { scale: RIPPLE_MAX.value }, duration: T.value }, 0);

  // B. WASH (Shrink Mask on Top Image) - Starts at 0.2*T, duration 0.8*T
  const wash_start = 0.2 * T.value;
  const wash_duration = 0.8 * T.value;
  tl.to(maskRadius, { value: 0, duration: wash_duration, ease: "power2.inOut" }, wash_start);

  // C. RISE (Move Bottom Image Up) - Starts at 0.1*T, duration 0.9*T
  const rise_start = 0.1 * T.value;
  const rise_duration = 0.9 * T.value;
  tl.to(incoming, { y: 0, scale: 1, duration: rise_duration, ease: "power3.out" }, rise_start);

  // D. RESET FILTERS (End of transition)
  const reset_time = T.value - 0.1; // Just before the end
  tl.to(dispEl, { attr: { scale: 0 }, duration: 0.1 }, reset_time);
  tl.to(turbEl, { attr: { baseFrequency: 0.01 }, duration: 0.1 }, reset_time);
};

// --- AUTOPLAY LOGIC ---
const scheduleNext = () => {
  clearTimeout(timer);
  const delay = parseInt(props.autodelay) || 5000;
  
  timer = setTimeout(() => {
    const next = (currentIndex.value + 1) % props.sections.length;
    runTransition(next);
  }, delay);
};

const forceNext = () => {
  if (!isAnimating) {
    const next = (currentIndex.value + 1) % props.sections.length;
    runTransition(next);
  }
};

const forcePrev = () => {
  if (!isAnimating) {
    const prev = (currentIndex.value - 1 + props.sections.length) % props.sections.length;
    runTransition(prev);
  }
};

// --- Parallax (simple CSS-based) ---
const parallaxStyle = (index) => {
    // Only apply parallax on the active slide (controlled via GSAP)
    return {};
};

// --- LIFECYCLE ---
onMounted(async () => {
  const mod = await import('gsap');
  gsap = mod.gsap;

  // Initialize first slide
  if(slideRefs.value.length > 0) {
    gsap.set(slideRefs.value, { opacity: 0, zIndex: 0 });
    gsap.set(slideRefs.value[0], { opacity: 1, zIndex: 2 });
  }

  scheduleNext();
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  if (tl) tl.kill();
});
</script>

<style scoped>
.slide-item {
  will-change: transform, opacity, filter;
  backface-visibility: hidden;
}
</style>