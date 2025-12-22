<!-- components/homepage/HeroDashboard.vue -->
<template>
  <div
    ref="container"
    class="relative w-full h-[500px] md:h-[600px] flex items-center justify-center perspective-container"
    @mousemove="handleMouseMove"
    @mouseleave="resetTilt"
  >
    <!-- 3D Transform Wrapper -->
    <div
      class="relative w-[90%] md:w-[85%] h-[60%] md:h-[70%] transition-transform duration-100 ease-out will-change-transform"
      :style="cardStyle"
    >
      
      <!-- LAYER 1: Main Dashboard (Back) -->
      <div 
        class="absolute inset-0 rounded-xl overflow-hidden shadow-2xl bg-white border border-gray-100 ring-1 ring-black/5 cursor-zoom-in group"
        @click.stop="openLightbox('/dashboard-main.webp')"
      >
        <!-- Shine overlay -->
        <div class="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/0 to-transparent z-10 pointer-events-none"></div>
        
        <img 
          src="/dashboard-main.webp" 
          alt="Dashboard Overview" 
          class="w-full h-full object-cover object-top opacity-100 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <!-- LAYER 2: Mobile Chat Widget (Floating Left) -->
      <div 
        class="absolute -left-4 md:-left-12 bottom-8 md:bottom-12 w-[120px] md:w-[200px] rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] bg-white border border-gray-100 z-20 overflow-hidden transform transition-transform duration-200 ring-1 ring-black/5 cursor-zoom-in hover:scale-105"
        :style="{ transform: `translateX(${parallax.x * 1.5}px) translateY(${parallax.y * 1.5}px)` }"
        @click.stop="openLightbox('/mobile-chat.webp')"
      >
        <img 
          src="/mobile-chat.webp" 
          alt="Mobile Chat Interface" 
          class="w-full h-auto"
        />
      </div>

      <!-- LAYER 3: Stat Card (Floating Right) -->
      <div 
        class="absolute -right-4 md:-right-16 top-12 md:top-20 w-[140px] md:w-[240px] rounded-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] bg-white/80 backdrop-blur-xl border border-white/50 z-30 p-3 transform transition-transform duration-200 ring-1 ring-black/5 cursor-zoom-in hover:scale-105"
        :style="{ transform: `translateX(${parallax.x * 2.5}px) translateY(${parallax.y * 2.5}px)` }"
        @click.stop="openLightbox('/stats-card.webp')"
      >
        <img 
            src="/stats-card.webp" 
            alt="role-based" 
            class="w-full h-auto rounded-lg shadow-sm"
        />
      </div>

      <!-- Glow Effect -->
      <div 
        class="absolute -inset-10 bg-purple-600/10 blur-[60px] -z-10 rounded-full pointer-events-none mix-blend-multiply"
        :style="{ transform: `translateX(${parallax.x * -1}px) translateY(${parallax.y * -1}px)` }"
      ></div>
    </div>

    <!-- LIGHTBOX OVERLAY -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="selectedImage" 
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm p-4 md:p-10"
          @click="closeLightbox"
        >
          <div class="relative max-w-7xl max-h-full w-auto h-auto shadow-2xl rounded-xl overflow-hidden bg-white ring-1 ring-gray-200">
             <!-- Close Button -->
             <button 
               class="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full p-2 transition-colors z-50"
               @click.stop="closeLightbox"
             >
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>

             <img 
               :src="selectedImage" 
               class="max-w-full max-h-[90vh] object-contain block" 
               alt="Expanded View"
               @click.stop
             />
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const container = ref(null);
const rotX = ref(0);
const rotY = ref(0);
const selectedImage = ref(null);

// Open Lightbox
const openLightbox = (imgSrc) => {
  selectedImage.value = imgSrc;
  // Optional: Disable scroll when modal is open
  document.body.style.overflow = 'hidden';
};

// Close Lightbox
const closeLightbox = () => {
  selectedImage.value = null;
  document.body.style.overflow = '';
};

// Parallax offset values
const parallax = computed(() => ({
  x: rotY.value * -1.5, 
  y: rotX.value * 1.5
}));

const cardStyle = computed(() => {
  return {
    transform: `perspective(1000px) rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)`,
  };
});

const handleMouseMove = (e) => {
  if (!container.value) return;

  const rect = container.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const limit = 8; 

  const rotateY = ((x - centerX) / centerX) * limit;
  const rotateX = ((centerY - y) / centerY) * limit; 

  rotY.value = rotateY;
  rotX.value = rotateX;
};

const resetTilt = () => {
  rotX.value = 0;
  rotY.value = 0;
};
</script>

<style scoped>
.perspective-container {
  perspective: 1200px;
}

/* Lightbox Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active div,
.fade-leave-active div {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fade-enter-from div,
.fade-leave-to div {
  transform: scale(0.95);
}
</style>