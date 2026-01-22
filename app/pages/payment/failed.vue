<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      
      <!-- Failed Icon -->
      <div class="mb-8 relative flex items-center justify-center">
        <div class="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      </div>

      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Payment Failed</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-8 text-lg">
        We couldn't process your payment. Please check your card details or try a different payment method.
      </p>

      <div class="space-y-4">
        <button @click="goBack" class="block w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-1">
          Try Again
        </button>
        
        <NuxtLink to="/pricing" class="block w-full text-[#9E4CFF] font-medium hover:underline">
          Choose a different plan
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const goBack = () => {
  router.go(-1) // Go back to checkout page
}
</script>