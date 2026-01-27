<template>
    <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ label }}
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ displayUsage }}
            </span>
        </div>

        <!-- Progress Bar -->
        <div
            class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
                :class="[
                'h-2.5 rounded-full transition-all duration-300',
                progressBarClass
            ]"
                :style="{ width: `${percentage}%` }" />
        </div>

        <!-- Warning Message -->
        <div v-if="showWarning" class="mt-2 flex items-start gap-2">
            <svg class="w-4 h-4 mt-0.5 flex-shrink-0" :class="warningIconClass" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
            </svg>
            <span class="text-xs" :class="warningTextClass">
                {{ warningMessage }}
            </span>
        </div>

        <!-- Upgrade Button -->
        <button v-if="showUpgrade && percentage >= 100" class="mt-3 w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors" @click="$emit('upgrade')">
            Upgrade Plan
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    used: {
        type: Number,
        required: true
    },
    limit: {
        type: Number,
        required: true
    },
    showUpgrade: {
        type: Boolean,
        default: true
    }
})

defineEmits(['upgrade'])

// Check if unlimited
const isUnlimited = computed(() => {
    return props.limit === -1 || props.limit >= 999999
})

// Calculate percentage
const percentage = computed(() => {
    if (isUnlimited.value) return 0
    if (props.limit === 0) return 100
    return Math.min(100, Math.round((props.used / props.limit) * 100))
})

// Display text
const displayUsage = computed(() => {
    if (isUnlimited.value) {
        return `${props.used} / Unlimited`
    }
    return `${props.used} / ${props.limit}`
})

// Progress bar color based on percentage
const progressBarClass = computed(() => {
    if (percentage.value >= 100) return 'bg-red-500'
    if (percentage.value >= 90) return 'bg-orange-500'
    if (percentage.value >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
})

// Warning display
const showWarning = computed(() => {
    return percentage.value >= 80 && !isUnlimited.value
})

const warningIconClass = computed(() => {
    if (percentage.value >= 100) return 'text-red-500'
    if (percentage.value >= 90) return 'text-orange-500'
    return 'text-yellow-500'
})

const warningTextClass = computed(() => {
    if (percentage.value >= 100) return 'text-red-600 dark:text-red-400'
    if (percentage.value >= 90) return 'text-orange-600 dark:text-orange-400'
    return 'text-yellow-600 dark:text-yellow-400'
})

const warningMessage = computed(() => {
    if (percentage.value >= 100) {
        return `You've reached your ${props.label.toLowerCase()} limit. Upgrade to continue.`
    }
    if (percentage.value >= 90) {
        return `You're running low on ${props.label.toLowerCase()}. Consider upgrading.`
    }
    return `You've used ${percentage.value}% of your ${props.label.toLowerCase()}.`
})
</script>

