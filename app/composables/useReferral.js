// composables/useReferral.js
// Pulls the referral store, fetches the dashboard payload on first mount when
// the caller is authed, and re-exposes the store fields the dashboard binds to.
import { computed, onMounted } from 'vue'
import { useReferralStore } from '~/stores/referralStore'
import { useAuthStore } from '~/stores/authStore'

export function useReferral({ autoFetch = true } = {}) {
    const referralStore = useReferralStore()
    const authStore = useAuthStore()

    if (autoFetch) {
        onMounted(async () => {
            if (!authStore.isLoggedIn || !authStore.token) return
            // Avoid refetching if the store already has fresh data — multiple
            // components on the same page can both call useReferral() safely.
            if (referralStore.lastFetchedAt) return
            await referralStore.fetchDashboard()
        })
    }

    return {
        referralStore,
        economy: computed(() => referralStore.economy),
        loading: computed(() => referralStore.loading),
        error: computed(() => referralStore.error),
        xptBalance: computed(() => referralStore.xptBalance),
        canWithdraw: computed(() => referralStore.canWithdraw),
        referralCode: computed(() => referralStore.referralCode),
        shareUrl: computed(() =>
            referralStore.shareUrl ||
            (referralStore.referralCode
                ? `https://xeliai.com/register?ref=${referralStore.referralCode}`
                : '')
        ),
    }
}
