<!-- components/homepage/EcosystemStrip.vue -->
<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import { useEcosystem } from '~/composables/useEcosystem'
import EcoLink from '~/components/homepage/EcoLink.vue'

const { products } = useEcosystem()

// The sibling apps only. XeliAI is the site you are already on.
const siblings = products.filter(p => p.external)
</script>

<template>
  <section class="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        More from XeliAI
      </h2>
      <p class="mt-2 text-gray-500 dark:text-gray-400 text-lg">
        One family of products. Pick the one you need.
      </p>

      <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!--
          show-external-icon is off here because this card already has its
          own designed external-link affordance: the large ArrowUpRight in
          the top-right corner below, with the group-hover treatment. Without
          the opt-out, EcoLink would add a second, smaller arrow trailing the
          tagline, which reads as a stray mark rather than a link affordance.
          The visually-hidden "opens in a new tab" text still renders either
          way, so screen readers get the same context-switch warning.
        -->
        <EcoLink
          v-for="product in siblings"
          :key="product.id"
          data-ecosystem-card
          :item="{ label: product.name, to: product.href, external: product.external }"
          :show-external-icon="false"
          class="group block p-6 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 hover:border-purple-400 dark:hover:border-purple-500 hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ product.name }}</h3>
            <ArrowUpRight
              class="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors"
              aria-hidden="true"
            />
          </div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {{ product.tagline }}
          </p>
        </EcoLink>
      </div>
    </div>
  </section>
</template>
