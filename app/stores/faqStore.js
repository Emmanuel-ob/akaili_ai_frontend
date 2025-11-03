import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useFAQStore = defineStore('faq', {
    state: () => ({
        faqSources: [],
        loading: false,
        uploading: false,
        processing: false,
        error: ''
    }),

    actions: {
        async fetchFAQSources(chatbotId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.loading = true
            this.error = ''

            try {
                const data = await $fetch(`${config.public.apiBase}/api/faq`, {
                    params: { chatbot_id: chatbotId },
                    headers: { Authorization: `Bearer ${token}` }
                })

                this.faqSources = data.faq_sources || []
                return { success: true, data }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch FAQ sources'
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },

        async createManualQA(chatbotId, sourceName, qaPairs, priority = 5) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.uploading = true
            this.error = ''

            try {
                const data = await $fetch(`${config.public.apiBase}/api/faq/manual`, {
                    method: 'POST',
                    body: {
                        chatbot_id: chatbotId,
                        source_name: sourceName,
                        qa_pairs: qaPairs,
                        priority
                    },
                    headers: { Authorization: `Bearer ${token}` }
                })

                return { success: true, data: data.faq_source }
            } catch (error) {
                this.error = error.data?.message || 'Failed to create manual Q&A'
                return { success: false, message: this.error }
            } finally {
                this.uploading = false
            }
        },

        async uploadFile(chatbotId, sourceName, file, priority = 5) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.uploading = true
            this.error = ''

            try {
                const formData = new FormData()
                formData.append('chatbot_id', chatbotId)
                formData.append('source_name', sourceName)
                formData.append('file', file)
                formData.append('priority', priority)

                const data = await $fetch(`${config.public.apiBase}/api/faq/upload`, {
                    method: 'POST',
                    body: formData,
                    headers: { Authorization: `Bearer ${token}` }
                })

                return { success: true, data: data.faq_source }
            } catch (error) {
                this.error = error.data?.message || 'Failed to upload file'
                return { success: false, message: this.error }
            } finally {
                this.uploading = false
            }
        },

        async previewFAQ(faqSourceId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/faq/${faqSourceId}/preview`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                return { success: true, data: data.faq_source, content: data.content }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to preview FAQ' }
            }
        },

        async confirmAndEmbed(faqSourceId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.processing = true
            this.error = ''

            try {
                const data = await $fetch(`${config.public.apiBase}/api/faq/${faqSourceId}/confirm`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                })

                return { success: true, embedded_count: data.embedded_count }
            } catch (error) {
                this.error = error.data?.message || 'Failed to embed FAQ'
                return { success: false, message: this.error }
            } finally {
                this.processing = false
            }
        },

        async updateContent(faqSourceId, content) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/faq/${faqSourceId}/content`, {
                    method: 'PUT',
                    body: { content },
                    headers: { Authorization: `Bearer ${token}` }
                })

                // Update local state
                const faq = this.faqSources.find(f => f.id === faqSourceId)
                if (faq) {
                    faq.processed_content = content
                    faq.total_items = content.length
                }

                return { success: true, data: data.faq_source }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to update content' }
            }
        },

        async updatePriority(faqSourceId, priority) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                await $fetch(`${config.public.apiBase}/api/faq/${faqSourceId}/priority`, {
                    method: 'PUT',
                    body: { priority },
                    headers: { Authorization: `Bearer ${token}` }
                })

                // Update local state
                const faq = this.faqSources.find(f => f.id === faqSourceId)
                if (faq) faq.priority = priority

                return { success: true }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to update priority' }
            }
        },

        async toggleActive(faqSourceId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/faq/${faqSourceId}/toggle`, {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${token}` }
                })

                // Update local state
                const faq = this.faqSources.find(f => f.id === faqSourceId)
                if (faq) faq.is_active = data.is_active

                return { success: true }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to toggle status' }
            }
        },

        async deleteFAQ(faqSourceId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            try {
                await $fetch(`${config.public.apiBase}/api/faq/${faqSourceId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                })

                // Remove from local state
                this.faqSources = this.faqSources.filter(f => f.id !== faqSourceId)

                return { success: true }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to delete FAQ' }
            }
        },

        async reprocess(faqSourceId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()

            this.processing = true

            try {
                await $fetch(`${config.public.apiBase}/api/faq/${faqSourceId}/reprocess`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                })

                return { success: true }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Failed to reprocess FAQ' }
            } finally {
                this.processing = false
            }
        },

        clearError() {
            this.error = ''
        }
    },

    getters: {
        getFAQById: (state) => (id) => {
            return state.faqSources.find(faq => faq.id === id)
        },

        activeFAQs: (state) => {
            return state.faqSources.filter(faq => faq.is_active)
        },

        completedFAQs: (state) => {
            return state.faqSources.filter(faq => faq.status === 'completed')
        }
    }
})