<script setup>
import {productsuite} from '../../utils/data'
</script>

<template>

  <section class="bg-white">
  <div class="w-[95%] flex flex-col items-center mx-auto py-16 px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-2xl mx-auto">
      <h2 class="main_header">AI-Powered Product Suite</h2>
      <p class="main_subheader">
        Explore a suite of AI-powered tools designed to streamline support,
        simplify operations, and scale your business effortlessly
      </p>
    </div>

    <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- card -->
      <article
        v-for="p in productsuite"
        :key="p.id"
        class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col max-w-sm mx-auto hover:shadow-lg transition"
      >
        <!-- image -->
          <div class="w-full h-60 rounded-md overflow-hidden  bg-gradient-to-br flex items-center justify-center">
              <img :src="`/${p.image}`" :alt="p.title" class="w-full object-contain"/>
            </div>

        <!-- content -->
        <div class="p-6 flex flex-col flex-1">
          <h3 class="font-bold text-xl font_color">{{ p.title }}</h3>
          <p class="mt-4 text-gray-500 text-base">{{ p.description }}</p>

          <ul class="mt-6 space-y-3 text-sm text-gray-600 flex-1">
            <li
              v-for="(feature, i) in p.features"
              :key="i"
              class="flex items-center gap-2"
            >
              <img src="/purple_dot.png" alt="dot" class="w-2 h-2" />
              <p class="text-base">{{ feature }}</p>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </div>
</section>

</template>


