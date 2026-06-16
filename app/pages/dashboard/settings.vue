<template>
    <div class="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account, business, and billing</p>
        </div>

        <!-- Tabs Container -->
        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
            <!-- Scrollbar Hidden Tab Navigation -->
            <div class="border-b border-gray-200 dark:border-slate-800 overflow-x-auto scrollbar-hide relative z-60">
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
                    
                    <!-- 1. Profile Picture Upload -->
                    <div class="flex items-center gap-6 p-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                        <div class="relative group">
                            <!-- Avatar Preview -->
                            <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
                                <img v-if="avatarPreview || authStore.user?.avatar" 
                                     :src="avatarPreview || authStore.user?.avatar" 
                                     :key="avatarTimestamp"
                                     class="w-full h-full object-cover" 
                                     alt="Profile" />
                                <div v-else class="w-full h-full flex items-center justify-center text-gray-300 dark:text-slate-500 text-3xl font-bold bg-gray-100 dark:bg-slate-700">
                                    {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
                                </div>
                            </div>
                            
                            <!-- Upload Button -->
                            <label class="absolute bottom-0 right-0 p-2 bg-[#9E4CFF] text-white rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition-all transform hover:scale-105 active:scale-95 border-2 border-white dark:border-slate-800">
                                <!-- Spinner if uploading -->
                                <svg v-if="uploadingAvatar" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <!-- Camera Icon -->
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <input type="file" class="hidden" accept="image/*" @change="handleAvatarUpload" :disabled="uploadingAvatar" />
                            </label>
                        </div>
                        
                        <div>
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Profile Photo</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Recommended: Square JPG, PNG. Max 2MB.</p>
                        </div>
                    </div>

                    <!-- 2. Personal Details Form -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Personal Details</h3>
                        <form @submit.prevent="updateProfile" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input v-model="profileForm.name" type="text" required
                                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                            </div>

                            <div class="flex justify-end gap-2 pt-2">
                                <button type="button" @click="resetProfileForm"
                                    class="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" :disabled="userStore.loading"
                                    class="px-4 py-2 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors shadow-sm">
                                    {{ userStore.loading ? 'Saving...' : 'Save Changes' }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- 3. Email Address Management -->
                    <div class="border-t border-gray-200 dark:border-slate-800 pt-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Email Address</h3>

                        <!-- Current Email Display -->
                        <div v-if="!showEmailChangeForm && !emailChangeRequest" class="space-y-4">
                            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700">
                                <div>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Current Email</p>
                                    <p class="text-base font-medium text-gray-900 dark:text-white">{{ authStore.user?.email }}</p>
                                </div>
                                <button @click="showEmailChangeForm = true"
                                    class="px-4 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    Change Email
                                </button>
                            </div>
                        </div>

                        <!-- Request Email Change Form -->
                        <div v-if="showEmailChangeForm && !emailChangeRequest" class="space-y-4">
                            <form @submit.prevent="requestEmailChange" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Email Address</label>
                                    <input v-model="emailChangeForm.new_email" type="email" required
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Enter new email address" />
                                </div>

                                <div v-if="!isSocialOnly">
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                    <input v-model="emailChangeForm.password" type="password" required
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Enter your current password" />
                                </div>

                                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                    <p class="text-sm text-blue-800 dark:text-blue-300">
                                        We'll send a verification code to your current email address ({{ authStore.user?.email }}) to confirm this change.
                                    </p>
                                </div>

                                <div class="flex justify-end gap-2">
                                    <button type="button"
                                        @click="showEmailChangeForm = false; emailChangeForm = { new_email: '', password: '', verification_code: '' }"
                                        class="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" :disabled="emailChangeLoading"
                                        class="px-4 py-2 bg-[#9E4CFF] text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors">
                                        {{ emailChangeLoading ? 'Sending Code...' : 'Send Verification Code' }}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Verify Code Form -->
                        <div v-if="emailChangeRequest" class="space-y-4">
                            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <div class="flex items-start gap-3">
                                    <svg class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                    </svg>
                                    <div class="flex-1">
                                        <p class="text-sm font-medium text-green-800 dark:text-green-300">Verification code sent!</p>
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
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification Code</label>
                                    <input v-model="emailChangeForm.verification_code" type="text" required
                                        maxlength="6" pattern="[0-9]{6}"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-center text-2xl tracking-widest font-mono transition-colors"
                                        placeholder="000000" />
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter the 6-digit code from your email</p>
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

                    <!-- 4. Password Change Section -->
                    <div class="border-t border-gray-200 dark:border-slate-800 pt-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Change Password</h3>
                        <form @submit.prevent="updatePassword" class="space-y-4">
                            <div v-if="hasPassword">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                <input v-model="passwordForm.current_password" type="password" required
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                    <input v-model="passwordForm.password" type="password" required minlength="8"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                    <input v-model="passwordForm.password_confirmation" type="password" required
                                        minlength="8"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>
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
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                                    <input v-model="businessForm.company_name" type="text" required
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                                    <!-- Item 8: Replaced free-text input with dropdown. Legacy custom values shown gracefully. -->
                                    <select v-model="businessForm.industry" required
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors">
                                        <option value="">Select Industry</option>
                                        <option v-for="ind in industries" :key="ind.value" :value="ind.value">{{ ind.label }}</option>
                                        <!-- Gracefully render legacy free-text values that don't match any option -->
                                        <option
                                            v-if="businessForm.industry && !industries.find(i => i.value === businessForm.industry)"
                                            :value="businessForm.industry"
                                        >{{ businessForm.industry }} (custom)</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Size</label>
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
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
                                    <input v-model="businessForm.website_url" type="url"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Support Email</label>
                                    <input v-model="businessForm.support_email" type="email"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Support Phone</label>
                                    <input v-model="businessForm.support_phone" type="tel"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                    <input v-model="businessForm.location" type="text"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
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
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
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

                <!-- ===========================
                     SUBSCRIPTION TAB
                     =========================== -->
                <div v-show="activeTab === 'subscription'" class="space-y-8">
                    
                    <!-- Loading State -->
                    <div v-if="subscriptionStore.loading" class="animate-pulse space-y-4">
                        <div class="h-48 bg-gray-100 dark:bg-slate-800 rounded-xl"></div>
                    </div>

                    <!-- RBAC Check -->
                    <div v-else-if="!canManageBilling" class="p-12 text-center bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
                        <div class="bg-gray-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Access Restricted</h3>
                        <p class="text-gray-500 dark:text-gray-400 mt-2">Only the account owner can manage billing and subscriptions.</p>
                    </div>

                    <!-- Pending Transactions Alert -->
                    <PendingTransactions v-else-if="subscriptionStore.currentPlan && subscriptionStore.currentPlan.status === 'pending'" />

                    <!-- Active Subscription Content -->
                    <div v-else-if="subscriptionStore.currentPlan"
                        class="bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 p-6 transition-colors">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div class="flex items-center gap-3">
                                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ subscriptionStore.currentPlan.name || 'Subscription' }} Plan</h3>
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
                                    {{ subscriptionStore.currentPlan.price }} / month
                                    <span v-if="subscriptionStore.currentPlan.status === 'active'">• Renews on {{ formatDate(subscriptionStore.currentPlan.nextBillingDate) }}</span>
                                    <span v-else>• Expires on {{ formatDate(subscriptionStore.currentPlan.nextBillingDate) }}</span>
                                </p>
                            </div>
                            
                            <div class="flex gap-3">
                                <!--
                                    Reactivate is the inverse of "cancel at period end" — it
                                    only works when subscriptionStore.currentPlan.cancel_at_period_end
                                    is true. For 'active' (not pending cancel) or 'trialing' subs,
                                    show "Change Plan" instead.
                                -->
                                <button v-if="subscriptionStore.currentPlan.cancel_at_period_end"
                                    @click="reactivateSubscription"
                                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    Reactivate
                                </button>
                                <button v-else-if="['active','trialing'].includes(subscriptionStore.currentPlan.status)"
                                    @click="openChangePlanModal"
                                    class="px-4 py-2 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    Change Plan
                                </button>
                            </div>
                        </div>

                        <!-- Usage Progress -->
                        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600 dark:text-gray-300">Conversations Used</span>
                                <span class="text-gray-900 dark:text-white font-medium">
                                    {{ subscriptionStore.currentPlan.limits?.conversations?.used || 0 }} / 
                                    {{ subscriptionStore.currentPlan.limits?.conversations?.total === 999999 ? 'Unlimited' : (subscriptionStore.currentPlan.limits?.conversations?.total || 0) }}
                                </span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                <div class="bg-[#9E4CFF] h-2.5 rounded-full transition-all duration-500" 
                                     :style="{ width: calculateUsagePercentage() + '%' }"></div>
                            </div>
                        </div>

                        <!-- Cancel Section -->
                        <div v-if="subscriptionStore.currentPlan.status === 'active'" class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                            <h4 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Cancel Subscription</h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Once you cancel, you will lose access to premium features at the end of your current billing cycle.
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

                <div v-show="activeTab === 'referrals'" class="space-y-8">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div class="mb-8 ref-enter" :style="{ animationDelay: refSections[0] + 'ms' }">
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Referrals and Rewards</h1>
                            <p class="text-gray-500 dark:text-gray-400 mt-1">Track referrals, earn XPT tokens, and redeem rewards.</p>
                        </div>

                        <!-- Blocking error banner (Q8): shows when the dashboard fetch failed.
                             Transient action errors stay on the existing toast pattern below. -->
                        <div v-if="referralStore.error && !referralStore.lastFetchedAt" class="mb-6 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-800 p-4 flex items-center justify-between gap-4">
                            <p class="text-sm text-red-900 dark:text-red-100">{{ referralStore.error }}</p>
                            <button type="button" @click="referralStore.fetchDashboard()" class="text-sm font-semibold text-red-900 dark:text-red-100 underline">Retry</button>
                        </div>

                        <!-- First-load skeleton (Q8): only shown while loading and we have no payload yet. -->
                        <div v-if="referralStore.loading && !referralStore.lastFetchedAt" class="mb-6 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse">
                            <div class="h-8 w-40 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
                            <div class="h-4 w-72 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                            <div class="h-4 w-56 bg-gray-200 dark:bg-slate-700 rounded"></div>
                        </div>

                        <div ref="xptWalletRef" class="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 ease-out opacity-0 translate-y-6" :class="sectionVisible[0] ? 'opacity-100 translate-y-0' : ''" :style="{ animationDelay: refSections[1] + 'ms' }">
                            <div class="absolute inset-0 pointer-events-none overflow-hidden">
                                <span class="absolute top-4 left-10 w-24 h-24 rounded-full bg-purple-200/40 dark:bg-purple-500/10 blur-2xl bubble-float"></span>
                                <span class="absolute top-10 right-8 w-16 h-16 rounded-full bg-amber-200/30 dark:bg-amber-500/10 blur-2xl bubble-float-slow"></span>
                                <span class="absolute -bottom-8 left-16 w-32 h-32 rounded-full bg-purple-200/40 dark:bg-purple-500/10 blur-2xl bubble-float-slower"></span>
                                <span class="absolute top-24 right-24 w-20 h-20 rounded-full bg-amber-200/30 dark:bg-amber-500/10 blur-2xl bubble-float"></span>
                                <span class="absolute bottom-5 right-16 w-16 h-16 rounded-full bg-purple-200/40 dark:bg-purple-500/10 blur-2xl bubble-float-slow"></span>
                            </div>
                            <div v-if="showConfetti" class="absolute inset-x-0 top-0 h-0 overflow-visible pointer-events-none z-10">
                                <span v-for="piece in confettiPieces" :key="piece.id" :class="['confetti-piece absolute rounded-full', piece.color]" :style="{ left: piece.left, animationDelay: piece.delay + 'ms' }"></span>
                            </div>
                            <div class="lg:col-span-2 relative">
                                <div class="flex items-center gap-2 mb-2">
                                    <Zap class="w-4 h-4 text-yellow-400" />
                                    <span class="uppercase text-xs font-semibold text-gray-400">XPT Wallet</span>
                                </div>
                                <div class="flex items-end gap-3">
                                    <span class="text-6xl font-bold text-gray-900 dark:text-white">{{ referralStore.xptBalance }}</span>
                                    <span class="text-lg font-semibold text-gray-500">XPT</span>
                                </div>
                                <div class="text-gray-400 text-sm mb-2">Referral Tokens</div>
                                <div v-if="!referralStore.canWithdraw">
                                    <div class="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>{{ referralStore.xptBalance }} of {{ referralStore.economy.withdrawalMinXpt }} XPT to withdrawal threshold</span>
                                    </div>
                                    <div class="h-2 w-full rounded-full bg-gray-100 dark:bg-slate-700">
                                        <div class="bg-[#9E4CFF] h-2 rounded-full transition-all duration-700" :style="{ width: Math.min(100, (referralStore.xptBalance / referralStore.economy.withdrawalMinXpt) * 100) + '%' }" />
                                    </div>
                                </div>
                                <div v-else class="mt-2">
                                    <div class="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2">
                                        <Check class="w-4 h-4" /> Withdrawal threshold reached
                                    </div>
                                </div>
                                <div class="mt-3 text-xs text-gray-400">Lifetime earned: {{ referralStore.xptLifetimeEarned }} XPT</div>
                            </div>
                            <div class="flex flex-col gap-4">
                                <div class="bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-3">
                                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">XPT needed to withdraw</div>
                                    <div class="text-xl text-gray-800 dark:text-gray-100  font-bold">{{ referralStore.xptToWithdrawal }} XPT</div>
                                </div>
                                <div class="bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-3">
                                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Current withdrawal value</div>
                                    <div class="text-xl text-gray-800 dark:text-gray-100  font-bold">₦{{ referralStore.withdrawableNaira.toLocaleString('en-NG') }}</div>
                                </div>
                                <div class="bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-3">
                                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Past withdrawals</div>
                                    <div class="text-xl text-gray-800 dark:text-gray-100  font-bold">{{ referralStore.withdrawalHistory.length }}</div>
                                </div>
                            </div>
                        </div>

                        <div ref="statsRowRef" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 transition-all duration-500 ease-out opacity-0 translate-y-6" :class="sectionVisible[1] ? 'opacity-100 translate-y-0' : ''" :style="{ animationDelay: refSections[2] + 'ms' }">
                            <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 border-l-4 border-l-purple-400 dark:border-l-purple-500 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
                                <Users class="w-7 h-7 text-gray-400" />
                                <div>
                                    <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ statsCount.referrals }}</div>
                                    <div class="text-xs text-gray-500 mt-1">Total Referrals</div>
                                </div>
                            </div>
                            <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 border-l-4 border-l-amber-400 dark:border-l-amber-500 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
                                <Trophy class="w-7 h-7 text-[#9E4CFF]" />
                                <div>
                                    <div class="flex items-center text-gray-800 dark:text-gray-100 gap-2">
                                        <span class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ statsCount.paidReferrals }}</span>
                                        <UBadge v-if="referralStore.totalPaidReferrals > 0" color="purple" size="xs">Earning discounts</UBadge>
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">Paid Conversions</div>
                                </div>
                            </div>
                            <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 border-l-4 border-l-green-400 dark:border-l-green-500 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
                                <Tag class="w-7 h-7 text-yellow-500" />
                                <div>
                                    <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ statsCount.discounts }}</div>
                                    <div class="text-xs text-gray-500 mt-1">Discounts Queued</div>
                                    <div class="text-xs text-gray-400">{{ referralStore.economy.discountPercent }} percent each</div>
                                </div>
                            </div>
                        </div>

                        <div ref="referralCodeRef" class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm mb-6 transition-all duration-500 ease-out opacity-0 translate-y-6" :class="sectionVisible[2] ? 'opacity-100 translate-y-0' : ''" :style="{ animationDelay: refSections[3] + 'ms' }">
                            <div class="uppercase text-xs font-semibold text-gray-400 mb-2">Your Referral Code</div>
                            <div class="flex items-center justify-between bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-5 py-4 mb-4">
                                <span class="font-mono text-xl font-bold tracking-widest text-gray-900 dark:text-white">{{ referralStore.referralCode }}</span>
                                <button type="button" @click="handleCopy(referralStore.referralCode, 'code')" :class="['flex items-center gap-2 text-[#9E4CFF] font-semibold transition-all', copyPulse ? 'ring-2 ring-purple-400 ring-offset-2 animate-ping' : '']">
                                    <component :is="copyState ? Check : Copy" class="w-5 h-5" />
                                    <span v-if="copyState">Copied</span>
                                    <span v-else>Copy</span>
                                </button>
                            </div>
                            <div class="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 mt-4">
                                <Share2 class="w-5 h-5 text-gray-400" />
                                <span class="font-mono text-sm text-gray-900 dark:text-white truncate">{{ shareUrl }}</span>
                                <button type="button" @click="handleCopy(shareUrl, 'share')" :class="['flex items-center gap-2 text-[#9E4CFF] font-semibold transition-all', copySharePulse ? 'ring-2 ring-purple-400 ring-offset-2 animate-ping' : '']">
                                    <component :is="copyShareState ? Check : Copy" class="w-5 h-5" />
                                    <span v-if="copyShareState">Copied</span>
                                    <span v-else>Copy</span>
                                </button>
                            </div>
                        </div>

                        <div ref="milestoneRef" class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm mb-6 transition-all duration-500 ease-out opacity-0 translate-y-6" :class="sectionVisible[3] ? 'opacity-100 translate-y-0' : ''" :style="{ animationDelay: refSections[4] + 'ms' }">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <Trophy class="w-5 h-5 text-[#9E4CFF]" />
                                    <span class="font-semibold text-gray-800 dark:text-gray-100">Milestone Progress</span>
                                </div>
                                <span class="text-xs text-gray-500">{{ referralStore.milestoneProgress }} of {{ referralStore.economy.milestoneEvery }} paid referrals</span>
                            </div>
                            <div class="h-2 w-full rounded-full bg-gray-100 dark:bg-slate-700 mb-3 relative">
                                <div class="bg-[#9E4CFF] h-2 rounded-full transition-all duration-700" :style="{ width: Math.min(100, (referralStore.milestoneProgress / referralStore.economy.milestoneEvery) * 100) + '%' }" />
                                <template v-for="(dot, i) in milestoneDots" :key="i">
                                    <div :style="{ left: dot + '%' }" class="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900" :class="referralStore.milestoneProgress > i ? 'bg-[#9E4CFF]' : 'bg-gray-300 dark:bg-slate-700'" />
                                </template>
                            </div>
                            <div v-if="referralStore.milestoneBonusEarned" class="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 mt-2">
                                <Check class="w-4 h-4" /> Milestone unlocked. One free billing cycle earned.
                            </div>
                            <div v-else class="text-xs text-gray-400 mt-2">Reach {{ referralStore.economy.milestoneEvery }} concurrent paid referrals to unlock one free billing cycle.</div>
                        </div>

                        <div>
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Redeem Your XPT</h2>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 ref-enter" :style="{ animationDelay: refSections[5] + 'ms' }">
                                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
                                    <div class="flex items-center gap-2 mb-2">
                                        <div class="bg-purple-50 dark:bg-purple-500/10 rounded-lg p-2"><Tag class="w-5 h-5 text-[#9E4CFF]" /></div>
                                        <span class="font-semibold text-gray-800 dark:text-gray-100">Subscription Discount</span>
                                    </div>
                                    <div class="text-gray-500 dark:text-gray-400 text-sm mb-2">Generate a {{ referralStore.economy.discountPercent }} percent discount code for your next payment. Stacks with other discounts up to 25 percent total.</div>
                                    <div class="flex text-gray-500 dark:text-gray-400 items-center gap-2 mb-2">
                                        <UBadge
                                          class="text-purple"
                                         color="purple">{{ referralStore.economy.discountCostXpt }} XPT</UBadge>
                                        <span v-if="referralStore.xptBalance >= referralStore.economy.discountCostXpt" class="text-green-500 text-xs">Available</span>
                                        <span v-else class="text-gray-400 text-xs">Not enough XPT</span>
                                    </div>
                                    <div v-if="referralStore.generatedDiscountCode" class="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 mt-2">
                                        <span class="font-mono text-sm font-bold text-gray-900 dark:text-white">{{ referralStore.generatedDiscountCode }}</span>
                                        <button @click="handleCopy(referralStore.generatedDiscountCode, 'code')" class="flex items-center gap-2 text-[#9E4CFF] font-semibold">
                                            <component :is="copyState ? Check : Copy" class="w-5 h-5" />
                                            <span v-if="copyState">Copied</span>
                                            <span v-else>Copy</span>
                                        </button>
                                    </div>
                                         <template v-else>
                                        <UButton :disabled="referralStore.xptBalance < referralStore.economy.discountCostXpt" color="primary" class="mt-2 text-gray-500 dark:text-gray-400 " @click="async () => {
                                            const result = await referralStore.redeemSubscriptionDiscount();
                                            showToast(result.message, result.success)
                                        }">
                                            Generate Discount Code
                                        </UButton>
                                    </template>
                                </div>
                                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
                                    <div class="flex items-center gap-2 mb-2">
                                        <div class="bg-yellow-50 dark:bg-yellow-500/10 rounded-lg p-2"><Landmark class="w-5 h-5 text-yellow-500" /></div>
                                        <span class="font-semibold text-gray-800 dark:text-gray-100">Cash Withdrawal</span>
                                    </div>
                                    <div class="text-gray-500 dark:text-gray-400 text-sm mb-2">Reach {{ referralStore.economy.withdrawalMinXpt }} XPT and withdraw real money. Each token is worth ₦{{ referralStore.economy.nairaPerXpt }}. Minimum withdrawal is ₦{{ (referralStore.economy.withdrawalMinXpt * referralStore.economy.nairaPerXpt).toLocaleString('en-NG') }} at {{ referralStore.economy.withdrawalMinXpt }} XPT.</div>
                                    <div class="text-[#9E4CFF] text-xs font-semibold mb-2">Your balance is worth ₦{{ referralStore.withdrawableNaira.toLocaleString('en-NG') }}</div>
                                    <div v-if="referralStore.pendingWithdrawal" class="bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-lg px-4 py-2 text-xs font-semibold flex items-center gap-2 mb-2">
                                        <Info class="w-4 h-4" /> Withdrawal pending review
                                    </div>
                                    <UButton v-if="referralStore.canWithdraw && !referralStore.pendingWithdrawal" color="primary" class="mt-2 " @click="() => withdrawModalOpen = true">
                                        Request Withdrawal
                                    </UButton>
                                    <UButton v-else :disabled="true" class="text-gray-500 dark:text-gray-400  mt-2">{{ referralStore.canWithdraw ? 'Pending Review' : referralStore.xptToWithdrawal + ' more XPT needed' }}</UButton>
                                </div>
                                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
                                    <div class="flex items-center text-gray-800 dark:text-gray-100 gap-2 mb-2">
                                        <div class="bg-green-50 dark:bg-green-500/10 rounded-lg p-2"><Gift class="w-5 h-5 text-green-600 dark:text-green-400" /></div>
                                        <span class="font-semibold text-gray-800 dark:text-gray-100 ">Free Referral Perks</span>
                                    </div>
                                    <div class="text-gray-500 dark:text-gray-400 text-sm mb-2">Active when any referred user has an account, even on the free plan.</div>
                                    <div v-if="referralStore.freePerkActive" class="flex flex-wrap gap-2 mt-2">
                                        <span class="flex items-center gap-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-semibold animate-pulse"><span class="w-2 h-2 bg-green-400 rounded-full"></span>+5 Daily Messages</span>
                                        <span class="flex items-center gap-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-semibold animate-pulse"><span class="w-2 h-2 bg-green-400 rounded-full"></span>+1 Team Seat</span>
                                        <span class="flex items-center gap-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-semibold animate-pulse"><span class="w-2 h-2 bg-green-400 rounded-full"></span>+1 Weekly Upload</span>
                                    </div>
                                    <div v-else class="flex flex-wrap gap-2 mt-2">
                                        <span class="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 text-gray-400 rounded-full px-3 py-1 text-xs font-semibold">Refer someone to unlock</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Transition name="modal">
                            <div v-if="withdrawModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4">
                                <div class="absolute inset-0" @click="withdrawModalOpen = false; resetWithdrawalForm()"></div>
                                <div class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-gray-200 dark:border-slate-700">
                                    <button type="button" @click="withdrawModalOpen = false; resetWithdrawalForm()" class="absolute right-4 top-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                        <X class="w-5 h-5" />
                                    </button>
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Withdrawal Request</h3>
                                    <div class="mb-4 text-yellow-700 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg px-4 py-2 text-xs">Bank details must match your account name. Processing takes 3 to 5 business days.</div>
                                    <div class="mb-3">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (XPT)</label>
                                        <input v-model.number="withdrawalAmount" type="number" :min="referralStore.economy.withdrawalMinXpt" :max="referralStore.xptBalance" step="1" class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-gray-300 text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Min {{ referralStore.economy.withdrawalMinXpt }} XPT · Max {{ referralStore.xptBalance }} XPT ·
                                            <span class="text-[#9E4CFF] font-semibold">₦{{ (Number(withdrawalAmount || 0) * referralStore.economy.nairaPerXpt).toLocaleString('en-NG') }}</span>
                                        </div>
                                        <div v-if="bankErrors.amount" class="text-xs text-red-500 mt-1">{{ bankErrors.amount }}</div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Name</label>
                                        <input v-model="bankDetails.accountName" type="text" class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-gray-300 text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                                        <div v-if="bankErrors.accountName" class="text-xs text-red-500 mt-1">{{ bankErrors.accountName }}</div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
                                        <input v-model="bankDetails.accountNumber" type="text" maxlength="10" inputmode="numeric" class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-gray-300 text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                                        <div v-if="bankErrors.accountNumber" class="text-xs text-red-500 mt-1">{{ bankErrors.accountNumber }}</div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
                                        <input v-model="bankDetails.bankName" type="text" class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-gray-300 text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                                        <div v-if="bankErrors.bankName" class="text-xs text-red-500 mt-1">{{ bankErrors.bankName }}</div>
                                    </div>
                                    <div class="flex justify-end gap-2 mt-6">
                                        <button type="button" @click="withdrawModalOpen = false; resetWithdrawalForm()" class="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                                        <button type="button" @click="handleWithdrawal" class="px-4 py-2 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-lg transition-colors">Submit Request</button>
                                    </div>
                                </div>
                            </div>
                        </Transition>

                        <div ref="referralHistoryRef" class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-800 mt-8 transition-all duration-500 ease-out opacity-0 translate-y-6" :class="sectionVisible[4] ? 'opacity-100 translate-y-0' : ''" :style="{ animationDelay: refSections[4] + 'ms' }">
                            <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
                                <thead>
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Plan</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Discount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="r in [...referralStore.referrals].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))" :key="r.id" class="bg-white dark:bg-slate-900">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ r.name }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ r.email }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ new Date(r.joinedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold" :class="r.converted ? 'text-[#9E4CFF]' : 'text-gray-500'">{{ r.plan }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span v-if="r.converted" class="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-2.5 py-0.5 text-xs font-semibold">Converted</span>
                                            <span v-else class="bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full px-2.5 py-0.5 text-xs font-semibold">Free Tier</span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span v-if="r.converted && !r.discountEarned" class="bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] rounded-full px-2.5 py-0.5 text-xs font-semibold">Pending</span>
                                            <span v-else-if="r.discountEarned" class="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 text-gray-400 rounded-full px-2.5 py-0.5 text-xs font-semibold"><Check class="w-4 h-4" />Applied</span>
                                            <span v-else class="bg-gray-100 dark:bg-slate-700 text-gray-400 rounded-full px-2.5 py-0.5 text-xs font-semibold">Not yet</span>
                                        </td>
                                    </tr>
                                    <tr v-if="referralStore.referrals.length === 0">
                                        <td colspan="6" class="py-12 text-center">
                                            <Gift class="mx-auto w-10 h-10 text-gray-300 mb-2" />
                                            <div class="text-gray-400 mb-2">No referrals yet</div>
                                            <div class="flex items-center gap-2 justify-center">
                                                <span class="font-mono text-sm text-gray-900 dark:text-white">{{ shareUrl }}</span>
                                                <button @click="handleCopy(shareUrl, 'share')" class="flex items-center gap-2 text-[#9E4CFF] font-semibold">
                                                    <component :is="copyShareState ? Check : Copy" class="w-5 h-5" />
                                                    <span v-if="copyShareState">Copied</span>
                                                    <span v-else>Copy</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div v-if="referralStore.withdrawalHistory.length > 0" class="mt-8 ref-enter" :style="{ animationDelay: refSections[1] + 'ms' }">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Withdrawal History</h3>
                            <div class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-800">
                                <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
                                    <thead>
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date Requested</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">XPT Spent</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Naira Value</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Paid On</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="w in referralStore.withdrawalHistory" :key="w.id" class="bg-white dark:bg-slate-900">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ new Date(w.requestedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#9E4CFF]">{{ w.xptAmount }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#9E4CFF]">₦{{ w.nairaAmount.toLocaleString('en-NG') }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ w.paidAt ? new Date(w.paidAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) : '-' }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span v-if="w.status === 'paid'" class="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-2.5 py-0.5 text-xs font-semibold">Paid</span>
                                                <span v-else class="bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full px-2.5 py-0.5 text-xs font-semibold">Pending</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div ref="xptLedgerRef" class="mt-8 transition-all duration-500 ease-out opacity-0 translate-y-6" :class="sectionVisible[5] ? 'opacity-100 translate-y-0' : ''" :style="{ animationDelay: refSections[5] + 'ms' }">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">XPT Activity Log</h3>
                            <div class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-800">
                                <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
                                    <thead>
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Activity</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Balance After</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="e in xptHistoryWithBalance" :key="e.transaction_id" class="bg-white dark:bg-slate-900">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ new Date(e.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ e.reason }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold" :class="e.amount > 0 ? 'text-[#9E4CFF]' : 'text-red-400'">{{ e.amount > 0 ? '+' : '' }}{{ e.amount }} XPT</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ e.balanceAfter }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 mt-8 ref-enter" :style="{ animationDelay: refSections[3] + 'ms' }">
                            <div class="flex items-center gap-2 mb-2">
                                <Info class="w-5 h-5 text-[#9E4CFF]" />
                                <span class="font-semibold">How Rewards Work</span>
                            </div>
                            <div class="text-gray-500 dark:text-gray-400 text-sm space-y-2">
                                <p>Free referral perks: Refer any user (even on free plan) to unlock bonus daily messages, extra team seat, and weekly upload.</p>
                                <p>Paid referral discounts: When your referral upgrades, you earn XPT tokens and {{ referralStore.economy.discountPercent }}% discounts for both of you.</p>
                                <p>Milestone bonus: Reach {{ referralStore.economy.milestoneEvery }} concurrent paid referrals to unlock a one-time {{ referralStore.economy.milestoneBonusXpt }} XPT bonus and a free billing cycle.</p>
                                <p>Withdrawals: Each XPT is worth ₦{{ referralStore.economy.nairaPerXpt }}. Minimum withdrawal is {{ referralStore.economy.withdrawalMinXpt }} XPT (₦{{ (referralStore.economy.withdrawalMinXpt * referralStore.economy.nairaPerXpt).toLocaleString('en-NG') }}).</p>
                            </div>
                        </div>

                        <Transition name="toast">
                            <div v-if="toastVisible"
                                class="fixed bottom-6 right-6 z-50 max-w-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-5 py-4 shadow-xl"
                                role="alert" aria-live="polite">
                                <div class="flex items-start gap-3">
                                    <component :is="toastSuccess ? Check : Info" class="w-5 h-5 shrink-0 mt-0.5"
                                        :class="toastSuccess ? 'text-green-500' : 'text-red-400'" />
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ toastMessage }}</p>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>

                <div v-show="activeTab === 'billing'">
                    <BillingHistory />
                </div>
            </div>
        </div>

        <!-- MODALS -->
        <ChangePlanModal v-if="showChangePlanModal && subscriptionStore.currentPlan"
            :current-plan-id="subscriptionStore.currentPlan.id" @close="showChangePlanModal = false"
            @updated="handlePlanUpdated" />

        <CancelSubscriptionModal v-if="showCancelModal" @close="showCancelModal = false"
            @canceled="handleSubscriptionCanceled" />

        <!-- Success Toast -->
        <div v-if="successMessage"
            class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-fade-in">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>{{ successMessage }}</span>
            <button @click="successMessage = ''" class="hover:text-green-100">×</button>
        </div>

        <!-- Error Toast -->
        <div v-if="errorMessage"
            class="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-fade-in">
            <span>{{ errorMessage }}</span>
            <button @click="errorMessage = ''" class="hover:text-red-100">×</button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'
