<!-- pages/about.vue -->
<template>
    <div class="overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300 pt-32 md:pt-40 lg:pt-44">
      
      
      <AboutSection />
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
import AboutSection from '~/components/homepage/AboutSection.vue'
import GradualBlur from '~/components/homepage/GradualBlur.vue'
import CtaBanner from '~/components/homepage/CtaBanner.vue'

definePageMeta({ layout: "default" });

useSeoMeta({
  title: 'About Xeli AI - Our Mission & Team',
  description: "Building the future of automated customer engagement.",
})
</script>