<script setup>
import * as math from 'mathjs'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  position: { type: String, default: 'bottom' },
  strength: { type: Number, default: 2 },
  height: { type: String, default: '6rem' },
  width: { type: String, default: null },
  divCount: { type: Number, default: 5 },
  exponential: { type: Boolean, default: false },
  zIndex: { type: Number, default: 1000 },
  animated: { type: [Boolean, String], default: false },
  duration: { type: String, default: '0.3s' },
  easing: { type: String, default: 'ease-out' },
  opacity: { type: Number, default: 1 },
  curve: { type: String, default: 'linear' },
  responsive: { type: Boolean, default: true },   // ✅ enable responsive
  mobileHeight: { type: String, default: '2rem' }, // ✅ smaller height for mobile
  tabletHeight: { type: String, default: '4rem' }, // ✅ medium for tablets
  desktopHeight: { type: String, default: '5rem' }, // ✅ default for large
  mobileWidth: { type: String, default: null },
  tabletWidth: { type: String, default: null },
  desktopWidth: { type: String, default: null },
  preset: { type: String, default: null },
  gpuOptimized: { type: Boolean, default: false },
  hoverIntensity: { type: Number, default: null },
  target: { type: String, default: 'parent' },
  onAnimationComplete: { type: Function, default: null },
  className: { type: String, default: '' },
  style: { type: Object, default: () => ({}) }
})

const PRESETS = {
  subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },
  smooth: { height: '8rem', curve: 'bezier', divCount: 10 },
  sharp: { height: '5rem', curve: 'linear', divCount: 4 }
}

const CURVE_FUNCTIONS = {
  linear: p => p,
  bezier: p => p * p * (3 - 2 * p),
  'ease-in': p => p * p,
  'ease-out': p => 1 - Math.pow(1 - p, 2),
  'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
}

const containerRef = ref(null)
const isHovered = ref(false)
const isVisible = ref(true)
const responsiveHeight = ref(props.height)
const responsiveWidth = ref(props.width)

// new: detect scroll bottom
const atBottom = ref(false)
const checkIfAtBottom = () => {
  const scrollY = window.scrollY
  const visible = window.innerHeight + scrollY
  const fullHeight = document.documentElement.scrollHeight
  atBottom.value = visible >= fullHeight - 10
}

// ✅ adjust height/width on resize
const updateResponsiveDimensions = () => {
  if (!props.responsive) return

  const width = window.innerWidth
  let newHeight = props.height

  if (width <= 480) {
    newHeight = props.mobileHeight
  } else if (width <= 768) {
    newHeight = props.tabletHeight
  } else {
    newHeight = props.desktopHeight
  }

  responsiveHeight.value = newHeight
  responsiveWidth.value = props.width
}

const config = computed(() => {
  const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {}
  return { ...presetConfig, ...props }
})

const getGradientDirection = position => {
  const directions = { top: 'to top', bottom: 'to bottom', left: 'to left', right: 'to right' }
  return directions[position] || 'to bottom'
}

const blurDivs = computed(() => {
  const divs = []
  const increment = 100 / config.value.divCount
  const currentStrength =
    isHovered.value && config.value.hoverIntensity
      ? config.value.strength * config.value.hoverIntensity
      : config.value.strength

  const curveFunc = CURVE_FUNCTIONS[config.value.curve] || CURVE_FUNCTIONS.linear

  for (let i = 1; i <= config.value.divCount; i++) {
    let progress = i / config.value.divCount
    progress = curveFunc(progress)

    let blurValue
    if (config.value.exponential) {
      blurValue = Number(math.pow(2, progress * 4)) * 0.0625 * currentStrength
    } else {
      blurValue = 0.0625 * (progress * config.value.divCount + 1) * currentStrength
    }

    const p1 = Math.round((increment * i - increment) * 10) / 10
    const p2 = Math.round(increment * i * 10) / 10
    const p3 = Math.round((increment * i + increment) * 10) / 10
    const p4 = Math.round((increment * i + increment * 2) * 10) / 10

    let gradient = `transparent ${p1}%, black ${p2}%`
    if (p3 <= 100) gradient += `, black ${p3}%`
    if (p4 <= 100) gradient += `, transparent ${p4}%`

    const direction = getGradientDirection(config.value.position)

    const divStyle = {
      maskImage: `linear-gradient(${direction}, ${gradient})`,
      WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
      backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
      opacity: config.value.opacity,
      transition:
        config.value.animated && config.value.animated !== 'scroll'
          ? `backdrop-filter ${config.value.duration} ${config.value.easing}`
          : undefined
    }

    divs.push({ style: divStyle })
  }

  return divs
})

const containerStyle = computed(() => {
  const isVertical = ['top', 'bottom'].includes(config.value.position)
  const isHorizontal = ['left', 'right'].includes(config.value.position)
  const isPageTarget = config.value.target === 'page'

  const baseStyle = {
    position: isPageTarget ? 'fixed' : 'absolute',
    pointerEvents: config.value.hoverIntensity ? 'auto' : 'none',
    opacity: isVisible.value ? 1 : 0,
    transition: config.value.animated ? `opacity ${config.value.duration} ${config.value.easing}` : undefined,
    zIndex: isPageTarget ? config.value.zIndex + 100 : config.value.zIndex,
    ...config.value.style
  }

  if (isVertical) {
    baseStyle.height = responsiveHeight.value
    baseStyle.width = responsiveWidth.value || '100%'
    baseStyle[config.value.position] = '0'
    baseStyle.left = '0'
    baseStyle.right = '0'
  } else if (isHorizontal) {
    baseStyle.width = responsiveWidth.value || responsiveHeight.value
    baseStyle.height = '100%'
    baseStyle[config.value.position] = '0'
    baseStyle.top = '0'
    baseStyle.bottom = '0'
  }

  return baseStyle
})

// watchers
watch(atBottom, newVal => {
  isVisible.value = !newVal
})

onMounted(() => {
  window.addEventListener('scroll', checkIfAtBottom)
  window.addEventListener('resize', updateResponsiveDimensions)

  checkIfAtBottom()
  updateResponsiveDimensions()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkIfAtBottom)
  window.removeEventListener('resize', updateResponsiveDimensions)
})
</script>

<template>
  <div
    ref="containerRef"
    :class="[
      'gradual-blur relative isolate',
      config.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent',
      config.className
    ]"
    :style="containerStyle"
    @mouseenter="config.hoverIntensity ? (isHovered = true) : null"
    @mouseleave="config.hoverIntensity ? (isHovered = false) : null"
  >
    <div class="relative w-full h-full">
      <div v-for="(div, index) in blurDivs" :key="index" class="absolute inset-0" :style="div.style" />
    </div>
    <div v-if="$slots.default" class="relative">
      <slot />
    </div>
  </div>
</template>
