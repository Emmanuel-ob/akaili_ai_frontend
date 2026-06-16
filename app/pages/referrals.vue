<script setup>
definePageMeta({ layout: 'default' })
useHead({ title: 'Referrals and Rewards | Xeliai' })

import { Gift, Share2, Users, Trophy, Tag, Landmark, Check } from 'lucide-vue-next'

const isAuthed = ref(false)
onMounted(async () => {
  const { useAuthStore } = await import('~/stores/authStore')
  const authStore = useAuthStore()
  isAuthed.value = authStore.isLoggedIn
})
</script>

<template>
<div class="bg-white dark:bg-slate-950 min-h-screen relative overflow-hidden">
  <!-- Purple radial gradient blob -->
  <div class="absolute top-0 right-0 w-96 h-96 bg-[#9E4CFF] opacity-10 rounded-full blur-3xl pointer-events-none z-0" style="transform: translate(40%, -40%)"></div>
  <div class="relative z-10 max-w-7xl mx-auto px-4 py-12">
    <!-- Section 1: Hero -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-10 text-center mb-12">
      <div class="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] rounded-full px-4 py-1 text-xs font-semibold mb-4">
        <Gift class="w-4 h-4" /> Refer a Business, Earn Rewards
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Bring a business into Xeliai. Both of you win.</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Every business you refer unlocks real benefits for both of you. Free referrals open bonus platform access. Paid referrals earn you XPT tokens worth real money.</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink v-if="isAuthed" to="/dashboard/referral" class="bg-[#9E4CFF] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-purple-700 transition">View My Referral Dashboard</NuxtLink>
        <template v-else>
          <NuxtLink to="/register" class="bg-[#9E4CFF] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-purple-700 transition">Create Your Account</NuxtLink>
          <NuxtLink to="/login" class="bg-gray-100 dark:bg-slate-800 text-[#9E4CFF] dark:text-purple-400 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-purple-50 dark:hover:bg-purple-500/10 transition">Sign In</NuxtLink>
        </template>
      </div>
    </div>

    <!-- Section 2: How It Works -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
        <Share2 class="w-8 h-8 text-[#9E4CFF] mb-2" />
        <div class="font-semibold mb-1">Share Your Code</div>
        <div class="text-gray-500 dark:text-gray-400 text-sm">Invite businesses with your unique referral code or link.</div>
      </div>
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
        <Users class="w-8 h-8 text-[#9E4CFF] mb-2" />
        <div class="font-semibold mb-1">Your Referral Signs Up</div>
        <div class="text-gray-500 dark:text-gray-400 text-sm">They join Xeliai and both of you unlock free perks instantly.</div>
      </div>
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
        <Trophy class="w-8 h-8 text-[#9E4CFF] mb-2" />
        <div class="font-semibold mb-1">They Upgrade, You Earn</div>
        <div class="text-gray-500 dark:text-gray-400 text-sm">Earn XPT tokens for every paid conversion. Hit milestones for bonuses.</div>
      </div>
    </div>

    <!-- Section 3: Token earning rates table -->
    <!-- TODO(phase5): these rates (+2/+5/+10 XPT, ₦400 per XPT) are hardcoded because
         this page is unauthenticated and has no hydrated referralStore. Once a public
         economy endpoint exists (e.g. GET /api/referral/economy returning the same
         `economy` block the authed dashboard uses), bind these cells to it so they
         cannot drift from the in-app dashboard or from config/referral.php. -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 mb-12">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Token Earning Rates</h3>
      <table class="min-w-full text-sm">
        <tbody>
          <tr>
            <td class="py-2 font-semibold">Referral signs up</td>
            <td class="py-2 text-[#9E4CFF] font-mono font-bold">+2 XPT</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold">Referral upgrades</td>
            <td class="py-2 text-[#9E4CFF] font-mono font-bold">+5 XPT</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold">3 paid referrals milestone</td>
            <td class="py-2 text-[#9E4CFF] font-mono font-bold">+10 XPT</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold">Withdrawal rate</td>
            <td class="py-2 text-[#9E4CFF] font-mono font-bold">₦400 per XPT</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 4: Three redemption option cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
        <div class="bg-purple-50 dark:bg-purple-500/10 rounded-lg p-2 mb-2"><Tag class="w-6 h-6 text-[#9E4CFF]" /></div>
        <div class="font-semibold mb-1">Subscription Discount</div>
        <div class="text-gray-500 dark:text-gray-400 text-sm mb-2">15 XPT = 15% off your next payment. Stacks up to 25% total.</div>
      </div>
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
        <div class="bg-yellow-50 dark:bg-yellow-500/10 rounded-lg p-2 mb-2"><Landmark class="w-6 h-6 text-yellow-500" /></div>
        <div class="font-semibold mb-1">Cash Withdrawal</div>
        <div class="text-gray-500 dark:text-gray-400 text-sm mb-2">50 XPT = ₦20,000 minimum. Each XPT is worth ₦400.</div>
      </div>
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
        <div class="bg-green-50 dark:bg-green-500/10 rounded-lg p-2 mb-2"><Gift class="w-6 h-6 text-green-600 dark:text-green-400" /></div>
        <div class="font-semibold mb-1">Free Referral Perks</div>
        <div class="text-gray-500 dark:text-gray-400 text-sm mb-2">Refer anyone to unlock bonus daily messages, team seat, and weekly upload.</div>
      </div>
    </div>

    <!-- Section 5: Final CTA banner -->
    <div class="bg-gradient-to-r from-purple-600 to-violet-600 rounded-3xl p-10 text-white text-center mt-12">
      <h2 class="text-2xl font-bold mb-2">Start Referring Today.</h2>
      <div class="flex flex-col sm:flex-row gap-3 justify-center mt-4">
        <NuxtLink v-if="isAuthed" to="/dashboard/referral" class="bg-white text-[#9E4CFF] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-purple-50 transition">View My Referral Dashboard</NuxtLink>
        <template v-else>
          <NuxtLink to="/register" class="bg-white text-[#9E4CFF] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-purple-50 transition">Create Your Account</NuxtLink>
        </template>
      </div>
    </div>
  </div>
</div>
</template>
