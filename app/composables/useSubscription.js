// composables/useSubscription.js
import { computed } from 'vue'
import { useSubscriptionStore } from '~/stores/subscriptionStore'
import { useRouter } from 'vue-router'

/**
 * Composable for subscription-based feature gating
 * 
 * This handles feature access based on subscription plans
 * Use alongside usePermissions for role-based access
 */
export const useSubscription = () => {
    const subscriptionStore = useSubscriptionStore()
    const router = useRouter()

    /**
     * Feature to plan mapping (must match backend FeatureGate.php)
     */
    const featurePlans = {
        // Database features
        'database_integration': ['professional', 'enterprise'],
        'multiple_databases': ['professional', 'enterprise'],

        // Email marketing
        'email_marketing': ['professional', 'enterprise'],
        'email_campaigns': ['professional', 'enterprise'],

        // Team features
        'team_members': ['professional', 'enterprise'],
        'multiple_team_members': ['professional', 'enterprise'],

        // Advanced features - Enterprise only
        'advanced_analytics': ['enterprise'],
        'priority_support': ['enterprise'],
        'custom_integrations': ['enterprise'],
        'white_label': ['enterprise'],

        // Basic features - All plans
        'basic_chatbot': ['starter', 'professional', 'enterprise'],
        'basic_analytics': ['starter', 'professional', 'enterprise'],
        'knowledge_base': ['starter', 'professional', 'enterprise'],
    }

    /**
     * Check if current plan has access to a feature
     */
    const hasFeature = (feature) => {
        const currentPlan = subscriptionStore.currentPlan?.plan_id || 'starter'
        const requiredPlans = featurePlans[feature] || []

        return requiredPlans.includes(currentPlan)
    }

    /**
     * Check if usage limit is exceeded for a type
     */
    const isLimitExceeded = (limitType) => {
        return subscriptionStore.isLimitExceeded(limitType)
    }

    /**
     * Check if usage is near limit (80%+)
     */
    const isNearLimit = (limitType) => {
        const percentage = subscriptionStore.getUsagePercentage(limitType)
        return percentage >= 80
    }

    /**
     * Get usage data for a limit type
     */
    const getUsage = (limitType) => {
        if (!subscriptionStore.usage || !subscriptionStore.usage[limitType]) {
            return null
        }
        return subscriptionStore.usage[limitType]
    }

    /**
     * Get required plan for a feature
     */
    const getRequiredPlan = (feature) => {
        const requiredPlans = featurePlans[feature] || []
        const planOrder = ['starter', 'professional', 'enterprise']

        for (const plan of planOrder) {
            if (requiredPlans.includes(plan)) {
                return plan
            }
        }

        return 'professional'
    }

    /**
     * Navigate to upgrade page
     */
    const navigateToUpgrade = (feature = null, reason = null) => {
        const query = {}

        if (feature) {
            query.feature = feature
            query.requiredPlan = getRequiredPlan(feature)
        }

        if (reason) {
            query.reason = reason
        }

        router.push({ path: '/pricing', query })
    }

    /**
     * Check if action can be performed (combines feature + usage)
     */
    const canPerformAction = (feature, limitType = null) => {
        // Check feature access
        if (!hasFeature(feature)) {
            return {
                allowed: false,
                reason: 'feature_locked',
                message: `This feature requires the ${getRequiredPlan(feature)} plan`,
                requiredPlan: getRequiredPlan(feature)
            }
        }

        // Check usage limit if provided
        if (limitType && isLimitExceeded(limitType)) {
            return {
                allowed: false,
                reason: 'limit_exceeded',
                message: `You've reached your ${limitType} limit`,
                usage: getUsage(limitType)
            }
        }

        return {
            allowed: true,
            reason: null,
            message: null
        }
    }

    /**
     * Get plan limits
     */
    const getPlanLimits = computed(() => {
        return subscriptionStore.currentPlan?.limits || {}
    })

    /**
     * Check if on specific plan
     */
    const isOnPlan = (planId) => {
        return subscriptionStore.currentPlan?.plan_id === planId
    }

    return {
        // State
        currentPlan: computed(() => subscriptionStore.currentPlan),
        usage: computed(() => subscriptionStore.usage),
        loading: computed(() => subscriptionStore.loading),

        // Plan checks
        isOnFreePlan: computed(() => subscriptionStore.isOnFreePlan),
        isOnPlan,
        isActive: computed(() => subscriptionStore.isActive),
        onTrial: computed(() => subscriptionStore.onTrial),
        isCanceled: computed(() => subscriptionStore.isCanceled),

        // Feature checks
        hasFeature,
        canPerformAction,
        getRequiredPlan,

        // Usage checks
        isLimitExceeded,
        isNearLimit,
        getUsage,
        getUsagePercentage: subscriptionStore.getUsagePercentage,
        getRemainingQuota: subscriptionStore.getRemainingQuota,

        // Actions
        navigateToUpgrade,
        fetchSubscription: subscriptionStore.fetchSubscription,
        fetchUsage: subscriptionStore.fetchUsage,

        // Data
        planLimits: getPlanLimits
    }
}

/**
 * Example Usage in Components:
 * 
 * <script setup>
 * import { useSubscription } from '~/composables/useSubscription'
 * 
 * const subscription = useSubscription()
 * 
 * // Check feature access
 * const canUseDatabase = computed(() => {
 *   return subscription.hasFeature('database_integration')
 * })
 * 
 * // Check before action
 * const handleAddDatabase = async () => {
 *   const check = subscription.canPerformAction('database_integration', 'databases')
 *   
 *   if (!check.allowed) {
 *     // Show upgrade prompt
 *     if (check.reason === 'feature_locked') {
 *       subscription.navigateToUpgrade('database_integration')
 *     } else {
 *       alert(check.message)
 *     }
 *     return
 *   }
 *   
 *   // Proceed with action
 *   await addDatabase()
 * }
 * 
 * // Show usage meter
 * const conversationsUsage = computed(() => {
 *   return subscription.getUsage('conversations')
 * })
 * </script>
 * 
 * <template>
 *   <div>
 *     <!-- Feature-gated button -->
 *     <button
 *       v-if="canUseDatabase"
 *       @click="handleAddDatabase"
 *     >
 *       Add Database
 *     </button>
 *     
 *     <button
 *       v-else
 *       @click="subscription.navigateToUpgrade('database_integration')"
 *       class="upgrade-button"
 *     >
 *       Upgrade to Add Databases
 *     </button>
 *     
 *     <!-- Usage meter -->
 *     <UsageMeter
 *       v-if="conversationsUsage"
 *       :used="conversationsUsage.used"
 *       :limit="conversationsUsage.limit"
 *       :label="'Conversations'"
 *     />
 *   </div>
 * </template>
 */