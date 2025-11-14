// app/stores/business/teamStore.js
import { defineStore } from 'pinia'

export const useTeamStore = defineStore('team', {
    state: () => ({
        members: [],
        availableRoles: {},
        statistics: {},
        roleDistribution: {},
        loading: false,
        error: null
    }),

    getters: {
        sortedMembers: (state) => {
            return [...state.members].sort((a, b) => {
                if (a.is_owner) return -1
                if (b.is_owner) return 1
                return new Date(b.created_at) - new Date(a.created_at)
            })
        },

        memberCount: (state) => state.members.length,

        rolesList: (state) => {
            return Object.entries(state.availableRoles).map(([name, subroles]) => ({
                name,
                label: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                subroles: subroles.map(sub => ({
                    name: sub,
                    label: sub.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                }))
            }))
        }
    },

    actions: {
        async fetchTeamMembers() {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/business/team`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                if (data.success) {
                    this.members = data.data.users
                    this.availableRoles = data.data.available_roles
                    this.statistics = data.data.statistics
                    this.roleDistribution = data.data.role_distribution
                }

                return data
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch team members'
                throw error
            } finally {
                this.loading = false
            }
        },

        async addTeamMember(memberData) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/business/team`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: memberData
                })

                if (data.success) {
                    this.members.push(data.data.user)
                }

                return data
            } catch (error) {
                this.error = error.data?.message || 'Failed to add team member'
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateTeamMember(id, memberData) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/business/team/${id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: memberData
                })

                if (data.success) {
                    const index = this.members.findIndex(m => m.id === id)
                    if (index !== -1) {
                        this.members[index] = data.data.user
                    }
                }

                return data
            } catch (error) {
                this.error = error.data?.message || 'Failed to update team member'
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateMemberRoles(id, roles) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/business/team/${id}/roles`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: { roles }
                })

                if (data.success) {
                    const index = this.members.findIndex(m => m.id === id)
                    if (index !== -1) {
                        this.members[index] = data.data.user
                    }
                }

                return data
            } catch (error) {
                this.error = error.data?.message || 'Failed to update roles'
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteTeamMember(id) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()
            const authStore = useAuthStore()

            try {
                const data = await $fetch(`${config.public.apiBase}/api/business/team/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                if (data.success) {
                    this.members = this.members.filter(m => m.id !== id)
                }

                return data
            } catch (error) {
                this.error = error.data?.message || 'Failed to delete team member'
                throw error
            } finally {
                this.loading = false
            }
        },

        clearError() {
            this.error = null
        }
    }
})