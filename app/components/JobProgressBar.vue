<template>
    <div class="space-y-2">
        <!-- Progress Info -->
        <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">{{ displayStep }}</span>
            <span class="font-medium text-gray-900">{{ percentage }}%</span>
        </div>

        <!-- Progress Bar -->
        <div class="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                :style="{ width: percentage + '%' }">
                <!-- Animated shimmer effect -->
                <div v-if="percentage < 100"
                    class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
            </div>
        </div>

        <!-- Step Details (if provided) -->
        <div v-if="progress.current && progress.total" class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ progress.current }} of {{ progress.total }} items</span>
            <span v-if="estimatedTime">Est: {{ estimatedTime }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    progress: {
        type: Object,
        default: () => ({})
    }
})

const percentage = computed(() => {
    return Math.min(Math.max(props.progress.percentage || 0, 0), 100)
})

const displayStep = computed(() => {
    const step = props.progress.step || 'processing'
    return step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
})

const estimatedTime = computed(() => {
    // Simple estimation based on current progress
    if (!props.progress.current || !props.progress.total) return null

    const remaining = props.progress.total - props.progress.current
    if (remaining <= 0) return null

    // Estimate ~2 seconds per item (adjust based on actual performance)
    const seconds = remaining * 2

    if (seconds < 60) return `${seconds}s`
    const minutes = Math.ceil(seconds / 60)
    return `${minutes}m`
})
</script>

<style scoped>
@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}

.animate-shimmer {
    animation: shimmer 2s infinite;
}
</style>