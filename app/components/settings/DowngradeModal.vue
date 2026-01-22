<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
        <div class="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 dark:border-slate-800 transform transition-all scale-100">
            
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Switch to Starter Plan?</h3>
                <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">
                    You are about to downgrade to the Free plan. You will lose access to premium features like advanced analytics and multiple chatbots immediately.
                </p>
            </div>

            <div class="flex gap-3">
                <button @click="$emit('close')" class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition font-medium">
                    Cancel
                </button>
                <button @click="$emit('confirm')" class="flex-1 px-4 py-2.5 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/20 transition font-medium">
                    Confirm Downgrade
                </button>
            </div>
        </div>
    </div>
</template>