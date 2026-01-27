<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div
            class="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

            <!-- Header -->
            <div class="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Change Subscription Plan</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Step {{ step }} of 2</p>
                </div>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6">

                <!-- STEP 1: Select Plan -->
                <div v-if="step === 1">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="plan in plans" :key="plan.id" @click="selectPlan(plan.id)" :class="[
                            'border-2 rounded-xl p-4 cursor-pointer transition-all relative',
                            selectedPlanId === plan.id
                                ? 'border-[#9E4CFF] bg-purple-50 dark:bg-purple-900/10'
                                : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                        ]">
                            <span v-if="currentPlanId === plan.id"
                                class="absolute top-2 right-2 text-xs bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">Current</span>

                            <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ plan.name }}</h3>
                            <p class="text-2xl font-bold text-[#9E4CFF] mt-2">{{ plan.price }}<span
                                    class="text-sm text-gray-500 dark:text-gray-400 font-normal">/mo</span></p>
                            <ul class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <li v-for="feat in plan.features" :key="feat" class="flex items-start gap-2">
                                    <svg class="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M5 13l4 4L19 7" />
                                    </svg>
                                    {{ feat }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- STEP 2: Confirm (Paid → Paid only) -->
                <div v-if="step === 2" class="max-w-md mx-auto text-center">
                    <div
                        class="bg-purple-50 dark:bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-[#9E4CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Change</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                        Switching from <strong>{{ getPlanName(currentPlanId) }}</strong> to <strong>{{
                            getPlanName(selectedPlanId) }}</strong>
                        <br>New billing: <strong>{{ getPlanPrice(selectedPlanId) }}</strong>/month
                    </p>

                    <div
                        class="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 p-4 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 mb-6 text-left">
                        <strong>Note:</strong> Changes apply immediately. Prorated charges will be applied using your
                        existing payment method.
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div
                class="p-6 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 bg-gray-50 dark:bg-slate-900/50">
                <button v-if="step === 2" @click="step = 1"
                    class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition">Back</button>
                <button v-if="step === 1" @click="$emit('close')"
                    class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition">Cancel</button>

                <button v-if="step === 1" @click="handleContinue" :disabled="!canProceed || loading"
                    class="px-6 py-2 bg-[#9E4CFF] text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    {{ loading ? 'Processing...' : 'Continue' }}
                </button>
                <button v-if="step === 2" @click="confirmChange" :disabled="loading"
                    class="px-6 py-2 bg-[#9E4CFF] text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition flex items-center gap-2">
                    <span v-if="loading"
                        class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    {{ loading ? 'Processing...' : 'Confirm Change' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSubscriptionStore } from '~/stores/subscriptionStore'

const props = defineProps(['currentPlanId'])
const emit = defineEmits(['close', 'updated'])
const router = useRouter()
const subscriptionStore = useSubscriptionStore()

const step = ref(1)
const selectedPlanId = ref(props.currentPlanId)
const loading = ref(false)

const plans = [
    { id: 'starter', name: 'Starter', price: 'Free', features: ['1 Chatbot', '1,000 Messages'] },
    { id: 'professional', name: 'Professional', price: '$99', features: ['5 Chatbots', '10,000 Messages', 'Priority Support'] },
    { id: 'enterprise', name: 'Enterprise', price: '$299', features: ['Unlimited Bots', 'Unlimited Messages', '24/7 Support'] }
]

const canProceed = computed(() => selectedPlanId.value && selectedPlanId.value !== props.currentPlanId)

const selectPlan = (id) => {
    selectedPlanId.value = id
}

const getPlanName = (id) => plans.find(p => p.id === id)?.name
const getPlanPrice = (id) => plans.find(p => p.id === id)?.price

const handleContinue = async () => {
    // Free → Paid: Redirect to checkout immediately
    if (props.currentPlanId === 'starter' && selectedPlanId.value !== 'starter') {
        router.push({
            path: '/checkout',
            query: { plan: selectedPlanId.value, from: 'plan_change' }
        })
        emit('close')
        return
    }

    // Paid → Free or Paid → Paid: Go to confirmation
    step.value = 2
}

const confirmChange = async () => {
    loading.value = true

    try {
        const result = await subscriptionStore.changePlan({
            new_plan_id: selectedPlanId.value,
            prorate: true,
            use_existing_payment: true
        })

        if (result.success) {
            emit('updated', getPlanName(selectedPlanId.value))
        } else {
            alert(result.error || 'Failed to change plan')
        }
    } catch (error) {
        alert(error.data?.message || 'Failed to change plan')
    } finally {
        loading.value = false
    }
}
</script>