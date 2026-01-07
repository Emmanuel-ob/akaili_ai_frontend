<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Back Button -->
      <button @click="goBack" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#9E4CFF] mb-8 transition-colors group">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        {{ backButtonText }}
      </button>

      <!-- GUARD: Plan Already Active -->
      <div v-if="isPlanAlreadyActive" class="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto">
          <div class="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">You are already on this plan</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8">
              Your subscription for <strong>{{ selectedPlan.name }}</strong> is active and in good standing.
          </p>
          <div class="flex justify-center gap-4">
              <NuxtLink to="/dashboard" class="px-8 py-3 bg-[#9E4CFF] text-white rounded-xl font-bold hover:bg-purple-700 transition">
                  Go to Dashboard
              </NuxtLink>
              <NuxtLink to="/pricing" class="px-8 py-3 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-white rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                  Change Plan
              </NuxtLink>
          </div>
      </div>

      <!-- CHECKOUT FORM -->
      <div v-else class="lg:grid lg:grid-cols-12 lg:gap-x-16 lg:items-start">
        
        <!-- Left Column -->
        <section class="lg:col-span-7 xl:col-span-8">
          <div class="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-800">
            <div class="p-6 md:p-10">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
                <div class="flex space-x-2 opacity-50 grayscale">
                    <!-- Generic Card Icons -->
                    <div class="h-6 w-10 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    <div class="h-6 w-10 bg-gray-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
              
              <form @submit.prevent="handlePayment" class="space-y-8">
                <!-- Personal Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input v-model="billingForm.firstName" type="text" required 
                      @input="saveFormData"
                      class="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#9E4CFF] focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all" 
                      placeholder="Jane" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input v-model="billingForm.lastName" type="text" required 
                      @input="saveFormData"
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
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Linked to your active account
                  </p>
                </div>

                <!-- Payment Provider Placeholder -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Card Details</label>
                  <div class="border border-gray-300 dark:border-slate-700 rounded-xl p-6 bg-gray-50 dark:bg-slate-800/50 flex flex-col items-center justify-center min-h-[150px] relative transition-colors hover:border-[#9E4CFF]/50">
                     <div class="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                        <span class="text-sm font-medium">Stripe / Paystack Element</span>
                     </div>
                  </div>
                </div>

                <div class="pt-4">
                  <button type="submit" :disabled="loading"
                    class="w-full bg-[#9E4CFF] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#8B3DFF] shadow-lg shadow-purple-500/25 transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3">
                    
                    <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    
                    <span v-if="!loading">Pay {{ selectedPlan.price }}</span>
                    <span v-else>Processing Securely...</span>
                  </button>
                  
                  <div class="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    <span>256-bit SSL Secure Encryption</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <!-- Right Column (Summary) -->
        <section class="lg:col-span-5 xl:col-span-4 mt-12 lg:mt-0">
          <div class="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-slate-800 sticky top-32">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
            
            <div class="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
              <div class="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-[#9E4CFF] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedPlan.name }} Plan</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">Billed monthly</p>
              </div>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span class="font-medium">{{ selectedPlan.price }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tax (0%)</span>
                <span class="font-medium">$0.00</span>
              </div>
            </div>

            <div class="border-t border-gray-100 dark:border-slate-800 pt-4 mb-6">
              <div class="flex justify-between items-end">
                <span class="text-base font-bold text-gray-900 dark:text-white">Total due</span>
                <span class="text-3xl font-extrabold text-[#9E4CFF] leading-none">{{ selectedPlan.price }}</span>
              </div>
            </div>

            <div class="bg-purple-50 dark:bg-[#9E4CFF]/10 rounded-xl p-5">
              <h5 class="font-bold text-[#9E4CFF] text-sm mb-3">What's included:</h5>
              <ul class="space-y-2.5">
                <li v-for="feat in selectedPlan.features" :key="feat" class="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                  <svg class="w-4 h-4 text-[#9E4CFF] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
import { computed, ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'
import { useSubscriptionStore } from '~/stores/subscriptionStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()

const loading = ref(false)
const isLoggedIn = computed(() => authStore.isLoggedIn)

const billingForm = reactive({
  firstName: '',
  lastName: '',
  email: ''
})

const plans = {
  professional: {
    name: 'Professional',
    price: '$99.00',
    features: ['5 Chatbots', 'Advanced Analytics', 'Priority Support', 'Database Integrations']
  },
  enterprise: {
    name: 'Enterprise',
    price: '$299.00',
    features: ['Unlimited Chatbots', 'Custom Analytics', '24/7 Phone Support', 'Advanced Security']
  },
  starter: {
    name: 'Starter',
    price: '$0.00',
    features: ['1 Chatbot', 'Basic Analytics', 'Email Support']
  },
  default: {
    name: 'Professional',
    price: '$99.00',
    features: ['5 Chatbots', 'Advanced Analytics', 'Priority Support']
  }
}

const selectedPlan = computed(() => plans[route.query.plan] || plans.default)

// GUARD: Check if already on this plan
const isPlanAlreadyActive = computed(() => {
    const requestedPlanId = route.query.plan || 'professional'
    return isLoggedIn.value && subscriptionStore.currentPlan?.id === requestedPlanId
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

// Persist form data to session storage
const saveFormData = () => {
    if (import.meta.client) {
        sessionStorage.setItem('checkout_form', JSON.stringify(billingForm))
    }
}

const handlePayment = async () => {
  loading.value = true
  const planId = route.query.plan || 'professional'

  setTimeout(async () => {
    await subscriptionStore.upgradeSubscription(planId)
    loading.value = false
    sessionStorage.removeItem('checkout_form')
    router.push('/payment/success')
  }, 2000)
}

onMounted(() => {
  // Ensure store is loaded to check active plan
  subscriptionStore.fetchSubscription()

  // 1. If logged in, prioritize user data
  if (authStore.user) {
    billingForm.email = authStore.user.email
    const names = (authStore.user.name || '').trim().split(' ')
    if (names.length > 0) {
      billingForm.firstName = names[0]
      billingForm.lastName = names.slice(1).join(' ') || ''
    }
  } 
  // 2. If not logged in, try to restore from session storage
  else if (import.meta.client) {
      const stored = sessionStorage.getItem('checkout_form')
      if (stored) {
          const parsed = JSON.parse(stored)
          billingForm.firstName = parsed.firstName
          billingForm.lastName = parsed.lastName
          billingForm.email = parsed.email
      }
  }
})
</script>