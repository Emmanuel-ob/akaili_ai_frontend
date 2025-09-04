
<script setup>
import Hero from '../components/homepage/Hero.vue'
import ProductSuite from '../components/homepage/ProductSuite.vue'
import Features from '../components/homepage/Features.vue'
import Testimonials from '../components/homepage/Testimonials.vue'
import CtaBanner from '../components/homepage/CtaBanner.vue'


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
</script>



<template>
    <div class="overflow-hidden">
       <Hero />
        <ProductSuite />
        <Features />    
        <Testimonials />
        <CtaBanner />

             
    </div>
</template>
