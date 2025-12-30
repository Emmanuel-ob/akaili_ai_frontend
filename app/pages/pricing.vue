<template>
  <section class="relative bg-white dark:bg-slate-950 transition-colors duration-300 min-h-screen">
    <!-- Updated Padding: pt-32 (mobile) and md:pt-40 (desktop) to clear navbar -->
    <div class="pt-37 pb-20 md:pt-45 md:pb-28">

      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p class="text-lg md:text-xl text-slate-600 dark:text-gray-400 leading-relaxed">
            Choose the plan that best fits your needs. No hidden fees, cancel anytime.
          </p>
        </div>
        
        <!-- Decorative background glow -->
        <div aria-hidden class="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#9E4CFF]/10 blur-[100px]"></div>
        
        <div class="grid gap-8 md:grid-cols-3 items-stretch relative z-10">
          <!-- STARTER -->
          <PricingCard
            plan-id="starter"
            title="Starter"
            subtitle="Perfect for small businesses"
            price-text="Free"
            price-suffix="/month"
            :features="['Up to 1,000 conversations/month', '1 chatbot', 'Basic analytics', 'Email support']"
            cta="Get Started Free"
            @select-plan="handlePlanSelection"
          />
          
          <!-- PROFESSIONAL -->
          <PricingCard
            plan-id="professional"
            title="Professional"
            subtitle="For growing companies"
            price-text="$99"
            price-suffix="/month"
            :features="['Up to 10,000 conversations/month', '5 chatbots', 'Advanced analytics', 'Priority support', 'Database integration']"
            cta="Get Started"
            :featured="true"
            @select-plan="handlePlanSelection"
          />
          
          <!-- ENTERPRISE -->
          <PricingCard
            plan-id="enterprise"
            title="Enterprise"
            subtitle="For large organizations"
            price-text="$299"
            price-suffix="/month"
            :features="['Unlimited conversations', 'Unlimited chatbots', 'Custom analytics', '24/7 phone support', 'Advanced security']"
            cta="Contact Sales"
            @select-plan="handlePlanSelection"
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
import { useRouter } from 'vue-router'

const router = useRouter()

const handlePlanSelection = (planId) => {
  if (planId === 'starter') {
    // Free plan goes straight to registration
    router.push('/register?plan=starter')
  } else {
    // Paid plans go to checkout with query params
    router.push({ path: '/checkout', query: { plan: planId } })
  }
}

onMounted(() => {
  if (window.AOS) {
    window.AOS.init({ duration: 1000, once: true })
  }
})
</script>