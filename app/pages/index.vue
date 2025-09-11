


<template>
    <div class="overflow-hidden">
      <Hero />
      <ProductSuite />
      <Features />    
      <TestimonialCarousel />
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
import Hero from '../components/homepage/Hero.vue'
import ProductSuite from '../components/homepage/ProductSuite.vue'
import Features from '../components/homepage/Features.vue'
import TestimonialCarousel from '~/components/homepage/TestimonialCarousel.vue'
import CtaBanner from '../components/homepage/CtaBanner.vue'
import GradualBlur from '~/components/homepage/GradualBlur.vue'
import { onMounted } from 'vue'


definePageMeta({
  layout: "default",
});


useSeoMeta({
  title: 'Akili Ai',
  description: "Empower Your Website with 24/7 Smart Customer Support",
  ogTitle: 'Akili Ai',
  ogDescription:  "Empower Your Website with 24/7 Smart Customer Support",
  ogImage: '/nuxt-course-hero.png',
  ogUrl: 'Akili Ai',
  twitterTitle: 'Akili Ai',
  twitterDescription:  "Empower Your Website with 24/7 Smart Customer Support",
  twitterImage: '[twitter:image]',
  twitterCard: 'summary'
})
    onMounted(() => {
  if (window.AOS) {
    window.AOS.init({
      duration: 1000,
      once: true,
    })
  }
})
    
</script>
