<!-- components/homepage/EcoLink.vue -->
<!--
  Single presentational link used everywhere the ecosystem nav renders an
  item: the desktop dropdown, the mobile drawer, and the footer. Keeping
  the external-vs-internal branching (and the security-relevant
  rel="noopener noreferrer") in one place means it can't drift between
  those three call sites.
-->
<script setup>
defineProps({
  item: { type: Object, required: true },
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
  </a>
  <NuxtLink v-else :to="item.to">
    <slot />
  </NuxtLink>
</template>
