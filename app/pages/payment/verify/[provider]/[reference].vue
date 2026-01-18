<template>
    <div class="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div class="max-w-md w-full">

            <!-- Loading State -->
            <div v-if="verifying" class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[#9E4CFF] mx-auto mb-4"></div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Verifying Payment</h2>
                <p class="text-gray-600 dark:text-gray-400">Please wait while we confirm your payment...</p>
            </div>

            <!-- Success State -->
            <div v-else-if="verificationStatus === 'success'"
                class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
                <div
                    class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Your subscription has been activated.
                </p>
                <button @click="goToDashboard"
                    class="w-full px-6 py-3 bg-[#9E4CFF] text-white rounded-lg font-medium hover:bg-purple-700 transition">
                    Go to Dashboard
                </button>
            </div>

            <!-- Error State -->
            <div v-else-if="verificationStatus === 'error'"
                class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
                <div
                    class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Verification Failed</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6 text-center">{{ errorMessage }}</p>

                <div class="space-y-3">
                    <button @click="retryVerification" :disabled="retrying"
                        class="w-full px-6 py-3 bg-[#9E4CFF] text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50">
                        {{ retrying ? 'Retrying...' : 'Retry Verification' }}
                    </button>

                    <button @click="goToBilling"
                        class="w-full px-6 py-3 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                        View Billing History
                    </button>

                    <button @click="contactSupport"
                        class="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                        Contact Support
                    </button>
                </div>

                <!-- Helpful Info -->
                <div
                    class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p class="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Note:</strong> If payment was deducted from your account, please try manual verification
                        from your billing history or contact support.
                    </p>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'

definePageMeta({
    layout: false // No layout for this page
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const provider = route.params.provider
const reference = route.params.reference

const verifying = ref(true)
const retrying = ref(false)
const verificationStatus = ref(null) // 'success' | 'error'
const errorMessage = ref('')

const verifyPayment = async () => {
    verifying.value = true
    verificationStatus.value = null

    try {
        const response = await $fetch(`${config.public.apiBase}/api/payment/verify/${provider}/${reference}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })

        if (response.success) {
            verificationStatus.value = 'success'

            // Wait 2 seconds before redirect
            setTimeout(() => {
                router.push('/dashboard/settings?tab=subscription')
            }, 2000)
        } else {
            verificationStatus.value = 'error'
            errorMessage.value = response.message || 'Payment verification failed'
        }
    } catch (error) {
        console.error('Verification error:', error)
        verificationStatus.value = 'error'
        errorMessage.value = error.data?.message || 'An error occurred during verification. Your payment may still be processing.'
    } finally {
        verifying.value = false
    }
}

const retryVerification = async () => {
    retrying.value = true
    await verifyPayment()
    retrying.value = false
}

const goToDashboard = () => {
    router.push('/dashboard/settings?tab=subscription')
}

const goToBilling = () => {
    router.push('/dashboard/settings?tab=billing')
}

const contactSupport = () => {
    window.location.href = 'mailto:oseahumenagboifoh@gmail.com?subject=Payment Verification Issue&body=Reference: ' + reference
}

onMounted(() => {
    if (!authStore.token) {
        router.push('/login')
        return
    }

    verifyPayment()
})
</script>