<!-- layouts/default.vue -->
<script setup>
import MainNavbar from '../components/homepage/MainNavbar.vue'
import Footer from '../components/homepage/Footer.vue'
</script>

<template>
    <div class="font-sans min-h-screen transition-colors duration-300 bg-white dark:bg-slate-950 text-gray-900 dark:text-white selection:bg-purple-500 selection:text-white">
        <MainNavbar />

        <slot />
        
        <Footer />
    </div> 
</template>