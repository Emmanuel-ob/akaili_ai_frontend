<!-- components/homepage/EcoLink.vue -->
<!--
  Single presentational link used everywhere the ecosystem nav renders an
  item: the desktop dropdown, the mobile drawer, and the footer. Keeping
  the external-vs-internal branching (and the security-relevant
  rel="noopener noreferrer") in one place means it can't drift between
  those call sites.

  It is also the single place that owns the external-link affordance: a
  small currentColor glyph for sighted users and visually-hidden text for
  assistive tech, so every consumer gets both for free instead of each
  one having to remember to add them.

  A caller with its own designed "external" treatment (the ecosystem
  strip's large corner arrow) can opt out of the glyph with
  :show-external-icon="false" to avoid rendering two arrows on one link.
  The hidden text stays either way: it is the accessibility contract, not
  a decoration, so screen-reader users still get the context-switch
  warning even when the visual glyph is suppressed.
-->
<script setup>
import { ArrowUpRight } from 'lucide-vue-next'

defineProps({
  item: { type: Object, required: true },
  showExternalIcon: { type: Boolean, default: true },
})
</script>

<template>
  <a
    v-if="item.external"
    :href="item.to"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot />
    <ArrowUpRight
      v-if="showExternalIcon"
      class="inline-block w-3 h-3 ml-1 align-text-top opacity-70"
      aria-hidden="true"
    />
    <span class="sr-only">(opens in a new tab)</span>
  </a>
  <NuxtLink v-else :to="item.to">
    <slot />
  </NuxtLink>
</template>
