<template>
    <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-xl font-semibold text-gray-900">Widget Embed Code</h3>
                    <p class="text-gray-600 mt-1">Integrate your chatbot into any website</p>
                </div>
                <div class="flex gap-2">
                    <button @click="loadEmbedCode" :disabled="isGenerating"
                        class="bg-gray-100 text-gray-700 px-4 py-2 font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded">
                        {{ isGenerating ? 'Loading...' : 'Refresh' }}
                    </button>
                    <button @click="regenerateToken" :disabled="isRegenerating"
                        class="bg-red-600 text-white px-4 py-2 font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded">
                        {{ isRegenerating ? 'Regenerating...' : 'Regenerate Token' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="embedCode" class="p-6">
            <!-- Basic Embed Code Section -->
            <div class="mb-8">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-lg font-medium text-gray-900">Basic Embed Code (Recommended)</h4>
                    <button @click="copyToClipboard(embedCode, 'basic')"
                        class="text-sm text-gray-700 hover:text-gray-900 font-medium border border-gray-300 px-3 py-1.5 hover:border-gray-400 transition-colors rounded">
                        {{ copied.basic ? '✓ Copied!' : 'Copy Code' }}
                    </button>
                </div>
                <CodeBlock :code="embedCode" language="html" />
                <div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                    <strong>Best for:</strong> Most websites. Works on any framework and loads asynchronously.
                </div>
            </div>

            <!-- Implementation Methods -->
            <div class="space-y-8">
                <!-- Method 1: Anonymous Users -->
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="text-lg font-medium text-gray-900">Method 1: Anonymous Users</h4>
                        <button @click="copyToClipboard(embedCode, 'method1')"
                            class="text-sm text-gray-700 hover:text-gray-900 font-medium border border-gray-300 px-3 py-1.5 hover:border-gray-400 transition-colors rounded">
                            {{ copied.method1 ? '✓ Copied!' : 'Copy Code' }}
                        </button>
                    </div>
                    <p class="text-gray-600 mb-4">Basic setup for anonymous users or when you don't need user
                        identification.</p>
                    <CodeBlock :code="embedCode" language="html" />
                </div>

                <!-- Method 2: With User Context -->
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="text-lg font-medium text-gray-900">Method 2: With User Context</h4>
                        <button @click="copyToClipboard(userContextExample, 'method2')"
                            class="text-sm text-gray-700 hover:text-gray-900 font-medium border border-gray-300 px-3 py-1.5 hover:border-gray-400 transition-colors rounded">
                            {{ copied.method2 ? '✓ Copied!' : 'Copy Code' }}
                        </button>
                    </div>
                    <p class="text-gray-600 mb-4">Pass logged-in user information for personalized responses.</p>
                    <CodeBlock :code="userContextExample" language="html" />
                    <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                        <strong>Note:</strong> Replace PHP variables with your framework's equivalent
                        (React: &#123;user.email&#125;, Vue: &#123;&#123; user.email &#125;&#125;, etc.)
                    </div>
                </div>

                <!-- Method 3: With Authentication -->
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="text-lg font-medium text-gray-900">Method 3: With Authentication Endpoint</h4>
                        <button @click="copyToClipboard(authEndpointExample, 'method3')"
                            class="text-sm text-gray-700 hover:text-gray-900 font-medium border border-gray-300 px-3 py-1.5 hover:border-gray-400 transition-colors rounded">
                            {{ copied.method3 ? '✓ Copied!' : 'Copy Code' }}
                        </button>
                    </div>
                    <p class="text-gray-600 mb-4">Enable authentication for sensitive queries. Configure your auth
                        endpoint in chatbot settings.</p>

                    <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                        <strong>Setup Required:</strong> First configure your authentication endpoint URL in the chatbot
                        behavior settings.
                    </div>

                    <h5 class="font-medium text-gray-800 mb-2">1. Widget Code (same as Method 2):</h5>
                    <CodeBlock :code="userContextExample" language="html" class="mb-4" />

                    <h5 class="font-medium text-gray-800 mb-2">2. Create Authentication Endpoint on Your Server:</h5>
                    <CodeBlock :code="authEndpointExample" language="javascript" />

                    <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
                        <strong>How it works:</strong> When users ask sensitive questions, the widget calls your
                        configured auth endpoint to verify the user. Set the endpoint URL in chatbot behavior settings.
                    </div>
                </div>
            </div>

            <!-- Installation Steps -->
            <div class="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 class="text-lg font-medium text-gray-900 mb-3">Installation Steps</h4>
                <ol class="text-gray-700 space-y-2 list-decimal list-inside">
                    <li>Copy the embed code above (Method 1 recommended for most cases)</li>
                    <li>Add the code before the closing &lt;/body&gt; tag in your HTML</li>
                    <li>If using Method 2, replace the PHP variables with your framework's syntax</li>
                    <li>If using Method 3, create the authentication endpoint on your server</li>
                    <li>Test the widget on your website</li>
                </ol>
            </div>

            <!-- Widget Token Info -->
            <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Widget Token</h4>
                <div class="font-mono text-sm text-gray-600 mb-2 break-all bg-white p-2 rounded border">{{ widgetToken
                }}</div>
                <p class="text-sm text-gray-600">This token identifies your chatbot. Keep it secure and regenerate if
                    compromised.</p>
                <p class="text-xs text-gray-500 mt-1">Generated: {{ tokenGeneratedAt }}</p>
            </div>

            <!-- Performance Notice -->
            <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 class="text-lg font-medium text-green-900 mb-2">✅ Optimized for Performance</h4>
                <p class="text-sm text-green-800">Your widget script loads asynchronously and won't block your page
                    rendering. The entire chat functionality is self-contained and works on any website or framework.
                </p>
            </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="isGenerating" class="p-12 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span class="ml-3 text-gray-600">Loading embed code...</span>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <p class="text-lg font-medium text-gray-700 mb-2">No embed code generated yet</p>
            <p class="text-sm text-gray-500">Click "Refresh" to generate your embed code</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CodeBlock from './CodeBlock.vue'

const props = defineProps({
    chatbotId: {
        type: String,
        required: true
    },
    chatbotName: {
        type: String,
        default: 'AI Assistant'
    }
})

const embedCode = ref('')
const widgetToken = ref('')
const tokenGeneratedAt = ref('')
const isGenerating = ref(false)
const isRegenerating = ref(false)
const copied = ref({
    basic: false,
    method1: false,
    method2: false,
    method3: false
})

const userContextExample = ref('')
const authEndpointExample = ref('')

const loadEmbedCode = async () => {
    isGenerating.value = true
    try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        const response = await $fetch(`${config.public.apiBase}/api/chatbots/${props.chatbotId}/embed-code`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })
        console.log('Load response:', response)

        if (response.success) {
            // Access nested data object
            widgetToken.value = response.data.widget_token
            embedCode.value = response.data.embed_code
            userContextExample.value = response.data.examples.with_user_data
            authEndpointExample.value = response.data.examples.auth_endpoint_example
            tokenGeneratedAt.value = new Date().toLocaleString()
        }
    } catch (error) {
        console.error('Failed to load embed code:', error)
    } finally {
        isGenerating.value = false
    }
}

const regenerateToken = async () => {
    if (!confirm('Are you sure you want to regenerate the token? Your old embed code will stop working and you\'ll need to update your website.')) {
        return
    }

    isRegenerating.value = true
    try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        const response = await $fetch(`${config.public.apiBase}/api/chatbots/${props.chatbotId}/regenerate-token`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })

        console.log('Regenerate response:', response)

        if (response.success) {
            // Access nested data object
            widgetToken.value = response.data.widget_token
            embedCode.value = response.data.embed_code
            userContextExample.value = response.data.examples.with_user_data
            authEndpointExample.value = response.data.examples.auth_endpoint_example
            tokenGeneratedAt.value = new Date().toLocaleString()

            alert('Token regenerated successfully! Please update your website with the new embed code.')
        }
    } catch (error) {
        console.error('Failed to regenerate token:', error)
        alert('Failed to regenerate token. Please try again.')
    } finally {
        isRegenerating.value = false
    }
}

const copyToClipboard = async (text, type = 'basic') => {
    try {
        await navigator.clipboard.writeText(text)
        copied.value[type] = true
        setTimeout(() => copied.value[type] = false, 2000)
    } catch (error) {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        copied.value[type] = true
        setTimeout(() => copied.value[type] = false, 2000)
    }
}

// Auto-load on mount
onMounted(() => {
    loadEmbedCode()
});
</script>