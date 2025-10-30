// app/composables/usePermissions.js

import { computed } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import {
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    isOwner,
    canManageTeam,
    canViewConversations,
    canTakeOverChat,
    canManageDatabases,
    canManageBots,
    getUserRoles,
    getRolePermissions,
    formatRoleName
} from '~/utils/permissions'

/**
 * Composable for checking user permissions throughout the app
 * @returns {Object} Permission checking utilities
 */
export const usePermissions = () => {
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)

    return {
        // User data
        user,

        // Basic checks
        isOwner: computed(() => isOwner(user.value)),
        isAuthenticated: computed(() => authStore.isLoggedIn),

        // Role checks
        hasRole: (roleName) => hasRole(user.value, roleName),
        hasPermission: (roleName, permission) => hasPermission(user.value, roleName, permission),
        hasAnyRole: (roles) => hasAnyRole(user.value, roles),
        hasAllRoles: (roles) => hasAllRoles(user.value, roles),

        // Specific permission checks
        canManageTeam: computed(() => canManageTeam(user.value)),
        canViewConversations: computed(() => canViewConversations(user.value)),
        canTakeOverChat: computed(() => canTakeOverChat(user.value)),
        canManageDatabases: computed(() => canManageDatabases(user.value)),
        canManageBots: computed(() => canManageBots(user.value)),

        // Data retrieval
        getUserRoles: computed(() => getUserRoles(user.value)),
        getRolePermissions: (roleName) => getRolePermissions(user.value, roleName),

        // Utilities
        formatRoleName,

        // Computed booleans for common roles
        isAdmin: computed(() => hasRole(user.value, 'admin')),
        isManager: computed(() => hasRole(user.value, 'manager')),
        isCustomerRep: computed(() => hasRole(user.value, 'customer_rep')),
        isDataManager: computed(() => hasRole(user.value, 'data_manager')),
        isBotManager: computed(() => hasRole(user.value, 'bot_manager')),
        isViewer: computed(() => hasRole(user.value, 'viewer')),
    }
}

// Example usage in components:
/*
<script setup>
import { usePermissions } from '~/composables/usePermissions'

const {
  user,
  isOwner,
  isAdmin,
  isCustomerRep,
  canManageTeam,
  canViewConversations,
  hasPermission,
  getUserRoles
} = usePermissions()

// Use in component logic
const showAdminPanel = computed(() => isOwner.value || isAdmin.value)
const canEditMember = (member) => {
  return canManageTeam.value && !member.is_owner
}
</script>

<template>
  <div>
    <!-- Show content based on permissions -->
    <div v-if="isOwner">
      Owner Dashboard
    </div>
    
    <div v-if="canManageTeam">
      <button>Add Team Member</button>
    </div>
    
    <div v-if="canViewConversations">
      <ConversationsList />
    </div>
    
    <div v-if="isCustomerRep">
      <LiveChatPanel />
    </div>
    
    <!-- Show user's roles -->
    <div class="user-roles">
      <h3>Your Roles:</h3>
      <span v-for="role in getUserRoles" :key="role">
        {{ formatRoleName(role) }}
      </span>
    </div>
  </div>
</template>
*/