import { useUserStore } from '~/stores/userStore'
import { useBusinessStore } from '~/stores/businessStore'
import { useSubscriptionStore } from '~/stores/subscriptionStore'
import { useReferralStore } from '~/stores/referralStore'
import { Gift, Copy, Check, Share2, Users, Tag, Zap, BookOpen, Trophy, Info, Landmark, X } from 'lucide-vue-next'
import PendingTransactions from '~/components/payments/PendingTransactions.vue'
import ChangePlanModal from '~/components/settings/ChangePlanModal.vue'
import CancelSubscriptionModal from '~/components/settings/CancelSubscriptionModal.vue'
import BillingHistory from '~/components/payments/BillingHistory.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const { industries } = useIndustryOptions()
const route = useRoute()
const authStore = useAuthStore()
const userStore = useUserStore()
const businessStore = useBusinessStore()
const subscriptionStore = useSubscriptionStore()
const referralStore = useReferralStore()

const activeTab = ref(route.query.tab || 'profile')
const successMessage = ref('')
const errorMessage = ref('')
const avatarPreview = ref(null)
const uploadingAvatar = ref(false)
const avatarTimestamp = ref(Date.now()) // For cache busting

const tabs = [
    { id: 'profile', name: 'User Settings' },
    { id: 'business', name: 'Business Settings' },
    { id: 'subscription', name: 'Subscription' },
    { id: 'billing', name: 'Billing History' },
    { id: 'referrals', name: 'Referrals & Rewards' }
]

