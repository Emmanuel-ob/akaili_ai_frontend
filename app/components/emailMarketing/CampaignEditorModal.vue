<template>
    <!-- Modal Backdrop: p-0 on mobile for maximum edge-to-edge viewing -->
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 transition-colors duration-300">
        
        <!-- Main Modal: h-full on mobile, max-h-90 on desktop -->
        <div class="bg-white dark:bg-slate-900 w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col border-none sm:border dark:border-slate-800 transition-all duration-300">
            
            <!-- Header -->
            <div class="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
                <div class="flex items-center gap-4">
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {{ isEditing ? 'Edit Campaign' : 'Create Campaign' }}
                    </h2>
                    <span v-if="autoSaveStatus" class="hidden sm:inline-block text-xs font-medium text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                        {{ autoSaveStatus }}
                    </span>
                </div>
                <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar bg-white dark:bg-slate-900">
                
                <!-- Step Progress: Responsive & Dark Mode -->
                <div class="mb-10 overflow-x-auto pb-4 sm:pb-0 no-scrollbar">
                    <div class="flex items-center min-w-[500px] sm:min-w-full">
                        <div v-for="(step, index) in steps" :key="step.id" class="flex-1 flex items-center"
                            :class="{ 'pl-4': index > 0 }">
                            <div class="flex items-center flex-1">
                                <div :class="[
                                    'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shrink-0 border-2',
                                    currentStep >= index + 1
                                        ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20'
                                        : 'bg-transparent border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-600'
                                ]">
                                    {{ index + 1 }}
                                </div>
                                <div class="ml-3 flex-1">
                                    <p :class="[
                                        'text-[10px] sm:text-xs font-bold uppercase tracking-widest',
                                        currentStep >= index + 1 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-slate-600'
                                    ]">
                                        {{ step.label }}
                                    </p>
                                </div>
                            </div>
                            <div v-if="index < steps.length - 1" class="w-full h-1 bg-gray-100 dark:bg-slate-800 mx-2 rounded-full overflow-hidden">
                                <div :class="['h-full bg-purple-600 transition-all duration-500', currentStep > index + 1 ? 'w-full' : 'w-0']"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 1: Basic Info -->
                <div v-show="currentStep === 1" class="space-y-8 max-w-4xl mx-auto">
                    <div class="grid grid-cols-1 gap-6">
                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">Campaign Name *</label>
                            <input v-model="formData.name" type="text" placeholder="e.g., Summer Sale 2024"
                                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"
                                required />
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">Description</label>
                            <textarea v-model="formData.description" rows="3"
                                placeholder="Briefly describe this campaign..."
                                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"></textarea>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">Subject Line *</label>
                            <input v-model="formData.subject" type="text" placeholder="e.g., 🔥 Big Summer Sale - 50% Off!"
                                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all"
                                required />
                            <p class="text-xs text-gray-500 dark:text-slate-500">
                                Use variables: @{{ first_name }}, @{{ last_name }}, @{{ company_name }}
                            </p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">From Name *</label>
                                <input v-model="formData.from_name" type="text" placeholder="John from Xeli AI"
                                    class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all"
                                    required />
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">From Email *</label>
                                <input v-model="formData.from_email" type="email" placeholder="john@xeliai.com"
                                    class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all"
                                    required />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">Reply-To Email</label>
                            <input v-model="formData.reply_to" type="email" placeholder="support@xeliai.com"
                                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all" />
                        </div>
                    </div>
                </div>

                <!-- Step 2: Recipients -->
                <div v-show="currentStep === 2" class="space-y-8 max-w-4xl mx-auto">
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">Email List *</label>
                        <select v-model="formData.list_id" @change="onListSelected"
                            class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all appearance-none"
                            required>
                            <option value="" class="dark:bg-slate-900">Select a list...</option>
                            <option v-for="list in emailStore.lists" :key="list.id" :value="list.id" class="dark:bg-slate-900">
                                {{ list.name }} ({{ list.total_subscribers }} subscribers)
                            </option>
                        </select>
                    </div>

                    <div v-if="formData.list_id && availableTags.length > 0" class="space-y-4">
                        <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                            Filter by Tags (optional)
                        </label>
                        <div class="border border-gray-200 dark:border-slate-700 rounded-2xl p-4 bg-gray-50 dark:bg-slate-800/50 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                            <label v-for="tag in availableTags" :key="tag"
                                class="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-slate-700 p-3 rounded-xl transition-colors group">
                                <input type="checkbox" :value="tag" v-model="formData.tag_groups"
                                    class="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 dark:bg-slate-800" />
                                <span class="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">{{ tag }}</span>
                            </label>
                        </div>
                        <div class="flex items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-9a4 4 0 11-8 0 4 4 0 018 0zm8 4a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                            <p class="text-sm font-bold text-purple-700 dark:text-purple-300">
                                Target Reach: {{ selectedContactsCount }} contacts
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Design -->
                <div v-show="currentStep === 3" class="space-y-6 flex flex-col h-full">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div>
                            <label class="block text-lg font-bold text-gray-900 dark:text-white">Design Content</label>
                            <p class="text-sm text-gray-500 dark:text-slate-400">Choose a template or use the editor below</p>
                        </div>
                        <button @click="showTemplateSelector = true"
                            class="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all active:scale-95">
                            Browse Templates
                        </button>
                    </div>

                    <div v-if="selectedTemplate" class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800/50 flex items-center justify-between">
                        <div>
                            <p class="font-bold text-gray-900 dark:text-white">{{ selectedTemplate.name }}</p>
                            <p class="text-xs text-gray-600 dark:text-slate-400 uppercase tracking-tighter">{{ selectedTemplate.category }}</p>
                        </div>
                        <button @click="clearTemplate" class="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline">
                            Change
                        </button>
                    </div>

                    <!-- Unlayer Editor: Removed borders on mobile -->
                    <div class="border border-gray-200 dark:border-slate-800 sm:rounded-2xl overflow-hidden -mx-5 sm:mx-0">
                        <div id="unlayer-editor" style="height: 600px;"></div>
                    </div>

                    <div class="flex flex-wrap items-center gap-4 pt-4">
                        <button @click="previewEmail"
                            class="flex-1 sm:flex-none px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                            Preview
                        </button>
                        <button @click="sendTestEmail"
                            class="flex-1 sm:flex-none px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                            Send Test Email
                        </button>
                    </div>
                </div>

                <!-- Step 4: Schedule -->
                <div v-show="currentStep === 4" class="space-y-8 max-w-4xl mx-auto">
                    <div>
                        <label class="block text-lg font-bold text-gray-900 dark:text-white mb-6 text-center sm:text-left">Delivery Preference</label>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label
                                :class="['flex items-start gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all', sendOption === 'now' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700']">
                                <input type="radio" v-model="sendOption" value="now" class="mt-1 w-5 h-5 text-purple-600" />
                                <div>
                                    <p class="font-bold text-gray-900 dark:text-white">🚀 Send Immediately</p>
                                    <p class="text-sm text-gray-500 dark:text-slate-400">Campaign will be processed instantly.</p>
                                </div>
                            </label>

                            <label
                                :class="['flex items-start gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all', sendOption === 'schedule' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700']">
                                <input type="radio" v-model="sendOption" value="schedule" class="mt-1 w-5 h-5 text-purple-600" />
                                <div>
                                    <p class="font-bold text-gray-900 dark:text-white">📅 Schedule Event</p>
                                    <p class="text-sm text-gray-500 dark:text-slate-400">Choose the perfect time for your list.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div v-if="sendOption === 'schedule'" class="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                        <label class="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Schedule Date & Time</label>
                        <input v-model="formData.send_date" type="datetime-local" :min="minDateTime"
                            class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500" />
                    </div>

                    <!-- Campaign Summary -->
                    <div class="p-6 sm:p-8 bg-slate-900 dark:bg-black rounded-3xl text-white shadow-xl">
                        <h3 class="text-xl font-bold mb-6 border-b border-white/10 pb-4">Campaign Summary</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div class="space-y-1">
                                <span class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Name</span>
                                <p class="font-medium truncate">{{ formData.name || 'Not set' }}</p>
                            </div>
                            <div class="space-y-1">
                                <span class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Audience</span>
                                <p class="font-medium">{{ selectedContactsCount }} contacts</p>
                            </div>
                            <div class="space-y-1">
                                <span class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Subject</span>
                                <p class="font-medium truncate">{{ formData.subject || 'Not set' }}</p>
                            </div>
                            <div class="space-y-1">
                                <span class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Delivery Time</span>
                                <p class="font-medium text-purple-400">
                                    {{ sendOption === 'now' ? 'Instant Blast' : formatScheduledDate(formData.send_date) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Validation Errors -->
                    <div v-if="validationErrors.length > 0" class="p-5 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/40">
                        <p class="text-sm font-bold text-red-800 dark:text-red-400 mb-2 flex items-center gap-2">
                             <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                             Requirements Check
                        </p>
                        <ul class="list-disc list-inside text-xs text-red-700 dark:text-red-400/80 space-y-1 ml-2">
                            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Footer: Sticky with Dark Mode -->
            <div class="flex items-center justify-between p-5 sm:p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none">
                <button v-if="currentStep > 1" @click="previousStep"
                    class="px-6 py-3 text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    ← Back
                </button>
                <div v-else></div>

                <div class="flex items-center gap-3">
                    <button @click="saveDraft"
                        class="hidden sm:inline-block px-6 py-3 border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                        Save Draft
                    </button>
                    <button v-if="currentStep < 4" @click="nextStep"
                        class="px-10 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all active:scale-95">
                        Continue
                    </button>
                    <button v-else @click="submitCampaign" :disabled="!canSubmit" :class="[
                        'px-10 py-3 rounded-xl font-bold shadow-xl transition-all active:scale-95 flex items-center gap-2',
                        canSubmit
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/20'
                            : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                    ]">
                        {{ sendOption === 'now' ? '🚀 Launch Campaign' : '📅 Set Schedule' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Modals: Kept exactly as original -->
        <TemplateSelectorModal v-if="showTemplateSelector" @select="selectTemplate" @close="showTemplateSelector = false" />
        <TestEmailModal v-if="showTestEmailModal" @send="handleSendTest" @close="showTestEmailModal = false" />
        <EmailPreviewModal v-if="showPreviewModal" :html-content="previewContent" :subject="formData.subject" @close="showPreviewModal = false" />
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
    const list = emailStore.lists.find(l => l.id === formData.value.list_id)
    if (list && formData.value.tag_groups.length > 0) {
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

        const cleanDesign = toRaw(design)

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
                const campaign = await emailStore.createCampaign(formData.value)
                await emailStore.sendCampaign(campaign.id)
                $toast.success('Campaign is being sent!')
            } else {
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #1e293b;
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>