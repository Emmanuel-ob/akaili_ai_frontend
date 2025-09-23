<template>
    <div class="bg-white border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-xl font-semibold text-gray-900">Widget Embed Code</h3>
                    <p class="text-gray-600 mt-1">Integrate your chatbot into any website</p>
                </div>
                <button @click="generateEmbedCode" :disabled="isGenerating"
                    class="bg-gray-900 text-white px-4 py-2 font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {{ isGenerating ? 'Generating...' : 'Generate Code' }}
                </button>
            </div>
        </div>

        <div v-if="embedCode" class="p-6">
            <!-- Basic Embed Code Section -->
            <div class="mb-8">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-lg font-medium text-gray-900">Basic Embed Code</h4>
                    <button @click="copyToClipboard"
                        class="text-sm text-gray-700 hover:text-gray-900 font-medium border border-gray-300 px-3 py-1 hover:border-gray-400 transition-colors">
                        {{ copied ? 'Copied' : 'Copy' }}
                    </button>
                </div>
                <div class="bg-gray-50 border border-gray-200 p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                    {{ embedCode }}
                </div>
            </div>

            <!-- Implementation Methods -->
            <div class="space-y-8">
                <!-- Method 1: Simple Integration -->
                <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-3">Method 1: Simple Integration</h4>
                    <p class="text-gray-600 mb-4">Basic setup - works for anonymous users and logged-in users alike.</p>
                    <div class="bg-gray-50 border border-gray-200 p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                        {{ simpleExample }}
                    </div>
                </div>

                <!-- Method 2: User Context Integration -->
                <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-3">Method 2: With User Context</h4>
                    <p class="text-gray-600 mb-4">Pass logged-in user information for personalized responses.</p>
                    <div class="bg-gray-50 border border-gray-200 p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                        {{ userContextExample }}
                    </div>
                    <div class="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm">
                        <strong>Note:</strong> Replace the PHP variables with your application's user data or equivalent
                        template variables for other frameworks.
                    </div>
                </div>

                <!-- Method 3: With Authentication -->
                <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-3">Method 3: With Authentication Endpoint</h4>
                    <p class="text-gray-600 mb-4">Enable authentication for sensitive queries. Configure your auth
                        endpoint in chatbot settings.</p>

                    <div class="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm">
                        <strong>Setup Required:</strong> First configure your authentication endpoint URL in the chatbot
                        behavior settings.
                    </div>

                    <h5 class="font-medium text-gray-800 mb-2">1. Widget Code (same as Method 2):</h5>
                    <div
                        class="bg-gray-50 border border-gray-200 p-4 font-mono text-sm text-gray-800 overflow-x-auto mb-4">
                        {{ userContextExample }}
                    </div>

                    <h5 class="font-medium text-gray-800 mb-2">2. Create Authentication Endpoint on Your Server:</h5>
                    <div class="bg-gray-50 border border-gray-200 p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                        {{ authEndpointExample }}
                    </div>

                    <div class="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                        <strong>How it works:</strong> When users ask sensitive questions, the widget calls your
                        configured auth endpoint to verify the user. Set the endpoint URL in chatbot behavior settings.
                    </div>
                </div>
            </div>

            <!-- Installation Steps -->
            <div class="mt-8 p-4 border border-gray-200">
                <h4 class="text-lg font-medium text-gray-900 mb-3">Installation Steps</h4>
                <ol class="text-gray-700 space-y-2">
                    <li><strong>1.</strong> Copy the embed code above</li>
                    <li><strong>2.</strong> Choose your implementation method (Simple, User Context, or With
                        Authentication)</li>
                    <li><strong>3.</strong> Add the code before the closing &lt;/body&gt; tag in your HTML</li>
                    <li><strong>4.</strong> If using Method 3, create the authentication endpoint on your server</li>
                    <li><strong>5.</strong> Test the widget on your website</li>
                </ol>
            </div>

            <!-- Widget Token Info -->
            <div class="mt-6 p-4 bg-gray-50 border border-gray-200">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Widget Token</h4>
                <div class="font-mono text-sm text-gray-600 mb-2">{{ widgetToken }}</div>
                <p class="text-sm text-gray-600">This token identifies your chatbot. Keep it secure and regenerate if
                    compromised.</p>
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

// Example code snippets
const simpleExample = ref('')
const userContextExample = ref('')
const authEndpointExample = ref('')

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
            widgetToken.value = response.widget_token
            const baseUrl = config.public.apiBase

            // Fix: Re-construct the string to avoid the compiler error
            embedCode.value = '<script src="' + baseUrl + '/js/akili-widget.js" data-widget-token="' + response.widget_token + '" data-api-base="' + baseUrl + '" defer></' + 'script>';

            // Generate examples
            simpleExample.value = `<script src="${baseUrl}/js/akili-widget.js" data-widget-token="${response.widget_token}" data-api-base="${baseUrl}" defer></` + `script>`;

            userContextExample.value = `<script src="${baseUrl}/js/akili-widget.js" data-widget-token="${response.widget_token}" data-api-base="${baseUrl}" data-user-email="<?= $user->email ?>" data-user-name="<?= $user->name ?>" data-user-id="<?= $user->id ?>" defer></` + `script>`;

            authEndpointExample.value = `// Example in PHP/Laravel
Route::post('/api/widget-auth', function(Request $request) {
    $user = auth()->user();

    if (!$user) {
        return response()->json(['success' => false], 401);
    }

    // Verify the customer data matches current user
    $customerData = $request->input('customer_data');
    if ($customerData['email'] !== $user->email) {
        return response()->json(['success' => false], 403);
    }

    return response()->json([
        'success' => true,
        'expires_in' => 1800 // 30 minutes
    ]);
});

// Example in Node.js/Express
app.post('/api/widget-auth', (req, res) => {
    const user = req.user; // From your auth middleware

    if (!user) {
        return res.status(401).json({ success: false });
    }

    const { customer_data } = req.body;
    if (customer_data.email !== user.email) {
        return res.status(403).json({ success: false });
    }

    res.json({
        success: true,
        expires_in: 1800 // 30 minutes
    });
});`
        }
    } catch (error) {
        console.error('Failed to generate embed code:', error)
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
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = embedCode.value
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        copied.value = true
        setTimeout(() => copied.value = false, 2000)
    }
}
</script>