const showChangePlanModal = ref(false)
const showCancelModal = ref(false)

const toastVisible = ref(false)
const toastMessage = ref('')
const toastSuccess = ref(true)
const withdrawModalOpen = ref(false)
const bankDetails = reactive({ accountName: '', accountNumber: '', bankName: '' })
const bankErrors = reactive({ accountName: '', accountNumber: '', bankName: '', amount: '' })
const withdrawalAmount = ref(referralStore.economy.withdrawalMinXpt)
const copyState = ref(false)
const copyShareState = ref(false)
const copyPulse = ref(false)
const copySharePulse = ref(false)
const showConfetti = ref(false)
const confettiPieces = ref([])
const confettiColors = ['bg-purple-400','bg-amber-400','bg-pink-400','bg-green-400','bg-blue-400']
const sectionVisible = reactive([false, false, false, false, false, false])
const statsCount = reactive({ referrals: 0, paidReferrals: 0, discounts: 0 })
const statsAnimated = ref(false)
const xptWalletRef = ref(null)
const statsRowRef = ref(null)
const referralCodeRef = ref(null)
const milestoneRef = ref(null)
const referralHistoryRef = ref(null)
const xptLedgerRef = ref(null)
const milestoneDots = [33, 66, 100]
const refSections = [0, 80, 160, 240, 320, 400]

