export default defineNuxtPlugin(() => {
    return {
        provide: {
            subscriptionInterceptor: {
                showUpgradeModal: readonly(ref(false)),
                upgradeContext: readonly(ref({
                    feature: null,
                    requiredPlan: null,
                    message: '',
                    errorCode: ''
                })),
                navigateToUpgrade: () => { },
                closeUpgradeModal: () => { },
                handleSubscriptionError: () => { },
            }
        }
    }
})