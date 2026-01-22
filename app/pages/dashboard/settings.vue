<!-- pages/dashboard/settings.vue -->
<template>
    <div class="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account, business, and billing</p>
        </div>

        <!-- Tabs Container -->
        <div
            class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
            <div class="border-b border-gray-200 dark:border-slate-800 overflow-x-auto">
                <nav class="flex -mb-px">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                        'px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                        activeTab === tab.id
                            ? 'border-[#9E4CFF] text-[#9E4CFF] dark:text-purple-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-700'
                    ]">
                        {{ tab.name }}
                    </button>
                </nav>
            </div>

            <div class="p-6">
               <!-- ===========================
                     PROFILE TAB
                     =========================== -->
                <div v-show="activeTab === 'profile'" class="space-y-8">
                    <!-- Profile Info Form -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Profile Information</h3>
                        <form @submit.prevent="updateProfile" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full
                                    Name</label>
                                <input v-model="profileForm.name" type="text" required
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                            </div>

                            <div class="flex justify-end gap-2 pt-2">
                                <button type="button" @click="resetProfileForm"
                                    class="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" :disabled="userStore.loading"
                                    class="px-4 py-2 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors">
                                    {{ userStore.loading ? 'Saving...' : 'Save Changes' }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Email Change Section -->
                    <div class="border-t border-gray-200 dark:border-slate-800 pt-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Email Address</h3>

                        <!-- 1. Current Email Display -->
                        <div v-if="!showEmailChangeForm && !emailChangeRequest" class="space-y-4">
                            <div
                                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700">
                                <div>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Current Email</p>
                                    <p class="text-base font-medium text-gray-900 dark:text-white">{{
                                        authStore.user?.email }}</p>
                                </div>
                                <button @click="showEmailChangeForm = true"
                                    class="px-4 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    Change Email
                                </button>
                            </div>
                        </div>

                        <!-- 2. Request Email Change Form -->
                        <div v-if="showEmailChangeForm && !emailChangeRequest" class="space-y-4">
                            <form @submit.prevent="requestEmailChange" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New
                                        Email Address</label>
                                    <input v-model="emailChangeForm.new_email" type="email" required
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Enter new email address" />
                                </div>

                                <div v-if="!isSocialOnly">
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current
                                        Password</label>
                                    <input v-model="emailChangeForm.password" type="password" required
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Enter your current password" />
                                </div>

                                <div
                                    class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                    <p class="text-sm text-blue-800 dark:text-blue-300">
                                        We'll send a verification code to your current email address ({{
                                        authStore.user?.email }}) to confirm this change.
                                    </p>
                                </div>

                                <div class="flex justify-end gap-2">
                                    <button type="button"
                                        @click="showEmailChangeForm = false; emailChangeForm = { new_email: '', password: '', verification_code: '' }"
                                        class="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" :disabled="emailChangeLoading"
                                        class="px-4 py-2 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors">
                                        {{ emailChangeLoading ? 'Sending Code...' : 'Send Verification Code' }}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- 3. Verify Code Form -->
                        <div v-if="emailChangeRequest" class="space-y-4">
                            <div
                                class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <div class="flex items-start gap-3">
                                    <svg class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <div class="flex-1">
                                        <p class="text-sm font-medium text-green-800 dark:text-green-300">Verification
                                            code sent!</p>
                                        <p class="text-sm text-green-700 dark:text-green-400 mt-1">
                                            We sent a 6-digit code to <strong>{{ authStore.user?.email }}</strong>
                                        </p>
                                        <p class="text-sm text-green-700 dark:text-green-400 mt-1">
                                            New email: <strong>{{ emailChangeRequest.new_email }}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form @submit.prevent="verifyEmailChange" class="space-y-4">
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification
                                        Code</label>
                                    <input v-model="emailChangeForm.verification_code" type="text" required
                                        maxlength="6" pattern="[0-9]{6}"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-center text-2xl tracking-widest font-mono transition-colors"
                                        placeholder="000000" />
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter the 6-digit code from
                                        your email</p>
                                </div>

                                <div class="flex justify-end gap-2">
                                    <button type="button" @click="cancelEmailChange"
                                        class="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" :disabled="emailChangeLoading"
                                        class="px-4 py-2 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors">
                                        {{ emailChangeLoading ? 'Verifying...' : 'Verify & Change Email' }}
                                    </button>
                                </div>
                            </form>

                            <button @click="requestEmailChange" :disabled="emailChangeLoading"
                                class="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline transition-colors">
                                Didn't receive the code? Resend
                            </button>
                        </div>
                    </div>

                    <!-- Password Change Section -->
                    <div class="border-t border-gray-200 dark:border-slate-800 pt-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Change Password</h3>
                        <form @submit.prevent="updatePassword" class="space-y-4">
                            <div v-if="hasPassword">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current
                                    Password</label>
                                <input v-model="passwordForm.current_password" type="password" required
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New
                                    Password</label>
                                <input v-model="passwordForm.password" type="password" required minlength="8"
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm
                                    New Password</label>
                                <input v-model="passwordForm.password_confirmation" type="password" required
                                    minlength="8"
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                            </div>

                            <div class="flex justify-end gap-2 pt-2">
                                <button type="button" @click="resetPasswordForm"
                                    class="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" :disabled="userStore.loading"
                                    class="px-4 py-2 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors">
                                    {{ userStore.loading ? 'Updating...' : 'Update Password' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

               <!-- ===========================
                     BUSINESS TAB
                     =========================== -->
                <div v-show="activeTab === 'business'" class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Business Information</h3>
                        <form @submit.prevent="updateBusiness" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company
                                        Name</label>
                                    <input v-model="businessForm.company_name" type="text" required
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>

                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                                    <input v-model="businessForm.industry" type="text" required
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>

                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company
                                        Size</label>
                                    <select v-model="businessForm.company_size"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors">
                                        <option value="">Select size</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="500+">500+ employees</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website
                                        URL</label>
                                    <input v-model="businessForm.website_url" type="url"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>

                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Support
                                        Email</label>
                                    <input v-model="businessForm.support_email" type="email"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>

                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Support
                                        Phone</label>
                                    <input v-model="businessForm.support_phone" type="tel"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>

                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                    <input v-model="businessForm.location" type="text"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>

                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                                    <select v-model="businessForm.timezone"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors">
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">Eastern Time</option>
                                        <option value="America/Chicago">Central Time</option>
                                        <option value="America/Denver">Mountain Time</option>
                                        <option value="America/Los_Angeles">Pacific Time</option>
                                        <option value="Europe/London">London</option>
                                        <option value="Africa/Lagos">Lagos</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea v-model="businessForm.description" rows="3"
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                                    placeholder="Tell us about your business"></textarea>
                            </div>

                            <div class="flex justify-end gap-2 pt-2">
                                <button type="button" @click="resetBusinessForm"
                                    class="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" :disabled="businessStore.loading"
                                    class="px-4 py-2 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors">
                                    {{ businessStore.loading ? 'Saving...' : 'Save Changes' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- SUBSCRIPTION TAB -->
                <div v-show="activeTab === 'subscription'" class="space-y-8">

                    <!-- Loading State -->
                    <div v-if="subscriptionStore.loading" class="animate-pulse space-y-4">
                        <div class="h-48 bg-gray-100 dark:bg-slate-800 rounded-xl"></div>
                    </div>

                    <!-- RBAC Check -->
                    <div v-else-if="!canManageBilling"
                        class="p-12 text-center bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
                        <div
                            class="bg-gray-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Access Restricted</h3>
                        <p class="text-gray-500 dark:text-gray-400 mt-2">Only the account owner can manage billing and
                            subscriptions.</p>
                    </div>

                    <!-- Pending Transactions Alert -->
                    <PendingTransactions v-else-if="subscriptionStore.currentPlan" />

                    <!-- Active Subscription Content -->
                    <div v-if="subscriptionStore.currentPlan"
                        class="bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 p-6 transition-colors">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div class="flex items-center gap-3">
                                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                                        {{ subscriptionStore.currentPlan.plan_name || 'Subscription' }}
                                    </h3>
                                    <span :class="[
                                        'px-2.5 py-0.5 text-xs font-medium rounded-full',
                                        subscriptionStore.currentPlan.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    ]">
                                        {{ subscriptionStore.currentPlan.status || 'Unknown' }}
                                    </span>
                                </div>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <template
                                        v-if="subscriptionStore.currentPlan.amount && subscriptionStore.currentPlan.currency">
                                        {{ subscriptionStore.currentPlan.currency }} {{
                                        subscriptionStore.currentPlan.amount }} / month
                                    </template>
                                    <template v-if="subscriptionStore.currentPlan.current_period_end">
                                        • {{ subscriptionStore.currentPlan.status === 'active' ? 'Renews' : 'Expires' }}
                                        on {{ formatDate(subscriptionStore.currentPlan.current_period_end) }}
                                    </template>
                                </p>
                            </div>

                            <div class="flex gap-3">
                                <button v-if="subscriptionStore.currentPlan.status === 'active'"
                                    @click="openChangePlanModal"
                                    class="px-4 py-2 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                                    Change Plan
                                </button>
                                <button v-else @click="reactivateSubscription"
                                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                                    Reactivate
                                </button>
                            </div>
                        </div>

                        <!-- Usage Progress -->
                        <div v-if="subscriptionStore.usage"
                            class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600 dark:text-gray-300">Conversations Used</span>
                                <span class="text-gray-900 dark:text-white font-medium">
                                    {{ subscriptionStore.usage.conversations?.used || 0 }} /
                                    {{ subscriptionStore.usage.conversations?.limit === 999999 ? 'Unlimited' :
                                        (subscriptionStore.usage.conversations?.limit || 0) }}
                                </span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                <div class="bg-[#9E4CFF] h-2.5 rounded-full transition-all duration-500"
                                    :style="{ width: calculateUsagePercentage() + '%' }"></div>
                            </div>
                        </div>

                        <!-- Cancel Section -->
                        <div v-if="subscriptionStore.currentPlan.status === 'active' && !subscriptionStore.currentPlan.cancel_at_period_end"
                            class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                            <h4 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Cancel Subscription
                            </h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Once you cancel, you will lose access to premium features at the end of your current
                                billing cycle.
                            </p>
                            <button @click="openCancelModal"
                                class="px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-sm font-medium transition-colors">
                                Cancel Subscription
                            </button>
                        </div>
                    </div>

                    <!-- No Subscription State -->
                    <div v-else
                        class="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
                        <div
                            class="bg-gray-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">No Active Subscription</h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-6">Subscribe to a plan to unlock premium features
                        </p>
                        <NuxtLink to="/pricing"
                            class="inline-block px-6 py-2 bg-[#9E4CFF] text-white rounded-lg font-medium hover:bg-purple-700 transition">
                            View Plans
                        </NuxtLink>
                    </div>
                </div>

                <div v-show="activeTab === 'billing'">
                    <BillingHistory />
                </div>
            </div>
        </div>

        <!-- MODALS -->
        <ChangePlanModal v-if="showChangePlanModal && subscriptionStore.currentPlan"
            :current-plan-id="subscriptionStore.currentPlan.plan_id" @close="showChangePlanModal = false"
            @updated="handlePlanUpdated" />

        <CancelSubscriptionModal v-if="showCancelModal" @close="showCancelModal = false"
            @canceled="handleSubscriptionCanceled" />

        <!-- Toasts -->
        <div v-if="successMessage"
            class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-fade-in">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
            </svg>
            <span>{{ successMessage }}</span>
            <button @click="successMessage = ''" class="hover:text-green-100">×</button>
        </div>

        <div v-if="errorMessage"
            class="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-fade-in">
            <span>{{ errorMessage }}</span>
            <button @click="errorMessage = ''" class="hover:text-red-100">×</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'
import { useUserStore } from '~/stores/userStore'
import { useBusinessStore } from '~/stores/businessStore'
import { useSubscriptionStore } from '~/stores/subscriptionStore'
import PendingTransactions from '~/components/payments/PendingTransactions.vue'
import ChangePlanModal from '~/components/settings/ChangePlanModal.vue'
import CancelSubscriptionModal from '~/components/settings/CancelSubscriptionModal.vue'
import BillingHistory from '~/components/payments/BillingHistory.vue'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const authStore = useAuthStore()
const userStore = useUserStore()
const businessStore = useBusinessStore()
const subscriptionStore = useSubscriptionStore()

const activeTab = ref(route.query.tab || 'profile')
const successMessage = ref('')
const errorMessage = ref('')

const tabs = [
    { id: 'profile', name: 'Profile' },
    { id: 'business', name: 'Business Settings' },
    { id: 'subscription', name: 'Subscription' },
    { id: 'billing', name: 'Billing History' }
]

const showChangePlanModal = ref(false)
const showCancelModal = ref(false)

// Forms (keeping for brevity)
const profileForm = ref({ name: '' })
const passwordForm = ref({ current_password: '', password: '', password_confirmation: '' })
const businessForm = ref({})

const canManageBilling = computed(() => true)

const calculateUsagePercentage = () => {
    if (!subscriptionStore.usage || !subscriptionStore.usage.conversations) return 5
    const limits = subscriptionStore.usage.conversations
    if (limits.limit === 999999 || limits.limit === -1) return 5
    if (limits.limit === 0) return 0
    return Math.min(100, (limits.used / limits.limit) * 100)
}

const initializeForms = async () => {
    profileForm.value = { name: authStore.user?.name || '' }
    await businessStore.fetchBusiness()
    if (businessStore.business) {
        businessForm.value = { ...businessStore.business }
    }
}

const openChangePlanModal = () => { showChangePlanModal.value = true }
const openCancelModal = () => { showCancelModal.value = true }

const handlePlanUpdated = async (newPlanName) => {
    showChangePlanModal.value = false
    successMessage.value = `Successfully changed plan to ${newPlanName}`
    setTimeout(() => { successMessage.value = '' }, 3000)
    await subscriptionStore.fetchSubscription()
}

const handleSubscriptionCanceled = async () => {
    showCancelModal.value = false
    successMessage.value = 'Subscription has been canceled'
    setTimeout(() => { successMessage.value = '' }, 3000)
    await subscriptionStore.fetchSubscription()
}

const reactivateSubscription = async () => {
    const result = await subscriptionStore.resumeSubscription()
    if (result.success) {
        successMessage.value = 'Subscription reactivated successfully!'
    } else {
        errorMessage.value = result.error
    }
    setTimeout(() => {
        successMessage.value = ''
        errorMessage.value = ''
    }, 3000)
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

onMounted(async () => {
    await initializeForms()
    await subscriptionStore.fetchSubscription()
})
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}
</style>