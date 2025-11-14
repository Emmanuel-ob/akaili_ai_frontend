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
            <div class="mb-6">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-lg font-medium text-gray-900">Embed Code</h4>
                    <button @click="copyToClipboard(embedCode, 'basic')"
                        class="text-sm text-gray-700 hover:text-gray-900 font-medium border border-gray-300 px-3 py-1.5 hover:border-gray-400 transition-colors rounded">
                        {{ copied.basic ? '✓ Copied!' : 'Copy Code' }}
                    </button>
                </div>
                <CodeBlock :code="embedCode" language="html" />
                <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                    <strong>Installation:</strong> Copy this code and paste it before the closing &lt;/body&gt; tag in
                    your HTML.
                </div>
            </div>

            <!-- Installation Steps -->
            <div class="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 class="text-lg font-medium text-gray-900 mb-3">Installation Steps</h4>
                <ol class="text-gray-700 space-y-2 list-decimal list-inside">
                    <li>Copy the embed code above</li>
                    <li>Open your website's HTML file</li>
                    <li>Paste the code before the closing &lt;/body&gt; tag</li>
                    <li>Save and refresh your website</li>
                    <li>The chat widget will appear in the bottom right corner</li>
                </ol>
            </div>

            <!-- Widget Token Info -->
            <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Widget Token</h4>
                <div class="font-mono text-sm text-gray-600 mb-2 break-all bg-white p-2 rounded border">
                    {{ widgetToken }}
                </div>
                <p class="text-sm text-gray-600">This token identifies your chatbot. Keep it secure and regenerate if
                    compromised.</p>
                <p class="text-xs text-gray-500 mt-1">Generated: {{ tokenGeneratedAt }}</p>
            </div>

            <!-- Performance Notice -->
            <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 class="text-lg font-medium text-green-900 mb-2">✅ Optimized for Performance</h4>
                <p class="text-sm text-green-800">
                    Your widget loads asynchronously and won't block your page rendering.
                    Works on any website or framework.
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
    basic: false
})

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

        if (response.success) {
            widgetToken.value = response.data.widget_token
            embedCode.value = response.data.embed_code
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

        if (response.success) {
            widgetToken.value = response.data.widget_token
            embedCode.value = response.data.embed_code
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

onMounted(() => {
    loadEmbedCode()
})
</script>