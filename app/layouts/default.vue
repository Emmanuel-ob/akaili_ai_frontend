        
        <script setup>
        import MainNavbar from '../components/homepage/MainNavbar.vue'
        import Footer from '../components/homepage/Footer.vue'
        
        </script>
<template>
    <div class="font-sans">
        <MainNavbar />

        <slot />
        
        <Footer />
        
    </div> 
</template>

