<template>
    <!-- This modal is automatically shown when subscription errors occur -->
    <BaseModal :show="show" @close="handleClose">
        <div class="p-6 sm:p-8">
            <!-- Icon -->
            <div class="flex justify-center mb-6">
                <div class="w-16 h-16 rounded-full flex items-center justify-center" :class="iconBgClass">
                    <svg class="w-8 h-8" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="context.errorCode === 'LIMIT_EXCEEDED'" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
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
                {{ context.message }}
            </p>

            <!-- Feature Info (if available) -->
            <div v-if="context.feature" class="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong class="text-gray-900 dark:text-white">Feature:</strong>
                    {{ formatFeatureName(context.feature) }}
                </p>
                <p v-if="context.requiredPlan" class="text-sm text-gray-600 dark:text-gray-400">
                    <strong class="text-gray-900 dark:text-white">Required Plan:</strong>
                    {{ formatPlanName(context.requiredPlan) }}
                </p>
            </div>

            <!-- Current vs Required Plan -->
            <div v-if="currentPlan && context.requiredPlan" class="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
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
                        <span class="text-gray-600 dark:text-gray-400">Upgrade to:</span>
                        <span class="ml-2 font-semibold text-purple-600 dark:text-purple-400">
                            {{ formatPlanName(context.requiredPlan) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Usage Info (for limit exceeded) -->
            <div v-if="context.errorCode === 'LIMIT_EXCEEDED' && usageInfo" class="mb-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ formatFeatureName(context.feature) }} Usage
                    </span>
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                        {{ usageInfo.used }} / {{ usageInfo.limit }}
                    </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div class="h-2.5 rounded-full bg-red-500" :style="{ width: '100%' }"></div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
                <button @click="handleClose"
                    class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    Maybe Later
                </button>
                <button @click="handleUpgrade"
                    class="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-lg shadow-purple-500/20">
                    {{ upgradeButtonText }}
                </button>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '~/components/BaseModal.vue'
import { useSubscriptionStore } from '~/stores/subscriptionStore'

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    context: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close', 'upgrade'])

const subscriptionStore = useSubscriptionStore()

// Computed
const currentPlan = computed(() => subscriptionStore.currentPlan?.plan_id)

const title = computed(() => {
    if (props.context.errorCode === 'FEATURE_LOCKED') {
        return 'Feature Locked'
    } else if (props.context.errorCode === 'LIMIT_EXCEEDED') {
        return 'Limit Reached'
    } else if (props.context.errorCode === 'SUBSCRIPTION_INACTIVE') {
        return 'Subscription Inactive'
    }
    return 'Upgrade Required'
})

const iconBgClass = computed(() => {
    if (props.context.errorCode === 'LIMIT_EXCEEDED') {
        return 'bg-orange-100 dark:bg-orange-900/30'
    }
    return 'bg-purple-100 dark:bg-purple-900/30'
})

const iconClass = computed(() => {
    if (props.context.errorCode === 'LIMIT_EXCEEDED') {
        return 'text-orange-600 dark:text-orange-400'
    }
    return 'text-purple-600 dark:text-purple-400'
})

const upgradeButtonText = computed(() => {
    if (props.context.errorCode === 'SUBSCRIPTION_INACTIVE') {
        return 'Reactivate Subscription'
    }
    return 'View Plans'
})

const usageInfo = computed(() => {
    const usage = subscriptionStore.getUsage(props.context.feature)
    return usage
})

// Methods
const formatFeatureName = (feature) => {
    return feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatPlanName = (planId) => {
    return planId.charAt(0).toUpperCase() + planId.slice(1)
}

const handleClose = () => {
    emit('close')
}

const handleUpgrade = () => {
    emit('upgrade')
}
</script>