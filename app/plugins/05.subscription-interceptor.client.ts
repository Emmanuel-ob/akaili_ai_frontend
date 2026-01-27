/**
 * Global Subscription Error Interceptor
 * 
 * Automatically intercepts 402 errors and shows upgrade prompts
 * No need to check on every page!
 * 
 * Place in: app/plugins/02.subscription-interceptor.client.ts
 */

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()
    const subscriptionStore = useSubscriptionStore()

    // State for upgrade modal
    const showUpgradeModal = ref(false)
    const upgradeContext = ref({
        feature: null,
        requiredPlan: null,
        message: '',
        errorCode: ''
    })

    /**
     * Intercept fetch responses globally
     */
    nuxtApp.hook('app:created', () => {
        const originalFetch = window.$fetch

        // Override $fetch to intercept responses
        window.$fetch = new Proxy(originalFetch, {
            apply: async (target, thisArg, args) => {
                try {
                    const response = await Reflect.apply(target, thisArg, args)
                    return response
                } catch (error: any) {
                    // Handle subscription errors
                    if (error.statusCode === 402 || error.status === 402) {
                        handleSubscriptionError(error)
                        throw error // Re-throw so components can handle if needed
                    }

                    // Handle rate limit
                    if (error.statusCode === 429 || error.status === 429) {
                        handleRateLimitError(error)
                        throw error
                    }

                    throw error
                }
            }
        })
    })

    /**
     * Handle subscription errors (402)
     */
    function handleSubscriptionError(error: any) {
        const data = error.data || error.response?.data || {}
        const errorCode = data.error_code || 'SUBSCRIPTION_ERROR'

        console.log('[Subscription Interceptor] Caught 402 error:', errorCode, data)

        // FEATURE_LOCKED - Feature requires higher plan
        if (errorCode === 'FEATURE_LOCKED') {
            const featureData = data.data || {}

            upgradeContext.value = {
                feature: featureData.feature || 'unknown',
                requiredPlan: featureData.required_plan || 'professional',
                message: data.message || 'This feature requires a higher plan',
                errorCode: 'FEATURE_LOCKED'
            }

            showUpgradeModal.value = true

            // Show toast notification
            useNuxtApp().$toast?.warning(data.message || 'Feature locked')
        }

        // LIMIT_EXCEEDED - Usage limit reached
        else if (errorCode === 'LIMIT_EXCEEDED') {
            const limitData = data.data || {}

            upgradeContext.value = {
                feature: limitData.limit_type || 'unknown',
                requiredPlan: null, // Will show current plan upgrade options
                message: data.message || `You've reached your limit`,
                errorCode: 'LIMIT_EXCEEDED'
            }

            showUpgradeModal.value = true

            // Show toast notification
            useNuxtApp().$toast?.error(data.message || 'Limit exceeded')
        }

        // SUBSCRIPTION_INACTIVE - Subscription not active
        else if (errorCode === 'SUBSCRIPTION_INACTIVE') {
            upgradeContext.value = {
                feature: null,
                requiredPlan: null,
                message: data.message || 'Your subscription is not active',
                errorCode: 'SUBSCRIPTION_INACTIVE'
            }

            showUpgradeModal.value = true

            // Show toast notification
            useNuxtApp().$toast?.error('Subscription inactive')
        }

        // Generic subscription error
        else {
            useNuxtApp().$toast?.warning(data.message || 'Subscription error')
        }
    }

    /**
     * Handle rate limit errors (429)
     */
    function handleRateLimitError(error: any) {
        const data = error.data || error.response?.data || {}

        console.log('[Subscription Interceptor] Rate limit hit:', data)

        useNuxtApp().$toast?.warning(
            data.message || 'Too many requests. Please wait a moment.'
        )
    }

    /**
     * Navigate to upgrade
     */
    function navigateToUpgrade() {
        showUpgradeModal.value = false

        const query: any = {}

        if (upgradeContext.value.feature) {
            query.feature = upgradeContext.value.feature
        }

        if (upgradeContext.value.requiredPlan) {
            query.requiredPlan = upgradeContext.value.requiredPlan
        }

        router.push({ path: '/pricing', query })
    }

    /**
     * Close modal
     */
    function closeUpgradeModal() {
        showUpgradeModal.value = false
        upgradeContext.value = {
            feature: null,
            requiredPlan: null,
            message: '',
            errorCode: ''
        }
    }

    /**
     * Provide globally
     */
    return {
        provide: {
            subscriptionInterceptor: {
                showUpgradeModal: readonly(showUpgradeModal),
                upgradeContext: readonly(upgradeContext),
                navigateToUpgrade,
                closeUpgradeModal,
                handleSubscriptionError,
            }
        }
    }
})