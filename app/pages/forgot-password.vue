<template>
    <div class="min-h-screen pt-[30vh] sm:pt-[40vh] lg:pt-[6rem] bg-white dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
        <div class="max-w-md w-full">
            <!-- Logo -->
            <div class="text-center mb-8">
                <NuxtLink class="flex items-center justify-center mb-4 hover:cursor-pointer" to="/">
                    <AppLogo size="md" center />
                </NuxtLink>
                <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors">Forgot Password?</h2>
                <p class="text-gray-600 dark:text-gray-400 transition-colors">Enter your email and we'll send you a reset link</p>
            </div>

            <!-- Form -->
            <form v-if="!emailSent" class="space-y-4" @submit.prevent="handleSubmit">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Email</label>
                    <input v-model="email" type="email" required
                        class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors
                        bg-white border-gray-300 text-gray-900 placeholder-gray-400
                        dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-gray-500"
                        placeholder="Enter your email">
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full bg-[#9E4CFF] text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {{ loading ? 'Sending...' : 'Send Reset Link' }}
                </button>
            </form>

            <!-- Success Message -->
            <div v-if="emailSent" class="text-center space-y-4">
                <div class="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center transition-colors">
                    <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <p class="text-gray-600 dark:text-gray-400 transition-colors">
                    If an account exists with that email, you'll receive a password reset link shortly.
                </p>
                <button @click="emailSent = false; email = ''; error = ''"
                    class="text-[#9E4CFF] hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors">
                    Send another link
                </button>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mt-4 p-3 rounded-lg text-sm border transition-colors bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {{ error }}
            </div>

            <!-- Back to Login -->
            <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
                Remember your password?
                <NuxtLink to="/login" class="font-medium text-[#9E4CFF] hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
                    Sign in
                </NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'empty',
    middleware: 'guest'
})

const config = useRuntimeConfig()
const email = ref('')
const loading = ref(false)
const error = ref('')
const emailSent = ref(false)

const handleSubmit = async () => {
    loading.value = true
    error.value = ''

    try {
        const response = await $fetch(`${config.public.apiBase}/api/auth/forgot-password`, {
            method: 'POST',
            body: { email: email.value }
        })

        if (response.success) {
            emailSent.value = true
        }
    } catch (err) {
        error.value = err.data?.message || 'Failed to send reset link. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>