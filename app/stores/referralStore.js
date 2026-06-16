import { defineStore } from 'pinia'

/**
 * Default economy (mirrors backend config/referral.php).
 *
 * Server-side SettingsRepository can override any of these; the dashboard
 * payload returns the resolved values which overwrite this object on every
 * fetchDashboard(). The defaults here keep the UI visually intact during the
 * first paint (before the first fetch resolves) and on unauthenticated pages
 * that have no token to fetch with.
 */
const DEFAULT_ECONOMY = {
    signupBonusXpt: 2,
    conversionBonusXpt: 5,
    milestoneBonusXpt: 10,
    milestoneEvery: 3,
    discountCostXpt: 15,
    discountPercent: 10,
    withdrawalMinXpt: 50,
    nairaPerXpt: 400,
    withdrawalCurrency: 'NGN',
}

export const useReferralStore = defineStore('referral', {
    state: () => ({
        // Server-populated identifiers.
        referralCode: null,
        shareUrl: '',

        // Resolved economy from the server (admin override > config > default).
        // Pre-fetch defaults keep templates from rendering "undefined".
        economy: { ...DEFAULT_ECONOMY },

        // Balances + lifetime.
        xptBalance: 0,
        xptLifetimeEarned: 0,

        // Lists.
        referrals: [],
        xptHistory: [],
        withdrawalHistory: [],

        // Discount state. The dashboard treats this as singular (one active code
        // at a time) to match the `one_active_discount` server policy.
        generatedDiscountCode: null,
        appliedPromoCode: null,
        usedDiscounts: 0,

        // Milestone projection from the server.
        milestoneBonusEarned: false,
        milestoneProgressRaw: 0,
        milestoneEarnedCount: 0,

        // Withdrawal in-flight flag.
        pendingWithdrawal: false,

        // Free perk active flag from the server.
        freePerkActiveServer: false,

        // Async state.
        loading: false,
        error: null,
        lastFetchedAt: null,
    }),

    getters: {
        totalReferrals: (state) => state.referrals.length,
        totalPaidReferrals: (state) => state.referrals.filter((r) => r.converted).length,

        // Ring position toward the next milestone (display only).
        milestoneProgress: (state) => state.milestoneProgressRaw,
        milestoneEarned: (state) => state.milestoneEarnedCount,

        canWithdraw: (state) => state.xptBalance >= (state.economy?.withdrawalMinXpt ?? 0),
        withdrawableNaira: (state) => state.xptBalance * (state.economy?.nairaPerXpt ?? 0),
        xptToWithdrawal: (state) =>
            Math.max(0, (state.economy?.withdrawalMinXpt ?? 0) - state.xptBalance),

        freePerkActive: (state) => state.freePerkActiveServer || state.referrals.length > 0,
    },

    actions: {
        /**
         * Pull the full referral dashboard payload from the API and project it
         * into state. Idempotent: safe to call from multiple components and
         * on tab activation. Errors are stored on `error` and shown via the
         * page-level banner pattern (Q8: banner for blocking, toast for transient).
         */
        async fetchDashboard() {
            const authStore = useAuthStore()
            if (!authStore.isLoggedIn || !authStore.token) {
                return { success: false, reason: 'unauthenticated' }
            }

            const config = useRuntimeConfig()
            this.loading = true
            this.error = null

            try {
                const response = await $fetch(`${config.public.apiBase}/api/referral/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        Accept: 'application/json',
                    },
                })

                if (!response?.success || !response?.data) {
                    throw new Error('Malformed dashboard response')
                }

                this.applyDashboardPayload(response.data)
                this.lastFetchedAt = Date.now()
                return { success: true }
            } catch (error) {
                console.error('[REFERRAL STORE] fetchDashboard error:', error)
                this.error =
                    error?.data?.message || error?.message || 'Failed to load referral dashboard.'
                return { success: false, error: this.error }
            } finally {
                this.loading = false
            }
        },

        /**
         * Public — validate a referral code before signup. No auth required.
         * Returns `{ valid, referrer_name? }` from the server, normalized.
         */
        async applyReferralCode(code) {
            const trimmed = (code || '').trim().toUpperCase()
            if (!trimmed) {
                return { valid: false, reason: 'empty' }
            }

            const config = useRuntimeConfig()
            try {
                const response = await $fetch(
                    `${config.public.apiBase}/api/referral/validate-code`,
                    {
                        method: 'POST',
                        body: { code: trimmed },
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                )

                if (response?.success && response?.data?.valid) {
                    return {
                        valid: true,
                        referrer_name: response.data.referrer_name ?? null,
                    }
                }
                return { valid: false, reason: 'unknown_code' }
            } catch (error) {
                console.error('[REFERRAL STORE] applyReferralCode error:', error)
                return { valid: false, reason: 'network', error: error?.data?.message }
            }
        },

        /**
         * Redeem the user's current XPT balance for a subscription discount.
         * On success, refetches the dashboard so balance, discount[], and the
         * XPT history all update in one transaction from the UI's perspective.
         */
        async redeemSubscriptionDiscount() {
            const authStore = useAuthStore()
            if (!authStore.isLoggedIn || !authStore.token) {
                return { success: false, reason: 'unauthenticated' }
            }

            const config = useRuntimeConfig()
            try {
                const response = await $fetch(
                    `${config.public.apiBase}/api/referral/redeem-discount`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${authStore.token}`,
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                )

                if (response?.success && response?.data?.code) {
                    await this.fetchDashboard()
                    return {
                        success: true,
                        code: response.data.code,
                        percent: response.data.percent,
                        message: 'Discount code generated successfully.',
                    }
                }
                return { success: false, message: response?.message || 'Could not redeem discount.' }
            } catch (error) {
                console.error('[REFERRAL STORE] redeemSubscriptionDiscount error:', error)
                return {
                    success: false,
                    message: error?.data?.message || 'Could not redeem discount.',
                }
            }
        },

        /**
         * Submit a partial-amount withdrawal request. Validation is server-side
         * authoritative; the frontend pre-validates only to give immediate
         * feedback. Refetches the dashboard on success so the new pending
         * withdrawal appears.
         */
        async requestWithdrawal(bank, amount) {
            const authStore = useAuthStore()
            if (!authStore.isLoggedIn || !authStore.token) {
                return { success: false, reason: 'unauthenticated' }
            }

            const config = useRuntimeConfig()
            try {
                const response = await $fetch(
                    `${config.public.apiBase}/api/referral/request-withdrawal`,
                    {
                        method: 'POST',
                        body: { xpt_amount: amount, bank_details: bank },
                        headers: {
                            Authorization: `Bearer ${authStore.token}`,
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                )

                if (response?.success && response?.data?.id) {
                    await this.fetchDashboard()
                    return {
                        success: true,
                        id: response.data.id,
                        message: 'Withdrawal request submitted. Processing takes 3 to 5 business days.',
                    }
                }
                return {
                    success: false,
                    message: response?.message || 'Could not submit withdrawal.',
                }
            } catch (error) {
                console.error('[REFERRAL STORE] requestWithdrawal error:', error)
                return {
                    success: false,
                    message: error?.data?.message || 'Could not submit withdrawal.',
                }
            }
        },

        /**
         * Checkout-time discount code lookup. Returns `{ valid, percent, status }`
         * for a code that belongs to the caller.
         */
        async checkDiscount(code) {
            const authStore = useAuthStore()
            if (!authStore.isLoggedIn || !authStore.token) {
                return { valid: false, reason: 'unauthenticated' }
            }

            const config = useRuntimeConfig()
            try {
                const response = await $fetch(
                    `${config.public.apiBase}/api/referral/discount/${encodeURIComponent(code)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authStore.token}`,
                            Accept: 'application/json',
                        },
                    }
                )
                return response?.data ?? { valid: false }
            } catch (error) {
                console.error('[REFERRAL STORE] checkDiscount error:', error)
                return { valid: false, reason: 'network' }
            }
        },

        setAppliedPromoCode(code) {
            this.appliedPromoCode = code
        },

        /**
         * Map the spec §3.5 dashboard payload onto the Phase 1 store field names
         * the existing dashboard templates bind to. Keeps the templates stable
         * across the Phase 1 → Phase 3 transition; Phase 3.3 will tighten the
         * server-shaped bindings (xpt_history[].transaction_id key, etc.).
         */
        applyDashboardPayload(data) {
            this.referralCode = data.referral_code ?? null
            this.shareUrl = data.share_url ?? ''
            this.xptBalance = Number(data.xpt_balance ?? 0)
            this.xptLifetimeEarned = Number(data.xpt_lifetime ?? 0)

            if (data.economy && typeof data.economy === 'object') {
                this.economy = { ...DEFAULT_ECONOMY, ...data.economy }
            }

            this.referrals = (data.referrals ?? []).map((r) => ({
                id: r.id,
                name: r.name,
                email: r.email,
                joinedAt: r.joined_at,
                convertedAt: r.converted_at,
                status: r.status,
                converted: r.status === 'converted',
                discountEarned: false,
                plan: r.plan ?? 'professional',
                sourceCode: r.source_code,
            }))

            this.xptHistory = (data.xpt_history ?? []).map((e) => ({
                transaction_id: e.transaction_id,
                date: e.date,
                amount: Number(e.amount),
                reason: e.reason,
                balanceAfter: Number(e.balance_after ?? 0),
                ref: e.ref,
            }))

            this.withdrawalHistory = (data.withdrawals ?? []).map((w) => ({
                id: w.id,
                xptAmount: Number(w.xpt_amount),
                nairaAmount: Number(w.fiat_amount),
                currency: w.currency,
                status: w.status,
                requestedAt: w.requested_at,
                actionedAt: w.actioned_at,
                paidAt: w.paid_at,
            }))

            this.pendingWithdrawal = this.withdrawalHistory.some(
                (w) => w.status === 'pending' || w.status === 'approved'
            )

            const activeDiscount = (data.discount ?? []).find((d) => d.status === 'active')
            this.generatedDiscountCode = activeDiscount?.code ?? null

            this.milestoneProgressRaw = Number(data.milestone?.progress ?? 0)
            this.milestoneEarnedCount = Number(data.milestone?.earned_count ?? 0)
            this.milestoneBonusEarned = this.milestoneEarnedCount > 0

            this.freePerkActiveServer = Boolean(data.free_perk_active)
        },
    },
})