// Forms
const profileForm = ref({ name: '' })
const emailChangeForm = ref({ new_email: '', password: '', verification_code: '' })
const passwordForm = ref({ current_password: '', password: '', password_confirmation: '' })
const businessForm = ref({})

const showEmailChangeForm = ref(false)
const emailChangeRequest = ref(null)
const emailChangeLoading = ref(false)

const isSocialOnly = computed(() => !authStore.user?.password)
const hasPassword = computed(() => authStore.user?.password !== null)

// Mock RBAC
const canManageBilling = computed(() => true)

const calculateUsagePercentage = () => {
    if (!subscriptionStore.currentPlan?.limits?.conversations) return 5
    const limits = subscriptionStore.currentPlan.limits.conversations
    if (limits.total === 999999 || limits.total === -1) return 5
    if (limits.total === 0) return 0
    return Math.min(100, (limits.used / limits.total) * 100)
}

function triggerConfetti() {
    confettiPieces.value = Array.from({ length: 12 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.floor(Math.random() * 200)
    }))
    showConfetti.value = true
    setTimeout(() => {
        showConfetti.value = false
        confettiPieces.value = []
    }, 900)
}

function animateCounter(key, endValue, duration = 600) {
    if (!Number.isFinite(endValue) || endValue <= 0) {
        statsCount[key] = endValue || 0
        return
    }
    const steps = Math.max(1, Math.ceil(duration / 20))
    let current = 0
    const increment = endValue / steps
    const interval = setInterval(() => {
        current += increment
        if (current >= endValue) {
            statsCount[key] = endValue
            clearInterval(interval)
        } else {
            statsCount[key] = Math.floor(current)
        }
    }, 20)
}

