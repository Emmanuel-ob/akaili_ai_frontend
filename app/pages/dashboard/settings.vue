<!-- dashboard/settings.vue -->
<template>
    <div class="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and business settings</p>
        </div>

        <!-- Tabs Container -->
        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
            <div class="border-b border-gray-200 dark:border-slate-800">
                <nav class="flex -mb-px">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                        'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                        activeTab === tab.id
                            ? 'border-[#9E4CFF] text-[#9E4CFF] dark:text-purple-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-700'
                    ]">
                        {{ tab.name }}
                    </button>
                </nav>
            </div>

            <div class="p-6">
                <!-- Profile Tab Content -->
                <div v-show="activeTab === 'profile'" class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Profile Information</h3>
                        <form @submit.prevent="updateProfile" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input v-model="profileForm.name" type="text" required
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                            </div>

                            <div class="flex justify-end gap-2 pt-2">
                                <button type="button" @click="resetProfileForm"
                                    class="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" :disabled="userStore.loading"
                                    class="px-4 py-2 bg-[#9E4CFF] text-white rounded-lg hover:bg-[#6C47B5] disabled:opacity-50 transition-colors">
                                    {{ userStore.loading ? 'Saving...' : 'Save Changes' }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Email Change Section -->
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

                        <!-- Email Change Request Form -->
                        <div v-if="showEmailChangeForm && !emailChangeRequest" class="space-y-4">
                            <form @submit.prevent="requestEmailChange" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Email
                                        Address</label>
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
                                        class="px-4 py-2 bg-[#9E4CFF] text-white rounded-lg hover:bg-[#6C47B5] disabled:opacity-50 transition-colors">
                                        {{ emailChangeLoading ? 'Sending Code...' : 'Send Verification Code' }}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Verification Code Form -->
                        <div v-if="emailChangeRequest" class="space-y-4">
                            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <div class="flex items-start gap-3">
                                    <svg class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clip-rule="evenodd" />
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
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification
                                        Code</label>
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
                                        class="px-4 py-2 bg-[#9E4CFF] text-white rounded-lg hover:bg-[#6C47B5] disabled:opacity-50 transition-colors">
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

                    <div class="border-t border-gray-200 dark:border-slate-800 pt-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Change Password</h3>
                        <form @submit.prevent="updatePassword" class="space-y-4">
                            <div v-if="hasPassword">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                <input v-model="passwordForm.current_password" type="password" required
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
                            </div>

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

                            <div class="flex justify-end gap-2 pt-2">
                                <button type="button" @click="resetPasswordForm"
                                    class="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" :disabled="userStore.loading"
                                    class="px-4 py-2 bg-[#9E4CFF] text-white rounded-lg hover:bg-[#6C47B5] disabled:opacity-50 transition-colors">
                                    {{ userStore.loading ? 'Updating...' : 'Update Password' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Business Tab Content -->
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
                                    <input v-model="businessForm.industry" type="text" required
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors" />
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
                                    class="px-4 py-2 bg-[#9E4CFF] text-white rounded-lg hover:bg-[#6C47B5] disabled:opacity-50 transition-colors">
                                    {{ businessStore.loading ? 'Saving...' : 'Save Changes' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Toast -->
        <div v-if="successMessage"
            class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
            </svg>
            <span>{{ successMessage }}</span>
            <button @click="successMessage = ''" class="text-white hover:text-gray-200">
                ×
            </button>
        </div>

        <!-- Error Toast -->
        <div v-if="errorMessage"
            class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in">
            <span>{{ errorMessage }}</span>
            <button @click="errorMessage = ''" class="text-white hover:text-gray-200">
                ×
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useUserStore } from '~/stores/userStore'
import { useBusinessStore } from '~/stores/businessStore'

definePageMeta({
    layout: 'dashboard'
})

const authStore = useAuthStore()
const userStore = useUserStore()
const businessStore = useBusinessStore()

const activeTab = ref('profile')
const successMessage = ref('')
const errorMessage = ref('')

const tabs = [
    { id: 'profile', name: 'Profile' },
    { id: 'business', name: 'Business Settings' }
]

// Profile form
const profileForm = ref({
    name: ''
})

// Email change form
const emailChangeForm = ref({
    new_email: '',
    password: '',
    verification_code: ''
})

const showEmailChangeForm = ref(false)
const emailChangeRequest = ref(null)
const emailChangeLoading = ref(false)

// Password form
const passwordForm = ref({
    current_password: '',
    password: '',
    password_confirmation: ''
})

// Business form
const businessForm = ref({
    company_name: '',
    industry: '',
    company_size: '',
    website_url: '',
    support_email: '',
    support_phone: '',
    location: '',
    timezone: 'UTC',
    description: ''
})

const emailChanged = computed(() => {
    return false 
})

const isSocialOnly = computed(() => {
    return !authStore.user?.password
})

const hasPassword = computed(() => {
    return authStore.user?.password !== null
})

// Initialize forms
const initializeForms = async () => {
    profileForm.value = {
        name: authStore.user?.name || ''
    }

    await checkEmailChangeStatus()

    await businessStore.fetchBusiness()
    if (businessStore.business) {
        businessForm.value = {
            company_name: businessStore.business.company_name || '',
            industry: businessStore.business.industry || '',
            company_size: businessStore.business.company_size || '',
            website_url: businessStore.business.website_url || '',
            support_email: businessStore.business.support_email || '',
            support_phone: businessStore.business.support_phone || '',
            location: businessStore.business.location || '',
            timezone: businessStore.business.timezone || 'UTC',
            description: businessStore.business.description || ''
        }
    }
}

// Profile actions
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
    profileForm.value = {
        name: authStore.user?.name || ''
    }
}

// Email change actions
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

const resetPasswordForm = () => {
    passwordForm.value = {
        current_password: '',
        password: '',
        password_confirmation: ''
    }
}

// Business actions
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
        businessForm.value = {
            company_name: businessStore.business.company_name || '',
            industry: businessStore.business.industry || '',
            company_size: businessStore.business.company_size || '',
            website_url: businessStore.business.website_url || '',
            support_email: businessStore.business.support_email || '',
            support_phone: businessStore.business.support_phone || '',
            location: businessStore.business.location || '',
            timezone: businessStore.business.timezone || 'UTC',
            description: businessStore.business.description || ''
        }
    }
}

onMounted(() => {
    initializeForms()
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