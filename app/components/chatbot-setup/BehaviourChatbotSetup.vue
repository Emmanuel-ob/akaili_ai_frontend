<!-- components/chatbot-setup/BehaviourChatbotSetup.vue -->
<script setup>
import { inject, ref } from 'vue'
import ToggleSwitch from '~/components/chatbot-setup/ToggleSwitch.vue'

const formData = inject('formData')
const testingAuth = ref(false)
const authTestResult = ref(null)

const testAuthEndpoint = async () => {
    if (!formData.auth_endpoint) return

    testingAuth.value = true
    authTestResult.value = null

    try {
        const testPayload = {
            customer_data: { email: 'test@example.com', name: 'Test User', id: '12345' },
            widget_token: 'test_token_validation'
        }

        const url = formData.auth_endpoint.startsWith('http')
            ? formData.auth_endpoint
            : `${window.location.origin}${formData.auth_endpoint}`

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(testPayload)
        })

        if (response.ok) {
            const data = await response.json()
            authTestResult.value = { success: true, message: `✓ Endpoint reachable. Response: ${JSON.stringify(data)}` }
        } else {
            authTestResult.value = { success: false, message: `✗ Endpoint returned ${response.status}: ${response.statusText}` }
        }
    } catch (error) {
        authTestResult.value = { success: false, message: `✗ Cannot reach endpoint: ${error.message}` }
    } finally {
        testingAuth.value = false
    }
}
</script>

<template>
    <div class="space-y-8">
        
        <!-- Basic Behavior Settings -->
        <div class="block">
            <div class="mb-6">
                <h2 class="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Behavior Settings</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure how your chatbot responds and behaves</p>
            </div>

            <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <!-- Left Column -->
                <div>
                    <label class="block text-sm md:text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">Fallback Message</label>
                    <textarea v-model="formData.fallback_message" rows="4"
                        placeholder="I'm sorry, I didn't understand that. Could you please rephrase?"
                        class="block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm" />

                    <label class="block text-sm md:text-base font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-200">Max Conversation Length</label>
                    <select v-model="formData.max_conversation_length"
                        class="block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm">
                        <option :value="10">10 messages</option>
                        <option :value="50">50 messages</option>
                        <option :value="100">100 messages</option>
                        <option :value="200">200 messages</option>
                    </select>
                </div>

                <!-- Right Column: Toggles -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-white md:bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 md:border-gray-100 dark:border-slate-700">
                        <div>
                            <label class="block text-sm md:text-base font-semibold text-gray-900 dark:text-white">Enable Typing Indicator</label>
                            <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">Show typing animation</p>
                        </div>
                        <ToggleSwitch v-model="formData.enable_typing_indicator" />
                    </div>

                    <div class="flex items-center justify-between p-4 bg-white md:bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 md:border-gray-100 dark:border-slate-700">
                        <div>
                            <label class="block text-sm md:text-base font-semibold text-gray-900 dark:text-white">Collect User Feedback</label>
                            <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">Ask for ratings after chat</p>
                        </div>
                        <ToggleSwitch v-model="formData.collect_user_feedback" />
                    </div>

                    <div class="flex items-center justify-between p-4 bg-white md:bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 md:border-gray-100 dark:border-slate-700">
                        <div>
                            <label class="block text-sm md:text-base font-semibold text-gray-900 dark:text-white">Handoff to Human</label>
                            <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">Allow escalation to agents</p>
                        </div>
                        <ToggleSwitch v-model="formData.handoff_to_human" />
                    </div>
                </div>
            </section>
        </div>

        <!-- Authentication Settings -->
        <div class="block pt-8 border-t border-gray-100 dark:border-slate-800/50">
            <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">Authentication Settings</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Configure authentication for sensitive queries.
            </p>

            <div class="space-y-6">
                <!-- Enable Authentication Toggle -->
                <div class="flex items-center justify-between p-4 bg-white md:bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 md:border-gray-100 dark:border-slate-700">
                    <div>
                        <label class="block text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                            Enable Authentication
                        </label>
                        <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Require user verification
                        </p>
                    </div>
                    <ToggleSwitch v-model="formData.require_auth" />
                </div>

                <!-- Authentication Configuration -->
                <div v-if="formData.require_auth" class="space-y-6 pl-0 md:pl-6 border-l-0 md:border-l-2 border-gray-200 dark:border-slate-700">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Authentication Endpoint URL
                        </label>
                        <input v-model="formData.auth_endpoint" type="text"
                            placeholder="https://yoursite.com/api/widget-auth"
                            class="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            URL endpoint on your website that the widget will call.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Authentication Timeout (seconds)
                            </label>
                            <input v-model.number="formData.auth_timeout" type="number" min="300" max="7200"
                                placeholder="1800"
                                class="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Sensitive Keywords
                            </label>
                            <input v-model="formData.sensitive_keywords" type="text"
                                placeholder="account, balance, billing"
                                class="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                        </div>
                    </div>

                    <!-- Auth Endpoint Testing -->
                    <div v-if="formData.auth_endpoint" class="p-5 bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-700 rounded-xl">
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-3">Test Connection</h4>
                        <button @click="testAuthEndpoint" :disabled="testingAuth"
                            class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 text-sm rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            {{ testingAuth ? 'Testing...' : 'Test Endpoint' }}
                        </button>
                        <div v-if="authTestResult" class="mt-4 p-3 rounded-lg text-xs"
                            :class="authTestResult.success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'">
                            {{ authTestResult.message }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>