function triggerStatsCount() {
    if (statsAnimated.value) return
    statsAnimated.value = true
    animateCounter('referrals', Number(referralStore.totalReferrals) || 0)
    animateCounter('paidReferrals', Number(referralStore.totalPaidReferrals) || 0)
    animateCounter('discounts', referralStore.generatedDiscountCode ? 1 : 0)
}

function useFadeInOnScroll(refs) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = Number(entry.target.dataset.fadeIndex || '-1')
                if (index >= 0) {
                    sectionVisible[index] = true
                    if (index === 1) triggerStatsCount()
                    observer.unobserve(entry.target)
                }
            }
        })
    }, { threshold: 0.25 })

    refs.forEach((section, index) => {
        if (section.value) {
            section.value.dataset.fadeIndex = String(index)
            observer.observe(section.value)
        }
    })
}

function showToast(message, success = true) {
    toastMessage.value = message
    toastSuccess.value = success
    toastVisible.value = true
    if (success) triggerConfetti()
    setTimeout(() => { toastVisible.value = false }, 4000)
}

function handleCopy(code, type = 'code') {
    navigator.clipboard.writeText(code)
    if (type === 'code') {
        copyState.value = true
        copyPulse.value = true
        setTimeout(() => {
            copyState.value = false
            copyPulse.value = false
        }, 400)
    } else {
        copyShareState.value = true
        copySharePulse.value = true
        setTimeout(() => {
            copyShareState.value = false
            copySharePulse.value = false
        }, 400)
    }
}

