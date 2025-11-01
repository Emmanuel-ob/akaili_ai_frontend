<template>
    <div class="min-h-screen pt-[30vh] sm:pt-[40vh] lg:pt-[6rem] bg-white flex items-center justify-center p-6">
        <div class="max-w-md w-full">
            <!-- Logo -->
            <div class="text-center mb-8">
                <NuxtLink class="flex items-center justify-center mb-4 hover:cursor-pointer" to="/">
                    <AppLogo size="md" center />
                </NuxtLink>
                <h2 class="text-2xl font-semibold text-gray-800 mb-2">Reset Password</h2>
                <p class="text-gray-600">Enter your new password below</p>
            </div>

            <!-- Form -->
            <form v-if="!success" class="space-y-4" @submit.prevent="handleSubmit">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input v-model="form.password" type="password" required minlength="8"
                        class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter new password (min. 8 characters)">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input v-model="form.password_confirmation" type="password" required minlength="8"
                        class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Confirm new password">
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full bg-[#7F56D9] text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {{ loading ? 'Resetting...' : 'Reset Password' }}
                </button>
            </form>

            <!-- Success Message -->
            <div v-if="success" class="text-center space-y-4">
                <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">Password Reset Successful!</h3>
                <p class="text-gray-600">You can now login with your new password.</p>
                <NuxtLink to="/login"
                    class="inline-block bg-[#7F56D9] text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                    Go to Login
                </NuxtLink>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {{ error }}
                <div v-if="expired" class="mt-2">
                    <NuxtLink to="/forgot-password" class="font-medium underline">
                        Request a new reset link
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'empty',
    middleware: 'guest'
})

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const form = ref({
    token: route.query.token || '',
    email: route.query.email || '',
    password: '',
    password_confirmation: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
const expired = ref(false)

// Validate query params
onMounted(() => {
    if (!form.value.token || !form.value.email) {
        error.value = 'Invalid reset link. Please request a new one.'
    }
})

const handleSubmit = async () => {
    if (form.value.password !== form.value.password_confirmation) {
        error.value = 'Passwords do not match'
        return
    }

    loading.value = true
    error.value = ''
    expired.value = false

    try {
        const response = await $fetch(`${config.public.apiBase}/api/auth/reset-password`, {
            method: 'POST',
            body: form.value
        })

        if (response.success) {
            success.value = true
        }
    } catch (err) {
        error.value = err.data?.message || 'Failed to reset password. Please try again.'
        expired.value = err.data?.expired || false
    } finally {
        loading.value = false
    }
}
</script>