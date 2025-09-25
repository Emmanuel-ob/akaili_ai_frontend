


<template>
    <div class="overflow-hidden  bg-[#0b1020] pt-30 md:pt-38 lg:pt-43">
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
