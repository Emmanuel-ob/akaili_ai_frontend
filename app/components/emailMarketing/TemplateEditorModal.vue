<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <div class="flex items-center gap-4">
                    <h2 class="text-2xl font-bold text-gray-900">
                        {{ isEditing ? 'Edit Template' : 'Create Template' }}
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
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <!-- Basic Info -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                        <input v-model="formData.name" type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <input v-model="formData.category" type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea v-model="formData.description" rows="2"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Subject Line *</label>
                    <input v-model="formData.subject" type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required />
                </div>

                <!-- Unlayer Editor -->
                <div class="border border-gray-300 rounded-lg overflow-hidden">
                    <div id="template-editor" style="height: 600px;"></div>
                </div>

                <div class="flex items-center gap-4">
                    <button @click="sendTestEmail"
                        class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                        Send Test Email
                    </button>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button @click="saveDraft"
                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Save Draft
                </button>
                <button @click="publishTemplate" :disabled="!canPublish" :class="[
                    'px-6 py-2 rounded-lg font-medium',
                    canPublish
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]">
                    Publish Template
                </button>
            </div>
        </div>

        <!-- Test Email Modal -->
        <TestEmailModal v-if="showTestEmailModal" @send="handleSendTest" @close="showTestEmailModal = false" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted,toRaw } from 'vue'
import TestEmailModal from './TestEmailModal.vue'
import { useToast } from 'vue-toastification'


const props = defineProps({
    template: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'saved'])

const emailStore = useEmailMarketingStore()
const $toast  = useToast()

const formData = ref({
    name: '',
    description: '',
    subject: '',
    category: '',
    html_content: '',
    unlayer_design: null
})

const autoSaveStatus = ref('')
const showTestEmailModal = ref(false)
const templateId = ref(null)
const autoSaveInterval = ref(null)

const isEditing = computed(() => !!props.template)
const canPublish = computed(() => formData.value.name && formData.value.subject)

const initUnlayer = () => {
    if (typeof unlayer === 'undefined') return

    unlayer.init({
        id: 'template-editor',
        projectId: 0,
        displayMode: 'email',
        mergeTags: {
            first_name: { name: 'First Name', value: '{{first_name}}' },
            last_name: { name: 'Last Name', value: '{{last_name}}' },
            email: { name: 'Email', value: '{{email}}' },
            company_name: { name: 'Company Name', value: '{{company_name}}' }
        }
    })

    // Add setTimeout to ensure editor is ready
    setTimeout(() => {
        if (isEditing.value && props.template?.unlayer_design) {
            const design = typeof props.template.unlayer_design === 'string'
                ? JSON.parse(props.template.unlayer_design)
                : props.template.unlayer_design

            const cleanDesign = toRaw(design)   
            console.log('Loading unlayer design:', toRaw(design))

            unlayer.loadDesign(cleanDesign)
        }
    }, 500)
}

const autoSave = async () => {
    if (!formData.value.name) return

    autoSaveStatus.value = 'Saving...'

    try {
        unlayer.exportHtml((data) => {
            formData.value.html_content = data.html
            formData.value.unlayer_design = JSON.stringify(data.design)
        })

        await new Promise(resolve => setTimeout(resolve, 500))

        templateId.value = await emailStore.autoSaveTemplate(formData.value, templateId.value)
        autoSaveStatus.value = `Saved at ${new Date().toLocaleTimeString()}`
    } catch (error) {
        autoSaveStatus.value = 'Auto-save failed'
    }
}

const saveDraft = async () => {
    try {
        unlayer.exportHtml(async (data) => {
            formData.value.html_content = data.html
            formData.value.unlayer_design = JSON.stringify(data.design)

            await emailStore.autoSaveTemplate(formData.value, templateId.value)
            $toast.success('Draft saved')
            emit('saved')
        })
    } catch (error) {
        $toast.error('Failed to save draft')
    }
}

const publishTemplate = async () => {
    if (!canPublish.value) return

    try {
        unlayer.exportHtml(async (data) => {
            formData.value.html_content = data.html
            formData.value.unlayer_design = JSON.stringify(data.design)
            formData.value.publish = 1

            if (isEditing.value) {
                await emailStore.updateTemplate(props.template.id, formData.value)
            } else {
                await emailStore.createTemplate(formData.value)
            }

            $toast.success('Template published!')
            emit('saved')
        })
    } catch (error) {
        $toast.error('Failed to publish template')
    }
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
                html_content: data.html
            })
            $toast.success(`Test email sent to ${email}`)
            showTestEmailModal.value = false
        })
    } catch (error) {
        $toast.error('Failed to send test email')
    }
}

onMounted(() => {
    if (!window.unlayer) {
        const script = document.createElement('script')
        script.src = '//editor.unlayer.com/embed.js'
        script.async = true
        script.onload = () => {
            initUnlayer()
            autoSaveInterval.value = setInterval(autoSave, 30000)
        }
        document.head.appendChild(script)
    } else {
        initUnlayer()
        autoSaveInterval.value = setInterval(autoSave, 30000)
    }

    if (isEditing.value) {
        Object.assign(formData.value, props.template)
        templateId.value = props.template.id
    }
})

onUnmounted(() => {
    if (autoSaveInterval.value) {
        clearInterval(autoSaveInterval.value)
    }
})
</script>