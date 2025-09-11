<template>
  <div
    ref="containerRef"
    class="card-swap-container absolute top-0 left-1/2 transform translate-x-[5%] translate-y-[20%]
     origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] 
     max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%]
      max-[480px]:scale-[0.55] md:translate-x-[4rem]"
    :style="{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height
    }"
  >
    <div
      v-for="(_, index) in 3"
      :key="index"
      ref="cardRefs"
      class="card-swap-card absolute top-1/2 left-1/2 rounded-xl border bg-[#111827] [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden]"
      :style="{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }"
      @click="handleCardClick(index)"
    >
      <slot :name="`card-${index}`" :index="index" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import gsap from 'gsap';

/* ---------- helper functions (no exports here) ---------- */
function makeSlot(i, distX, distY, total) {
  return {
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i
  };
}

function placeNow(el, slot, skew) {
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });
}

/* ---------- props & emits ---------- */
const props = defineProps({
  width: { type: [Number, String], default: 500 },
  height: { type: [Number, String], default: 400 },
  cardDistance: { type: Number, default: 60 },
  verticalDistance: { type: Number, default: 70 },
  delay: { type: Number, default: 5000 },
  pauseOnHover: { type: Boolean, default: false },
  onCardClick: { type: Function, default: null },
  skewAmount: { type: Number, default: 6 },
  easing: { type: String, default: 'elastic' }
});

const emit = defineEmits(['card-click']);

/* ---------- refs ---------- */
const containerRef = ref(null);
const cardRefs = ref([]);
const order = ref([0, 1, 2]);
const tlRef = ref(null);
const intervalRef = ref(null);

/* ---------- handlers & computed ---------- */
const handleCardClick = (index) => {
  emit('card-click', index);
  if (typeof props.onCardClick === 'function') props.onCardClick(index);
};

const config = computed(() => {
  if (props.easing === 'elastic') {
    return {
      ease: 'elastic.out(0.6,0.9)',
      durDrop: 2,
      durMove: 2,
      durReturn: 2,
      promoteOverlap: 0.9,
      returnDelay: 0.05
    };
  }
  return {
    ease: 'power1.inOut',
    durDrop: 0.8,
    durMove: 0.8,
    durReturn: 0.8,
    promoteOverlap: 0.45,
    returnDelay: 0.2
  };
});

/* ---------- init / update functions ---------- */
const initializeCards = () => {
  if (!cardRefs.value || !cardRefs.value.length) return;
  const total = cardRefs.value.length;
  cardRefs.value.forEach((el, i) => {
    if (el) placeNow(el, makeSlot(i, props.cardDistance, props.verticalDistance, total), props.skewAmount);
  });
};

const updateCardPositions = () => {
  if (!cardRefs.value || !cardRefs.value.length) return;
  const total = cardRefs.value.length;
  cardRefs.value.forEach((el, i) => {
    if (el) {
      const slot = makeSlot(i, props.cardDistance, props.verticalDistance, total);
      gsap.set(el, { x: slot.x, y: slot.y, z: slot.z, skewY: props.skewAmount });
    }
  });
};

/* ---------- animation core ---------- */
const swap = () => {
  if (!order.value || order.value.length < 2) return;

  const [front, ...rest] = order.value;
  const elFront = cardRefs.value[front];
  if (!elFront) return;

  const tl = gsap.timeline();
  tlRef.value = tl;

  tl.to(elFront, {
    y: '+=500',
    duration: config.value.durDrop,
    ease: config.value.ease
  });

  tl.addLabel('promote', `-=${config.value.durDrop * config.value.promoteOverlap}`);

  rest.forEach((idx, i) => {
    const el = cardRefs.value[idx];
    if (!el) return;
    const slot = makeSlot(i, props.cardDistance, props.verticalDistance, cardRefs.value.length);
    tl.set(el, { zIndex: slot.zIndex }, 'promote');
    tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.value.durMove, ease: config.value.ease }, `promote+=${i * 0.15}`);
  });

  const backSlot = makeSlot(cardRefs.value.length - 1, props.cardDistance, props.verticalDistance, cardRefs.value.length);
  tl.addLabel('return', `promote+=${config.value.durMove * config.value.returnDelay}`);

  tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, 'return');
  tl.set(elFront, { x: backSlot.x, z: backSlot.z }, 'return');
  tl.to(elFront, { y: backSlot.y, duration: config.value.durReturn, ease: config.value.ease }, 'return');

  tl.call(() => {
    // rotate order: move first to end so next card becomes front
    order.value = order.value.slice(1).concat(order.value[0]);
  });
};

/* ---------- controls ---------- */
const startAnimation = () => {
  stopAnimation();
  swap();
  intervalRef.value = window.setInterval(swap, props.delay);
};

const stopAnimation = () => {
  if (tlRef.value) {
    try { tlRef.value.kill(); } catch (e) {
      console.log(e)
    }
    tlRef.value = null;
  }
  if (intervalRef.value) {
    clearInterval(intervalRef.value);
    intervalRef.value = null;
  }
};

const resumeAnimation = () => {
  if (tlRef.value) {
    try { tlRef.value.play(); } catch (e) {
      console.log(e)
    }
  }
  if (intervalRef.value) {
    clearInterval(intervalRef.value);
  }
  intervalRef.value = window.setInterval(swap, props.delay);
};

/* ---------- hover listeners ---------- */
const setupHoverListeners = () => {
  if (props.pauseOnHover && containerRef.value) {
    containerRef.value.addEventListener('mouseenter', stopAnimation);
    containerRef.value.addEventListener('mouseleave', resumeAnimation);
  }
};

const removeHoverListeners = () => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('mouseenter', stopAnimation);
    containerRef.value.removeEventListener('mouseleave', resumeAnimation);
  }
};

/* ---------- watchers ---------- */
watch(() => [props.cardDistance, props.verticalDistance, props.skewAmount], () => updateCardPositions());

watch(() => props.delay, (newVal) => {
  if (intervalRef.value) {
    clearInterval(intervalRef.value);
    intervalRef.value = window.setInterval(swap, newVal);
  }
});

watch(() => props.pauseOnHover, () => {
  removeHoverListeners();
  setupHoverListeners();
});

/* ---------- lifecycle ---------- */
onMounted(() => {
  nextTick(() => {
    initializeCards();
    startAnimation();
    setupHoverListeners();
  });
});

onUnmounted(() => {
  stopAnimation();
  removeHoverListeners();
});
</script>
