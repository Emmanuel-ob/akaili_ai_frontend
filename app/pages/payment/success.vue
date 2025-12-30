<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      
      <!-- Success Icon Animation -->
      <div class="mb-8 relative flex items-center justify-center">
        <div class="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full animate-ping opacity-75"></div>
        <div class="relative w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>

      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Payment Successful!</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-8 text-lg">
        Thank you for your purchase. Your account has been upgraded and you are ready to go.
      </p>

      <div class="space-y-4">
        <NuxtLink to="/dashboard" class="block w-full bg-[#9E4CFF] text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:bg-[#8B3DFF] transition-all transform hover:-translate-y-1">
          Go to Dashboard
        </NuxtLink>
        
        <NuxtLink to="/" class="block w-full text-gray-500 hover:text-gray-800 dark:hover:text-white font-medium transition-colors">
          Return Home
        </NuxtLink>
      </div>

    </div>
  </div>
</template>