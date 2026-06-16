<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">

      <!-- Back Button -->
      <button @click="goBack"
        class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#9E4CFF] mb-8 transition-colors group">
        <svg xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20"
          fill="currentColor">
          <path fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd" />
        </svg>
        {{ backButtonText }}
      </button>

      <!-- GUARD: Plan Already Active -->
      <div v-if="isPlanAlreadyActive"
        class="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto">
        <div
          class="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">You are already on this plan</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          Your subscription for <strong>{{ selectedPlan.name }}</strong> is active and in good standing.
        </p>
        <div class="flex justify-center gap-4">
          <NuxtLink to="/dashboard"
            class="px-8 py-3 bg-[#9E4CFF] text-white rounded-xl font-bold hover:bg-purple-700 transition">
            Go to Dashboard
          </NuxtLink>
          <NuxtLink to="/pricing"
            class="px-8 py-3 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-white rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition">
            Change Plan
          </NuxtLink>
        </div>
      </div>

      <!-- CHECKOUT FORM -->
      <div v-else class="lg:grid lg:grid-cols-12 lg:gap-x-16 lg:items-start">

        <!-- Left Column -->
        <section class="lg:col-span-7 xl:col-span-8">
          <div
            class="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-800">
            <div class="p-6 md:p-10">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
              </div>

              <form @submit.prevent="handlePayment" class="space-y-8">
                <!-- Personal Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input v-model="billingForm.firstName" type="text" required
                      class="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#9E4CFF] focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all"
                      placeholder="Jane" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input v-model="billingForm.lastName" type="text" required
                      class="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#9E4CFF] focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all"
                      placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input v-model="billingForm.email" type="email" required :disabled="isLoggedIn"
                    class="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#9E4CFF] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:dark:bg-slate-800 disabled:text-gray-500 disabled:dark:text-gray-400"
                    placeholder="jane@company.com" />
                  <p v-if="isLoggedIn" class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Linked to your active account
                  </p>
                </div>

                <!-- Payment Summary (provider + currency) -->
                <div
                  class="bg-gray-50 dark:bg-slate-800/60 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                    Paying with
                    <span class="font-semibold text-gray-900 dark:text-white capitalize">{{ selectedProvider }}</span>
                    in
                    <span class="font-semibold text-gray-900 dark:text-white">{{ selectedCurrency }}</span>
                  </p>

                  <!-- Currency popover anchor -->
                  <div class="relative shrink-0" ref="currencyPopoverRef">
                    <button type="button" @click.stop="showCurrencyPopover = !showCurrencyPopover"
                      class="text-xs text-[#9E4CFF] hover:text-purple-700 dark:hover:text-purple-400 font-medium underline underline-offset-2 transition-colors whitespace-nowrap">
                      Paying from another country?
                    </button>

                    <!-- Compact currency popover -->
                    <div v-if="showCurrencyPopover"
                      class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden">
                      <div class="px-4 py-2.5 border-b border-gray-100 dark:border-slate-700">
                        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Select currency
                        </p>
                      </div>
                      <div v-if="currencyOverrideLoading" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        Updating...
                      </div>
                      <ul v-else class="py-1 max-h-60 overflow-y-auto">
                        <li v-for="cur in availableCurrencies" :key="cur.code">
                          <button type="button" @click.stop="selectCurrency(cur.code)" :class="[
                            'w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-2',
                            cur.code === selectedCurrency
                              ? 'bg-purple-50 dark:bg-purple-900/20 text-[#9E4CFF] font-semibold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                          ]">
                            <span class="font-medium">{{ cur.code }}</span>
                            <span class="text-xs text-gray-400 dark:text-gray-500 truncate">{{ cur.name }}</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="pt-4">
                  <button type="submit" :disabled="loading || !plansData"
                    class="w-full bg-[#9E4CFF] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#8B3DFF] shadow-lg shadow-purple-500/25 transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3">

                    <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                      </circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>

                    <span v-if="!loading">Continue to Payment</span>
                    <span v-else>Processing...</span>
                  </button>

                  <div class="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                    <span>256-bit SSL Secure Encryption</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <!-- Right Column (Summary) -->
        <section class="lg:col-span-5 xl:col-span-4 mt-12 lg:mt-0">
          <div
            class="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-slate-800 sticky top-32">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>

            <div class="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
              <div
                class="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-[#9E4CFF] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedPlan.name }} Plan</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">Billed monthly</p>
              </div>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span class="font-medium">{{ formattedPrice }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tax (0%)</span>
                <span class="font-medium">—</span>
              </div>
            </div>

            <div class="border-t border-gray-100 dark:border-slate-800 pt-4 mb-6">
              <div class="flex justify-between items-end">
                <span class="text-base font-bold text-gray-900 dark:text-white">Total due</span>
                <span class="text-3xl font-extrabold text-[#9E4CFF] leading-none">{{ formattedPrice }}</span>
              </div>
            </div>

            <div class="bg-purple-50 dark:bg-[#9E4CFF]/10 rounded-xl p-5">
              <h5 class="font-bold text-[#9E4CFF] text-sm mb-3">What's included:</h5>
              <ul class="space-y-2.5">
                <li v-for="feat in selectedPlan.features" :key="feat"
                  class="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                  <svg class="w-4 h-4 text-[#9E4CFF] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="leading-tight">{{ feat }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { useAuthStore } from '~/stores/authStore'
import { useSubscriptionStore } from '~/stores/subscriptionStore'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const toast = useToast()

const loading = ref(false)
const plansLoadFailed = ref(false)
const isLoggedIn = computed(() => authStore.isLoggedIn)
const selectedProvider = ref('stripe')
const selectedCurrency = ref('USD')
const plansData = ref(null)
const showCurrencyPopover = ref(false)
const currencyOverrideLoading = ref(false)
const currencyPopoverRef = ref(null)

const overrideCookie = useCookie('pricing.override.currency', { maxAge: 60 * 60 * 24 * 30 })

const billingForm = reactive({
  firstName: '',
  lastName: '',
  email: ''
})

const STATIC_PLANS = {
  professional: { name: 'Professional', features: ['5 Chatbots', 'Advanced Analytics', 'Priority Support', 'Database Integrations'] },
  enterprise: { name: 'Enterprise', features: ['Unlimited Chatbots', 'Custom Analytics', '24/7 Phone Support', 'Advanced Security'] },
  starter: { name: 'Starter', features: ['1 Chatbot', 'Basic Analytics', 'Email Support'] },
}

// Platform supports only USD + NGN — see config('subscriptions.currencies')
// on the backend. The popover lists exactly what the API returns; the
// fallback array below only matters if /api/plans fails completely.
const CURRENCY_NAMES = {
  USD: 'US Dollar',
  NGN: 'Nigerian Naira',
}

const availableCurrencies = computed(() => {
  const codes = Array.isArray(plansData.value?.available_currencies) && plansData.value.available_currencies.length
    ? plansData.value.available_currencies
    : ['USD', 'NGN']
  return codes.map(code => ({ code, name: CURRENCY_NAMES[code] || code }))
})

const selectedPlan = computed(() => {
  const planId = route.query.plan || 'professional'
  if (plansData.value?.plans) {
    const found = plansData.value.plans.find(p => p.id === planId)
    if (found) {
      return {
        name: found.name,
        features: Array.isArray(found.features) && found.features.length
          ? found.features
          : (STATIC_PLANS[planId]?.features ?? []),
      }
    }
  }
  return STATIC_PLANS[planId] ?? STATIC_PLANS.professional
})

const formattedPrice = computed(() => {
  const planId = route.query.plan || 'professional'
  if (plansData.value?.plans) {
    const found = plansData.value.plans.find(p => p.id === planId)
    if (found?.is_free) return 'Free'
    if (found?.price?.formatted) return found.price.formatted
  }
  // Spec §5.5 / D4: never render a hardcoded price literal. While /api/plans is
  // loading, show a loading dash; if the fetch failed we surface the failure via
  // a toast (see onMounted / selectCurrency) and leave the price blank so the
  // user can't accept a stale number.
  return plansLoadFailed.value ? '—' : '…'
})

const isPlanAlreadyActive = computed(() => {
  const requestedPlanId = route.query.plan || 'professional'
  return isLoggedIn.value && subscriptionStore.currentPlan?.plan_id === requestedPlanId
})

const backButtonText = computed(() => {
  return route.query.from === 'settings' ? 'Back to Settings' : 'Back to Plans'
})

const goBack = () => {
  if (route.query.from === 'settings') {
    router.push('/dashboard/settings')
  } else {
    router.push('/pricing')
  }
}

const selectCurrency = async (code) => {
  showCurrencyPopover.value = false
  if (code === selectedCurrency.value) return

  currencyOverrideLoading.value = true
  try {
    const ctx = await $fetch(`${config.public.apiBase}/api/pricing/context`, {
      query: { currency: code }
    })
    if (ctx?.success && ctx?.data) {
      selectedCurrency.value = ctx.data.currency
      selectedProvider.value = ctx.data.provider
    } else {
      selectedCurrency.value = code
    }
    overrideCookie.value = selectedCurrency.value

    // Refetch plan list so price display reflects the chosen currency
    const plans = await $fetch(`${config.public.apiBase}/api/plans`, {
      query: { currency: selectedCurrency.value }
    })
    if (plans?.success && plans?.data) {
      plansData.value = plans.data
      plansLoadFailed.value = false
    } else {
      plansLoadFailed.value = true
      toast.error('Could not load prices for this currency. Please try again.')
    }
  } catch (e) {
    console.warn('[CHECKOUT] currency override fetch failed', e)
    selectedCurrency.value = code
    overrideCookie.value = code
    plansLoadFailed.value = true
    toast.error('Could not load prices for this currency. Please try again.')
  } finally {
    currencyOverrideLoading.value = false
  }
}

const handleClickOutside = (event) => {
  if (currencyPopoverRef.value && !currencyPopoverRef.value.contains(event.target)) {
    showCurrencyPopover.value = false
  }
}

const handlePayment = async () => {
  loading.value = true
  try {
    const planId = route.query.plan || 'professional'
    const response = await $fetch(`${config.public.apiBase}/api/payment/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        plan_id: planId,
        currency: selectedCurrency.value,
        provider: selectedProvider.value
      }
    })
    if (response.success) {
      window.location.href = response.data.checkout_url
    }
  } catch (error) {
    console.error('Payment initialization failed:', error)
    alert(error.data?.message || 'Failed to initialize payment. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  await subscriptionStore.fetchSubscription()

  if (authStore.user) {
    billingForm.email = authStore.user.email
    const names = (authStore.user.name || '').trim().split(' ')
    billingForm.firstName = names[0] || ''
    billingForm.lastName = names.slice(1).join(' ') || ''
  }

  // Priority: explicit query param > persisted cookie > API geo-detect
  const startCurrency = route.query.currency || overrideCookie.value || null

  try {
    const response = await $fetch(`${config.public.apiBase}/api/plans`, {
      query: startCurrency ? { currency: startCurrency } : {}
    })
    if (response?.success && response?.data) {
      plansData.value = response.data
      plansLoadFailed.value = false
      const rec = response.data.recommended
      if (rec) {
        selectedCurrency.value = rec.currency
        selectedProvider.value = rec.provider
      }
    } else {
      plansLoadFailed.value = true
      toast.error('Could not load plan prices. Please refresh the page.')
    }
  } catch (e) {
    console.warn('[CHECKOUT] /api/plans fetch failed', e)
    plansLoadFailed.value = true
    if (startCurrency) selectedCurrency.value = startCurrency
    toast.error('Could not load plan prices. Please refresh the page.')
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
