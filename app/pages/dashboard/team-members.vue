<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Team Members</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your team and assign roles</p>
      </div>
      <button @click="showAddModal = true"
        class="bg-[#7F56D9] text-white px-5 py-2 rounded-lg shadow hover:bg-[#6C47B5] flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Team Member
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Members</p>
            <p class="text-2xl font-bold text-gray-800">{{ teamStore.statistics.total_users || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-[#7F56D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-9a4 4 0 11-8 0 4 4 0 018 0zm8 4a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Active Roles</p>
            <p class="text-2xl font-bold text-gray-800">{{ teamStore.statistics.total_roles || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Customer Reps</p>
            <p class="text-2xl font-bold text-gray-800">{{ teamStore.roleDistribution.customer_rep || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="teamStore.loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F56D9]"></div>
    </div>

    <!-- Members List -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-700">Team Members</h2>
      </div>

      <div v-if="teamStore.sortedMembers.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-9a4 4 0 11-8 0 4 4 0 018 0zm8 4a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="mt-2 text-gray-500">No team members yet. Add your first member to get started.</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div v-for="member in teamStore.sortedMembers" :key="member.id" class="p-4 hover:bg-gray-50 transition-colors">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="text-gray-900 font-medium">{{ member.name }}</h3>
                <span v-if="member.is_owner"
                  class="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 font-semibold">
                  Owner
                </span>
              </div>
              <p class="text-gray-500 text-sm">{{ member.email }}</p>

              <!-- Roles Display - FIXED: changed member.role to member.roles -->
              <div v-if="member.roles && Object.keys(member.roles).length > 0" class="mt-2 flex flex-wrap gap-2">
                <template v-for="(permissions, roleName) in member.roles" :key="roleName">
                  <div class="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                    {{ formatRoleName(roleName) }}
                  </div>
                  <template v-if="typeof permissions === 'object'">
                    <div v-for="(value, permName) in permissions" :key="permName" v-show="value"
                      class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                      {{ formatRoleName(permName) }}
                    </div>
                  </template>
                </template>
              </div>
              <div v-else class="mt-2">
                <span class="text-xs text-gray-400">No roles assigned</span>
              </div>
            </div>

            <div class="flex gap-2">
              <button v-if="!member.is_owner" @click="openManageRoles(member)"
                class="px-3 py-1.5 text-sm rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 transition">
                Manage Roles
              </button>
              <button v-if="!member.is_owner" @click="openEdit(member)"
                class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                Edit
              </button>
              <button v-if="!member.is_owner" @click="confirmDelete(member)"
                class="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
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
        <h3 class="text-lg font-semibold">Add Team Member</h3>
      </template>
      <template #body>
        <form @submit.prevent="addMember" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input v-model="newMember.name" type="text" required
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="newMember.email" type="email" required
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter email" />
          </div>

          <!-- Roles Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Assign Roles</label>
            <div class="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3">
              <div v-for="role in teamStore.rolesList" :key="role.name"
                class="border-b border-gray-100 pb-3 last:border-0">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="newMember.roles[role.name].enabled"
                    @change="toggleRole(newMember.roles, role.name)" class="w-4 h-4 text-purple-600" />
                  <span class="font-medium">{{ role.label }}</span>
                </label>

                <!-- Subroles -->
                <div v-if="role.subroles.length > 0 && newMember.roles[role.name].enabled" class="ml-6 mt-2 space-y-2">
                  <label v-for="subrole in role.subroles" :key="subrole.name"
                    class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="newMember.roles[role.name].permissions[subrole.name]"
                      class="w-4 h-4" />
                    <span class="text-sm text-gray-700">{{ subrole.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <button type="button" @click="closeAddModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" :disabled="teamStore.loading"
              class="px-4 py-2 bg-[#7F56D9] text-white rounded-lg hover:bg-[#6C47B5] disabled:opacity-50">
              {{ teamStore.loading ? 'Adding...' : 'Add Member' }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Edit Member Modal -->
    <BaseModal :show="showEditModal" @close="closeEditModal">
      <template #header>
        <h3 class="text-lg font-semibold">Edit Team Member</h3>
      </template>
      <template #body>
        <form @submit.prevent="updateMember" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input v-model="editMember.name" type="text" required
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="editMember.email" type="email" required
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              New Password (leave blank to keep current)
            </label>
            <input v-model="editMember.password" type="password"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Leave blank to keep current password" />
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <button type="button" @click="closeEditModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" :disabled="teamStore.loading"
              class="px-4 py-2 bg-[#7F56D9] text-white rounded-lg hover:bg-[#6C47B5] disabled:opacity-50">
              {{ teamStore.loading ? 'Updating...' : 'Update Member' }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Manage Roles Modal -->
    <BaseModal :show="showRolesModal" @close="closeRolesModal">
      <template #header>
        <h3 class="text-lg font-semibold">Manage Roles - {{ rolesMember?.name }}</h3>
      </template>
      <template #body>  
        <form @submit.prevent="updateRoles" class="space-y-4">
          <div class="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
            <div v-for="role in teamStore.rolesList" :key="role.name" class="border border-gray-200 rounded-lg p-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="editRoles[role.name].enabled" @change="toggleRole(editRoles, role.name)"
                  class="w-4 h-4 text-purple-600" />
                <span class="font-medium text-gray-800">{{ role.label }}</span>
              </label>

              <!-- Subroles -->
              <div v-if="role.subroles.length > 0 && editRoles[role.name].enabled"
                class="ml-6 mt-3 space-y-2 pl-3 border-l-2 border-gray-200">
                <p class="text-xs text-gray-500 mb-2">Permissions:</p>
                <label v-for="subrole in role.subroles" :key="subrole.name"
                  class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="editRoles[role.name].permissions[subrole.name]" class="w-4 h-4" />
                  <span class="text-sm text-gray-700">{{ subrole.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <button type="button" @click="closeRolesModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" :disabled="teamStore.loading"
              class="px-4 py-2 bg-[#7F56D9] text-white rounded-lg hover:bg-[#6C47B5] disabled:opacity-50">
              {{ teamStore.loading ? 'Updating...' : 'Update Roles' }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Error Toast -->
    <div v-if="teamStore.error"
      class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
      <span>{{ teamStore.error }}</span>
      <button @click="teamStore.clearError()" class="text-white hover:text-gray-200">
        ×
      </button>
    </div>

    <!-- Success Toast -->
    <div v-if="successMessage"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
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
  return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
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

// Convert API roles to form format - FIXED: changed parameter name from apiRoles to match usage
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

// FIXED: changed member.role to member.roles
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