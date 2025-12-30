<template>
  <!-- Added extra top padding (pt-32 md:pt-40) to clear navbar -->
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Back Button -->
      <NuxtLink to="/pricing" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#9E4CFF] mb-8 transition-colors group">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back to plans
      </NuxtLink>

      <div class="lg:grid lg:grid-cols-12 lg:gap-x-16 lg:items-start">
        
        <!-- LEFT COLUMN: Payment Form -->
        <section class="lg:col-span-7 xl:col-span-8">
          <div class="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-800">
            <div class="p-6 md:p-10">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
                <div class="flex space-x-2">
                  <div class="w-10 h-6 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700"></div>
                  <div class="w-10 h-6 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700"></div>
                  <div class="w-10 h-6 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700"></div>
                </div>
              </div>
              
              <form @submit.prevent="handlePlaceholderPayment" class="space-y-8">
                <!-- Personal Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input type="text" required class="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#9E4CFF] focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all" placeholder="Jane">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input type="text" required class="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#9E4CFF] focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all" placeholder="Doe">
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input type="email" required class="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#9E4CFF] focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all" placeholder="jane@company.com">
                </div>

                <!-- PAYMENT PROVIDER WIREFRAME -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Card Details</label>
                  
                  <div class="border border-gray-300 dark:border-slate-700 rounded-xl p-6 bg-gray-50 dark:bg-slate-800/50 flex flex-col items-center justify-center min-h-[180px] relative group overflow-hidden transition-colors hover:border-[#9E4CFF]/50">
                    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
                    
                    <div class="z-10 text-center">
                       <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                       </svg>
                       <p class="text-sm text-gray-900 dark:text-white font-medium">Secure Payment Integration</p>
                       <p class="text-xs text-gray-500 mt-1">Stripe / Paystack Element mounts here</p>
                    </div>
                  </div>
                </div>

                <div class="pt-4">
                  <button 
                    type="submit" 
                    :disabled="loading"
                    class="w-full bg-[#9E4CFF] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#8B3DFF] shadow-lg shadow-purple-500/25 transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    <!-- Loading Spinner SVG -->
                    <svg v-if="loading" class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    
                    <span v-if="!loading">Pay {{ selectedPlan.price }}</span>
                    <span v-else>Processing Payment...</span>
                  </button>
                  
                </div>
              </form>
            </div>
          </div>
        </section>

        <!-- RIGHT COLUMN: Order Summary -->
        <section class="lg:col-span-5 xl:col-span-4 mt-12 lg:mt-0">
          <div class="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-slate-800 sticky top-32">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>

            <div class="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
              <div class="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-[#9E4CFF] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

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
  default: {
    name: 'Professional',
    price: '$99.00',
    features: ['5 Chatbots', 'Advanced Analytics', 'Priority Support', 'Database Integrations']
  }
}

const selectedPlan = computed(() => {
  const planKey = route.query.plan
  return plans[planKey] || plans.default
})

const handlePlaceholderPayment = () => {
  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    
    // For demo purposes, let's randomly succeed or fail
    // In production, this depends on the Stripe/Paystack response
    const success = Math.random() > 0.2; // 80% chance of success
    
    if (success) {
      router.push('/payment/success')
    } else {
      router.push('/payment/failed')
    }
  }, 2500)
}
</script>