async function handleWithdrawal() {
    bankErrors.accountName = ''
    bankErrors.accountNumber = ''
    bankErrors.bankName = ''
    bankErrors.amount = ''
    let valid = true
    const min = referralStore.economy.withdrawalMinXpt
    const max = referralStore.xptBalance
    const amount = Number(withdrawalAmount.value)
    if (!Number.isFinite(amount) || amount < min) {
        bankErrors.amount = `Minimum withdrawal is ${min} XPT`
        valid = false
    } else if (amount > max) {
        bankErrors.amount = `You only have ${max} XPT available`
        valid = false
    }
    if (!bankDetails.accountName.trim()) { bankErrors.accountName = 'Account name is required'; valid = false }
    if (!/^\d{10}$/.test(bankDetails.accountNumber)) { bankErrors.accountNumber = 'Enter a valid 10-digit account number'; valid = false }
    if (!bankDetails.bankName.trim()) { bankErrors.bankName = 'Bank name is required'; valid = false }
    if (!valid) return
    const result = await referralStore.requestWithdrawal({ ...bankDetails }, amount)
    withdrawModalOpen.value = false
    showToast(result.message, result.success)
}

function resetWithdrawalForm() {
    Object.assign(bankDetails, { accountName: '', accountNumber: '', bankName: '' })
    Object.assign(bankErrors, { accountName: '', accountNumber: '', bankName: '', amount: '' })
    withdrawalAmount.value = referralStore.economy.withdrawalMinXpt
}

