<!-- components/homepage/TestimonialCarousel.vue -->
<template>

  <section class="py-12 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-8">

        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white transition-colors">
          What Our Customers Say
        </h2>

        <p class="mt-2 text-base sm:text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors">
          Join thousands of satisfied customers who've transformed their customer support with our AI chatbots.
        </p>
      </div>

      <div class="relative" @mouseenter="pauseAutoplay" @mouseleave="startAutoplay">

        <div ref="viewportRef" class="overflow-hidden">
          <div
            ref="trackRef"
            :class="['flex', isAnimating ? 'transition-transform duration-500 ease-out' : '']"
            :style="{ transform: `translateX(${translateX}px)`, width: `${extendedSlides.length * slideWidth}px` }"
            @transitionend="onTransitionEnd"
            role="list"
          >
            <article
              v-for="(t, idx) in extendedSlides"
              :key="t.__cloneId || t.id || idx"
              class="flex-shrink-0 p-6"
              :style="{ width: `${slideWidth}px` }"
              role="listitem"
            >

              <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg dark:shadow-none dark:border dark:border-slate-800 h-full flex flex-col justify-between transition-colors duration-300">
                

                <p class="text-lg text-slate-600 dark:text-gray-300 mb-6 leading-relaxed italic">“{{ t.quote }}”</p>

                <div class="mt-4 flex items-center gap-3">
                  <img
                    v-if="t.avatar"
                    :src="t.avatar"
                    :alt="t.name"
                    class="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-700"
                  />
                  <div>

                    <div class="font-semibold text-slate-800 dark:text-white">{{ t.name }}</div>

                    <div class="text-sm text-slate-500 dark:text-gray-500">{{ t.role }}</div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>


        <button
          @click="prev"
          class="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:shadow-md focus:outline-none dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700 transition-colors"
          aria-label="Previous testimonials"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-700 dark:text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <button
          @click="next"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:shadow-md focus:outline-none dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700 transition-colors"
          aria-label="Next testimonials"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-700 dark:text-white rotate-180" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>


        <div class="mt-4 flex items-center justify-center gap-2">
          <button
            v-for="n in visiblePageCount"
            :key="n"
            :class="['w-10 h-2 rounded-full focus:outline-none transition-colors', currentPage === (n - 1) ? 'bg-slate-800 dark:bg-purple-500' : 'bg-slate-300 dark:bg-slate-700']"
            @click="goToPage(n - 1)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// (Script remains exactly the same as you provided)
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { testimonials as defaultTestimonials } from '~/utils/data.js'

const props = defineProps({
  testimonialsList: { type: Array, default: () => defaultTestimonials || [] },
  autoplay: { type: Boolean, default: true },
  autoplayInterval: { type: Number, default: 3000 },
  animationDuration: { type: Number, default: 500 }
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

const sourceSlides = ref(props.testimonialsList.slice())
const slidesCount = computed(() => Math.max(1, sourceSlides.value.length))
const extendedSlides = ref([])
const clonesCount = ref(0)
const currentIndex = ref(0)
const isAnimating = ref(true)
const slideWidth = ref(0)
const translateX = ref(0)
let timer = null

function buildExtended() {
  clonesCount.value = Math.min(slidesPerView.value, slidesCount.value)
  const head = sourceSlides.value.slice(0, clonesCount.value).map(s => ({ ...s, __cloneId: `head-${s.id || Math.random()}` }))
  const tail = sourceSlides.value.slice(-clonesCount.value).map(s => ({ ...s, __cloneId: `tail-${s.id || Math.random()}` }))
  extendedSlides.value = [...tail, ...sourceSlides.value, ...head]
  currentIndex.value = clonesCount.value
}

function measure() {
  const vp = viewportRef.value
  if (!vp) return
  const w = vp.clientWidth || 0
  slideWidth.value = Math.floor(w / slidesPerView.value)
  translateX.value = -currentIndex.value * slideWidth.value
  isAnimating.value = false
  nextTick(() => { setTimeout(() => { isAnimating.value = true }, 30) })
}

function onTransitionEnd() {
  const realStart = clonesCount.value
  const realEnd = clonesCount.value + slidesCount.value - 1
  if (currentIndex.value > realEnd) {
    isAnimating.value = false
    currentIndex.value = realStart
    translateX.value = -currentIndex.value * slideWidth.value
    nextTick(() => { setTimeout(() => { isAnimating.value = true }, 30) })
  } else if (currentIndex.value < realStart) {
    isAnimating.value = false
    currentIndex.value = realEnd
    translateX.value = -currentIndex.value * slideWidth.value
    nextTick(() => { setTimeout(() => { isAnimating.value = true }, 30) })
  }
}

function prev() { isAnimating.value = true; currentIndex.value -= 1; translateX.value = -currentIndex.value * slideWidth.value }
function next() { isAnimating.value = true; currentIndex.value += 1; translateX.value = -currentIndex.value * slideWidth.value }
function goToPage(page) {
  const target = clonesCount.value + page * slidesPerView.value
  isAnimating.value = true; currentIndex.value = target; translateX.value = -currentIndex.value * slideWidth.value
}

const visiblePageCount = computed(() => Math.max(1, Math.ceil(slidesCount.value / slidesPerView.value)))
const currentPage = computed(() => {
  const realStart = clonesCount.value
  const indexInReal = (currentIndex.value - realStart + slidesCount.value) % slidesCount.value
  return Math.floor(indexInReal / slidesPerView.value)
})

function startAutoplay() { if (!props.autoplay) return; stopAutoplay(); timer = setInterval(() => { next() }, props.autoplayInterval) }
function stopAutoplay() { if (timer) { clearInterval(timer); timer = null } }
function pauseAutoplay() { stopAutoplay() }
function stopAll() { stopAutoplay() }

watch([slidesPerView, () => props.testimonialsList], () => { sourceSlides.value = props.testimonialsList.slice(); buildExtended(); nextTick(() => measure()) })

onMounted(() => { updateSlidesPerView(); window.addEventListener('resize', () => { updateSlidesPerView(); nextTick(() => measure()) }); buildExtended(); nextTick(() => measure()); startAutoplay() })
onUnmounted(() => { window.removeEventListener('resize', measure); stopAll() })
</script>

<style scoped>
/* No extra styles needed */
</style>