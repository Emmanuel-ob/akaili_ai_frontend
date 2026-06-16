<!-- components/referral/XpBadge.vue -->
<!-- Displays the user's current XPT balance as a compact pill badge. -->
<!-- Used in dashboard.vue sidebar (desktop & mobile) near the user section. -->
<template>
  <NuxtLink
    to="/dashboard/settings?tab=referrals"
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 select-none"
    :class="[
      glowingResolved
        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-300 dark:ring-amber-500/40 shadow-amber-200/60 dark:shadow-amber-500/20 shadow-sm'
        : 'bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] dark:text-purple-400 ring-1 ring-purple-200 dark:ring-purple-500/20'
    ]"
    :title="`${xptResolved} XPT — click to view your referral rewards`"
  >
    <!-- Zap icon (inline SVG to match the rest of the project's icon style) -->
    <svg
      class="w-3 h-3 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M13 2L4.09 12.97A1 1 0 005 14.5h6.5L11 22l8.91-10.97A1 1 0 0019 9.5H12.5L13 2z" />
    </svg>
    <span>{{ xptResolved }} XPT</span>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'
import { useReferralStore } from '~/stores/referralStore'

const props = defineProps({
  /** Optional XPT override; when null, reads referralStore.xptBalance. */
  xpt: {
    type: Number,
    default: null,
  },
  /** Optional glow override; when null, derives from xpt >= economy.withdrawalMinXpt. */
  glowing: {
    type: Boolean,
    default: null,
  },
})

const referralStore = useReferralStore()

const xptResolved = computed(() =>
  props.xpt !== null ? props.xpt : (referralStore.xptBalance ?? 0)
)

const glowingResolved = computed(() => {
  if (props.glowing !== null) return props.glowing
  const threshold = referralStore.economy?.withdrawalMinXpt ?? 0
  return xptResolved.value >= threshold
})
</script>
