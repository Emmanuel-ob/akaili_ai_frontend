<template>
<section class="py-16 bg-[#0b1020] text-white">
<div class="max-w-7xl mx-auto px-6 lg:px-8">
<div class="flex items-center justify-between mb-8">
<div>
<h2 class="text-3xl sm:text-4xl font-extrabold gradient-text">Product suite — Unlock the toolbox</h2>
<p class="mt-2 text-gray-400 max-w-xl">Pick the tools you need. Mix and match. All AI-powered, all low maintenance.</p>
</div>


<div class="flex gap-2 items-center">
<button class="filter-btn">All</button>
<button class="filter-btn">Support</button>
<button class="filter-btn">Automation</button>
</div>
</div>


<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
<article
v-for="p in products"
:key="p.id"
class="product-card group"
:style="{ '--accent': p.color || '#9E4CFF' }"
data-aos="zoom-in-up"
>
<div class="card-top flex items-start gap-4">
<div class="icon-wrap" :aria-hidden>

<img :src="`/${p.image}`" :alt="p.title" class="w-full h-full object-cover rounded-3xl" />
</div>
<div class="flex-1">
<div class="flex items-center gap-3">
<h3 class="text-lg font-semibold leading-tight">{{ p.title }}</h3>
<span class="micro-label">{{ p.category }}</span>
</div>
<p class="mt-2 text-gray-300 text-sm max-w-[90%]">{{ p.description }}</p>
</div>
</div>


<ul class="mt-6 features-list">
<li v-for="(f, idx) in p.features.slice(0,4)" :key="idx" class="flex items-start gap-3">
<span class="feature-dot" aria-hidden>✓</span>
<p class="text-sm text-gray-300">{{ f }}</p>
</li>
</ul>


<div class="mt-6 flex items-center justify-between">
<button class="card-cta">Try it free</button>
<div class="meta text-xs text-gray-400">Avg setup: <strong class="text-white">2 min</strong></div>
</div>

</article>
</div>
</div>
</section>
</template>

<script setup>
import { productsuite } from '~/utils/data.js'

const products = productsuite.map((p, i) => ({ ...p, color: p.color || (['#9E4CFF','#00D4FF','#FF7AB6'][i % 3]), category: p.category || ['Automation','Support','Insight'][i % 3]}))
</script>

<style scoped>
:root{--brand1:#9E4CFF}

.product-card{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border:1px solid rgba(255,255,255,0.04); border-radius:1rem; padding:18px; position:relative; overflow:hidden; transition:transform .35s cubic-bezier(.2,.9,.2,1), box-shadow .35s}
.product-card:hover{transform:translateY(-10px) rotateX(4deg); box-shadow:0 18px 50px rgba(2,6,23,0.6), 0 0 36px rgba(158,76,255,0.12); border-color: color-mix(in srgb, var(--accent) 20%, rgba(255,255,255,0.06))}

.icon-wrap{width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center; background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); box-shadow:0 6px 20px rgba(127,86,217,0.08)}
.micro-label{background:linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); color:#e6e6ff; padding:.25rem .6rem; border-radius:9999px; font-size:.72rem}

.features-list li{padding:6px 0}
.feature-dot{width:28px; height:28px; min-width:28px; border-radius:9999px; display:inline-grid; place-items:center; background:linear-gradient(90deg,var(--accent), #fff 60%); color:#0b1020; font-weight:700; box-shadow:0 6px 18px rgba(127,86,217,0.1)}

.card-cta{background:linear-gradient(90deg,var(--accent), #7F56D9); color:white; padding:.5rem .9rem; border-radius:12px; font-weight:600; box-shadow:0 8px 28px rgba(127,86,217,0.12); transition:transform .2s}
.card-cta:hover{transform:translateY(-3px)}

.hover-badge{position:absolute; right:12px; bottom:12px; background:transparent; color:rgba(255,255,255,0.5); font-weight:700; border-radius:9999px; padding:.3rem .7rem; border:1px solid rgba(255,255,255,0.04); transform:translateY(10px); opacity:0; transition:all .28s}
.product-card:hover .hover-badge{transform:translateY(0); opacity:1; background:linear-gradient(90deg,var(--accent), rgba(255,255,255,0.08)); color:white}

/* micro tilt support for 3D feel */
.product-card{transform-origin:center}

@media(min-width:1024px){
  .product-card{padding:22px}
}
</style>