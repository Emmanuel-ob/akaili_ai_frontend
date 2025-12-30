<!-- team-members.vue -->
<template>
  <div class="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Team Members</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your team and assign roles</p>
      </div>
      <button @click="showAddModal = true"
        class="bg-[#9E4CFF] hover:bg-[#8B3DFF] text-white px-5 py-2 rounded-lg shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Team Member
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- Total Members -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Members</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ teamStore.statistics.total_users || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-[#9E4CFF] dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-9a4 4 0 11-8 0 4 4 0 018 0zm8 4a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Active Roles -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Active Roles</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ teamStore.statistics.total_roles || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Customer Reps -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Customer Reps</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ teamStore.roleDistribution.customer_rep || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="teamStore.loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9E4CFF]"></div>
    </div>

    <!-- Members List -->
    <div v-else class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
      <div class="p-4 border-b border-gray-200 dark:border-slate-800">
        <h2 class="text-lg font-semibold text-gray-700 dark:text-white">Team Members</h2>
      </div>

      <div v-if="teamStore.sortedMembers.length === 0" class="p-12 text-center">
        <svg class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-9a4 4 0 11-8 0 4 4 0 018 0zm8 4a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="mt-4 text-gray-500 dark:text-gray-400 text-lg">No team members yet</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">Add your first member to get started.</p>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-slate-800">
        <div v-for="member in teamStore.sortedMembers" :key="member.id" class="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="text-gray-900 dark:text-white font-medium text-lg">{{ member.name }}</h3>
                <span v-if="member.is_owner"
                  class="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-800/50">
                  Owner
                </span>
              </div>
              <p class="text-gray-500 dark:text-gray-400 text-sm">{{ member.email }}</p>

              <!-- Roles Display -->
              <div v-if="member.roles && Object.keys(member.roles).length > 0" class="mt-3 flex flex-wrap gap-2">
                <template v-for="(permissions, roleName) in member.roles" :key="roleName">
                  <div class="w-full">
                    <div class="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-1">{{ formatRoleName(roleName) }}</div>
                    <ul class="ml-4 text-xs text-gray-500 dark:text-gray-400 list-disc">
                      <li v-for="perm in permissions" :key="perm">
                        {{ formatRoleName(perm) }}
                      </li>
                    </ul>
                  </div>
                </template>
              </div>
              <div v-else class="mt-2">
                <span class="text-xs text-gray-400 dark:text-gray-500 italic">No roles assigned</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <button v-if="!member.is_owner" @click="openManageRoles(member)"
                class="px-3 py-1.5 text-sm rounded-lg border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                Manage Roles
              </button>
              <button v-if="!member.is_owner" @click="openEdit(member)"
                class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                Edit
              </button>
              <button v-if="!member.is_owner" @click="confirmDelete(member)"
                class="px-3 py-1.5 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Member Modal -->
    <BaseModal :show="showAddModal" @close="closeAddModal">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Team Member</h3>
      </template>
      <template #body>
        <form @submit.prevent="addMember" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input v-model="newMember.name" type="text" required
              class="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
              placeholder="Enter name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input v-model="newMember.email" type="email" required
              class="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
              placeholder="Enter email" />
          </div>

          <!-- Roles Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign Roles</label>
            <div class="space-y-3 max-h-96 overflow-y-auto border border-gray-200 dark:border-slate-700 rounded-lg p-4 bg-gray-50 dark:bg-slate-900/50">
              <div v-for="role in teamStore.rolesList" :key="role.name"
                class="border-b border-gray-200 dark:border-slate-700 pb-3 last:border-0 last:pb-0">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" v-model="newMember.roles[role.name].enabled"
                    @change="toggleRole(newMember.roles, role.name)" class="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer" />
                  <span class="font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{{ role.label }}</span>
                </label>

                <!-- Subroles -->
                <div v-if="role.subroles.length > 0 && newMember.roles[role.name].enabled" class="ml-7 mt-2 space-y-2">
                  <label v-for="subrole in role.subroles" :key="subrole.name"
                    class="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" v-model="newMember.roles[role.name].permissions[subrole.name]"
                      class="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer" />
                    <span class="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">{{ subrole.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <button type="button" @click="closeAddModal"
              class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="teamStore.loading"
              class="px-4 py-2 bg-[#9E4CFF] hover:bg-[#8B3DFF] text-white rounded-lg disabled:opacity-50 transition-colors">
              {{ teamStore.loading ? 'Adding...' : 'Add Member' }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Edit Member Modal -->
    <BaseModal :show="showEditModal" @close="closeEditModal">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Edit Team Member</h3>
      </template>
      <template #body>
        <form @submit.prevent="updateMember" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input v-model="editMember.name" type="text" required
              class="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input v-model="editMember.email" type="email" required
              class="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password (leave blank to keep current)
            </label>
            <input v-model="editMember.password" type="password"
              class="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
              placeholder="Leave blank to keep current password" />
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <button type="button" @click="closeEditModal"
              class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="teamStore.loading"
              class="px-4 py-2 bg-[#9E4CFF] hover:bg-[#8B3DFF] text-white rounded-lg disabled:opacity-50 transition-colors">
              {{ teamStore.loading ? 'Updating...' : 'Update Member' }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Manage Roles Modal -->
    <BaseModal :show="showRolesModal" @close="closeRolesModal">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Manage Roles - {{ rolesMember?.name }}</h3>
      </template>
      <template #body>
        <form @submit.prevent="updateRoles" class="space-y-4">
          <div class="space-y-3 max-h-96 overflow-y-auto border border-gray-200 dark:border-slate-700 rounded-lg p-4 bg-gray-50 dark:bg-slate-900/50">
            <div v-for="role in teamStore.rolesList" :key="role.name" class="border border-gray-200 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-800">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="editRoles[role.name].enabled" @change="toggleRole(editRoles, role.name)"
                  class="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer" />
                <span class="font-medium text-gray-800 dark:text-white">{{ role.label }}</span>
              </label>

              <!-- Subroles -->
              <div v-if="role.subroles.length > 0 && editRoles[role.name].enabled"
                class="ml-7 mt-3 space-y-2 pl-3 border-l-2 border-gray-100 dark:border-slate-700">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-bold tracking-wider">Permissions:</p>
                <label v-for="subrole in role.subroles" :key="subrole.name"
                  class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 p-1 rounded">
                  <input type="checkbox" v-model="editRoles[role.name].permissions[subrole.name]" class="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ subrole.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <button type="button" @click="closeRolesModal"
              class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="teamStore.loading"
              class="px-4 py-2 bg-[#9E4CFF] hover:bg-[#8B3DFF] text-white rounded-lg disabled:opacity-50 transition-colors">
              {{ teamStore.loading ? 'Updating...' : 'Update Roles' }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Error Toast -->
    <div v-if="teamStore.error"
      class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in">
      <span>{{ teamStore.error }}</span>
      <button @click="teamStore.clearError()" class="text-white hover:text-gray-200">
        ×
      </button>
    </div>

    <!-- Success Toast -->
    <div v-if="successMessage"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in">
      <span>{{ successMessage }}</span>
      <button @click="successMessage = ''" class="text-white hover:text-gray-200">
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useTeamStore } from '~/stores/teamStore'

definePageMeta({
  layout: 'dashboard'
})

const teamStore = useTeamStore()
const successMessage = ref('')

// Modal states
const showAddModal = ref(false)
const showEditModal = ref(false)
const showRolesModal = ref(false)


// Initialize roles structure
const initializeRoles = () => {
  const rolesObj = {}
  teamStore.rolesList.forEach(role => {
    rolesObj[role.name] = {
      enabled: false,
      permissions: {}
    }
    role.subroles.forEach(sub => {
      rolesObj[role.name].permissions[sub.name] = false
    })
  })
  return rolesObj
}

// Form data
const newMember = reactive({
  name: '',
  email: '',
  roles: initializeRoles()
})

const editMember = reactive({
  id: null,
  name: '',
  email: '',
  password: ''
})

const editRoles = reactive({})
const rolesMember = ref(null)



// Toggle role and handle subroles
const toggleRole = (rolesObj, roleName) => {
  if (!rolesObj[roleName].enabled) {
    // Disable all permissions when role is disabled
    Object.keys(rolesObj[roleName].permissions).forEach(key => {
      rolesObj[roleName].permissions[key] = false
    })
  }
}

// Format role name for display
const formatRoleName = (name) => {
  if (typeof name !== 'string') return ''
  return name
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Convert roles object to API format
const convertRolesToApiFormat = (rolesObj) => {
  const apiRoles = {}
  Object.entries(rolesObj).forEach(([roleName, roleData]) => {
    if (roleData.enabled) {
      const hasSubroles = Object.keys(roleData.permissions).length > 0
      if (hasSubroles) {
        const enabledPermissions = {}
        Object.entries(roleData.permissions).forEach(([permName, value]) => {
          if (value) {
            enabledPermissions[permName] = true
          }
        })
        if (Object.keys(enabledPermissions).length > 0) {
          apiRoles[roleName] = enabledPermissions
        }
      } else {
        apiRoles[roleName] = true
      }
    }
  })
  return apiRoles
}

// Convert API roles to form format
const convertApiRolesToFormFormat = (memberRoles) => {
  const formRoles = initializeRoles()
  if (!memberRoles) return formRoles

  Object.entries(memberRoles).forEach(([roleName, permissions]) => {
    if (formRoles[roleName]) {
      formRoles[roleName].enabled = true
      if (typeof permissions === 'object') {
        Object.entries(permissions).forEach(([permName, value]) => {
          if (formRoles[roleName].permissions[permName] !== undefined) {
            formRoles[roleName].permissions[permName] = !!value
          }
        })
      }
    }
  })
  return formRoles
}

// Modal handlers
const closeAddModal = () => {
  showAddModal.value = false
  newMember.name = ''
  newMember.email = ''
  newMember.roles = initializeRoles()
}

const closeEditModal = () => {
  showEditModal.value = false
  editMember.id = null
  editMember.name = ''
  editMember.email = ''
  editMember.password = ''
}

const closeRolesModal = () => {
  showRolesModal.value = false
  rolesMember.value = null
  Object.assign(editRoles, {})
}

const openEdit = (member) => {
  editMember.id = member.id
  editMember.name = member.name
  editMember.email = member.email
  editMember.password = ''
  showEditModal.value = true
}

const openManageRoles = (member) => {
  rolesMember.value = member
  Object.assign(editRoles, convertApiRolesToFormFormat(member.roles))
  showRolesModal.value = true
}

// CRUD operations
const addMember = async () => {
  try {
    const apiRoles = convertRolesToApiFormat(newMember.roles)
    await teamStore.addTeamMember({
      name: newMember.name,
      email: newMember.email,
      roles: apiRoles
    })
    successMessage.value = 'Team member invited successfully! They will receive an email with login credentials.'
    closeAddModal()
    setTimeout(() => { successMessage.value = '' }, 5000)
  } catch (error) {
    console.error('Failed to add member:', error)
  }
}

const updateMember = async () => {
  try {
    const data = {
      name: editMember.name,
      email: editMember.email
    }
    if (editMember.password) {
      data.password = editMember.password
    }
    await teamStore.updateTeamMember(editMember.id, data)
    successMessage.value = 'Team member updated successfully!'
    closeEditModal()
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Failed to update member:', error)
  }
}

const updateRoles = async () => {
  try {
    const apiRoles = convertRolesToApiFormat(editRoles)
    await teamStore.updateMemberRoles(rolesMember.value.id, apiRoles)
    successMessage.value = 'Roles updated successfully!'
    closeRolesModal()
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Failed to update roles:', error)
  }
}

const confirmDelete = async (member) => {
  if (!confirm(`Are you sure you want to remove ${member.name} from the team?`)) return

  try {
    await teamStore.deleteTeamMember(member.id)
    successMessage.value = 'Team member removed successfully!'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Failed to delete member:', error)
  }
}

// Initialize
onMounted(async () => {
  await teamStore.fetchTeamMembers()
  newMember.roles = initializeRoles()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>