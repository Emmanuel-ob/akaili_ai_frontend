<script setup>
// /dashboard/referral exists only as a stable URL for historical bookmarks and
// external share links generated before the page moved into the settings tab.
// Auto-redirect on mount; preserve any query params (?tab will be overwritten).
definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
})
useHead({ title: 'Referrals and Rewards | Xeliai' })

const route = useRoute()

onMounted(() => {
    navigateTo({
        path: '/dashboard/settings',
        query: { ...route.query, tab: 'referrals' },
    }, { replace: true })
})
</script>

<template>
    <div class="max-w-3xl mx-auto px-4 py-12 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to Settings &rsaquo; Referrals &amp; Rewards&hellip;
        </p>
        <NuxtLink to="/dashboard/settings?tab=referrals" class="mt-3 inline-block text-[#9E4CFF] font-semibold underline">
            Go there now
        </NuxtLink>
    </div>
</template>
