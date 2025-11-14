<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <div class="flex items-center gap-4">
                    <h2 class="text-2xl font-bold text-gray-900">
                        {{ isEditing ? 'Edit Campaign' : 'Create Campaign' }}
                    </h2>
                    <span v-if="autoSaveStatus" class="text-sm text-gray-600 px-3 py-1 bg-blue-50 rounded-lg">
                        {{ autoSaveStatus }}
                    </span>
                </div>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6">
                <!-- Step Progress -->
                <div class="mb-8">
                    <div class="flex items-center justify-between mb-4">
                        <div v-for="(step, index) in steps" :key="step.id" class="flex-1 flex items-center"
                            :class="{ 'pl-4': index > 0 }">
                            <div class="flex items-center flex-1">
                                <div :class="[
                                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
                                    currentStep >= index + 1
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                ]">
                                    {{ index + 1 }}
                                </div>
                                <div class="ml-3 flex-1">
                                    <p :class="[
                                        'text-sm font-medium',
                                        currentStep >= index + 1 ? 'text-purple-600' : 'text-gray-600'
                                    ]">
                                        {{ step.label }}
                                    </p>
                                </div>
                            </div>
                            <div v-if="index < steps.length - 1" class="w-full h-0.5 bg-gray-200 mx-2">
                                <div v-if="currentStep > index + 1" class="h-full bg-purple-600 transition-all"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 1: Basic Info -->
                <div v-show="currentStep === 1" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Campaign Name *</label>
                        <input v-model="formData.name" type="text" placeholder="e.g., Summer Sale 2024"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea v-model="formData.description" rows="3"
                            placeholder="Briefly describe this campaign..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Subject Line *</label>
                        <input v-model="formData.subject" type="text" placeholder="e.g., 🔥 Big Summer Sale - 50% Off!"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required />
                        <p class="text-sm text-gray-500 mt-1">
                            Use variables: {{ first_name }}, {{ last_name }}, {{ company_name }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">From Name *</label>
                            <input v-model="formData.from_name" type="text" placeholder="e.g., John from Xeli AI"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">From Email *</label>
                            <input v-model="formData.from_email" type="email" placeholder="e.g., john@xeliai.com"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required />
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Reply-To Email</label>
                        <input v-model="formData.reply_to" type="email" placeholder="e.g., support@xeliai.com"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                </div>

                <!-- Step 2: Recipients -->
                <div v-show="currentStep === 2" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email List *</label>
                        <select v-model="formData.list_id" @change="onListSelected"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required>
                            <option value="">Select a list...</option>
                            <option v-for="list in emailStore.lists" :key="list.id" :value="list.id">
                                {{ list.name }} ({{ list.total_subscribers }} subscribers)
                            </option>
                        </select>
                    </div>

                    <div v-if="formData.list_id && availableTags.length > 0">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Tags (optional)
                        </label>
                        <div class="border border-gray-300 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                            <label v-for="tag in availableTags" :key="tag"
                                class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input type="checkbox" :value="tag" v-model="formData.tag_groups"
                                    class="rounded text-purple-600 focus:ring-purple-500" />
                                <span class="text-sm text-gray-700">{{ tag }}</span>
                            </label>
                        </div>
                        <p class="text-sm text-gray-500 mt-2">
                            Selected: {{ selectedContactsCount }} contacts
                        </p>
                    </div>
                </div>

                <!-- Step 3: Design -->
                <div v-show="currentStep === 3" class="space-y-6">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Choose Template</label>
                            <p class="text-sm text-gray-500">Start with a template or build from scratch</p>
                        </div>
                        <button @click="showTemplateSelector = true"
                            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Browse Templates
                        </button>
                    </div>

                    <div v-if="selectedTemplate" class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium text-gray-900">{{ selectedTemplate.name }}</p>
                                <p class="text-sm text-gray-600">{{ selectedTemplate.category }}</p>
                            </div>
                            <button @click="clearTemplate" class="text-sm text-purple-600 hover:text-purple-700">
                                Change Template
                            </button>
                        </div>
                    </div>

                    <!-- Unlayer Editor -->
                    <div class="border border-gray-300 rounded-lg overflow-hidden">
                        <div id="unlayer-editor" style="height: 600px;"></div>
                    </div>

                    <div class="flex items-center gap-4">
                        <button @click="previewEmail"
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            Preview
                        </button>
                        <button @click="sendTestEmail"
                            class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                            Send Test Email
                        </button>
                    </div>
                </div>

                <!-- Step 4: Schedule -->
                <div v-show="currentStep === 4" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-4">When to send?</label>
                        <div class="space-y-3">
                            <label
                                class="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" v-model="sendOption" value="now"
                                    class="text-purple-600 focus:ring-purple-500" />
                                <div>
                                    <p class="font-medium text-gray-900">Send Now</p>
                                    <p class="text-sm text-gray-600">Campaign will be sent immediately</p>
                                </div>
                            </label>

                            <label
                                class="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" v-model="sendOption" value="schedule"
                                    class="text-purple-600 focus:ring-purple-500" />
                                <div>
                                    <p class="font-medium text-gray-900">Schedule for Later</p>
                                    <p class="text-sm text-gray-600">Choose a specific date and time</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div v-if="sendOption === 'schedule'" class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Schedule Date & Time</label>
                        <input v-model="formData.send_date" type="datetime-local" :min="minDateTime"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>

                    <!-- Campaign Summary -->
                    <div class="mt-8 p-6 bg-gray-50 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Campaign Summary</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Campaign Name:</span>
                                <span class="font-medium text-gray-900">{{ formData.name || 'Not set' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Recipients:</span>
                                <span class="font-medium text-gray-900">{{ selectedContactsCount }} contacts</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Subject:</span>
                                <span class="font-medium text-gray-900">{{ formData.subject || 'Not set' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Send Time:</span>
                                <span class="font-medium text-gray-900">
                                    {{ sendOption === 'now' ? 'Immediately' : formatScheduledDate(formData.send_date) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Validation Errors -->
                    <div v-if="validationErrors.length > 0" class="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p class="text-sm font-medium text-red-800 mb-2">Please fix the following issues:</p>
                        <ul class="list-disc list-inside text-sm text-red-700 space-y-1">
                            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between p-6 border-t border-gray-200">
                <button v-if="currentStep > 1" @click="previousStep"
                    class="px-6 py-2 text-gray-600 hover:text-gray-900">
                    ← Back
                </button>
                <div v-else></div>

                <div class="flex items-center gap-3">
                    <button @click="saveDraft"
                        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Save Draft
                    </button>
                    <button v-if="currentStep < 4" @click="nextStep"
                        class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Continue →
                    </button>
                    <button v-else @click="submitCampaign" :disabled="!canSubmit" :class="[
                        'px-6 py-2 rounded-lg font-medium',
                        canSubmit
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ]">
                        {{ sendOption === 'now' ? '🚀 Send Campaign' : '📅 Schedule Campaign' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Template Selector Modal -->
        <TemplateSelectorModal v-if="showTemplateSelector" @select="selectTemplate"
            @close="showTemplateSelector = false" />

        <!-- Test Email Modal -->
        <TestEmailModal v-if="showTestEmailModal" @send="handleSendTest" @close="showTestEmailModal = false" />

        <!-- Preview Modal -->
        <EmailPreviewModal v-if="showPreviewModal" :html-content="previewContent" :subject="formData.subject"
            @close="showPreviewModal = false" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, toRaw} from 'vue'
import TemplateSelectorModal from './TemplateSelectorModal.vue'
import TestEmailModal from './TestEmailModal.vue'
import EmailPreviewModal from './EmailPreviewModal.vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
    campaign: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'saved'])

const emailStore = useEmailMarketingStore()
const $toast = useToast()

const currentStep = ref(1)
const formData = ref({
    name: '',
    description: '',
    subject: '',
    content: '',
    from_name: '',
    from_email: '',
    reply_to: '',
    list_id: '',
    tag_groups: [],
    send_date: null,
    template_id: null
})

const sendOption = ref('now')
const selectedTemplate = ref(null)
const availableTags = ref([])
const selectedContactsCount = ref(0)
const autoSaveStatus = ref('')
const validationErrors = ref([])
const showTemplateSelector = ref(false)
const showTestEmailModal = ref(false)
const showPreviewModal = ref(false)
const previewContent = ref('')
const campaignId = ref(null)
const unlayerEditor = ref(null)
const autoSaveInterval = ref(null)

const steps = [
    { id: 1, label: 'Basic Info' },
    { id: 2, label: 'Recipients' },
    { id: 3, label: 'Design' },
    { id: 4, label: 'Review & Send' }
]

const isEditing = computed(() => !!props.campaign)

const minDateTime = computed(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5)
    return now.toISOString().slice(0, 16)
})

const canSubmit = computed(() => {
    return formData.value.name &&
        formData.value.subject &&
        formData.value.from_name &&
        formData.value.from_email &&
        formData.value.list_id &&
        formData.value.content &&
        selectedContactsCount.value > 0
})

// Initialize Unlayer
const initUnlayer = () => {
    if (typeof unlayer === 'undefined') {
        console.error('Unlayer not loaded')
        return
    }

    unlayer.init({
        id: 'unlayer-editor',
        projectId: 0,
        displayMode: 'email',
        locale: 'en',
        appearance: {
            theme: 'modern_light'
        },
        mergeTags: {
            first_name: { name: 'First Name', value: '{{first_name}}' },
            last_name: { name: 'Last Name', value: '{{last_name}}' },
            email: { name: 'Email', value: '{{email}}' },
            company_name: { name: 'Company Name', value: '{{company_name}}' },
            full_name: { name: 'Full Name', value: '{{full_name}}' }
        }
    })

    // Load existing design if editing
    if (isEditing.value && props.campaign.unlayer_design) {
        unlayer.loadDesign(props.campaign.unlayer_design)
    }

    unlayerEditor.value = unlayer
}

// Auto-save
const startAutoSave = () => {
    autoSaveInterval.value = setInterval(async () => {
        await autoSave()
    }, 30000) // Every 30 seconds
}

const autoSave = async () => {
    if (!formData.value.name) {
        autoSaveStatus.value = 'Enter campaign name to auto-save'
        return
    }

    autoSaveStatus.value = 'Saving...'

    try {
        // Export HTML from Unlayer
        unlayer.exportHtml((data) => {
            formData.value.content = data.html
            formData.value.unlayer_design = JSON.stringify(data.design)
        })

        // Wait a bit for export to complete
        await new Promise(resolve => setTimeout(resolve, 500))

        campaignId.value = await emailStore.autoSaveCampaign(formData.value, campaignId.value)
        autoSaveStatus.value = `Saved at ${new Date().toLocaleTimeString()}`
    } catch (error) {
        autoSaveStatus.value = 'Auto-save failed'
        console.error('Auto-save error:', error)
    }
}

// Navigation
const nextStep = () => {
    if (validateCurrentStep()) {
        currentStep.value++
    }
}

const previousStep = () => {
    currentStep.value--
}

const validateCurrentStep = () => {
    validationErrors.value = []

    if (currentStep.value === 1) {
        if (!formData.value.name) validationErrors.value.push('Campaign name is required')
        if (!formData.value.subject) validationErrors.value.push('Subject line is required')
        if (!formData.value.from_name) validationErrors.value.push('From name is required')
        if (!formData.value.from_email) validationErrors.value.push('From email is required')
    } else if (currentStep.value === 2) {
        if (!formData.value.list_id) validationErrors.value.push('Email list is required')
        if (selectedContactsCount.value === 0) validationErrors.value.push('List must have at least one contact')
    }

    if (validationErrors.value.length > 0) {
        $toast.error('Please fix the validation errors')
        return false
    }

    return true
}

// Recipients
const onListSelected = async () => {
    try {
        const tags = await emailStore.fetchListTags(formData.value.list_id)
        availableTags.value = tags

        const list = emailStore.lists.find(l => l.id === formData.value.list_id)
        selectedContactsCount.value = list?.total_subscribers || 0

        formData.value.tag_groups = []
    } catch (error) {
        console.error('Error loading list tags:', error)
    }
}

watch(() => formData.value.tag_groups, () => {
    // Recalculate selected contacts count based on tags
    // This is simplified - backend will do actual filtering
    const list = emailStore.lists.find(l => l.id === formData.value.list_id)
    if (list && formData.value.tag_groups.length > 0) {
        // Estimate based on tags
        selectedContactsCount.value = Math.floor(list.total_subscribers * 0.7)
    } else if (list) {
        selectedContactsCount.value = list.total_subscribers
    }
})

// Templates
const selectTemplate = async (template) => {
    selectedTemplate.value = template
    formData.value.template_id = template.id

    if (template.unlayer_design) {
        const design = typeof template.unlayer_design === 'string'
            ? JSON.parse(template.unlayer_design)
            : template.unlayer_design

        // Use toRaw to strip Vue reactivity
        const cleanDesign = toRaw(design)

        // Wait for editor to be ready
        setTimeout(() => {
            unlayer.loadDesign(cleanDesign)
        }, 300)
    }

    showTemplateSelector.value = false
    $toast.success('Template loaded')
}
const clearTemplate = () => {
    selectedTemplate.value = null
    formData.value.template_id = null
    unlayer.loadDesign({})
}

// Preview & Test
const previewEmail = () => {
    unlayer.exportHtml((data) => {
        previewContent.value = data.html
        showPreviewModal.value = true
    })
}

const sendTestEmail = () => {
    showTestEmailModal.value = true
}

const handleSendTest = async (email) => {
    try {
        unlayer.exportHtml(async (data) => {
            await emailStore.sendTestEmail({
                to_email: email,
                subject: formData.value.subject,
                html_content: data.html,
                preview_text: formData.value.description
            })
            $toast.success(`Test email sent to ${email}`)
            showTestEmailModal.value = false
        })
    } catch (error) {
        $toast.error('Failed to send test email')
    }
}

// Submit
const saveDraft = async () => {
    try {
        unlayer.exportHtml(async (data) => {
            formData.value.content = data.html
            formData.value.unlayer_design = JSON.stringify(data.design)

            await emailStore.autoSaveCampaign(formData.value, campaignId.value)
            $toast.success('Draft saved')
            emit('saved')
        })
    } catch (error) {
        $toast.error('Failed to save draft')
    }
}

const submitCampaign = async () => {
    if (!canSubmit.value) {
        $toast.error('Please complete all required fields')
        return
    }

    try {
        unlayer.exportHtml(async (data) => {
            formData.value.content = data.html
            formData.value.unlayer_design = JSON.stringify(data.design)

            if (sendOption.value === 'now') {
                // Send immediately
                const campaign = await emailStore.createCampaign(formData.value)
                await emailStore.sendCampaign(campaign.id)
                $toast.success('Campaign is being sent!')
            } else {
                // Schedule
                const campaign = await emailStore.createCampaign(formData.value)
                await emailStore.scheduleCampaign(campaign.id, formData.value.send_date)
                $toast.success('Campaign scheduled successfully!')
            }

            emit('saved')
        })
    } catch (error) {
        $toast.error('Failed to submit campaign')
        console.error(error)
    }
}

const formatScheduledDate = (date) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Lifecycle
onMounted(async () => {
    if (!window.unlayer) {
        const script = document.createElement('script')
        script.src = '//editor.unlayer.com/embed.js'
        script.async = true
        script.onload = () => {
            initUnlayer()
            startAutoSave()
        }
        document.head.appendChild(script)
    } else {
        initUnlayer()
        startAutoSave()
    }

    // Load campaign data if editing
    if (isEditing.value) {
        Object.assign(formData.value, props.campaign)
        campaignId.value = props.campaign.id

        if (formData.value.list_id) {
            await onListSelected()
        }

        if (props.campaign.send_date) {
            sendOption.value = 'schedule'
        }

        // Load Unlayer design for editing with toRaw
        if (props.campaign.unlayer_design) {
            const design = typeof props.campaign.unlayer_design === 'string'
                ? JSON.parse(props.campaign.unlayer_design)
                : props.campaign.unlayer_design

            const cleanDesign = toRaw(design)

            setTimeout(() => {
                if (unlayerEditor.value) {
                    unlayer.loadDesign(cleanDesign)
                }
            }, 500)
        }
    }

    if (emailStore.lists.length === 0) {
        await emailStore.fetchLists()
    }
})

onUnmounted(() => {
    if (autoSaveInterval.value) {
        clearInterval(autoSaveInterval.value)
    }
})
</script>