const xptHistoryWithBalance = computed(() => {
    const sorted = [...referralStore.xptHistory].sort((a, b) => new Date(a.date) - new Date(b.date))
    let running = 0
    return sorted.map(e => { running += e.amount; return { ...e, balanceAfter: running } }).reverse()
})

const shareUrl = computed(() =>
    referralStore.shareUrl ||
    (referralStore.referralCode ? `https://xeliai.com/register?ref=${referralStore.referralCode}` : '')
)

const initializeForms = async () => {
    profileForm.value = { name: authStore.user?.name || '' }
    await checkEmailChangeStatus()
    await businessStore.fetchBusiness()
    if (businessStore.business) {
        businessForm.value = { ...businessStore.business }
    }
}


const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // 1. Validation
    if (file.size > 2 * 1024 * 1024) {
        errorMessage.value = 'File size too large. Max 2MB.'
        return
    }

    uploadingAvatar.value = true
    errorMessage.value = ''

    try {
        // 2. Convert to Base64
        const reader = new FileReader()
        reader.readAsDataURL(file)
        
        reader.onload = async () => {
            const base64Image = reader.result
            
            // 3. Preview locally immediately
            avatarPreview.value = base64Image
            
            // 4. Update Pinia Store (which updates Sidebar)
            authStore.updateLocalAvatar(base64Image)
            
            // 5. Force UI refresh
            avatarTimestamp.value = Date.now()
            
            successMessage.value = 'Profile picture saved locally!'
            uploadingAvatar.value = false
        }
    } catch (error) {
        errorMessage.value = 'Failed to process image'
        uploadingAvatar.value = false
    } finally {
        event.target.value = '' // Reset input
    }
}

