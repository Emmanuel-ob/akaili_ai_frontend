// stores/emailMarketingStore.js
import { defineStore } from 'pinia'

export const useEmailMarketingStore = defineStore('emailMarketing', {
    state: () => ({
        // Lists
        lists: [],
        currentList: null,
        listsLoading: false,

        // Contacts
        contacts: [],
        contactsPagination: {
            current_page: 1,
            per_page: 50,
            total: 0
        },
        contactsLoading: false,
        selectedContacts: [],
        customFields: [],

        // Templates
        templates: [],
        currentTemplate: null,
        templatesLoading: false,
        templateStats: {
            total: 0,
            my_templates: 0,
            global_templates: 0
        },
        templateCategories: [],
        templateTags: [],

        // Campaigns
        campaigns: [],
        currentCampaign: null,
        campaignsLoading: false,

        // Analytics
        campaignAnalytics: null,
        analyticsLoading: false,

        // Filters
        filters: {
            contacts: {
                status: '',
                list_id: '',
                tag: '',
                search: ''
            },
            templates: {
                category: '',
                tag: '',
                search: '',
                ownership: 'all'
            },
            campaigns: {
                status: '',
                search: ''
            }
        },

        // UI State
        autoSaveStatus: '',
        lastAutoSave: null,
    }),

    getters: {
        // Lists
        activeListsCount: (state) => state.lists.filter(l => l.total_subscribers > 0).length,

        // Contacts
        activeContactsCount: (state) => state.contacts.filter(c => c.status === 'active').length,

        // Templates
        myTemplates: (state) => state.templates.filter(t => !t.is_global),
        globalTemplates: (state) => state.templates.filter(t => t.is_global),

        // Campaigns
        draftCampaigns: (state) => state.campaigns.filter(c => c.status === 'draft'),
        scheduledCampaigns: (state) => state.campaigns.filter(c => c.status === 'scheduled'),
        sentCampaigns: (state) => state.campaigns.filter(c => c.status === 'sent'),
    },

    actions: {
        // =====================
        // EMAIL LISTS
        // =====================
        async fetchLists() {
            this.listsLoading = true
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/lists`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Accept': 'application/json'
                    }
                })

                if (response.success) {
                    this.lists = response.data.lists
                }
            } catch (error) {
                console.error('Error fetching lists:', error)
                throw error
            } finally {
                this.listsLoading = false
            }
        },

        async createList(listData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/lists`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: listData
                })

                if (response.success) {
                    this.lists.unshift(response.data.list)
                    return response.data.list
                }
            } catch (error) {
                console.error('Error creating list:', error)
                throw error
            }
        },

        async updateList(listId, listData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/lists/${listId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: listData
                })

                if (response.success) {
                    const index = this.lists.findIndex(l => l.id === listId)
                    if (index !== -1) {
                        this.lists[index] = response.data.list
                    }
                    return response.data.list
                }
            } catch (error) {
                console.error('Error updating list:', error)
                throw error
            }
        },

        async deleteList(listId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                await $fetch(`${config.public.apiBase}/api/email/lists/${listId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                this.lists = this.lists.filter(l => l.id !== listId)
            } catch (error) {
                console.error('Error deleting list:', error)
                throw error
            }
        },

        async fetchListTags(listId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/lists/${listId}/tags`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                return response.data.tags
            } catch (error) {
                console.error('Error fetching list tags:', error)
                return []
            }
        },

        // =====================
        // EMAIL CONTACTS
        // =====================
        async fetchContacts(params = {}) {
            this.contactsLoading = true
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                // Build query params - only include non-empty values
                const queryObj = {
                    per_page: this.contactsPagination.per_page,
                    page: this.contactsPagination.current_page,
                    ...params
                }

                // Add filters only if they have values
                Object.keys(this.filters.contacts).forEach(key => {
                    if (this.filters.contacts[key]) {
                        queryObj[key] = this.filters.contacts[key]
                    }
                })

                const queryParams = new URLSearchParams(queryObj)

                const response = await $fetch(`${config.public.apiBase}/api/email/contacts?${queryParams}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    this.contacts = response.data.contacts.data
                    this.contactsPagination = {
                        current_page: response.data.contacts.current_page,
                        per_page: response.data.contacts.per_page,
                        total: response.data.contacts.total,
                        last_page: response.data.contacts.last_page
                    }
                }
            } catch (error) {
                console.error('Error fetching contacts:', error)
                throw error
            } finally {
                this.contactsLoading = false
            }
        },

        async createContact(contactData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/contacts`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: contactData
                })

                if (response.success) {
                    this.contacts.unshift(response.data.contact)
                    return response.data.contact
                }
            } catch (error) {
                console.error('Error creating contact:', error)
                throw error
            }
        },

        async updateContact(contactId, contactData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/contacts/${contactId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: contactData
                })

                if (response.success) {
                    const index = this.contacts.findIndex(c => c.id === contactId)
                    if (index !== -1) {
                        this.contacts[index] = response.data.contact
                    }
                }
            } catch (error) {
                console.error('Error updating contact:', error)
                throw error
            }
        },

        async deleteContact(contactId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                await $fetch(`${config.public.apiBase}/api/email/contacts/${contactId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                this.contacts = this.contacts.filter(c => c.id !== contactId)
            } catch (error) {
                console.error('Error deleting contact:', error)
                throw error
            }
        },

        async importContacts(file, listId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const formData = new FormData()
                formData.append('file', file)
                formData.append('list_id', listId)

                const response = await $fetch(`${config.public.apiBase}/api/email/contacts/import`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: formData
                })

                if (response.success) {
                    await this.fetchContacts()
                    return response.data
                }
            } catch (error) {
                console.error('Error importing contacts:', error)
                throw error
            }
        },

        async exportContacts(listId = null) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const params = listId ? `?list_id=${listId}` : ''
                const response = await $fetch(`${config.public.apiBase}/api/email/contacts/export${params}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                return response.data
            } catch (error) {
                console.error('Error exporting contacts:', error)
                throw error
            }
        },

        async fetchCustomFields(listId = null) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const params = listId ? `?list_id=${listId}` : ''
                const response = await $fetch(`${config.public.apiBase}/api/email/contacts/custom-fields/available${params}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    this.customFields = response.data.custom_fields
                }
            } catch (error) {
                console.error('Error fetching custom fields:', error)
            }
        },

        // =====================
        // EMAIL TEMPLATES
        // =====================
        async fetchTemplates(params = {}) {
            this.templatesLoading = true
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const queryParams = new URLSearchParams({
                    ...this.filters.templates,
                    ...params
                })

                const response = await $fetch(`${config.public.apiBase}/api/email/templates?${queryParams}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    this.templates = response.data.templates.data
                    this.templateStats = response.data.stats
                }
            } catch (error) {
                console.error('Error fetching templates:', error)
                throw error
            } finally {
                this.templatesLoading = false
            }
        },

        async fetchTemplate(templateId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/templates/${templateId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                console.log('Fetch template response:', response)

                if (response.success) {
                    this.currentTemplate = response.data.template
                    return response.data.template
                }
            } catch (error) {
                console.error('Error fetching template:', error)
                throw error
            }
        },

        async autoSaveTemplate(templateData, templateId = null) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const url = templateId
                    ? `${config.public.apiBase}/api/email/templates/auto-save/${templateId}`
                    : `${config.public.apiBase}/api/email/templates/auto-save`

                const response = await $fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: templateData
                })

                if (response.success) {
                    this.autoSaveStatus = response.message
                    this.lastAutoSave = response.auto_saved_at
                    return response.template_id
                }
            } catch (error) {
                console.error('Error auto-saving template:', error)
                this.autoSaveStatus = 'Auto-save failed'
                throw error
            }
        },

        async createTemplate(templateData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/templates`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: templateData
                })

                if (response.success) {
                    this.templates.unshift(response.data.template)
                    return response.data.template
                }
            } catch (error) {
                console.error('Error creating template:', error)
                throw error
            }
        },

        async updateTemplate(templateId, templateData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/templates/${templateId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: templateData
                })

                if (response.success) {
                    const index = this.templates.findIndex(t => t.id === templateId)
                    if (index !== -1) {
                        this.templates[index] = response.data.template
                    }
                    return response.data.template
                }
            } catch (error) {
                console.error('Error updating template:', error)
                throw error
            }
        },

        async duplicateTemplate(templateId, newName) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/templates/${templateId}/duplicate`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: { name: newName }
                })

                if (response.success) {
                    this.templates.unshift(response.data.template)
                    return response.data.template
                }
            } catch (error) {
                console.error('Error duplicating template:', error)
                throw error
            }
        },

        async deleteTemplate(templateId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                await $fetch(`${config.public.apiBase}/api/email/templates/${templateId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                this.templates = this.templates.filter(t => t.id !== templateId)
            } catch (error) {
                console.error('Error deleting template:', error)
                throw error
            }
        },

        async previewTemplate(templateId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/templates/${templateId}/preview`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                return response.data
            } catch (error) {
                console.error('Error previewing template:', error)
                throw error
            }
        },

        async sendTestEmail(emailData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/templates/send-test`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: emailData
                })

                return response
            } catch (error) {
                console.error('Error sending test email:', error)
                throw error
            }
        },

        async fetchTemplateCategories() {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/templates/categories`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    this.templateCategories = response.data.categories
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        },

        async fetchTemplateTags() {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/templates/tags`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    this.templateTags = response.data.tags
                }
            } catch (error) {
                console.error('Error fetching tags:', error)
            }
        },

        // =====================
        // EMAIL CAMPAIGNS
        // =====================
        async fetchCampaigns() {
            this.campaignsLoading = true
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/campaigns`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    this.campaigns = response.data.campaigns
                }
            } catch (error) {
                console.error('Error fetching campaigns:', error)
                throw error
            } finally {
                this.campaignsLoading = false
            }
        },

        async fetchCampaign(campaignId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/campaigns/${campaignId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    this.currentCampaign = response.data.campaign
                    return response.data.campaign
                }
            } catch (error) {
                console.error('Error fetching campaign:', error)
                throw error
            }
        },

        async autoSaveCampaign(campaignData, campaignId = null) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const url = campaignId
                    ? `${config.public.apiBase}/api/email/campaigns/auto-save/${campaignId}`
                    : `${config.public.apiBase}/api/email/campaigns/auto-save`

                const response = await $fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: campaignData
                })

                if (response.success) {
                    this.autoSaveStatus = response.message
                    this.lastAutoSave = response.auto_saved_at
                    return response.campaign_id
                }
            } catch (error) {
                console.error('Error auto-saving campaign:', error)
                this.autoSaveStatus = 'Auto-save failed'
            }
        },

        async createCampaign(campaignData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/campaigns`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: campaignData
                })

                if (response.success) {
                    this.campaigns.unshift(response.data.campaign)
                    return response.data.campaign
                }
            } catch (error) {
                console.error('Error creating campaign:', error)
                throw error
            }
        },

        async updateCampaign(campaignId, campaignData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/campaigns/${campaignId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: campaignData
                })

                if (response.success) {
                    const index = this.campaigns.findIndex(c => c.id === campaignId)
                    if (index !== -1) {
                        this.campaigns[index] = response.data.campaign
                    }
                    return response.data.campaign
                }
            } catch (error) {
                console.error('Error updating campaign:', error)
                throw error
            }
        },

        async deleteCampaign(campaignId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                await $fetch(`${config.public.apiBase}/api/email/campaigns/${campaignId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                this.campaigns = this.campaigns.filter(c => c.id !== campaignId)
            } catch (error) {
                console.error('Error deleting campaign:', error)
                throw error
            }
        },

        async validateCampaign(campaignId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/campaigns/${campaignId}/validate`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                return response.data
            } catch (error) {
                console.error('Error validating campaign:', error)
                throw error
            }
        },

        async sendCampaign(campaignId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/campaigns/${campaignId}/send`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    const index = this.campaigns.findIndex(c => c.id === campaignId)
                    if (index !== -1) {
                        this.campaigns[index] = response.data.campaign
                    }
                }
                return response
            } catch (error) {
                console.error('Error sending campaign:', error)
                throw error
            }
        },

        async scheduleCampaign(campaignId, sendDate) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/campaigns/${campaignId}/schedule`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: { send_date: sendDate }
                })

                if (response.success) {
                    const index = this.campaigns.findIndex(c => c.id === campaignId)
                    if (index !== -1) {
                        this.campaigns[index] = response.data.campaign
                    }
                }
                return response
            } catch (error) {
                console.error('Error scheduling campaign:', error)
                throw error
            }
        },

        async pauseCampaign(campaignId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/campaigns/${campaignId}/pause`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    const index = this.campaigns.findIndex(c => c.id === campaignId)
                    if (index !== -1) {
                        this.campaigns[index] = response.data.campaign
                    }
                }
            } catch (error) {
                console.error('Error pausing campaign:', error)
                throw error
            }
        },

        async fetchCampaignAnalytics(campaignId) {
            this.analyticsLoading = true
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/email/campaigns/${campaignId}/analytics`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    this.campaignAnalytics = response.data
                    return response.data
                }
            } catch (error) {
                console.error('Error fetching analytics:', error)
                throw error
            } finally {
                this.analyticsLoading = false
            }
        },

        // =====================
        // FILTERS
        // =====================
        setContactsFilter(key, value) {
            this.filters.contacts[key] = value
            this.fetchContacts()
        },

        setTemplatesFilter(key, value) {
            this.filters.templates[key] = value
            this.fetchTemplates()
        },

        setCampaignsFilter(key, value) {
            this.filters.campaigns[key] = value
            this.fetchCampaigns()
        },

        clearFilters(type) {
            if (type === 'contacts') {
                this.filters.contacts = {
                    status: '',
                    list_id: '',
                    tag: '',
                    search: ''
                }
                this.fetchContacts()
            } else if (type === 'templates') {
                this.filters.templates = {
                    category: '',
                    tag: '',
                    search: '',
                    ownership: 'all'
                }
                this.fetchTemplates()
            } else if (type === 'campaigns') {
                this.filters.campaigns = {
                    status: '',
                    search: ''
                }
                this.fetchCampaigns()
            }
        },

        // =====================
        // WEBSOCKET HANDLERS
        // =====================
        handleEmailStatsUpdate(data) {
            const campaign = this.campaigns.find(c => c.id === data.campaign_id)
            if (campaign) {
                campaign.stats = campaign.stats || {}
                campaign.stats.opened = data.opened
                campaign.stats.clicked = data.clicked
                campaign.open_rate = data.open_rate
                campaign.click_rate = data.click_rate
            }

            if (this.currentCampaign?.id === data.campaign_id) {
                this.currentCampaign.stats.opened = data.opened
                this.currentCampaign.stats.clicked = data.clicked
                this.currentCampaign.open_rate = data.open_rate
                this.currentCampaign.click_rate = data.click_rate
            }
        },

        handleCampaignStarted(data) {
            const campaign = this.campaigns.find(c => c.id === data.campaign_id)
            if (campaign) {
                campaign.status = 'sending'
            }
        },

        handleCampaignCompleted(data) {
            const campaign = this.campaigns.find(c => c.id === data.campaign_id)
            if (campaign) {
                campaign.status = 'sent'
                campaign.stats = data.stats
                campaign.open_rate = data.open_rate
                campaign.click_rate = data.click_rate
            }
        },

        // =====================
        // UTILITIES
        // =====================
        resetState() {
            this.$reset()
        }
    }
})