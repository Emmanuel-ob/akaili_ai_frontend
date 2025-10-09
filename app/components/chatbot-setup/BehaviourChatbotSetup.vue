<script setup>
import { inject, ref } from 'vue'
import ToggleSwitch from '~/components/chatbot-setup/ToggleSwitch.vue'

// Inject form data from parent
const formData = inject('formData')

// Authentication testing
const testingAuth = ref(false)
const authTestResult = ref(null)

const testAuthEndpoint = async () => {
    if (!formData.auth_endpoint) return

    testingAuth.value = true
    authTestResult.value = null

    try {
        const testPayload = {
            customer_data: {
                email: 'test@example.com',
                name: 'Test User',
                id: '12345'
            },
            widget_token: 'test_token_validation'
        }

        // Try to reach the endpoint
        const url = formData.auth_endpoint.startsWith('http')
            ? formData.auth_endpoint
            : `${window.location.origin}${formData.auth_endpoint}`

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testPayload)
        })

        if (response.ok) {
            const data = await response.json()
            authTestResult.value = {
                success: true,
                message: `✓ Endpoint reachable. Response: ${JSON.stringify(data)}`
            }
        } else {
            authTestResult.value = {
                success: false,
                message: `✗ Endpoint returned ${response.status}: ${response.statusText}`
            }
        }
    } catch (error) {
        authTestResult.value = {
            success: false,
            message: `✗ Cannot reach endpoint: ${error.message}`
        }
    } finally {
        testingAuth.value = false
    }
}
</script>

<template>
    <div class="space-y-6">
        <!-- Basic Behavior Settings -->
        <div class="block border px-4 py-6 border-gray-200 rounded-2xl">
            <div>
                <h2 class="text-xl lg:text-2xl font-bold">Behavior Settings</h2>
                <p class="text-gray-500 mt-1 mb-4">Configure how your chatbot responds and behaves</p>
            </div>

            <section
                class="input-card grid grid-cols-1 lg:grid-cols-2 gap-6 border px-4 py-6 border-gray-200 rounded-2xl">
                <!-- Left Card -->
                <div>
                    <label class="block text-base font-semibold mt-4">Fallback Message</label>
                    <textarea v-model="formData.fallback_message" rows="4"
                        placeholder="I'm sorry, I didn't understand that. Could you please rephrase?"
                        class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300" />

                    <label class="block text-base font-semibold mt-4">Max Conversation Length</label>
                    <select v-model="formData.max_conversation_length"
                        class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300">
                        <option :value="10">10 messages</option>
                        <option :value="50">50 messages</option>
                        <option :value="100">100 messages</option>
                        <option :value="200">200 messages</option>
                    </select>
                </div>

                <!-- Right Card -->
                <div>
                    <div class="mt-6 flex items-center justify-between">
                        <div>
                            <label class="block text-base font-semibold mt-4">Enable Typing Indicator</label>
                            <p class="text-gray-500">Show typing animation while processing</p>
                        </div>
                        <ToggleSwitch v-model="formData.enable_typing_indicator" />
                    </div>

                    <div class="mt-6 flex items-center justify-between">
                        <div>
                            <label class="block text-base font-semibold mt-4">Collect User Feedback</label>
                            <p class="text-gray-500">Ask for ratings after conversations</p>
                        </div>
                        <ToggleSwitch v-model="formData.collect_user_feedback" />
                    </div>

                    <div class="mt-6 flex items-center justify-between">
                        <div>
                            <label class="block text-base font-semibold mt-4">Handoff to Human</label>
                            <p class="text-gray-500">Allow escalation to human agents</p>
                        </div>
                        <ToggleSwitch v-model="formData.handoff_to_human" />
                    </div>
                </div>
            </section>
        </div>

        <!-- Authentication Settings -->
        <div class="block border px-4 py-6 border-gray-200 rounded-2xl">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Authentication Settings</h3>
            <p class="text-gray-600 text-sm mb-6">
                Configure authentication for sensitive queries. When users ask about account information, personal data,
                or other sensitive topics, the widget will verify their identity.
            </p>

            <div class="space-y-6">
                <!-- Enable Authentication Toggle -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label class="block text-base font-semibold text-gray-900">
                            Enable Authentication
                        </label>
                        <p class="text-gray-600 text-sm mt-1">
                            Require user verification for sensitive queries
                        </p>
                    </div>
                    <ToggleSwitch v-model="formData.require_auth" />
                </div>

                <!-- Authentication Configuration -->
                <div v-if="formData.require_auth" class="space-y-4 pl-4 border-l-4 border-gray-200">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Authentication Endpoint URL
                        </label>
                        <input v-model="formData.auth_endpoint" type="text"
                            placeholder="https://yoursite.com/api/widget-auth or /api/widget-auth"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                        <p class="text-xs text-gray-500 mt-1">
                            URL endpoint on your website that the widget will call to verify user identity. Can be
                            absolute (https://...) or relative (/api/...)
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Authentication Timeout (seconds)
                            </label>
                            <input v-model.number="formData.auth_timeout" type="number" min="300" max="7200"
                                placeholder="1800"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                            <p class="text-xs text-gray-500 mt-1">
                                How long authentication lasts (default: 1800 seconds / 30 minutes)
                            </p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Sensitive Keywords
                            </label>
                            <input v-model="formData.sensitive_keywords" type="text"
                                placeholder="account, balance, order, payment, personal, billing"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                            <p class="text-xs text-gray-500 mt-1">
                                Keywords that trigger authentication requirement (comma separated)
                            </p>
                        </div>
                    </div>

                    <!-- Auth Endpoint Testing -->
                    <div v-if="formData.auth_endpoint" class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Test Authentication Endpoint</h4>
                        <p class="text-xs text-gray-600 mb-3">
                            Test if your authentication endpoint is properly configured and reachable.
                        </p>
                        <button @click="testAuthEndpoint" :disabled="testingAuth"
                            class="bg-gray-900 text-white px-4 py-2 text-sm rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ testingAuth ? 'Testing...' : 'Test Endpoint' }}
                        </button>
                        <div v-if="authTestResult" class="mt-3 p-2 rounded text-xs"
                            :class="authTestResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
                            {{ authTestResult.message }}
                        </div>
                    </div>

                    <!-- Implementation Guide -->
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 class="text-sm font-medium text-blue-900 mb-2">Implementation Guide</h4>
                        <div class="text-xs text-blue-800 space-y-1">
                            <p><strong>1.</strong> Create an endpoint on your website (e.g., /api/widget-auth)</p>
                            <p><strong>2.</strong> The endpoint should accept POST requests with customer_data and
                                widget_token</p>
                            <p><strong>3.</strong> Verify the user matches the customer_data (email, ID, etc.)</p>
                            <p><strong>4.</strong> Return JSON: {"success": true, "expires_in": 1800} for valid users
                            </p>
                            <p><strong>5.</strong> See the embed code section for complete implementation examples</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>