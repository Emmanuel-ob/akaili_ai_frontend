<template>
    <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-lg font-medium text-gray-900">Embed Your Chatbot</h3>
                <p class="text-sm text-gray-500">
                    Add this code to any website to enable the chat widget
                </p>
            </div>
            <button @click="generateEmbedCode" :disabled="isGenerating"
                class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50">
                <div v-if="isGenerating" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ isGenerating ? 'Generating...' : 'Generate Embed Code' }}
            </button>
        </div>

        <div v-if="embedCode" class="space-y-4">
            <!-- Widget Preview -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                <div class="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 text-center">
                    <div class="inline-flex items-center space-x-2 text-purple-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.468L3 21l2.532-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                        </svg>
                        <span class="text-sm font-medium">{{ chatbotName }} Chat Widget</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                        Widget will appear as a floating chat bubble on your website
                    </p>
                </div>
            </div>

            <!-- Embed Code -->
            <div>
                <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-medium text-gray-900">Embed Code</h4>
                    <button @click="copyToClipboard"
                        class="inline-flex items-center text-sm text-purple-600 hover:text-purple-700">
                        <template v-if="copied">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                        </template>
                        <template v-else>
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Code
                        </template>
                    </button>
                </div>
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
    <code>{{ embedCode }}</code>
</pre>
            </div>

            <!-- Installation Instructions -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-blue-900 mb-2">Installation Instructions</h4>
                <ol class="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Copy the embed code above</li>
                    <li>Paste it into your website's HTML, preferably before the closing &lt;/body&gt; tag</li>
                    <li>Save and publish your website</li>
                    <li>The chat widget will appear automatically on your site</li>
                </ol>
            </div>

            <!-- Widget Configuration -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-yellow-900 mb-2">Widget Token</h4>
                <p class="text-sm text-yellow-800 mb-2">
                    Your widget token: <code class="bg-yellow-200 px-1 rounded text-xs">{{ widgetToken }}</code>
                </p>
                <p class="text-xs text-yellow-700">
                    Keep this token secure. If compromised, regenerate the embed code to get a new token.
                </p>
            </div>

            <!-- Advanced Configuration -->
            <div class="border-t pt-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Advanced Configuration</h4>
                <div class="text-sm text-gray-600 space-y-2">
                    <div>
                        <strong>Customer Data Integration:</strong>
                        <p class="text-xs mt-1">
                            To pass customer data to the widget, add these attributes to elements on your page:
                        </p>
                        <pre
                            class="bg-gray-100 p-2 rounded text-xs mt-1 overflow-x-auto">{{ customerDataExample }}</pre>
                    </div>
                    <div>
                        <strong>Styling:</strong>
                        <p class="text-xs mt-1">
                            Widget appearance can be customized from the chatbot settings page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

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
const isGenerating = ref(false)
const copied = ref(false)

const customerDataExample = `<div data-user-email="user@example.com"></div>
<div data-user-name="John Doe"></div>
<div data-user-id="12345"></div>`

const generateEmbedCode = async () => {
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

        if (response.success) {
            embedCode.value = response.embed_code
            widgetToken.value = response.widget_token
        }
    } catch (error) {
        console.error('Failed to generate embed code:', error)
        // You could show a toast notification here
        alert('Failed to generate embed code. Please try again.')
    } finally {
        isGenerating.value = false
    }
}

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(embedCode.value)
        copied.value = true
        setTimeout(() => copied.value = false, 2000)
    } catch (error) {
        console.error('Failed to copy:', error)
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = embedCode.value
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        copied.value = true
        setTimeout(() => copied.value = false, 2000)
    }
}
</script>