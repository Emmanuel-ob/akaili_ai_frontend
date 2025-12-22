<template>
  <!-- Added bg-white dark:bg-slate-950 -->
  <section class="relative bg-white dark:bg-slate-950 transition-colors duration-300">
    <div class="py-16">

      <div class="max-w-6xl mx-auto mt-[4rem] px-6">
        <div class="text-center mb-10">
          <!-- Headers: Added dark text classes -->
          <h2 class="main_header text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p class="main_subheader text-lg text-slate-600 dark:text-gray-400">
            Choose the plan that best fits your needs. No hidden fees, cancel anytime.
          </p>
        </div>
        
        <!-- Decorative circle: Adjusted opacity/color for dark mode -->
        <div aria-hidden class="pointer-events-none absolute right-0 -top-20 w-60 h-60 rounded-full bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-950 opacity-80 blur-3xl"></div>
        
        <div class="grid gap-6 md:grid-cols-3 items-stretch relative z-10">
          <PricingCard
            title="Starter"
            subtitle="Perfect for small businesses"
            price-text="Free"
            price-suffix="/month"
            :features="['Up to 1,000 conversations/month', '1 chatbot', 'Basic analytics', 'Email support']"
            cta="Get Started"
          />
          
          <PricingCard
            title="Professional"
            subtitle="For growing companies"
            price-text="$99"
            price-suffix="/month"
            :features="['Up to 10,000 conversations/month', '5 chatbots', 'Advanced analytics', 'Priority support', 'Database integration']"
            cta="Get Started"
            :featured="true"
          />
          
          <PricingCard
            title="Enterprise"
            subtitle="For large organizations"
            price-text="$299"
            price-suffix="/month"
            :features="['Unlimited conversations', 'Unlimited chatbots', 'Custom analytics', '24/7 phone support', 'Advanced security']"
            cta="Contact Sales"
          />
        </div>
      </div>
    </div>
    <CtaBanner />
  </section>
</template>

<script setup>
import PricingCard from '../components/homepage/PricingCard.vue'
import CtaBanner from '~/components/homepage/CtaBanner.vue';
import { onMounted } from 'vue'

onMounted(() => {
  if (window.AOS) {
    window.AOS.init({ duration: 1000, once: true })
  }
})
</script>