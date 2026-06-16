<template>
  <section class="relative bg-white dark:bg-slate-950 transition-colors duration-300 min-h-screen overflow-hidden">
    
    <div class="pt-32 pb-20 md:pt-40 md:pb-28">

      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p class="text-base md:text-xl text-slate-600 dark:text-gray-400 leading-relaxed">
            Choose the plan that best fits your needs. No hidden fees, cancel anytime.
          </p>
          <p v-if="recommended" class="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Prices shown in <span class="font-semibold text-slate-700 dark:text-slate-200">{{ recommended.currency }}</span>
            <span v-if="recommended.country"> for {{ recommended.country }}</span>.
          </p>
        </div>
        
        <div aria-hidden class="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-[600px] h-[400px] md:h-[600px] rounded-full bg-[#9E4CFF]/10 blur-[80px]"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch relative z-10">
          <!-- STARTER -->
          <PricingCard
            plan-id="starter"
            title="Starter"
            subtitle="Perfect for small businesses"
            :price-text="priceText('starter')"
            price-suffix="/month"
            :features="featuresFor('starter')"
            :cta="getButtonText('starter')"
            :is-current="isCurrentPlan('starter')"
            @select-plan="handlePlanSelection"
          />

          <!-- PROFESSIONAL -->
          <PricingCard
            plan-id="professional"
            title="Professional"
            subtitle="For growing companies"
            :price-text="priceText('professional')"
            price-suffix="/month"
            :features="featuresFor('professional')"
            :cta="getButtonText('professional')"
            :featured="true"
            :is-current="isCurrentPlan('professional')"
            @select-plan="handlePlanSelection"
          />

          <!-- ENTERPRISE -->
          <PricingCard
            plan-id="enterprise"
            title="Enterprise"
            subtitle="For large organizations"
            :price-text="priceText('enterprise')"
            price-suffix="/month"
            :features="featuresFor('enterprise')"
            :cta="getButtonText('enterprise')"
            :is-current="isCurrentPlan('enterprise')"
            @select-plan="handlePlanSelection"
          />
        </div>
      </div>
    </div>
    <CtaBanner />

    <!-- Custom Downgrade Modal -->
    <DowngradeModal v-if="showDowngradeModal" @close="showDowngradeModal = false" @confirm="confirmDowngrade" />
  </section>
</template>

<script setup>
import PricingCard from '../components/homepage/PricingCard.vue'
import CtaBanner from '~/components/homepage/CtaBanner.vue';
import DowngradeModal from '~/components/settings/DowngradeModal.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { useAuthStore } from '~/stores/authStore'
import { useSubscriptionStore } from '~/stores/subscriptionStore'

const config = useRuntimeConfig()
const router = useRouter()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const toast = useToast()

const showDowngradeModal = ref(false)
const plansData = ref(null)
const plansLoadFailed = ref(false)
const recommended = computed(() => plansData.value?.recommended ?? null)

function findPlan(id) {
    if (!plansData.value?.plans) return null
    return plansData.value.plans.find((p) => p.id === id) ?? null
}

// While plansData is null (still loading or fetch failed), return null so
// PricingCard renders its skeleton bar. Never return a hardcoded literal —
// that's what produced the USD-flicker before NGN values arrived.
function priceText(id) {
    const plan = findPlan(id)
    if (!plan) return null
    if (plan.is_free) return 'Free'
    return plan.price?.formatted ?? null
}

function featuresFor(id) {
    const plan = findPlan(id)
    return Array.isArray(plan?.features) && plan.features.length ? plan.features : null
}

const isCurrentPlan = (planId) => {
  return authStore.isLoggedIn && subscriptionStore.currentPlan?.id === planId
}

const getButtonText = (planId) => {
  if (isCurrentPlan(planId)) return 'Current Plan'
  return planId === 'starter' ? 'Get Started Free' : (planId === 'enterprise' ? 'Contact Sales' : 'Get Started')
}

const handlePlanSelection = async (planId) => {
  // 1. Prevent clicking on current plan
  if (isCurrentPlan(planId)) return

  // 2. Auth Check
  if (!authStore.isLoggedIn) {
    // UPDATED: Pass plan via URL instead of localStorage
    return router.push({ path: '/register', query: { plan: planId } })
  }

  // 3. Handle Downgrade to Free
  if (planId === 'starter') {
    showDowngradeModal.value = true
  } else {
    // 4. Handle Upgrade (Paid) -> Checkout
    router.push({ path: '/checkout', query: { plan: planId, from: 'pricing' } })
  }
}

const confirmDowngrade = async () => {
  await subscriptionStore.changePlan('starter')
  showDowngradeModal.value = false
  router.push('/dashboard/settings')
}

onMounted(async () => {
    if (authStore.isLoggedIn) {
        subscriptionStore.fetchSubscription()
    }

    // Pull real prices + recommended currency/provider. Skeleton bars render
    // until plansData is populated — no hardcoded literal fallback (that's
    // what produced the USD→NGN flicker on first paint).
    try {
        const response = await $fetch(`${config.public.apiBase}/api/plans`)
        if (response?.success && response?.data) {
            plansData.value = response.data
            plansLoadFailed.value = false
        } else {
            plansLoadFailed.value = true
            toast.error('Could not load pricing. Please refresh the page.')
        }
    } catch (e) {
        console.warn('[PRICING] /api/plans fetch failed', e)
        plansLoadFailed.value = true
        toast.error('Could not load pricing. Please refresh the page.')
    }

    if (window.AOS) {
        window.AOS.init({ duration: 1000, once: true })
    }
})
</script>