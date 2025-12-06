<template>
  <section class="w-full bg-[#111827] border-" >
    <div class="  px-6 py-20">
      <div class="rounded-lg p-8 text-center" >
        <h3 class="md:text-4xl text-4xl font-bold text-white">{{ cta.heading }}</h3>
        <p class="mt-5 text-2xl text-gray-500">{{ cta.subheading }}</p>

        <div class="mt-6">
            <NuxtLink to="/get-started">
            <button class="px-11  py-4 nav_primary_btn  text-white rounded-lg">
              Get Started
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { cta } from '~/utils/data.js'
</script>

<style scoped>
/* you can tweak the CTA look here */
</style>
