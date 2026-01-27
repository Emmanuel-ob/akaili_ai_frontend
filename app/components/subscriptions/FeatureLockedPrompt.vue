<template>
    <BaseModal :show="show" @close="$emit('close')">
        <div class="p-6 sm:p-8">
            <!-- Icon -->
            <div class="flex justify-center mb-6">
                <div
                    class="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </div>

            <!-- Title -->
            <h3 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                {{ title }}
            </h3>

            <!-- Description -->
            <p class="text-center text-gray-600 dark:text-gray-400 mb-6">
                {{ description }}
            </p>

            <!-- Feature List (if provided) -->
            <div v-if="features && features.length > 0" class="mb-6">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Upgrade to unlock:
                </p>
                <ul class="space-y-2">
                    <li v-for="(feature, index) in features" :key="index" class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd" />
                        </svg>
                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ feature }}</span>
                    </li>
                </ul>
            </div>

            <!-- Current vs Required Plan -->
            <div v-if="currentPlan && requiredPlan" class="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div class="flex items-center justify-between text-sm">
                    <div>
                        <span class="text-gray-600 dark:text-gray-400">Current Plan:</span>
                        <span class="ml-2 font-semibold text-gray-900 dark:text-white">
                            {{ formatPlanName(currentPlan) }}
                        </span>
                    </div>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div>
                        <span class="text-gray-600 dark:text-gray-400">Required:</span>
                        <span class="ml-2 font-semibold text-purple-600 dark:text-purple-400">
                            {{ formatPlanName(requiredPlan) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
                <button @click="$emit('close')"
                    class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    Maybe Later
                </button>
                <button @click="handleUpgrade"
                    class="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-lg shadow-purple-500/20">
                    View Plans
                </button>
            </div>

            <!-- Alternative: Contact Sales (for Enterprise) -->
            <div v-if="showContactSales" class="mt-4 text-center">
                <button @click="$emit('contact-sales')"
                    class="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                    or contact sales for custom enterprise pricing
                </button>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '~/components/BaseModal.vue'

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        default: 'Upgrade Required'
    },
    description: {
        type: String,
        default: 'This feature is not available on your current plan.'
    },
    featureName: {
        type: String,
        default: null
    },
    currentPlan: {
        type: String,
        default: null
    },
    requiredPlan: {
        type: String,
        default: null
    },
    features: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['close', 'upgrade', 'contact-sales'])

const showContactSales = computed(() => {
    return props.requiredPlan === 'enterprise'
})

const formatPlanName = (planId) => {
    return planId.charAt(0).toUpperCase() + planId.slice(1)
}

const handleUpgrade = () => {
    emit('upgrade', {
        feature: props.featureName,
        requiredPlan: props.requiredPlan
    })
}
</script>s