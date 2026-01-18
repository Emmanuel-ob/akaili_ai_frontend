<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h4 class="text-base font-semibold text-gray-900 dark:text-white">Pending Payments</h4>
            <button @click="refreshTransactions" :disabled="loading"
                class="text-sm text-purple-600 dark:text-purple-400 hover:underline disabled:opacity-50">
                {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading && transactions.length === 0" class="animate-pulse">
            <div class="h-24 bg-gray-100 dark:bg-slate-800 rounded-lg"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && transactions.length === 0"
            class="text-center py-8 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
            <p class="text-sm text-gray-500 dark:text-gray-400">No pending transactions</p>
        </div>

        <!-- Transactions List -->
        <div v-else class="space-y-3">
            <div v-for="transaction in transactions" :key="transaction.id"
                class="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">

                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h5 class="font-semibold text-gray-900 dark:text-white">{{ transaction.plan_id.toUpperCase()
                                }} Plan</h5>
                            <span
                                class="px-2 py-0.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full">
                                Pending
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ transaction.currency }} {{ transaction.amount }} • {{ formatDate(transaction.created_at)
                            }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Provider: <span class="capitalize">{{ transaction.provider }}</span>
                        </p>
                    </div>
                </div>

                <div
                    class="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                    <p class="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                        <span>Payment initiated but not completed. If you already paid, click "Verify Payment" to
                            complete activation.</span>
                    </p>
                </div>

                <div class="flex gap-2">
                    <button @click="verifyTransaction(transaction.id)" :disabled="verifyingId === transaction.id"
                        class="flex-1 px-4 py-2 bg-[#9E4CFF] text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50">
                        {{ verifyingId === transaction.id ? 'Verifying...' : 'Verify Payment' }}
                    </button>

                    <button v-if="transaction.checkout_url" @click="resumePayment(transaction.checkout_url)"
                        class="px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                        Resume Payment
                    </button>
                </div>
            </div>
        </div>

        <!-- Success Toast -->
        <div v-if="successMessage"
            class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-fade-in">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
            </svg>
            <span>{{ successMessage }}</span>
        </div>

        <!-- Error Toast -->
        <div v-if="errorMessage"
            class="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-fade-in">
            <span>{{ errorMessage }}</span>
            <button @click="errorMessage = ''" class="hover:text-red-100">×</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useSubscriptionStore } from '~/stores/subscriptionStore'

const config = useRuntimeConfig()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()

const transactions = ref([])
const loading = ref(false)
const verifyingId = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

const fetchPendingTransactions = async () => {
    loading.value = true
    try {
        const response = await $fetch(`${config.public.apiBase}/api/payment/pending-transactions`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })

        if (response.success) {
            transactions.value = response.data.transactions
        }
    } catch (error) {
        console.error('Failed to fetch pending transactions:', error)
    } finally {
        loading.value = false
    }
}

const refreshTransactions = () => {
    fetchPendingTransactions()
}

const verifyTransaction = async (transactionId) => {
    verifyingId.value = transactionId
    errorMessage.value = ''
    successMessage.value = ''

    try {
        const response = await $fetch(`${config.public.apiBase}/api/payment/verify-manual`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: { transaction_id: transactionId }
        })

        if (response.success) {
            successMessage.value = 'Payment verified successfully! Refreshing subscription...'

            // Remove from pending list
            transactions.value = transactions.value.filter(t => t.id !== transactionId)

            // Refresh subscription data
            await subscriptionStore.fetchSubscription()

            setTimeout(() => {
                successMessage.value = ''
            }, 5000)
        } else {
            errorMessage.value = response.message || 'Verification failed'
            setTimeout(() => {
                errorMessage.value = ''
            }, 5000)
        }
    } catch (error) {
        console.error('Verification error:', error)
        errorMessage.value = error.data?.message || 'Verification failed. Please try again or contact support.'
        setTimeout(() => {
            errorMessage.value = ''
        }, 5000)
    } finally {
        verifyingId.value = null
    }
}

const resumePayment = (checkoutUrl) => {
    window.location.href = checkoutUrl
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(() => {
    fetchPendingTransactions()
})
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}
</style>