const updateProfile = async () => {
    try {
        const result = await userStore.updateProfile(profileForm.value)
        if (result.success) {
            successMessage.value = 'Profile updated successfully!'
            setTimeout(() => { successMessage.value = '' }, 3000)
        } else {
            errorMessage.value = result.message
            setTimeout(() => { errorMessage.value = '' }, 3000)
        }
    } catch (error) {
        errorMessage.value = 'Failed to update profile'
        setTimeout(() => { errorMessage.value = '' }, 3000)
    }
}

const updatePassword = async () => {
    if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
        errorMessage.value = 'Passwords do not match'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
    }

    try {
        const result = await userStore.updatePassword(passwordForm.value)
        if (result.success) {
            successMessage.value = 'Password updated successfully!'
            resetPasswordForm()
            setTimeout(() => { successMessage.value = '' }, 3000)
        } else {
            errorMessage.value = result.message
            setTimeout(() => { errorMessage.value = '' }, 3000)
        }
    } catch (error) {
        errorMessage.value = 'Failed to update password'
        setTimeout(() => { errorMessage.value = '' }, 3000)
    }
}

const resetProfileForm = () => {
    profileForm.value = { name: authStore.user?.name || '' }
}

const resetPasswordForm = () => {
    passwordForm.value = { current_password: '', password: '', password_confirmation: '' }
}

const checkEmailChangeStatus = async () => {
    try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.apiBase}/api/email-change/status`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })

        if (response.success && response.data.has_pending_request && !response.data.is_expired) {
            emailChangeRequest.value = response.data
        }
    } catch (error) {
        console.error('Failed to check email change status:', error)
    }
}

const requestEmailChange = async () => {
    emailChangeLoading.value = true
    errorMessage.value = ''

    try {
        const config = useRuntimeConfig()
        const body = {
            new_email: emailChangeForm.value.new_email
        }

        if (!isSocialOnly.value) {
            body.password = emailChangeForm.value.password
        } else {
            body.is_social = true
        }

        const response = await $fetch(`${config.public.apiBase}/api/email-change/request`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body
        })

        if (response.success) {
            emailChangeRequest.value = response.data
            showEmailChangeForm.value = false
            successMessage.value = 'Verification code sent to your current email!'
            setTimeout(() => { successMessage.value = '' }, 5000)
        }
    } catch (error) {
        errorMessage.value = error.data?.message || 'Failed to send verification code'
        setTimeout(() => { errorMessage.value = '' }, 5000)
    } finally {
        emailChangeLoading.value = false
    }
}

const verifyEmailChange = async () => {
    emailChangeLoading.value = true
    errorMessage.value = ''

    try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.apiBase}/api/email-change/verify`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: {
                verification_code: emailChangeForm.value.verification_code
            }
        })

        if (response.success) {
            authStore.user.email = response.data.new_email
            emailChangeRequest.value = null
            emailChangeForm.value = { new_email: '', password: '', verification_code: '' }
            successMessage.value = 'Email changed successfully!'
            setTimeout(() => { successMessage.value = '' }, 5000)
        }
    } catch (error) {
        if (error.data?.expired) {
            emailChangeRequest.value = null
            errorMessage.value = 'Verification code expired. Please request a new one.'
        } else {
            errorMessage.value = error.data?.message || 'Failed to verify code'
        }
        setTimeout(() => { errorMessage.value = '' }, 5000)
    } finally {
        emailChangeLoading.value = false
    }
}

const cancelEmailChange = async () => {
    try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/api/email-change/cancel`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` }
        })

        emailChangeRequest.value = null
        emailChangeForm.value = { new_email: '', password: '', verification_code: '' }
        successMessage.value = 'Email change request cancelled'
        setTimeout(() => { successMessage.value = '' }, 3000)
    } catch (error) {
        errorMessage.value = 'Failed to cancel request'
        setTimeout(() => { errorMessage.value = '' }, 3000)
    }
}

const updateBusiness = async () => {
    if (!businessStore.business?.id) {
        errorMessage.value = 'No business found'
        return
    }

    try {
        const result = await businessStore.updateBusiness(businessStore.business.id, businessForm.value)
        if (result.success) {
            successMessage.value = 'Business settings updated successfully!'
            setTimeout(() => { successMessage.value = '' }, 3000)
        } else {
            errorMessage.value = result.message
            setTimeout(() => { errorMessage.value = '' }, 3000)
        }
    } catch (error) {
        errorMessage.value = 'Failed to update business settings'
        setTimeout(() => { errorMessage.value = '' }, 3000)
    }
}

const resetBusinessForm = () => {
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

// Fetch the referral dashboard once when the referrals tab is the active one,
// or lazily on first switch into it. Avoids paying the round-trip for users
// who only visit the profile / business / subscription / billing tabs.
async function ensureReferralDataLoaded() {
    if (referralStore.lastFetchedAt) return
    if (!authStore.isLoggedIn || !authStore.token) return
    await referralStore.fetchDashboard()
}

watch(activeTab, async (next) => {
    if (next === 'referrals') {
        await ensureReferralDataLoaded()
    }
})

onMounted(async () => {
    await initializeForms()
    await subscriptionStore.fetchSubscription()
    if (activeTab.value === 'referrals') {
        await ensureReferralDataLoaded()
    }
    useFadeInOnScroll([xptWalletRef, statsRowRef, referralCodeRef, milestoneRef, referralHistoryRef, xptLedgerRef])
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

/* Custom Scrollbar for Tabs Container */
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.modal-enter-active, .modal-leave-active {
    transition: all 0.25s ease;
}
.modal-enter-from, .modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

@keyframes floatBubble {
    0%, 100% {
        transform: translateY(0px) scale(1);
    }
    50% {
        transform: translateY(-8px) scale(1.04);
    }
}
.bubble-float {
    animation: floatBubble 4s ease-in-out infinite;
}
.bubble-float-slow {
    animation: floatBubble 6s ease-in-out infinite;
}
.bubble-float-slower {
    animation: floatBubble 8s ease-in-out infinite;
}

@keyframes confettiFall {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(80px) rotate(360deg);
        opacity: 0;
    }
}
.confetti-piece {
    width: 8px;
    height: 8px;
    animation: confettiFall 0.8s ease-out forwards;
}
</style>