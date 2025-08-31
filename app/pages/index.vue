
<script setup>
import Hero from '../components/homepage/Hero.vue'
import ProductSuite from '../components/homepage/ProductSuite.vue'
import Features from '../components/homepage/Features.vue'
import Testimonials from '../components/homepage/Testimonials.vue'
import CtaBanner from '../components/homepage/CtaBanner.vue'


definePageMeta({
  layout: "default",
});
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
