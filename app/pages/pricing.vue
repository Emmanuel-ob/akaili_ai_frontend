<template>
  
  <section class="relative bg-white dark:bg-slate-950 transition-colors duration-300 min-h-screen overflow-hidden">
    
    <!-- Padding adjusted for navbar clearance -->
    <div class="pt-32 pb-20 md:pt-40 md:pb-28">

      <!-- Changed px-6 to px-4 on mobile for more space -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p class="text-base md:text-xl text-slate-600 dark:text-gray-400 leading-relaxed">
            Choose the plan that best fits your needs. No hidden fees, cancel anytime.
          </p>
        </div>
        
        <!-- Fixed Blob: Added max-w-full to prevent it from forcing width on mobile -->
        <div aria-hidden class="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-[600px] h-[400px] md:h-[600px] rounded-full bg-[#9E4CFF]/10 blur-[80px] md:blur-[100px]"></div>
        
        <!-- Grid: Ensuring single column on mobile -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch relative z-10">
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
    router.push('/register?plan=starter')
  } else {
    router.push({ path: '/checkout', query: { plan: planId } })
  }
}

onMounted(() => {
  if (window.AOS) {
    window.AOS.init({ duration: 1000, once: true })
  }
})
</script>