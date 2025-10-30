// app/utils/permissions.js

/**
 * Check if user has a specific role
 * @param {Object} user - User object from auth store
 * @param {String} roleName - Role name to check
 * @returns {Boolean}
 */
export const hasRole = (user, roleName) => {
    if (!user || !user.role) return false
    return roleName in user.role
}

/**
 * Check if user has a specific permission within a role
 * @param {Object} user - User object from auth store
 * @param {String} roleName - Role name
 * @param {String} permission - Permission name
 * @returns {Boolean}
 */
export const hasPermission = (user, roleName, permission) => {
    if (!user || !user.role || !user.role[roleName]) return false

    const roleData = user.role[roleName]

    // If role has no subroles (simple boolean role)
    if (typeof roleData === 'boolean') return roleData

    // If role has subroles/permissions
    if (typeof roleData === 'object') {
        return roleData[permission] === true
    }

    return false
}

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object from auth store
 * @param {Array<String>} roles - Array of role names
 * @returns {Boolean}
 */
export const hasAnyRole = (user, roles) => {
    if (!user || !user.role) return false
    return roles.some(role => role in user.role)
}

/**
 * Check if user has all of the specified roles
 * @param {Object} user - User object from auth store
 * @param {Array<String>} roles - Array of role names
 * @returns {Boolean}
 */
export const hasAllRoles = (user, roles) => {
    if (!user || !user.role) return false
    return roles.every(role => role in user.role)
}

/**
 * Check if user is business owner
 * @param {Object} user - User object from auth store
 * @returns {Boolean}
 */
export const isOwner = (user) => {
    return user && user.is_owner === true
}

/**
 * Check if user can manage team (has admin or manager role)
 * @param {Object} user - User object from auth store
 * @returns {Boolean}
 */
export const canManageTeam = (user) => {
    if (isOwner(user)) return true
    return hasAnyRole(user, ['admin', 'manager'])
}

/**
 * Check if user can view conversations (customer rep or admin)
 * @param {Object} user - User object from auth store
 * @returns {Boolean}
 */
export const canViewConversations = (user) => {
    if (isOwner(user)) return true
    return hasPermission(user, 'customer_rep', 'view_conversations') ||
        hasRole(user, 'admin')
}

/**
 * Check if user can take over chat from AI
 * @param {Object} user - User object from auth store
 * @returns {Boolean}
 */
export const canTakeOverChat = (user) => {
    if (isOwner(user)) return true
    return hasPermission(user, 'customer_rep', 'take_over_chat')
}

/**
 * Check if user can manage databases
 * @param {Object} user - User object from auth store
 * @returns {Boolean}
 */
export const canManageDatabases = (user) => {
    if (isOwner(user)) return true
    return hasRole(user, 'data_manager') || hasRole(user, 'admin')
}

/**
 * Check if user can manage bots
 * @param {Object} user - User object from auth store
 * @returns {Boolean}
 */
export const canManageBots = (user) => {
    if (isOwner(user)) return true
    return hasRole(user, 'bot_manager') || hasRole(user, 'admin')
}

/**
 * Get all roles for a user
 * @param {Object} user - User object from auth store
 * @returns {Array<String>}
 */
export const getUserRoles = (user) => {
    if (!user || !user.role) return []
    return Object.keys(user.role)
}

/**
 * Get all permissions for a specific role
 * @param {Object} user - User object from auth store
 * @param {String} roleName - Role name
 * @returns {Array<String>}
 */
export const getRolePermissions = (user, roleName) => {
    if (!user || !user.role || !user.role[roleName]) return []

    const roleData = user.role[roleName]

    if (typeof roleData === 'object') {
        return Object.keys(roleData).filter(key => roleData[key] === true)
    }

    return []
}

/**
 * Format role name for display
 * @param {String} roleName - Role name in snake_case
 * @returns {String} - Formatted role name
 */
export const formatRoleName = (roleName) => {
    return roleName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

// Example usage in components:
/*
<script setup>
import { hasRole, hasPermission, canManageTeam } from '~/utils/permissions'
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Check if user has admin role
const isAdmin = computed(() => hasRole(user.value, 'admin'))

// Check if user can view conversations
const canView = computed(() => 
  hasPermission(user.value, 'customer_rep', 'view_conversations')
)

// Check if user can manage team
const canManage = computed(() => canManageTeam(user.value))
</script>

<template>
  <div v-if="isAdmin">Admin content</div>
  <div v-if="canView">Conversation list</div>
  <button v-if="canManage">Manage Team</button>
</template>
*/