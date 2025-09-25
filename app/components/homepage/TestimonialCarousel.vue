<template>
  <section class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-8">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800">
          What Our Customers Say
        </h2>
        <p class="mt-2 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Join thousands of satisfied customers who've transformed their customer support with our AI chatbots.
        </p>
      </div>

      <div
        class="relative"
        @mouseenter="pauseAutoplay"
        @mouseleave="startAutoplay"
      >
        <!-- viewport -->
        <div ref="viewportRef" class="overflow-hidden">
          <!-- track -->
          <div
            ref="trackRef"
            :class="['flex', isAnimating ? 'transition-transform duration-500 ease-out' : '']"
            :style="{
              transform: `translateX(${translateX}px)`,
              width: `${extendedSlides.length * slideWidth}px`
            }"
            @transitionend="onTransitionEnd"
            role="list"
            aria-live="polite"
          >
            <article
              v-for="(t, idx) in extendedSlides"
              :key="t.__cloneId || t.id || idx"
              class="flex-shrink-0 p-6"
              :style="{ width: `${slideWidth}px` }"
              role="listitem"
            >
              <div class="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col justify-between">
                <p class="text-lg text-slate-600 mb-6 leading-relaxed">“{{ t.quote }}”</p>

                <div class="mt-4 flex items-center gap-3">
                  <img
                    v-if="t.avatar"
                    :src="t.avatar"
                    :alt="t.name"
                    class="w-12 h-12 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <div class="font-semibold text-slate-800">{{ t.name }}</div>
                    <div class="text-sm text-slate-500">{{ t.role }}</div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- controls -->
        <button
          @click="prev"
          class="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:shadow-md focus:outline-none"
          aria-label="Previous testimonials"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-700" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <button
          @click="next"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:shadow-md focus:outline-none"
          aria-label="Next testimonials"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-700 rotate-180" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <!-- page indicators -->
        <div class="mt-4 flex items-center justify-center gap-2">
          <button
            v-for="n in visiblePageCount"
            :key="n"
            :class="['w-10 h-2 rounded-full focus:outline-none', currentPage === (n - 1) ? 'bg-slate-800' : 'bg-slate-300']"
            :aria-label="`Go to testimonials page ${n}`"
            data-aos="fade-right" :data-aos-delay="n*100" 
            @click="goToPage(n - 1)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { testimonials as defaultTestimonials } from '~/utils/data.js'

// props you can tweak
const props = defineProps({
  testimonialsList: { type: Array, default: () => defaultTestimonials || [] },
  autoplay: { type: Boolean, default: true },
  autoplayInterval: { type: Number, default: 3000 },
  animationDuration: { type: Number, default: 500 } // keeps CSS transition in sync if you change it
})

const viewportRef = ref(null)
const trackRef = ref(null)

const slidesPerView = ref(1)
const updateSlidesPerView = () => {
  const w = window.innerWidth
  if (w >= 1024) slidesPerView.value = 3
  else if (w >= 768) slidesPerView.value = 2
  else slidesPerView.value = 1
}

// core data
const sourceSlides = ref(props.testimonialsList.slice())
const slidesCount = computed(() => Math.max(1, sourceSlides.value.length))

// cloning for infinite loop
const extendedSlides = ref([])
const clonesCount = ref(0) // will equal slidesPerView
const currentIndex = ref(0) // pointer into extendedSlides
const isAnimating = ref(true)

// measured sizes
const slideWidth = ref(0)
const translateX = ref(0) // in px

// autoplay timer
let timer = null

function buildExtended() {
  // number of clones equals slidesPerView, but ensure not larger than slidesCount
  clonesCount.value = Math.min(slidesPerView.value, slidesCount.value)
  const head = sourceSlides.value.slice(0, clonesCount.value).map(s => ({ ...s, __cloneId: `head-${s.id || Math.random()}` }))
  const tail = sourceSlides.value.slice(-clonesCount.value).map(s => ({ ...s, __cloneId: `tail-${s.id || Math.random()}` }))
  extendedSlides.value = [...tail, ...sourceSlides.value, ...head]
  // start the index at first real slide (after tail clones)
  currentIndex.value = clonesCount.value
}

function measure() {
  // compute the slide width in px so transforms can be done in px (simpler)
  const vp = viewportRef.value
  if (!vp) return
  const w = vp.clientWidth || 0
  slideWidth.value = Math.floor(w / slidesPerView.value)
  // ensure track width is at least one slideWidth per extended slide
  // translateX should reflect current index
  translateX.value = -currentIndex.value * slideWidth.value
  // apply no-animation for immediate size changes
  isAnimating.value = false
  // small nextTick to re-enable animations after layout
  nextTick(() => {
    // allow a tick then re-enable transitions
    setTimeout(() => { isAnimating.value = true }, 30)
  })
}

function onTransitionEnd() {
  // if we've moved into clones area, jump to the corresponding real slide WITHOUT animation
  const realStart = clonesCount.value
  const realEnd = clonesCount.value + slidesCount.value - 1
  if (currentIndex.value > realEnd) {
    // jumped past the last real slide into head clones; go to equivalent real slide
    isAnimating.value = false
    currentIndex.value = realStart
    translateX.value = -currentIndex.value * slideWidth.value
    // re-enable animation on next tick
    nextTick(() => { setTimeout(() => { isAnimating.value = true }, 30) })
  } else if (currentIndex.value < realStart) {
    // jumped before the first real slide into tail clones; jump to equivalent real slide at end
    isAnimating.value = false
    currentIndex.value = realEnd
    translateX.value = -currentIndex.value * slideWidth.value
    nextTick(() => { setTimeout(() => { isAnimating.value = true }, 30) })
  }
}

function prev() {
  // move 1 slide left
  isAnimating.value = true
  currentIndex.value -= 1
  translateX.value = -currentIndex.value * slideWidth.value
}
function next() {
  isAnimating.value = true
  currentIndex.value += 1
  translateX.value = -currentIndex.value * slideWidth.value
}
function goToPage(page) {
  // page is 0-based where a page equals slidesPerView slides
  const target = clonesCount.value + page * slidesPerView.value
  isAnimating.value = true
  currentIndex.value = target
  translateX.value = -currentIndex.value * slideWidth.value
}

const visiblePageCount = computed(() => Math.max(1, Math.ceil(slidesCount.value / slidesPerView.value)))
const currentPage = computed(() => {
  const realStart = clonesCount.value
  const indexInReal = (currentIndex.value - realStart + slidesCount.value) % slidesCount.value
  return Math.floor(indexInReal / slidesPerView.value)
})

// autoplay
function startAutoplay() {
  if (!props.autoplay) return
  stopAutoplay()
  timer = setInterval(() => {
    next()
  }, props.autoplayInterval)
}
function stopAutoplay() {
  if (timer) { clearInterval(timer); timer = null }
}
function pauseAutoplay() { stopAutoplay() }
function stopAll() { stopAutoplay() }

// rebuild when slidesPerView or source slides change
watch([slidesPerView, () => props.testimonialsList], () => {
  sourceSlides.value = props.testimonialsList.slice()
  buildExtended()
  // re-measure after DOM updates
  nextTick(() => measure())
})

onMounted(() => {
  updateSlidesPerView()
  window.addEventListener('resize', () => {
    updateSlidesPerView()
    // remeasure widths after resize
    nextTick(() => measure())
  })

  // initial build and measure
  buildExtended()
  nextTick(() => measure())

  // start autoplay
  startAutoplay()
})

onUnmounted(() => {
  window.removeEventListener('resize', measure)
  stopAll()
})
</script>

<style scoped>
/* no @apply responsive utilities here */
</style>
