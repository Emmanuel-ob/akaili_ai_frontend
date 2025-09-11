<script setup>
import {productsuite} from '../../utils/data'
</script>

<template>
<section class="relative overflow-hidden py-20" style="background:#111827;">
<!-- background accents -->
<div class="pointer-events-none absolute inset-0 -z-10">
<div class="absolute inset-0" style="background: linear-gradient(180deg, rgba(127,86,217,0.05), rgba(17,24,39,0.5)); mix-blend-mode: overlay;"></div>
<!-- purple glow spots -->
<div class="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-[#7F56D9] opacity-20 blur-3xl"></div>
<div class="absolute bottom-10 right-1/4 w-[600px] h-[600px] rounded-full bg-[#7F56D9] opacity-10 blur-3xl"></div>
</div>


<div class="relative w-[95%] flex flex-col items-center mx-auto px-6 lg:px-8">
<div class="text-center max-w-3xl mx-auto mb-14">
<h2 class="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent" style="background-image:linear-gradient(90deg,#7F56D9, #ffffff);">AI-Powered Product Suite</h2>
<p class="mt-4 text-lg text-gray-300">
Explore a suite of AI-powered tools designed to streamline support,
simplify operations, and scale your business effortlessly
</p>
</div>


<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
<article
v-for="p in productsuite"
:key="p.id"
class="revamped-card flex flex-col max-w-sm mx-auto transform transition duration-300 hover:-translate-y-2"
data-aos="zoom-in-up"
:data-aos-delay="p.id * 120"
>
<!-- image -->
<div class="relative w-full h-60 flex items-center justify-center overflow-hidden">
<img :src="`/${p.image}`" :alt="p.title" class="object-contain max-h-full" />
<!-- glow overlay -->
<div class="absolute inset-0 bg-gradient-to-br from-[#7F56D9]/20 to-transparent"></div>
</div>


<!-- content -->
<div class="p-6 flex flex-col flex-1">
<h3 class="text-xl font-semibold text-white">{{ p.title }}</h3>
<p class="mt-3 text-gray-300 text-base leading-relaxed">{{ p.description }}</p>


<ul class="mt-6 space-y-3 text-sm text-gray-300 flex-1">
<li
v-for="(feature, i) in p.features"
:key="i"
class="flex items-start gap-2"
data-aos="fade-left"
:data-aos-delay="i * p.id * 60"
>
<span class="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-[#7F56D9] to-white"></span>
<p class="text-base">{{ feature }}</p>
</li>
</ul>

</div>
</article>
</div>
</div>
</section>
</template>


<style scoped>
.revamped-card{
background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
border: 1px solid rgba(255,255,255,0.06);
backdrop-filter: blur(6px);
border-radius: 1rem;
}
.revamped-card:hover{
box-shadow: 0 10px 30px rgba(2,6,23,0.7), 0 0 30px rgba(127,86,217,0.18);
border-color: rgba(127,86,217,0.3);
}
</style>


