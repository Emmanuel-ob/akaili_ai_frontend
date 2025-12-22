<template>
    <!-- Added dark:bg-slate-950 -->
    <div class="overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300 pt-30 md:pt-38 lg:pt-43">
      <Testimonials />
      <CtaBanner />
      <GradualBlur
        preset="footer"
        target="page"
        animated="scroll"
        :z-index="9999"
      />
    </div>
</template>

<script setup>
import Testimonials from '../components/homepage/Testimonials.vue'
import GradualBlur from '~/components/homepage/GradualBlur.vue'
import CtaBanner from '~/components/homepage/CtaBanner.vue'

definePageMeta({ layout: "default" });

useSeoMeta({
  title: 'Xeli ai - Testimonials',
  description: "Empower Your Website with 24/7 Smart Customer Support",
})
</script>